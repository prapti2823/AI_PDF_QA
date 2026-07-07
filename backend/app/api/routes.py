"""
api/routes.py
─────────────
Defines all API endpoints for the application.

Endpoints:
  GET  /          → Health check
  POST /upload    → Upload and process a PDF
  POST /ask       → Ask a question about the uploaded PDF

Session management:
  After a PDF is uploaded, a unique session_id is returned.
  The processed vector store is kept in memory (in the SESSION_STORE dict),
  keyed by session_id. The frontend sends this session_id with every question.
"""

import logging
import os
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.config import settings
from app.models.schemas import AnswerResponse, HealthResponse, QuestionRequest, UploadResponse
from app.services.embedding_service import build_vector_store, retrieve_relevant_chunks
from app.services.pdf_service import extract_text_from_pdf, split_text_into_chunks
from app.services.qa_service import generate_answer
from app.utils.helpers import (
    delete_file_safely,
    ensure_upload_dir,
    generate_session_id,
    is_valid_pdf,
    is_within_size_limit,
)

logger = logging.getLogger(__name__)
router = APIRouter()

# ── In-memory session store ────────────────────────────────────────────────
# Maps session_id → FAISS vector store for that PDF session.
# In production you would use Redis or a database instead.
SESSION_STORE: dict = {}


# ── Health Check ───────────────────────────────────────────────────────────

@router.get("/", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Simple health check to confirm the API is running."""
    return HealthResponse(status="ok", message="AI PDF QA API is running.")


# ── Upload PDF ─────────────────────────────────────────────────────────────

@router.post("/upload", response_model=UploadResponse, tags=["PDF"])
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file, extract its text, build a vector store, and return a session_id.

    Steps:
      1. Validate file type and size
      2. Save file temporarily to disk
      3. Extract text with PyPDF2
      4. Split text into chunks
      5. Build FAISS vector store from chunks
      6. Store vector store in memory under a new session_id
      7. Delete the temporary file
    """
    # ── Step 1: Validate file type ─────────────────────────────────────
    if not is_valid_pdf(file.filename, file.content_type):
        logger.warning("Invalid file upload attempt: %s (%s)", file.filename, file.content_type)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are accepted. Please upload a .pdf file.",
        )

    # ── Step 2: Read file bytes and validate size ──────────────────────
    file_bytes = await file.read()
    if not is_within_size_limit(len(file_bytes), settings.max_file_size_mb):
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the maximum allowed size of {settings.max_file_size_mb} MB.",
        )

    # ── Step 3: Save to disk temporarily ──────────────────────────────
    upload_dir = ensure_upload_dir(settings.upload_dir)
    session_id = generate_session_id()
    # Use session_id in filename to avoid collisions from concurrent uploads
    temp_path = upload_dir / f"{session_id}_{file.filename}"

    try:
        with open(temp_path, "wb") as f:
            f.write(file_bytes)
        logger.info("Saved uploaded file: %s", temp_path)

        # ── Step 4: Extract text ───────────────────────────────────────
        full_text, page_count = extract_text_from_pdf(str(temp_path))

        # ── Step 5: Split into chunks ──────────────────────────────────
        chunks = split_text_into_chunks(full_text)
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract any usable text from the PDF.",
            )

        # ── Step 6: Build and store vector store ───────────────────────
        vector_store = build_vector_store(chunks)
        SESSION_STORE[session_id] = vector_store
        logger.info("Session created: %s | pages=%d | chunks=%d", session_id, page_count, len(chunks))

    except HTTPException:
        raise  # pass through our own HTTP errors

    except (ValueError, RuntimeError) as exc:
        logger.error("PDF processing error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )

    except Exception as exc:
        logger.exception("Unexpected error during PDF upload: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the PDF.",
        )

    finally:
        # ── Step 7: Always clean up the temp file ─────────────────────
        delete_file_safely(str(temp_path))

    return UploadResponse(
        message="PDF uploaded and processed successfully.",
        session_id=session_id,
        filename=file.filename,
        pages=page_count,
        chunks=len(chunks),
    )


# ── Ask Question ───────────────────────────────────────────────────────────

@router.post("/ask", response_model=AnswerResponse, tags=["QA"])
def ask_question(request: QuestionRequest):
    """
    Answer a question about the previously uploaded PDF.

    Steps:
      1. Validate that the session_id exists
      2. Retrieve the most relevant chunks from the vector store
      3. Generate an answer using the QA model
      4. Return the answer
    """
    # ── Step 1: Validate session ───────────────────────────────────────
    vector_store = SESSION_STORE.get(request.session_id)
    if vector_store is None:
        logger.warning("Question asked for unknown session: %s", request.session_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found. Please upload a PDF first.",
        )

    try:
        # ── Step 2: Retrieve relevant chunks ──────────────────────────
        relevant_chunks = retrieve_relevant_chunks(vector_store, request.question)

        # ── Step 3: Generate answer ────────────────────────────────────
        answer = generate_answer(request.question, relevant_chunks)
        logger.info("Answered question for session %s: '%s'", request.session_id, request.question)

    except Exception as exc:
        logger.exception("Error generating answer: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the answer. Please try again.",
        )

    return AnswerResponse(
        question=request.question,
        answer=answer,
        session_id=request.session_id,
    )

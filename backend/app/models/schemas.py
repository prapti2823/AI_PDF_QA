"""
models/schemas.py
─────────────────
Pydantic models define the shape of request and response data.
FastAPI uses these for automatic validation and OpenAPI documentation.
"""

from pydantic import BaseModel, Field


# ── Request Models ─────────────────────────────────────────────────────────

class QuestionRequest(BaseModel):
    """Body sent by the frontend when the user asks a question."""
    question: str = Field(..., min_length=1, description="The question to ask about the PDF")
    session_id: str = Field(..., description="Session ID returned after PDF upload")


# ── Response Models ────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    """Returned after a successful PDF upload and processing."""
    message: str
    session_id: str          # Unique ID used to link questions to this PDF
    filename: str
    pages: int               # Number of pages extracted
    chunks: int              # Number of text chunks created


class AnswerResponse(BaseModel):
    """Returned after answering a question."""
    question: str
    answer: str
    session_id: str


class HealthResponse(BaseModel):
    """Simple health check response."""
    status: str
    message: str

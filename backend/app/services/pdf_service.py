"""
services/pdf_service.py
───────────────────────
Responsible for:
  1. Reading a PDF file from disk using PyPDF2
  2. Extracting and cleaning the raw text
  3. Splitting the text into overlapping chunks using LangChain

Why chunks?
  Large language models and embedding models have a token/character limit.
  Splitting the document into smaller, overlapping pieces lets us:
    - Embed each piece independently
    - Retrieve only the most relevant pieces for a given question
"""

import logging
from pathlib import Path

import PyPDF2
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings
from app.utils.helpers import clean_text

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_path: str) -> tuple[str, int]:
    """
    Open a PDF file and extract all text from every page.

    Returns:
        (full_text, page_count) — the combined text and number of pages.

    Raises:
        ValueError: if the PDF is empty or no text could be extracted.
        RuntimeError: if the file cannot be read (corrupted, wrong format, etc.)
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF file not found: {file_path}")

    try:
        with open(path, "rb") as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            page_count = len(reader.pages)

            if page_count == 0:
                raise ValueError("The uploaded PDF has no pages.")

            logger.info("Extracting text from %d page(s)…", page_count)

            pages_text: list[str] = []
            for page_num, page in enumerate(reader.pages, start=1):
                try:
                    page_text = page.extract_text() or ""
                    pages_text.append(page_text)
                except Exception as exc:
                    # Log the bad page but continue processing the rest
                    logger.warning("Could not extract text from page %d: %s", page_num, exc)

            full_text = "\n\n".join(pages_text)
            full_text = clean_text(full_text)

            if not full_text.strip():
                raise ValueError(
                    "No readable text found in the PDF. "
                    "The file may be scanned (image-only) or encrypted."
                )

            logger.info("Successfully extracted %d characters from PDF.", len(full_text))
            return full_text, page_count

    except (PyPDF2.errors.PdfReadError, Exception) as exc:
        # Catch PyPDF2-specific errors (corrupted file, wrong password, etc.)
        if isinstance(exc, (ValueError, FileNotFoundError)):
            raise  # re-raise our own errors as-is
        raise RuntimeError(f"Failed to read PDF: {exc}") from exc


def split_text_into_chunks(text: str) -> list[str]:
    """
    Split a long text into smaller, overlapping chunks.

    RecursiveCharacterTextSplitter tries to split on paragraph breaks first,
    then sentences, then words — keeping chunks as semantically coherent as possible.

    chunk_size    — maximum characters per chunk
    chunk_overlap — how many characters the next chunk shares with the previous one
                    (overlap helps avoid losing context at chunk boundaries)
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        # Try these separators in order (most preferred → least preferred)
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks = splitter.split_text(text)

    # Filter out any chunks that are just whitespace
    chunks = [c.strip() for c in chunks if c.strip()]

    logger.info("Split text into %d chunk(s) (size=%d, overlap=%d).",
                len(chunks), settings.chunk_size, settings.chunk_overlap)
    return chunks

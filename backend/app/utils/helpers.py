"""
utils/helpers.py
────────────────
Utility / helper functions used across the application.
Keeping these here avoids code duplication and makes each service cleaner.
"""

import re
import uuid
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def generate_session_id() -> str:
    """Generate a unique session ID for each uploaded PDF."""
    return str(uuid.uuid4())


def is_valid_pdf(filename: str, content_type: str) -> bool:
    """
    Validate that the uploaded file is a PDF.
    We check both the file extension and the MIME type for safety.
    """
    has_pdf_extension = filename.lower().endswith(".pdf")
    has_pdf_mime = content_type in ("application/pdf", "application/x-pdf")
    return has_pdf_extension and has_pdf_mime


def is_within_size_limit(file_size_bytes: int, max_mb: int) -> bool:
    """Check that the uploaded file does not exceed the configured size limit."""
    max_bytes = max_mb * 1024 * 1024
    return file_size_bytes <= max_bytes


def clean_text(text: str) -> str:
    """
    Clean raw text extracted from a PDF.

    PDFs often contain:
    - Multiple consecutive whitespace characters
    - Stray newlines in the middle of sentences
    - Non-printable / control characters

    This function normalises all of that into clean, readable text.
    """
    if not text:
        return ""

    # Replace non-printable control characters (except newline/tab) with a space
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", " ", text)

    # Collapse multiple spaces into one
    text = re.sub(r" {2,}", " ", text)

    # Collapse more than two consecutive newlines into two (preserve paragraphs)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def ensure_upload_dir(upload_dir: str) -> Path:
    """Create the uploads directory if it does not already exist."""
    path = Path(upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def delete_file_safely(file_path: str) -> None:
    """Delete a file without raising an error if it does not exist."""
    try:
        Path(file_path).unlink(missing_ok=True)
        logger.info("Deleted temporary file: %s", file_path)
    except Exception as exc:
        logger.warning("Could not delete file %s: %s", file_path, exc)

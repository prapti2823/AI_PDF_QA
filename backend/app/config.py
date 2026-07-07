"""
config.py
─────────
Central configuration for the application.
All settings are loaded from the .env file (or environment variables).
Using pydantic-settings makes it easy to validate and access config values.
"""

from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # ── OpenAI (optional) ──────────────────────────────────────────────
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")

    # ── Hugging Face (optional) ────────────────────────────────────────
    huggingface_api_key: str = Field(default="", alias="HUGGINGFACE_API_KEY")

    # ── Models ────────────────────────────────────────────────────────
    # Embedding model: converts text chunks into numerical vectors
    embedding_model: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        alias="EMBEDDING_MODEL",
    )
    # QA model: reads a context passage and extracts the answer
    qa_model: str = Field(
        default="deepset/roberta-base-squad2",
        alias="QA_MODEL",
    )

    # ── Text splitting ─────────────────────────────────────────────────
    chunk_size: int = Field(default=500, alias="CHUNK_SIZE")
    chunk_overlap: int = Field(default=50, alias="CHUNK_OVERLAP")

    # ── File upload ────────────────────────────────────────────────────
    upload_dir: str = Field(default="uploads", alias="UPLOAD_DIR")
    max_file_size_mb: int = Field(default=20, alias="MAX_FILE_SIZE_MB")

    # ── Server ────────────────────────────────────────────────────────
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")

    class Config:
        env_file = ".env"
        populate_by_name = True  # allow both field name and alias


# Single shared instance — import this everywhere
settings = Settings()

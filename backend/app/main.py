"""
main.py
───────
Application entry point.

Responsibilities:
  - Create and configure the FastAPI app instance
  - Set up structured logging
  - Configure CORS (so the React frontend can call this API)
  - Register all API routes
  - Pre-load the embedding model at startup (avoids a slow first request)
  - Run the Uvicorn server when executed directly
"""

import logging
import sys
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings
from app.services.embedding_service import get_embedding_model
from app.services.qa_service import _get_hf_pipeline


# ── Logging setup ──────────────────────────────────────────────────────────
# Configure once here so every module that calls logging.getLogger() inherits
# the same format and level.
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown logic) ───────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Code inside the 'try' block runs at startup.
    Code after 'yield' runs at shutdown.

    We pre-load the embedding model here so the first /upload request
    is not slow due to model loading.
    """
    logger.info("Starting AI PDF QA API…")
    logger.info("Pre-loading embedding model at startup…")
    get_embedding_model()
    if not settings.openai_api_key:
        logger.info("Pre-loading Hugging Face QA model at startup…")
        _get_hf_pipeline()
    logger.info("Startup complete. API is ready.")
    yield
    logger.info("Shutting down AI PDF QA API.")


# ── FastAPI app instance ───────────────────────────────────────────────────
app = FastAPI(
    title="AI PDF Question Answering API",
    description=(
        "Upload a PDF document and ask natural language questions about its content. "
        "Powered by LangChain, FAISS, and Hugging Face Transformers."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",       # Swagger UI  → http://localhost:8000/docs
    redoc_url="/redoc",     # ReDoc UI    → http://localhost:8000/redoc
)


# ── CORS middleware ────────────────────────────────────────────────────────
# Allows the React frontend (running on a different port) to call this API.
# In production, replace "*" with your actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # e.g. ["https://yourapp.com"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Register routes ────────────────────────────────────────────────────────
app.include_router(router)


# ── Run directly ───────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,    # auto-reload on code changes (development only)
        log_level="info",
    )

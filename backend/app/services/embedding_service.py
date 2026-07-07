"""
services/embedding_service.py
──────────────────────────────
Responsible for:
  1. Loading the Sentence Transformer embedding model (once, at startup)
  2. Converting text chunks into vector embeddings
  3. Storing those embeddings in a FAISS index (in-memory)
  4. Performing similarity search to find the most relevant chunks

How it works (simple explanation):
  - Each text chunk is converted into a list of numbers (a "vector") that
    captures its meaning.
  - FAISS stores all these vectors in an index.
  - When a question arrives, it is also converted to a vector.
  - FAISS finds the stored vectors that are closest (most similar) to the
    question vector — those are the most relevant chunks.
"""

import logging
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

from app.config import settings

logger = logging.getLogger(__name__)

# ── Module-level cache ─────────────────────────────────────────────────────
# The embedding model is loaded once and reused for every request.
# Loading it on every request would be very slow (~seconds each time).
_embedding_model: HuggingFaceEmbeddings | None = None


def get_embedding_model() -> HuggingFaceEmbeddings:
    """
    Return the shared embedding model instance.
    Loads it from Hugging Face on the first call, then caches it.
    """
    global _embedding_model
    if _embedding_model is None:
        logger.info("Loading embedding model: %s", settings.embedding_model)
        _embedding_model = HuggingFaceEmbeddings(
            model_name=settings.embedding_model,
            # Run on CPU — change to "cuda" if a GPU is available
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
        logger.info("Embedding model loaded successfully.")
    return _embedding_model


def build_vector_store(chunks: list[str]) -> FAISS:
    """
    Convert text chunks into embeddings and store them in a FAISS index.

    Args:
        chunks: List of text strings (from pdf_service.split_text_into_chunks)

    Returns:
        A FAISS vector store ready for similarity search.
    """
    if not chunks:
        raise ValueError("Cannot build a vector store from an empty list of chunks.")

    # Wrap each chunk in a LangChain Document object
    # (FAISS.from_documents expects Document objects)
    documents = [Document(page_content=chunk) for chunk in chunks]

    logger.info("Building FAISS vector store from %d chunk(s)…", len(chunks))
    embeddings = get_embedding_model()

    # This call:
    #   1. Embeds every document chunk
    #   2. Creates an in-memory FAISS index
    #   3. Adds all vectors to the index
    vector_store = FAISS.from_documents(documents, embeddings)

    logger.info("FAISS vector store built successfully.")
    return vector_store


def retrieve_relevant_chunks(vector_store: FAISS, question: str, top_k: int = 4) -> list[str]:
    """
    Find the top-k most relevant text chunks for a given question.

    Args:
        vector_store: The FAISS index built from the uploaded PDF.
        question:     The user's question.
        top_k:        How many chunks to retrieve (more = more context, but slower).

    Returns:
        A list of text strings, ordered by relevance (most relevant first).
    """
    logger.info("Retrieving top-%d relevant chunks for question: '%s'", top_k, question)

    # similarity_search embeds the question and finds the nearest vectors
    results: list[Document] = vector_store.similarity_search(question, k=top_k)

    chunks = [doc.page_content for doc in results]
    logger.info("Retrieved %d relevant chunk(s).", len(chunks))
    return chunks

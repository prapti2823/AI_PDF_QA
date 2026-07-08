"""
services/qa_service.py
──────────────────────
Responsible for generating an answer to the user's question.

Strategy (in order of preference):
  1. If OPENAI_API_KEY is set → use OpenAI's GPT model via LangChain
     (better quality, requires a paid API key)
  2. Otherwise → use a local Hugging Face extractive QA pipeline
     (free, runs on CPU, slightly lower quality)

Extractive QA (Hugging Face default):
  The model reads the retrieved context and *extracts* a span of text
  that best answers the question. It does not generate new sentences —
  it finds the answer within the provided text.
"""

import logging
from transformers import pipeline

from app.config import settings

logger = logging.getLogger(__name__)

_HF_MODEL = "google/flan-t5-base"

# ── Module-level cache ─────────────────────────────────────────────────────
_qa_pipeline = None  # Hugging Face pipeline (loaded once)


def _get_hf_pipeline():
    """Load and cache the Hugging Face text2text pipeline."""
    global _qa_pipeline
    if _qa_pipeline is None:
        logger.info("Loading Hugging Face QA model: %s", _HF_MODEL)
        _qa_pipeline = pipeline(
            "text2text-generation",
            model=_HF_MODEL,
            tokenizer=_HF_MODEL,
            max_new_tokens=256,
        )
        logger.info("Hugging Face QA model loaded successfully.")
    return _qa_pipeline


def _answer_with_openai(question: str, context: str) -> str:
    """
    Use OpenAI's chat completion API to answer the question.
    Requires OPENAI_API_KEY to be set in .env.
    """
    # Import here so the app doesn't crash if openai is not installed
    try:
        from langchain_openai import ChatOpenAI
        from langchain.schema import HumanMessage, SystemMessage
    except ImportError:
        raise RuntimeError(
            "langchain-openai is not installed. "
            "Run: pip install langchain-openai"
        )

    logger.info("Using OpenAI to answer the question.")
    llm = ChatOpenAI(
        model="gpt-3.5-turbo",
        temperature=0,                          # deterministic answers
        openai_api_key=settings.openai_api_key,
    )

    messages = [
        SystemMessage(content=(
            "You are a helpful assistant. Answer the user's question "
            "using ONLY the context provided below. "
            "If the answer is not in the context, say: "
            "'I could not find the answer in the provided document.'"
        )),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {question}"),
    ]

    response = llm.invoke(messages)
    return response.content.strip()


def _answer_with_huggingface(question: str, context: str) -> str:
    """
    Use a local Hugging Face generative model to answer the question.
    No API key required — runs entirely on the local machine.
    """
    logger.info("Using Hugging Face pipeline to answer the question.")
    qa = _get_hf_pipeline()

    prompt = (
        f"Answer the question based on the context below.\n\n"
        f"Context: {context}\n\n"
        f"Question: {question}\n\n"
        f"Answer:"
    )

    result = qa(prompt)
    answer = result[0].get("generated_text", "").strip()

    if not answer:
        return "I could not find an answer in the provided document."

    return answer


def generate_answer(question: str, context_chunks: list[str]) -> str:
    """
    Main entry point for answer generation.

    Args:
        question:       The user's question.
        context_chunks: Relevant text chunks retrieved from the vector store.

    Returns:
        A string containing the answer.
    """
    if not context_chunks:
        return "No relevant content was found in the document to answer your question."

    # Combine the retrieved chunks into a single context string
    # The separator helps the model distinguish between chunks
    context = "\n\n---\n\n".join(context_chunks)

    # Choose the QA backend based on available API keys
    if settings.openai_api_key:
        return _answer_with_openai(question, context)
    else:
        return _answer_with_huggingface(question, context)

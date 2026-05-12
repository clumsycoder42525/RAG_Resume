import google.generativeai as genai
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            logger.info("Gemini Embedding service initialized.")
        else:
            logger.error("GEMINI_API_KEY not found for embeddings.")

    def encode(self, sentences: list[str], task_type: str = "retrieval_document"):
        try:
            # Using Gemini's text-embedding-004 model
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=sentences,
                task_type=task_type
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Gemini Embedding error: {str(e)}")
            # Fallback for empty/error states
            dim = 768 # text-embedding-004 dimension
            return [[0.0] * dim for _ in sentences]

embedding_service = EmbeddingService()

from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    @property
    def model(self):
        if self._model is None:
            # Lazy import to speed up server startup and avoid RAM issues on Render
            import torch
            from sentence_transformers import SentenceTransformer
            
            logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL_NAME}")
            device = "cpu"
            self._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME, device=device)
            logger.info("Embedding model loaded successfully.")
        return self._model

    def encode(self, sentences: list[str]):
        return self.model.encode(sentences).tolist()

embedding_service = EmbeddingService()

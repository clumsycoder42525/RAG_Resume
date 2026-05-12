from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multi-Source RAG SaaS"
    API_V1_STR: str = "/api/v1"
    
    # AI Keys
    GROQ_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Vector DB
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_db"
    
    # RAG Settings
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    
    # Security
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "https://your-frontend.vercel.app"]

    class Config:
        env_file = ".env"

settings = Settings()

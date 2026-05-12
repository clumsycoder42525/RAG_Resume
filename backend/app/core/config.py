from pydantic_settings import BaseSettings
from typing import Optional, Union
from pydantic import field_validator

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
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://rag-resume-liard.vercel.app"
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        env_file = ".env"

settings = Settings()

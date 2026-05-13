import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings
from app.services.embeddings import embedding_service
import uuid

class VectorStoreService:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIRECTORY,
            settings=ChromaSettings(allow_reset=True)
        )

    def get_collection(self, collection_name: str):
        try:
            return self.client.get_or_create_collection(
                name=collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            if "dimension" in str(e).lower() or "invalidargumenterror" in str(e).lower():
                import logging
                logger = logging.getLogger(__name__)
                logger.warning(f"Dimension mismatch detected for {collection_name}. Recreating collection...")
                try:
                    self.client.delete_collection(name=collection_name)
                    return self.client.get_or_create_collection(
                        name=collection_name,
                        metadata={"hnsw:space": "cosine"}
                    )
                except Exception as ex:
                    logger.error(f"Failed to recreate collection: {str(ex)}")
                    raise e
            raise e

    def add_documents(self, collection_name: str, texts: list[str], metadatas: list[dict] = None):
        collection = self.get_collection(collection_name)
        metadatas = metadatas or [{} for _ in texts]
        
        # Batching to handle Gemini/Chroma limits and save RAM
        batch_size = 20 
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i + batch_size]
            batch_metadatas = metadatas[i:i + batch_size]
            
            embeddings = embedding_service.encode(batch_texts)
            ids = [str(uuid.uuid4()) for _ in batch_texts]
            
            collection.add(
                documents=batch_texts,
                embeddings=embeddings,
                metadatas=batch_metadatas,
                ids=ids
            )

    def query(self, collection_name: str, query_text: str, n_results: int = 5):
        collection = self.get_collection(collection_name)
        query_embedding = embedding_service.encode([query_text], task_type="retrieval_query")[0]
        
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return results

    def list_sources(self, collection_name: str):
        collection = self.get_collection(collection_name)
        results = collection.get(include=['metadatas'])
        if not results or not results['metadatas']:
            return []
        
        # Extract unique sources
        sources = set()
        for meta in results['metadatas']:
            if meta and 'source' in meta:
                sources.add(meta['source'])
        
        return list(sources)

    def delete_by_source(self, collection_name: str, source_name: str):
        collection = self.get_collection(collection_name)
        collection.delete(where={"source": source_name})
        return True

vector_store_service = VectorStoreService()

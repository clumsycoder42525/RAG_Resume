from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.vectorstore import vector_store_service
from app.services.llm import llm_service
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatRequest(BaseModel):
    bot_id: str
    message: str
    history: List[Dict] = []
    provider: str = "groq"

@router.post("/")
async def chat(request: ChatRequest):
    try:
        # 1. Retrieve context from Vector Store
        context = ""
        sources = []
        try:
            results = vector_store_service.query(
                collection_name=f"bot_{request.bot_id}",
                query_text=request.message,
                n_results=3
            )
            
            if results and 'documents' in results and results['documents'] and results['documents'][0]:
                context = "\n".join(results['documents'][0])
                sources = results['metadatas'][0] if 'metadatas' in results and results['metadatas'] else []
                logger.info(f"Retrieved {len(results['documents'][0])} chunks for context.")
            else:
                logger.warning("No relevant documents found in vector store.")
        except Exception as e:
            logger.error(f"Vector search failed: {str(e)}")
            # Continue without context if search fails
        
        # 2. Prepare LLM Prompt
        system_prompt = f"""You are a helpful AI Knowledge Assistant. 
        Use the provided CONTEXT to answer the user's question accurately.
        If the CONTEXT doesn't contain the answer, use your general knowledge but mention that the specific information was not found in the uploaded documents.
        
        CONTEXT:
        {context if context else "No specific documents found for this query."}
        """
        
        # Sanitize history to only include 'role' and 'content' (fixes Groq 400 error)
        sanitized_history = []
        for msg in request.history[-5:]:
            if "role" in msg and "content" in msg:
                sanitized_history.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(sanitized_history)
        messages.append({"role": "user", "content": request.message})
        
        # 3. Get LLM response
        response = await llm_service.chat_completion(messages, provider=request.provider)
        
        # Check if response is an error string
        if isinstance(response, str) and response.startswith("Error:"):
            raise HTTPException(status_code=500, detail=response)
        
        return {
            "answer": response,
            "sources": sources
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

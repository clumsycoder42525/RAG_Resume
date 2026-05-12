import groq
import google.generativeai as genai
from app.core.config import settings
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.groq_client = None
        try:
            if settings.GROQ_API_KEY:
                self.groq_client = groq.Groq(api_key=settings.GROQ_API_KEY)
                logger.info("Groq client initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Groq: {str(e)}")
            
        try:
            if settings.GEMINI_API_KEY:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel('gemini-pro')
                logger.info("Gemini client initialized.")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {str(e)}")

    async def chat_completion(self, messages: List[Dict], provider: str = "groq"):
        try:
            if provider == "groq":
                if not self.groq_client:
                    return "Error: Groq API key not configured."
                
                response = self.groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    stream=False
                )
                return response.choices[0].message.content
            
            elif provider == "gemini":
                if not settings.GEMINI_API_KEY:
                    return "Error: Gemini API key not configured."
                
                # Convert messages to Gemini format (simplified)
                prompt = ""
                for m in messages:
                    role = "Assistant" if m['role'] == 'assistant' else "User"
                    if m['role'] == 'system': role = "System"
                    prompt += f"{role}: {m['content']}\n"
                
                response = self.gemini_model.generate_content(prompt)
                
                # Safety check for Gemini
                if not response.parts:
                    return "Error: AI response was blocked by safety filters. Please rephrase."
                
                return response.text
            
            return f"Error: Unknown provider '{provider}'"
            
        except Exception as e:
            logger.error(f"LLM Error ({provider}): {str(e)}")
            return f"Error during AI synthesis: {str(e)}"

llm_service = LLMService()

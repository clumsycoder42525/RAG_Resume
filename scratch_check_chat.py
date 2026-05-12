import asyncio
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.llm import llm_service
from app.services.vectorstore import vector_store_service

async def test_chat():
    print("--- Diagnostic Start ---")
    
    # 1. Test LLM Initialization
    print(f"Checking Groq Client: {'Active' if llm_service.groq_client else 'Inactive'}")
    
    # 2. Try a simple chat completion
    try:
        print("Testing LLM Completion (Groq)...")
        messages = [{"role": "user", "content": "Hello, respond with 'System Online'"}]
        response = await llm_service.chat_completion(messages, provider="groq")
        print(f"LLM Response: {response}")
    except Exception as e:
        print(f"LLM Error (Groq): {str(e)}")
        import traceback
        traceback.print_exc()

    # 3. Try Gemini
    try:
        print("\nTesting LLM Completion (Gemini)...")
        response = await llm_service.chat_completion(messages, provider="gemini")
        print(f"LLM Response: {response}")
    except Exception as e:
        print(f"LLM Error (Gemini): {str(e)}")

    print("--- Diagnostic End ---")

if __name__ == "__main__":
    asyncio.run(test_chat())

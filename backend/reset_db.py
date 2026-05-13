import chromadb
from chromadb.config import Settings
import os
import shutil

# Configuration
CHROMA_PATH = "./chroma_db"

def reset_database():
    print(f"Checking for existing database at {CHROMA_PATH}...")
    
    if os.path.exists(CHROMA_PATH):
        try:
            # Option 1: Clean reset via client (if possible)
            client = chromadb.PersistentClient(path=CHROMA_PATH)
            print("Connected to Chroma. Attempting reset...")
            client.reset()
            print("Database reset successfully.")
        except Exception as e:
            print(f"Client reset failed: {e}")
            print("Falling back to manual directory deletion...")
            
            # Option 2: Hard delete the directory (Safe if DB is not locked)
            try:
                shutil.rmtree(CHROMA_PATH)
                print(f"Deleted directory {CHROMA_PATH} successfully.")
            except Exception as ex:
                print(f"Error deleting directory: {ex}")
                print("MANUAL ACTION REQUIRED: Delete the 'chroma_db' folder on your server manually.")
    else:
        print("No database found to reset.")

if __name__ == "__main__":
    confirm = input("This will DELETE ALL your uploaded documents and chat history in the vector store. Type 'yes' to proceed: ")
    if confirm.lower() == 'yes':
        reset_database()
        print("\nSUCCESS: Database cleared. You can now re-upload documents with the new Gemini embeddings (768 dimensions).")
    else:
        print("Reset cancelled.")

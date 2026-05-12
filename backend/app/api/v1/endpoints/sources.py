from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.processor import content_processor
from app.services.vectorstore import vector_store_service
from app.services.crawler import WebCrawler
import gc

router = APIRouter()

@router.post("/upload-pdf")
async def upload_pdf(bot_id: str = Form(...), file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        content = await file.read()
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Processing PDF: {file.filename}, size: {len(content)} bytes")
        
        text = content_processor.extract_text_from_pdf(content)
        chunks = content_processor.chunk_text(text)
        logger.info(f"Extracted {len(text)} characters, created {len(chunks)} chunks.")
        
        # Add to vector store (collection per bot)
        vector_store_service.add_documents(
            collection_name=f"bot_{bot_id}",
            texts=chunks,
            metadatas=[{"source": file.filename} for _ in chunks]
        )
        logger.info("Successfully added documents to vector store.")
        
        num_chunks = len(chunks)
        
        # Explicit garbage collection to free RAM
        del text
        del chunks
        gc.collect()
        
        return {"message": f"Successfully processed {file.filename}", "chunks": num_chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest-url")
async def ingest_url(bot_id: str = Form(...), url: str = Form(...)):
    try:
        crawler = WebCrawler(max_depth=1, max_pages=10) # Conservative for 512MB
        await crawler.crawl(url)
        results = crawler.get_results()
        
        total_chunks = 0
        for page in results:
            chunks = content_processor.chunk_text(page["text"])
            vector_store_service.add_documents(
                collection_name=f"bot_{bot_id}",
                texts=chunks,
                metadatas=[{"source": page["url"]} for _ in chunks]
            )
            total_chunks += len(chunks)
            
        # Cleanup
        page_count = len(results)
        del results
        gc.collect()
        
        return {"message": f"Successfully ingested {url}", "pages": page_count, "chunks": total_chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{bot_id}")
async def list_sources(bot_id: str):
    try:
        sources = vector_store_service.list_sources(collection_name=f"bot_{bot_id}")
        return sources
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{bot_id}/{source_name:path}")
async def delete_source(bot_id: str, source_name: str):
    try:
        vector_store_service.delete_by_source(
            collection_name=f"bot_{bot_id}",
            source_name=source_name
        )
        return {"message": f"Successfully deleted {source_name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

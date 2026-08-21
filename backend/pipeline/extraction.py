import fitz  # PyMuPDF
import hashlib
from database import SessionLocal

def compute_hash(filepath: str) -> str:
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def check_document_cache(file_hash: str):
    return None

def save_to_document_cache(file_hash: str, text: str, page_count: int, product_id: int = None):
    pass

def extract_text(filepath: str) -> dict:
    """Extract text content from a document (PDF or TXT) efficiently."""
    file_hash = compute_hash(filepath)
    cached = check_document_cache(file_hash)
    if cached:
        return {
            "cached": True,
            "text": cached["extracted_text"],
            "page_count": cached["page_count"],
            "product_id": cached["product_id"],
            "hash": file_hash
        }
        
    text_content = ""
    page_count = 0
    
    if filepath.endswith('.txt'):
        with open(filepath, 'r', encoding='utf-8') as f:
            text_content = f.read()
        page_count = 1
    elif filepath.endswith('.csv'):
        import pandas as pd
        df = pd.read_csv(filepath)
        text_content = df.to_markdown(index=False)
        page_count = 1
    else:
        with fitz.open(filepath) as doc:
            page_count = len(doc)
            for i in range(page_count):
                page = doc[i]
                text_content += f"--- Page {i + 1} ---\n"
                text_content += page.get_text("text") + "\n"
    
    save_to_document_cache(file_hash, text_content, page_count)
                
    return {
        "cached": False,
        "text": text_content,
        "page_count": page_count,
        "product_id": None,
        "hash": file_hash
    }

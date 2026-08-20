import os
import numpy as np
from typing import List, Tuple

# We'll lazy load these to save memory during startup
_model = None
_index = None

INDEX_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "faiss_index")
INDEX_PATH = os.path.join(INDEX_DIR, "products.index")
IDS_PATH = os.path.join(INDEX_DIR, "product_ids.npy")

def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def _get_index():
    global _index
    if _index is None:
        import faiss
        os.makedirs(INDEX_DIR, exist_ok=True)
        if os.path.exists(INDEX_PATH):
            _index = faiss.read_index(INDEX_PATH)
        else:
            # Dimension for all-MiniLM-L6-v2 is 384
            _index = faiss.IndexFlatL2(384)
    return _index

def _save_index():
    import faiss
    if _index is not None:
        faiss.write_index(_index, INDEX_PATH)

def _load_ids() -> List[str]:
    if os.path.exists(IDS_PATH):
        return np.load(IDS_PATH).tolist()
    return []

def _save_ids(ids: List[str]):
    np.save(IDS_PATH, np.array(ids))

def generate_embeddings(text: str) -> np.ndarray:
    """Generate embeddings for a given text."""
    model = _get_model()
    return model.encode(text)

def update_index(product_id: str, embedding: np.ndarray):
    """Add or update an embedding in the FAISS index."""
    index = _get_index()
    ids = _load_ids()
    
    # Simple strategy: Just add it for now, ignoring updates logic for simplicity
    # In a full app you might use an IndexIDMap
    embedding_2d = np.array([embedding]).astype('float32')
    index.add(embedding_2d)
    
    ids.append(product_id)
    
    _save_index()
    _save_ids(ids)

def search_similar_products(embedding: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
    """Search for similar products using the FAISS index."""
    index = _get_index()
    ids = _load_ids()
    
    if index.ntotal == 0:
        return []
        
    embedding_2d = np.array([embedding]).astype('float32')
    k = min(top_k, index.ntotal)
    distances, indices = index.search(embedding_2d, k)
    
    results = []
    for i, idx in enumerate(indices[0]):
        if idx != -1 and idx < len(ids):
            results.append((ids[idx], float(distances[0][i])))
            
    return results

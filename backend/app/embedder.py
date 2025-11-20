# backend/app/embedder.py
from sentence_transformers import SentenceTransformer
import threading
from functools import lru_cache

# model choices:
# - "sentence-transformers/all-mpnet-base-v2"  (recommended)
# - "intfloat/e5-large"                        (higher accuracy, much larger)
MODEL_NAME = "sentence-transformers/all-mpnet-base-v2"

# load model once (thread-safe)
_model_lock = threading.Lock()
_model = None

def get_model():
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                # will download/model-cache to ~/.cache/huggingface if not present
                _model = SentenceTransformer(MODEL_NAME)
    return _model

def embed(text: str):
    """
    Returns a list[float] embedding for the input text.
    Keep this function simple so other parts of the code can call it.
    """
    if not text:
        return []

    model = get_model()
    # model.encode returns numpy array by default; convert to list for JSON/storage
    vec = model.encode(text, show_progress_bar=False, convert_to_numpy=True)
    return vec.tolist()

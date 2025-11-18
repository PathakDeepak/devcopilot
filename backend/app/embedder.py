from sentence_transformers import SentenceTransformer
from app.config import EMBED_MODEL

model = SentenceTransformer(EMBED_MODEL)

def embed(text: str):
    if not text or text.strip() == "":
        text = "empty"  # prevents identical vectors
    vec = model.encode([text])[0]
    return vec.tolist()

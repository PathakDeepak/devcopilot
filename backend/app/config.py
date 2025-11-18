import os
from dotenv import load_dotenv
load_dotenv()

QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

COLLECTION_NAME = "devcopilot"
VECTOR_SIZE = 384  # all-MiniLM-L6-v2 output dimension

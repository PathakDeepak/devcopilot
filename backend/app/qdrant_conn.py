from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from app.config import QDRANT_HOST, QDRANT_PORT, COLLECTION_NAME, VECTOR_SIZE

# Force HTTP client
client = QdrantClient(
    url=f"http://{QDRANT_HOST}:{QDRANT_PORT}",
    prefer_grpc=False
)

def init_qdrant():
    collections = [c.name for c in client.get_collections().collections]

    if COLLECTION_NAME not in collections:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE
            )
        )
    return client

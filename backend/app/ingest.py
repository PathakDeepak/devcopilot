import time
import uuid
from qdrant_client.models import PointStruct
from app.qdrant_conn import client
from app.config import COLLECTION_NAME
from app.embedder import embed


def ingest_event(event):
    """
    Ingests a development event (git commit, CLI command, API call, etc.)
    into Qdrant with semantic embeddings.
    """

    # --- Build enriched text for embedding ---
    parts = []

    if event.title:
        parts.append(event.title.strip())

    if event.body:
        parts.append(event.body.strip())

    # Combine all fields into one semantic string
    combined_text = " | ".join(parts).strip()

    # Fallback to avoid empty embeddings
    if not combined_text:
        combined_text = f"{event.type} event"  # ensures non-empty semantic text

    # --- Generate embedding ---
    vector = embed(combined_text)

    # --- Prepare payload ---
    payload = {
        "type": event.type,
        "title": event.title,
        "body": event.body,
        "timestamp": int(time.time() * 1000),
        "raw_text": combined_text,
    }

    # --- Create point ---
    point = PointStruct(
        id=str(uuid.uuid4()),
        vector=vector,
        payload=payload
    )

    # --- Debug (safe) logs ---
    print("\n=== INGEST DEBUG ===")
    print("TEXT:", combined_text)
    print("VECTOR SAMPLE:", vector[:10])
    print("PAYLOAD:", payload)
    print("====================\n")
    print("VECTOR HASH:", sum(vector))

    # --- Insert into Qdrant ---
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[point],
        wait=True
    )

    return {"id": point.id}

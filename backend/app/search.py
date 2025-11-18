import requests
from app.embedder import embed
from app.config import QDRANT_HOST, QDRANT_PORT, COLLECTION_NAME

# Minimum similarity required to consider a result relevant
MIN_SCORE = 0.30


def semantic_search(query: str,
                    top_k: int = 10,
                    type_filter=None,
                    start_ts=None,
                    end_ts=None,
                    min_score=MIN_SCORE):
    """
    Semantic search using Qdrant's HTTP API with:
    - embedding-based vector matching
    - optional type filtering
    - optional timestamp range filtering
    - score thresholding to avoid irrelevant results
    """

    # --- Embed the query ---
    query_vec = embed(query)

    # --- Build filters ---
    must_filters = []

    if type_filter:
        must_filters.append({
            "key": "type",
            "match": { "value": type_filter }
        })

    if start_ts or end_ts:
        ts_filter = {}
        if start_ts:
            ts_filter["gte"] = start_ts
        if end_ts:
            ts_filter["lte"] = end_ts

        must_filters.append({
            "key": "timestamp",
            "range": ts_filter
        })

    qdrant_filter = {"must": must_filters} if must_filters else None

    # --- Prepare search payload ---
    payload = {
        "vector": query_vec,
        "limit": top_k,
        "with_payload": True,
    }

    if qdrant_filter:
        payload["filter"] = qdrant_filter

    # --- Make HTTP request ---
    url = f"http://{QDRANT_HOST}:{QDRANT_PORT}/collections/{COLLECTION_NAME}/points/search"
    response = requests.post(url, json=payload)
    response.raise_for_status()

    raw_results = response.json().get("result", [])

    # --- Score-based filtering (critical!) ---
    filtered = [r for r in raw_results if r.get("score", 0) >= min_score]

    # --- Sort highest score first ---
    filtered.sort(key=lambda x: x.get("score", 0), reverse=True)

    # Debug
    print("\n=== SEARCH DEBUG ===")
    print("Query:", query)
    print("Vector (sample):", query_vec[:8])
    print("Filters:", qdrant_filter)
    print("Raw results:", len(raw_results))
    print("Filtered results:", len(filtered))
    print("====================\n")

    return filtered

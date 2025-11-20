import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import QDRANT_HOST, QDRANT_PORT, COLLECTION_NAME
from app.models import Event, SearchQuery
from app.ingest import ingest_event
from app.search import semantic_search
from app.qdrant_conn import init_qdrant
from app.compare import router as compare_router


# ------------------------------------------------------------
# FASTAPI APP
# ------------------------------------------------------------
app = FastAPI(
    title="DevCoPilot Backend",
    description="Local Developer Memory System (CLI, Git, API, Diff Analyzer)",
    version="1.0.0"
)

# Mount compare module ( /compare?… )
app.include_router(compare_router, tags=["compare"])

# Initialize Qdrant on startup
init_qdrant()


# ------------------------------------------------------------
# CORS FOR FRONTEND (adjust in production)
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # TODO: replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------
# ROUTES
# ------------------------------------------------------------

@app.get("/", tags=["system"])
def root():
    """Simple health check endpoint."""
    return {"status": "DevCoPilot running"}


# ---------- Ingest event ----------
@app.post("/ingest", tags=["ingest"])
def ingest(e: Event):
    """
    Ingests a new event into DevCoPilot memory.
    Events can be:
    - git_commit
    - cli_cmd
    - api_call
    - file_save
    - or anything else following Event model
    """
    return ingest_event(e)


# ---------- Semantic Search ----------
@app.post("/search", tags=["search"])
def search(q: SearchQuery, min_score: float = 0.30):
    """
    Performs semantic search using embeddings + Qdrant.
    Supports filtering by type, timestamp, and score threshold.
    """
    return semantic_search(
        q.query,
        q.top_k,
        type_filter=None,
        start_ts=None,
        end_ts=None,
        min_score=min_score
    )


# ---------- Fetch raw event ----------
@app.get("/event/{point_id}", tags=["event"])
def get_event(point_id: str):
    """
    Returns raw event payload from Qdrant by ID.
    """
    url = f"http://{QDRANT_HOST}:{QDRANT_PORT}/collections/{COLLECTION_NAME}/points/{point_id}"
    r = requests.get(url)

    if r.status_code == 200:
        return r.json().get("result", {})

    raise HTTPException(status_code=r.status_code, detail=r.text)


# ---------- Weekly summary placeholder ----------
@app.get("/summary/weekly", tags=["summaries"])
def weekly_summary():
    """
    Placeholder LLM summary endpoint.
    (Future feature: summarize last week's events)
    """
    return {"summary": "Weekly summary will be generated here."}

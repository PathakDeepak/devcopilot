import requests

from fastapi import  FastAPI
from fastapi import HTTPException
from app.config import QDRANT_HOST, QDRANT_PORT, COLLECTION_NAME
from app.models import Event, SearchQuery
from app.ingest import ingest_event
from app.search import semantic_search
from app.qdrant_conn import init_qdrant

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DevCoPilot Python Backend")

init_qdrant()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # React frontend (change to domain later)
    allow_credentials=True,
    allow_methods=["*"],          # <-- must allow OPTIONS
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "DevCoPilot running"}

@app.post("/ingest")
def ingest(e: Event):
    return ingest_event(e)

# @app.post("/search")
# def search(q: SearchQuery, type: str = None, start_ts: int = None, end_ts: int = None):
#     return semantic_search(q.query, q.top_k, type, start_ts, end_ts)

@app.post("/search")
def search(q: SearchQuery, min_score: float = 0.30):
    return semantic_search(q.query, q.top_k, None, None, None, min_score)


@app.get("/event/{point_id}")
def get_event(point_id: str):
    url = f"http://{QDRANT_HOST}:{QDRANT_PORT}/collections/{COLLECTION_NAME}/points/{point_id}"
    r = requests.get(url)
    if r.status_code == 200:
        return r.json().get("result", {})
    raise HTTPException(status_code=r.status_code, detail=r.text)

@app.get("/summary/weekly")
def weekly_summary():
    # collect events, feed to LLM, return summary
    return {"summary": "..."}

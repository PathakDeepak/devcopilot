from typing import Optional
from pydantic import BaseModel

class Event(BaseModel):
    type: str
    title: str | None = None
    body: str | None = None
    branch: str | None = None
    commit_hash: str | None = None
    timestamp: int | None = None


class SearchQuery(BaseModel):
    query: str
    top_k: int = 10

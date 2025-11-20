from fastapi import APIRouter, HTTPException
from app.qdrant_conn import client
from app.config import COLLECTION_NAME
import difflib
import requests
import os
from typing import Dict, Any

router = APIRouter()


# ------------------------------------------------------------
# TEXT EXTRACTION (per event type)
# ------------------------------------------------------------
def extract_text(event: Dict[str, Any]) -> str:
    """
    Normalize an event's payload into a consistent comparable text block.
    Handles CLI commands, git commits, API calls, and custom events.
    """

    if not event:
        return ""

    etype = event.get("type", "").lower()
    title = (event.get("title") or "").strip()
    body = (event.get("body") or "").strip()
    raw = (event.get("raw_text") or "").strip()

    # ---------- Git commit ----------
    if etype == "git_commit":
        lines = [title, body]

        changed_files = event.get("changed_files") or []
        if changed_files:
            lines.append("")
            lines.append("FILES:")
            lines.extend(changed_files)

        return "\n".join(lines)

    # ---------- CLI command ----------
    if etype == "cli_cmd":
        return raw or title or body

    # ---------- API call ----------
    if etype == "api_call":
        req = event.get("request") or ""
        resp = event.get("response") or ""
        return f"REQUEST:\n{req}\n\nRESPONSE:\n{resp}"

    # ---------- Default case ----------
    # Fallback: title + body + raw text if available
    parts = [title, body]
    if raw:
        parts.append(raw)

    return "\n".join([p for p in parts if p])


# ------------------------------------------------------------
# COMPARE TWO EVENTS
# ------------------------------------------------------------
@router.get("/compare")
async def compare_events(id1: str, id2: str):
    """
    Fetch two events by ID and generate:
    - unified diff
    - optional AI explanation
    """

    # Retrieve events from Qdrant
    events = client.retrieve(
        collection_name=COLLECTION_NAME,
        ids=[id1, id2]
    )

    if not events or len(events) != 2:
        raise HTTPException(
            status_code=404,
            detail="One or both event IDs not found."
        )

    e1 = events[0].payload or {}
    e2 = events[1].payload or {}

    # Convert to comparable text blocks
    t1 = extract_text(e1).splitlines()
    t2 = extract_text(e2).splitlines()

    # Generate unified diff
    diff = "\n".join(
        difflib.unified_diff(
            t1,
            t2,
            fromfile=f"{id1}",
            tofile=f"{id2}",
            lineterm=""
        )
    )

    # Optional AI explanation
    ai_explanation = None
    if os.getenv("AI_ENABLED", "false").lower() == "true":
        ai_explanation = generate_ai_explanation(diff)

    return {
        "id1": id1,
        "id2": id2,
        "event1": e1,
        "event2": e2,
        "diff": diff,
        "explanation": ai_explanation,
    }


# ------------------------------------------------------------
# AI EXPLANATION (local LLM → OpenAI fallback)
# ------------------------------------------------------------
def generate_ai_explanation(diff_text: str) -> str:
    """
    Generate a human-readable explanation for the diff.
    Priority:
    1. LOCAL_LLM_URL (e.g., Ollama)
    2. OPENAI_API_KEY (GPT-4o, 4o-mini, etc.)
    """

    if not diff_text.strip():
        return "No differences found."

    prompt = f"Explain the following code/text diff in clear human language:\n\n{diff_text}"

    # Local LLM endpoint (e.g., Ollama)
    local_llm = os.getenv("LOCAL_LLM_URL")
    if local_llm:
        try:
            r = requests.post(local_llm, json={"prompt": prompt})
            j = r.json()
            return j.get("response") or j.get("text") or ""
        except Exception:
            pass  # fallback to OpenAI

    # OpenAI fallback
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        try:
            r = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {openai_key}"},
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            return r.json()["choices"][0]["message"]["content"]
        except Exception:
            return "Unable to generate AI explanation."

    return None

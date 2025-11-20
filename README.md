# 🚀 DevCoPilot — Your Personal Developer Memory Co-Pilot

DevCoPilot is a **local, privacy-first development memory system** that automatically captures:

- 🟩 Every **CLI command**
- 🟩 Every **Git commit**
- 🟩 Manual API events or logs
- 🟩 Embedding-based semantic search
- 🟩 Diff Analyzer (compare any two events)
- 🟩 Beautiful React dashboard

No cloud.  
No AWS.  
No telemetry.  
Everything runs **fully offline** on your machine.

---

## 🌟 Features

### 🔥 Full Development Memory

| Source | Captured? | Details |
|--------|-----------|---------|
| 🟩 Git commits | ✔ Yes | Message, body, branch, hash, timestamp |
| 🟩 Terminal commands | ✔ Yes | Every CLI command you run |
| 🟩 API events | ✔ Yes | Anything you choose to ingest manually |
| 🟩 Embeddings | ✔ Yes | Local MiniLM embeddings |
| 🟩 Vector DB | ✔ Yes | Qdrant local database |

---

## 🔍 Semantic Search

Ask natural-language queries:

- “When did I fix the redis cache bug?”
- “Find all ‘hello world’ commits”
- “Show docker commands from last week”
- “Search for OAuth debugging commands”

Includes:

- Embedding similarity  
- Score threshold slider  
- Type filters  
- Date filters  
- Score histogram visualization  

---

## 🆕 Diff Analyzer — Compare Any Two Events

Compare:

- two commits  
- two CLI commands  
- a CLI command vs a commit  
- API responses  
- any two stored events  

Features:

- Unified diff view  
- Color-coded (+ green / - red / @@ yellow)  
- Structured metadata  
- Optional AI explanation (LLM optional, disabled by default)  
- Smooth React Compare Drawer  

---

## 📊 Beautiful Dashboard (React + Tailwind + Recharts)

- 🔎 Search bar  
- 🧭 Timeline  
- 📁 Event Drawer  
- 🎚 Score Threshold Slider  
- 📊 Score Histogram  
- 🧮 Summary cards  
- 🔀 Compare button  
- 🧩 Compare Drawer with diff viewer  

Open:

```
http://localhost:3000
```

---

## 🐳 Docker Setup (Production Mode)

Start all services:

```
docker-compose up --build -d
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| Qdrant | 6333 | Vector database |
| Backend | 8000 | FastAPI ingest/search/compare |
| Frontend | 3000 | NGINX + React app |

Qdrant Dashboard:  
http://localhost:6333/dashboard

---

## 🧠 Architecture

```
Terminal / Git Hook
        ↓
FastAPI Backend (Ingest/Embed/Search/Compare)
        ↓
Qdrant Vector DB
        ↓
React + NGINX UI (Timeline / Diff / Insights)
```

---

## 📁 Project Structure

```
devcopilot/
 ├── backend/
 │   ├── app/
 │   ├── requirements.txt
 │   ├── Dockerfile
 │
 ├── frontend/
 │   ├── src/
 │   ├── nginx.conf
 │   ├── default.conf
 │   ├── Dockerfile
 │
 ├── docker-compose.yml
 ├── .gitignore
 └── README.md
```

---

## ⚙️ API Usage

### Ingest event

```bash
curl -X POST http://localhost:8000/ingest   -H "Content-Type: application/json"   -d '{"type":"git_commit","title":"fix redis","body":"updated TTL"}'
```

### Search

```bash
curl -X POST http://localhost:8000/search   -H "Content-Type: application/json"   -d '{"query":"redis fix","top_k":10}'
```

### Compare two events

```bash
curl "http://localhost:8000/compare?id1=<id1>&id2=<id2>"
```

---

## 🔄 Auto-Ingestion

### 1️⃣ Terminal Hook (ZSH)

Add to `~/.zshrc`:

```bash
API_URL="http://localhost:8000/ingest"

preexec() {
  local cmd="$1"
  local ts=$(($(date +%s) * 1000))

  payload=$(python3 - <<PY - "$cmd" "$ts"
import json,sys
print(json.dumps({"type":"cli_cmd","title":sys.argv[1],"timestamp":int(sys.argv[2])}))
PY
)

  curl -s -X POST "$API_URL"        -H "Content-Type: application/json"        -d "$payload" >/dev/null 2>&1 &
}
```

Reload:

```bash
source ~/.zshrc
```

---

### 2️⃣ Git Hook (post-commit)

Create `.git/hooks/post-commit`:

```bash
#!/usr/bin/env bash

API_URL="http://localhost:8000/ingest"

commit_hash=$(git rev-parse HEAD)
title=$(git log -1 --pretty=format:%s)
body=$(git log -1 --pretty=format:%b)
branch=$(git rev-parse --abbrev-ref HEAD)
timestamp=$(($(date +%s) * 1000))

payload=$(printf '{
  "type":"git_commit",
  "title":%q,
  "body":%q,
  "branch":%q,
  "commit_hash":%q,
  "timestamp":%d
}' "$title" "$body" "$branch" "$commit_hash" "$timestamp")

curl -s -X POST "$API_URL"      -H "Content-Type: application/json"      -d "$payload" >/dev/null 2>&1 &
```

---

## 🧡 Roadmap

- [x] Diff Analyzer (compare any two events)
- [ ] Weekly LLM summary  
- [ ] Better CLI classifier  
- [ ] Secret/credential redaction  
- [ ] VSCode extension  
- [ ] Project tagging  
- [ ] Higher-precision embedding models (MPNET / E5)  

---

## 📄 License

MIT License.

---

## ⭐ Support

If this project helps you, please ⭐ star it on GitHub!

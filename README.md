# 🚀 DevCoPilot — Your Personal Developer Memory Co-Pilot
A local, privacy-focused developer assistant that **remembers everything you do**:

- Every **Git commit**
- Every **terminal/CLI command**
- Any **manual API event**
- Fully **searchable with embeddings**
- Beautiful **timeline dashboard**
- No cloud, no AWS, no vendor lock-in
- Built with **Python + FastAPI + Qdrant + React**

This is your **personal development memory system** — a complete history of how you solved problems, tracked over time, and searchable in natural language.

---

## 🌟 Features

### 🔥 Full Development Memory  
DevCoPilot automatically captures:

| Source | Captured? | Details |
|--------|-----------|---------|
| 🟩 Git commits | ✔ Yes | Commit message, body, branch, hash, timestamp |
| 🟩 Terminal commands | ✔ Yes | Every CLI command you run, safely JSON escaped |
| 🟩 Manual API events | ✔ Yes | Any text you send via `/ingest` |
| 🟩 Embeddings | ✔ Yes | Local MiniLM embeddings |
| 🟩 Vector search | ✔ Yes | Qdrant local database |

---

## 🔍 Semantic Search
Ask questions in natural language:

- “When did I fix redis cache bug?”
- “Find commits related to hello world”
- “Show docker commands from last week”
- “Search CLI commands about postgres issues”

Powered by:

- SentenceTransformers embeddings  
- Qdrant vector similarity  
- Score threshold slider  
- Type/date filters  

---

## 📊 Beautiful Dashboard

The React UI includes:

- 🔎 Search
- 🧭 Timeline
- 📁 Event Drawer
- 📊 Score Histogram
- 🎚 Similarity Threshold Slider
- 🎛 Filters
- 🧮 Activity Summary Cards

Open:

```
http://localhost:3000
```

---

## 🐳 Docker Setup

Start everything:

```
docker-compose up --build -d
```

Services:

| Service | Port | Description |
|---------|------|-------------|
| Backend | 8000 | FastAPI ingestion & search |
| Frontend | 3000 | React dashboard |
| Qdrant | 6333 | Local vector DB |

Qdrant UI:

```
http://localhost:6333/dashboard
```

---

## 🧠 Architecture

```
Terminal / Git Hooks → FastAPI → Embeddings → Qdrant → React Dashboard
```

---

## 📦 Project Structure

```
devcopilot/
 ├── backend/
 │    ├── app/
 │    ├── requirements.txt
 │    ├── Dockerfile
 ├── frontend/
 │    ├── src/
 │    ├── package.json
 │    ├── Dockerfile
 ├── docker-compose.yml
 ├── .env.example
 ├── .gitignore
 └── README.md
```

---

## ⚙️ Ingesting Data

### Manual Ingest

```bash
curl -X POST http://localhost:8000/ingest   -H "Content-Type: application/json"   -d '{"type":"git_commit","title":"fix redis","body":"updated TTL"}'
```

### Search

```bash
curl -X POST http://localhost:8000/search   -H "Content-Type: application/json"   -d '{"query":"redis fix","top_k":10}'
```

---

## 🔄 Auto-Ingestion Hooks

### 🐚 Terminal Hook (ZSH Production)

Add to `~/.zshrc`:

```bash
API_URL="http://localhost:8000/ingest"

preexec() {
  local cmd="$1"
  local ts=$(($(date +%s) * 1000))

  if command -v jq >/dev/null 2>&1; then
    payload=$(jq -n       --arg type "cli_cmd"       --arg title "$cmd"       --argjson timestamp "$ts"       '{type:$type, title:$title, timestamp:$timestamp}')
  else
    payload=$(python3 - <<PY - "$cmd" "$ts"
import json, sys
print(json.dumps({"type":"cli_cmd","title":sys.argv[1], "timestamp":int(sys.argv[2])}))
PY
)
  fi

  curl -s -X POST "$API_URL"     -H "Content-Type: application/json"     -d "$payload" >/dev/null 2>&1 &
}
```

Reload:

```bash
source ~/.zshrc
```

---

### 🔧 Git Hook (post-commit)

`.git/hooks/post-commit`:

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

curl -s -X POST "$API_URL"   -H "Content-Type: application/json"   -d "$payload" >/dev/null 2>&1 &
```

---

## 🧡 Roadmap

- [ ] Weekly AI summaries  
- [ ] Compare two events (diff + LLM explanation)  
- [ ] Automatic secret redaction  
- [ ] VSCode plugin  
- [ ] Project tagging  
- [ ] Daily activity report  

---

## 📄 License

MIT License.

---

## 🤝 Contributing

Issues and PRs are welcome!

---

## ⭐ If you like this project  
Give it a star ⭐ on GitHub!  

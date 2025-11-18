#!/bin/bash
COMMIT=$(git rev-parse HEAD)
MSG=$(git log -1 --pretty=%B)
DIFF=$(git show --pretty="" --name-only $COMMIT)

curl -X POST http://localhost:8000/ingest   -H "Content-Type: application/json"   -d "{ \"type\": \"git_commit\", \"title\": \"$MSG\", \"body\": \"$DIFF\" }"

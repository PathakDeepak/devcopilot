FROM python:3.11-slim

WORKDIR /app

# system deps (for sentence-transformers and model tokenizers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git curl ca-certificates libsndfile1 && \
    rm -rf /var/lib/apt/lists/*

# Copy and install python deps
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
# install torch first to avoid heavy source builds; this will install CPU-only torch
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install -r /app/requirements.txt

COPY . /app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

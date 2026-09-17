"""
main.py — FastAPI server for the Webnxt chatbot backend.

Endpoints:
  POST /chat    — accepts { "message": "..." }, streams SSE response
  GET  /health  — returns { "status": "ok", "chunks": N }
"""

import os
import json
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

from config import (
    GROQ_API_KEY,
    GROQ_MODEL,
    MAX_TOKENS,
    TEMPERATURE,
    ALLOWED_ORIGINS,
    CHROMA_DIR,
    COLLECTION,
)
from ingest import ingest
from retriever import retrieve
from prompt_builder import build_messages

load_dotenv(dotenv_path=".env.local", override=True)


# ── Startup: run ingestion if needed ──────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run knowledge base ingestion on startup (skips if already populated)."""
    print("\nStarting Webnxt Chatbot API...")
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, ingest)   # run blocking ingest in thread pool
    print("Ready to serve requests.\n")
    yield
    print("Shutting down.")


# ── App ───────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Webnxt Chatbot API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Groq client ───────────────────────────────────────────────────────────

api_key = os.environ.get("GROQ_API_KEY", "").strip()
if not api_key:
    raise RuntimeError("GROQ_API_KEY is not set. Add it to .env.local")

groq_client = Groq(api_key=api_key)


# ── Request / response models ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


# ── SSE streaming generator ────────────────────────────────────────────────

async def stream_groq(messages: list[dict]):
    """
    Async generator that streams Groq response tokens as SSE events.
    Format: data: <token>\n\n
    Sends data: [DONE]\n\n at the end.
    """
    loop = asyncio.get_event_loop()

    # Groq's Python SDK is synchronous — run it in a thread pool
    def _call_groq():
        return groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            max_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
            stream=True,
        )

    stream = await loop.run_in_executor(None, _call_groq)

    for chunk in stream:
        delta = chunk.choices[0].delta
        if delta and delta.content:
            token = delta.content
            # SSE format: data: <json>\n\n
            yield f"data: {json.dumps({'token': token})}\n\n"

    yield "data: [DONE]\n\n"


# ── Endpoints ─────────────────────────────────────────────────────────────

@app.post("/chat")
async def chat(req: ChatRequest):
    """
    Main chat endpoint. Steps:
      1. Validate input
      2. Retrieve top-3 relevant chunks from ChromaDB
      3. Build prompt (system + context + question)
      4. Stream Groq response as SSE
    """
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message cannot be empty")

    if len(message) > 1000:
        raise HTTPException(status_code=400, detail="message too long (max 1000 chars)")

    # RAG retrieval (synchronous, fast — ~10–40ms)
    context = retrieve(message)

    # Build prompt
    messages = build_messages(message, context)

    return StreamingResponse(
        stream_groq(messages),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",       # disable Nginx buffering if proxied
        },
    )


@app.get("/health")
async def health():
    """Health check + chunk count for monitoring."""
    import chromadb
    try:
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        col = client.get_collection(COLLECTION)
        return {"status": "ok", "model": GROQ_MODEL, "chunks": col.count()}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

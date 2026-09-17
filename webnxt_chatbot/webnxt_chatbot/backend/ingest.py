"""
ingest.py — One-time knowledge base ingestion
Reads all .md files in company-data/, chunks them, embeds with
sentence-transformers, and stores in ChromaDB.

Runs automatically from main.py on startup if the collection is empty.
Can also be run manually: python ingest.py
"""

import os
import re
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer

from config import KB_DIR, CHROMA_DIR, COLLECTION, EMBED_MODEL


# ── helpers ───────────────────────────────────────────────────────────────

def load_md_files(kb_dir: Path) -> list[dict]:
    """Return list of {source, text} for every .md file directly in kb_dir."""
    docs = []
    for md_file in sorted(kb_dir.glob("*.md")):
        text = md_file.read_text(encoding="utf-8").strip()
        if text:
            docs.append({"source": md_file.name, "text": text})
            print(f"  Loaded {md_file.name} ({len(text)} chars)")
    return docs


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 60) -> list[str]:
    """
    Split text into overlapping chunks by character count.
    Tries to break on paragraph boundaries first.
    """
    # split on double newline (paragraph) then rejoin into chunks
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) + 2 <= chunk_size:
            current = (current + "\n\n" + para).strip()
        else:
            if current:
                chunks.append(current)
            # if a single paragraph exceeds chunk_size, hard-split it
            if len(para) > chunk_size:
                for i in range(0, len(para), chunk_size - overlap):
                    chunks.append(para[i : i + chunk_size])
            else:
                current = para

    if current:
        chunks.append(current)

    return [c for c in chunks if len(c) > 80]   # drop tiny noise chunks


# ── main ingestion ────────────────────────────────────────────────────────

def ingest(force: bool = False) -> chromadb.Collection:
    """
    Load, chunk, embed, and store all .md files.
    Returns the ChromaDB collection (ready for queries).

    Args:
        force: If True, drops and rebuilds the collection from scratch.
    """
    print("=== Webnxt KB Ingestion ===")

    # ChromaDB client (persistent, stored on disk)
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    # Check if collection already populated
    existing = [c.name for c in client.list_collections()]
    if COLLECTION in existing and not force:
        col = client.get_collection(COLLECTION)
        count = col.count()
        if count > 0:
            print(f"  Collection '{COLLECTION}' already has {count} chunks — skipping ingest.")
            print("  (Pass force=True to re-ingest)")
            return col
        client.delete_collection(COLLECTION)

    elif COLLECTION in existing and force:
        print(f"  Forcing re-ingest — deleting existing collection '{COLLECTION}'")
        client.delete_collection(COLLECTION)

    col = client.create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"},   # cosine similarity
    )

    # Load embedding model (downloads once, cached in ~/.cache/huggingface)
    print(f"\nLoading embedding model: {EMBED_MODEL}")
    model = SentenceTransformer(EMBED_MODEL)

    # Load .md files
    print(f"\nLoading .md files from: {KB_DIR}")
    docs = load_md_files(KB_DIR)
    if not docs:
        raise FileNotFoundError(f"No .md files found in {KB_DIR}")

    # Chunk, embed, and store
    print("\nChunking and embedding...")
    all_ids, all_texts, all_metas, all_embeds = [], [], [], []
    chunk_idx = 0

    for doc in docs:
        chunks = chunk_text(doc["text"])
        print(f"  {doc['source']}: {len(chunks)} chunks")

        for chunk in chunks:
            chunk_id = f"chunk_{chunk_idx:04d}"
            embedding = model.encode(chunk).tolist()

            all_ids.append(chunk_id)
            all_texts.append(chunk)
            all_metas.append({"source": doc["source"]})
            all_embeds.append(embedding)
            chunk_idx += 1

    col.add(
        ids=all_ids,
        documents=all_texts,
        metadatas=all_metas,
        embeddings=all_embeds,
    )

    print(f"\nIngested {chunk_idx} chunks from {len(docs)} files into '{COLLECTION}'")
    return col


if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv
    ingest(force=force)

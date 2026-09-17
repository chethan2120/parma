"""
retriever.py — Semantic search over ChromaDB
Embeds the user's question and returns the top-k most relevant
chunks from the knowledge base.
"""

from sentence_transformers import SentenceTransformer
import chromadb

from config import CHROMA_DIR, COLLECTION, EMBED_MODEL, TOP_K

# ── module-level singletons (loaded once on startup) ─────────────────────
_model: SentenceTransformer | None = None
_collection: chromadb.Collection | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBED_MODEL)
    return _model


def _get_collection() -> chromadb.Collection:
    global _collection
    if _collection is None:
        client = chromadb.PersistentClient(path=str(CHROMA_DIR))
        _collection = client.get_collection(COLLECTION)
    return _collection


# ── public API ────────────────────────────────────────────────────────────

def retrieve(query: str, top_k: int = TOP_K) -> str:
    """
    Semantic search: embed the query, find the top_k most similar
    chunks in ChromaDB, return them as a single context string.

    Args:
        query:  The user's raw question.
        top_k:  Number of chunks to retrieve (default from config).

    Returns:
        A formatted string with each chunk separated by '---'.
    """
    model = _get_model()
    col   = _get_collection()

    query_embedding = model.encode(query).tolist()

    results = col.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    docs      = results["documents"][0]       # list of chunk texts
    metadatas = results["metadatas"][0]       # list of {source: "pricing.md"}
    distances = results["distances"][0]       # cosine distances (lower = better)

    if not docs:
        return ""

    # Build context block — annotate each chunk with its source file
    parts = []
    for doc, meta, dist in zip(docs, metadatas, distances):
        source = meta.get("source", "unknown")
        # Skip chunks with very poor similarity (distance > 1.2 on cosine space)
        if dist > 1.2:
            continue
        parts.append(f"[Source: {source}]\n{doc}")

    return "\n\n---\n\n".join(parts)

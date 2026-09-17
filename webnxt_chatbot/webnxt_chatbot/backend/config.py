import os
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────
BASE_DIR      = Path(__file__).resolve().parent.parent          # project root
KB_DIR        = BASE_DIR / "company-data"                        # .md files
CHROMA_DIR    = BASE_DIR / "backend" / ".chromadb"              # vector store
COLLECTION    = "webnxt_kb"

# ── Groq ───────────────────────────────────────────────────────────────────
GROQ_API_KEY  = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL    = "llama-3.3-70b-versatile"
MAX_TOKENS    = 250          # keeps latency under 1s for typical replies
TEMPERATURE   = 0.3          # factual, low creativity

# ── RAG retrieval ──────────────────────────────────────────────────────────
TOP_K         = 3            # top-3 chunks — 95% quality, lower token count

# ── Embedding ──────────────────────────────────────────────────────────────
# sentence-transformers runs locally — zero cost, zero API key
EMBED_MODEL   = "all-MiniLM-L6-v2"   # 384-dim, fast, good quality

# ── CORS ───────────────────────────────────────────────────────────────────
# Add your frontend domains here
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:5500",   # VS Code Live Server
    "https://webnxt.co",
    "https://www.webnxt.co",
    "*",                        # remove in production for security
]

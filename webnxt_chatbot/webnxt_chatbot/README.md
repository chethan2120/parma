# Webnxt AI Chatbot

An ultra-fast, AI-powered chatbot for [webnxt.co](https://webnxt.co) that answers visitor questions using real company data scraped directly from the website. 

Built on a **Retrieval-Augmented Generation (RAG)** architecture. It uses a **FastAPI** backend with local embeddings to fetch relevant knowledge, and passes it to **Groq (Llama 3.3 70B)** which streams responses back to a lightweight, vanilla JS frontend.

---

## ⚙️ Fundamental Workflow

Here is exactly how the system works end-to-end when a visitor asks a question:

```text
       [Visitor types: "How much for a website?"]
                             │
                             ▼
 1. Frontend ─────────▶  FastAPI Backend (/chat)
    (chatbot.js)             │
                             ▼
 2. Embedding ────────▶  SentenceTransformers converts the question 
                         into a mathematical vector (array of numbers).
                             │
                             ▼
 3. Retrieval ────────▶  ChromaDB (Vector DB) searches the scraped 
                         company-data/*.md files and finds the Top-3 
                         most relevant text chunks matching the question.
                             │
                             ▼
 4. Prompting ────────▶  Backend merges: 
                           [Webnxt Personality Rules] + 
                           [Top 3 relevant text chunks] + 
                           ["How much for a website?"]
                             │
                             ▼
 5. Generation ───────▶  Groq Cloud (Llama 3.3 70B) reads the prompt 
                         and generates the exact answer instantly.
                             │
                             ▼
 6. Streaming ────────▶  FastAPI streams the answer back to the frontend 
                         word-by-word via Server-Sent Events (SSE) 
                         so the visitor sees the typing effect instantly.
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why we chose it |
|---|---|---|
| **Frontend** | Vanilla JS (`chatbot.js`) + CSS | Zero build steps. Super lightweight. Can be injected directly via `<script>` tag into any site. |
| **Backend API** | Python + FastAPI | Built for high performance, async operations, and native SSE streaming. |
| **Vector DB** | ChromaDB (Local disk) | Zero monthly cost. Automatically saves vectors to `backend/.chromadb`. |
| **Embeddings** | `sentence-transformers` | Runs 100% locally and free. No API calls needed to vectorize text. |
| **LLM Provider** | Groq (`llama-3.3-70b-versatile`) | Extremely low latency (First Token ~130ms), essential for real-time chat UX. Costs practically $0 for our traffic. |

---

## 📁 Project Structure

```text
webnxt_chatbot/
│
├── company-data/               # Scraped Webnxt knowledge base (.md files)
│   ├── pricing.md              # Packages, costs
│   ├── services.md             # Offerings
│   └── ...                     # Contact, portfolio, FAQs, timelines
│
├── frontend/                   # Vanilla HTML/JS/CSS Frontend
│   ├── chatbot.js              # Core logic, SSE streaming, widget rendering
│   ├── chatbot.css             # Scoped styles (#wn- prefix)
│   └── index.html              # Local testing environment
│
├── backend/                    # FastAPI Backend
│   ├── main.py                 # Core API, streaming endpoints, and config
│   ├── ingest.py               # Chunks markdown files and saves to ChromaDB
│   ├── retriever.py            # Queries ChromaDB for top-3 chunks
│   ├── prompt_builder.py       # Assembles the system prompt + user context
│   └── requirements.txt        # Python dependencies
│
├── scrape.py                   # One-time script used to crawl webnxt.co
├── .env.example                # Template for environment variables
└── README.md                   # This file
```

---

##  How to Run Locally

### 1. Configure API Key
Create a `.env.local` file inside the `backend/` folder and add your Groq API Key:
```env
GROQ_API_KEY=gsk_your_real_api_key_here
```

### 2. Start the Backend
Open a terminal, install dependencies, and start FastAPI:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
*(Note: On the very first run, it will automatically download the embedding model and ingest all markdown files into ChromaDB. Subsequent boots will be instant).*

### 3. Start the Frontend
Open a **second** terminal and start a simple static file server:
```bash
cd frontend
python -m http.server 3000
```

Open your browser to `http://localhost:3000`. Click the purple chat bubble in the bottom right corner and start chatting!

---

## 🌐 Deployment (Next Steps)

1. **Backend**: Deploy the `backend/` folder to a platform like **Render** or **Railway**. 
   - Add the `GROQ_API_KEY` to the environment variables in their dashboard.
   - Set the start command to `uvicorn main:app --host 0.0.0.0 --port 8000`.
   - Your backend will get a live URL (e.g., `https://webnxt-bot.onrender.com`).

2. **Frontend**: Deploy the `frontend/` folder to **Vercel** or **Netlify**.
   - Edit `chatbot.js` so `BACKEND_URL` points to your live Render API URL instead of `localhost`.

3. **Live Website**: Copy the Vercel script URL and inject it into the footer of your main website:
   ```html
   <script src="https://your-vercel-domain.vercel.app/chatbot.js" defer></script>
   ```

---

## 🔄 Updating Knowledge

When Webnxt changes prices or services, you don't need to retrain any AI models:
1. Open the relevant file in `company-data/` (e.g., `pricing.md`).
2. Update the text.
3. Restart the backend server. It will automatically detect the changes and update the vector database instantly.

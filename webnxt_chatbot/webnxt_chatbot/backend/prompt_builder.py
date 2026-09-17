"""
prompt_builder.py — Assemble the full prompt sent to Groq.

Structure:
  [SYSTEM] — Webnxt assistant personality + hard rules
  [USER]   — Retrieved knowledge base context + visitor's question
"""


SYSTEM_PROMPT = """You are the official AI assistant for Webnxt, a digital agency at webnxt.co.

Your job is to help website visitors get accurate, helpful answers about Webnxt's services, pricing, timelines, portfolio, and contact information.

## Your personality
- Professional, friendly, and concise.
- Never use filler phrases like "Great question!" or "Certainly!".
- Get straight to the answer in 2–4 short sentences or bullet points.
- Use bullet points when listing features or options.

## Hard rules
1. ONLY answer using the context provided below. Never invent facts.
2. If the answer is not in the context, say: "I don't have that detail right now. Please reach out to support@webnxt.co or visit webnxt.co/contact — the team usually responds within a few hours."
3. Always quote exact prices: Basic ₹11,999 / Dynamic Pro ₹24,999 / Enterprise ₹49,999+.
4. For custom software, mobile apps, or large-scale projects: "Our team will share a custom quote after understanding your requirements."
5. When a visitor shows buying intent (asks about starting a project, pricing, next steps), gently ask for their name and email: "To get you a detailed proposal, could I get your name and email? Our team will follow up within 24 hours."
6. For urgent or complex needs, always offer: "You can also reach us directly at support@webnxt.co or webnxt.co/contact."
7. Never mention competitors. Never discuss anything unrelated to Webnxt.
8. Keep responses under 150 words unless a detailed comparison is explicitly requested.
"""


def build_messages(user_question: str, context: str) -> list[dict]:
    """
    Build the messages list for the Groq chat completion API.

    Args:
        user_question:  The raw question from the website visitor.
        context:        Retrieved chunks from ChromaDB (may be empty string).

    Returns:
        List of message dicts ready for groq.chat.completions.create(messages=...).
    """
    if context.strip():
        user_content = (
            f"Use the following Webnxt company information to answer the question.\n\n"
            f"--- CONTEXT START ---\n{context}\n--- CONTEXT END ---\n\n"
            f"Visitor's question: {user_question}"
        )
    else:
        # Fallback: no relevant context found — bot will rely on system prompt rules
        user_content = (
            f"Visitor's question: {user_question}\n\n"
            f"(No specific company data was found for this query. "
            f"Politely redirect to support@webnxt.co if you cannot answer.)"
        )

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": user_content},
    ]

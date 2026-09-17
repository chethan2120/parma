/**
 * chatbot.js — Webnxt AI Assistant
 * Self-contained widget. Injects CSS + HTML into any page.
 *
 * Usage:
 *   <script src="chatbot.js" data-backend="https://your-api.onrender.com" defer></script>
 *
 * For local dev (no data-backend attr), defaults to http://localhost:8001
 */

(function () {
  "use strict";

  // ── Config ──────────────────────────────────────────────────────────────
  const script      = document.currentScript || document.querySelector('script[data-backend]');
  const BACKEND_URL = (script && script.getAttribute("data-backend")) || "http://localhost:8001";
  const CSS_URL     = (script && script.src.replace("chatbot.js", "chatbot.css")) || "chatbot.css";

  const WELCOME = "Hi! I'm Webnxt's AI assistant 👋<br>Ask me about our services, pricing, timeline, or past work — I'm happy to help!";

  // ── Inject CSS ──────────────────────────────────────────────────────────
  const link = document.createElement("link");
  link.rel   = "stylesheet";
  link.href  = CSS_URL;
  document.head.appendChild(link);

  // Also inject Google Font (Inter) if not already present
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
    const font = document.createElement("link");
    font.rel   = "stylesheet";
    font.href  = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(font);
  }

  // ── Inject HTML ─────────────────────────────────────────────────────────
  document.body.insertAdjacentHTML("beforeend", `
    <!-- Webnxt Chat Widget -->
    <button id="wn-toggle" aria-label="Open chat">💬</button>

    <div id="wn-window" role="dialog" aria-label="Webnxt AI Assistant">
      <div id="wn-header">
        <div id="wn-header-left">
          <div id="wn-avatar">🤖</div>
          <div>
            <div id="wn-title">Webnxt Assistant</div>
            <div id="wn-status"><span class="wn-dot"></span>Online</div>
          </div>
        </div>
        <button id="wn-close" aria-label="Close chat">✕</button>
      </div>

      <div id="wn-messages" role="log" aria-live="polite"></div>

      <div id="wn-input-area">
        <input
          id="wn-input"
          type="text"
          placeholder="Ask about pricing, services…"
          autocomplete="off"
          maxlength="500"
          aria-label="Your message"
        />
        <button id="wn-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <div id="wn-footer">
        Powered by <a href="https://webnxt.co" target="_blank" rel="noopener">Webnxt</a>
      </div>
    </div>
  `);

  // ── Element refs ────────────────────────────────────────────────────────
  const toggle   = document.getElementById("wn-toggle");
  const win      = document.getElementById("wn-window");
  const closeBtn = document.getElementById("wn-close");
  const messages = document.getElementById("wn-messages");
  const input    = document.getElementById("wn-input");
  const send     = document.getElementById("wn-send");

  let isOpen    = false;
  let isWaiting = false;  // true while waiting for or streaming a response

  // ── Helpers ─────────────────────────────────────────────────────────────

  function openChat() {
    isOpen = true;
    win.classList.add("wn-open");
    toggle.textContent = "✕";
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove("wn-open");
    toggle.textContent = "💬";
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function appendBubble(html, role /* "wn-bot" | "wn-user" */) {
    const div = document.createElement("div");
    div.className = `wn-msg ${role}`;
    div.innerHTML = html;
    messages.appendChild(div);
    scrollBottom();
    return div;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "wn-msg wn-bot wn-typing";
    div.id = "wn-typing-indicator";
    div.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(div);
    scrollBottom();
    return div;
  }

  function removeTyping() {
    const el = document.getElementById("wn-typing-indicator");
    if (el) el.remove();
  }

  function setLoading(state) {
    isWaiting = state;
    send.disabled = state;
    input.disabled = state;
  }

  // Minimal markdown: **bold**, *italic*, newlines, bullet points
  function renderMarkdown(text) {
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")  // escape HTML
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/\n/g, "<br>");
  }

  // ── Send message & stream response ──────────────────────────────────────

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isWaiting) return;

    input.value = "";
    setLoading(true);

    // User bubble
    appendBubble(renderMarkdown(text), "wn-user");

    // Typing indicator
    showTyping();

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Replace typing indicator with empty bot bubble (will fill token by token)
      removeTyping();
      const botBubble = appendBubble("", "wn-bot");
      let accumulated = "";

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              accumulated += parsed.token;
              botBubble.innerHTML = renderMarkdown(accumulated);
              scrollBottom();
            }
          } catch (_) {
            // ignore malformed SSE line
          }
        }
      }

      // If nothing came back, show fallback
      if (!accumulated.trim()) {
        botBubble.innerHTML = "I'm not sure about that. Please reach out to <a href='mailto:support@webnxt.co'>support@webnxt.co</a> for help.";
      }

    } catch (err) {
      removeTyping();
      appendBubble(
        "Something went wrong. Please try again or contact <a href='mailto:support@webnxt.co'>support@webnxt.co</a>.",
        "wn-bot"
      );
      console.error("[Webnxt Chat]", err);
    } finally {
      setLoading(false);
      input.focus();
    }
  }

  // ── Event listeners ──────────────────────────────────────────────────────

  toggle.addEventListener("click", () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener("click", closeChat);

  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeChat();
  });

  // ── Welcome message on first open ────────────────────────────────────────

  let welcomed = false;
  toggle.addEventListener("click", () => {
    if (!welcomed && isOpen) {
      welcomed = true;
      setTimeout(() => appendBubble(WELCOME, "wn-bot"), 200);
    }
  });

})();

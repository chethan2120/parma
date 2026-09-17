import { useEffect, useMemo, useRef, useState } from 'react'
import { openSupportWhatsApp } from '../utils/whatsapp'
import './FloatingHelp.css'

type Msg = { id: string; role: 'bot' | 'user'; text: string }

const BACKEND_URL = (import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8001').replace(/\/$/, '')

function formatMessageText(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  return lines.map((line, lineIdx) => {
    const listMatch = line.match(/^(\s*[-•]\s+)(.*)/)
    let content = line
    let isListItem = false

    if (listMatch) {
      content = listMatch[2]
      isListItem = true
    }

    const parts = content.split(/(\*\*.*?\*\*)/g)
    const formattedContent = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>
      }
      return part
    })

    if (isListItem) {
      return (
        <span key={lineIdx} style={{ display: 'block', paddingLeft: '14px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '0' }}>•</span>
          {formattedContent}
        </span>
      )
    }

    return (
      <span key={lineIdx} style={{ display: 'block', minHeight: line === '' ? '0.5em' : 'auto' }}>
        {formattedContent}
      </span>
    )
  })
}

const CHATBOT_ICON_SRC = '/parma-official-crest.png'

type Intent =
  | 'greeting'
  | 'services'
  | 'inn'
  | 'spa'
  | 'healthcare'
  | 'meditation'
  | 'contact'
  | 'default'


function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim()
}

function detectIntent(inputRaw: string): Intent {
  const input = normalize(inputRaw)
  if (!input) return 'default'

  if (/(hi|hello|hey|good (morning|afternoon|evening))/.test(input)) return 'greeting'
  if (/(inn|suite|room|stay|accommodation|tapestry|panther|red room|lounge)/.test(input)) return 'inn'
  if (/(spa|ayurveda|abhyanga|massage|kathi basti|vichy|heat|hammam|facial)/.test(input)) return 'spa'
  if (/(health|doctor|physician|thara|concierge|medical|teleconsult|opinion)/.test(input)) return 'healthcare'
  if (/(meditation|yoga|asana|pranayama|sushila|shanti|bihar)/.test(input)) return 'meditation'
  if (/(contact|reserve|book|phone|email|address|location|where)/.test(input)) return 'contact'
  if (/(service|world|experience|offer)/.test(input)) return 'services'

  return 'default'
}

function buildReply(intent: Intent): string {
  switch (intent) {
    case 'greeting':
      return `Welcome to Parma in Little Washington. How may I assist you with your sanctuary stay, Ayurvedic spa, concierge healthcare, or meditation inquiry?`
    case 'inn':
      return `Parma Inn offers four luxury suites: The Tapestry Room, The Panther Suite, The Red Room, and The Lounge. Furnished with Baker and Nancy Corzine pieces, rich fabrics, and sterling silver. You can reserve by calling 540 987 8588.`
    case 'spa':
      return `Parma Spa features authentic 5,000-year-old Ayurvedic therapies. Our Ayurvedic doctor provides pulse and dosha evaluations, prescribing Abhyanga oil treatments, Kathi Basti, Hammam heat steam, Vichy shower soaks, and signature Jewel Facials.`
    case 'healthcare':
      return `Parma Healthcare provides concierge integrative medicine led by Dr. Thara Kodandaramachandra. We arrange unhurried physician consults and second opinions with top specialists from Mayo Clinic and Cleveland Clinic.`
    case 'meditation':
      return `The Sushila Shanti Meditation Centre offers guided asana, pranayama breathwork, and Yoga Nidra meditation in the lineage of the Bihar School of Yoga in our quiet Blue Ridge sanctuary.`
    case 'contact':
      return `Parma in Little Washington is located at 105 Christmas Tree Lane, Washington, VA 22747.\nPhone: 540 987 8588\nEmail: info@parmainlittlewashington.com`
    case 'services':
      return `Parma in Little Washington encompasses four worlds:\n• Parma Inn (Luxury Suites)\n• Parma Spa (Ayurveda & Aqua)\n• Parma Healthcare (Concierge Care)\n• Sushila Shanti Meditation Centre`
    default:
      return `How can we help custom-tailor your visit to Parma in Little Washington? Feel free to ask about suites, Ayurvedic spa treatments, healthcare consultations, or reservations.`
  }
}

export default function FloatingHelp() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [unread, setUnread] = useState(1)
  const [isTyping, setIsTyping] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    {
      id: uid(),
      role: 'bot',
      text: `Welcome to Parma in Little Washington. How can we assist your sanctuary stay or wellness consultation?`,
    },
  ])

  const panelRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id))
    }
  }, [])

  const quickReplies = useMemo(
    () => [
      'What suites are available?',
      'Ayurvedic spa therapies',
      'Parma Healthcare consults',
      'Sushila Shanti Meditation',
      'Reserve / Contact',
    ],
    []
  )

  useEffect(() => {
    if (!open) return
    setUnread(0)
    const id = requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(id)
  }, [open, msgs.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const triggerLocalFallback = (cleaned: string) => {
    const intent = detectIntent(cleaned)
    const reply = buildReply(intent)
    const timerId = window.setTimeout(() => {
      setMsgs((prev) => [...prev, { id: uid(), role: 'bot', text: reply }])
      if (!open) setUnread((u) => Math.min(9, u + 1))
      timeoutsRef.current = timeoutsRef.current.filter((id) => id !== timerId)
    }, 200)
    timeoutsRef.current.push(timerId)
  }

  const send = async (text: string) => {
    const cleaned = text.trim()
    if (!cleaned) return
    setMsgs((prev) => [...prev, { id: uid(), role: 'user', text: cleaned }])
    setInput('')

    setIsTyping(true)
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleaned }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      setIsTyping(false)

      const botMsgId = uid()
      setMsgs((prev) => [...prev, { id: botMsgId, role: 'bot', text: '' }])

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No stream reader available')
      }
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const dataStr = line.slice(6).trim()
          if (dataStr === '[DONE]') break

          try {
            const parsed = JSON.parse(dataStr)
            if (parsed.token) {
              accumulated += parsed.token
              setMsgs((prev) =>
                prev.map((m) => (m.id === botMsgId ? { ...m, text: accumulated } : m))
              )
            }
          } catch (e) {
            // Ignore malformed JSON
          }
        }
      }

      if (!accumulated.trim()) {
        throw new Error('Empty response from AI')
      }

    } catch (err) {
      setIsTyping(false)
      triggerLocalFallback(cleaned)
    }
  }

  return (
    <div className="fh-root" aria-live="polite">
      <div className={`fh-panel${open ? ' fh-panel--open' : ''}`} ref={panelRef} role="dialog" aria-label="Parma Concierge">
        <div className="fh-header">
          <div className="fh-title">
            <div className="fh-title-name">Parma Concierge</div>
            <div className="fh-title-sub">Private Sanctuary in Little Washington</div>
          </div>
          <button className="fh-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="fh-list" ref={listRef}>
          {msgs.map((m) => (
            <div key={m.id} className={`fh-msg fh-msg--${m.role}`}>
              <div className="fh-bubble">{formatMessageText(m.text)}</div>
            </div>
          ))}

          {isTyping && (
            <div className="fh-msg fh-msg--bot">
              <div className="fh-bubble fh-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div className="fh-quick">
            {quickReplies.map((q) => (
              <button key={q} className="fh-quick-btn" onClick={() => send(q)} type="button">
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="fh-actions">
          <div className="fh-input-wrap">
            <input
              className="fh-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire about suites, spa, or healthcare..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') send(input)
              }}
            />
            <button className="fh-send" onClick={() => send(input)} type="button" aria-label="Send">
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="fh-fab-stack">
        <button className="fh-fab fh-fab--wa" onClick={openSupportWhatsApp} aria-label="Contact Concierge" type="button">
          <svg className="fh-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            />
          </svg>
        </button>
        <button className="fh-fab fh-fab--bot" onClick={() => setOpen((v) => !v)} aria-label="Open Parma Concierge" type="button">
          <img className="fh-icon-img" src={CHATBOT_ICON_SRC} alt="Parma emblem" decoding="async" style={{ objectFit: 'contain' }} />
          {unread > 0 ? <span className="fh-badge" aria-label={`${unread} new messages`}>{unread}</span> : null}
        </button>
      </div>
    </div>
  )
}

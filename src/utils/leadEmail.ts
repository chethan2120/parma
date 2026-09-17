export type LeadEmailMeta = {
  source: string
  subject?: string
}

const SUPPORT_EMAIL = 'support@webnxt.co'
const EMAILJS_SERVICE_ID = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined)?.trim()
const EMAILJS_TEMPLATE_ID = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim()
const EMAILJS_PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined)?.trim()
const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim()


function safeString(value: unknown) {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  return String(value).trim()
}

function buildBody(form: HTMLFormElement, meta: LeadEmailMeta): string {
  const fd = new FormData(form)
  const fields: { label: string; value: string }[] = []
  let resumeFilename = ''
  let resumeDriveUrl = ''

  for (const [rawKey, rawValue] of fd.entries()) {
    const raw = safeString(rawKey)
    if (!raw) continue

    if (raw === 'resume_drive_url') {
      resumeDriveUrl = safeString(rawValue)
      continue
    }

    if (rawValue instanceof File) {
      if (rawValue.name) resumeFilename = rawValue.name
      continue
    }

    const value = safeString(rawValue)
    if (!value) continue

    fields.push({ label: raw, value })
  }

  const sep = '─'.repeat(52)
  const timestamp = new Date().toLocaleString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const lines: string[] = [
    sep,
    `NEW LEAD — ${(meta.subject ?? meta.source).toUpperCase()}`,
    sep,
    `Source   : ${meta.source}`,
    `Received : ${timestamp}`,
    sep,
    '',
  ]

  for (const { label, value } of fields) {
    lines.push(`${label.padEnd(24)}: ${value}`)
  }

  if (resumeFilename || resumeDriveUrl) {
    lines.push('')
    lines.push(sep)
    lines.push('📎  RESUME / CV')
    lines.push(sep)
    if (resumeFilename) lines.push(`File name : ${resumeFilename}`)
    if (resumeDriveUrl) {
      lines.push(``)
      lines.push(`▶  DOWNLOAD RESUME (click the link below):`)
      lines.push(`${resumeDriveUrl}`)
      lines.push(``)
      lines.push(`Tip: Open the link → click the download icon (top-right) to save the file.`)
    } else {
      lines.push(``)
      lines.push(`⚠  The file could not be saved to Drive automatically.`)
      lines.push(`   Please reply to the applicant and ask them to share their resume directly.`)
    }
  }

  if (!fields.length && !resumeFilename && !resumeDriveUrl) {
    lines.push('(No form fields captured)')
  }

  lines.push('')
  lines.push(sep)

  return lines.join('\n')
}

function openMailto(subject: string, body: string) {
  try {
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailto, '_self')
  } catch {
    // silently fail if mailto is blocked
  }
}

async function sendViaWeb3Forms(subject: string, source: string, body: string): Promise<void> {
  const fd = new FormData()
  fd.set('access_key', WEB3FORMS_KEY!)
  fd.set('subject', subject)
  fd.set('from_name', `WebNxt — ${source}`)
  fd.set('message', body)
  const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
  const data: { success: boolean; message?: string } = await res.json()
  if (!data.success) throw new Error(data.message ?? 'Web3Forms submission failed')
}

export async function sendLeadToSupportEmail(form: HTMLFormElement, meta: LeadEmailMeta) {
  const subject = safeString(meta.subject) || `New lead (${meta.source})`
  const body = buildBody(form, meta)

  // Priority 1: EmailJS
  const canUseEmailJs = Boolean(
    EMAILJS_SERVICE_ID?.trim() &&
    EMAILJS_TEMPLATE_ID?.trim() &&
    EMAILJS_PUBLIC_KEY?.trim()
  )

  if (canUseEmailJs) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: { subject, message: body, source: meta.source, website: 'Webnxt India', region: 'India', currency: 'INR' },
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error(`[leadEmail] EmailJS ${res.status}:`, text)
        throw new Error(text)
      }
      return { ok: true, used: 'emailjs' as const }
    } catch (err) {
      console.warn('[leadEmail] EmailJS failed, using fallback:', err)
    }
  }

  // Priority 2: Web3Forms
  if (WEB3FORMS_KEY?.trim()) {
    try {
      await sendViaWeb3Forms(subject, meta.source, body)
      return { ok: true, used: 'web3forms' as const }
    } catch (err) {
      console.warn('[leadEmail] Web3Forms failed, trying mailto fallback:', err)
    }
  }

  // Priority 3: mailto fallback (never throws)
  openMailto(subject, body)
  return { ok: true, used: 'mailto' as const }
}

const SUPPORT_WHATSAPP_E164 = '15409878588' as const

/** Prefilled chat text for Parma in Little Washington. */
export const DEFAULT_WHATSAPP_MESSAGE = 'Hi, I am interested in reserving a stay or wellness consultation at Parma in Little Washington.' as const

export function getSupportWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE) {
  const safe =
    typeof message === 'string' && message.trim().length > 0 ? message : DEFAULT_WHATSAPP_MESSAGE
  const text = encodeURIComponent(safe)
  return `https://wa.me/${SUPPORT_WHATSAPP_E164}?text=${text}`
}

export function openSupportWhatsApp(messageOrEvent?: unknown) {
  const message =
    typeof messageOrEvent === 'string' && messageOrEvent.trim().length > 0
      ? messageOrEvent
      : DEFAULT_WHATSAPP_MESSAGE
  window.open(getSupportWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
}

const PARMA_HEADER_LOGO = '/parma-official-crest.png'

type Props = {
  /** Page-scoped class for layout tweaks, e.g. `ab-logo`, `sp-logo`. */
  pageClass: string
  onHome: () => void
}

export function WebnxtHeaderLogo({ pageClass, onHome }: Props) {
  return (
    <a
      href="/"
      className={`logo-mark ${pageClass}`.trim()}
      onClick={(event) => {
        event.preventDefault()
        onHome()
      }}
      aria-label="Parma in Little Washington, go to home"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}
    >
      <img
        className="logo-img"
        src={PARMA_HEADER_LOGO}
        alt="Parma Crest Logo"
        style={{ height: '56px', width: 'auto', objectFit: 'contain', display: 'block' }}
        decoding="async"
      />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontSize: '1.75rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: '#F4EBDD',
          margin: 0,
          padding: 0,
          lineHeight: 1
        }}>
          Parma
        </h2>
        <h4 style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontSize: '0.95rem',
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'rgba(244, 235, 221, 0.85)',
          margin: 0,
          marginTop: '2px',
          padding: 0,
          lineHeight: 1
        }}>
          in Little Washington.
        </h4>
      </div>
    </a>
  )
}


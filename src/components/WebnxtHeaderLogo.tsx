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
        style={{ height: 'clamp(52px, 6.2vw, 84px)', width: 'auto', objectFit: 'contain', display: 'block' }}
        decoding="async"
      />
      <div className="brand-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
        <h1 className="brand-text-title" style={{
          fontFamily: "'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif",
          fontSize: 'clamp(26px, 3.2vw, 40px)',
          fontWeight: 600,
          letterSpacing: '0.03em',
          color: '#F5EFE5',
          margin: 0,
          padding: 0,
          lineHeight: 1
        }}>
          Parma
        </h1>
        <div className="brand-text-sub" style={{
          fontFamily: "'Cormorant Garamond', 'Cinzel', 'Playfair Display', Georgia, serif",
          fontSize: 'clamp(14px, 1.4vw, 19px)',
          fontStyle: 'italic',
          fontWeight: 400,
          color: '#C49A52',
          margin: 0,
          marginTop: '2px',
          padding: 0,
          lineHeight: 1.2
        }}>
          in Little Washington.
        </div>
      </div>
    </a>
  )
}


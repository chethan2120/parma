import './HomeHeader.css'

interface HomeHeaderProps {
  onContact: () => void
  onMenuOpen: () => void
}

export function HomeHeader({ onContact, onMenuOpen }: HomeHeaderProps) {
  return (
    <header className="header">
      <div className="logo-mark" aria-label="Parma in Little Washington" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <img
          className="logo-img"
          src="/parma-official-crest.png"
          alt="Parma Crest Logo"
          style={{ height: '56px', width: 'auto', objectFit: 'contain', display: 'block' }}
          fetchPriority="high"
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
      </div>
      <div className="header-actions">
        <nav className="hero-social" aria-label="Parma contact options">
          <a
            href="tel:15409878588"
            className="hero-social-link"
            aria-label="Phone"
            title="Call 540 987 8588"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </a>
          <a
            href="mailto:info@parmainlittlewashington.com"
            className="hero-social-link"
            aria-label="Email"
            title="Email info@parmainlittlewashington.com"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
        </nav>
        <button className="btn-work" onClick={onContact}>
          Reserve Stay
          <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

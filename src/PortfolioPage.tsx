import { useEffect, useRef } from 'react'
import './PortfolioPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from './data/constants'
import {
  IMG_PARMA_INN,
  IMG_PANTHER_1,
  IMG_TAPESTRY_1,
  IMG_RED_ROOM_1,
  IMG_LOUNGE_2,
} from './data/assets'

interface SuiteItem {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  details: string[]
}

const INN_SUITES: SuiteItem[] = [
  {
    id: 'panther',
    title: 'The Panther Suite',
    subtitle: 'LUXURY SUITE ACCOMMODATION',
    description: 'Furnished with Nancy Corzine and Baker antiques, rich velvet brocades, and sterling silver. The Panther Suite offers expansive windows looking out onto private estate gardens.',
    image: IMG_PANTHER_1,
    details: ['King Estate Bed', 'Nancy Corzine Antiques', 'Private Ensuite Bath', 'Blue Ridge Views'],
  },
  {
    id: 'tapestry',
    title: 'The Tapestry Room',
    subtitle: 'HISTORIC TEXTILE SUITE',
    description: 'Woven historic tapestries, hand-carved mahogany furnishings, and warm lamplight create an intimate sanctuary for deep quiet and rest.',
    image: IMG_TAPESTRY_1,
    details: ['Woven Antique Tapestries', 'Hand-Carved Mahogany Bed', 'Sitting Parlor', 'Garden Access'],
  },
  {
    id: 'redroom',
    title: 'The Red Room',
    subtitle: 'HERITAGE GRAND SUITE',
    description: 'Featuring a stone hearth, velvet seating, and a historic collected atmosphere. Designed for guests seeking private solitude and old-world Virginia charm.',
    image: IMG_RED_ROOM_1,
    details: ['Stone Fireplace Hearth', 'Grand Piano & Library', 'Deep Soaking Tub', 'Estate Solitude'],
  },
  {
    id: 'lounge',
    title: 'The Sanctuary Lounge Suite',
    subtitle: 'PRIVATE ESTATE LOUNGE & SUITE',
    description: 'An elegant gathering space furnished with sterling silver tea sets, plush seating, and warm lamplight for evening conversation and relaxation.',
    image: IMG_LOUNGE_2,
    details: ['Sterling Silver Service', 'Fireplace Parlor', 'Plush Sofa Seating', 'Afternoon Refreshments'],
  },
]

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onContact: () => void
}

export default function PortfolioPage({ onMenuOpen, onHome, onContact }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  usePageMotion(rootRef)

  return (
    <div className="pp-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="pp-header">
        <WebnxtHeaderLogo pageClass="pp-logo" onHome={onHome} />
        <div className="header-actions">
          <nav className="hero-social" aria-label="Parma contact options">
            <a href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`} className="hero-social-link" aria-label="Phone" title={`Call ${SUPPORT_PHONE}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hero-social-link" aria-label="Email" title={`Email ${SUPPORT_EMAIL}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </nav>
          <button className="btn-work" onClick={onContact}>
            Reserve Your Stay
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── Lodging Hero (~65–75vh) ─────────────────────────── */}
      <section className="parma-inner-hero">
        <div className="parma-hero-container">
          <div className="parma-hero-text">
            <span className="parma-hero-eyebrow">PARMA INN · LITTLE WASHINGTON</span>
            <h1 className="parma-hero-h1">A stay shaped by stillness.</h1>
            <p className="parma-hero-desc">
              Four individually furnished luxury suites surrounded by the quiet beauty of Little Washington, Virginia — with old-world antiques, intimate hospitality and the Blue Ridge countryside beyond.
            </p>
            <button className="parma-hero-cta" onClick={onContact}>
              Explore the Suites ↗
            </button>
          </div>
          <div className="parma-hero-media">
            <img src={IMG_PARMA_INN} alt="Parma Inn Lodging Suite" fetchPriority="high" decoding="async" />
          </div>
        </div>
      </section>

      {/* ── SECTION 1 (IVORY): Estate Haven Introduction ─────── */}
      <section className="pp-main-photo-section sec-bg-ivory" style={{ padding: '80px 24px' }}>
        <div className="pp-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="pp-main-photo-frame">
            <img src={IMG_LOUNGE_2} alt="Parma Inn Estate Atmosphere" />
            <div className="pp-main-photo-caption">
              <span>HISTORIC ESTATE LODGING</span>
              <p>“Historic private estate hospitality surrounded by Blue Ridge mountain paths and quiet garden acreage.”</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 (WHITE): Four Luxury Suites Showcase ───── */}
      <section className="pp-suites-section sec-bg-white" style={{ padding: '96px 24px' }}>
        <div className="pp-container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="pp-section-head" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="pp-sub-kicker" style={{ color: '#CA6641', fontSize: '0.85rem', letterSpacing: '0.15em', fontWeight: 600 }}>SUITES &amp; ACCOMMODATIONS</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0' }}>Our Four Private Suites</h2>
            <p style={{ color: '#5A2E20', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto' }}>Each suite is individually appointed with curated antiques, fine linens, and quiet estate views.</p>
          </div>

          <div className="pp-suites-grid">
            {INN_SUITES.map((suite) => (
              <article key={suite.id} className="pp-suite-card">
                <div className="pp-suite-photo">
                  <img src={suite.image} alt={suite.title} loading="lazy" decoding="async" />
                </div>
                <div className="pp-suite-info">
                  <span className="pp-suite-sub">{suite.subtitle}</span>
                  <h3>{suite.title}</h3>
                  <p>{suite.description}</p>
                  <ul className="pp-suite-details">
                    {suite.details.map((detail) => (
                      <li key={detail}>✦ {detail}</li>
                    ))}
                  </ul>
                  <button className="pp-suite-btn" onClick={onContact}>
                    Inquire About {suite.title} →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 (TERRACOTTA): Old-World Antique Hospitality ── */}
      <section className="sec-bg-terracotta" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#F5EFE5', opacity: 0.9, fontWeight: 700 }}>CURATED ANTIQUES &amp; REFINED SOLITUDE</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', margin: '20px 0', color: '#F5EFE5' }}>
            A Sanctuary of Quiet Elegance
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.75', color: '#F5EFE5', opacity: 0.95, maxWidth: '820px', margin: '0 auto 36px' }}>
            Every room at Parma Inn is thoughtfully curated with Baker and Nancy Corzine antiques, hand-woven tapestries, sterling silver tea service, and warm hearths. Experience deep nervous-system rest in the heart of Virginia's historic hunt country.
          </p>
          <button className="parma-hero-cta" onClick={onContact} style={{ background: '#F5EFE5', color: '#32170F' }}>
            Reserve Your Stay →
          </button>
        </div>
      </section>

      {/* ── SECTION 4 (IVORY): Estate Grounds & Little Washington ─ */}
      <section className="sec-bg-ivory" style={{ padding: '88px 24px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.15em', color: '#CA6641', fontWeight: 700 }}>RAPPAHANNOCK COUNTY</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '16px 0' }}>Surrounded by Blue Ridge Beauty</h2>
            <p style={{ fontSize: '1.08rem', lineHeight: '1.7', color: '#5A2E20' }}>
              Located just one hour from Washington, D.C., Parma Inn provides effortless access to local mountain hiking trails, acclaimed wineries, historic architecture, and the renowned dining of Little Washington.
            </p>
          </div>
          <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.15)' }}>
            <img src={IMG_TAPESTRY_1} alt="Tapestry Suite & Gardens" style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── SECTION 5 (WHITE): Booking CTA ─────────────────── */}
      <section className="sec-bg-white" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '0 0 16px' }}>Begin Your Parma Inn Reservation</h2>
          <p style={{ fontSize: '1.1rem', color: '#5A2E20', marginBottom: '32px' }}>Contact our sanctuary concierge to arrange your stay in Little Washington.</p>
          <button className="parma-hero-cta" onClick={onContact}>
            Get in Touch ↗
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <Footer onContact={onContact} />
    </div>
  )
}

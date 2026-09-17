import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './RealEstatePage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import {
  IMG_PARMA_INN,
  IMG_VISION,
  IMG_WINERIES,
  IMG_THINGS_TO_DO,
  IMG_LOUNGE_2,
} from './data/assets'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onServices?: () => void
  onPortfolio?: () => void
  onCareers?: () => void
}

export default function RealEstatePage({ onMenuOpen, onHome, onPortfolio }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  const handleEnquire = () => navigate('/contact')

  return (
    <div className="re-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="re-header">
        <WebnxtHeaderLogo pageClass="re-logo" onHome={onHome} />
        <div className="header-actions">
          <nav className="hero-social" aria-label="Parma contact options">
            <a href="tel:15409878588" className="hero-social-link" aria-label="Phone" title="Call 540 987 8588">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
            <a href="mailto:info@parmainlittlewashington.com" className="hero-social-link" aria-label="Email" title="Email info@parmainlittlewashington.com">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </nav>
          <button className="btn-work" onClick={handleEnquire}>
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

      <main className="re-main">
        {/* ── Architectural Hero ────────────────────────────── */}
        <section className="re-hero-architectural">
          <div className="re-hero-text">
            <span className="re-kicker">RAPPAHANNOCK COUNTY ESTATE &amp; SURROUNDINGS</span>
            <h1>The Parma Estate &amp; Countryside Setting</h1>
            <p>
              Situated amidst rolling Blue Ridge foothills, historical Virginia countryside, and private sanctuary grounds, Parma in Little Washington offers unmatched peace and seclusion.
            </p>
            <div className="re-hero-actions">
              <button className="re-btn-primary" onClick={handleEnquire}>
                Contact Sanctuary Concierge
              </button>
              {onPortfolio && (
                <button className="re-btn-ghost" onClick={onPortfolio}>
                  Explore Parma Inn Suites ↗
                </button>
              )}
            </div>
          </div>

          <div className="re-hero-frame">
            <img src={IMG_PARMA_INN} alt="Parma Estate Grounds & Inn" className="re-hero-img" />
            <div className="re-badge-tag">
              <span>WASHINGTON, VIRGINIA</span>
              <strong>Founded 1769</strong>
            </div>
          </div>
        </section>

        {/* ── Key Surroundings Overview ───────────────────────── */}
        <section className="re-surroundings-section">
          <div className="re-container">
            <div className="re-section-head">
              <span className="re-kicker">SANCTUARY ENVIRONMENT</span>
              <h2>Refined Seclusion in Historic Virginia</h2>
              <p>
                Located a couple of miles from historical Washington, Virginia (surveyed by George Washington in 1769), the Parma estate enjoys effortless access to Shenandoah National Park, local vineyards, and equestrian countryside.
              </p>
            </div>

            {/* Alternating Image / Copy Sections */}
            <div className="re-alternating-grid">
              {/* Feature 1: The Estate Grounds */}
              <div className="re-feature-row">
                <div className="re-feature-media">
                  <img src={IMG_VISION} alt="Parma Estate & Private Grounds" loading="lazy" />
                </div>
                <div className="re-feature-copy">
                  <span className="re-sub-kicker">PRIVATE ESTATE SOLITUDE</span>
                  <h3>Lush Blue Ridge Foothills &amp; Ponds</h3>
                  <p>
                    Nestled on 105 Christmas Tree Lane, Parma offers expansive natural gardens, serene water features, and tranquil walking trails designed for deep mental rest and physical restoration.
                  </p>
                  <ul className="re-bullet-list">
                    <li>1 Hour from Washington, D.C.</li>
                    <li>Unspoiled Rappahannock County vistas</li>
                    <li>Surrounded by pristine Blue Ridge air</li>
                  </ul>
                </div>
              </div>

              {/* Feature 2: Countryside Culture & Wineries */}
              <div className="re-feature-row re-feature-row--reverse">
                <div className="re-feature-media">
                  <img src={IMG_WINERIES} alt="Local Virginia Wineries & Vineyards" loading="lazy" />
                </div>
                <div className="re-feature-copy">
                  <span className="re-sub-kicker">LOCAL HERITAGE &amp; TASTINGS</span>
                  <h3>Artisanal Wineries &amp; Fine Dining</h3>
                  <p>
                    Rappahannock County is celebrated for its world-class wineries, organic farm-to-table dining, equestrian traditions, and historic village atmosphere.
                  </p>
                  <ul className="re-bullet-list">
                    <li>Private Virginia vineyard tours</li>
                    <li>Historic Washington, VA fine dining</li>
                    <li>Equestrian trails &amp; countryside golf</li>
                  </ul>
                </div>
              </div>

              {/* Feature 3: Natural Wonders & Excursions */}
              <div className="re-feature-row">
                <div className="re-feature-media">
                  <img src={IMG_THINGS_TO_DO} alt="Shenandoah & Luray Caverns Excursions" loading="lazy" />
                </div>
                <div className="re-feature-copy">
                  <span className="re-sub-kicker">RECREATION &amp; NATURE</span>
                  <h3>Luray Caverns &amp; Shenandoah Excursions</h3>
                  <p>
                    Guests enjoy easy proximity to Luray Caverns, Skyline Drive, mountain hiking trails, and historical landmarks that define Virginia's natural beauty.
                  </p>
                  <button className="re-text-link" onClick={handleEnquire}>
                    Inquire About Estate Access ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Architecture & Accommodations Teaser ───────────── */}
        <section className="re-interior-teaser">
          <div className="re-interior-bg">
            <img src={IMG_LOUNGE_2} alt="Parma Inn Interior Architecture" />
          </div>
          <div className="re-interior-content">
            <span className="re-kicker" style={{ color: '#CA6641' }}>ARCHITECTURAL ELEGANCE</span>
            <h2>Old-World Antiques &amp; Refined Lodging</h2>
            <p>
              Parma Inn features exquisite interior architecture furnished with Nancy Corzine and Baker antiques, rich velvet brocades, and sterling silver finishes.
            </p>
            <button className="re-btn-primary" onClick={handleEnquire} style={{ marginTop: '24px' }}>
              Enquire For Estate Details
            </button>
          </div>
        </section>

        {/* ── Contact Pathway CTA ────────────────────────────── */}
        <section className="re-enquiry-pathway">
          <div className="re-pathway-box">
            <h2>Experience Parma in Little Washington</h2>
            <p>
              For further information regarding the Parma estate, surroundings, or sanctuary lodging reservations, please contact our concierge team.
            </p>
            <div className="re-pathway-actions">
              <button className="re-btn-primary" onClick={handleEnquire}>
                Contact Sanctuary Concierge
              </button>
              <a href="mailto:info@parmainlittlewashington.com" className="re-btn-secondary">
                Email info@parmainlittlewashington.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer onContact={handleEnquire} />
    </div>
  )
}

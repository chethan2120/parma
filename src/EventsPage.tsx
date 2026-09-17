import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import './EventsPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import { IMG_YOGA, IMG_AYURVEDA_MAIN, IMG_HEALTH_1, IMG_PARMA_HERO_17, IMG_VISION } from './data/assets'

const TEAL_CLIP: CSSProperties = {
  backgroundImage: 'linear-gradient(172deg, #C49A52 9.56%, #D2AE6D 57.79%, #CA6641 104.57%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onOpenSummit?: () => void
  onCareers?: () => void
}

export default function EventsPage({ onMenuOpen, onHome }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  const handleEnquire = () => navigate('/contact')

  return (
    <div className="ev-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="ev-header">
        <WebnxtHeaderLogo pageClass="ev-logo" onHome={onHome} />
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

      <main className="ev-main">
        {/* ── Editorial Hero ─────────────────────────────────── */}
        <section className="ev-hero-editorial">
          <div className="ev-hero-header">
            <span className="ev-kicker" style={TEAL_CLIP}>SANCTUARY GATHERINGS &amp; RETREATS</span>
            <h1 className="ev-hero-heading">
              Gatherings Shaped Around Quiet &amp; Rest
            </h1>
            <p className="ev-hero-sub">
              Experience mindful meditation, wellness immersions, and health symposiums in the tranquil countryside of Little Washington, Virginia.
            </p>
          </div>

          {/* ── Dominant Image Feature ─────────────────────────── */}
          <div className="ev-hero-dominant-frame">
            <img
              src={IMG_PARMA_HERO_17}
              alt="Parma in Little Washington Sanctuary Grounds"
              className="ev-dominant-img"
            />
            <div className="ev-dominant-caption">
              <span>Sushila Shanti Meditation Grounds • Washington, VA</span>
              <p>“A private haven where natural Blue Ridge beauty cradles deep restorative healing.”</p>
            </div>
          </div>
        </section>

        {/* ── Storytelling Layout ──────────────────────────────── */}
        <section className="ev-story-section">
          <div className="ev-section-title-wrap">
            <span className="ev-kicker">PARMA EXPERIENCE GATHERINGS</span>
            <h2>Supported Sanctuary Offerings</h2>
          </div>

          <div className="ev-story-grid">
            {/* Story Item 1: Meditation */}
            <article className="ev-story-item ev-story-item--large">
              <div className="ev-story-media">
                <img src={IMG_YOGA} alt="Sushila Shanti Meditation" loading="lazy" />
              </div>
              <div className="ev-story-content">
                <span className="ev-category-pill">SPIRITUAL &amp; MINDFUL REST</span>
                <h3>Sushila Shanti Meditation Gatherings</h3>
                <p>
                  Connect with inner life force through guided asana, pranayama breathwork, and systematic Yoga Nidra relaxation in the lineage of the Bihar School of Yoga.
                </p>
                <button className="ev-link-btn" onClick={handleEnquire}>
                  Inquire for Meditation Schedules ↗
                </button>
              </div>
            </article>

            {/* Story Item 2: Spa Immersions */}
            <article className="ev-story-item ev-story-item--reverse">
              <div className="ev-story-media">
                <img src={IMG_AYURVEDA_MAIN} alt="Ayurvedic Spa Immersions" loading="lazy" />
              </div>
              <div className="ev-story-content">
                <span className="ev-category-pill">AYURVEDIC WELLNESS</span>
                <h3>Sanctuary Spa &amp; Healing Immersions</h3>
                <p>
                  Multi-day spa gatherings centered around authentic 5,000-year-old Ayurvedic principles, pulse evaluations, warm oil therapies, Hammam heat, and Vichy aqua soaks.
                </p>
                <button className="ev-link-btn" onClick={handleEnquire}>
                  Inquire for Spa Immersions ↗
                </button>
              </div>
            </article>

            {/* Story Item 3: Healthcare Consultations */}
            <article className="ev-story-item">
              <div className="ev-story-media">
                <img src={IMG_HEALTH_1} alt="Integrative Healthcare Consultations" loading="lazy" />
              </div>
              <div className="ev-story-content">
                <span className="ev-category-pill">CONCIERGE MEDICINE</span>
                <h3>Integrative Health &amp; Specialist Reviews</h3>
                <p>
                  Personalized healthcare sessions led by Medical Director Dr. Sadhna Nicky Singh and Dr. Thara Kodandaramachandra, with top specialist consultations from Mayo Clinic &amp; Cleveland Clinic experts.
                </p>
                <button className="ev-link-btn" onClick={handleEnquire}>
                  Inquire for Health Consultations ↗
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* ── Environment Atmosphere Section ──────────────────── */}
        <section className="ev-atmosphere-section">
          <div className="ev-atmosphere-bg">
            <img src={IMG_VISION} alt="Parma Countryside Sanctuary" />
          </div>
          <div className="ev-atmosphere-card">
            <span className="ev-kicker" style={{ color: '#CA6641' }}>LITTLE WASHINGTON COUNTRYSIDE</span>
            <h2>An Atmosphere of Absolute Privacy</h2>
            <p>
              Located just one hour from Washington D.C. in Rappahannock County, Parma provides a serene backdrop of Blue Ridge mountains, fresh country air, and private estate solitude.
            </p>
          </div>
        </section>

        {/* ── Final Strong CTA ────────────────────────────────── */}
        <section className="ev-final-cta">
          <div className="ev-cta-container">
            <h2>Plan an Event at Parma</h2>
            <p>
              For inquiries regarding quiet wellness retreats, meditation sessions, or private health consults, please reach out to our sanctuary concierge.
            </p>
            <div className="ev-cta-buttons">
              <button className="ev-btn-primary" onClick={handleEnquire}>
                Enquire About Events
              </button>
              <a href="tel:15409878588" className="ev-btn-secondary">
                Call 540 987 8588
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer onContact={handleEnquire} />
    </div>
  )
}

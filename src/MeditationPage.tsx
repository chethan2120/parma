import { useEffect, useRef } from 'react'
import './MeditationPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from './data/constants'
import { IMG_YOGA } from './data/assets'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onContact: () => void
}

export default function MeditationPage({ onMenuOpen, onHome, onContact }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  return (
    <div className="me-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="me-header">
        <WebnxtHeaderLogo pageClass="me-logo" onHome={onHome} />
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
            Reserve Meditation
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main className="me-main">
        {/* ── Meditation Hero (~65–75vh) ───────────────────────── */}
        <section className="parma-inner-hero">
          <div className="parma-hero-container">
            <div className="parma-hero-text">
              <span className="parma-hero-eyebrow">SUSHILA SHANTI MEDITATION</span>
              <h1 className="parma-hero-h1">A quieter place<br />within.</h1>
              <p className="parma-hero-desc">
                Grounded in the revered lineage of the Bihar School of Yoga. Experience guided yoga asana, pranayama breathwork, and deep Yoga Nidra in our quiet Blue Ridge sanctuary for contemplative wellness.
              </p>
              <button className="parma-hero-cta" onClick={onContact}>
                Explore Meditation ↗
              </button>
            </div>
            <div className="parma-hero-media">
              <img src={IMG_YOGA} alt="Sushila Shanti Meditation" fetchPriority="high" decoding="async" />
            </div>
          </div>
        </section>

        {/* ── SECTION 1 (IVORY): Sushila Shanti Lineage ───────── */}
        <section className="sec-bg-ivory" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>THE SUSHILA SHANTI LINEAGE</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
                Reconnecting with Your Inner Life Force
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#5A2E20', marginBottom: '24px' }}>
                The Sushila Shanti Meditation Centre offers an oasis of profound calm where mind, body, and breath converge. Surrounded by the gentle silence of Rappahannock County, guests are invited to slow down, release cognitive fatigue, and listen inward.
              </p>
            </div>
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
              <img src={IMG_YOGA} alt="Meditation Practice" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* ── SECTION 2 (WHITE): Three Pillars of Practice ─────── */}
        <section className="sec-bg-white" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>CONTEMPLATIVE PRACTICE</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#32170F', margin: '16px 0' }}>Three Pillars of Meditation</h2>
              <p style={{ color: '#5A2E20', fontSize: '1.1rem' }}>Rooted in traditional Bihar School of Yoga practices for inner stillness.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
              <div style={{ padding: '32px', backgroundColor: '#F5EFE5', borderRadius: '18px', border: '1px solid rgba(198, 156, 109, 0.35)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#32170F', margin: '0 0 12px' }}>Pranayama Breathwork</h3>
                <p style={{ fontSize: '1rem', color: '#5A2E20', lineHeight: 1.6, margin: 0 }}>Conscious regulation of breath to calm the nervous system, release anxiety, and expand vital life force energy.</p>
              </div>
              <div style={{ padding: '32px', backgroundColor: '#F5EFE5', borderRadius: '18px', border: '1px solid rgba(198, 156, 109, 0.35)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#32170F', margin: '0 0 12px' }}>Yoga Nidra Relaxation</h3>
                <p style={{ fontSize: '1rem', color: '#5A2E20', lineHeight: 1.6, margin: 0 }}>Systematic psychic sleep and deep conscious relaxation designed to release deep-seated subconscious tension.</p>
              </div>
              <div style={{ padding: '32px', backgroundColor: '#F5EFE5', borderRadius: '18px', border: '1px solid rgba(198, 156, 109, 0.35)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#32170F', margin: '0 0 12px' }}>Bihar School Lineage</h3>
                <p style={{ fontSize: '1.1rem', color: '#5A2E20', lineHeight: 1.6, margin: 0 }}>Authentic spiritual practices focused on mental harmony, emotional clarity, and unshakeable inner peace.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3 (TERRACOTTA): Silence & Inner Refuge ──── */}
        <section className="sec-bg-terracotta" style={{ padding: '96px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#F5EFE5', opacity: 0.9, fontWeight: 700 }}>THE POWER OF STILLNESS</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#F5EFE5', margin: '20px 0' }}>
              “In silence, the mind settles and the spirit remembers its natural wholeness.”
            </h2>
            <p style={{ fontSize: '1.18rem', color: '#F5EFE5', opacity: 0.9, marginBottom: '32px' }}>
              Join our quiet mountain sessions led by experienced meditation practitioners.
            </p>
            <button className="parma-hero-cta" onClick={onContact} style={{ background: '#F5EFE5', color: '#32170F' }}>
              Inquire About Meditation →
            </button>
          </div>
        </section>

        {/* ── SECTION 4 (IVORY): Mountain Pavilion ────────────── */}
        <section className="sec-bg-ivory" style={{ padding: '88px 24px' }}>
          <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.15em', color: '#CA6641', fontWeight: 700 }}>MOUNTAIN VIEW PAVILION</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '16px 0', color: '#32170F' }}>
              Quiet Mountain Sanctuary
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#5A2E20', maxWidth: '780px', margin: '0 auto' }}>
              Sessions take place in our dedicated quiet pavilion overlooking the Blue Ridge foothills. Whether staying for a day retreat or a week-long lodging stay, meditation is woven into your Parma experience.
            </p>
          </div>
        </section>

        {/* ── SECTION 5 (WHITE): Inquire CTA ──────────────────── */}
        <section className="sec-bg-white" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#32170F', margin: '0 0 16px' }}>Reserve Your Meditation Retreat</h2>
            <p style={{ fontSize: '1.1rem', color: '#5A2E20', marginBottom: '32px' }}>Contact our sanctuary team for private or group meditation availability.</p>
            <button className="parma-hero-cta" onClick={onContact}>
              Get in Touch ↗
            </button>
          </div>
        </section>
      </main>

      <Footer onContact={onContact} />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './AboutPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import {
  IMG_TEAM_NICKEY,
  IMG_TEAM_THARA,
  IMG_TEAM_PRAHBU,
  IMG_VISION,
  IMG_PARMA_HERO_10,
} from './data/assets'

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
  onServices?: () => void
  onCareers?: () => void
}

const team = [
  {
    image: IMG_TEAM_NICKEY,
    name: 'Dr. Sadhna Nicky Singh',
    role: 'Founder & Medical Director',
    bio: 'Over 25 years of medical experience in women’s health and laser medicine, founding Parma to synthesize modern medicine with ancient healing traditions.',
    pos: 'center 15%',
  },
  {
    image: IMG_TEAM_THARA,
    name: 'Dr. Thara Kodandaramachandra',
    role: 'Integrative Medicine & Health Specialist',
    bio: 'Leading Parma Healthcare with a focus on holistic integrative care, second opinion teleconsultations, and specialist liaison.',
    pos: 'center 15%',
  },
  {
    image: IMG_TEAM_PRAHBU,
    name: 'Dr. P.R. Prabhu',
    role: 'Physician',
    bio: 'Experienced clinical physician bringing traditional clinical excellence, diagnostic depth, and compassionate patient care to Parma.',
    pos: 'center 20%',
  },
]

export default function AboutPage({ onMenuOpen, onHome, onServices, onCareers }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  const handleReserve = onCareers || (() => { window.location.href = '/contact' })
  const handleExplore = onServices || (() => { window.location.href = '/spa' })

  return (
    <div className="ab-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="ab-header">
        <WebnxtHeaderLogo pageClass="ab-logo" onHome={onHome} />
        <div className="header-actions">
          <nav className="hero-social" aria-label="Parma contact options">
            <a href="tel:15409878588" className="hero-social-link" aria-label="Phone" title="Call 540 987 8588">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
            <a href="mailto:info@parmainlittlewashington.com" className="hero-social-link" aria-label="Email" title="Email info@parmainlittlewashington.com">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </nav>
          <button className="btn-work" onClick={handleReserve}>
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

      <main className="ab-main">
        {/* ── About Hero (~65–75vh) ───────────────────────────── */}
        <section className="parma-inner-hero">
          <div className="parma-hero-container">
            <div className="parma-hero-text">
              <span className="parma-hero-eyebrow" style={TEAL_CLIP}>OUR STORY</span>
              <h1 className="parma-hero-h1">A sanctuary shaped<br />by intention.</h1>
              <p className="parma-hero-desc">
                Parma in Little Washington is a private wellness sanctuary situated in the Blue Ridge foothills of Washington, Virginia. Here, nature, luxury lodging, 5,000-year-old Ayurveda, concierge healthcare, and spiritual meditation form one cohesive refuge for body and soul.
              </p>
              <button className="parma-hero-cta" onClick={handleReserve}>
                Discover Parma ↗
              </button>
            </div>
            <div className="parma-hero-media">
              <img src={IMG_VISION} alt="Parma Vision & Estate" fetchPriority="high" decoding="async" />
            </div>
          </div>
        </section>

        {/* ── SECTION 1 (IVORY): Founding Story & Estate Setting ── */}
        <section className="sec-bg-ivory" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>OUR FOUNDING VISION</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
                Conceived as a Sanctuary of Rest &amp; Precision Care
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#5A2E20', marginBottom: '20px' }}>
                First came a dream: to create a sanctuary of natural beauty and quietude in historical Washington, Virginia, offering an experience that does not merely refresh for a moment, but creates a lasting shift toward health.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#5A2E20' }}>
                Founded by Medical Director Dr. Sadhna Nicky Singh, Parma synthesizes evidence-based concierge medical care with the profound wisdom of traditional Ayurvedic spa therapies and spiritual pranayama meditation.
              </p>
            </div>
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
              <img src={IMG_PARMA_HERO_10} alt="Parma Estate Heritage" style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* ── SECTION 2 (WHITE): Medical Leaders & Team ────────── */}
        <section className="sec-bg-white" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>EXPERT PHYSICIANS</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#32170F', margin: '16px 0' }}>
                Our Medical Leadership
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#5A2E20', maxWidth: '640px', margin: '0 auto' }}>
                Distinguished physicians dedicated to compassionate patient care and holistic health synthesis.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {team.map((member) => (
                <div key={member.name} style={{ backgroundColor: '#F5EFE5', borderRadius: '20px', padding: '24px', border: '1px solid rgba(198, 156, 109, 0.35)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '100%', height: '320px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#24140F' }}>
                    <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: member.pos, display: 'block' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#32170F', margin: '0 0 4px' }}>{member.name}</h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#CA6641', letterSpacing: '0.04em' }}>{member.role}</span>
                    <p style={{ fontSize: '0.98rem', color: '#5A2E20', lineHeight: 1.6, margin: '12px 0 0' }}>{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3 (TERRACOTTA): The Five Pillars of Parma ─── */}
        <section className="sec-bg-terracotta" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#F5EFE5', opacity: 0.9, fontWeight: 700 }}>THE SANCTUARY MODEL</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#F5EFE5', margin: '16px 0' }}>
                The Five Pillars of Parma
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#F5EFE5', opacity: 0.9, maxWidth: '640px', margin: '0 auto' }}>
                An integrated sanctuary experience for comprehensive nervous system restoration.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {[
                { title: 'Parma Inn Lodging', desc: '4 private luxury suites furnished with Baker & Nancy Corzine antiques.' },
                { title: 'Parma Spa', desc: '5,000-year-old Ayurvedic pulse assessments, Abhyanga, and Hammam heat.' },
                { title: 'Concierge Healthcare', desc: 'Integrative medical team, root cause diagnosis, and specialist liaison.' },
                { title: 'Sushila Shanti', desc: 'Guided Bihar School yoga asana, pranayama breathwork, and Yoga Nidra.' },
                { title: 'Blue Ridge Estate', desc: 'Quiet mountain acres, pristine air, and private garden sanctuary.' },
              ].map((p) => (
                <div key={p.title} style={{ backgroundColor: 'rgba(36, 20, 15, 0.45)', border: '1px solid rgba(196, 154, 82, 0.35)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#F5EFE5', margin: '0 0 10px' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(245, 239, 229, 0.88)', lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4 (IVORY): Rappahannock Setting ─────────── */}
        <section className="sec-bg-ivory" style={{ padding: '88px 24px' }}>
          <div style={{ maxWidth: '1140px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.15em', color: '#CA6641', fontWeight: 700 }}>LITTLE WASHINGTON, VIRGINIA</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', margin: '16px 0', color: '#32170F' }}>
              A Historic Blue Ridge Haven
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#5A2E20', maxWidth: '780px', margin: '0 auto' }}>
              Situated in Virginia’s historic Rappahannock County, Parma offers a refuge from urban noise just 60 miles from Washington, D.C.
            </p>
          </div>
        </section>

        {/* ── SECTION 5 (WHITE): Visit Plan CTA ───────────────── */}
        <section className="sec-bg-white" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#32170F', margin: '0 0 16px' }}>Plan Your Sanctuary Visit</h2>
            <p style={{ fontSize: '1.1rem', color: '#5A2E20', marginBottom: '32px' }}>Inquire about lodging suites, Ayurvedic spa retreats, or concierge medical consultations.</p>
            <button className="parma-hero-cta" onClick={handleExplore}>
              Explore Offerings ↗
            </button>
          </div>
        </section>
      </main>

      <Footer onContact={handleReserve} />
    </div>
  )
}

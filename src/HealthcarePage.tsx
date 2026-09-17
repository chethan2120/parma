import { useLayoutEffect, useRef } from 'react'
import './HealthcarePage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from './data/constants'
import {
  IMG_HEALTH_1,
  IMG_HEALTH_2,
  IMG_TEAM_NICKEY,
  IMG_TEAM_THARA,
  IMG_TEAM_PRAHBU,
} from './data/assets'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onContact: () => void
}

const HEALTHCARE_PILLARS = [
  {
    num: '01',
    title: 'Integrative Concierge Medicine',
    description: 'Unhurried physician consultations focused on root-cause diagnosis, health blueprints, lifestyle optimization, and preventive wellness.',
    icon: '🩺',
  },
  {
    num: '02',
    title: 'Second Opinion Teleconsultations',
    description: 'Direct specialist liaison with esteemed medical authorities at Mayo Clinic, Cleveland Clinic, and leading academic medical centers.',
    icon: '🔬',
  },
  {
    num: '03',
    title: 'Women’s Health & Laser Medicine',
    description: 'Advanced clinical aesthetic therapies, non-invasive laser treatments, and restorative wellness designed by Dr. Sadhna Nicky Singh.',
    icon: '✨',
  },
  {
    num: '04',
    title: 'Holistic Health Blueprints',
    description: 'Synthesizing modern diagnostics with 5,000-year-old Ayurvedic principles to create personalized longevity and vitality programs.',
    icon: '🌿',
  },
]

export default function HealthcarePage({ onMenuOpen, onHome, onContact }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  return (
    <div className="hc-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="hc-header">
        <WebnxtHeaderLogo pageClass="hc-logo" onHome={onHome} />
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

      <main className="hc-main">
        {/* ── Healthcare Hero (~65–75vh) ───────────────────────── */}
        <section className="parma-inner-hero">
          <div className="parma-hero-container">
            <div className="parma-hero-text">
              <span className="parma-hero-eyebrow">PARMA HEALTHCARE</span>
              <h1 className="parma-hero-h1">A quieter course<br />for your health.</h1>
              <p className="parma-hero-desc">
                When life arrives at a fork, chart a quieter course. Our holistic integrative team, headed by Dr. Thara Kodandaramachandra, helps you leave frenzy behind. You may have a specific medical concern, or need a second opinion. Parma’s physicians will liaison for you.
              </p>
              <button className="parma-hero-cta" onClick={onContact}>
                Request a Consult ↗
              </button>
            </div>
            <div className="parma-hero-media">
              <img src={IMG_HEALTH_1} alt="Parma Healthcare Consultation" fetchPriority="high" decoding="async" />
            </div>
          </div>
        </section>

        {/* ── SECTION 1 (IVORY): Holistic Integrative Care ──────── */}
        <section className="sec-bg-ivory" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>INTEGRATIVE MEDICINE</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
                Unhurried Physician Consultations
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#5A2E20', marginBottom: '24px' }}>
                Parma Healthcare delivers concierge integrative medicine where modern diagnostic precision meets 5,000-year-old holistic wisdom. Our physicians take time to understand your complete health narrative, focusing on root cause analysis, preventive blueprints, and longevity.
              </p>
            </div>
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
              <img src={IMG_HEALTH_2} alt="Clinical Physician Care" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* ── SECTION 2 (WHITE): Second Opinions & Expert Access ── */}
        <section className="sec-bg-white" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>SECOND OPINIONS &amp; EXPERT LIAISON</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
              Teleconsultations with Top Academic Minds
            </h2>
            <p style={{ fontSize: '1.18rem', lineHeight: '1.75', color: '#5A2E20', maxWidth: '860px', margin: '0 auto 36px' }}>
              Teleconsult with experts at Mayo Clinic, Cleveland Clinic, or a leading physician for your case — from the comfort of the Parma setting. Travel to the concierge expert, or stay local with the confidence that the country’s top medical minds concur.
            </p>
            <button className="parma-hero-cta" onClick={onContact}>
              Request a Consult ↗
            </button>
          </div>
        </section>

        {/* ── SECTION 3 (TERRACOTTA): Physicians & Medical Team ── */}
        <section className="sec-bg-terracotta" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#F5EFE5', opacity: 0.9, fontWeight: 700 }}>MEDICAL LEADERSHIP</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#F5EFE5', margin: '16px 0' }}>
                Our Esteemed Physicians
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#F5EFE5', opacity: 0.9, maxWidth: '640px', margin: '0 auto' }}>
                Dedicated medical leaders synthesizing academic excellence with holistic patient care.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
              {[
                {
                  img: IMG_TEAM_NICKEY,
                  name: 'Dr. Sadhna Nicky Singh',
                  title: 'Founder & Medical Director',
                  desc: 'Over 25 years of medical experience in women’s health and laser medicine, founding Parma to synthesize modern medicine with ancient healing traditions.',
                  pos: 'center 15%',
                },
                {
                  img: IMG_TEAM_THARA,
                  name: 'Dr. Thara Kodandaramachandra',
                  title: 'Integrative Medicine & Health Specialist',
                  desc: 'Leading Parma Healthcare with a focus on holistic integrative care, second opinion teleconsultations, and academic specialist liaison.',
                  pos: 'center 15%',
                },
                {
                  img: IMG_TEAM_PRAHBU,
                  name: 'Dr. P.R. Prabhu',
                  title: 'Physician',
                  desc: 'Experienced clinical physician bringing traditional clinical excellence, diagnostic depth, and compassionate patient care to Parma.',
                  pos: 'center 20%',
                },
              ].map((doc) => (
                <div key={doc.name} style={{ backgroundColor: 'rgba(36, 20, 15, 0.45)', border: '1px solid rgba(196, 154, 82, 0.35)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '100%', height: '320px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#1A0D08' }}>
                    <img src={doc.img} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: doc.pos, display: 'block' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#F5EFE5', margin: '0 0 4px' }}>{doc.name}</h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C49A52', letterSpacing: '0.04em' }}>{doc.title}</span>
                    <p style={{ fontSize: '0.98rem', color: 'rgba(245, 239, 229, 0.88)', lineHeight: 1.6, marginTop: '12px', margin: '12px 0 0' }}>{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4 (IVORY): Clinical Pillars ─────────────── */}
        <section className="sec-bg-ivory" style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>INTEGRATIVE MODEL</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>Our Clinical Pillars</h2>
              <p style={{ color: '#5A2E20', fontSize: '1.1rem' }}>Combining academic medical expertise with personalized luxury concierge support.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {HEALTHCARE_PILLARS.map((p) => (
                <div key={p.num} style={{ padding: '28px', backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(198, 156, 109, 0.3)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{p.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#32170F', margin: '0 0 8px' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.96rem', color: '#5A2E20', lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5 (WHITE): Request Consult ─────────────── */}
        <section className="sec-bg-white" style={{ padding: '88px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', color: '#32170F', margin: '0 0 16px' }}>Request a Healthcare Consultation</h2>
            <p style={{ fontSize: '1.12rem', color: '#5A2E20', marginBottom: '32px' }}>Connect with Dr. Thara Kodandaramachandra and our integrative medical team.</p>
            <button className="parma-hero-cta" onClick={onContact}>
              Request a Consult ↗
            </button>
          </div>
        </section>
      </main>

      <Footer onContact={onContact} />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './PackagesPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'

const TEAL_CLIP: CSSProperties = {
  backgroundImage: 'linear-gradient(172deg, #C49A52 9.56%, #D2AE6D 57.79%, #CA6641 104.57%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

const HEALTHCARE_OFFERINGS = [
  {
    tier: 'basic',
    title: 'Integrative Health Consultation',
    subtitle: 'Comprehensive physician evaluation',
    unit: 'Per Consultation',
    cta: 'Inquire for Details',
    features: [
      'Comprehensive Medical History Review',
      'Integrative Doctor Assessment with Dr. Thara',
      'Ayurvedic Dosha & Lifestyle Blueprint',
      'Personalized Natural Therapy Recommendations',
      'Direct Physician Follow-up',
    ],
  },
  {
    tier: 'pro',
    title: 'Second Opinion Teleconsultation',
    subtitle: 'National specialist reviews',
    unit: 'Per Teleconsult',
    cta: 'Book Teleconsultation',
    features: [
      'Liaison with Mayo Clinic & Cleveland Clinic Experts',
      'In-Depth Record & Diagnosis Audit',
      'Multidisciplinary Specialist Opinion',
      'Holistic & Clinical Treatment Guidance',
      'Secure Telehealth Portal Access',
    ],
    popular: true,
  },
  {
    tier: 'enterprise',
    title: 'Sanctuary Health Immersion',
    subtitle: 'Multi-day concierge retreat',
    unit: 'Per Sanctuary Stay',
    cta: 'Reserve Immersion Stay',
    features: [
      'Parma Inn Suite Lodging',
      'Full Concierge Medical Supervision',
      'Daily Ayurvedic Spa & Oil Therapies',
      'Private Asana & Meditation Sessions',
      'Complete Sanctuary Privacy in Blue Ridge',
    ],
  },
]

const HEALTHCARE_COMPARISON = [
  { feature: 'Physician Review', basic: 'Dr. Thara Consultation', pro: 'National Specialist Liaison', enterprise: 'Full Medical Director Supervision' },
  { feature: 'Ayurvedic Assessment', basic: 'Included', pro: 'Included', enterprise: 'Daily Dosha & Herb Evaluation' },
  { feature: 'Specialist Teleconsult', basic: 'Optional Add-on', pro: 'Mayo / Cleveland Clinic', enterprise: 'Multi-specialist Panel' },
  { feature: 'Sanctuary Suite Stay', basic: 'Available Separately', pro: 'Available Separately', enterprise: 'Full Inn Lodging Included' },
  { feature: 'Spa & Hydrotherapy', basic: 'Single Therapy', pro: 'Custom Spa Menu', enterprise: 'Daily Restorative Spa Suite' },
  { feature: 'Personalized Care', basic: 'Standard Plan', pro: 'Priority Concierge', enterprise: '24/7 Dedicated Care Team' },
]

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onCareers: () => void
}

export default function PackagesPage({ onMenuOpen, onHome, onCareers }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  usePageMotion(rootRef, {
    skipSelectors: ['.pk-cards-section', '.pk-table-section'],
  })

  return (
    <div className="pk-root page-motion-shell" ref={rootRef}>

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="pk-header">
        <WebnxtHeaderLogo pageClass="pk-logo" onHome={onHome} />
        <div className="header-actions">
          <button className="btn-work" onClick={onCareers}>
            Reserve Consultation
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="pk-hero">
        <div className="pk-orb pk-orb--tl" aria-hidden="true" />
        <div className="pk-orb pk-orb--br" aria-hidden="true" />
        <div className="pk-hero-content">
          <div className="pk-badge">
            <span style={TEAL_CLIP}>Concierge Medicine &amp; Teleconsultations</span>
          </div>
          <h1 className="pk-heading">
            Parma <span style={TEAL_CLIP}>Healthcare.</span>
          </h1>
          <p className="pk-subtext">
            Holistic integrative physician care led by Dr. Thara Kodandaramachandra,<br />
            providing second opinions and teleconsultations alongside specialists from Mayo Clinic and Cleveland Clinic.
          </p>
        </div>
      </section>

      {/* ── Cards Section ───────────────────────────────────── */}
      <section className="pk-cards-section">
        <div className="pk-cards">
          {HEALTHCARE_OFFERINGS.map((c) => (
            <div key={c.title} className={`pk-card${c.popular ? ' pk-card--popular' : ''}`}>
              {c.popular && <div className="pk-popular-tag">MOST REQUESTED</div>}
              <h3 className="pk-card-title">{c.title}</h3>
              <p className="pk-card-sub">{c.subtitle}</p>

              <div className="pk-price-block">
                <span className="pk-price-val" style={TEAL_CLIP}>{c.unit}</span>
              </div>

              <button className={`pk-cta-btn${c.popular ? ' pk-cta-btn--popular' : ''}`} type="button" onClick={onCareers}>
                {c.cta}
              </button>

              <ul className="pk-features">
                {c.features.map((f) => (
                  <li key={f}>
                    <span className="pk-check" aria-hidden="true">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ────────────────────────────────── */}
      <section className="pk-table-section">
        <h2 className="pk-table-heading">Comparing Our Healthcare Offerings</h2>
        <div className="pk-table-wrap">
          <table className="pk-table">
            <thead>
              <tr>
                <th>Care Features</th>
                <th>Integrative Consult</th>
                <th>Second Opinion</th>
                <th>Sanctuary Immersion</th>
              </tr>
            </thead>
            <tbody>
              {HEALTHCARE_COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <td className="pk-td-feature">{row.feature}</td>
                  <td>{row.basic}</td>
                  <td className="pk-td-highlight">{row.pro}</td>
                  <td>{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <Footer onContact={onCareers} />

    </div>
  )
}

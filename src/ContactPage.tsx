import { useLayoutEffect, useRef, useState } from 'react'
import './ContactPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import { SUPPORT_EMAIL, SUPPORT_PHONE, COMPANY_ADDRESS } from './data/constants'
import { IMG_PARMA_HERO_10, IMG_LOUNGE_2 } from './data/assets'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onCareers?: () => void
}

export default function ContactPage({ onMenuOpen, onHome }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  useLayoutEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('submitting')
    setTimeout(() => setSubmitStatus('success'), 800)
  }

  return (
    <div className="ct-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="ct-header">
        <WebnxtHeaderLogo pageClass="ct-logo" onHome={onHome} />
        <div className="header-actions">
          <nav className="hero-social" aria-label="Parma contact options">
            <a href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`} className="hero-social-link" aria-label="Phone" title={`Call ${SUPPORT_PHONE}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hero-social-link" aria-label="Email" title={`Email ${SUPPORT_EMAIL}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </nav>
          <button
            className="btn-work"
            onClick={() => {
              const el = document.getElementById('contact-form')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Reserve Sanctuary Stay
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main className="ct-main">
        {/* ── Hero & Split Section ───────────────────────────── */}
        <section className="ct-hero-split">
          <div className="ct-container">
            <div className="ct-split-grid">
              
              {/* Left Column: Contact Details & Atmosphere Image */}
              <div className="ct-info-col">
                <span className="ct-kicker">LITTLE WASHINGTON, VIRGINIA</span>
                <h1 className="ct-title">
                  Your journey to Parma<br />begins here.
                </h1>
                <p className="ct-lead">
                  Arrive when the mountains are quietest. Inquire about Parma Inn suite lodgings, Ayurvedic spa retreats, concierge healthcare consultations, or meditation gatherings.
                </p>
                <button
                  className="ct-hero-cta"
                  onClick={() => {
                    const el = document.getElementById('contact-form')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 28px',
                    backgroundColor: '#CA6641',
                    color: '#F5EFE5',
                    fontWeight: 600,
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '24px',
                    fontSize: '0.92rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get in Touch ↗
                </button>

                {/* Verified Clickable Details */}
                <div className="ct-details-card">
                  <div className="ct-detail-item">
                    <span className="ct-label">LOCATION &amp; ADDRESS</span>
                    <strong className="ct-val">PARMA IN LITTLE WASHINGTON</strong>
                    <address className="ct-addr">{COMPANY_ADDRESS}</address>
                  </div>

                  <div className="ct-detail-row">
                    <div className="ct-detail-item">
                      <span className="ct-label">TELEPHONE</span>
                      <strong className="ct-val">
                        <a href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`}>{SUPPORT_PHONE}</a>
                      </strong>
                    </div>

                    <div className="ct-detail-item">
                      <span className="ct-label">EMAIL INQUIRIES</span>
                      <strong className="ct-val">
                        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Atmosphere Image */}
                <div className="ct-atmosphere-frame">
                  <img src={IMG_LOUNGE_2} alt="Parma Inn Lounge Atmosphere" />
                  <div className="ct-atmosphere-caption">
                    <span>SANCTUARY RESERVATION CONCIERGE</span>
                    <p>“We look forward to receiving you in Rappahannock County.”</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Enquiry Form */}
              <div className="ct-form-col" id="contact-form">
                <div className="ct-form-card">
                  <span className="ct-form-kicker">INQUIRY FORM</span>
                  <h2>Reserve Your Experience</h2>

                  <form className="ct-form" onSubmit={handleSubmit}>
                    <div className="ct-field-group">
                      <label htmlFor="ct-name">Full Name *</label>
                      <input
                        id="ct-name"
                        type="text"
                        placeholder="Your full name"
                        required
                        className="ct-input"
                      />
                    </div>

                    <div className="ct-field-row">
                      <div className="ct-field-group">
                        <label htmlFor="ct-email">Email Address *</label>
                        <input
                          id="ct-email"
                          type="email"
                          placeholder="email@example.com"
                          required
                          className="ct-input"
                        />
                      </div>

                      <div className="ct-field-group">
                        <label htmlFor="ct-phone">Phone Number *</label>
                        <input
                          id="ct-phone"
                          type="tel"
                          placeholder="540 987 8588"
                          required
                          className="ct-input"
                        />
                      </div>
                    </div>

                    <div className="ct-field-group">
                      <label htmlFor="ct-reason">Reason for Enquiry *</label>
                      <select id="ct-reason" required className="ct-select">
                        <option value="">Select an Offering...</option>
                        <option value="parma-inn">Parma Inn Suite Accommodation</option>
                        <option value="parma-spa">Parma Spa Ayurvedic &amp; Heat Therapies</option>
                        <option value="parma-healthcare">Parma Healthcare Consultation</option>
                        <option value="meditation">Sushila Shanti Meditation Session</option>
                        <option value="estate">Parma Estate &amp; Countryside Inquiry</option>
                        <option value="general">General Sanctuary Inquiry</option>
                      </select>
                    </div>

                    <div className="ct-field-group">
                      <label htmlFor="ct-message">Message / Preferred Dates *</label>
                      <textarea
                        id="ct-message"
                        rows={5}
                        placeholder="Tell us about your preferred stay dates, therapies, or consultation requirements..."
                        required
                        className="ct-textarea"
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="ct-success-msg">
                        ✓ Your inquiry has been sent to Parma Concierge. We will reach out shortly.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitStatus === 'submitting' || submitStatus === 'success'}
                      className="ct-submit-btn"
                    >
                      {submitStatus === 'submitting' ? 'Sending Inquiry...' : submitStatus === 'success' ? '✓ Inquiry Sent' : 'Send Enquiry ↗'}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Location Atmosphere Highlight ──────────────────── */}
        <section className="ct-location-highlight">
          <div className="ct-container">
            <div className="ct-loc-frame">
              <img src={IMG_PARMA_HERO_10} alt="Parma in Little Washington Grounds" />
              <div className="ct-loc-overlay">
                <div>
                  <span className="ct-kicker" style={{ color: '#C49A52' }}>BLUE RIDGE FOOTHILLS</span>
                  <h2>105 Christmas Tree Lane</h2>
                  <p>Washington, VA 22747 • Rappahannock County</p>
                </div>
                <a
                  href="https://maps.google.com/?q=105+Christmas+Tree+Lane+Washington+VA+22747"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-map-link"
                >
                  View Directions ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onContact={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  )
}

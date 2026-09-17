import { Link } from 'react-router-dom'
import { SUPPORT_EMAIL, SUPPORT_PHONE, LEGAL_DISCLAIMER } from '../../data/constants'
import { IMG_TAPESTRY_1, IMG_PARMA_INN, IMG_AYURVEDA_MAIN, IMG_LOUNGE_2 } from '../../data/assets'
import './Footer.css'

interface FooterProps {
  onContact: () => void
}

export function Footer({ onContact }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="cta-footer">
      {/* ── Top Discover & Flourish ───────────────────────────────── */}
      <div className="footer-top-flourish">
        <button className="footer-discover-btn" onClick={scrollToTop} aria-label="Discover more / Back to top">
          <span className="footer-arrow-down">↓</span>
          <span className="footer-discover-label">DISCOVER MORE</span>
        </button>
        <div className="footer-gold-ornament">
          <span className="footer-line-left" />
          <span className="footer-diamond">✧</span>
          <span className="footer-line-right" />
        </div>
      </div>

      {/* ── Main Footer Columns Grid ─────────────────────────────── */}
      <div className="footer-columns-grid">
        {/* Column 1: Parma Brand */}
        <div className="footer-col footer-col-brand">
          <div className="footer-logo-wrap">
            <img
              src="/parma-official-crest.png"
              alt="Parma Crest"
              className="footer-logo-img"
              style={{ maxHeight: '68px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <em className="footer-tagline">Timeless hospitality. Unforgettable stays.</em>
          <div className="footer-gold-underline" />
          <p className="footer-brand-desc">
            Nestled in the Blue Ridge foothills of Washington, Virginia, Parma offers a unique sanctuary of luxury lodging, Ayurvedic spa therapies, concierge healthcare, and spiritual meditation.
          </p>
          <div className="footer-social-row">
            <a href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`} className="footer-social-icon" aria-label="Call Parma" title={`Call ${SUPPORT_PHONE}`}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="footer-social-icon" aria-label="Email Parma" title={`Email ${SUPPORT_EMAIL}`}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
            <a href="https://parmainlittlewashington.com" className="footer-social-icon" target="_blank" rel="noreferrer" aria-label="Parma Website">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">QUICK LINKS</h4>
          <ul className="footer-quick-links">
            <li><Link to="/">Home <span>→</span></Link></li>
            <li><Link to="/portfolio">Parma Inn <span>→</span></Link></li>
            <li><Link to="/services">Parma Spa <span>→</span></Link></li>
            <li><Link to="/services">Parma Healthcare <span>→</span></Link></li>
            <li><Link to="/services">Meditation <span>→</span></Link></li>
            <li><Link to="/about">About <span>→</span></Link></li>
            <li><Link to="/contact">Contact <span>→</span></Link></li>
          </ul>
        </div>

        {/* Column 3: Explore Our World (Photo Gallery) */}
        <div className="footer-col">
          <h4 className="footer-col-title">EXPLORE OUR WORLD</h4>
          <div className="footer-gallery-grid">
            <div className="footer-gallery-thumb">
              <img src={IMG_PARMA_INN} alt="Parma Inn Lodging" />
            </div>
            <div className="footer-gallery-thumb">
              <img src={IMG_TAPESTRY_1} alt="Tapestry Room Suite" />
            </div>
            <div className="footer-gallery-thumb">
              <img src={IMG_AYURVEDA_MAIN} alt="Ayurvedic Spa Treatments" />
            </div>
            <div className="footer-gallery-thumb">
              <img src={IMG_LOUNGE_2} alt="Sanctuary Lounge" />
            </div>
          </div>
          <Link to="/portfolio" className="footer-gallery-link">
            View Gallery →
          </Link>
        </div>

        {/* Column 4: Get In Touch & Newsletter */}
        <div className="footer-col">
          <h4 className="footer-col-title">GET IN TOUCH</h4>
          <ul className="footer-contact-details">
            <li>
              <span className="footer-contact-icon">📍</span>
              <div>
                <strong>105 Christmas Tree Lane</strong>
                <span>Washington, VA 22747</span>
              </div>
            </li>
            <li>
              <span className="footer-contact-icon">📞</span>
              <a href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`}>{SUPPORT_PHONE}</a>
            </li>
            <li>
              <span className="footer-contact-icon">✉</span>
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </li>
          </ul>

          <div className="footer-section-divider" />

          <h4 className="footer-col-title">JOIN OUR NEWSLETTER</h4>
          <p className="footer-newsletter-text">
            Be the first to know about exclusive offers, upcoming events and special experiences.
          </p>
          <form className="footer-newsletter-form" onSubmit={(e) => { e.preventDefault(); onContact(); }}>
            <input
              type="email"
              placeholder="Your email address"
              className="footer-newsletter-input"
              required
            />
            <button type="submit" className="footer-newsletter-submit" aria-label="Subscribe">
              →
            </button>
          </form>
        </div>
      </div>

      {/* Horizontal Gold Line Divider */}
      <div className="footer-divider-line" />

      {/* Bottom Bar Row */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          © 2026 Parma in Little Washington. All rights reserved.
        </div>
        <div className="footer-center-links">
          <Link to="/contact">PRIVACY POLICY</Link>
          <span className="footer-link-sep">|</span>
          <Link to="/contact">TERMS &amp; CONDITIONS</Link>
          <span className="footer-link-sep">|</span>
          <Link to="/real-estate">SITEMAP</Link>
        </div>
        <div className="footer-back-to-top">
          <span className="footer-fleur">⚜</span>
          <button type="button" onClick={scrollToTop} className="footer-top-btn">
            ↑ BACK TO TOP
          </button>
        </div>
      </div>
      <div className="footer-legal-disclaimer">
        {LEGAL_DISCLAIMER}
      </div>
    </footer>
  )
}

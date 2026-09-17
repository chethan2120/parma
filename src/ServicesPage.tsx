import { useEffect, useRef } from 'react'
import './ServicesPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from './data/constants'
import {
  IMG_AYURVEDA_MAIN,
  IMG_HEAT_THERAPY,
  IMG_AQUA_EXPERIENCES,
  IMG_BEAUTY_MAIN,
} from './data/assets'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onContact: () => void
}

export default function ServicesPage({ onMenuOpen, onHome, onContact }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  return (
    <div className="sp-root page-motion-shell" ref={rootRef}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="sp-header">
        <WebnxtHeaderLogo pageClass="sp-logo" onHome={onHome} />
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
            Reserve Spa Therapy
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── Spa Hero (~65–75vh) ─────────────────────────────── */}
      <section className="parma-inner-hero">
        <div className="parma-hero-container">
          <div className="parma-hero-text">
            <span className="parma-hero-eyebrow">PARMA SPA · TYSONS CORNER</span>
            <h1 className="parma-hero-h1">Ayurveda,<br />the science of life.</h1>
            <p className="parma-hero-desc">
              More than 5,000 years old, Ayurveda holds that body, mind, and environment are forces of energy and intelligence. Begin with an Ayurvedic assessment and discover therapies tailored to your individual dosha.
            </p>
            <button className="parma-hero-cta" onClick={onContact}>
              Discover the Rituals ↗
            </button>
          </div>
          <div className="parma-hero-media">
            <img src={IMG_AYURVEDA_MAIN} alt="Ayurvedic Spa Treatment at Parma" fetchPriority="high" decoding="async" />
          </div>
        </div>
      </section>

      {/* ── SECTION 1 (IVORY): Introduction to Ayurveda ─────── */}
      <section className="sec-bg-ivory" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>5,000-YEAR-OLD WISDOM</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
              The Ayurvedic Assessment
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#5A2E20', marginBottom: '24px' }}>
              Your journey begins with a comprehensive consultation with an Ayurvedic doctor. Through pulse diagnosis, evaluation of eyes and nails, and an in-depth health questionnaire, we map your unique elemental dosha (Vata, Pitta, Kapha) and design a natural therapy blueprint.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '1rem', color: '#32170F' }}>
              <li>✦ Nadi Pariksha (Ayurvedic Pulse Diagnosis)</li>
              <li>✦ Tailored Herbal Oil Formulations &amp; Poultices</li>
              <li>✦ Dosha Balance &amp; Deep Nervous-System Rest</li>
            </ul>
          </div>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
            <img src={IMG_AYURVEDA_MAIN} alt="Ayurvedic Assessment & Consultation" style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── SECTION 2 (WHITE): Six Families of Ritual ───────── */}
      <section className="sec-bg-white" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>SIX FAMILIES OF RITUAL</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
              Ayurvedic Therapies &amp; Treatments
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#5A2E20', maxWidth: '640px', margin: '0 auto' }}>
              Ayurvedic · Heat · Traditional · Aqua · Yoga · Beauty
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Abhyanga', duration: '1 hr 20 min', desc: 'A light herbal-oil massage that elicits deep nervous-system rest and balances all three doshas.' },
              { name: 'Kathi Basti', duration: '1 hr 20 min', desc: 'Warm Ayurvedic oils poured along the spine, followed by a gentle back massage and herbal compresses.' },
              { name: 'Oshadhi / Oshadi Wrap', duration: '1 hr 20 min / 30 min', desc: 'Pitta-calming oils and cooling herbs designed to clear blockages and draw heat from the body.' },
              { name: 'Vishesh / Vishesh Scrub', duration: '1 hr 20 min / 30 min', desc: 'Deep-tissue friction with warm oil, or herbal powders intended to lift heaviness and water retention.' },
              { name: 'Mardanam', duration: '1 hr 20 min', desc: 'Synchronized deep-tissue massage by two therapists using detoxifying powders and warm oil.' },
              { name: 'Sheetala', duration: '50 min', desc: 'Head, neck and shoulder massage with cooling herbs for the sensory organs.' },
            ].map((t) => (
              <div key={t.name} style={{ padding: '32px', backgroundColor: '#F5EFE5', borderRadius: '18px', border: '1px solid rgba(198, 156, 109, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#32170F', margin: 0 }}>{t.name}</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CA6641', border: '1px solid #CA6641', padding: '3px 10px', borderRadius: '999px' }}>{t.duration}</span>
                </div>
                <p style={{ fontSize: '1rem', color: '#5A2E20', lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 (TERRACOTTA): Thermal Heat & Hammam Care ── */}
      <section className="sec-bg-terracotta" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#F5EFE5', opacity: 0.9, fontWeight: 700 }}>THERMAL DETOXIFICATION</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#F5EFE5' }}>
              Heat &amp; Hammam Thermal Care
            </h2>
            <p style={{ fontSize: '1.12rem', lineHeight: '1.7', color: '#F5EFE5', opacity: 0.95 }}>
              Custom Hammam steam chambers and Kuti Swedhana herbal heat therapy. Deep thermal sweating opens pores, eliminates toxins, and relaxes nerve pathways for cellular renewal.
            </p>
          </div>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
            <img src={IMG_HEAT_THERAPY} alt="Hammam Steam Chamber" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── SECTION 4 (IVORY): Aqua Hydrotherapy ─────────────── */}
      <section className="sec-bg-ivory" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
            <img src={IMG_AQUA_EXPERIENCES} alt="Vichy Shower Hydrotherapy" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>HYDROTHERAPY &amp; BODYWORK</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
              Aqua Soaks &amp; Heritage Bodywork
            </h2>
            <p style={{ fontSize: '1.12rem', lineHeight: '1.7', color: '#5A2E20' }}>
              Multi-jet Vichy shower hydro-massage, mineral soaks, Royal Thai bodywork, and Lanna Tok Sen wooden mallet vibration therapy designed to relieve joint tension and spinal stress.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 (WHITE): Skin Aesthetics ──────────────── */}
      <section className="sec-bg-white" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: '#CA6641', fontWeight: 700 }}>SKIN REJUVENATION</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', margin: '16px 0', color: '#32170F' }}>
              Beauty &amp; Restorative Aesthetics
            </h2>
            <p style={{ fontSize: '1.12rem', lineHeight: '1.7', color: '#5A2E20' }}>
              Clinical skin aesthetics including Signature Jewel Facials, organic peel exfoliations, and non-invasive restorative facial care overseen by medical professionals.
            </p>
          </div>
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
            <img src={IMG_BEAUTY_MAIN} alt="Beauty Facial Aesthetics" style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── SECTION 6 (TERRACOTTA DARK): Reservation CTA ─────── */}
      <section className="sec-bg-terracotta-dark" style={{ padding: '88px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#F5EFE5', margin: '0 0 16px' }}>Reserve Your Spa Consultation</h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(245, 239, 229, 0.9)', marginBottom: '32px' }}>
            Experience 5,000 years of personalized Ayurvedic wisdom at Parma Spa Tysons Corner.
          </p>
          <button className="parma-hero-cta" onClick={onContact}>
            Reserve Spa Therapy ↗
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <Footer onContact={onContact} />
    </div>
  )
}

import { useEffect } from 'react'
import type { RefObject } from 'react'
import { InteractiveImageAccordion, type AccordionItem } from '../ui/interactive-image-accordion'
import {
  IMG_PARMA_INN,
  IMG_AYURVEDA_MAIN,
  IMG_HEALTH_1,
  IMG_YOGA,
  IMG_VISION,
} from '../../data/assets'
import { SITE_NAME, SUPPORT_PHONE, SUPPORT_EMAIL } from '../../data/constants'
import './HeroSection.css'

interface HeroSectionProps {
  heroRef: RefObject<HTMLElement | null>
  orbRef?: RefObject<HTMLDivElement | null>
  onNavigate: (path: string) => void
  onMenuOpen: () => void
}

const PARMA_HERO_ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 'stay',
    label: 'STAY',
    title: 'Parma Inn Lodging',
    description: 'Four luxury suites furnished with old-world antiques, Nancy Corzine pieces, velvet brocades, and sterling silver.',
    image: IMG_PARMA_INN,
    link: '/portfolio',
    badge: 'LUXURY SUITES',
  },
  {
    id: 'spa',
    label: 'SPA',
    title: 'Ayurvedic Spa & Heat',
    description: '5,000-year-old healing science featuring pulse & dosha assessments, herbal oil Abhyanga, Kathi Basti, and Hammam heat.',
    image: IMG_AYURVEDA_MAIN,
    link: '/services',
    badge: 'AYURVEDIC THERAPIES',
  },
  {
    id: 'healthcare',
    label: 'HEALTHCARE',
    title: 'Concierge Medicine',
    description: 'Physician consultations led by Dr. Thara Kodandaramachandra with Mayo Clinic & Cleveland Clinic specialist liaison.',
    image: IMG_HEALTH_1,
    link: '/services',
    badge: 'INTEGRATIVE CARE',
  },
  {
    id: 'meditation',
    label: 'MEDITATION',
    title: 'Sushila Shanti',
    description: 'Guided asana, pranayama breathwork, and Bihar School of Yoga Nidra relaxation amidst Blue Ridge quiet.',
    image: IMG_YOGA,
    link: '/events',
    badge: 'SPIRITUAL REST',
  },
  {
    id: 'explore',
    label: 'EXPLORE',
    title: 'Rappahannock Estate',
    description: 'Situated in historical Washington, Virginia (est. 1769), near Luray Caverns, wineries, golf, and equestrian trails.',
    image: IMG_VISION,
    link: '/real-estate',
    badge: 'VIRGINIA COUNTRYSIDE',
  },
]

export function HeroSection({ heroRef, onNavigate, onMenuOpen }: HeroSectionProps) {
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => hero.classList.toggle('hero--offscreen', !entry.isIntersecting),
      { rootMargin: '200px' },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [heroRef])

  return (
    <section className="parma-hero-section" ref={heroRef}>
      {/* Terracotta Venetian Plaster Background & Ambient Glows */}
      <div className="parma-hero-plaster-bg" />

      {/* Header Bar */}
      <header className="header">
        <div
          className="logo-mark"
          aria-label={SITE_NAME}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
          onClick={() => onNavigate('/')}
        >
          <img
            className="logo-img"
            src="/parma-official-crest.png"
            alt="Parma Crest Logo"
            style={{ height: '56px', width: 'auto', objectFit: 'contain', display: 'block' }}
            fetchPriority="high"
            decoding="async"
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1 }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: '1.75rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#F4EBDD',
              margin: 0,
              padding: 0,
              lineHeight: 1
            }}>
              Parma
            </h2>
            <h4 style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: '0.95rem',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'rgba(244, 235, 221, 0.85)',
              margin: 0,
              marginTop: '2px',
              padding: 0,
              lineHeight: 1
            }}>
              in Little Washington.
            </h4>
          </div>
        </div>
        <div className="header-actions">
          <nav className="hero-social" aria-label="Parma links">
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`}
              className="hero-social-link"
              aria-label="Phone"
              title={`Call ${SUPPORT_PHONE}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="hero-social-link"
              aria-label="Email"
              title={`Email ${SUPPORT_EMAIL}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </nav>
          <button className="btn-work" onClick={() => onNavigate('/contact')}>
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

      {/* Main Split Hero Body */}
      <div className="parma-hero-body">
        {/* Left Column: Editorial Messaging */}
        <div className="parma-hero-editorial-left">
          <span className="parma-hero-kicker">
            <span className="parma-kicker-star">✦</span> BLUE RIDGE WELLNESS SANCTUARY
          </span>
          <h1 className="parma-hero-title">
            Sanctuary in<br />
            <span className="parma-hero-title-italic">Little Washington</span>
          </h1>
          <p className="parma-hero-lead">
            A private haven in historical Virginia where modern medical science meets 5,000-year-old Ayurvedic spa therapies, luxury suite lodging, and Sushila Shanti meditation.
          </p>

          <div className="parma-hero-actions">
            <button
              type="button"
              className="parma-hero-btn-primary"
              onClick={() => onNavigate('/contact')}
            >
              Reserve Sanctuary Stay ↗
            </button>
            <button
              type="button"
              className="parma-hero-btn-outline"
              onClick={() => onNavigate('/services')}
            >
              Explore Offerings
            </button>
          </div>

          <div className="parma-hero-meta-row">
            <div className="parma-meta-item">
              <strong>105 Christmas Tree Lane</strong>
              <span>Washington, VA 22747</span>
            </div>
            <div className="parma-meta-sep" />
            <div className="parma-meta-item">
              <strong>1 Hour from D.C.</strong>
              <span>Rappahannock County</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 5-Image Accordion */}
        <div className="parma-hero-accordion-right">
          <InteractiveImageAccordion
            items={PARMA_HERO_ACCORDION_ITEMS}
            initialIndex={0}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import {
  IMG_PARMA_INN,
  IMG_AYURVEDA_MAIN,
  IMG_HEALTH_1,
  IMG_YOGA,
} from '../../data/assets'
import './SanctuaryStaySection.css'

interface SanctuaryStaySectionProps {
  onNavigate: (path: string) => void
  gradientClip: React.CSSProperties
}

export function SanctuaryStaySection({ onNavigate, gradientClip }: SanctuaryStaySectionProps) {
  return (
    <section className="sanctuary-stay-section" id="stay-shaped-around-you" aria-label="A stay shaped around you">
      <div className="stay-inner">
        <div className="stay-heading-block">
          <h2 className="section-heading-xl" style={gradientClip}>
            A Stay Shaped Around You
          </h2>
          <p className="section-subtitle">
            Immerse yourself in our distinct worlds of sanctuary lodging, ancient Ayurveda, concierge medicine, and meditation.
          </p>
        </div>

        <div className="stay-pillars-grid">
          <article className="stay-pillar-card" onClick={() => onNavigate('/portfolio')}>
            <div className="stay-pillar-media">
              <img src={IMG_PARMA_INN} alt="Parma Inn Accommodations" className="stay-pillar-img" loading="lazy" decoding="async" />
              <span className="stay-pillar-tag">01 / LODGING</span>
            </div>
            <div className="stay-pillar-body">
              <h3>Parma Inn Suites</h3>
              <p>Furnished with Nancy Corzine and Baker antiques, rich velvet brocades, and sterling silver in the Blue Ridge foothills.</p>
              <Link to="/portfolio" className="stay-pillar-link">Explore The Inn →</Link>
            </div>
          </article>

          <article className="stay-pillar-card" onClick={() => onNavigate('/services')}>
            <div className="stay-pillar-media">
              <img src={IMG_AYURVEDA_MAIN} alt="Parma Spa & Ayurveda" className="stay-pillar-img" loading="lazy" decoding="async" />
              <span className="stay-pillar-tag">02 / SPA & HEALING</span>
            </div>
            <div className="stay-pillar-body">
              <h3>Parma Spa &amp; Ayurveda</h3>
              <p>5,000-year-old science of life featuring dosha pulse assessments, herbal Abhyanga oil therapies, and Hammam heat.</p>
              <Link to="/services" className="stay-pillar-link">Discover The Spa →</Link>
            </div>
          </article>

          <article className="stay-pillar-card" onClick={() => onNavigate('/services')}>
            <div className="stay-pillar-media">
              <img src={IMG_HEALTH_1} alt="Parma Healthcare" className="stay-pillar-img" loading="lazy" decoding="async" />
              <span className="stay-pillar-tag">03 / HEALTHCARE</span>
            </div>
            <div className="stay-pillar-body">
              <h3>Parma Healthcare</h3>
              <p>Integrative concierge physician consultations and second opinions with top experts from Mayo and Cleveland Clinic.</p>
              <Link to="/services" className="stay-pillar-link">Explore Healthcare →</Link>
            </div>
          </article>

          <article className="stay-pillar-card" onClick={() => onNavigate('/events')}>
            <div className="stay-pillar-media">
              <img src={IMG_YOGA} alt="Sushila Shanti Meditation" className="stay-pillar-img" loading="lazy" decoding="async" />
              <span className="stay-pillar-tag">04 / SPIRIT</span>
            </div>
            <div className="stay-pillar-body">
              <h3>Sushila Shanti Meditation</h3>
              <p>Asana, pranayama breathing, and Yoga Nidra guided relaxation in the lineage of the Bihar School of Yoga.</p>
              <Link to="/events" className="stay-pillar-link">Explore Meditation →</Link>
            </div>
          </article>
        </div>

        <div className="stay-cta-wrap">
          <button className="stay-cta-btn" type="button" onClick={() => onNavigate('/contact')}>
            Plan Your Sanctuary Stay
          </button>
        </div>
      </div>
    </section>
  )
}

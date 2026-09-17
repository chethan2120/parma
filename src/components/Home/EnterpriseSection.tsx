// Done: Updated EnterpriseSection for Parma Sanctuary Immersion.
import React from 'react'
import {
  IMG_CHECK_W1,
  IMG_ENT_DEV,
  IMG_ENT_DESIGN,
  IMG_ENT_MOB,
  IMG_ENT_SEC,
  IMG_ENT_PERF,
  IMG_ENT_CLOUD,
  IMG_CONNECT,
} from '../../data/assets'
import './EnterpriseSection.css'

interface EnterpriseSectionProps {
  onNavigate: (path: string) => void
  gradientClip: React.CSSProperties
}

export function EnterpriseSection({ onNavigate, gradientClip }: EnterpriseSectionProps) {
  return (
    <section className="enterprise">
      <div className="enterprise-card">
        <h2 className="ent-heading">
          <span className="ent-heading-white">Sanctuary </span>
          <span style={gradientClip}>Immersion</span>
        </h2>
        <p className="ent-subtitle">A complete private retreat blending all four worlds of Parma</p>
        <div className="ent-features-grid">
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Parma Inn Suite Accommodation
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Ayurvedic Pulse & Dosha Consult
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Abhyanga & Kathi Basti Massage
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Hammam Steam & Kuti Swedhana
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Concierge Medical Consultation
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Second Opinion Teleconsultation
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Sushila Shanti Asana & Meditation
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Aquatic Yoga & Hydrotherapy
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Signature Jewel Facial & Aesthetics
          </div>
          <div className="ent-feature">
            <img src={IMG_CHECK_W1} alt="" className="ent-check" loading="lazy" decoding="async" />
            Complete Privacy in Blue Ridge
          </div>
        </div>
        <div className="ent-icons-row">
          <img
            src={IMG_ENT_DEV}
            alt="Parma Spa"
            className="ent-category-icon"
            loading="lazy"
            decoding="async"
          />
          <img
            src={IMG_ENT_DESIGN}
            alt="Parma Healthcare"
            className="ent-category-icon"
            loading="lazy"
            decoding="async"
          />
          <img
            src={IMG_ENT_MOB}
            alt="Meditation"
            className="ent-category-icon"
            loading="lazy"
            decoding="async"
          />
          <img
            src={IMG_ENT_SEC}
            alt="Inn Stay"
            className="ent-category-icon"
            loading="lazy"
            decoding="async"
          />
          <img
            src={IMG_ENT_PERF}
            alt="Ayurveda"
            className="ent-category-icon"
            loading="lazy"
            decoding="async"
          />
          <img
            src={IMG_ENT_CLOUD}
            alt="Beauty"
            className="ent-category-icon"
            loading="lazy"
            decoding="async"
          />
        </div>
        <button className="ent-connect-btn" onClick={() => onNavigate('/contact')}>
          <img src={IMG_CONNECT} alt="" className="ent-connect-icon" loading="lazy" decoding="async" />
          Reserve Immersion Stay
        </button>
      </div>
    </section>
  )
}

// Done: Updated WhyChooseSection for Parma in Little Washington.
import React from 'react'
import { IMG_DEV_ICON } from '../../data/assets'
import './WhyChooseSection.css'

interface WhyChooseSectionProps {
  gradientClip: React.CSSProperties;
}

export function WhyChooseSection({ gradientClip }: WhyChooseSectionProps) {
  return (
    <section className="process" id="why-choose-parma" data-section="why-choose-parma" aria-label="Why choose Parma">
      <div className="process-inner">
        <div className="process-heading-block">
          <h2 className="section-heading-xl" style={gradientClip}>
            Why Choose Parma
          </h2>
          <p className="section-subtitle">
            Four distinct worlds of restorative care, ancient Ayurveda, and modern medical science in the Blue Ridge.
          </p>
        </div>
        <div className="process-grid">
          <div className="process-card process-card--large process-card--dark">
            <div className="pc-pill">01 / Sanctuary</div>
            <h3 className="pc-title pc-title--light">
              Sanctuary &<br /> Environment
            </h3>
            <p className="pc-desc pc-desc--light">
              A private oasis in Rappahannock County, an hour from Washington D.C. Meandering rivers, mountain views, and quiet nature.
            </p>
            <div className="pc-tags">
              <span className="pc-tag pc-tag--dark">Blue Ridge Foothills</span>
              <span className="pc-tag pc-tag--dark">Rappahannock</span>
              <span className="pc-tag pc-tag--dark">Little Washington</span>
            </div>
          </div>
          <div className="process-card process-card--gradient">
            <div className="pc-pill pc-pill--white">02 / Healing</div>
            <h3 className="pc-title-sm pc-title--light">
              Ancient Science &<br /> Innovation
            </h3>
            <p className="pc-desc-sm pc-desc--light">
              5,000-year-old Ayurveda and acupuncture alongside modern aesthetic medical innovation and personalized care.
            </p>
            <div className="pc-features">
              <div className="pc-feature">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="pc-feature-icon-svg" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="#C49A52" strokeWidth="1.8" fill="rgba(196, 154, 82, 0.15)" />
                  <path d="M8.5 12.5L10.8 14.8L15.5 9.5" stroke="#C49A52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <strong>Ayurvedic Doctor</strong>
                  <span>Dosha assessment</span>
                </div>
              </div>
              <div className="pc-feature">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="pc-feature-icon-svg" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="#C49A52" strokeWidth="1.8" fill="rgba(196, 154, 82, 0.15)" />
                  <path d="M8.5 12.5L10.8 14.8L15.5 9.5" stroke="#C49A52" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <strong>Natural Therapies</strong>
                  <span>Herbal oil remedies</span>
                </div>
              </div>
            </div>
          </div>
          <div className="process-card process-card--white">
            <div className="pc-pill pc-pill--gray">03 / Healthcare</div>
            <h3 className="pc-title-sm">
              Concierge Medicine &<br /> Second Opinions
            </h3>
            <p className="pc-desc-sm pc-desc--dark" style={{ color: '#32170F' }}>
              Integrative physician care led by Dr. Thara, liaising with top medical specialists from Mayo Clinic and Cleveland Clinic.
            </p>
            <div className="pc-footer-strip">
              <img src={IMG_DEV_ICON} alt="" className="pc-footer-icon" />
              <span>National Physician Liaison</span>
            </div>
          </div>
          <div className="process-card process-card--large process-card--white">
            <div className="pc-content-row">
              <div className="pc-left-col">
                <div className="pc-pill pc-pill--gray">04 / Spirit</div>
                <h3 className="pc-title">
                  Sushila Shanti<br /> Meditation
                </h3>
                <p className="pc-desc pc-desc--dark">
                  Connect with the inner life force through asana, pranayama, and Yoga Nidra in the Bihar School of Yoga lineage.
                </p>
              </div>
              <div className="pc-right-col">
                <div className="pc-metric">
                  <span className="pc-metric-badge">MEDITATION</span>
                  <span className="pc-metric-val">Inner Rest</span>
                </div>
                <div className="pc-metric">
                  <span className="pc-metric-badge">PRANAYAMA</span>
                  <span className="pc-metric-val">Bihar Lineage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

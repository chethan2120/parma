// Done: Updated TestimonialSection for Parma in Little Washington.
import React from 'react'
import { IMG_QUOTE, IMG_STAR_FULL } from '../../data/assets'
import './TestimonialSection.css'

interface TestimonialSectionProps {
  gradientClip: React.CSSProperties
}

export function TestimonialSection({ gradientClip }: TestimonialSectionProps) {
  return (
    <section className="testimonial testi-trail-host" id="guest-experience-sanctuary-words" data-section="guest-experience-sanctuary-words">
      <div className="testimonial-inner">
        <div className="testi-heading-block">
          <h2 className="testi-heading" style={gradientClip}>
            Guest Experience & Sanctuary Words
          </h2>
          <p className="section-subtitle">
            Reflections from guests who have experienced the warmth, healing, and quiet of Parma.
          </p>
        </div>
        <div className="testi-card">
          <img src={IMG_QUOTE} alt="" className="testi-quote-icon" loading="lazy" decoding="async" />
          <div className="testi-stars">
            <img src={IMG_STAR_FULL} alt="★" className="testi-star" loading="lazy" decoding="async" />
            <img src={IMG_STAR_FULL} alt="★" className="testi-star" loading="lazy" decoding="async" />
            <img src={IMG_STAR_FULL} alt="★" className="testi-star" loading="lazy" decoding="async" />
            <img src={IMG_STAR_FULL} alt="★" className="testi-star" loading="lazy" decoding="async" />
            <img src={IMG_STAR_FULL} alt="★" className="testi-star" loading="lazy" decoding="async" />
          </div>
          <blockquote className="testi-quote">
            "Time waits for you here. Spa therapies unfold as mountains, clouds, and sun envelope you with lasting warmth. The Ayurvedic assessment and Abhyanga oil treatment restored a sense of balance I hadn't felt in years. Escape the city and revel in the views."
          </blockquote>
          <div className="testi-author">
            <strong>Sanctuary Guest</strong>
            <span>Parma Inn & Spa Visitor · Washington, Virginia</span>
          </div>
        </div>
      </div>
    </section>
  )
}

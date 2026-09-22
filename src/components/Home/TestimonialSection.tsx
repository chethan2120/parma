import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './TestimonialSection.css'

const GUEST_REVIEWS = [
  "Time waits for you here. Spa therapies unfold as mountains, clouds, and sun envelope you with lasting warmth. The Ayurvedic assessment and Abhyanga oil treatment restored a sense of balance I hadn't felt in years.",
  "A private haven where natural Blue Ridge beauty cradles deep restorative healing.",
  "Historic private estate hospitality surrounded by Blue Ridge mountain paths and quiet garden acreage.",
  "In silence, the mind settles and the spirit remembers its natural wholeness.",
  "Woven textiles, warm lamplight, and classical atmosphere in a quieter corner of the house.",
]

interface TestimonialSectionProps {
  gradientClip: React.CSSProperties
}

export function TestimonialSection({ gradientClip }: TestimonialSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GUEST_REVIEWS.length)
    }, 1100)

    return () => clearInterval(interval)
  }, [])

  const currentReview = GUEST_REVIEWS[activeIndex]

  return (
    <section className="testimonial testi-trail-host" id="guest-experience-sanctuary-words" data-section="guest-experience-sanctuary-words">
      <div className="testimonial-inner">
        <div className="testi-heading-block">
          <span className="testi-kicker">✦ SANCTUARY WORDS ✦</span>
          <h2 className="testi-heading" style={gradientClip}>
            Guest Experience &amp; Sanctuary Words
          </h2>
          <p className="section-subtitle">
            Reflections from guests who have experienced the warmth, healing, and quiet of Parma.
          </p>
        </div>

        <div className="testi-slideshow-container">
          {/* 5-Slide Progress Indicator */}
          <div className="testi-progress-bar">
            <span className="testi-counter">
              {String(activeIndex + 1).padStart(2, '0')} / {String(GUEST_REVIEWS.length).padStart(2, '0')}
            </span>
            <div className="testi-lines" role="tablist" aria-label="Testimonial slides">
              {GUEST_REVIEWS.map((_, i) => (
                <button
                  key={i}
                  className={`testi-line-btn ${i === activeIndex ? 'testi-line-btn--active' : ''}`}
                  onClick={() => setActiveIndex(i)}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="testi-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="testi-content"
              >
                <blockquote className="testi-quote">
                  “{currentReview}”
                </blockquote>
                <div className="testi-author">
                  Guest
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

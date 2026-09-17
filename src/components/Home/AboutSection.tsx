// Done: Updated AboutSection for Parma in Little Washington.
import React from 'react'
import { VIDEO_ABOUT_US } from '../../data/assets'

interface AboutSectionProps {
  gradientClip: React.CSSProperties
}

export function AboutSection({ gradientClip }: AboutSectionProps) {
  return (
    <section className="home-about" aria-label="About Parma in Little Washington">
      <div className="process-inner">
        <div className="process-heading-block home-about-heading">
          <h2 className="section-heading-xl" style={gradientClip}>
            About Parma
          </h2>
          <p className="section-subtitle">
            First there was a dream: to create a sanctuary of natural beauty and tranquility, and to offer an experience that does not merely rejuvenate for a moment, but creates a shift toward lasting wellness.
          </p>
        </div>
      </div>
      <div className="home-about-video" aria-label="Parma sanctuary estate view">
        <div className="home-about-video-inner">
          <img
            className="home-about-video-media"
            src={VIDEO_ABOUT_US}
            alt="Parma in Little Washington grounds and sanctuary views"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            decoding="async"
          />
          <div className="home-about-video-overlay" />
        </div>
      </div>
    </section>
  )
}

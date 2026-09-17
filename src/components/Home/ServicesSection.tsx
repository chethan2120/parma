// Done by Daksh Sharma: Reworked ServicesSection into an editorial alternating-row
// layout with GSAP scroll reveals (driven from HomePage) — replaces the sticky stack.
import React from 'react'
import { Link } from 'react-router-dom'
import LazyVideo from '../LazyVideo'
import { HOME_SERVICE_CARDS } from '../../data/services'
import { IMG_BULLET } from '../../data/assets'
import './ServicesSection.css'

interface ServicesSectionProps {
  svcStackRefs: React.MutableRefObject<(HTMLElement | null)[]>
  gradientClip: React.CSSProperties
}

export function ServicesSection({ svcStackRefs, gradientClip }: ServicesSectionProps) {
  return (
    <section className="services">
      <div className="services-header">
        <h2 className="section-heading-xl" style={gradientClip}>Parma Experiences</h2>
        <p className="section-subtitle">
          Explore our sanctuary lodging, ancient Ayurvedic spa treatments, concierge medicine, and meditation experiences.
        </p>
      </div>

      <div className="svc2-flow">
        {HOME_SERVICE_CARDS.map((service, i) => {
          const isReversed = i % 2 === 1
          return (
            <article
              key={service.title}
              ref={(el) => {
                svcStackRefs.current[i] = el
              }}
              data-svc-index={i}
              className={`svc2-row${isReversed ? ' svc2-row--reversed' : ''}`}
              style={{ ['--svc-i' as string]: i, zIndex: i + 1 }}
            >
              <div className="svc2-card-inner">
              {/* Composited stand-in for the old scrubbed brightness() filter — see HomePage deck stack. */}
              <div className="svc2-card-shade" aria-hidden="true" />
              <div className="svc2-media" data-svc-media>
                <span className="svc2-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="svc2-media-inner">
                  {(service.mediaType as string) === 'image' ? (
                    <img
                      className="svc2-visual"
                      src={service.mediaSrc}
                      alt={service.mediaLabel}
                      decoding="async"
                      loading="lazy"
                    />
                  ) : (
                    <LazyVideo
                      className="svc2-visual"
                      src={service.mediaSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      ariaLabel={service.mediaLabel}
                    >
                      <track kind="captions" default />
                    </LazyVideo>
                  )}
                </div>
                <div className="svc2-tags">
                  {service.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="svc2-tag" data-svc-reveal>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="svc2-body">
                <span className="svc2-label" data-svc-reveal>{service.label}</span>
                <h3 className="svc2-title" data-svc-reveal>{service.title}</h3>
                <p className="svc2-summary" data-svc-reveal>{service.summary}</p>
                <ul className="svc2-benefits">
                  {service.benefits.slice(0, 3).map((item) => (
                    <li key={item} data-svc-reveal>
                      <img
                        src={IMG_BULLET}
                        alt=""
                        className="svc2-bullet"
                        loading="lazy"
                        decoding="async"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link className="svc2-cta" to={`/services/${service.slug}`} data-svc-reveal>
                  Explore {service.title}
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M4 10H16M11 5L16 10L11 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

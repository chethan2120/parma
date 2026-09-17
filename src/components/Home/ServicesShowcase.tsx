/* Done by Daksh Sharma - Extracted ServicesShowcase to reduce App.tsx lines and improve modularity */
import React from 'react'
import { HOME_SERVICE_CARDS } from '../../data/services'
import { IMG_BULLET } from '../../data/assets'
import './ServicesShowcase.css'

interface ServicesShowcaseProps {
  svcIndex: number
  svcStackRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  prevSvc: () => void
  nextSvc: () => void
  gradientClip: React.CSSProperties
}

export function ServicesShowcase({ svcIndex, svcStackRefs, prevSvc, nextSvc, gradientClip }: ServicesShowcaseProps) {
  return (
    <section className="services" id="services-showcase">
      <div className="services-header">
        <h2 className="section-heading-xl" style={gradientClip}>Services We Offer</h2>
        <p className="section-subtitle">
          From strategy to execution, we build the full digital stack your brand needs to grow.
        </p>
      </div>

      <div className="services-carousel">
        <div className="services-stack">
        {HOME_SERVICE_CARDS.map((service, i) => {
          const isActive = svcIndex === i
          const isReversed = i % 2 === 1

          const leftBlock = (
            <div className={`sc-left${isReversed ? ' sc-left--bordered' : ''}`}>
              <div className="sc-label-pill">{service.label}</div>
              <h3 className="sc-title">{service.title}</h3>
              <div className="sc-image-wrap">
                {/* these done by Daksh Sharma */}
                {(service.mediaType as string) === 'image' ? (
                  <img
                    key={`svc-img-${i}-${service.title}`}
                    className="sc-image"
                    src={service.mediaSrc}
                    alt={service.mediaLabel}
                    decoding="async"
                    loading={isActive ? 'eager' : 'lazy'}
                    fetchPriority={isActive ? 'high' : 'low'}
                  />
                ) : (
                  <video
                    key={`svc-vid-${i}-${service.title}`}
                    className="sc-image sc-video"
                    src={service.mediaSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload={isActive ? 'metadata' : 'none'}
                    aria-label={service.mediaLabel}
                    disablePictureInPicture
                  />
                )}
              </div>
              <div className="sc-tags">
                {service.tags.map((tag) => (
                  <span key={tag} className="sc-tag">{tag}</span>
                ))}
              </div>
            </div>
          )

          const rightBlock = (
            <div className={`sc-right${isReversed ? ' sc-right--first' : ''}`}>
              <div className="sc-sub-block">
                <div className="sc-sub-label"><span className="sc-dot" />{service.benefitsTitle}</div>
                <ul className="sc-list">
                  {service.benefits.map((item) => (
                    <li key={item}><img src={IMG_BULLET} alt="" className="sc-bullet-icon" loading="lazy" decoding="async" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="sc-sub-block">
                <div className="sc-sub-label"><span className="sc-dot" />Our Methodology</div>
                <p className="sc-method-text">{service.methodology}</p>
              </div>
              <div className="sc-sub-block">
                <div className="sc-sub-label"><span className="sc-dot" />Key Deliverables</div>
                <div className="sc-deliverables">
                  {service.deliverables.map((item) => (
                    <div key={item.title} className="sc-deliverable"><strong>{item.title}</strong><span>{item.text}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )

          return (
            <div
              key={service.title}
              ref={(el) => {
                svcStackRefs.current[i] = el
              }}
              data-svc-index={i}
              data-svc-side={isReversed ? 'right' : 'left'}
              className={`services-stack-item${isActive ? ' services-stack-item--active' : ''}`}
              style={{ zIndex: i + 1 }}
            >
              <div className="service-card">
                {isReversed ? (
                  <>
                    {rightBlock}
                    {leftBlock}
                  </>
                ) : (
                  <>
                    {leftBlock}
                    {rightBlock}
                  </>
                )}
              </div>
            </div>
          )
        })}
        </div>{/* end services-stack */}

        <button className="svc-arrow svc-arrow--prev" onClick={prevSvc} aria-label="Previous service">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button className="svc-arrow svc-arrow--next" onClick={nextSvc} aria-label="Next service">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </section>
  )
}

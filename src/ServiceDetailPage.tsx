import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import LazyVideo from './components/LazyVideo'
import { getServiceBySlug, HOME_SERVICE_CARDS } from './data/services'
import './ServiceDetailPage.css'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onServices: () => void
  onContact: () => void
}

export default function ServiceDetailPage({ onMenuOpen, onHome, onServices, onContact }: Props) {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!service) return <Navigate to="/services" replace />

  const relatedServices = HOME_SERVICE_CARDS.filter((item) => item.slug !== service.slug).slice(0, 3)

  return (
    <div className="sd-root">
      <header className="sd-header">
        <WebnxtHeaderLogo pageClass="sd-logo" onHome={onHome} />
        <div className="sd-header-actions">
          <button className="sd-contact-link" type="button" onClick={onContact}>Start a project</button>
          <button className="btn-menu" type="button" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main>
        <section className="sd-hero">
          <div className="sd-hero-copy">
            <button className="sd-back" type="button" onClick={onServices}>
              <span aria-hidden="true">←</span> All services
            </button>
            <div className="sd-kicker">{service.label}</div>
            <h1>{service.title}</h1>
            <p className="sd-summary">{service.summary}</p>
            <div className="sd-tags" aria-label={`${service.title} capabilities`}>
              {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <button className="sd-primary-cta" type="button" onClick={onContact}>
              Discuss this service
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="sd-hero-media" aria-label={`${service.title} preview`}>
            <div className="sd-media-label">
              <span>Parma offering</span>
              <span>{service.title}</span>
            </div>
            <LazyVideo
              className="sd-video"
              src={service.mediaSrc}
              autoPlay
              muted
              loop
              playsInline
              ariaLabel={`${service.title} visual preview`}
            >
              <track kind="captions" default />
            </LazyVideo>
          </div>
        </section>

        <section className="sd-outcomes" aria-labelledby="sd-outcomes-heading">
          <div className="sd-section-heading">
            <span>What this unlocks</span>
            <h2 id="sd-outcomes-heading">{service.benefitsTitle}</h2>
          </div>
          <div className="sd-outcome-grid">
            {service.benefits.map((benefit, index) => (
              <article className="sd-outcome-card" key={benefit}>
                <span className="sd-card-index">{String(index + 1).padStart(2, '0')}</span>
                <p>{benefit}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sd-method">
          <div className="sd-method-copy">
            <span>How we work</span>
            <h2>Clear thinking before execution.</h2>
          </div>
          <p>{service.methodology}</p>
        </section>

        <section className="sd-deliverables" aria-labelledby="sd-deliverables-heading">
          <div className="sd-section-heading">
            <span>What you receive</span>
            <h2 id="sd-deliverables-heading">Key deliverables</h2>
          </div>
          <div className="sd-deliverable-list">
            {service.deliverables.map((deliverable) => (
              <article key={deliverable.title}>
                <button type="button" className="sd-deliverable-btn" onClick={onContact}>
                  <h3>{deliverable.title}</h3>
                  <p>{deliverable.text}</p>
                  <span aria-hidden="true">↗</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="sd-next">
          <div>
            <span>Explore more</span>
            <h2>Connected capabilities</h2>
          </div>
          <div className="sd-related-grid">
            {relatedServices.map((related) => (
              <Link key={related.slug} to={`/services/${related.slug}`}>
                <span>{related.label}</span>
                <strong>{related.title}</strong>
                <span className="sd-related-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer onContact={onContact} />
    </div>
  )
}

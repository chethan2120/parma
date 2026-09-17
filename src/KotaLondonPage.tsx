import { useEffect, useRef } from 'react'
import './KotaLondonPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'

const IMG_MAIN = '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0028.JPG'
const IMG_GALLERY_1 = '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0045.JPG'
const IMG_GALLERY_2 = '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0058.JPG'
const IMG_GALLERY_3 = '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0078.JPG'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onBackToPortfolio: () => void
  onCareers: () => void
  onContact?: () => void
}

const LEFT_SPECS = {
  client: 'Parma Inn',
  industry: 'Sanctuary Lodging & Hospitality',
  services: ['The Tapestry Room', 'The Panther Suite', 'The Red Room', 'Nancy Corzine & Baker Antiques'],
}

const IMPACT_ITEMS = [
  { value: '100%', label: 'Private Sanctuary Rest' },
  { value: 'Blue Ridge', label: 'Mountain Views' },
  { value: '1 Hour', label: 'From Washington, D.C.' },
]

export default function KotaLondonPage({ onMenuOpen, onHome, onBackToPortfolio, onCareers }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  return (
    <div className="kota-root page-motion-shell" ref={rootRef}>
      <header className="kota-header">
        <WebnxtHeaderLogo pageClass="kota-logo" onHome={onHome} />
        <div className="header-actions">
          <button className="btn-work" onClick={onCareers}>
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

      <main className="kota-main">
        <section className="kota-hero-top">
          <div className="kota-breadcrumbs">
            <button className="kota-crumb" onClick={onHome}>home</button>
            <span>/</span>
            <button className="kota-crumb" onClick={onBackToPortfolio}>inn</button>
            <span>/</span>
            <span className="kota-crumb kota-crumb--active">tapestry room</span>
          </div>

          <h1 className="kota-title">The Tapestry Room &amp; Master Suites</h1>
          <p className="kota-subtitle">Woven textiles, warm lamplight, and classical antique atmosphere in the Blue Ridge foothills.</p>
        </section>

        <section className="kota-main-image-wrap">
          <img src={IMG_MAIN} alt="The Tapestry Room at Parma Inn" className="kota-main-image" />
          <div className="kota-main-overlay" />
        </section>

        <section className="kota-editorial-grid">
          <aside className="kota-left">
            <div className="kota-spec-block">
              <h4>Sanctuary</h4>
              <p>{LEFT_SPECS.client}</p>
            </div>
            <div className="kota-spec-block">
              <h4>Experience</h4>
              <p>{LEFT_SPECS.industry}</p>
            </div>
            <div className="kota-spec-block">
              <h4>Suite Features</h4>
              <ul>
                {LEFT_SPECS.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
            <div className="kota-big-metric">
              <div className="kota-big-metric-value">100%</div>
              <div className="kota-big-metric-label">Sanctuary Quiet</div>
            </div>
          </aside>

          <div className="kota-right">
            <section className="kota-copy-block">
              <h3>Collected Antique Elegance</h3>
              <p>
                Every room at Parma Inn is composed for the discerning guest seeking quiet rest, natural mountain light, and historical grandeur. Woven tapestries, sterling silver accents, and hand-selected Baker and Nancy Corzine furniture define each sanctuary suite.
              </p>
            </section>

            <section className="kota-impact-strip">
              {IMPACT_ITEMS.map((item) => (
                <div key={item.label} className="kota-impact-item">
                  <div className="kota-impact-value">{item.value}</div>
                  <div className="kota-impact-label">{item.label}</div>
                </div>
              ))}
            </section>

            <section className="kota-gallery-grid">
              <div className="kota-gallery-item">
                <img src={IMG_GALLERY_1} alt="The Panther Suite" />
              </div>
              <div className="kota-gallery-item">
                <img src={IMG_GALLERY_2} alt="The Red Room" />
              </div>
              <div className="kota-gallery-item kota-gallery-item--wide">
                <img src={IMG_GALLERY_3} alt="The Lounge" />
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer onContact={onCareers} />
    </div>
  )
}

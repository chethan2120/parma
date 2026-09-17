import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import './GlobalTechSummitPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'

const IMG_HERO = '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0114.JPG'

const TEAL_CLIP: CSSProperties = {
  backgroundImage: 'linear-gradient(172deg, #C49A52 9.56%, #D2AE6D 57.79%, #CA6641 104.57%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

const SPEAKERS = [
  { name: 'Dr. Sadhna Nicky Singh', role: 'Medical Director & Founder', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0006.JPG' },
  { name: 'Dr. Thara Kodandaramachandra', role: 'Concierge Physician', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0045.JPG' },
  { name: 'Ayurvedic Specialist Panel', role: '5,000-Year-Old Science', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/DSC_0152.JPG' },
]

const AGENDA = [
  { time: '09:00 am', title: 'Opening Address: The Science of Life & Modern Medicine', note: 'Main Pavilion • Dr. Sadhna Nicky Singh', active: true },
  { time: '11:30 am', title: 'Panel: Dosha Diagnostics & Natural Oil Therapies', note: 'Sanctuary Lounge • Ayurvedic Physicians' },
  { time: '02:00 pm', title: 'Workshop: Integrative Second Opinions & Telemedicine', note: 'Healthcare Suite • Dr. Thara Kodandaramachandra' },
  { time: '04:30 pm', title: 'Sunset Meditation & Restorative Chanting', note: 'Sushila Shanti Meditation Centre' },
]

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onCareers: () => void
}

export default function GlobalTechSummitPage({ onMenuOpen, onHome, onCareers }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  return (
    <div className="gs-root page-motion-shell" ref={rootRef}>
      <header className="gs-header">
        <WebnxtHeaderLogo pageClass="gs-logo" onHome={onHome} />
        <div className="header-actions">
          <button className="btn-work" onClick={onCareers}>
            Reserve Consultation
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main className="gs-main">
        <section className="gs-hero">
          <div className="gs-hero-copy">
            <span className="gs-date" style={TEAL_CLIP}>Sanctuary Health Gathering</span>
            <h1>Parma Integrative Health Symposium</h1>
            <p>Little Washington, Virginia • Blue Ridge Sanctuary • World-Class Physicians</p>
          </div>
          <button className="gs-calendar-btn" type="button" onClick={onCareers}>Reserve Attendance</button>
        </section>

        <section className="gs-banner">
          <img src={IMG_HERO} alt="Parma Integrative Health Gathering" />
          <span className="gs-banner-pill">Ancient Ayurveda &amp; Modern Care</span>
        </section>

        <section className="gs-speakers-wrap">
          <div className="gs-head-row">
            <h2>Faculty &amp; Speakers</h2>
          </div>
          <div className="gs-speakers-grid">
            {SPEAKERS.map((speaker) => (
              <div className="gs-speaker-card" key={speaker.name}>
                <img src={speaker.image} alt={speaker.name} className="gs-speaker-img" />
                <div className="gs-speaker-info">
                  <h3>{speaker.name}</h3>
                  <p>{speaker.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="gs-agenda-wrap">
          <h2>Symposium Agenda</h2>
          <div className="gs-agenda-list">
            {AGENDA.map((item) => (
              <div className={`gs-agenda-item${item.active ? ' gs-agenda-item--active' : ''}`} key={item.title}>
                <div className="gs-agenda-time">{item.time}</div>
                <div className="gs-agenda-body">
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer onContact={onCareers} />
    </div>
  )
}

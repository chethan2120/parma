import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './CareersPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { Footer } from './components/Footer/Footer'
import { sendLeadToSupportEmail } from './utils/leadEmail'
import { IMG_PARMA_HERO_10, IMG_PARMA_INN, IMG_SPA_1, IMG_HEALTH_1 } from './data/assets'

const IMG_REBEL = new URL('../res/17fc3a9e-f16d-4752-870e-e5272f7e73c2.png', import.meta.url).href

const REBEL_CLIP: CSSProperties = {
  backgroundImage: `url('${IMG_REBEL}')`,
  backgroundSize: '305.64% 246.01%',
  backgroundPosition: '28.99% 77.54%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onCareers: () => void
}

type Department = 'All Departments' | 'Spa & Ayurveda' | 'Healthcare' | 'Hospitality'

type Role = {
  department: Department
  title: string
  meta: string
  tags: string[]
  variant: 'gradient' | 'light' | 'dark'
}

const benefits = [
  {
    icon: IMG_SPA_1,
    iconBg: 'ca-benefit-icon--blue',
    title: 'Sanctuary Setting',
    desc: 'Work in an idyllic environment surrounded by mountain vistas, fresh air, and peaceful natural surroundings.',
  },
  {
    icon: IMG_HEALTH_1,
    iconBg: 'ca-benefit-icon--green',
    title: 'Integrative Medicine & Ayurveda',
    desc: 'Collaborate with top physicians and Ayurvedic doctors offering world-class holistic therapies.',
  },
  {
    icon: IMG_PARMA_INN,
    iconBg: 'ca-benefit-icon--violet',
    title: 'Luxury Hospitality Culture',
    desc: 'Deliver unhurried, personalized care for discerning guests seeking deep rest and rejuvenation.',
  },
]

const roles: Role[] = [
  {
    department: 'Spa & Ayurveda' as Department,
    title: 'Ayurvedic Spa Specialist',
    meta: 'Little Washington, VA • Full-time',
    tags: ['Abhyanga', 'Dosha Care', 'Body Therapies'],
    variant: 'gradient',
  },
  {
    department: 'Healthcare' as Department,
    title: 'Concierge Health Coordinator',
    meta: 'Little Washington / Tysons Corner • Full-time',
    tags: ['Physician Liaison', 'Patient Consults', 'Integrative Care'],
    variant: 'light',
  },
  {
    department: 'Hospitality' as Department,
    title: 'Parma Inn Suite Host',
    meta: 'Little Washington, VA • Full-time',
    tags: ['Guest Experience', 'Luxury Lodging', 'Estate Care'],
    variant: 'light',
  },
  {
    department: 'Spa & Ayurveda' as Department,
    title: 'Meditation & Yoga Instructor',
    meta: 'Little Washington, VA • Part-time / Full-time',
    tags: ['Pranayama', 'Yoga Nidra', 'Bihar Lineage'],
    variant: 'dark',
  },
]

const LOCATIONS = ['Little Washington, Virginia', 'Rappahannock County', 'Tysons Corner, VA'] as const

export default function CareersPage({ onMenuOpen, onHome, onCareers }: Props) {
  const [activeDept, setActiveDept] = useState<Department>('All Departments')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [modalSubmitStatus, setModalSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const rolesRef = useRef<HTMLElement | null>(null)
  const locationsRef = useRef<HTMLElement | null>(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  const filteredRoles = useMemo(() => {
    if (activeDept === 'All Departments') return roles
    return roles.filter((role) => role.department === activeDept)
  }, [activeDept])

  const openRoleApplication = (role: Role) => {
    setSelectedRole(role)
    setIsRoleModalOpen(true)
  }

  return (
    <div className="ca-root page-motion-shell" ref={rootRef}>
      {isRoleModalOpen && selectedRole ? (
        <div
          className="ca-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Apply for ${selectedRole.title}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsRoleModalOpen(false)
          }}
        >
          <div className="ca-modal" role="document">
            <div className="ca-modal-head">
              <div className="ca-modal-kicker">Application</div>
              <div className="ca-modal-title-row">
                <h2 className="ca-modal-title">{selectedRole.title}</h2>
                <button
                  type="button"
                  className="ca-modal-close"
                  aria-label="Close form"
                  onClick={() => setIsRoleModalOpen(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <p className="ca-modal-sub">
                {selectedRole.department} • {selectedRole.meta}
              </p>
            </div>

            <form
              className="ca-application-form ca-application-form--modal"
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                setModalSubmitStatus('submitting')
                await sendLeadToSupportEmail(form, {
                  source: 'Parma Careers',
                  subject: `Application: ${selectedRole.title}`,
                })
                form.reset()
                setModalSubmitStatus('success')
                setTimeout(() => setIsRoleModalOpen(false), 1800)
              }}
            >
              <input name="Role" type="hidden" value={selectedRole.title} />

              <div className="ca-application-grid">
                <label>
                  <span>Full Name</span>
                  <input name="Full Name" type="text" placeholder="Jane Doe" required />
                </label>
                <label>
                  <span>Email Address</span>
                  <input name="Email" type="email" placeholder="jane@example.com" required />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input name="Phone" type="tel" placeholder="540 000 0000" />
                </label>
                <label>
                  <span>Current Location</span>
                  <input name="Current Location" type="text" placeholder="Virginia, USA" />
                </label>
              </div>

              <label>
                <span>Professional Background</span>
                <textarea
                  name="Message"
                  rows={5}
                  placeholder="Share relevant certifications, healthcare or spa experience, and your interest in Parma in Little Washington."
                  required
                />
              </label>

              <div className="ca-modal-actions">
                <button type="button" className="ca-modal-cancel" onClick={() => setIsRoleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="ca-modal-submit" disabled={modalSubmitStatus === 'submitting'}>
                  {modalSubmitStatus === 'submitting' ? 'Sending…' : modalSubmitStatus === 'success' ? '✓ Submitted' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <header className="ca-header">
        <WebnxtHeaderLogo pageClass="ca-logo" onHome={onHome} />
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

      <main className="ca-main">
        <section className="ca-hero">
          <div className="ca-hero-copy">
            <span className="ca-chip">SANCTUARY CAREERS</span>
            <h1>
              Join Our Team at
              <br />
              <span>Parma in Little Washington</span>
            </h1>
            <p>
              Deliver restorative Ayurvedic therapies, concierge healthcare, and exceptional sanctuary hospitality in the Blue Ridge foothills.
            </p>
            <div className="ca-hero-actions">
              <button onClick={() => rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>View Open Positions</button>
            </div>
          </div>

          <div className="ca-hero-visual">
            <div className="ca-hero-image-wrap">
              <img src={IMG_PARMA_HERO_10} alt="Parma in Little Washington Sanctuary Estate" className="ca-hero-image" />
            </div>
          </div>
        </section>

        <section className="ca-benefits">
          <div className="ca-section-head center">
            <h2 className="section-heading-xl" style={REBEL_CLIP}>Why Work at Parma</h2>
            <p>We cultivate a quiet, supportive environment dedicated to holistic well-being and guest excellence.</p>
          </div>

          <div className="ca-benefit-grid">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="ca-benefit-card">
                <div className={`ca-benefit-icon ${benefit.iconBg}`}>
                  <img src={benefit.icon} alt={benefit.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ca-locations" ref={locationsRef}>
          <div className="ca-section-head center">
            <h2 className="section-heading-xl" style={REBEL_CLIP}>Our Locations</h2>
            <p>Where our sanctuary and consultations take place.</p>
          </div>
          <ul className="ca-location-list">
            {LOCATIONS.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        </section>

        <section className="ca-roles" ref={rolesRef}>
          <div className="ca-section-head center">
            <h2 className="section-heading-xl" style={REBEL_CLIP}>Open Roles</h2>
            <div className="ca-role-filters">
              {(['All Departments', 'Spa & Ayurveda', 'Healthcare', 'Hospitality'] as Department[]).map((dep) => (
                <button
                  key={dep}
                  className={`ca-filter-btn${activeDept === dep ? ' active' : ''}`}
                  onClick={() => setActiveDept(dep)}
                >
                  {dep}
                </button>
              ))}
            </div>
          </div>

          <div className="ca-role-grid">
            {filteredRoles.map((role) => (
              <article
                key={role.title}
                className={`ca-role-card ca-role-card--${role.variant}`}
                role="button"
                tabIndex={0}
                onClick={() => openRoleApplication(role)}
              >
                <div>
                  <div className="ca-role-top">
                    <span>{role.department}</span>
                    <span>↗</span>
                  </div>
                  <h3>{role.title}</h3>
                  <p>{role.meta}</p>
                </div>
                <div className="ca-role-tags">
                  {role.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer onContact={onCareers} />
    </div>
  )
}

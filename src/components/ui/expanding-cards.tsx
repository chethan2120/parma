import React, { useState } from 'react'
import { Hotel, Sparkles, Stethoscope, Sun, ChevronRight } from 'lucide-react'
import './expanding-cards.css'

export interface ParmaEcosystemEntity {
  id: string
  title: string
  subtitle: string
  category: string
  location: string
  description: string
  image: string
  icon: React.ComponentType<{ className?: string }>
  badgeText: string
  details: string[]
  linkPath: string
}

export const PARMA_ECOSYSTEM_DATA: ParmaEcosystemEntity[] = [
  {
    id: 'parma-inn',
    title: 'Parma Inn',
    subtitle: 'Private Sanctuary Accommodations',
    category: 'World 01',
    location: 'Little Washington, VA',
    description:
      'Luxury suites furnished with old-world antiques, Nancy Corzine & Baker pieces, velvet brocades, and quiet Blue Ridge views.',
    image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/parma-inn.jpg',
    icon: Hotel,
    badgeText: 'Sanctuary Lodging',
    details: ['The Tapestry Room', 'The Panther Suite', 'The Red Room', 'The Lounge'],
    linkPath: '/portfolio',
  },
  {
    id: 'parma-spa',
    title: 'Parma Spa',
    subtitle: 'Ayurveda & Aqua Therapies',
    category: 'World 02',
    location: 'Sanctuary & Tysons Corner',
    description:
      '5,000-year-old science of life featuring pulse consultations, dosha-specific oil Abhyanga, Kathi Basti, and Vichy aqua soaks.',
    image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/ayurveda-therapi-main.jpg',
    icon: Sparkles,
    badgeText: 'Ancient Healing',
    details: ['Ayurvedic Consults', 'Heat & Steam Hammam', 'Vichy Shower', 'Jewel Facials'],
    linkPath: '/services',
  },
  {
    id: 'parma-healthcare',
    title: 'Parma Healthcare',
    subtitle: 'Concierge Medicine & Second Opinions',
    category: 'World 03',
    location: 'Tysons Corner & Sanctuary',
    description:
      'Integrative physician consults led by Dr. Thara Kodandaramachandra, with teleconsult liaison to Mayo Clinic and Cleveland Clinic.',
    image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/health3.jpg',
    icon: Stethoscope,
    badgeText: 'Concierge Care',
    details: ['Physician Consults', 'Second Opinions', 'Specialist Liaison', 'Holistic Plans'],
    linkPath: '/packages',
  },
  {
    id: 'sushila-shanti',
    title: 'Sushila Shanti Meditation',
    subtitle: 'Yoga & Spiritual Tranquility',
    category: 'World 04',
    location: 'Blue Ridge Sanctuary',
    description:
      'Guided asana, pranayama breathwork, and Yoga Nidra meditation in the sacred lineage of the Bihar School of Yoga.',
    image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/yoga.jpg',
    icon: Sun,
    badgeText: 'Bihar Lineage',
    details: ['Asana Practice', 'Pranayama', 'Yoga Nidra', 'Inner Tranquility'],
    linkPath: '/events',
  },
]

interface ExpandingCardsProps {
  onNavigate?: (path: string) => void
}

export function ExpandingCards({ onNavigate }: ExpandingCardsProps) {
  const [activeId, setActiveId] = useState<string>('parma-inn')

  return (
    <div className="parma-expanding-wrapper" role="region" aria-label="Parma Ecosystem Entities">
      <div className="parma-expanding-container">
        {PARMA_ECOSYSTEM_DATA.map((entity) => {
          const isActive = entity.id === activeId
          const Icon = entity.icon

          return (
            <div
              key={entity.id}
              className={`parma-expanding-card ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveId(entity.id)}
              onMouseEnter={() => setActiveId(entity.id)}
              tabIndex={0}
              role="button"
              aria-expanded={isActive}
              aria-label={entity.title}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActiveId(entity.id)
                }
              }}
            >
              <div
                className="parma-expanding-bg"
                style={{ backgroundImage: `url(${entity.image})` }}
              />
              <div className="parma-expanding-overlay" />

              {/* Card Header Tag */}
              <div className="parma-card-top">
                <span className="parma-card-category">{entity.category}</span>
                <span className="parma-card-badge">
                  <Icon className="parma-card-icon" />
                  {entity.badgeText}
                </span>
              </div>

              {/* Card Main Body */}
              <div className="parma-card-content">
                <div className="parma-card-heading-group">
                  <h3 className="parma-card-title">{entity.title}</h3>
                  <p className="parma-card-subtitle">{entity.subtitle}</p>
                </div>

                {/* Collapsed view indicator */}
                {!isActive && (
                  <div className="parma-card-collapsed-label">
                    <Icon className="parma-card-icon-sm" />
                    <span>{entity.title}</span>
                  </div>
                )}

                {/* Expanded Details */}
                {isActive && (
                  <div className="parma-card-expanded-body">
                    <p className="parma-card-desc">{entity.description}</p>
                    <div className="parma-card-tags">
                      {entity.details.map((detail, idx) => (
                        <span key={idx} className="parma-card-tag-item">
                          {detail}
                        </span>
                      ))}
                    </div>
                    {onNavigate && (
                      <button
                        className="parma-card-cta"
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigate(entity.linkPath)
                        }}
                      >
                        Explore {entity.title}
                        <ChevronRight className="parma-cta-arrow" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExpandingCards

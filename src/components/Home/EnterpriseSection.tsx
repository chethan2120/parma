import React from 'react'
import { Link } from 'react-router-dom'
import {
  IMG_PANTHER_1,
  IMG_HEAT_THERAPY,
  IMG_HEALTH_2,
  IMG_YOGA,
} from '../../data/assets'
import './EnterpriseSection.css'

interface EnterpriseSectionProps {
  onNavigate: (path: string) => void
  gradientClip: React.CSSProperties
}

const IMMERSION_CARDS = [
  {
    id: 'stay',
    number: '01',
    category: 'PARMA INN',
    title: 'Sanctuary Suite Stay',
    description: 'Luxury accommodations furnished with Baker & Nancy Corzine antiques.',
    image: IMG_PANTHER_1,
    link: '/stay',
  },
  {
    id: 'spa',
    number: '02',
    category: 'PARMA SPA',
    title: 'Ayurvedic Thermal Care',
    description: '5,000-year-old pulse assessments, Abhyanga oil & Hammam steam.',
    image: IMG_HEAT_THERAPY,
    link: '/spa',
  },
  {
    id: 'health',
    number: '03',
    category: 'HEALTHCARE',
    title: 'Concierge Physician Care',
    description: 'Integrative medical consults & Mayo Clinic specialist liaison.',
    image: IMG_HEALTH_2,
    link: '/healthcare',
  },
  {
    id: 'meditation',
    number: '04',
    category: 'MEDITATION',
    title: 'Sushila Shanti Retreat',
    description: 'Guided asana, pranayama breathing & Bihar School Yoga Nidra.',
    image: IMG_YOGA,
    link: '/meditation',
  },
]

export function EnterpriseSection({ onNavigate, gradientClip }: EnterpriseSectionProps) {
  return (
    <section className="enterprise" aria-label="Sanctuary Immersion">
      <div className="enterprise-container">
        <div className="enterprise-head">
          <span className="ent-kicker">✦ THE COMPLETE RETREAT ✦</span>
          <h2 className="ent-heading">
            <span className="ent-heading-white">Sanctuary </span>
            <span style={gradientClip}>Immersion</span>
          </h2>
          <p className="ent-subtitle">A complete private retreat blending all four worlds of Parma</p>
        </div>

        <div className="ent-grid-4">
          {IMMERSION_CARDS.map((card) => (
            <article
              key={card.id}
              className="ent-immersion-card"
              onClick={() => onNavigate(card.link)}
            >
              <div className="ent-card-media">
                <img src={card.image} alt={card.title} loading="lazy" decoding="async" />
                <span className="ent-card-num">{card.number}</span>
              </div>
              <div className="ent-card-body">
                <span className="ent-card-cat">{card.category}</span>
                <h3 className="ent-card-title">{card.title}</h3>
                <p className="ent-card-desc">{card.description}</p>
                <Link to={card.link} className="ent-card-link" onClick={(e) => e.stopPropagation()}>
                  Explore {card.category} →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="ent-bottom-cta">
          <button className="ent-connect-btn" onClick={() => onNavigate('/contact')}>
            Reserve Immersion Stay ↗
          </button>
        </div>
      </div>
    </section>
  )
}

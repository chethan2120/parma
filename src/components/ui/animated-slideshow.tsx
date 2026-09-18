import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  IMG_PARMA_INN,
  IMG_AYURVEDA_MAIN,
  IMG_HEALTH_1,
  IMG_YOGA,
  IMG_PARMA_HERO_10,
} from '../../data/assets'
import './animated-slideshow.css'

export interface ParmaExperienceItem {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  image: string
  link: string
  objectPosition?: string
}

export const PARMA_5_EXPERIENCES: ParmaExperienceItem[] = [
  {
    id: 'stay',
    number: '01',
    title: 'PARMA INN',
    subtitle: 'Luxury Suite Accommodations',
    description: 'Four individually furnished luxury suites offering an intimate stay in historic Little Washington.',
    image: IMG_PARMA_INN,
    link: '/stay',
    objectPosition: 'center 45%',
  },
  {
    id: 'spa',
    number: '02',
    title: 'PARMA SPA',
    subtitle: 'Ayurvedic Spa & Therapies',
    description: 'Ancient Ayurvedic rituals, restorative bodywork and therapies designed around individual balance.',
    image: IMG_AYURVEDA_MAIN,
    link: '/spa',
    objectPosition: 'center',
  },
  {
    id: 'healthcare',
    number: '03',
    title: 'PARMA HEALTHCARE',
    subtitle: 'Concierge & Integrative Medicine',
    description: 'Holistic integrative care, physician consultations and guidance for second opinions and specialist access.',
    image: IMG_HEALTH_1,
    link: '/healthcare',
    objectPosition: 'center',
  },
  {
    id: 'meditation',
    number: '04',
    title: 'MEDITATION',
    subtitle: 'Sushila Shanti Meditation',
    description: 'A contemplative experience created around stillness, awareness and a quieter relationship with oneself.',
    image: IMG_YOGA,
    link: '/meditation',
    objectPosition: 'center',
  },
  {
    id: 'explore',
    number: '05',
    title: 'LITTLE WASHINGTON',
    subtitle: 'Explore the Blue Ridge Sanctuary',
    description: 'Discover Little Washington, the surrounding Blue Ridge landscape and the quiet setting of the Parma sanctuary.',
    image: IMG_PARMA_HERO_10,
    link: '/explore',
    objectPosition: 'center',
  },
]

type TextStaggerHoverProps = {
  text: string
  isActive?: boolean
  className?: string
}

export function TextStaggerHover({ text, isActive, className = '' }: TextStaggerHoverProps) {
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    return <span className={className}>{text}</span>
  }

  const characters = text.split('')

  return (
    <motion.span
      className={`parma-stagger-hover-wrap ${className}`}
      initial="initial"
      whileHover="hover"
      animate={isActive ? 'hover' : 'initial'}
    >
      {/* Primary upper text block */}
      <span className="parma-stagger-upper">
        {characters.map((char, i) => (
          <motion.span
            key={i}
            className="parma-stagger-char"
            variants={{
              initial: { y: '0%' },
              hover: { y: '-100%' },
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.02,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>

      {/* Secondary lower text block */}
      <span className="parma-stagger-lower" aria-hidden="true">
        {characters.map((char, i) => (
          <motion.span
            key={i}
            className="parma-stagger-char parma-stagger-char-accent"
            variants={{
              initial: { y: '100%' },
              hover: { y: '0%' },
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.02,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  )
}

const clipPathVariants = {
  initial: {
    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
  },
  animate: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: {
      duration: 0.8,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },
  exit: {
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },
}

interface AnimatedSlideshowProps {
  items?: ParmaExperienceItem[]
  onNavigate?: (path: string) => void
}

export default function AnimatedSlideshow({ items = PARMA_5_EXPERIENCES, onNavigate }: AnimatedSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex] || items[0]

  return (
    <section
      className="parma-animated-slideshow-section"
      id="experience-parma"
      data-section="experience-parma"
      aria-label="Experience Parma"
    >
      <div className="parma-slideshow-plaster-bg" />

      <div className="parma-slideshow-container">
        {/* Editorial Section Header */}
        <div className="parma-slideshow-header">
          <span className="parma-slideshow-kicker">✦ THE PARMA SANCTUARY ✦</span>
          <h2 className="parma-slideshow-title">Experience Parma</h2>
          <p className="parma-slideshow-subtitle">
            A quieter way to stay, restore and reconnect in Little Washington.
          </p>
        </div>

        {/* 2-Column Main Layout: Left Nav List (45%) + Right Image Frame (55%) */}
        <div className="parma-slideshow-grid">
          {/* Left Column: Navigation Items */}
          <div className="parma-slideshow-nav" role="tablist" aria-label="Parma Experiences">
            {items.map((item, index) => {
              const isActive = index === activeIndex
              return (
                <div
                  key={item.id}
                  className={`parma-slideshow-nav-item ${isActive ? 'parma-nav-item--active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                  aria-controls={`parma-panel-${item.id}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveIndex(index)
                    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                      e.preventDefault()
                      setActiveIndex((index + 1) % items.length)
                    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                      e.preventDefault()
                      setActiveIndex((index - 1 + items.length) % items.length)
                    }
                  }}
                >
                  <div className="parma-nav-item-content">
                    <div className="parma-nav-item-num-col">
                      <span className="parma-nav-item-num">{item.number}</span>
                      {isActive && <span className="parma-nav-active-diamond">✦</span>}
                    </div>
                    <div className="parma-nav-item-text-group">
                      <TextStaggerHover
                        text={item.title}
                        isActive={isActive}
                        className="parma-nav-item-main-title"
                      />
                      <span className="parma-nav-item-subtitle">{item.subtitle}</span>
                    </div>
                  </div>
                  <div className="parma-nav-divider" />
                </div>
              )
            })}
          </div>

          {/* Right Column: Animated Image Frame with Clip-Path Reveal */}
          <div className="parma-slideshow-frame-col">
            <div className="parma-slideshow-image-wrapper">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeItem.id}
                  className="parma-slideshow-image-slide"
                  variants={clipPathVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="parma-slideshow-img"
                    style={{ objectPosition: activeItem.objectPosition || 'center' }}
                    loading="eager"
                  />
                  <div className="parma-slideshow-img-overlay">
                    <div className="parma-img-overlay-content">
                      <div className="parma-img-overlay-top">
                        <span className="parma-img-counter">
                          {activeItem.number} / 05
                        </span>
                        <span className="parma-img-tag">{activeItem.subtitle}</span>
                      </div>
                      <h3 className="parma-img-overlay-title">{activeItem.title}</h3>
                      <p className="parma-img-overlay-desc">{activeItem.description}</p>
                      <button
                        type="button"
                        className="parma-img-overlay-cta"
                        onClick={() => {
                          if (onNavigate) onNavigate(activeItem.link)
                        }}
                      >
                        {activeItem.id === 'stay' && 'Explore Parma Inn ↗'}
                        {activeItem.id === 'spa' && 'Explore Parma Spa ↗'}
                        {activeItem.id === 'healthcare' && 'Explore Healthcare ↗'}
                        {activeItem.id === 'meditation' && 'Explore Meditation ↗'}
                        {activeItem.id === 'explore' && 'Explore Little Washington ↗'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

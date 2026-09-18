import { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  IMG_PARMA_INN,
  IMG_AYURVEDA_MAIN,
  IMG_HEALTH_1,
  IMG_YOGA,
  IMG_PARMA_HERO_10,
  IMG_VISION,
  IMG_TAPESTRY_1,
  IMG_HEAT_THERAPY,
  IMG_PANTHER_1,
  IMG_TRADITIONAL_THERAPY,
  IMG_LOUNGE_2,
  IMG_AQUA_EXPERIENCES,
  IMG_RED_ROOM_1,
  IMG_THINGS_TO_DO,
  IMG_WINERIES,
  IMG_BEAUTY_MAIN,
} from '../../data/assets'
import './circular-flip-card-gallery.css'

export interface ParmaGalleryItem {
  id: string
  label: string
  title: string
  description: string
  image: string
  link: string
}

export const PARMA_15_GALLERY_ITEMS: ParmaGalleryItem[] = [
  {
    id: 'stay',
    label: 'STAY',
    title: 'Parma Inn Lodging',
    description: 'Luxury suites furnished with old-world antiques, Nancy Corzine pieces, and sterling silver.',
    image: IMG_PARMA_INN,
    link: '/stay',
  },
  {
    id: 'spa',
    label: 'SPA',
    title: 'Ayurvedic Spa',
    description: '5,000-year-old healing science with pulse assessments, Abhyanga herbal oil, and Kathi Basti.',
    image: IMG_AYURVEDA_MAIN,
    link: '/spa',
  },
  {
    id: 'health',
    label: 'HEALTHCARE',
    title: 'Concierge Medicine',
    description: 'Integrative physician consults led by Dr. Thara Kodandaramachandra with Mayo Clinic liaison.',
    image: IMG_HEALTH_1,
    link: '/healthcare',
  },
  {
    id: 'meditation',
    label: 'MEDITATION',
    title: 'Sushila Shanti',
    description: 'Guided asana, pranayama breathing, and Bihar School of Yoga Nidra deep relaxation.',
    image: IMG_YOGA,
    link: '/meditation',
  },
  {
    id: 'estate',
    label: 'ESTATE',
    title: 'Rappahannock Estate',
    description: 'Secluded Blue Ridge foothills sanctuary in historical Washington, Virginia (est. 1769).',
    image: IMG_VISION,
    link: '/explore',
  },
  {
    id: 'tapestry',
    label: 'SUITES',
    title: 'The Tapestry Room',
    description: 'Hand-crafted antiques, rich velvet brocades, and private Blue Ridge mountain views.',
    image: IMG_TAPESTRY_1,
    link: '/stay',
  },
  {
    id: 'hammam',
    label: 'HEAT',
    title: 'Hammam & Heat',
    description: 'Restorative steam, Kuti Swedhana heat therapy, and traditional thermal rejuvenation.',
    image: IMG_HEAT_THERAPY,
    link: '/spa',
  },
  {
    id: 'panther',
    label: 'SUITES',
    title: 'The Panther Suite',
    description: 'Architectural grandeur furnished with Baker furniture, fine art, and serene sanctuary light.',
    image: IMG_PANTHER_1,
    link: '/stay',
  },
  {
    id: 'traditional',
    label: 'BODYWORK',
    title: 'Traditional Therapies',
    description: 'Royal Thai, Lanna Tok Sen, and manual lymphatic drainage for structural release.',
    image: IMG_TRADITIONAL_THERAPY,
    link: '/spa',
  },
  {
    id: 'lounge',
    label: 'SANCTUARY',
    title: 'Sanctuary Lounge',
    description: 'Intimate estate salon for quiet contemplation, herbal teas, and fireside relaxation.',
    image: IMG_LOUNGE_2,
    link: '/stay',
  },
  {
    id: 'aqua',
    label: 'AQUA',
    title: 'Vichy & Hydrotherapy',
    description: 'Hydrotherapy, Vichy multi-head shower massage, and restorative aquatic yoga.',
    image: IMG_AQUA_EXPERIENCES,
    link: '/spa',
  },
  {
    id: 'redroom',
    label: 'SUITES',
    title: 'The Red Room',
    description: 'Heritage suite steeped in old-world charm, rich textiles, and timeless Virginia warmth.',
    image: IMG_RED_ROOM_1,
    link: '/stay',
  },
  {
    id: 'surroundings',
    label: 'EXPLORE',
    title: 'Shenandoah & Caverns',
    description: 'Proximity to Shenandoah National Park, Luray Caverns, and Skyline Drive.',
    image: IMG_THINGS_TO_DO,
    link: '/explore',
  },
  {
    id: 'wineries',
    label: 'VIRGINIA',
    title: 'Artisanal Wineries',
    description: 'Private vineyard tours and organic dining in historic Rappahannock County.',
    image: IMG_WINERIES,
    link: '/explore',
  },
  {
    id: 'beauty',
    label: 'BEAUTY',
    title: 'Medical Aesthetics',
    description: 'Jewel facials, organic herbal peels, and non-invasive restorative skin therapies.',
    image: IMG_BEAUTY_MAIN,
    link: '/spa',
  },
]

export interface ParmaMobileJourneyItem {
  id: string
  category: string
  title: string
  description: string
  image: string
  link: string
  objectPosition?: string
}

export const PARMA_MOBILE_JOURNEY_ITEMS: ParmaMobileJourneyItem[] = [
  {
    id: 'stay',
    category: 'Stay',
    title: 'Parma Inn',
    description: 'A private sanctuary in Little Washington.',
    image: IMG_PARMA_INN,
    link: '/stay',
    objectPosition: 'center 45%',
  },
  {
    id: 'spa',
    category: 'Spa',
    title: 'Ayurvedic Rituals',
    description: 'Restorative therapies rooted in Ayurveda.',
    image: IMG_AYURVEDA_MAIN,
    link: '/spa',
    objectPosition: 'center',
  },
  {
    id: 'healthcare',
    category: 'Healthcare',
    title: 'Concierge Medicine',
    description: 'Personalized integrative medical care.',
    image: IMG_HEALTH_1,
    link: '/healthcare',
    objectPosition: 'center',
  },
  {
    id: 'meditation',
    category: 'Meditation',
    title: 'Sushila Shanti',
    description: 'A quieter space for reflection and restoration.',
    image: IMG_YOGA,
    link: '/meditation',
    objectPosition: 'center',
  },
  {
    id: 'explore',
    category: 'Explore',
    title: 'Little Washington',
    description: 'Discover the landscape surrounding Parma.',
    image: IMG_PARMA_HERO_10,
    link: '/explore',
    objectPosition: 'center',
  },
]

interface Props {
  onNavigate?: (path: string) => void
}

function ParmaMobileJourney({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="parma-mobile-journey-wrapper">
      <div className="parma-mobile-journey-header">
        <span className="parma-mobile-kicker">✦ THE SANCTUARY WORLDS ✦</span>
        <h2 className="parma-mobile-title">
          The Parma<br />Ecosystem
        </h2>
        <p className="parma-mobile-subtitle">
          A quieter way to stay, restore and reconnect in Little Washington.
        </p>
      </div>

      <div className="parma-mobile-journey-stack">
        {PARMA_MOBILE_JOURNEY_ITEMS.map((item, index) => {
          if (reduceMotion) {
            return (
              <div
                key={item.id}
                className="parma-mobile-card"
                onClick={() => onNavigate && onNavigate(item.link)}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${item.title}`}
              >
                <div className="parma-mobile-card-media">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ objectPosition: item.objectPosition || 'center' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="parma-mobile-card-tag">{item.category}</span>
                </div>
                <div className="parma-mobile-card-body">
                  <h3 className="parma-mobile-card-title">{item.title}</h3>
                  <p className="parma-mobile-card-desc">{item.description}</p>
                  <span className="parma-mobile-card-link">Explore {item.category} ↗</span>
                </div>
              </div>
            )
          }

          return (
            <motion.div
              key={item.id}
              className="parma-mobile-card"
              initial={{ opacity: 0.35, y: 24, clipPath: 'inset(6% 0 6% 0 round 18px)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0% 0 round 18px)' }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{
                duration: 0.65,
                delay: index * 0.05,
                ease: [0.25, 1, 0.5, 1],
              }}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate && onNavigate(item.link)}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${item.title}`}
            >
              <div className="parma-mobile-card-media">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ objectPosition: item.objectPosition || 'center' }}
                  loading="lazy"
                  decoding="async"
                />
                <span className="parma-mobile-card-tag">{item.category}</span>
              </div>
              <div className="parma-mobile-card-body">
                <motion.h3
                  className="parma-mobile-card-title"
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 + 0.12 }}
                >
                  {item.title}
                </motion.h3>
                <p className="parma-mobile-card-desc">{item.description}</p>
                <span className="parma-mobile-card-link">Explore {item.category} ↗</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export function CircularFlipCardGallery({ onNavigate }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  const isPausedRef = useRef(false)
  const animFrameRef = useRef<number | null>(null)

  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 860
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 860)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Smooth infinite rotation using requestAnimationFrame for desktop
  useEffect(() => {
    if (isMobileView) return

    let lastTime = performance.now()

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (!isPausedRef.current) {
        // 360 deg in 85 seconds = ~4.23 deg/sec
        setRotationAngle((prev) => (prev + delta * 4.23) % 360)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isMobileView])

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    isPausedRef.current = true
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setFlippedIndex(null)
    isPausedRef.current = false
  }

  const handleCardClick = (item: ParmaGalleryItem, index: number) => {
    if (flippedIndex === index) {
      if (onNavigate) onNavigate(item.link)
    } else {
      setFlippedIndex(index)
    }
  }

  const totalCards = PARMA_15_GALLERY_ITEMS.length
  const angleStep = 360 / totalCards

  return (
    <section
      className="parma-circular-gallery-section"
      id="parma-ecosystem"
      onMouseLeave={handleMouseLeave}
      aria-label="The Parma Ecosystem Gallery"
    >
      {/* Terracotta Plaster Ambient Backdrop */}
      <div className="parma-circular-plaster-bg" />

      {/* CONDITIONAL RENDER: MOUNT ONLY MOBILE OR DESKTOP TO PREVENT DOM DUPLICATION */}
      {isMobileView ? (
        <ParmaMobileJourney onNavigate={onNavigate} />
      ) : (
        <div className="parma-desktop-only-container">
          {/* Decorative Gold Circles in Center */}
          <div className="parma-circular-gold-rings" aria-hidden="true">
            <span className="ring-outer" />
            <span className="ring-inner" />
          </div>

          {/* Central Typography (Fixed, non-rotating) */}
          <div className="parma-circular-center-content">
            <span className="parma-center-kicker">✦ THE SANCTUARY WORLDS ✦</span>
            <h2 className="parma-center-title">
              THE PARMA<br />
              <span>ECOSYSTEM</span>
            </h2>
            <div className="parma-center-cue">
              <span>EXPLORE THE PARMA WORLD</span>
              <span className="parma-cue-line" />
            </div>
          </div>

          {/* Rotating Ring Container */}
          <div
            className="parma-circular-ring-wrapper"
            style={{ transform: `rotate(${rotationAngle}deg)` }}
          >
            {PARMA_15_GALLERY_ITEMS.map((item, index) => {
              const cardAngle = index * angleStep
              const isFlipped = flippedIndex === index
              const isHovered = hoveredIndex === index

              return (
                <div
                  key={item.id}
                  className={`parma-circular-card-node ${isHovered ? 'is-hovered' : ''} ${isFlipped ? 'is-flipped' : ''}`}
                  style={{
                    transform: `rotate(${cardAngle}deg) translateY(-340px)`,
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleCardClick(item, index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.title} card`}
                >
                  {/* Counter-rotation to keep images visually upright */}
                  <div
                    className="parma-circular-card-counter"
                    style={{
                      transform: `rotate(${-(rotationAngle + cardAngle)}deg)`,
                    }}
                  >
                    <div className="parma-flip-card-3d">
                      {/* Front Face: High Quality Parma Photograph */}
                      <div className="parma-card-face parma-card-front">
                        <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                        <div className="parma-card-front-overlay" />
                        <div className="parma-card-front-label">
                          <span>{item.label}</span>
                        </div>
                      </div>

                      {/* Back Face: Refined Parma Information */}
                      <div className="parma-card-face parma-card-back">
                        <span className="parma-card-back-tag">{item.label}</span>
                        <h4 className="parma-card-back-title">{item.title}</h4>
                        <p className="parma-card-back-desc">{item.description}</p>
                        <button
                          type="button"
                          className="parma-card-back-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onNavigate) onNavigate(item.link)
                          }}
                        >
                          Explore ↗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default CircularFlipCardGallery

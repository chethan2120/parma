import { useState, useRef, useEffect } from 'react'
import {
  IMG_PARMA_INN,
  IMG_AYURVEDA_MAIN,
  IMG_HEALTH_1,
  IMG_YOGA,
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
    link: '/portfolio',
  },
  {
    id: 'spa',
    label: 'SPA',
    title: 'Ayurvedic Spa',
    description: '5,000-year-old healing science with pulse assessments, Abhyanga herbal oil, and Kathi Basti.',
    image: IMG_AYURVEDA_MAIN,
    link: '/services',
  },
  {
    id: 'health',
    label: 'HEALTHCARE',
    title: 'Concierge Medicine',
    description: 'Integrative physician consults led by Dr. Thara Kodandaramachandra with Mayo Clinic liaison.',
    image: IMG_HEALTH_1,
    link: '/services',
  },
  {
    id: 'meditation',
    label: 'MEDITATION',
    title: 'Sushila Shanti',
    description: 'Guided asana, pranayama breathing, and Bihar School of Yoga Nidra deep relaxation.',
    image: IMG_YOGA,
    link: '/events',
  },
  {
    id: 'estate',
    label: 'ESTATE',
    title: 'Rappahannock Estate',
    description: 'Secluded Blue Ridge foothills sanctuary in historical Washington, Virginia (est. 1769).',
    image: IMG_VISION,
    link: '/real-estate',
  },
  {
    id: 'tapestry',
    label: 'SUITES',
    title: 'The Tapestry Room',
    description: 'Hand-crafted antiques, rich velvet brocades, and private Blue Ridge mountain views.',
    image: IMG_TAPESTRY_1,
    link: '/portfolio',
  },
  {
    id: 'hammam',
    label: 'HEAT',
    title: 'Hammam & Heat',
    description: 'Restorative steam, Kuti Swedhana heat therapy, and traditional thermal rejuvenation.',
    image: IMG_HEAT_THERAPY,
    link: '/services',
  },
  {
    id: 'panther',
    label: 'SUITES',
    title: 'The Panther Suite',
    description: 'Architectural grandeur furnished with Baker furniture, fine art, and serene sanctuary light.',
    image: IMG_PANTHER_1,
    link: '/portfolio',
  },
  {
    id: 'traditional',
    label: 'BODYWORK',
    title: 'Traditional Therapies',
    description: 'Royal Thai, Lanna Tok Sen, and manual lymphatic drainage for structural release.',
    image: IMG_TRADITIONAL_THERAPY,
    link: '/services',
  },
  {
    id: 'lounge',
    label: 'SANCTUARY',
    title: 'Sanctuary Lounge',
    description: 'Intimate estate salon for quiet contemplation, herbal teas, and fireside relaxation.',
    image: IMG_LOUNGE_2,
    link: '/portfolio',
  },
  {
    id: 'aqua',
    label: 'AQUA',
    title: 'Vichy & Hydrotherapy',
    description: 'Hydrotherapy, Vichy multi-head shower massage, and restorative aquatic yoga.',
    image: IMG_AQUA_EXPERIENCES,
    link: '/services',
  },
  {
    id: 'redroom',
    label: 'SUITES',
    title: 'The Red Room',
    description: 'Heritage suite steeped in old-world charm, rich textiles, and timeless Virginia warmth.',
    image: IMG_RED_ROOM_1,
    link: '/portfolio',
  },
  {
    id: 'surroundings',
    label: 'EXPLORE',
    title: 'Shenandoah & Caverns',
    description: 'Proximity to Shenandoah National Park, Luray Caverns, and Skyline Drive.',
    image: IMG_THINGS_TO_DO,
    link: '/real-estate',
  },
  {
    id: 'wineries',
    label: 'VIRGINIA',
    title: 'Artisanal Wineries',
    description: 'Private vineyard tours and organic dining in historic Rappahannock County.',
    image: IMG_WINERIES,
    link: '/real-estate',
  },
  {
    id: 'beauty',
    label: 'BEAUTY',
    title: 'Medical Aesthetics',
    description: 'Jewel facials, organic herbal peels, and non-invasive restorative skin therapies.',
    image: IMG_BEAUTY_MAIN,
    link: '/services',
  },
]

interface Props {
  onNavigate?: (path: string) => void
}

export function CircularFlipCardGallery({ onNavigate }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  const isPausedRef = useRef(false)
  const animFrameRef = useRef<number | null>(null)

  // Smooth infinite rotation using requestAnimationFrame
  useEffect(() => {
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
  }, [])

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
    <div
      className="parma-circular-gallery-section"
      onMouseLeave={handleMouseLeave}
      aria-label="The Parma Ecosystem Circular Gallery"
    >
      {/* Terracotta Plaster Ambient Backdrop */}
      <div className="parma-circular-plaster-bg" />

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
                transform: `rotate(${cardAngle}deg) translateY(-360px)`,
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
                    <img src={item.image} alt={item.title} loading="eager" decoding="async" />
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
  )
}

export default CircularFlipCardGallery


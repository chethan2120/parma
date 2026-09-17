import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/all'
import {
  IMG_PARMA_INN,
  IMG_AYURVEDA_MAIN,
  IMG_HEALTH_1,
  IMG_YOGA,
  IMG_PARMA_HERO_10,
} from '../../data/assets'
import './gsap-card-flip.css'

gsap.registerPlugin(Flip)

export interface ParmaFlipCardItem {
  id: 'stay' | 'spa' | 'healthcare' | 'meditation' | 'explore'
  label: string
  title: string
  subtitle: string
  description: string
  image: string
  link: string
  objectPosition?: string
}

export const PARMA_5_FLIP_ITEMS: ParmaFlipCardItem[] = [
  {
    id: 'stay',
    label: '01 / STAY',
    title: 'Parma Inn Lodging',
    subtitle: 'FOUR LUXURY SUITES',
    description: 'Four individually furnished luxury suites offering an intimate stay in historic Little Washington.',
    image: IMG_PARMA_INN,
    link: '/stay',
    objectPosition: 'center 45%',
  },
  {
    id: 'spa',
    label: '02 / SPA',
    title: 'Ayurvedic Spa & Therapies',
    subtitle: 'ANCIENT AYURVEDIC RITUALS',
    description: 'Ancient Ayurvedic rituals, restorative bodywork and therapies designed around individual balance.',
    image: IMG_AYURVEDA_MAIN,
    link: '/spa',
    objectPosition: 'center',
  },
  {
    id: 'healthcare',
    label: '03 / HEALTHCARE',
    title: 'Concierge Medicine',
    subtitle: 'INTEGRATIVE PHYSICIAN CARE',
    description: 'Holistic integrative care, physician consultations and guidance for second opinions and specialist access.',
    image: IMG_HEALTH_1,
    link: '/healthcare',
    objectPosition: 'center',
  },
  {
    id: 'meditation',
    label: '04 / MEDITATION',
    title: 'Sushila Shanti Meditation',
    subtitle: 'SPIRITUAL REST & BREATHWORK',
    description: 'A contemplative experience created around stillness, awareness and a quieter relationship with oneself.',
    image: IMG_YOGA,
    link: '/meditation',
    objectPosition: 'center',
  },
  {
    id: 'explore',
    label: '05 / EXPLORE',
    title: 'Historic Blue Ridge Estate',
    subtitle: 'SANCTUARY GROUNDS',
    description: 'Discover Little Washington, the surrounding Blue Ridge landscape and the quiet setting of the Parma sanctuary.',
    image: IMG_PARMA_HERO_10,
    link: '/explore',
    objectPosition: 'center',
  },
]

interface Props {
  items?: ParmaFlipCardItem[]
  onNavigate?: (path: string) => void
}

export default function GsapCardFlip({ items = PARMA_5_FLIP_ITEMS, onNavigate }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeHeroId, setActiveHeroId] = useState<string>('stay')

  const sectionRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const captionRef = useRef<HTMLDivElement | null>(null)
  const isAnimatingRef = useRef<boolean>(false)

  // 1. One-time viewport entrance reveal animation
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!sectionRef.current) return

    let ctx: gsap.Context | undefined

    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        const kicker = sectionRef.current?.querySelector('.parma-flip-kicker')
        const title = sectionRef.current?.querySelector('.parma-flip-main-title')
        const subtitle = sectionRef.current?.querySelector('.parma-flip-subtitle')
        const content = sectionRef.current?.querySelector('.parma-flip-dynamic-area')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
            once: true,
          },
          defaults: { ease: 'power3.out' },
        })

        if (kicker) tl.fromTo(kicker, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0)
        if (title) tl.fromTo(title, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
        if (subtitle) tl.fromTo(subtitle, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.75 }, 0.2)
        if (content) tl.fromTo(content, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.85 }, 0.25)
      }, sectionRef)
    })

    return () => {
      ctx?.revert()
    }
  }, [])

  // 2. Expand Stack handler (from piled initial deck to 1 hero + 4 rail cards)
  const handleExpandStack = (targetHeroId?: string) => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    const chosenId = targetHeroId || activeHeroId
    const cards = containerRef.current?.querySelectorAll('.parma-flip-card')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!cards || !cards.length) {
      setActiveHeroId(chosenId)
      setIsExpanded(true)
      isAnimatingRef.current = false
      return
    }

    const state = Flip.getState(cards, { props: 'borderRadius, boxShadow, transform' })

    setActiveHeroId(chosenId)
    setIsExpanded(true)

    requestAnimationFrame(() => {
      const newCards = containerRef.current?.querySelectorAll('.parma-flip-card')
      if (newCards && newCards.length) {
        Flip.from(state, {
          duration: reduceMotion ? 0.05 : 0.85,
          ease: 'power3.inOut',
          scale: true,
          absolute: true,
          nested: true,
          stagger: reduceMotion ? 0 : 0.03,
          onComplete: () => {
            isAnimatingRef.current = false
          },
        })
      } else {
        isAnimatingRef.current = false
      }
    })
  }

  // 3. Collapse Stack handler (return to piled deck)
  const handleCollapseStack = () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    const cards = containerRef.current?.querySelectorAll('.parma-flip-card')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!cards || !cards.length) {
      setIsExpanded(false)
      isAnimatingRef.current = false
      return
    }

    const state = Flip.getState(cards, { props: 'borderRadius, boxShadow, transform' })

    setIsExpanded(false)

    requestAnimationFrame(() => {
      const newCards = containerRef.current?.querySelectorAll('.parma-flip-card')
      if (newCards && newCards.length) {
        Flip.from(state, {
          duration: reduceMotion ? 0.05 : 0.85,
          ease: 'power3.inOut',
          scale: true,
          absolute: true,
          nested: true,
          stagger: reduceMotion ? 0 : 0.03,
          onComplete: () => {
            isAnimatingRef.current = false
          },
        })
      } else {
        isAnimatingRef.current = false
      }
    })
  }

  // 4. Physical Card Swap Handler via GSAP Flip
  const handleSelectCard = (newHeroId: string) => {
    if (newHeroId === activeHeroId || isAnimatingRef.current) return
    isAnimatingRef.current = true

    const cards = containerRef.current?.querySelectorAll('.parma-flip-card')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!cards || !cards.length) {
      setActiveHeroId(newHeroId)
      isAnimatingRef.current = false
      return
    }

    const executeFlip = () => {
      const state = Flip.getState(cards, { props: 'borderRadius, boxShadow, transform' })

      setActiveHeroId(newHeroId)

      requestAnimationFrame(() => {
        const newCards = containerRef.current?.querySelectorAll('.parma-flip-card')
        if (newCards && newCards.length) {
          Flip.from(state, {
            duration: reduceMotion ? 0.05 : 0.85,
            ease: 'power3.inOut',
            scale: true,
            absolute: true,
            nested: true,
            onComplete: () => {
              isAnimatingRef.current = false
            },
          })
        } else {
          isAnimatingRef.current = false
        }

        if (captionRef.current && !reduceMotion) {
          gsap.fromTo(
            captionRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.08 }
          )
        }
      })
    }

    if (captionRef.current && !reduceMotion) {
      gsap.to(captionRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: executeFlip,
      })
    } else {
      executeFlip()
    }
  }

  // 5. Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return
      const isFocusedInside = containerRef.current.contains(document.activeElement)
      if (!isFocusedInside && !isExpanded) return

      if (e.key === 'Escape' && isExpanded) {
        handleCollapseStack()
        return
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        const currentIndex = items.findIndex((it) => it.id === activeHeroId)
        const nextIndex = (currentIndex + 1) % items.length
        if (!isExpanded) {
          handleExpandStack(items[nextIndex].id)
        } else {
          handleSelectCard(items[nextIndex].id)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const currentIndex = items.findIndex((it) => it.id === activeHeroId)
        const prevIndex = (currentIndex - 1 + items.length) % items.length
        if (!isExpanded) {
          handleExpandStack(items[prevIndex].id)
        } else {
          handleSelectCard(items[prevIndex].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, activeHeroId, items])

  // Active item & Rail items
  const activeItem = items.find((it) => it.id === activeHeroId) || items[0]
  const railItems = items.filter((it) => it.id !== activeHeroId)

  return (
    <section
      className="parma-gsap-flip-section"
      id="services-showcase"
      aria-label="Experience Parma"
      ref={sectionRef}
    >
      <div className="parma-flip-plaster-bg" />

      <div className="parma-flip-container" ref={containerRef}>
        {/* Editorial Section Header */}
        <div className="parma-flip-heading-block">
          <span className="parma-flip-kicker">✦ THE PARMA SANCTUARY ✦</span>
          <h2 className="parma-flip-main-title">Experience Parma</h2>
          <p className="parma-flip-subtitle">
            A quieter way to stay, restore and reconnect in Little Washington.
          </p>
        </div>

        <div className="parma-flip-dynamic-area">
          {!isExpanded ? (
            /* ──────────────── STACKED DECK INITIAL STATE ──────────────── */
            <div className="parma-stack-deck-wrapper">
              <div
                className="parma-stack-deck-pile"
                onClick={() => handleExpandStack()}
                role="button"
                tabIndex={0}
                aria-label="Interactive Parma sanctuary deck pile. Click to expand."
              >
                {items.map((item, index) => {
                  const rotation = (index - 2) * 3.5
                  const translateX = (index - 2) * 14
                  const translateY = Math.abs(index - 2) * 7
                  const zIndex = 10 - Math.abs(index - 2)

                  return (
                    <div
                      key={item.id}
                      data-flip-id={item.id}
                      className="parma-flip-card parma-stack-card"
                      style={{
                        transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg)`,
                        zIndex,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExpandStack(item.id)
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${item.title}`}
                    >
                      <div className="parma-card-inner">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="parma-card-img"
                          style={{ objectPosition: item.objectPosition || 'center' }}
                          loading="eager"
                        />
                        <div className="parma-stack-card-overlay">
                          <span className="parma-stack-card-tag">{item.label}</span>
                          <h3 className="parma-stack-card-title">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="parma-stack-cta-wrap">
                <button
                  type="button"
                  className="parma-stack-explore-btn"
                  onClick={() => handleExpandStack()}
                >
                  Explore the sanctuary 🎴
                </button>
              </div>
            </div>
          ) : (
            /* ──────────────── OPEN LAYOUT (HERO + RAIL) ──────────────── */
            <div className="parma-open-layout-grid">
              {/* Left Column: 4 Small Rail Cards */}
              <div className="parma-rail-column" role="tablist" aria-label="Parma experience rail">
                <span className="parma-rail-heading">SELECT EXPERIENCE</span>
                {railItems.map((item) => (
                  <div
                    key={item.id}
                    data-flip-id={item.id}
                    className="parma-flip-card parma-rail-card"
                    onClick={() => handleSelectCard(item.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${item.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectCard(item.id)
                      }
                    }}
                  >
                    <div className="parma-card-inner parma-rail-card-inner">
                      <div className="parma-rail-img-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="parma-card-img"
                          style={{ objectPosition: item.objectPosition || 'center' }}
                          loading="lazy"
                        />
                      </div>
                      <div className="parma-rail-info">
                        <span className="parma-rail-tag">{item.label}</span>
                        <h4 className="parma-rail-title">{item.title}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: 1 Dominant Active Hero Card + Content Panel */}
              <div className="parma-hero-column">
                <div
                  data-flip-id={activeItem.id}
                  className="parma-flip-card parma-hero-card"
                >
                  <div className="parma-card-inner parma-hero-card-inner">
                    <img
                      src={activeItem.image}
                      alt={activeItem.title}
                      className="parma-card-img"
                      style={{ objectPosition: activeItem.objectPosition || 'center' }}
                      loading="eager"
                    />
                    <span className="parma-hero-photo-badge">{activeItem.subtitle}</span>
                  </div>
                </div>

                {/* Editorial Information Panel below/beside Active Hero Image */}
                <div className="parma-editorial-panel" ref={captionRef}>
                  <div className="parma-panel-top">
                    <span className="parma-editorial-tag">{activeItem.label}</span>
                    <button
                      type="button"
                      className="parma-collapse-btn"
                      onClick={handleCollapseStack}
                      title="Return to Stacked Deck (Esc)"
                      aria-label="Collapse stack deck"
                    >
                      <span>Stack Deck</span> 🎴
                    </button>
                  </div>
                  <h3 className="parma-editorial-title">{activeItem.title}</h3>
                  <p className="parma-editorial-desc">{activeItem.description}</p>
                  <button
                    type="button"
                    className="parma-editorial-btn"
                    onClick={() => {
                      if (onNavigate) onNavigate(activeItem.link)
                    }}
                  >
                    {activeItem.id === 'stay' && 'Explore Parma Inn ↗'}
                    {activeItem.id === 'spa' && 'Explore Parma Spa ↗'}
                    {activeItem.id === 'healthcare' && 'Explore Healthcare ↗'}
                    {activeItem.id === 'meditation' && 'Explore Meditation ↗'}
                    {activeItem.id === 'explore' && 'Explore the Region ↗'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


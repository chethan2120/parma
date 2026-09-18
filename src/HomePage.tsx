/**
 * Done by Daksh Sharma: Refactored HomePage to import modular subcomponents.
 * Why: Splitting the massive HomePage component (~1150 lines) into smaller, focused
 * section components improves codebase readability, maintainability, and prevents
 * unnecessary code processing during updates. It also allows styles to be loaded
 * on demand.
 * Additionally, implemented requestAnimationFrame-based throttling for window scroll
 * and resize listeners to prevent scroll jank and layout thrashing.
 */

import { useState, useEffect, useRef, type CSSProperties } from 'react'
import { usePageMotion } from './hooks/usePageMotion'

// Import subcomponents
import PartnersSection from './components/PartnersSection'
import { HeroSection } from './components/Home/HeroSection'
import { ServicesSection } from './components/Home/ServicesSection'
import { WhyChooseSection } from './components/Home/WhyChooseSection'
import { OurWorkSection } from './components/Home/OurWorkSection'
import { SanctuaryStaySection } from './components/Home/SanctuaryStaySection'
import CircularFlipCardGallery from './components/ui/circular-flip-card-gallery'

import { EnterpriseSection } from './components/Home/EnterpriseSection'
import { TestimonialSection } from './components/Home/TestimonialSection'
import { FaqSection } from './components/Home/FaqSection'
import { Footer } from './components/Footer/Footer'

type GsapRuntime = {
  gsap: Awaited<typeof import('gsap')>['gsap']
  ScrollTrigger: Awaited<typeof import('gsap/ScrollTrigger')>['ScrollTrigger']
}

let homeMotionRuntimePromise: Promise<GsapRuntime> | null = null

function loadHomeMotionRuntime() {
  homeMotionRuntimePromise ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]).then(([gsapModule, scrollTriggerModule]) => {
    const { gsap } = gsapModule
    const { ScrollTrigger } = scrollTriggerModule
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })
    return { gsap, ScrollTrigger }
  })

  return homeMotionRuntimePromise
}

const gradientClip: CSSProperties = {
  backgroundImage: 'linear-gradient(135deg, #CA6641 0%, #C49A52 50%, #B89052 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
}

type HomePageProps = {
  onMenuOpen: () => void
  onNavigate: (path: string) => void
}

export default function HomePage({ onMenuOpen, onNavigate }: HomePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const heroRef = useRef<HTMLElement | null>(null)
  const homePageRef = useRef<HTMLDivElement | null>(null)
  const orbRef = useRef<HTMLDivElement | null>(null)

  usePageMotion(homePageRef, {
    animateFirstSectionOnLoad: false,
    skipSelectors: ['.hero', '.services', '#services-showcase', '.process', '.packages', '.faq-section', '.cta-footer'],
    sectionSelector: ':scope > section, :scope > footer',
  })

  /* ── Services: editorial rows with GSAP scroll reveals ─────────── */
  const svcStackRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const rows = svcStackRefs.current.filter(Boolean) as HTMLElement[]
    if (!rows.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // usePageMotion already bails on mobile for stability; the deck stack needs
    // the same treatment. Pinning six cards with pinSpacing:false plus a scrub
    // tween per card is far too much for a phone, and the overlapping deck reads
    // badly in a single narrow column anyway. Mobile keeps the cards in normal
    // flow and only gets the cheap one-shot reveal.
    const isMobile = window.matchMedia('(max-width: 860px)').matches

    let cancelled = false
    let ctx: ReturnType<GsapRuntime['gsap']['context']> | undefined

    void loadHomeMotionRuntime().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        rows.forEach((row) => {
          const media = row.querySelector<HTMLElement>('.svc2-media-inner')
          const visual = row.querySelector<HTMLElement>('.svc2-visual')
          const index = row.querySelector<HTMLElement>('.svc2-index')
          const reveals = gsap.utils.toArray<HTMLElement>(row.querySelectorAll('[data-svc-reveal]'))

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 78%',
              once: true,
              fastScrollEnd: 2500,
              preventOverlaps: true,
            },
            defaults: { ease: 'power3.out' },
          })

          // clip-path and a scaled-up video are both per-frame raster work.
          // Desktop can absorb it for a 0.9s reveal; phones cannot, so they get
          // a plain fade instead.
          if (media && !isMobile) {
            tl.fromTo(
              media,
              { clipPath: 'inset(0 0 100% 0 round 32px)' },
              { clipPath: 'inset(0 0 0% 0 round 32px)', duration: 0.9 },
              0,
            )
          } else if (media) {
            tl.fromTo(media, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0)
          }
          if (visual && !isMobile) {
            tl.fromTo(visual, { scale: 1.18 }, { scale: 1, duration: 1.1, ease: 'power2.out' }, 0)
          }
          if (index) {
            tl.fromTo(index, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
          }
          if (reveals.length) {
            tl.fromTo(
              reveals,
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
              0.2,
            )
          }

        })

        // Deck stack: pin each card at the top so the next one scrolls up and
        // covers it. Each pinned card scales/dims down for depth.
        if (isMobile) return

        const lastRow = rows[rows.length - 1]
        rows.forEach((row, i) => {
          const inner = row.querySelector<HTMLElement>('.svc2-card-inner')
          const stackTop = 90 + i * 12

          // Pin the card from when its top reaches the stack line until the last
          // card arrives. pinSpacing:false lets the cards overlap into a deck.
          ScrollTrigger.create({
            trigger: row,
            start: `top ${stackTop}`,
            endTrigger: lastRow,
            end: `top ${stackTop}`,
            pin: true,
            pinSpacing: false,
            id: `svc-pin-${i}`,
          })

          // Shrink/dim this card as the next one slides over it.
          const next = rows[i + 1]
          if (inner && next) {
            // Dimming used to scrub `filter: brightness()`, which forced the card
            // (plus its two large blurred box-shadows) to re-rasterize on every
            // scroll frame. A scrubbed overlay opacity is composited instead.
            const shade = inner.querySelector<HTMLElement>('.svc2-card-shade')
            gsap.fromTo(
              inner,
              { scale: 1 },
              {
                scale: 0.9,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                  trigger: next,
                  start: 'top bottom',
                  end: `top ${stackTop}`,
                  scrub: true,
                },
              },
            )
            if (shade) {
              gsap.fromTo(
                shade,
                { opacity: 0 },
                {
                  opacity: 0.1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: next,
                    start: 'top bottom',
                    end: `top ${stackTop}`,
                    scrub: true,
                  },
                },
              )
            }
          }
        })
      })
      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  /* ── Our Process: bento reveal ─────────── */
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('.process')
    const grid = section?.querySelector<HTMLElement>('.process-grid')
    const headingBlock = section?.querySelector<HTMLElement>('.process-heading-block')
    if (!section || !grid) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const headingH2 = headingBlock?.querySelector<HTMLElement>('h2')
    const headingSub = headingBlock?.querySelector<HTMLElement>('.section-subtitle')
    let cancelled = false
    let ctx: ReturnType<GsapRuntime['gsap']['context']> | undefined

    void loadHomeMotionRuntime().then(({ gsap }) => {
      if (cancelled) return
      const cards = gsap.utils.toArray<HTMLElement>(grid.querySelectorAll('.process-card'))

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power4.out' },
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            // Was 'play reverse play reverse', which replayed this whole
            // multi-card timeline (clip-path + rotation + scale) every time the
            // trigger line was crossed — scrolling up and down fast queued the
            // work repeatedly. Play it once.
            once: true,
            fastScrollEnd: 2500,
            preventOverlaps: true,
          },
        })

        if (headingH2) {
          tl.fromTo(
            headingH2,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
            },
            0
          )
        }
        if (headingSub) {
          // The blur(6px) -> blur(0px) tween that used to be here re-rasterized a
          // full-width line of text on every frame of the reveal, i.e. exactly
          // while the user was scrolling into this section. Fade and slide alone
          // read almost identically and stay on the compositor.
          tl.fromTo(
            headingSub,
            { autoAlpha: 0, y: 36 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: 'power3.out',
            },
            0.12
          )
        }

        if (cards[0]) {
          tl.fromTo(
            cards[0],
            { autoAlpha: 0, x: -72, y: 56, rotation: -5, scale: 0.86, transformOrigin: '80% 50%' },
            { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1, ease: 'power4.out' },
            0.28
          )
        }

        if (cards[1]) {
          tl.fromTo(
            cards[1],
            {
              autoAlpha: 0,
              x: 64,
              y: -40,
              rotation: 4,
              // The clip-path wipe that used to run alongside this transform is
              // gone: animating clip-path on a 500×360 gradient card re-rasters it
              // every frame, and it ran while the user was scrolling into the
              // section. The transform + fade carries the same reveal.
              scale: 0.82,
              transformOrigin: '20% 0%',
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1.05,
              ease: 'power3.inOut',
            },
            0.42
          )
        }

        if (cards[2]) {
          tl.fromTo(
            cards[2],
            { autoAlpha: 0, y: 88, scale: 0.78, transformOrigin: '50% 100%' },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: 'back.out(1.25)' },
            0.58
          )
        }

        if (cards[3]) {
          tl.fromTo(
            cards[3],
            { autoAlpha: 0, y: 72, scale: 0.84, transformOrigin: '50% 60%' },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.95, ease: 'power2.out' },
            0.72
          )
        }
      }, section)
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])



  /* ── Hero orb cursor follow ─────────────────────────────── */
  useEffect(() => {
    const hero = heroRef.current
    const orb = orbRef.current
    if (!hero || !orb) return

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduceMotion) return

    let cancelled = false
    const cleanupFns: Array<() => void> = []
    let heroRect = hero.getBoundingClientRect()
    let orbRadius = orb.offsetWidth / 2

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
    const updateHeroBounds = () => {
      heroRect = hero.getBoundingClientRect()
      orbRadius = orb.offsetWidth / 2
    }

    void loadHomeMotionRuntime().then(({ gsap }) => {
      if (cancelled) return

      const xTo = gsap.quickTo(orb, 'left', { duration: 0.45, ease: 'power3.out' })
      const yTo = gsap.quickTo(orb, 'top', { duration: 0.45, ease: 'power3.out' })

      let resizeTicking = false
      const onResize = () => {
        if (!resizeTicking) {
          requestAnimationFrame(() => {
            updateHeroBounds()
            resizeTicking = false
          })
          resizeTicking = true
        }
      }

      const resetToHomePosition = () => {
        xTo(heroRect.width * 0.524)
        yTo(heroRect.height * 0.33)
      }

      const moveToClientPoint = (clientX: number, clientY: number) => {
        const x = clamp(clientX - heroRect.left, orbRadius, heroRect.width - orbRadius)
        const y = clamp(clientY - heroRect.top, orbRadius, heroRect.height - orbRadius)
        xTo(x)
        yTo(y)
      }

      const onMove = (e: MouseEvent) => {
        moveToClientPoint(e.clientX, e.clientY)
      }

      const onLeave = () => {
        resetToHomePosition()
      }

      resetToHomePosition()
      window.addEventListener('resize', onResize)
      hero.addEventListener('mousemove', onMove)
      hero.addEventListener('mouseleave', onLeave)

      cleanupFns.push(() => {
        window.removeEventListener('resize', onResize)
        hero.removeEventListener('mousemove', onMove)
        hero.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => {
      cancelled = true
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [])

  /* ── Case Studies: 3D hover tilt & glare ─────────────────── */
  useEffect(() => {
    const isTouchDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (isTouchDevice) {
      document.querySelectorAll<HTMLElement>('#services-showcase .card-image-reveal').forEach(el => {
        el.style.opacity = '1'
        el.style.transform = 'scale(1)'
      })
      return
    }

    let cancelled = false
    const cleanupFns: Array<() => void> = []

    void loadHomeMotionRuntime().then(({ gsap }) => {
      if (cancelled) return

      const cards = document.querySelectorAll<HTMLElement>('#services-showcase .service-card')
      type Handlers = { move: (e: MouseEvent) => void; enter: () => void; leave: () => void }
      const map = new Map<HTMLElement, Handlers>()

      const cardBounds = new Map<HTMLElement, DOMRect>()
      const updateCardBounds = () => {
        cards.forEach(c => cardBounds.set(c, c.getBoundingClientRect()))
      }
      updateCardBounds()

      let resizeTicking = false
      const onResize = () => {
        if (!resizeTicking) {
          requestAnimationFrame(() => {
            updateCardBounds()
            resizeTicking = false
          })
          resizeTicking = true
        }
      }
      window.addEventListener('resize', onResize)

      cards.forEach(card => {
        const glare = card.querySelector<HTMLElement>('.glare-effect')

        const onMove = (e: MouseEvent) => {
          const r = cardBounds.get(card) || card.getBoundingClientRect()
          const x = e.clientX - r.left
          const y = e.clientY - r.top
          const rotX = ((y - r.height / 2) / (r.height / 2)) * -12
          const rotY = ((x - r.width / 2) / (r.width / 2)) * 12
          gsap.set(card, { rotationX: rotX, rotationY: rotY, transformPerspective: 1500, overwrite: 'auto' })
          if (glare) {
            glare.style.background = `radial-gradient(circle at ${(x / r.width) * 100}% ${(y / r.height) * 100}%, rgba(255,255,255,0.12) 0%, transparent 55%)`
          }
        }

        const onEnter = () => {
          gsap.killTweensOf(card, 'rotationX,rotationY,scale')
          gsap.to(card, { scale: 1.03, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
        }

        const onLeave = () => {
          gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
          if (glare) glare.style.background = 'none'
        }

        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseenter', onEnter)
        card.addEventListener('mouseleave', onLeave)
        map.set(card, { move: onMove, enter: onEnter, leave: onLeave })
      })

      cleanupFns.push(() => {
        window.removeEventListener('resize', onResize)
        map.forEach((h, card) => {
          card.removeEventListener('mousemove', h.move)
          card.removeEventListener('mouseenter', h.enter)
          card.removeEventListener('mouseleave', h.leave)
        })
      })
    })

    return () => {
      cancelled = true
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [])

  return (
    <div className="page-motion-shell home-motion-shell" ref={homePageRef}>
      {/* ──────────────────── HERO ──────────────────── */}
      <HeroSection
        heroRef={heroRef}
        orbRef={orbRef}
        onNavigate={onNavigate}
        onMenuOpen={onMenuOpen}
      />

      {/* ──────────────────── OUR SERVICES ──────────────────── */}
      <ServicesSection
        svcStackRefs={svcStackRefs}
        gradientClip={gradientClip}
      />

      {/* ──────────────────── WHY CHOOSE PARMA ──────────────────── */}
      <WhyChooseSection gradientClip={gradientClip} />

      {/* ──────────────────── EXPERIENCE PARMA (2-Column Slideshow) ──────────────────── */}
      <OurWorkSection onNavigate={onNavigate} gradientClip={gradientClip} />

      {/* ──────────────────── THE PARMA ECOSYSTEM (Circular Ring / Mobile Journey) ──────────────────── */}
      <CircularFlipCardGallery onNavigate={onNavigate} />

      {/* ──────────────────── SANCTUARY STAY EXPERIENCE ──────────────────── */}
      <SanctuaryStaySection onNavigate={onNavigate} gradientClip={gradientClip} />

      {/* ──────────────────── SANCTUARY IMMERSION (4-Card Grid) ──────────────────── */}
      <EnterpriseSection onNavigate={onNavigate} gradientClip={gradientClip} />

      {/* ──────────────────── OUR PARTNERS ──────────────────── */}
      <PartnersSection variant="home" onNavigate={onNavigate} />

      {/* ──────────────────── TESTIMONIAL ──────────────────── */}
      <TestimonialSection gradientClip={gradientClip} />

      {/* ──────────────────── FAQ ──────────────────── */}
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* ──────────────────── CTA FOOTER ──────────────────── */}
      <Footer onContact={() => onNavigate('/contact')} />
    </div>
  )
}

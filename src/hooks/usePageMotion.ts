import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'

type MotionOptions = {
  animateFirstSectionOnLoad?: boolean
  sectionSelector?: string
  skipSelectors?: string[]
}

type GsapInstance = Awaited<typeof import('gsap')>['gsap']

let motionRuntimePromise: Promise<{
  gsap: GsapInstance
  ScrollTrigger: Awaited<typeof import('gsap/ScrollTrigger')>['ScrollTrigger']
}> | null = null

function loadMotionRuntime() {
  motionRuntimePromise ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]).then(([gsapModule, scrollTriggerModule]) => {
    const { gsap } = gsapModule
    const { ScrollTrigger } = scrollTriggerModule
    gsap.registerPlugin(ScrollTrigger)
    // Skip enter/leave callbacks for triggers a fast scroll jumped clean over,
    // and don't refresh on mobile URL-bar resizes.
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })
    return { gsap, ScrollTrigger }
  })

  return motionRuntimePromise
}

const DEFAULT_SECTION_SELECTOR = ':scope > section, :scope > footer, :scope > main > section, :scope > main > article'

const GROUP_CONTAINER_SELECTOR = [
  'form',
  '[class*="actions"]',
  '[class*="cards"]',
  '[class*="contacts"]',
  '[class*="copy-block"]',
  '[class*="gallery"]',
  '[class*="grid"]',
  '[class*="list"]',
  '[class*="masonry"]',
  '[class*="pills"]',
  '[class*="socials"]',
  '[class*="stats"]',
  '[class*="table"]',
  '[class*="tabs"]',
  '[class*="tags"]',
].join(', ')

const MEDIA_SELECTOR = [
  ':scope > img',
  ':scope > picture',
  ':scope > [class*="banner"]',
  ':scope > [class*="hero-image"]',
  ':scope > [class*="hero-visual"]',
  ':scope > [class*="image"]',
  ':scope > [class*="map"]',
  ':scope > [class*="media"]',
  ':scope > [class*="visual"]',
].join(', ')

const HEADER_SELECTOR = ':scope > header, :scope > .header, :scope > [class$="-header"]'

function toElements(collection: Iterable<Element>): HTMLElement[] {
  return Array.from(collection).filter((node): node is HTMLElement => node instanceof HTMLElement)
}

function uniqueElements(elements: HTMLElement[]): HTMLElement[] {
  return Array.from(new Set(elements))
}

/**
 * Long grids (17+ portfolio cards, tag lists, package tables) used to produce
 * one tween per child, so a single section could stage several hundred
 * simultaneously animating elements. Capping the count keeps the reveal reading
 * the same while bounding per-frame work.
 */
const MAX_NESTED_TARGETS = 12

function getNestedTargets(section: HTMLElement, directChildren: HTMLElement[]) {
  const containers = toElements(section.querySelectorAll(GROUP_CONTAINER_SELECTOR))
  const nested = containers.flatMap((container) => toElements(container.children))
  return uniqueElements(nested)
    .filter((item) => !directChildren.includes(item))
    .slice(0, MAX_NESTED_TARGETS)
}

function animateSection(gsap: GsapInstance, section: HTMLElement, isMobile: boolean, withScrollTrigger: boolean, delay = 0) {
  const directChildren = toElements(section.children)
  const nestedTargets = getNestedTargets(section, directChildren)
  // One parallax target per section: each one is a scrub tween that recalculates
  // on every scroll frame for as long as the section is anywhere in the viewport,
  // and two tall sections overlapping doubled that cost for no visual gain.
  const mediaTargets = uniqueElements(toElements(section.querySelectorAll(MEDIA_SELECTOR)).slice(0, 1))

  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay,
    ...(withScrollTrigger
      ? {
          scrollTrigger: {
            trigger: section,
            start: isMobile ? 'top 90%' : 'top 84%',
            once: true,
            // When the viewport blows past a trigger, jump the reveal to its end
            // state instead of playing it out behind the scroll position, and
            // never run two section reveals concurrently.
            fastScrollEnd: 2500,
            preventOverlaps: true,
          },
        }
      : {}),
  })

  timeline.from(section, {
    autoAlpha: 0,
    duration: isMobile ? 0.65 : 0.82,
    y: isMobile ? 28 : 42,
  })

  if (directChildren.length) {
    timeline.from(
      directChildren,
      {
        autoAlpha: 0,
        duration: isMobile ? 0.55 : 0.7,
        stagger: isMobile ? 0.05 : 0.08,
        y: isMobile ? 18 : 28,
      },
      '<0.08',
    )
  }

  if (nestedTargets.length) {
    timeline.from(
      nestedTargets,
      {
        autoAlpha: 0,
        duration: isMobile ? 0.48 : 0.62,
        scale: isMobile ? 0.992 : 0.978,
        stagger: isMobile ? 0.028 : 0.04,
        y: isMobile ? 16 : 24,
      },
      '<0.06',
    )
  }

  mediaTargets.forEach((media, index) => {
    gsap.to(media, {
      ease: 'none',
      force3D: true,
      yPercent: isMobile ? 3 + index : 5 + index * 1.5,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        invalidateOnRefresh: true,
        scrub: isMobile ? 0.8 : 1.2,
      },
    })
  })
}

export function usePageMotion(rootRef: RefObject<HTMLElement | null>, options: MotionOptions = {}) {
  const {
    animateFirstSectionOnLoad = true,
    sectionSelector = DEFAULT_SECTION_SELECTOR,
    skipSelectors = [],
  } = options
  const skipSignature = skipSelectors.join('||')

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    // Mobile-first stability: keep native scrolling fluid and avoid scroll-linked
    // reveal timelines that can stutter on lower-power devices.
    if (isMobile) return

    const sections = toElements(root.querySelectorAll(sectionSelector)).filter(
      (section) => !skipSelectors.some((selector) => section.matches(selector)),
    )

    const pageHeader = root.querySelector<HTMLElement>(HEADER_SELECTOR)
    let cancelled = false
    let ctx: ReturnType<GsapInstance['context']> | undefined

    void loadMotionRuntime().then(({ gsap }) => {
      if (cancelled) return

      ctx = gsap.context(() => {
      if (pageHeader) {
        gsap.from(pageHeader, {
          autoAlpha: 0,
          duration: 0.68,
          ease: 'power3.out',
          y: -20,
        })
      }

      if (!sections.length) return

      if (animateFirstSectionOnLoad) {
        animateSection(gsap, sections[0], isMobile, false, pageHeader ? 0.08 : 0)
      }

      sections.slice(animateFirstSectionOnLoad ? 1 : 0).forEach((section) => {
        animateSection(gsap, section, isMobile, true)
      })
      }, root)
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [animateFirstSectionOnLoad, rootRef, sectionSelector, skipSignature])
}

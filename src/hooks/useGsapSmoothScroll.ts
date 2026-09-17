import { useLayoutEffect } from 'react'
import type Lenis from 'lenis'

let activeLenis: Lenis | null = null

export function getActiveLenis() {
  return activeLenis
}

/**
 * Runs one desktop smooth-scroll instance from GSAP's ticker.
 *
 * Lenis keeps the browser's native scroll model, so sticky/fixed elements remain
 * native and the page is not repainted as one giant transformed layer.
 */
export function useGsapSmoothScroll() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touchDevice = window.matchMedia('(pointer: coarse)')

    if (reduceMotion.matches || touchDevice.matches) return

    let cancelled = false
    let lenis: Lenis | null = null
    let removeTicker: (() => void) | undefined

    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([lenisModule, gsapModule, scrollTriggerModule]) => {
        if (cancelled) return

        const LenisConstructor = lenisModule.default
        const { gsap } = gsapModule
        const { ScrollTrigger } = scrollTriggerModule
        gsap.registerPlugin(ScrollTrigger)
        ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

        lenis = new LenisConstructor({
          autoRaf: false,
          anchors: true,
          smoothWheel: true,
          syncTouch: false,
        })
        activeLenis = lenis

        lenis.on('scroll', ScrollTrigger.update)

        const updateLenis = (time: number) => {
          lenis?.raf(time * 1000)
        }

        gsap.ticker.add(updateLenis)
        gsap.ticker.lagSmoothing(0)
        removeTicker = () => gsap.ticker.remove(updateLenis)

        ScrollTrigger.refresh()
      },
    )

    return () => {
      cancelled = true
      removeTicker?.()
      lenis?.destroy()
      if (activeLenis === lenis) activeLenis = null
    }
  }, [])
}

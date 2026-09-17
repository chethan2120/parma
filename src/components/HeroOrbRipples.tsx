import { useEffect, useRef, type RefObject } from 'react'

type Props = {
  heroRef: RefObject<HTMLElement | null>
  orbRef: RefObject<HTMLDivElement | null>
}

type Ripple = { x: number; y: number; r: number; born: number }

const MAX_RIPPLES = 14
/** Keep spawning briefly after last move so ripples trail the orb while GSAP eases it. */
const POINTER_WINDOW_MS = 520

export function HeroOrbRipples({ heroRef, orbRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const ripplesRef = useRef<Ripple[]>([])
  const lastSpawnRef = useRef({ x: NaN, y: NaN })
  const lastPointerRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const hero = heroRef.current
    const orb = orbRef.current
    if (!canvas || !wrap || !hero || !orb) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (reduce || !canHover) {
      wrap.style.display = 'none'
      return
    }

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let stopped = false

    // Done by Daksh Sharma: Cache layout rects outside the animation loop to
    // avoid calling getBoundingClientRect() every frame (up to 60×/sec), which
    // forces the browser to synchronously recalculate layout (layout thrashing).
    let cachedWrapRect: DOMRect = wrap.getBoundingClientRect()
    let cachedOrbRect: DOMRect = orb.getBoundingClientRect()

    // Done by Daksh Sharma: Track whether the rAF loop is currently running so
    // we can start/stop it on demand instead of spinning endlessly.
    let loopRunning = false

    // Done by Daksh Sharma: Centralized function to ensure the animation loop
    // is running. Called from pointer events and after spawning ripples so the
    // loop only runs when there is actual work (active pointer or live ripples).
    const ensureLoopRunning = () => {
      if (!loopRunning && !stopped) {
        loopRunning = true
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const resize = () => {
      // Done by Daksh Sharma: Update the cached wrap rect here (already called
      // on resize), so tick() never needs to call getBoundingClientRect() itself.
      cachedWrapRect = wrap.getBoundingClientRect()
      const r = cachedWrapRect
      canvas.width = Math.max(1, Math.floor(r.width * DPR))
      canvas.height = Math.max(1, Math.floor(r.height * DPR))
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    // Done by Daksh Sharma: Use a MutationObserver on the orb element to keep
    // cachedOrbRect up-to-date whenever GSAP (or anything else) mutates its
    // style/transform attributes. This replaces the per-frame
    // orb.getBoundingClientRect() call that was causing layout thrashing.
    const orbMo = new MutationObserver(() => {
      cachedOrbRect = orb.getBoundingClientRect()
    })
    orbMo.observe(orb, { attributes: true, attributeFilter: ['style', 'transform'] })

    const onPointer = () => {
      lastPointerRef.current = performance.now()
      // Done by Daksh Sharma: Re-read the orb rect on pointer activity as a
      // fallback in case the MutationObserver hasn't fired yet (e.g. the orb
      // moved via CSS transitions rather than inline style changes).
      cachedOrbRect = orb.getBoundingClientRect()
      // Done by Daksh Sharma: Kick the loop back to life on pointer activity.
      // Previously the loop ran endlessly; now it idles when there's nothing to
      // animate, so we must restart it when the user interacts.
      ensureLoopRunning()
    }
    hero.addEventListener('pointermove', onPointer)
    hero.addEventListener('pointerenter', onPointer)

    const tick = () => {
      if (stopped) return

      // Done by Daksh Sharma: Read dimensions from the cached rect instead of
      // calling wrap.getBoundingClientRect() every frame.
      const w = cachedWrapRect.width
      const h = cachedWrapRect.height
      const now = performance.now()

      if (w < 2 || h < 2 || !orb.isConnected) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      // Done by Daksh Sharma: Read from the cached orb rect instead of calling
      // orb.getBoundingClientRect() every frame.
      const cx = cachedOrbRect.left + cachedOrbRect.width / 2 - cachedWrapRect.left
      const cy = cachedOrbRect.top + cachedOrbRect.height / 2 - cachedWrapRect.top

      const pointerFresh = now - lastPointerRef.current < POINTER_WINDOW_MS
      if (pointerFresh) {
        const { x: lx, y: ly } = lastSpawnRef.current
        const dist = Number.isFinite(lx) ? Math.hypot(cx - lx, cy - ly) : 999
        if (dist > 14) {
          lastSpawnRef.current = { x: cx, y: cy }
          const list = ripplesRef.current
          if (list.length >= MAX_RIPPLES) list.shift()
          list.push({ x: cx, y: cy, r: 8 + dist * 0.045, born: now })
        }
      }

      ctx.clearRect(0, 0, w, h)

      const maxR = Math.hypot(w, h) * 0.38
      const ripples = ripplesRef.current

      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = ripples[i]
        const age = (now - p.born) / 1000
        p.r += 2.4 + age * 2.1
        const t = p.r / maxR
        if (t >= 1) {
          ripples.splice(i, 1)
          continue
        }

        const falloff = (1 - t) * (1 - t)
        const alpha = falloff * 0.48

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.scale(1, 0.5)

        for (let ring = 0; ring < 3; ring++) {
          const rr = p.r - ring * 11
          if (rr < 6) continue
          const a = alpha * (1 - ring * 0.22)
          ctx.strokeStyle = `rgba(52, 168, 155, ${a * 0.9})`
          ctx.lineWidth = 1.35 - ring * 0.28
          ctx.beginPath()
          ctx.arc(0, 0, rr, 0, Math.PI * 2)
          ctx.stroke()

          ctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.5})`
          ctx.lineWidth = 0.65
          ctx.beginPath()
          ctx.arc(0, 0, rr + 1.2, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      }

      // Done by Daksh Sharma: Only schedule the next frame if there is still
      // work to do (pointer is active OR ripples are still animating). When
      // both conditions are false the loop goes idle, saving CPU. It will be
      // restarted by ensureLoopRunning() on the next pointer event.
      if (pointerFresh || ripples.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        loopRunning = false
      }
    }

    // Done by Daksh Sharma: Don't auto-start the loop on mount. It will be
    // kicked off by the first pointer event via ensureLoopRunning(), avoiding
    // an idle rAF loop that burns CPU when the user isn't interacting.

    return () => {
      stopped = true
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      orbMo.disconnect()
      hero.removeEventListener('pointermove', onPointer)
      hero.removeEventListener('pointerenter', onPointer)
    }
  }, [heroRef, orbRef])

  return (
    <div ref={wrapRef} className="hero-orb-ripples" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

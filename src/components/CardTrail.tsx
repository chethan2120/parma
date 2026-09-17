import { gsap } from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import './CardTrail.css'

export type CardTrailItem = {
  key: string
  name: string
  logoSrc: string
  quote?: string
}

type Props = {
  items: CardTrailItem[]
}

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): { x: number; y: number } {
  let clientX = 0
  let clientY = 0
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if ('clientX' in e) {
    clientX = e.clientX
    clientY = e.clientY
  }
  return { x: clientX - rect.left, y: clientY - rect.top }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export default function CardTrail({ items }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<HTMLDivElement[]>([])

  const stableItems = useMemo(() => items, [items])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cards = cardRefs.current.filter(Boolean)
    if (!cards.length) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 }
    cards.forEach((c) => gsap.set(c, defaultStyle))

    // these done by Daksh Sharma
    let cachedRootRect = root.getBoundingClientRect()
    const cachedCardRects = cards.map(c => c.getBoundingClientRect())

    const ro = new ResizeObserver(() => {
      cachedRootRect = root.getBoundingClientRect()
      cards.forEach((c, i) => {
        // Reset transform temporarily to get base rect? Actually width/height don't change with x/y transform.
        // scale does change them, but since we just need base width/height, we can store them.
        // Wait, if scale is currently 0.2, getBoundingClientRect returns scaled width!
        // To be safe, we just use offsetWidth/offsetHeight for width/height.
        cachedCardRects[i] = {
          width: c.offsetWidth,
          height: c.offsetHeight,
          left: 0, top: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {}
        } as DOMRect
      })
    })
    ro.observe(root)

    let imgPos = 0
    let z = 1
    let activeCount = 0
    let isIdle = true
    const threshold = 70
    const mousePos = { x: 0, y: 0 }
    let lastMousePos = { x: 0, y: 0 }
    const cache = { x: 0, y: 0 }
    // Done by Daksh Sharma: Flag to check if rAF loop is active
    let loopRunning = false

    const startLoop = () => {
      if (!loopRunning) {
        loopRunning = true
        raf = window.requestAnimationFrame(render)
      }
    }

    const handleMove = (ev: MouseEvent | TouchEvent) => {
      const p = getLocalPointerPos(ev, cachedRootRect)
      mousePos.x = p.x
      mousePos.y = p.y
      startLoop()
    }

    const showNext = () => {
      z += 1
      imgPos = imgPos < cards.length - 1 ? imgPos + 1 : 0
      const el = cards[imgPos]
      const r = cachedCardRects[imgPos]

      gsap.killTweensOf(el)
      gsap
        .timeline({
          onStart: () => {
            activeCount += 1
            isIdle = false
          },
          onComplete: () => {
            activeCount -= 1
            if (activeCount === 0) {
              isIdle = true
              // Done by Daksh Sharma: Restart loop to check if we can stop (lerp settling)
              startLoop()
            }
          },
        })
        .fromTo(
          el,
          {
            opacity: 1,
            scale: 1,
            zIndex: z,
            x: cache.x - r.width / 2,
            y: cache.y - r.height / 2,
          },
          {
            duration: 0.42,
            ease: 'power1',
            x: mousePos.x - r.width / 2,
            y: mousePos.y - r.height / 2,
          },
          0
        )
        .to(
          el,
          {
            duration: 0.6,
            ease: 'power3',
            opacity: 0,
            scale: 0.2,
          },
          0.42
        )
    }

    let raf = 0
    const render = () => {
      const d = dist(mousePos, lastMousePos)
      cache.x = lerp(cache.x, mousePos.x, 0.12)
      cache.y = lerp(cache.y, mousePos.y, 0.12)
      if (d > threshold) {
        showNext()
        lastMousePos = { x: mousePos.x, y: mousePos.y }
      }
      if (isIdle && z !== 1) z = 1

      // Done by Daksh Sharma: If mouse stopped moving, lerp settled, and active card animations finished, stop rAF
      const diffX = Math.abs(cache.x - mousePos.x)
      const diffY = Math.abs(cache.y - mousePos.y)
      if (isIdle && diffX < 0.05 && diffY < 0.05) {
        loopRunning = false
        return
      }

      raf = window.requestAnimationFrame(render)
    }

    const init = (ev: MouseEvent | TouchEvent) => {
      const p = getLocalPointerPos(ev, cachedRootRect)
      mousePos.x = p.x
      mousePos.y = p.y
      cache.x = p.x
      cache.y = p.y
      lastMousePos = { x: p.x, y: p.y }
      startLoop()
      root.removeEventListener('mousemove', init as EventListener)
      root.removeEventListener('touchmove', init as EventListener)
    }

    root.addEventListener('mousemove', handleMove)
    root.addEventListener('touchmove', handleMove, { passive: true })
    root.addEventListener('mousemove', init as EventListener)
    root.addEventListener('touchmove', init as EventListener, { passive: true })

    return () => {
      ro.disconnect()
      window.cancelAnimationFrame(raf)
      root.removeEventListener('mousemove', handleMove)
      root.removeEventListener('touchmove', handleMove as EventListener)
      root.removeEventListener('mousemove', init as EventListener)
      root.removeEventListener('touchmove', init as EventListener)
    }
  }, [stableItems])

  return (
    <div className="card-trail-root" ref={rootRef} aria-hidden="true">
      {stableItems.map((it, idx) => (
        <div
          key={it.key}
          className="card-trail-item"
          ref={(el) => {
            if (!el) return
            cardRefs.current[idx] = el
          }}
        >
          <div className="card-trail-card">
            <div className="card-trail-top">
              <img className="card-trail-logo" src={it.logoSrc} alt="" />
              <div className="card-trail-name">{it.name}</div>
            </div>
            {it.quote ? <div className="card-trail-quote">{it.quote}</div> : null}
          </div>
        </div>
      ))}
    </div>
  )
}


import { useEffect, useMemo, useRef, useState } from 'react'
import { useGesture } from '@use-gesture/react'

export type OurWorkItem = {
  key: string
  brand: string
  metric: string
  metricLabel: string
  preview: string
  accent: string
  tags?: string[]
  logoSrc?: string
  logoAlt?: string
  /** Dark transparent logos need invert to stay readable on the dark card. */
  logoInvert?: boolean
  /** Some logos need a compact white plate for contrast; size stays the same. */
  logoWhiteBg?: boolean
}

type Props = {
  items: OurWorkItem[]
}

export function OurWorkCarousel({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [isMobileView, setIsMobileView] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const [grabbing, setGrabbing] = useState(false)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)')
    const sync = () => setIsMobileView(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!items.length) return
    if (paused || grabbing || !inView) return
    const id = window.setInterval(() => {
      setActive((p) => (p + 1) % items.length)
    }, 4200)
    return () => window.clearInterval(id)
  }, [items.length, paused, grabbing, inView])

  useEffect(() => {
    const onUp = () => {
      dragStartRef.current = null
      setGrabbing(false)
    }
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('blur', onUp)
    return () => {
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('blur', onUp)
    }
  }, [])

  const wrapIndex = (i: number) => {
    const n = items.length
    if (!n) return 0
    return ((i % n) + n) % n
  }

  const go = (dir: -1 | 1) => {
    setActive((prev) => wrapIndex(prev + dir))
  }

  const cards = useMemo(() => items.map((it, i) => ({ ...it, i })), [items])
  const itemCount = items.length

  const getCircularDelta = (index: number, center: number) => {
    if (!itemCount) return 0
    const direct = index - center
    const wrappedLeft = direct - itemCount
    const wrappedRight = direct + itemCount
    if (Math.abs(wrappedLeft) < Math.abs(direct) && Math.abs(wrappedLeft) <= Math.abs(wrappedRight)) return wrappedLeft
    if (Math.abs(wrappedRight) < Math.abs(direct)) return wrappedRight
    return direct
  }

  useGesture(
    {
      onDragStart: ({ event }) => {
        const ev = event as PointerEvent
        if (ev.pointerType === 'mouse' && ev.button !== 0) return
        const el = ev.target as HTMLElement | null
        if (el?.closest('button,a,input,textarea,select')) return
        dragStartRef.current = { x: ev.clientX, y: ev.clientY }
        setGrabbing(true)
      },
      onDrag: ({ event, last, movement }) => {
        if (!dragStartRef.current) return
        const ev = event as PointerEvent
        const mx = movement[0]
        const dx = ev.clientX - dragStartRef.current.x
        const dy = ev.clientY - dragStartRef.current.y

        if (ev.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.1 && Math.abs(dy) > 10) {
          dragStartRef.current = null
          setGrabbing(false)
          return
        }

        if (last) {
          dragStartRef.current = null
          setGrabbing(false)
          const threshold = isMobileView ? 36 : 44
          if (Math.abs(mx) < threshold) return
          if (mx > 0) setActive((p) => wrapIndex(p - 1))
          else setActive((p) => wrapIndex(p + 1))
        }
      },
    },
    { target: viewportRef, eventOptions: { passive: true }, drag: { axis: 'x', filterTaps: true } }
  )

  return (
    <div
      className={`owc${grabbing ? ' owc--grabbing' : ''}`}
      ref={viewportRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="owc-stack" aria-hidden="true">
        <span className="owc-stack-card" />
        <span className="owc-stack-card" />
        <span className="owc-stack-card" />
      </div>

      {cards.map((item) => {
        const delta = getCircularDelta(item.i, active)
        const isActive = delta === 0
        const isVisible = isMobileView ? isActive : Math.abs(delta) <= 1

        // these done by Daksh Sharma
        if (!isVisible) return null

        const abs = Math.abs(delta)
        const x = delta === 0 ? 0 : delta < 0 ? -52 : 66
        const scale = delta === 0 ? 1 : 0.976
        const opacity = isMobileView ? (isActive ? 1 : 0) : (delta === 0 ? 1 : 0.62)

        const style = {
          ['--ow-accent' as any]: item.accent,
          transform: `translate3d(${x}px, 0, 0) scale(${scale})`,
          opacity,
          zIndex: 100 - abs,
        } as React.CSSProperties

        return (
          <article
            key={item.key}
            className={`owc-card${isActive ? ' owc-card--active' : ''}${isVisible ? '' : ' owc-card--off'}${isMobileView ? ' owc-card--mobile' : ''}`}
            style={style}
            aria-hidden={!isVisible}
            onContextMenu={(e) => {
              const el = e.target as HTMLElement | null
              if (el?.closest('button,a,input,textarea,select')) return
              e.preventDefault()
            }}
          >
            <div className="owc-inner">
              <div className="owc-left">
                {item.logoSrc ? (
                  <img
                    className={`owc-company-logo${item.logoInvert ? ' owc-company-logo--invert' : ''}${item.logoWhiteBg ? ' owc-company-logo--white-bg' : ''}`}
                    src={item.logoSrc}
                    alt={item.logoAlt ?? `${item.brand} logo`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                ) : null}

                <div className="owc-brand">
                  <span className="owc-brand-mark" aria-hidden="true" />
                  <span className="owc-brand-name">{item.brand}</span>
                </div>

                <div className="owc-metric">
                  <div className={`owc-metric-num${item.metricLabel ? '' : ' owc-metric-tagline'}`}>{item.metric}</div>
                  {item.metricLabel ? <div className="owc-metric-copy">{item.metricLabel}</div> : null}
                </div>

                <div className="owc-tags" aria-label={`${item.brand} tags`}>
                  {(item.tags ?? []).slice(0, 4).map((t) => (
                    <span key={t} className="owc-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="owc-right">
                <div className="owc-preview">
                  <img src={item.preview} alt={`${item.brand} preview`} loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
          </article>
        )
      })}

      <button className="owc-arrow owc-arrow--left" type="button" onClick={() => go(-1)} aria-label="Previous project" />
      <button className="owc-arrow owc-arrow--right" type="button" onClick={() => go(1)} aria-label="Next project" />
    </div>
  )
}

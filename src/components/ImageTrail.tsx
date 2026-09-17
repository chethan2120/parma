import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import './ImageTrail.css'

function lerp(a: number, b: number, n: number): number {
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
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.hypot(dx, dy)
}

class ImageItem {
  public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null } = {
    el: null as unknown as HTMLDivElement,
    inner: null,
  }
  public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 }
  public rect: DOMRect | null = null
  private resize!: () => void

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner')
    this.getRect()
    this.initEvents()
  }

  private initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle)
      this.getRect()
    }
    window.addEventListener('resize', this.resize)
  }

  private getRect() {
    this.rect = this.DOM.el.getBoundingClientRect()
  }

  public destroy() {
    window.removeEventListener('resize', this.resize)
  }
}

class ImageTrailVariant1 {
  private container: HTMLDivElement
  private eventsEl: HTMLElement
  private images: ImageItem[]
  private zIndexVal: number
  private activeImagesCount: number
  private isIdle: boolean
  private threshold: number
  private mousePos: { x: number; y: number }
  private lastMousePos: { x: number; y: number }
  private cacheMousePos: { x: number; y: number }
  private inside: boolean
  private idleImg: ImageItem | null
  private trailImages: ImageItem[]
  private visibleQueue: ImageItem[]
  private visibleTotal: number
  private lastMoveTs: number
  private lastSpawnTs: number
  private spawnEveryMs: number
  private bag: number[]
  private bagPos: number
  // Done by Daksh Sharma: Flag to keep track of running rAF loop
  private loopRunning = false

  public destroy?: () => void

  private startLoop() {
    if (!this.loopRunning) {
      this.loopRunning = true
      window.requestAnimationFrame(() => this.render())
    }
  }

  constructor(container: HTMLDivElement, eventsEl?: HTMLElement) {
    this.container = container
    this.eventsEl = eventsEl || container
    this.images = [...container.querySelectorAll('.content__img')].map((img) => new ImageItem(img as HTMLDivElement))
    this.zIndexVal = 1
    this.activeImagesCount = 0
    this.isIdle = true
    this.threshold = 70
    this.mousePos = { x: 0, y: 0 }
    this.lastMousePos = { x: 0, y: 0 }
    this.cacheMousePos = { x: 0, y: 0 }
    this.inside = false

    // Reserve first item as an "idle preview" (single image shown while cursor is present).
    this.idleImg = this.images[0] || null
    this.trailImages = this.images.slice(1)
    this.visibleQueue = []
    this.visibleTotal = 4
    this.lastMoveTs = performance.now()
    this.lastSpawnTs = 0
    this.spawnEveryMs = 750
    this.bag = []
    this.bagPos = 0

    // these done by Daksh Sharma
    let containerRect = this.container.getBoundingClientRect()
    const ro = new ResizeObserver(() => {
      containerRect = this.container.getBoundingClientRect()
    })
    ro.observe(this.container)

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      this.mousePos = getLocalPointerPos(ev, containerRect)
      this.lastMoveTs = performance.now()
      this.startLoop()
    }

    const onEnter = () => {
      this.inside = true
      if (this.idleImg) {
        gsap.killTweensOf(this.idleImg.DOM.el)
        gsap.set(this.idleImg.DOM.el, { opacity: 1, scale: 1 })
      }
      this.startLoop()
    }
    const onLeave = () => {
      this.inside = false
      // Hide everything when leaving the section.
      this.images.forEach((img) => gsap.set(img.DOM.el, { opacity: 0 }))
      this.visibleQueue = []
    }

    this.eventsEl.addEventListener('mousemove', handlePointerMove)
    this.eventsEl.addEventListener('touchmove', handlePointerMove, { passive: true })
    this.eventsEl.addEventListener('mouseenter', onEnter)
    this.eventsEl.addEventListener('mouseleave', onLeave)

    const initRender = (ev: MouseEvent | TouchEvent) => {
      this.mousePos = getLocalPointerPos(ev, containerRect)
      this.cacheMousePos = { ...this.mousePos }
      this.lastMousePos = { ...this.mousePos }
      this.startLoop()
      this.eventsEl.removeEventListener('mousemove', initRender as EventListener)
      this.eventsEl.removeEventListener('touchmove', initRender as EventListener)
    }
    this.eventsEl.addEventListener('mousemove', initRender as EventListener)
    this.eventsEl.addEventListener('touchmove', initRender as EventListener, { passive: true })

    this.destroy = () => {
      ro.disconnect()
      this.eventsEl.removeEventListener('mousemove', handlePointerMove)
      this.eventsEl.removeEventListener('touchmove', handlePointerMove as EventListener)
      this.eventsEl.removeEventListener('mouseenter', onEnter)
      this.eventsEl.removeEventListener('mouseleave', onLeave)
      this.eventsEl.removeEventListener('mousemove', initRender as EventListener)
      this.eventsEl.removeEventListener('touchmove', initRender as EventListener)
      this.images.forEach(img => img.destroy && img.destroy())
    }

    // Initialize shuffled "bag" so images rotate randomly without repeating too often.
    this.refillBag()
  }

  private refillBag() {
    const n = this.trailImages.length
    this.bag = Array.from({ length: n }, (_, i) => i)
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]
    }
    this.bagPos = 0
  }

  private render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos)
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.12)
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.12)

    const now = performance.now()
    const stableForMs = now - this.lastMoveTs
    const isStable = this.inside && stableForMs > 220

    // When cursor is inside and truly stable -> show only one idle image.
    if (isStable && this.idleImg) {
      const el = this.idleImg.DOM.el
      const w = this.idleImg.rect?.width ?? 0
      const h = this.idleImg.rect?.height ?? 0
      gsap.set(el, {
        opacity: 1,
        scale: 1,
        zIndex: 9999,
        x: this.cacheMousePos.x - w / 2,
        y: this.cacheMousePos.y - h / 2,
      })
    }

    // While moving (even slowly), rotate the front image periodically.
    const isMoving = this.inside && stableForMs < 160
    if (isMoving && now - this.lastSpawnTs > this.spawnEveryMs) {
      if (this.idleImg) gsap.set(this.idleImg.DOM.el, { opacity: 0 })
      this.showNextImage()
      this.lastSpawnTs = now
    }

    // Also spawn immediately when movement is fast enough.
    if (distance > this.threshold) {
      if (this.idleImg) gsap.set(this.idleImg.DOM.el, { opacity: 0 })
      this.showNextImage()
      this.lastSpawnTs = now
      this.lastMousePos = { ...this.mousePos }
    }

    // Keep lastMousePos in sync when stable, so slow movement doesn't "stick".
    if (isStable) {
      this.lastMousePos = { ...this.mousePos }
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1

    // Done by Daksh Sharma: Stop rAF when mouse is stationary, lerp finished, and animations are idle
    const diffX = Math.abs(this.cacheMousePos.x - this.mousePos.x)
    const diffY = Math.abs(this.cacheMousePos.y - this.mousePos.y)
    if (this.isIdle && diffX < 0.05 && diffY < 0.05) {
      this.loopRunning = false
      return
    }

    window.requestAnimationFrame(() => this.render())
  }

  private showNextImage() {
    if (!this.trailImages.length) return
    ++this.zIndexVal
    if (this.bagPos >= this.bag.length) this.refillBag()
    const idx = this.bag[this.bagPos] ?? 0
    this.bagPos += 1
    const img = this.trailImages[idx]!

    gsap.killTweensOf(img.DOM.el)

    // Keep a connected stack of the last N items visible (full content),
    // and only fade the oldest item when the queue is full.
    this.visibleQueue.push(img)
    if (this.visibleQueue.length > this.visibleTotal) {
      const old = this.visibleQueue.shift()
      if (old) {
        gsap.killTweensOf(old.DOM.el)
        gsap.to(old.DOM.el, { duration: 0.7, ease: 'power2.out', opacity: 0 })
      }
    }

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.cacheMousePos.y - (img.rect?.height ?? 0) / 2,
        },
        {
          duration: 0.5,
          ease: 'power2.out',
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2,
        },
        0
      )
      // Slight settle so the stack looks connected (no shrink/fade here).
      .to(
        img.DOM.el,
        {
          duration: 0.34,
          ease: 'power1.out',
          x: this.mousePos.x - (img.rect?.width ?? 0) / 2,
          y: this.mousePos.y - (img.rect?.height ?? 0) / 2,
        },
        0.5
      )
  }

  private onImageActivated() {
    this.activeImagesCount++
    this.isIdle = false
  }

  private onImageDeactivated() {
    this.activeImagesCount--
    if (this.activeImagesCount === 0) {
      this.isIdle = true
      this.startLoop()
    }
  }
}

type ImageTrailConstructor = typeof ImageTrailVariant1

const variantMap: Record<number, ImageTrailConstructor> = {
  1: ImageTrailVariant1,
}

type ImageTrailProps = {
  items?: string[]
  variant?: number | string
}

export default function ImageTrail({ items = [], variant = 1 }: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const v = typeof variant === 'string' ? Number.parseInt(variant, 10) : variant
    const Cls = variantMap[v] || variantMap[1]
    const eventsEl = containerRef.current.parentElement || containerRef.current
    const instance = new Cls(containerRef.current, eventsEl)
    
    return () => {
      instance.destroy?.()
    }
    // We intentionally don't re-init on `items` changes; parent can remount via `key` if needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  return (
    <div className="image-trail-root" ref={containerRef} aria-hidden="true">
      {items.map((url, i) => (
        <div className="content__img" key={`${url}:${i}`}>
          <div className="content__img-inner" style={{ backgroundImage: `url(${url})` }} />
        </div>
      ))}
    </div>
  )
}


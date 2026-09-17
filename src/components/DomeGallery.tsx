import { useEffect, useMemo, useRef, useCallback } from 'react'
import { useGesture } from '@use-gesture/react'
import './DomeGallery.css'

export type DomeGalleryImageItem = string | { src: string; alt?: string }

type DomeGalleryProps = {
  images?: DomeGalleryImageItem[]
  fit?: number
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height'
  minRadius?: number
  maxRadius?: number
  padFactor?: number
  overlayBlurColor?: string
  maxVerticalRotationDeg?: number
  dragSensitivity?: number
  enlargeTransitionMs?: number
  segments?: number
  dragDampening?: number
  openedImageWidth?: string
  openedImageHeight?: string
  imageBorderRadius?: string
  openedImageBorderRadius?: string
  grayscale?: boolean
}

type ItemDef = {
  src: string
  alt: string
  x: number
  y: number
  sizeX: number
  sizeY: number
}

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 260,
  segments: 19,
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360
  return a - 180
}
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`)
  const n = attr == null ? NaN : parseFloat(attr)
  return Number.isFinite(n) ? n : fallback
}

function buildItems(pool: DomeGalleryImageItem[], seg: number): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2)
  const evenYs = [-4, -2, 0, 2, 4]
  const oddYs = [-3, -1, 1, 3, 5]

  const coords = xCols.flatMap((x, xi) => {
    const ys = xi % 2 === 0 ? evenYs : oddYs
    return ys.map((y, yi) => ({ x, y, sizeX: 2, sizeY: 2, xi, yi }))
  })

  if (pool.length === 0) return coords.map((c) => ({ ...c, src: '', alt: '' }))

  const normalized = pool.map((image) =>
    typeof image === 'string' ? { src: image, alt: '' } : { src: image.src || '', alt: image.alt || '' }
  )

  // Deduplicate incoming items by src (some lists may already contain repeats).
  const uniqueItems: { src: string; alt: string }[] = []
  const seen = new Set<string>()
  for (const it of normalized) {
    if (!it.src) continue
    if (seen.has(it.src)) continue
    seen.add(it.src)
    uniqueItems.push(it)
  }
  if (uniqueItems.length === 0) return coords.map((c) => ({ ...c, src: '', alt: '' }))

  /*
   * Use a deterministic coprime stride to spread repeated logos around the
   * sphere. The previous randomized local-search pass rescored every tile
   * thousands of times during render, which could block the main thread for a
   * noticeable period. This produces an even, stable distribution in O(n).
   */
  const logoCount = uniqueItems.length
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  let stride = Math.max(1, Math.floor(logoCount / 2))
  while (stride > 1 && gcd(stride, logoCount) !== 1) stride -= 1

  return coords.map((coord, index) => {
    const cycle = Math.floor(index / logoCount)
    const logo = uniqueItems[(index * stride + cycle) % logoCount]!
    return {
      x: coord.x,
      y: coord.y,
      sizeX: coord.sizeX,
      sizeY: coord.sizeY,
      src: logo.src,
      alt: logo.alt,
    }
  })

  /* Legacy distribution code kept below for source-history context. */
  /*
  const totalSlots = coords.length

  // Shuffle-based distribution + prevent nearby repetition:
  // Assign logos to grid positions in a center-out order and avoid placing the same
  // logo adjacent to already placed neighbors (and recent placements).
  const centerXi = (seg - 1) / 2
  const ordered = [...coords].sort((a, b) => {
    const da = Math.abs(a.xi - centerXi) + Math.abs(a.yi - 2) * 1.2
    const db = Math.abs(b.xi - centerXi) + Math.abs(b.yi - 2) * 1.2
    return da - db
  })

  const indexByKey = new Map<string, number>()
  ordered.forEach((c, i) => indexByKey.set(`${c.xi}:${c.yi}`, i))

  const placed = new Array<{ src: string; alt: string } | null>(ordered.length).fill(null)

  // Even duplication counts: spread repeats across the full globe (avoid 3–4 copies in the same view).
  const m = uniqueItems.length
  const base = Math.floor(totalSlots / m)
  const rem = totalSlots % m
  const baseRemaining = new Array<number>(m).fill(base)
  const remOrder0 = shuffleInPlace(Array.from({ length: m }, (_, i) => i))
  for (let i = 0; i < rem; i += 1) baseRemaining[remOrder0[i]!] += 1

  // "Visible core" cap: strongly limit how many times a logo can appear in the front-center band.
  // This prevents scenarios like "same logo 4 times in one frame" when logo count is low.
  const frontBand = seg * 0.22
  const frontSlots = ordered.filter((c) => Math.abs(c.xi - centerXi) <= frontBand).length
  const theoreticalCap = Math.ceil(frontSlots / Math.max(1, m))
  const frontCap = clamp(theoreticalCap, 1, 2)

  // Neighbor detection must match the visual tiling (includes diagonals + wrap-around columns).
  // This is the key to preventing "same logo side-by-side" in the visible frame.
  const neighborIdxByI: number[][] = ordered.map((c, i) => {
    const out: number[] = []
    for (let j = 0; j < ordered.length; j += 1) {
      if (j === i) continue
      const o = ordered[j]!
      let dxi = Math.abs(c.xi - o.xi)
      dxi = Math.min(dxi, seg - dxi) // wrap-around adjacency
      const dx = dxi * 2
      const dy = Math.abs(c.y - o.y)
      const dist = Math.hypot(dx, dy)
      if (dist <= 2.26) out.push(j)
    }
    return out
  })

  // Distance-aware distribution:
  // Build hop neighborhoods (1–3 hops) on top of the adjacency graph so the same logo
  // stays ~2–3 tiles away (not just immediate neighbors).
  const hopNByI: number[][] = neighborIdxByI.map((_, start) => {
    const seenHop = new Set<number>([start])
    let frontier = new Set<number>([start])
    for (let depth = 0; depth < 3; depth += 1) {
      const next = new Set<number>()
      frontier.forEach((v) => {
        neighborIdxByI[v]?.forEach((u) => {
          if (!seenHop.has(u)) {
            seenHop.add(u)
            next.add(u)
          }
        })
      })
      frontier = next
    }
    seenHop.delete(start)
    return [...seenHop]
  })

  const isFrontByI = ordered.map((c) => Math.abs(c.xi - centerXi) <= frontBand)

  const scoreOf = (assign: number[]) => {
    let score = 0
    for (let i = 0; i < assign.length; i += 1) {
      const ai = assign[i]!
      for (const j of hopNByI[i]!) {
        if (j <= i) continue
        if (assign[j] === ai) score += isFrontByI[i] || isFrontByI[j] ? 6 : 3
      }
    }
    return score
  }

  const buildInitialAssign = () => {
    const arr: number[] = []
    for (let idx = 0; idx < m; idx += 1) {
      for (let k = 0; k < baseRemaining[idx]!; k += 1) arr.push(idx)
    }
    shuffleInPlace(arr)
    return arr
  }

  const enforceFrontCaps = (assign: number[]) => {
    // Softly enforce the front cap by swapping offenders with non-front positions.
    const counts = new Array<number>(m).fill(0)
    for (let i = 0; i < assign.length; i += 1) {
      if (!isFrontByI[i]) continue
      counts[assign[i]!] += 1
    }
    for (let i = 0; i < assign.length; i += 1) {
      if (!isFrontByI[i]) continue
      const li = assign[i]!
      if (counts[li]! <= frontCap) continue
      for (let j = assign.length - 1; j >= 0; j -= 1) {
        if (isFrontByI[j]) continue
        const lj = assign[j]!
        if (counts[lj]! >= frontCap) continue
        // swap
        assign[i] = lj
        assign[j] = li
        counts[li] -= 1
        counts[lj] += 1
        break
      }
    }
  }

  const optimizeAssign = (assign: number[]) => {
    let bestScore = scoreOf(assign)
    const n = assign.length

    // Local search swaps to push identical logos apart.
    const maxIters = 8000
    for (let it = 0; it < maxIters; it += 1) {
      const a = Math.floor(Math.random() * n)
      const b = Math.floor(Math.random() * n)
      if (a === b) continue
      if (assign[a] === assign[b]) continue

      // Skip swaps that would violate front cap more.
      const aFront = isFrontByI[a]
      const bFront = isFrontByI[b]
      if (aFront !== bFront) {
        // allow, but we'll re-enforce caps after batch swaps
      }

      const tmp = assign[a]!
      assign[a] = assign[b]!
      assign[b] = tmp

      const s = scoreOf(assign)
      if (s <= bestScore) {
        bestScore = s
      } else {
        // revert
        const t2 = assign[a]!
        assign[a] = assign[b]!
        assign[b] = t2
      }

      // Early exit if extremely clean.
      if (bestScore === 0) break
    }
    return bestScore
  }

  // Multiple randomized initializations + optimization; keep the best.
  let bestAssign = buildInitialAssign()
  enforceFrontCaps(bestAssign)
  let bestScore = optimizeAssign(bestAssign)

  for (let t = 0; t < 5; t += 1) {
    const cand = buildInitialAssign()
    enforceFrontCaps(cand)
    const s = optimizeAssign(cand)
    if (s < bestScore) {
      bestScore = s
      bestAssign = cand
    }
    if (bestScore === 0) break
  }

  for (let i = 0; i < placed.length; i += 1) placed[i] = uniqueItems[bestAssign[i]!]!

  // Restore original order (coords list) while using placements from ordered list.
  const placedByKey = new Map<string, { src: string; alt: string }>()
  ordered.forEach((c, i) => {
    const p = placed[i]!
    placedByKey.set(`${c.xi}:${c.yi}`, p)
  })

  // Avoid placing identical src next to each other where possible.
  // (Already handled above with neighbor constraints.)

  return coords.map((c) => {
    const p = placedByKey.get(`${c.xi}:${c.yi}`) ?? uniqueItems[0]!
    return { x: c.x, y: c.y, sizeX: c.sizeX, sizeY: c.sizeY, src: p.src, alt: p.alt }
  })
  */
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2
  const rotateY = unit * (offsetX + (sizeX - 1) / 2)
  const rotateX = unit * (offsetY - (sizeY - 1) / 2)
  return { rotateX, rotateY }
}

export default function DomeGallery({
  images = [],
  fit = 0.52,
  fitBasis = 'auto',
  minRadius = 520,
  maxRadius = Infinity,
  padFactor = 0.2,
  overlayBlurColor = '#F5EFE5',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 0.8,
  openedImageWidth = '520px',
  openedImageHeight = '360px',
  imageBorderRadius = '14px',
  openedImageBorderRadius = '20px',
  grayscale = true,
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const focusedElRef = useRef<HTMLElement | null>(null)
  const originalTilePositionRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)
  // these done by Daksh Sharma
  const cachedBoundsRef = useRef<{mainR: DOMRect | null, frameR: DOMRect | null}>({ mainR: null, frameR: null })

  const rotationRef = useRef({ x: 0, y: 0 })
  const startRotRef = useRef({ x: 0, y: 0 })
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const draggingRef = useRef(false)
  const inertiaRAF = useRef<number | null>(null)
  const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>('mouse')
  const tapTargetRef = useRef<HTMLElement | null>(null)
  const openingRef = useRef(false)
  const openStartedAtRef = useRef(0)
  const lastDragEndAt = useRef(0)
  const movedRef = useRef(false)
  const autoRAF = useRef<number | null>(null)
  const lastAutoT = useRef(0)
  const touchIntentRef = useRef<'undecided' | 'rotate' | 'scroll'>('undecided')
  const isTouchDeviceRef = useRef(false)

  const scrollLockedRef = useRef(false)
  const scrollYRef = useRef(0)
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return
    scrollLockedRef.current = true
    scrollYRef.current = window.scrollY || window.pageYOffset || 0
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.classList.add('dg-scroll-lock')
  }, [])
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return
    scrollLockedRef.current = false
    document.body.classList.remove('dg-scroll-lock')
    const top = document.body.style.top
    document.body.style.top = ''
    const y = top ? Math.abs(parseInt(top, 10) || 0) : scrollYRef.current
    window.scrollTo(0, y)
  }, [])

  const items = useMemo(() => buildItems(images, segments), [images, segments])

  useEffect(() => {
    isTouchDeviceRef.current = window.matchMedia('(hover: none), (pointer: coarse)').matches
  }, [])

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current
    if (el) el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`
  }

  const lockedRadiusRef = useRef<number | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      const w = Math.max(1, cr.width)
      const h = Math.max(1, cr.height)
      const minDim = Math.min(w, h)
      const maxDim = Math.max(w, h)
      const aspect = w / h

      let basis: number
      switch (fitBasis) {
        case 'min': basis = minDim; break
        case 'max': basis = maxDim; break
        case 'width': basis = w; break
        case 'height': basis = h; break
        default: basis = aspect >= 1.3 ? w : minDim
      }

      let radius = basis * fit
      // Allow a bit more zoom-in before capping by height.
      radius = Math.min(radius, h * 1.9)
      radius = clamp(radius, minRadius, maxRadius)
      lockedRadiusRef.current = Math.round(radius)

      const viewerPad = Math.max(8, Math.round(minDim * padFactor))

      // Done by Daksh Sharma: Optimized ResizeObserver callback to avoid forced reflows (layout thrashing)
      // Why:
      // 1. We read layout properties (getBoundingClientRect) BEFORE writing style properties (style.setProperty).
      //    This uses cached layout bounds and prevents triggering synchronous layout recalculation.
      // 2. We completely eliminated the creation/measurement of 'tempDiv' (which was appending/removing to body
      //    and calling getBoundingClientRect on every resize, causing a heavy forced reflow).
      // 3. We position and size the enlarged overlay directly to match the .viewer-frame bounds on resize.
      
      let frameR: DOMRect | null = null
      let mainR: DOMRect | null = null
      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null

      if (frameRef.current && mainRef.current) {
        frameR = frameRef.current.getBoundingClientRect()
        mainR = mainRef.current.getBoundingClientRect()
        cachedBoundsRef.current = { mainR, frameR }
      }

      // Perform all writes (DOM mutations and style updates) at the end of the callback
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`)
      root.style.setProperty('--viewer-pad', `${viewerPad}px`)
      root.style.setProperty('--overlay-blur-color', overlayBlurColor)
      root.style.setProperty('--tile-radius', imageBorderRadius)
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius)
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none')
      applyTransform(rotationRef.current.x, rotationRef.current.y)

      if (enlargedOverlay && frameR && mainR) {
        enlargedOverlay.style.left = `${frameR.left - mainR.left}px`
        enlargedOverlay.style.top = `${frameR.top - mainR.top}px`
        enlargedOverlay.style.width = `${frameR.width}px`
        enlargedOverlay.style.height = `${frameR.height}px`
      }
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, openedImageBorderRadius])

  useEffect(() => { applyTransform(rotationRef.current.x, rotationRef.current.y) }, [])

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current)
      inertiaRAF.current = null
    }
  }, [])

  const startInertia = useCallback((vx: number, vy: number) => {
    const MAX_V = 1.4
    let vX = clamp(vx, -MAX_V, MAX_V) * 80
    let vY = clamp(vy, -MAX_V, MAX_V) * 80
    let frames = 0
    const d = clamp(dragDampening ?? 0.6, 0, 1)
    const frictionMul = 0.94 + 0.055 * d
    const stopThreshold = 0.015 - 0.01 * d
    const maxFrames = Math.round(90 + 270 * d)

    const step = () => {
      vX *= frictionMul
      vY *= frictionMul
      if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) { inertiaRAF.current = null; return }
      if (++frames > maxFrames) { inertiaRAF.current = null; return }
      const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg)
      const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200)
      rotationRef.current = { x: nextX, y: nextY }
      applyTransform(nextX, nextY)
      inertiaRAF.current = requestAnimationFrame(step)
    }
    stopInertia()
    inertiaRAF.current = requestAnimationFrame(step)
  }, [dragDampening, maxVerticalRotationDeg, stopInertia])

  const openItemFromElement = useCallback((el: HTMLElement) => {
    if (openingRef.current) return
    openingRef.current = true
    openStartedAtRef.current = performance.now()
    lockScroll()

    const parent = el.parentElement as HTMLElement
    focusedElRef.current = el

    const offsetX = getDataNumber(parent, 'offsetX', 0)
    const offsetY = getDataNumber(parent, 'offsetY', 0)
    const sizeX = getDataNumber(parent, 'sizeX', 2)
    const sizeY = getDataNumber(parent, 'sizeY', 2)
    const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments)
    const parentY = normalizeAngle(parentRot.rotateY)
    const globalY = normalizeAngle(rotationRef.current.y)
    let rotY = -(parentY + globalY) % 360
    if (rotY < -180) rotY += 360
    const rotX = -parentRot.rotateX - rotationRef.current.x
    parent.style.setProperty('--rot-y-delta', `${rotY}deg`)
    parent.style.setProperty('--rot-x-delta', `${rotX}deg`)

    const refDiv = document.createElement('div')
    refDiv.className = 'item__image item__image--reference'
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`
    parent.appendChild(refDiv)
    void refDiv.offsetHeight

    const tileR = refDiv.getBoundingClientRect()
    const mainR = cachedBoundsRef.current.mainR
    const frameR = cachedBoundsRef.current.frameR
    if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
      openingRef.current = false
      focusedElRef.current = null
      refDiv.remove()
      unlockScroll()
      return
    }

    originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height }
    el.style.visibility = 'hidden'

    const overlay = document.createElement('div')
    overlay.className = 'enlarge'
    overlay.style.cssText = `position:absolute;left:${frameR.left - mainR.left}px;top:${frameR.top - mainR.top}px;width:${frameR.width}px;height:${frameR.height}px;opacity:0;z-index:30;will-change:transform,opacity;transform-origin:top left;transition:transform ${enlargeTransitionMs}ms ease,opacity ${enlargeTransitionMs}ms ease;border-radius:${openedImageBorderRadius};overflow:hidden;box-shadow:0 14px 40px rgba(15,23,42,.22);`

    const rawSrc = parent.dataset.src || (el.querySelector('img') as HTMLImageElement | null)?.src || ''
    const rawAlt = parent.dataset.alt || (el.querySelector('img') as HTMLImageElement | null)?.alt || ''
    const img = document.createElement('img')
    img.src = rawSrc
    img.alt = rawAlt
    img.style.cssText = `width:100%;height:100%;object-fit:contain;filter:${grayscale ? 'grayscale(1)' : 'none'};`
    overlay.appendChild(img)
    viewerRef.current?.appendChild(overlay)

    const tx0 = tileR.left - frameR.left
    const ty0 = tileR.top - frameR.top
    const sx0 = tileR.width / frameR.width
    const sy0 = tileR.height / frameR.height
    overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`

    setTimeout(() => {
      if (!overlay.parentElement) return
      overlay.style.opacity = '1'
      overlay.style.transform = 'translate(0px, 0px) scale(1, 1)'
      rootRef.current?.setAttribute('data-enlarging', 'true')
    }, 16)
  }, [enlargeTransitionMs, grayscale, lockScroll, openedImageBorderRadius, segments, unlockScroll, openedImageWidth, openedImageHeight])

  useGesture({
    onDragStart: ({ event }) => {
      if (focusedElRef.current) return
      stopInertia()
      const evt = event as PointerEvent
      pointerTypeRef.current = (evt.pointerType as any) || 'mouse'
      if (pointerTypeRef.current === 'touch') touchIntentRef.current = 'undecided'
      draggingRef.current = true
      movedRef.current = false
      startRotRef.current = { ...rotationRef.current }
      startPosRef.current = { x: evt.clientX, y: evt.clientY }
      tapTargetRef.current = (evt.target as Element).closest?.('.item__image') as HTMLElement | null
    },
    onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0] }) => {
      if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return
      const evt = event as PointerEvent

      const dxTotal = evt.clientX - startPosRef.current.x
      const dyTotal = evt.clientY - startPosRef.current.y
      if (pointerTypeRef.current === 'touch' && touchIntentRef.current === 'undecided') {
        const absX = Math.abs(dxTotal)
        const absY = Math.abs(dyTotal)
        if (absX > 8 || absY > 8) {
          touchIntentRef.current = absX > absY * 1.12 ? 'rotate' : 'scroll'
        }
      }
      if (pointerTypeRef.current === 'touch' && touchIntentRef.current === 'scroll') {
        if (last) {
          draggingRef.current = false
          startPosRef.current = null
          tapTargetRef.current = null
          touchIntentRef.current = 'undecided'
          lastDragEndAt.current = performance.now()
        }
        return
      }
      if (pointerTypeRef.current === 'touch' && touchIntentRef.current === 'rotate') {
        evt.preventDefault()
      }
      if (!movedRef.current) {
        const dist2 = dxTotal * dxTotal + dyTotal * dyTotal
        if (dist2 > 16) movedRef.current = true
      }

      const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg)
      const nextY = startRotRef.current.y + dxTotal / dragSensitivity
      rotationRef.current = { x: nextX, y: nextY }
      applyTransform(nextX, nextY)

      if (last) {
        draggingRef.current = false
        let [vMagX, vMagY] = velArr
        const [dirX, dirY] = dirArr
        const vx = vMagX * dirX
        const vy = vMagY * dirY
        if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy)
        startPosRef.current = null

        tapTargetRef.current = null

        touchIntentRef.current = 'undecided'
        lastDragEndAt.current = performance.now()
      }
    },
  }, { target: mainRef, eventOptions: { passive: false } })

  // Done by Daksh Sharma: Slower, natural auto-rotation that pauses while dragging, while an image is open,
  // or when the entire DomeGallery component is off-screen (via IntersectionObserver) to prevent wasting CPU.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let loopActive = false
    let inView = false
    let autoRAFId: number | null = null

    const step = (t: number) => {
      if (!lastAutoT.current) lastAutoT.current = t
      // Run at the display's native refresh rate. dt keeps angular speed constant
      // regardless of fps, so no throttle gate is needed (the gate produced uneven
      // frame spacing that read as micro-stutter).
      const dt = Math.min(0.05, (t - lastAutoT.current) / 1000)
      lastAutoT.current = t

      const isOpen = rootRef.current?.getAttribute('data-enlarging') === 'true'
      if (!draggingRef.current && !isOpen) {
        const nextY = wrapAngleSigned(rotationRef.current.y + dt * 3.2)
        rotationRef.current = { x: rotationRef.current.x, y: nextY }
        applyTransform(rotationRef.current.x, nextY)
      }

      if (loopActive) {
        autoRAFId = requestAnimationFrame(step)
        autoRAF.current = autoRAFId
      }
    }

    const start = () => {
      if (!loopActive && inView && !document.hidden) {
        loopActive = true
        lastAutoT.current = 0
        autoRAFId = requestAnimationFrame(step)
        autoRAF.current = autoRAFId
      }
    }

    const stop = () => {
      loopActive = false
      if (autoRAFId) {
        cancelAnimationFrame(autoRAFId)
        autoRAFId = null
        autoRAF.current = null
      }
    }

    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        root.dataset.active = String(inView)
        if (inView && !document.hidden) {
          start()
        } else {
          stop()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(root)

    const onVisibilityChange = () => {
      if (document.hidden || !inView) stop()
      else start()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      delete root.dataset.active
      stop()
    }
  }, [])

  useEffect(() => {
    const scrim = scrimRef.current
    if (!scrim) return

    const close = () => {
      if (performance.now() - openStartedAtRef.current < 240) return
      const el = focusedElRef.current
      if (!el) return

      const parent = el.parentElement as HTMLElement
      const overlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null
      if (!overlay) return

      overlay.remove()
      parent.style.setProperty('--rot-y-delta', `0deg`)
      parent.style.setProperty('--rot-x-delta', `0deg`)
      el.style.visibility = ''
      focusedElRef.current = null
      rootRef.current?.removeAttribute('data-enlarging')
      openingRef.current = false
      originalTilePositionRef.current = null
      unlockScroll()
    }

    scrim.addEventListener('click', close)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      scrim.removeEventListener('click', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [unlockScroll])

  return (
    <div
      ref={rootRef}
      className="dg-root"
      style={
        {
          ['--segments-x' as any]: segments,
          ['--segments-y' as any]: segments,
          ['--overlay-blur-color' as any]: overlayBlurColor,
          ['--tile-radius' as any]: imageBorderRadius,
          ['--enlarge-radius' as any]: openedImageBorderRadius,
          ['--image-filter' as any]: grayscale ? 'grayscale(1)' : 'none',
        } as React.CSSProperties
      }
    >
      <main ref={mainRef} className="dg-main">
        <div className="dg-stage">
          <div ref={sphereRef} className="dg-sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="dg-item"
                data-src={it.src}
                data-alt={it.alt}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={
                  {
                    ['--offset-x' as any]: it.x,
                    ['--offset-y' as any]: it.y,
                    ['--item-size-x' as any]: it.sizeX,
                    ['--item-size-y' as any]: it.sizeY,
                  } as React.CSSProperties
                }
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || 'Open image'}
                  onClick={(e) => {
                    if (isTouchDeviceRef.current) return
                    if (draggingRef.current) return
                    if (performance.now() - lastDragEndAt.current < 90) return
                    if (openingRef.current) return
                    openItemFromElement(e.currentTarget as HTMLElement)
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return
                    if (openingRef.current) return
                    openItemFromElement(e.currentTarget as HTMLElement)
                  }}
                >
                  {/* Lighthouse fix: Added loading="lazy" + decoding="async".
                      Why: The DomeGallery renders ~175 image tiles on a 3D sphere.
                      Without lazy loading, the browser tries to fetch ALL 175 images
                      immediately, even tiles that are rotated behind the sphere and
                      invisible. The Lighthouse report flagged this as a major
                      contributor to the >15MB total network payload.
                      loading="lazy" defers offscreen image requests.
                      decoding="async" prevents main-thread blocking during decode. */}
                  {it.src ? <img src={it.src} draggable={false} alt={it.alt} loading="lazy" decoding="async" /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dg-overlay dg-overlay--radial" aria-hidden="true" />
        <div className="dg-overlay dg-overlay--blur" aria-hidden="true" />
        <div className="dg-overlay dg-overlay--top" aria-hidden="true" />
        <div className="dg-overlay dg-overlay--bottom" aria-hidden="true" />

        <div ref={viewerRef} className="dg-viewer" style={{ padding: 'var(--viewer-pad)' }}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="viewer-frame" />
        </div>
      </main>
    </div>
  )
}

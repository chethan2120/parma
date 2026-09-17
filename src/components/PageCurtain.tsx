/**
 * Full-screen branded curtain shown on first load and on every route change.
 *
 * Purpose is not decoration: the first ~500ms of a route is when the page is
 * least smooth — the lazy chunk evaluates, fonts swap and reflow text, images
 * decode, GSAP measures triggers and pins. The curtain covers exactly that window
 * and only lifts once the page is both ready AND has proved it can hit frame
 * budget, so the user's first interaction with the page is with a settled page.
 *
 * Readiness gates, in order:
 *   1. route content actually mounted (routes are lazy-loaded)
 *   2. document.fonts.ready — no text reflow after the reveal
 *   3. images near the viewport decoded — no pop-in after the reveal
 *   4. a short frame-budget probe — consecutive frames under budget, so we don't
 *      reveal into a stutter
 *
 * Every gate is individually capped and the whole sequence has a hard deadline, so
 * a slow network or a wedged asset can never leave the site hidden behind this.
 *
 * Rendered outside the page content so it remains viewport-fixed.
 */

import { useEffect, useRef, useState } from 'react'
import { getActiveLenis } from '../hooks/useGsapSmoothScroll'
import './PageCurtain.css'

type PageCurtainProps = {
  /** Changing this re-arms the curtain. Pass the current pathname. */
  routeKey: string
  /** Short label for the destination, e.g. "Portfolio". */
  label: string
}

/**
 * Never hold the site back longer than this, whatever the network is doing.
 * Generous, because the media gate below genuinely waits for every image on the
 * page — but still finite, so one wedged asset can never hide the whole site.
 */
const HARD_DEADLINE_MS = 20000
/** Cap for the "every image loaded and decoded" gate specifically. */
const MEDIA_TIMEOUT_MS = 15000
/** Below this the curtain reads as a flash rather than a transition. */
const MIN_VISIBLE_MS = 620
/** Frames under this (ms) count as within budget for the smoothness probe. */
const FRAME_BUDGET_MS = 24
/** Consecutive in-budget frames required before revealing. */
const GOOD_FRAMES_REQUIRED = 6

type Stage = 'mount' | 'resources' | 'fonts' | 'media' | 'layout' | 'frames' | 'done'

const STAGE_PROGRESS: Record<Stage, number> = {
  mount: 12,
  resources: 30,
  fonts: 48,
  media: 68,
  layout: 84,
  frames: 95,
  done: 100,
}

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/** Resolves once the document has finished loading its subresources. */
function waitForDocumentLoad(timeoutMs: number) {
  if (document.readyState === 'complete') return Promise.resolve()

  return Promise.race([
    new Promise<void>((resolve) => {
      const done = () => {
        window.removeEventListener('load', done)
        resolve()
      }
      window.addEventListener('load', done)
    }),
    sleep(timeoutMs),
  ])
}

/**
 * Forces GSAP to (re)measure everything while the page is still covered, so pins
 * and reveals are already positioned correctly the moment the curtain lifts.
 * Without this the first scroll is what triggers the measuring pass — which is
 * exactly the stutter we're covering.
 */
async function settleScrollLayout(timeoutMs: number) {
  const refresh = import('gsap/ScrollTrigger')
    .then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh()
      // One more frame so the refresh's own layout writes flush before the
      // frame-budget probe runs.
      return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    })
    .catch(() => undefined)

  await Promise.race([refresh, sleep(timeoutMs)])
}

/** Resolves when `check` passes, when the DOM stops changing long enough, or on timeout. */
function waitForDom(check: () => boolean, timeoutMs: number) {
  return new Promise<void>((resolve) => {
    if (check()) {
      resolve()
      return
    }

    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      observer.disconnect()
      window.clearTimeout(timer)
      resolve()
    }

    const observer = new MutationObserver(() => {
      if (check()) finish()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const timer = window.setTimeout(finish, timeoutMs)
  })
}

/**
 * Loads AND decodes every image on the page before the reveal.
 *
 * Loading alone is not enough. An image that has arrived over the network is still
 * a compressed blob; the browser decodes it to a bitmap the first time it has to
 * paint it — which, for anything below the fold, is while you are scrolling toward
 * it. That decode is a main-thread stall in the middle of a scroll, and it is the
 * single biggest remaining source of the "lag" once a page is visible. Calling
 * decode() here moves all of it behind the curtain.
 *
 * Images marked loading="lazy" would otherwise never start while the curtain
 * covers the page (they wait for proximity to the viewport that can never happen),
 * so they are switched to eager for this pass.
 */
function waitForAllImages(timeoutMs: number, onProgress: (ratio: number) => void) {
  const images = Array.from(document.querySelectorAll('img'))
  if (!images.length) {
    onProgress(1)
    return Promise.resolve()
  }

  let settledCount = 0
  const report = () => {
    settledCount += 1
    onProgress(settledCount / images.length)
  }

  const jobs = images.map(async (img) => {
    // Force lazy images to start now — nothing will bring them into view while
    // the curtain is up.
    if (img.loading === 'lazy') img.loading = 'eager'

    if (!img.complete) {
      await new Promise<void>((resolve) => {
        const done = () => {
          img.removeEventListener('load', done)
          img.removeEventListener('error', done)
          resolve()
        }
        img.addEventListener('load', done)
        img.addEventListener('error', done)
      })
    }

    // Decode to a bitmap now so painting it later is free. Rejects for broken or
    // zero-size images; that is not a reason to hold the site back.
    await img.decode?.().catch(() => undefined)
    report()
  })

  return Promise.race([Promise.all(jobs).then(() => undefined), sleep(timeoutMs)])
}

/**
 * Waits for videos that already have a source attached to buffer enough to play
 * without stalling. Videos whose source has not been attached yet (LazyVideo only
 * attaches near the viewport) are skipped deliberately — forcing all of them would
 * pull tens of megabytes for footage the visitor may never scroll to.
 */
function waitForReadyVideos(timeoutMs: number) {
  const pending = Array.from(document.querySelectorAll('video'))
    .filter((video) => video.currentSrc && video.readyState < 3)
    .map(
      (video) =>
        new Promise<void>((resolve) => {
          const done = () => {
            video.removeEventListener('canplaythrough', done)
            video.removeEventListener('error', done)
            resolve()
          }
          video.addEventListener('canplaythrough', done)
          video.addEventListener('error', done)
        }),
    )

  if (!pending.length) return Promise.resolve()
  return Promise.race([Promise.all(pending).then(() => undefined), sleep(timeoutMs)])
}

/**
 * Watches real frame pacing and resolves once the main thread has produced
 * GOOD_FRAMES_REQUIRED consecutive frames inside budget — i.e. the page has
 * actually stopped thrashing. Resolves on timeout regardless.
 */
function waitForSteadyFrames(timeoutMs: number) {
  return new Promise<void>((resolve) => {
    let good = 0
    let last = performance.now()
    let rafId = 0
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(timer)
      resolve()
    }

    const tick = (now: number) => {
      const delta = now - last
      last = now
      good = delta <= FRAME_BUDGET_MS ? good + 1 : 0
      if (good >= GOOD_FRAMES_REQUIRED) {
        finish()
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    const timer = window.setTimeout(finish, timeoutMs)
  })
}

export function PageCurtain({ routeKey, label }: PageCurtainProps) {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [progress, setProgress] = useState(STAGE_PROGRESS.mount)
  const [logoFailed, setLogoFailed] = useState(false)
  // First load gets the full treatment; later route changes reuse it identically,
  // but we track it so the very first paint can skip the enter transition.
  const firstRunRef = useRef(true)

  useEffect(() => {
    let cancelled = false
    const startedAt = performance.now()

    setVisible(true)
    setLeaving(false)
    setProgress(STAGE_PROGRESS.mount)

    const advance = (stage: Stage) => {
      if (!cancelled) setProgress(STAGE_PROGRESS[stage])
    }

    const run = async () => {
      // 1. The routed content is lazy-loaded, so on a route change the shell is
      //    briefly empty. Wait for something real to exist under the router.
      await waitForDom(
        () => !!document.querySelector('#smooth-content .page-motion-shell, #smooth-content section'),
        1600,
      )
      if (cancelled) return
      advance('resources')

      // 2. Subresources for the document. On a reload this is the real "fully
      //    loaded" signal; on a client-side route change it has usually already
      //    fired, so it costs nothing.
      await waitForDocumentLoad(2600)
      if (cancelled) return
      advance('fonts')

      // 3. Fonts. Revealing before the swap means watching every heading reflow.
      await Promise.race([document.fonts?.ready ?? Promise.resolve(), sleep(2000)])
      if (cancelled) return
      advance('media')

      // 4. Every image on the page: fetched AND decoded. This is the long gate,
      //    and the reason the rail reports real counts rather than stage guesses —
      //    it is genuinely waiting for the page's media here.
      await waitForAllImages(MEDIA_TIMEOUT_MS, (ratio) => {
        if (cancelled) return
        const span = STAGE_PROGRESS.layout - STAGE_PROGRESS.media
        setProgress(STAGE_PROGRESS.media + span * ratio)
      })
      if (cancelled) return

      // 5. Videos that already have a source: buffer enough to play without a
      //    stall on first paint.
      await waitForReadyVideos(2500)
      if (cancelled) return
      advance('layout')

      // 6. Let GSAP measure pins/triggers now, behind the curtain, instead of on
      //    the user's first scroll. Runs after the media gate on purpose: images
      //    only have their real dimensions once loaded, and those dimensions are
      //    what every trigger position is measured from.
      await settleScrollLayout(1200)
      if (cancelled) return
      advance('frames')

      // 7. Prove the page can actually hold frame budget before showing it.
      await waitForSteadyFrames(1400)
      if (cancelled) return
      advance('done')

      const elapsed = performance.now() - startedAt
      if (elapsed < MIN_VISIBLE_MS) await sleep(MIN_VISIBLE_MS - elapsed)
      if (cancelled) return

      setLeaving(true)
      // Matches the wipe duration in PageCurtain.css.
      await sleep(680)
      if (cancelled) return
      setVisible(false)
      firstRunRef.current = false
    }

    // Hard deadline: whatever happens above, the site becomes visible.
    const deadline = window.setTimeout(() => {
      if (cancelled) return
      setProgress(STAGE_PROGRESS.done)
      setLeaving(true)
      window.setTimeout(() => {
        if (!cancelled) setVisible(false)
      }, 680)
    }, HARD_DEADLINE_MS)

    void run()

    return () => {
      cancelled = true
      window.clearTimeout(deadline)
    }
  }, [routeKey])

  // Nothing may scroll while the curtain is up: a scroll behind it lands on a page
  // that is still measuring itself, which is the jank we're hiding.
  useEffect(() => {
    if (!visible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    getActiveLenis()?.stop()

    return () => {
      document.body.style.overflow = previousOverflow
      getActiveLenis()?.start()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`curtain${leaving ? ' curtain--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${label}`}
    >
      <div className="curtain-grain" aria-hidden="true" />
      <div className="curtain-glow" aria-hidden="true" />

      <div className="curtain-center">
        <div className="curtain-mark">
          {/* Either the logo or the wordmark — never both. The previous version
              rendered the fallback behind the image with z-index:-1, which does
              nothing over a transparent parent, so the two overlapped. */}
          {logoFailed ? (
            <span className="curtain-logo-fallback">PARMA IN LITTLE WASHINGTON</span>
          ) : (
            <img
              className="curtain-logo"
              src="/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/new-logo.png"
              alt="Parma in Little Washington"
              width="168"
              height="56"
              decoding="async"
              onError={() => setLogoFailed(true)}
            />
          )}
        </div>

        <div className="curtain-rail" aria-hidden="true">
          <span className="curtain-rail-fill" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <div className="curtain-meta" aria-hidden="true">
        <span className="curtain-label">{label}</span>
        <span className="curtain-count">{String(Math.round(progress)).padStart(3, '0')}</span>
      </div>

      <span className="curtain-edge" aria-hidden="true" />
    </div>
  )
}

export default PageCurtain

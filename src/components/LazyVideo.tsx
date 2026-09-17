/**
 * Done by Daksh Sharma: Created LazyVideo component.
 * Why: This component uses an IntersectionObserver to defer loading of video files
 * until they are close to entering the viewport (with a 200px prefetch margin).
 * It prevents the browser from downloading megabytes of video data immediately on page load,
 * which resolves the Lighthouse 'Avoid enormous network payloads' audit.
 */

import { useEffect, useRef, useState } from 'react'

interface LazyVideoProps {
  src: string
  poster?: string
  className?: string
  style?: React.CSSProperties
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  ariaLabel?: string
  // For track element support if needed
  children?: React.ReactNode
}

export default function LazyVideo({
  src,
  poster,
  className,
  style,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  ariaLabel,
  children
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsNearViewport(entry.isIntersecting)
          if (entry.isIntersecting) setHasLoaded(true)
        })
      },
      {
        rootMargin: '160px',
        threshold: 0.01,
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasLoaded) return

    if (autoPlay && isNearViewport) {
      void video.play().catch(() => {
        // Autoplay can be blocked by user/browser preferences; the muted video
        // remains available without turning that into an application error.
      })
    } else {
      video.pause()
    }
  }, [autoPlay, hasLoaded, isNearViewport])

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={className}
      style={style}
      autoPlay={autoPlay && isNearViewport}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      aria-label={ariaLabel}
      preload={hasLoaded ? 'metadata' : 'none'}
    >
      {hasLoaded ? <source src={src} type="video/mp4" /> : null}
      {children}
    </video>
  )
}

import React from 'react'
import AnimatedSlideshow from '../ui/animated-slideshow'

interface OurWorkSectionProps {
  gradientClip?: React.CSSProperties
  onNavigate?: (path: string) => void
}

export function OurWorkSection({ onNavigate }: OurWorkSectionProps) {
  return <AnimatedSlideshow onNavigate={onNavigate} />
}


import React from 'react'
import CircularFlipCardGallery from '../ui/circular-flip-card-gallery'

interface OurWorkSectionProps {
  gradientClip?: React.CSSProperties
  onNavigate?: (path: string) => void
}

export function OurWorkSection({ onNavigate }: OurWorkSectionProps) {
  return <CircularFlipCardGallery onNavigate={onNavigate} />
}

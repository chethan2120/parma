import CircularFlipCardGallery from './ui/circular-flip-card-gallery'
import './PartnersSection.css'

type Props = {
  variant?: 'home' | 'realestate'
  onNavigate?: (path: string) => void
}

export default function PartnersSection({ variant = 'home', onNavigate }: Props) {
  const mod = variant === 'realestate' ? 'partners-section--re' : ''

  return (
    <section className={`partners-section ${mod}`} aria-labelledby="partners-heading">
      <CircularFlipCardGallery onNavigate={onNavigate} />
    </section>
  )
}



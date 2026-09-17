import { useState } from 'react'
import './interactive-image-accordion.css'

export interface AccordionItem {
  id: string
  label: string
  title: string
  description: string
  image: string
  link: string
  badge?: string
}

interface InteractiveImageAccordionProps {
  items: AccordionItem[]
  initialIndex?: number
  onNavigate?: (path: string) => void
}

export function InteractiveImageAccordion({
  items,
  initialIndex = 0,
  onNavigate,
}: InteractiveImageAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex)

  const handleItemClick = (item: AccordionItem, index: number) => {
    if (activeIndex === index) {
      if (onNavigate) {
        onNavigate(item.link)
      }
    } else {
      setActiveIndex(index)
    }
  }

  return (
    <div className="parma-accordion-container" aria-label="Parma Experiences Gallery">
      <div className="parma-accordion-track">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx
          return (
            <article
              key={item.id}
              className={`parma-accordion-panel ${isActive ? 'is-active' : 'is-collapsed'}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => handleItemClick(item, idx)}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick(item, idx)
                }
              }}
            >
              {/* Background Image with smooth zoom transition */}
              <div className="parma-accordion-img-frame">
                <img
                  src={item.image}
                  alt={item.title}
                  className="parma-accordion-img"
                  loading="eager"
                  decoding="async"
                />
                <div className="parma-accordion-overlay" />
              </div>

              {/* Collapsed Vertical Label */}
              <div className="parma-accordion-collapsed-label">
                <span className="parma-vertical-tag">{item.label}</span>
                <span className="parma-vertical-num">0{idx + 1}</span>
              </div>

              {/* Expanded Horizontal Content Banner */}
              <div className="parma-accordion-expanded-content">
                {item.badge && <span className="parma-panel-badge">{item.badge}</span>}
                <h3 className="parma-panel-title">{item.title}</h3>
                <p className="parma-panel-desc">{item.description}</p>
                <button
                  type="button"
                  className="parma-panel-cta"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onNavigate) onNavigate(item.link)
                  }}
                >
                  Explore {item.label}
                  <span className="parma-cta-arrow">↗</span>
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

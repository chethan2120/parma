// Done by Daksh Sharma: Removed unused React import to resolve TypeScript compiler warning.
import { faqs } from '../../data/constants'
import { IMG_FAQ_PLUS } from '../../data/assets'
import './FaqSection.css'

interface FaqSectionProps {
  openFaq: number | null
  setOpenFaq: (val: number | null) => void
}

export function FaqSection({ openFaq, setOpenFaq }: FaqSectionProps) {
  return (
    <section className="faq-section">
      <div className="faq-inner">
        <div className="faq-heading-block">
          <h2 className="faq-heading">FAQ</h2>
          <p className="section-subtitle faq-subtitle">Everything you need to know about working with us.</p>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className={`faq-item${openFaq === i ? ' faq-item--open' : ''}`}>
              <button
                className="faq-trigger"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="faq-q">{item.q}</span>
                <img
                  src={IMG_FAQ_PLUS}
                  alt=""
                  className={`faq-icon${openFaq === i ? ' faq-icon--open' : ''}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              {openFaq === i && <div className="faq-answer" id={`faq-answer-${i}`}>{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

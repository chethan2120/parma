/* Done by Daksh Sharma - Extracted MenuOverlay to reduce App.tsx lines and improve maintainability */

import { NavLink } from 'react-router-dom'
import { NAV_ROWS, NAV_TARGETS, PAGE_PATH, type NavLabel, type Page } from '../../data/constants'
import './MenuOverlay.css'

interface MenuOverlayProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  activeNavLabel: NavLabel
  handleMenuLinkClick: (target: Page) => void
}

export function MenuOverlay({ menuOpen, setMenuOpen, activeNavLabel, handleMenuLinkClick }: MenuOverlayProps) {
  return (
    <div
      className={`menu-overlay${menuOpen ? ' menu-overlay--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
    >
      <div className="menu-left">
        <nav className="menu-nav">
          {NAV_ROWS.map(([left, right], i) => (
            <div className={`menu-row${i === NAV_ROWS.length - 1 ? ' menu-row--last' : ''}`} key={i}>
              <NavLink
                to={PAGE_PATH[NAV_TARGETS[left]]}
                end={left === 'Home'}
                className={() =>
                  `menu-link menu-link--left${activeNavLabel === left ? ' menu-link--active' : ''}`
                }
                onClick={() => handleMenuLinkClick(NAV_TARGETS[left])}
                aria-current={activeNavLabel === left ? 'page' : undefined}
              >
                {left}
              </NavLink>
              <NavLink
                to={PAGE_PATH[NAV_TARGETS[right]]}
                className={() =>
                  `menu-link${activeNavLabel === right ? ' menu-link--active' : ''}`
                }
                onClick={() => handleMenuLinkClick(NAV_TARGETS[right])}
                aria-current={activeNavLabel === right ? 'page' : undefined}
              >
                {right}
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="menu-socials">
          <NavLink
            to="/contact"
            className="menu-reserve-cta"
            onClick={() => handleMenuLinkClick('contact')}
          >
            Reserve Sanctuary Stay ↗
          </NavLink>
          <div className="menu-contact-info">
            <a href="tel:5409878588" className="menu-social">Tel: 540 987 8588</a>
            <span className="menu-social-sep">•</span>
            <a href="mailto:info@parmainlittlewashington.com" className="menu-social">Email: info@parmainlittlewashington.com</a>
          </div>
        </div>
      </div>

      <div className="menu-right">
        <div className="menu-deco menu-deco--rect-white" />
        <div className="menu-deco menu-deco--rect-teal" />
        <div className="menu-deco menu-deco--rect-wide" />
        <div className="menu-deco menu-deco--circle" />
        <div className="menu-deco menu-deco--pill-blur" />
        <div className="menu-deco menu-deco--bar-teal" />
        <div className="menu-crest-showcase">
          <img
            src="/parma-official-crest.png"
            alt="Official Parma Crest Logo"
            className="menu-official-crest"
            decoding="async"
          />
        </div>
        <div className="menu-email">
          <span className="menu-email-say">Reserve a stay at</span>
          <a href="mailto:info@parmainlittlewashington.com" className="menu-email-addr">info@parmainlittlewashington.com</a>
        </div>
      </div>

      <div className="menu-header-strip">
        <div className="menu-logo-mix" aria-label="Parma in Little Washington" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            className="menu-logo-img"
            src="/parma-official-crest.png"
            alt="Parma Crest"
            style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            decoding="async"
            loading="lazy"
          />
          <span style={{ 
            fontFamily: "'Cormorant Garamond', Georgia, serif", 
            fontSize: '1.15rem', 
            fontWeight: 600, 
            color: '#F4EBDD',
            letterSpacing: '0.04em'
          }}>
            Parma
          </span>
        </div>
        <button
          className="menu-close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
        >
          Close
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

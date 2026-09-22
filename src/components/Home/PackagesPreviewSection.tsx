// Done by Daksh Sharma: Extracted PackagesPreviewSection to improve HomePage maintainability and compile performance.
import type { CSSProperties } from 'react'
import CurrencyDropdown from '../CurrencyDropdown'
import { formatCurrency, type CurrencyCode } from '../../hooks/useCurrency'
import {
  PACKAGES_DATA,
  PACKAGE_CATEGORY_ORDER,
  getDefaultPackageKey,
  type PkgCategory,
} from '../../data/packages'
import './PackagesPreviewSection.css'

interface PackagesPreviewSectionProps {
  pkgCategory: PkgCategory
  setPkgCategory: (cat: PkgCategory) => void
  activePackageKey: string
  setActivePackageKey: (key: string) => void
  detectedCurrencyCode: CurrencyCode
  currencyCode: CurrencyCode
  activatePackage: (category: PkgCategory, packageName: string) => void
  handlePackageCta: (category: PkgCategory, tier: any) => void
  gradientClip: CSSProperties
}

export function PackagesPreviewSection({
  pkgCategory,
  setPkgCategory,
  activePackageKey,
  setActivePackageKey,
  detectedCurrencyCode,
  currencyCode,
  activatePackage,
  handlePackageCta,
  gradientClip,
}: PackagesPreviewSectionProps) {
  return (
    <section className="packages" id="our-packages" aria-label="Our packages">
      <div className="packages-inner">
        <div className="packages-heading-block">
          <div className="packages-heading-row">
            <h2 className="section-heading-xl packages-heading" style={gradientClip}>
              our packages
            </h2>
            <CurrencyDropdown
              label="Currency"
              autoCurrency={detectedCurrencyCode}
              className="packages-currency-dd"
            />
          </div>
          <div className="pkg-filter-row">
            {PACKAGE_CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                className={`pkg-filter-btn${
                  pkgCategory === cat ? ' pkg-filter-btn--active' : ''
                }`}
                onClick={() => {
                  setPkgCategory(cat)
                  setActivePackageKey(getDefaultPackageKey(cat))
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="section-subtitle">
            Simple, transparent pricing — built around the scope of your ambitions.
          </p>
        </div>
        <div className="pkg-grid">
          {PACKAGES_DATA[pkgCategory].map((tier) => {
            const packageKey = `${pkgCategory}:${tier.name}`
            const isActive = activePackageKey === packageKey
            return (
              <div
                key={tier.name}
                className={`pkg-card${
                  tier.recommended && !isActive ? ' pkg-card--featured' : ''
                }${isActive ? ' pkg-card--dark' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => activatePackage(pkgCategory, tier.name)}
                onKeyDown={(e) => e.key === 'Enter' && activatePackage(pkgCategory, tier.name)}
              >
                {tier.recommended && !isActive ? (
                  <span className="pkg-badge">Recommended</span>
                ) : null}
                <div className={`pkg-tier-label${isActive ? ' pkg-tier-label--muted' : ''}`}>
                  {tier.tier}
                </div>
                <div className={`pkg-name${isActive ? ' pkg-name--white' : ''}`}>{tier.name}</div>
                <div className="pkg-price">
                  {tier.price != null ? (
                    isActive ? (
                      <span className="pkg-price-num" style={gradientClip}>
                        {formatCurrency(tier.price, currencyCode)}
                      </span>
                    ) : (
                      <span className="pkg-price-num">
                        {formatCurrency(tier.price, currencyCode)}
                      </span>
                    )
                  ) : isActive ? (
                    <span className="pkg-price-num" style={gradientClip}>
                      {tier.priceLabel}
                    </span>
                  ) : (
                    <span className="pkg-price-num">{tier.priceLabel}</span>
                  )}
                  <span className={`pkg-price-unit${isActive ? ' pkg-price-unit--muted' : ''}`}>
                    {tier.unit}
                  </span>
                </div>
                <button
                  className={`pkg-btn${isActive ? ' pkg-btn--white' : ' pkg-btn--outline'}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePackageCta(pkgCategory, tier)
                  }}
                >
                  {tier.btn}
                </button>
                <ul className={`pkg-features${isActive ? ' pkg-features--dark' : ''}`}>
                  {tier.features.map((feat, fi) => (
                    <li key={fi}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="pkg-check-svg" style={{ flexShrink: 0, marginTop: 2 }}>
                        <circle cx="12" cy="12" r="10" stroke={isActive ? "#C49A52" : "#CA6641"} strokeWidth="1.8" fill={isActive ? "rgba(196, 154, 82, 0.2)" : "rgba(202, 106, 65, 0.12)"} />
                        <path d="M8.5 12.5L10.8 14.8L15.5 9.5" stroke={isActive ? "#C49A52" : "#CA6641"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

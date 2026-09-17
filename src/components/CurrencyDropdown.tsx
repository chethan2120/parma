import { useMemo } from 'react'
import type { CurrencyCode } from '../hooks/useCurrency'
import { useCurrencyOverride } from '../hooks/useCurrency'

type Props = {
  label?: string
  className?: string
  /** @deprecated No longer used — auto-detection removed; INR is the default. */
  autoCurrency?: CurrencyCode
}

const CURRENCY_OPTIONS: CurrencyCode[] = [
  'INR',
  'USD',
  'EUR',
  'GBP',
  'AED',
  'SAR',
  'CAD',
  'AUD',
  'SGD',
  'JPY',
]

export default function CurrencyDropdown({ label = 'Currency', className = '' }: Props) {
  const { overrideCurrency, setOverrideCurrency } = useCurrencyOverride()

  // Default to INR when no explicit override is selected
  const value: CurrencyCode = overrideCurrency ?? 'INR'

  const options = useMemo(() => Array.from(new Set(CURRENCY_OPTIONS)), [])

  return (
    <label className={`currency-dd ${className}`.trim()}>
      <span className="currency-dd__label">{label}</span>
      <select
        className="currency-dd__select"
        value={value}
        onChange={(e) => {
          const next = e.target.value as CurrencyCode
          // Selecting INR clears any override so it matches the natural default
          setOverrideCurrency(next === 'INR' ? null : next)
        }}
        aria-label={label}
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  )
}


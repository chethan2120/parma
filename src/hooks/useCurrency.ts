import { useEffect, useState } from 'react'
import { convertFromINR as convertFromINRReal, formatFromINR } from '../utils/currency'

export type CurrencyCode = 
  | 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'AUD' | 'CAD' | 'CHF' | 'SEK' 
  | 'NZD' | 'SGD' | 'HKD' | 'MYR' | 'THB' | 'IDR' | 'PHP' | 'PKR' | 'BDT' | 'LKR'
  | 'AED' | 'SAR' | 'KWD' | 'BHD' | 'OMR' | 'QAR' | 'ZAR' | 'EGP' | 'NGN' | 'KES'
  | 'RUB' | 'KRW' | 'TWD' | 'VND' | 'MXN' | 'BRL' | 'ARS' | 'CLP' | 'COP' | 'PEN'
  | 'ILS' | 'TRY' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'HRK' | 'NOK' | 'DKK'

const CURRENCY_OVERRIDE_KEY = 'webnxt_currency_override'
const OVERRIDE_EVENT = 'webnxt_currency_override_change'

// Single source of truth for package base pricing (INR).
export const BASE_PRICES = {
  basic: 11999,
  dynamic: 24999,
  enterprise: 49999,
} as const

export function convertFromINR(baseInr: number, currency: CurrencyCode) {
  return convertFromINRReal(baseInr, currency)
}

// Country code to currency code mapping
export const COUNTRY_CURRENCY_MAP: Record<string, CurrencyCode> = {
  'IN': 'INR',
  'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
  'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'GR': 'EUR', 'PT': 'EUR', 'IE': 'EUR', 'FI': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'LV': 'EUR', 'LT': 'EUR', 'EE': 'EUR',
  'JP': 'JPY', 'CN': 'CNY', 'AU': 'AUD', 'NZ': 'NZD', 'CH': 'CHF', 'SE': 'SEK',
  'SG': 'SGD', 'HK': 'HKD', 'MY': 'MYR', 'TH': 'THB', 'ID': 'IDR', 'PH': 'PHP', 'PK': 'PKR', 'BD': 'BDT', 'LK': 'LKR',
  'AE': 'AED', 'SA': 'SAR', 'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR', 'QA': 'QAR',
  'ZA': 'ZAR', 'EG': 'EGP', 'NG': 'NGN', 'KE': 'KES',
  'RU': 'RUB', 'KR': 'KRW', 'TW': 'TWD', 'VN': 'VND',
  'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN',
  'IL': 'ILS', 'TR': 'TRY', 'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN', 'HR': 'HRK', 'NO': 'NOK', 'DK': 'DKK',
}

// Default currency is always INR — no geolocation permission is requested.
// Users can change the displayed currency via the CurrencyDropdown.

export function useCurrencyCode(): CurrencyCode {
  // INR is the global default. No async detection, no location permission prompt.
  const [currencyCode] = useState<CurrencyCode>('INR')
  return currencyCode
}

/**
 * Default behavior: converts from INR to the given currency.
 * (This is used for auto-location / country selection.)
 */
export function formatCurrency(amountInInr: number, currencyCode: CurrencyCode) {
  return formatFromINR(amountInInr, currencyCode)
}

/**
 * Dropdown behavior: keep the numeric price the same, only change the currency label/symbol.
 * We first compute the "base" displayed number (using location/country currency), then
 * render that same number in the chosen display currency.
 */
export function formatCurrencyWithDisplay(amountInInr: number, baseCurrency: CurrencyCode, displayCurrency?: CurrencyCode) {
  // Kept for backwards compatibility; pricing now uses INR as base always.
  return formatCurrency(amountInInr, displayCurrency ?? baseCurrency)
}

export function useCurrencyOverride() {
  const [override, setOverride] = useState<CurrencyCode | null>(() => {
    if (typeof window === 'undefined') return null
    // One-time migration: clear any old localStorage entry so existing users
    // who had a currency saved previously are not stuck with it.
    window.localStorage.removeItem(CURRENCY_OVERRIDE_KEY)
    // sessionStorage: selection resets when the browser tab is closed / a new tab opens.
    // This ensures every fresh visit defaults to INR as required.
    const raw = window.sessionStorage.getItem(CURRENCY_OVERRIDE_KEY)
    if (!raw || raw === 'AUTO') return null
    return raw as CurrencyCode
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Note: the 'storage' event only fires for localStorage, not sessionStorage.
    // Cross-tab sync is intentionally not needed (each tab defaults to INR).
    // We only listen for same-tab custom events so multi-instance hooks stay in sync.
    const onOverride = (e: Event) => {
      const ev = e as CustomEvent<CurrencyCode | null>
      setOverride(ev.detail ?? null)
    }
    window.addEventListener(OVERRIDE_EVENT, onOverride as EventListener)
    return () => {
      window.removeEventListener(OVERRIDE_EVENT, onOverride as EventListener)
    }
  }, [])

  const set = (next: CurrencyCode | null) => {
    setOverride(next)
    if (typeof window === 'undefined') return
    // Persist in sessionStorage so the selection survives in-page navigation (SPA)
    // but resets on every new tab/browser open → site always loads with INR by default.
    if (!next) window.sessionStorage.removeItem(CURRENCY_OVERRIDE_KEY)
    else window.sessionStorage.setItem(CURRENCY_OVERRIDE_KEY, next)
    // Notify other hook instances in the same tab immediately.
    window.dispatchEvent(new CustomEvent(OVERRIDE_EVENT, { detail: next }))
  }

  return { overrideCurrency: override, setOverrideCurrency: set }
}

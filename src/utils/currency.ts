import type { CurrencyCode } from '../hooks/useCurrency'

// Realistic INR -> currency conversion multipliers (currency units per 1 INR).
export const conversionRates: Partial<Record<CurrencyCode, number>> = {
  INR: 1,

  // Base: 1 USD ≈ ₹94
  USD: 1 / 94,

  // Derived properly
  EUR: 1 / 102,
  GBP: 1 / 118,

  // Middle East
  AED: 1 / 25.6,
  SAR: 1 / 25,

  // Others
  CAD: 1 / 69,
  AUD: 1 / 62,
  SGD: 1 / 70,

  // Japan
  JPY: 1.6,
}

export const convertFromINR = (amount: number, currency: CurrencyCode) => {
  const rate = conversionRates[currency] || 1
  const converted = amount * rate
  return Math.round(converted)
}

export const formatFromINR = (amountInInr: number, currency: CurrencyCode) => {
  const price = convertFromINR(amountInInr, currency)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}


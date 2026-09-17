/* Done: Clean package data with Parma in Little Washington stay and treatment menus */

export type PricingTier = {
  tier: string
  name: string
  price?: number
  priceLabel?: string
  unit?: string
  btn: string
  recommended: boolean
  features: string[]
}

export type PricingCategory =
  | 'Parma Inn Accommodations'
  | 'Ayurvedic Spa Therapies'
  | 'Parma Healthcare'
  | 'Sushila Shanti Meditation'

export const PACKAGES_DATA: Record<PricingCategory, PricingTier[]> = {
  'Parma Inn Accommodations': [
    {
      tier: 'Suite 01 / Classic',
      name: 'The Tapestry Room',
      priceLabel: 'Inquire for Seasonal Rates',
      unit: 'per night',
      btn: 'Reserve Suite',
      recommended: false,
      features: [
        'Woven textiles & warm lamplight',
        'Nancy Corzine & Baker antiques',
        'Private peaceful corner of the house',
        'Complimentary herbal teas & mountain light',
        'Access to Blue Ridge estate grounds',
        'Concierge room service',
      ],
    },
    {
      tier: 'Suite 02 / Recommended',
      name: 'The Panther Suite',
      priceLabel: 'Inquire for Seasonal Rates',
      unit: 'per night',
      btn: 'Reserve Panther Suite',
      recommended: true,
      features: [
        'Brocade settee & velvet accents',
        'Shimmering silk & sterling silver detailing',
        'Spacious sitting area with mountain view',
        'Integrated Ayurvedic morning tea service',
        'Priority booking for Parma Spa',
        'Personalized arrival amenities',
      ],
    },
    {
      tier: 'Suite 03 / Master',
      name: 'The Red Room & Lounge',
      priceLabel: 'Inquire for Seasonal Rates',
      unit: 'per night',
      btn: 'Reserve Master Stay',
      recommended: false,
      features: [
        'Rich red brocade and antique warmth',
        'Grand piano & stone wall lounge access',
        'Full access to all 4 estate worlds',
        'Dedicated concierge physician liaison',
        'Private meditation & yoga session included',
        'Private estate key & supreme privacy',
      ],
    },
  ],
  'Ayurvedic Spa Therapies': [
    {
      tier: 'Therapy 01 / Essential',
      name: 'Abhyanga Herbal Massage',
      priceLabel: '1 hr 20 min',
      unit: 'per session',
      btn: 'Book Therapy',
      recommended: false,
      features: [
        'Light herbal-oil massage',
        'Elicits deep nervous-system rest',
        'Balances Vata, Pitta, and Kapha doshas',
        'Organic warm herbal oils',
        'Relaxation room access',
        'Herbal infusion tea',
      ],
    },
    {
      tier: 'Therapy 02 / Recommended',
      name: 'Kathi Basti & Oshadhi Wrap',
      priceLabel: '1 hr 50 min',
      unit: 'per session',
      btn: 'Book Experience',
      recommended: true,
      features: [
        'Warm Ayurvedic oils poured along spine',
        'Gentle back massage & herbal compresses',
        'Pitta-calming cooling herbal wrap',
        'Clears heat & bodily blockages',
        'Includes Ayurvedic doctor consultation',
        'Steam rinse finish',
      ],
    },
    {
      tier: 'Therapy 03 / Synchronized',
      name: 'Mardanam Dual-Therapist',
      priceLabel: '1 hr 20 min',
      unit: 'per session',
      btn: 'Book Dual Therapy',
      recommended: false,
      features: [
        'Synchronized deep-tissue massage by 2 therapists',
        'Detoxifying herbal powders & warm oil',
        'Deep tension release',
        'Lifts heaviness & water retention',
        'Full body exfoliation finish',
        'Private therapy suite',
      ],
    },
  ],
  'Parma Healthcare': [
    {
      tier: 'Consult 01 / Initial',
      name: 'Physician Wellness Evaluation',
      priceLabel: '60 min',
      unit: 'per consultation',
      btn: 'Request Consult',
      recommended: false,
      features: [
        'Comprehensive health history review',
        'Integrative medicine assessment by Dr. Thara',
        'Lifestyle & dietary guidance',
        'Customized treatment roadmap',
        'Local or remote follow-up',
        'Confidential patient portal',
      ],
    },
    {
      tier: 'Consult 02 / Recommended',
      name: 'Concierge Second Opinion',
      priceLabel: 'Teleconsult',
      unit: 'per case review',
      btn: 'Liaison Consult',
      recommended: true,
      features: [
        'Liaison with top national specialists',
        'Mayo Clinic & Cleveland Clinic expert coordination',
        'Detailed medical file review',
        'Clear treatment chart guidance',
        'Physician-to-physician coordination',
        'Sanctuary setting support',
      ],
    },
    {
      tier: 'Consult 03 / Complete',
      name: 'Integrative Health Membership',
      priceLabel: 'Seasonal',
      unit: 'annual care',
      btn: 'Inquire Membership',
      recommended: false,
      features: [
        'Ongoing concierge physician access',
        'Regular Ayurvedic & medical reviews',
        'Priority spa & sanctuary bookings',
        'Direct line to Dr. Sadhna Nicky Singh & team',
        'Personalized preventative care plan',
        'Family wellness coordination',
      ],
    },
  ],
  'Sushila Shanti Meditation': [
    {
      tier: 'Session 01 / Foundational',
      name: 'Asana & Pranayama Class',
      priceLabel: '60–90 min',
      unit: 'per session',
      btn: 'Join Class',
      recommended: false,
      features: [
        'Bihar School of Yoga lineage',
        'Foundational to advanced asana',
        'Pawanmuktasana & body awareness',
        'Pranayama breath regulation',
        'Group or small cohort setting',
        'All experience levels welcome',
      ],
    },
    {
      tier: 'Session 02 / Recommended',
      name: 'Yoga Nidra & Inner Rest',
      priceLabel: '90 min',
      unit: 'per session',
      btn: 'Book Session',
      recommended: true,
      features: [
        'Psychic sleep & deep relaxation',
        'Ajapa Japa & Antar Mouna techniques',
        'Clears mental friction and fatigue',
        'Hirdayakasha Dharana practice',
        'Conducted in quiet mountain light',
        'Personalized post-class guidance',
      ],
    },
    {
      tier: 'Session 03 / Intensive',
      name: 'Private Sanctuary Immersion',
      priceLabel: 'Half-Day / Multi-Day',
      unit: 'private retreat',
      btn: 'Reserve Immersion',
      recommended: false,
      features: [
        '1-on-1 private teacher guidance',
        'Tailored asana, mudra & bandha practice',
        'Private meditation in nature',
        'Integrated herbal tea ceremony',
        'Combined with Parma Spa hydrotherapy',
        'Quiet contemplation in Blue Ridge',
      ],
    },
  ],
}

export type PkgCategory = PricingCategory

export const PACKAGE_CATEGORY_ORDER: PricingCategory[] = [
  'Parma Inn Accommodations',
  'Ayurvedic Spa Therapies',
  'Parma Healthcare',
  'Sushila Shanti Meditation',
]

export function getDefaultPackageKey(category: PricingCategory): string {
  const tiers = PACKAGES_DATA[category]
  if (!tiers || !tiers.length) return ''
  const rec = tiers.find((t) => t.recommended) ?? tiers[0]
  return `${category}:${rec.name}`
}

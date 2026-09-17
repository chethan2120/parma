import {
  COMPANY_LEGAL_NAME,
  SERVICE_SCHEMA_ITEMS,
  SERVED_CITIES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  faqs,
} from '../data/constants'
import { HOME_SERVICE_CARDS, type ServiceItem } from '../data/services'
import type { PkgCategory, PricingTier } from '../data/packages'

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`
const LOGO_ID = `${SITE_URL}/#logo`
const US_AREA = { '@type': 'Country', name: 'United States' }
const WORLDWIDE_AREA = { '@type': 'Place', name: 'Worldwide' }

const OFFICE_ADDRESSES = [
  {
    '@type': 'PostalAddress',
    streetAddress: '105 Christmas Tree Lane',
    addressLocality: 'Washington',
    addressRegion: 'Virginia',
    postalCode: '22747',
    addressCountry: 'US',
  },
] as const

export function createBaseStructuredData(args: {
  canonicalUrl: string
  imageUrl: string
  title: string
  description: string
  keywords: readonly string[]
}) {
  const { canonicalUrl, imageUrl, title, description, keywords } = args

  return [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: 'Parma',
      legalName: COMPANY_LEGAL_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        '@id': LOGO_ID,
        url: `${SITE_URL}/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/new-logo.png`,
        contentUrl: `${SITE_URL}/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/new-logo.png`,
        caption: 'Parma in Little Washington',
      },
      image: {
        '@id': LOGO_ID,
      },
      description: SITE_DESCRIPTION,
      email: SUPPORT_EMAIL,
      telephone: SUPPORT_PHONE,
      address: OFFICE_ADDRESSES,
      areaServed: [
        ...SERVED_CITIES.map((city) => ({
          '@type': 'City',
          name: city,
        })),
        US_AREA,
        WORLDWIDE_AREA,
      ],
      knowsAbout: SERVICE_SCHEMA_ITEMS,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: SUPPORT_PHONE,
          email: SUPPORT_EMAIL,
          contactType: 'reservations and customer support',
          areaServed: 'Worldwide',
          availableLanguage: ['English'],
        },
      ],
      sameAs: SOCIAL_PROFILES,
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#sanctuary-office`,
      name: 'Parma in Little Washington Sanctuary',
      legalName: COMPANY_LEGAL_NAME,
      parentOrganization: {
        '@id': ORGANIZATION_ID,
      },
      url: `${SITE_URL}/contact`,
      logo: {
        '@id': LOGO_ID,
      },
      image: {
        '@id': LOGO_ID,
      },
      email: SUPPORT_EMAIL,
      telephone: SUPPORT_PHONE,
      description: 'Private wellness sanctuary in Little Washington, Virginia offering Parma Inn lodging, Ayurvedic spa, concierge healthcare, and meditation.',
      address: OFFICE_ADDRESSES[0],
      areaServed: [
        { '@type': 'City', name: 'Little Washington' },
        US_AREA,
        WORLDWIDE_AREA,
      ],
      sameAs: SOCIAL_PROFILES,
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      alternateName: 'Parma',
      url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
      publisher: {
        '@id': ORGANIZATION_ID,
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: title,
      description,
      url: canonicalUrl,
      keywords: keywords.join(', '),
      isPartOf: {
        '@id': WEBSITE_ID,
      },
      about: {
        '@id': ORGANIZATION_ID,
      },
      publisher: {
        '@id': ORGANIZATION_ID,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
      inLanguage: 'en-US',
    },
  ]
}

export function createServicesStructuredData() {
  return [
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/services#service-list`,
      name: 'Parma in Little Washington Offerings',
      numberOfItems: HOME_SERVICE_CARDS.length,
      itemListElement: HOME_SERVICE_CARDS.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          '@id': `${SITE_URL}/services/${service.slug}#service`,
          name: service.title,
          serviceType: service.title,
          description: service.summary,
          provider: {
            '@id': ORGANIZATION_ID,
          },
          areaServed: [US_AREA, WORLDWIDE_AREA],
          url: `${SITE_URL}/services/${service.slug}`,
        },
      })),
    },
  ]
}

export function createServiceStructuredData(canonicalUrl: string, service: ServiceItem) {
  return [
    {
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: service.title,
      serviceType: service.title,
      description: service.seoDescription,
      url: canonicalUrl,
      provider: {
        '@id': ORGANIZATION_ID,
      },
      areaServed: [US_AREA, WORLDWIDE_AREA],
      audience: {
        '@type': 'Audience',
        audienceType: 'Guests seeking restorative health, private sanctuary lodging, and Ayurvedic wellness',
      },
      category: 'Wellness & Sanctuary Services',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.title} highlights`,
        itemListElement: service.deliverables.map((deliverable) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: deliverable.title,
            description: deliverable.text,
          },
        })),
      },
    },
  ]
}

export function createPackagesStructuredData(
  canonicalUrl: string,
  packagesData: Record<PkgCategory, PricingTier[]>,
  categoryOrder: PkgCategory[],
) {
  const offers = categoryOrder.flatMap((category) =>
    packagesData[category].map((tier) => ({
      '@type': 'Offer',
      name: `${category} - ${tier.name}`,
      availability: 'https://schema.org/InStock',
      category,
      url: canonicalUrl,
      description: tier.features.slice(0, 3).join(', '),
      offeredBy: {
        '@id': ORGANIZATION_ID,
      },
    })),
  )

  return [
    {
      '@type': 'OfferCatalog',
      '@id': `${canonicalUrl}#offer-catalog`,
      name: 'Parma Sanctuary Offerings and Menus',
      url: canonicalUrl,
      provider: {
        '@id': ORGANIZATION_ID,
      },
      itemListElement: offers,
    },
  ]
}

export function createBlogStructuredData(args: {
  canonicalUrl: string
  imageUrl: string
  title: string
  description: string
  dateISO: string
  authorName: string
  category: string
  keywords: readonly string[]
}) {
  const {
    canonicalUrl,
    imageUrl,
    title,
    description,
    dateISO,
    authorName,
    category,
    keywords,
  } = args

  return [
    {
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      headline: title,
      description,
      image: [imageUrl],
      url: canonicalUrl,
      datePublished: dateISO,
      dateModified: dateISO,
      articleSection: category,
      keywords: keywords.join(', '),
      author: {
        '@type': authorName.toLowerCase().includes('team') ? 'Organization' : 'Person',
        name: authorName,
      },
      publisher: {
        '@id': ORGANIZATION_ID,
      },
      mainEntityOfPage: {
        '@id': `${canonicalUrl}#webpage`,
      },
      inLanguage: 'en-US',
    },
  ]
}

export function createFAQStructuredData() {
  return [
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  ]
}

export function createBreadcrumbStructuredData(
  items: ReadonlyArray<{ name: string; url: string }>,
) {
  return [
    {
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  ]
}

/* Done: Extracted and updated constants with Parma in Little Washington reference information */

export const faqs = [
  {
    q: "What is Parma in Little Washington?",
    a: "Parma in Little Washington is a private wellness sanctuary located in the Blue Ridge foothills of Washington, Virginia. It brings together nature, Parma Inn, Ayurvedic spa treatments, concierge healthcare, and spiritual wellness at the Sushila Shanti Meditation Centre.",
  },
  {
    q: "Where is Parma located?",
    a: "Parma in Little Washington is located at 105 Christmas Tree Lane, Washington, VA 22747, in Rappahannock County, Virginia—an hour from Washington, D.C.",
  },
  {
    q: "What worlds make up the Parma experience?",
    a: "Parma comprises four distinct experiences: Parma Inn (luxury suite accommodations), Parma Spa (Ayurveda, heat, traditional, aqua, and beauty therapies), Parma Healthcare (integrative concierge medicine), and the Sushila Shanti Meditation Centre.",
  },
  {
    q: "What suites are available at Parma Inn?",
    a: "Parma Inn offers beautifully appointed accommodations including The Tapestry Room, The Red Room, The Panther Suite, and The Lounge, furnished with old-world antiques, Nancy Corzine and Baker pieces, rich fabrics, and sterling silver.",
  },
  {
    q: "What therapies are available at Parma Spa?",
    a: "Parma Spa offers six core wellness categories: Ayurvedic Therapies (Abhyanga, Kathi Basti, Oshadhi Wrap, Vishesh Scrub, Mardanam), Heat Therapies (Hammam, Kuti Swedhana), Traditional Therapies (Royal Thai, Lanna Tok Sen, Lymphatic Drainage), Aqua Experiences (Vichy Shower, Hydrotherapy, Aquatic Yoga), Yoga & Meditation, and Beauty & Aesthetics (Jewel Facials, Medical Peels, Injectables).",
  },
  {
    q: "What services does Parma Healthcare provide?",
    a: "Led by Dr. Thara Kodandaramachandra, Parma Healthcare provides holistic integrative medicine, concierge physician consultations, and second opinion teleconsultations with top specialists from Mayo Clinic, Cleveland Clinic, and leading centers.",
  },
  {
    q: "What is the Sushila Shanti Meditation Centre?",
    a: "The Sushila Shanti Meditation Centre offers yoga, asana, pranayama, and meditation in the lineage of the Bihar School of Yoga, helping guests connect with their inner life force in a tranquil mountain setting.",
  },
  {
    q: "Who founded Parma in Little Washington?",
    a: "Parma was founded by Dr. Sadhna Nicky Singh, Medical Director, with 25 years in women's health and laser medicine, with a vision to blend modern medical science with ancient Ayurvedic and holistic healing therapies.",
  },
  {
    q: "Is Parma affiliated with The Inn at Little Washington?",
    a: "No. Parma Group is independent and not affiliated with The Inn at Little Washington.",
  },
  {
    q: "How can I reserve a stay or book a wellness consultation?",
    a: "You can reserve your stay or consultation by calling 540 987 8588, emailing info@parmainlittlewashington.com, or submitting an inquiry form on our website.",
  },
]

export type Page = 'home' | 'stay' | 'spa' | 'healthcare' | 'meditation' | 'explore' | 'about' | 'careers' | 'contact' | 'blogs' | 'services' | 'portfolio' | 'kota-london' | 'events' | 'event-summit' | 'packages' | 'blog-inside' | 'real-estate'

export type SeoEntry = {
  title: string
  description: string
  keywords: string[]
  path: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}

export const SITE_NAME = 'Parma in Little Washington'
export const SITE_URL = 'https://parmainlittlewashington.com'
export const COMPANY_LEGAL_NAME = 'Parma Group'
export const SUPPORT_EMAIL = 'info@parmainlittlewashington.com'
export const SUPPORT_PHONE = '540 987 8588'
export const COMPANY_ADDRESS = '105 Christmas Tree Lane, Washington, VA 22747'
export const LEGAL_DISCLAIMER = 'Parma Group is independent and not affiliated with The Inn at Little Washington.'
export const COMPANY_CIN = ''
export const COMPANY_GST = ''
export const SITE_DESCRIPTION =
  'A private sanctuary in the Blue Ridge foothills of Washington, Virginia. Parma Inn, Ayurvedic spa, concierge healthcare, and the Sushila Shanti Meditation Centre.'
export const SERVICE_SCHEMA_ITEMS = [
  'Parma Inn Accommodations',
  'Ayurvedic Spa Therapies',
  'Concierge Healthcare',
  'Sushila Shanti Meditation',
  'Heat & Hammam Therapies',
  'Traditional Thai Massage',
  'Aqua Experiences & Hydrotherapy',
  'Beauty & Medical Aesthetics',
  'Second Opinion Teleconsultations',
] as const
export const SERVED_CITIES = ['Little Washington, VA', 'Rappahannock County', 'Tysons Corner, VA', 'Washington D.C.'] as const

export const SEO_BY_PAGE: Record<Page, SeoEntry> = {
  home: {
    title: 'Parma in Little Washington | Inn, Spa & Wellness Sanctuary',
    description: 'A private sanctuary in the Blue Ridge foothills of Washington, Virginia. Parma Inn, Ayurvedic spa, concierge healthcare, and the Sushila Shanti Meditation Centre.',
    keywords: ['Parma in Little Washington', 'Parma Inn', 'Parma Spa', 'Ayurveda Virginia', 'Wellness Sanctuary', 'Concierge Healthcare', 'Blue Ridge Spa', 'Sushila Shanti Meditation', 'Washington VA Inn'],
    path: '/',
  },
  stay: {
    title: 'Parma Inn | Luxury Suites & Historic Estate Lodging',
    description: 'Experience private suite lodging at Parma Inn. Furnished with old-world antiques, Baker pieces, velvet brocades, and sterling silver in the Blue Ridge foothills.',
    keywords: ['Parma Inn', 'Tapestry Room', 'Panther Suite', 'Red Room Parma', 'Little Washington lodging', 'Virginia private estate stay'],
    path: '/stay',
  },
  spa: {
    title: 'Parma Spa | 5,000-Year-Old Ayurvedic Therapies & Wellness',
    description: 'Discover Ayurvedic pulse and dosha evaluations, Abhyanga oil therapies, Hammam heat, Vichy shower aqua soaks, and signature Jewel Facials at Parma Spa.',
    keywords: ['Parma Spa', 'Ayurveda Virginia', 'Abhyanga massage', 'Hammam thermal therapy', 'Vichy shower', 'Jewel Facials', 'Little Washington Spa'],
    path: '/spa',
  },
  healthcare: {
    title: 'Parma Healthcare | Concierge Integrative Medicine & Specialists',
    description: 'Unhurried concierge physician consultations, second opinion teleconsultations with Mayo Clinic & Cleveland Clinic specialists, led by Dr. Sadhna Nicky Singh and Dr. Thara Kodandaramachandra.',
    keywords: ['Parma Healthcare', 'Concierge physician Virginia', 'Dr. Sadhna Nicky Singh', 'Dr. Thara Kodandaramachandra', 'Mayo Clinic teleconsultation', 'Integrative care'],
    path: '/healthcare',
  },
  meditation: {
    title: 'Sushila Shanti Meditation | Sanctuary Yoga & Mindful Reflection',
    description: 'Sushila Shanti Meditation in the lineage of the Bihar School of Yoga. Stillness, silence, reflection, and breath in the Blue Ridge sanctuary.',
    keywords: ['Sushila Shanti Meditation', 'Parma Meditation', 'Bihar School of Yoga', 'Mindfulness Virginia', 'Blue Ridge Meditation'],
    path: '/meditation',
  },
  explore: {
    title: 'Explore Little Washington & Rappahannock County | Parma',
    description: 'Discover the natural beauty of Rappahannock County, Blue Ridge trails, boutique Virginia wineries, golf, and historical Washington, Virginia.',
    keywords: ['Rappahannock County', 'Little Washington VA', 'Blue Ridge foothills', 'Virginia wineries', 'Luray Caverns'],
    path: '/explore',
  },
  services: {
    title: 'Parma Spa | Wellness & Healing Therapies',
    description: 'Explore Ayurvedic spa therapies, heat treatments, aqua experiences, and wellness rituals at Parma Spa.',
    keywords: ['Parma Spa therapies', 'Ayurveda Virginia', 'Hammam therapy', 'Vichy shower'],
    path: '/spa',
  },
  portfolio: {
    title: 'Parma Inn | Sanctuary Suites & Estate Lodging',
    description: 'Explore the Tapestry Room, Red Room, Panther Suite, Lounge, and lush Blue Ridge grounds at Parma Inn.',
    keywords: ['Parma Inn suites', 'Tapestry Room', 'Panther Suite', 'Red Room Parma'],
    path: '/stay',
  },
  'kota-london': {
    title: 'The Tapestry Room & Suites | Parma Inn',
    description: 'Discover the elegance and antique craftsmanship of the suites at Parma Inn in Little Washington, Virginia.',
    keywords: ['The Tapestry Room', 'Parma Inn accommodations', 'Luxury suites Virginia'],
    path: '/stay',
    ogType: 'article',
  },
  events: {
    title: 'Sanctuary Retreats & Gatherings | Parma',
    description: 'Private wellness retreats and holistic healing programs at Parma in Little Washington.',
    keywords: ['wellness retreats Virginia', 'meditation gatherings'],
    path: '/spa',
    noIndex: true,
  },
  'event-summit': {
    title: 'Integrative Health Summit | Parma Healthcare',
    description: 'Medical and holistic wellness symposiums led by Parma Healthcare and international physicians.',
    keywords: ['integrative health summit', 'concierge medicine conference'],
    path: '/healthcare',
    ogType: 'article',
    noIndex: true,
  },
  packages: {
    title: 'Sanctuary Stays & Spa Package Menus | Parma',
    description: 'Explore wellness stays, Ayurvedic spa menus, and customized health consultation packages at Parma.',
    keywords: ['Parma spa packages', 'Ayurvedic retreat pricing', 'wellness stay packages Virginia'],
    path: '/spa',
  },
  about: {
    title: 'About Parma | Vision, Founder & Medical Leadership',
    description: 'Learn about founder Dr. Sadhna Nicky Singh, Dr. Thara Kodandaramachandra, and the four worlds of Parma in Little Washington.',
    keywords: ['Dr. Sadhna Nicky Singh', 'Dr. Thara Kodandaramachandra', 'Parma founder', 'Parma team', 'Little Washington wellness'],
    path: '/about',
  },
  careers: {
    title: 'Join Our Team | Parma Spa & Healthcare',
    description: 'Career opportunities for licensed therapists, physicians, and hospitality professionals at Parma in Little Washington.',
    keywords: ['Parma spa careers', 'wellness jobs Virginia', 'concierge health careers'],
    path: '/careers',
  },
  contact: {
    title: 'Reservations & Contact | Parma in Little Washington',
    description: 'Reserve your stay or consultation at Parma in Little Washington. Located at 105 Christmas Tree Lane, Washington, VA 22747.',
    keywords: ['Parma reservations', 'contact Parma', 'Parma phone number', '105 Christmas Tree Lane'],
    path: '/contact',
  },
  blogs: {
    title: 'Wellness & Ayurveda Insights Journal | Parma',
    description: 'Articles on Ayurveda, holistic healing, pranayama, skin aesthetics, and restorative lifestyle from Parma experts.',
    keywords: ['Ayurveda journal', 'holistic health blog', 'Parma wellness articles', 'meditation guide'],
    path: '/blogs',
  },
  'blog-inside': {
    title: 'Article | Parma Wellness Journal',
    description: 'In-depth holistic health and Ayurvedic insights from the physicians and specialists at Parma.',
    keywords: ['Ayurvedic article', 'wellness insight', 'Parma journal'],
    path: '/blogs',
    ogType: 'article',
  },
  'real-estate': {
    title: 'The Parma Estate & Little Washington Surroundings | Parma',
    description: 'Discover the natural beauty of Rappahannock County, local wineries, golf, Luray Caverns, and the Blue Ridge foothills.',
    keywords: ['Rappahannock County', 'Blue Ridge foothills', 'things to do Little Washington', 'Luray Caverns', 'Virginia wineries'],
    path: '/explore',
  },
}

export const NAV_TARGETS = {
  Home: 'home',
  'Parma Inn': 'stay',
  'Parma Spa': 'spa',
  'Parma Healthcare': 'healthcare',
  Meditation: 'meditation',
  Explore: 'explore',
  About: 'about',
  Contact: 'contact',
} as const satisfies Record<string, Page>

export type NavLabel = keyof typeof NAV_TARGETS

export const NAV_ROWS: [NavLabel, NavLabel][] = [
  ['Home', 'Parma Inn'],
  ['Parma Spa', 'Parma Healthcare'],
  ['About', 'Contact'],
]

/** URL paths ↔ page id (browser address bar + React Router) */
export const PAGE_PATH: Record<Page, string> = {
  home: '/',
  stay: '/stay',
  spa: '/spa',
  healthcare: '/healthcare',
  meditation: '/meditation',
  explore: '/explore',
  about: '/about',
  careers: '/careers',
  contact: '/contact',
  blogs: '/blogs',
  services: '/spa',
  portfolio: '/stay',
  'kota-london': '/stay',
  events: '/spa',
  'event-summit': '/spa',
  packages: '/spa',
  'blog-inside': '/blogs',
  'real-estate': '/explore',
}

export const PATH_TO_PAGE: Record<string, Page> = {
  '/': 'home',
  '/stay': 'stay',
  '/parma-inn': 'stay',
  '/portfolio': 'stay',
  '/spa': 'spa',
  '/services': 'spa',
  '/healthcare': 'healthcare',
  '/meditation': 'meditation',
  '/explore': 'explore',
  '/real-estate': 'explore',
  '/about': 'about',
  '/careers': 'careers',
  '/contact': 'contact',
  '/blogs': 'blogs',
}

export function pathToPage(pathname: string): Page {
  const p = pathname.replace(/\/$/, '') || '/'
  if (p.startsWith('/blog/')) return 'blog-inside'
  if (p.startsWith('/services/')) return 'spa'
  return PATH_TO_PAGE[p] ?? 'home'
}

export const getActiveNavLabel = (page: Page): NavLabel => {
  if (page === 'stay' || page === 'portfolio' || page === 'kota-london') return 'Parma Inn'
  if (page === 'spa' || page === 'services' || page === 'events' || page === 'packages') return 'Parma Spa'
  if (page === 'healthcare') return 'Parma Healthcare'
  if (page === 'meditation') return 'Meditation'
  if (page === 'explore' || page === 'real-estate') return 'Explore'
  if (page === 'home') return 'Home'
  if (page === 'about') return 'About'
  if (page === 'contact' || page === 'careers') return 'Contact'
  return 'Home'
}

export const SOCIAL_PROFILES = [
  'https://parmainlittlewashington.com',
] as const


/* Done: Updated blog posts with Parma in Little Washington articles and real images */

import {
  IMG_AYURVEDA_MAIN,
  IMG_PARMA_HERO_10,
  IMG_HEALTH_1,
  IMG_YOGA,
} from './assets'

export type BlogCategory = 'Wellness' | 'Ayurveda' | 'Healthcare' | 'Meditation'

export type BlogBlock =
  | { type: 'intro'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string }

export type BlogAuthor = {
  name: string
  role?: string
  avatarSrc?: string
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  label: string
  category: BlogCategory
  readTime: string
  dateISO: string
  author: BlogAuthor
  coverSrc: string
  blocks: BlogBlock[]
  tags: string[]
  featured?: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ayurveda-science-of-life',
    title: "Ayurveda: Understanding Your Body's Dosha and Energetic Blueprint",
    excerpt:
      "More than 5,000 years old, Ayurveda holds that body, mind, and environment are forces of energy and intelligence. Learn how personalized pulse & dosha assessments bring balance.",
    label: 'Ayurveda & Healing',
    category: 'Ayurveda',
    readTime: '5 min read',
    dateISO: '2026-06-18',
    author: { name: 'Dr. Sadhna Nicky Singh', role: 'Founder & Medical Director' },
    coverSrc: IMG_AYURVEDA_MAIN,
    tags: ['#ayurveda', '#doshabalance', '#abhyanga', '#holistichealth', '#parmaspa'],
    featured: true,
    blocks: [
      { type: 'intro', text: 'In Ayurveda, wellness is not merely the absence of disease, but a state of vital harmony among body, mind, and spirit.' },
      { type: 'h2', text: 'The Three Doshas' },
      {
        type: 'p',
        text: 'Every individual possesses a unique constitution governed by three energetic forces: Vata (air and space), Pitta (fire and water), and Kapha (earth and water). When these forces are balanced, health flourishes.',
      },
      {
        type: 'quote',
        text: 'When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.',
      },
      { type: 'h2', text: 'Preserving Vitality at Parma Spa' },
      {
        type: 'p',
        text: 'Our comprehensive assessments examine pulse, eyes, and nails to prescribe tailored herbal oils, warm Abhyanga massages, and gentle steam therapies.',
      },
      {
        type: 'ul',
        items: [
          'Abhyanga for nervous system calm',
          'Kathi Basti for spine and back release',
          'Oshadhi wraps to clear body heat',
          'Mardanam dual-therapist massage for deep detox',
        ],
      },
    ],
  },
  {
    slug: 'restorative-quiet-in-little-washington',
    title: 'Finding Rest in Little Washington: Nature, Spa, and Mountain Silence',
    excerpt:
      'In scenic Little Washington, unspoiled by time, nature and spiritual wellness work together. Meandering rivers and tranquil mountains create a sanctuary an hour from D.C.',
    label: 'Sanctuary Life',
    category: 'Wellness',
    readTime: '4 min read',
    dateISO: '2026-05-24',
    author: { name: 'Parma Sanctuary Team' },
    coverSrc: IMG_PARMA_HERO_10,
    tags: ['#littlewashington', '#blueridge', '#parmainn', '#wellnesssanctuary'],
    blocks: [
      { type: 'intro', text: 'Escape the rush of city life and rediscover stillness in the foothills of the Blue Ridge Mountains.' },
      { type: 'h2', text: 'Old-World Ease at Parma Inn' },
      {
        type: 'p',
        text: 'Furnished in tones of beige and brown with Nancy Corzine and Baker antiques, rich velvet brocades, and lamplight, Parma Inn offers deep quiet and timeless ease.',
      },
      { type: 'h2', text: 'Beyond the Estate Gates' },
      {
        type: 'p',
        text: 'Explore historical Washington (founded 1769), nearby Luray Caverns, boutique Virginia wineries, and mountain trailheads before returning for an evening spa treatment.',
      },
    ],
  },
  {
    slug: 'concierge-integrative-medicine',
    title: 'Why Second Opinions Matter: Integrative Healthcare and Teleconsults',
    excerpt:
      'When life arrives at a fork, chart a quieter course. Parma Healthcare liaises with national experts at Mayo Clinic and Cleveland Clinic to ensure complete medical clarity.',
    label: 'Concierge Medicine',
    category: 'Healthcare',
    readTime: '6 min read',
    dateISO: '2026-04-12',
    author: { name: 'Dr. Thara Kodandaramachandra', role: 'Integrative Medicine' },
    coverSrc: IMG_HEALTH_1,
    tags: ['#integrativemedicine', '#secondopinion', '#parmahealthcare', '#conciergecare'],
    blocks: [
      { type: 'intro', text: 'Facing a complex diagnosis requires unhurried listening, thorough evidence review, and collaborative medical insight.' },
      { type: 'h2', text: 'Connecting with Top Medical Minds' },
      {
        type: 'p',
        text: 'From the peaceful environment of Parma, our physicians arrange direct teleconsultations and file reviews with specialized experts across America.',
      },
      {
        type: 'quote',
        text: 'True healthcare addresses the complete individual — physical, emotional, and systemic.',
      },
    ],
  },
  {
    slug: 'bihar-school-of-yoga-lineage',
    title: 'Yoga Beyond Performance: Asana, Pranayama, and Inner Rest',
    excerpt:
      'Yoga at the Sushila Shanti Meditation Centre is not performance. It is the sacred desire to connect with the inner life force through authentic breath and meditation.',
    label: 'Meditation & Yoga',
    category: 'Meditation',
    readTime: '5 min read',
    dateISO: '2026-03-08',
    author: { name: 'Sushila Shanti Team' },
    coverSrc: IMG_YOGA,
    tags: ['#sushilashanti', '#pranayama', '#yoganidra', '#biharschoolofyoga'],
    blocks: [
      { type: 'intro', text: 'Immerse in classic static postures, breath regulation, and Yoga Nidra deep relaxation.' },
      { type: 'h2', text: 'Core Practices' },
      {
        type: 'ul',
        items: [
          'Foundational Pawanmuktasana for joint mobility',
          'Surya Namaskar sun salutations with breath synchronization',
          'Pranayama for clearing subtle energetic pathways',
          'Yoga Nidra for deep restorative sleep and mental clarity',
        ],
      },
    ],
  },
]

export function getBlogPost(slug: string | undefined) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getBlogCategories(): string[] {
  const categories = new Set(BLOG_POSTS.map((post) => post.category))
  return ['All', ...Array.from(categories)]
}


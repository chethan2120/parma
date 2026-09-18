import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDirectory = path.join(projectRoot, 'dist')
const baseHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8')
const siteUrl = 'https://parmainlittlewashington.com'
const defaultImage = `${siteUrl}/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/parma-inn.jpg`

const coreRoutes = [
  {
    path: '/',
    title: 'Parma in Little Washington | Inn, Spa & Wellness Sanctuary',
    description: 'A private sanctuary in the Blue Ridge foothills of Washington, Virginia. Parma Inn, Ayurvedic spa, concierge healthcare, and Sushila Shanti Meditation Centre.',
    heading: 'Parma in Little Washington',
  },
  {
    path: '/services',
    title: 'Wellness & Healing Offerings | Parma Spa & Healthcare',
    description: 'Explore Ayurvedic spa therapies, heat treatments, aqua experiences, concierge healthcare, and yoga at Parma in Little Washington.',
    heading: 'Wellness & Healing Offerings',
    pageType: 'CollectionPage',
  },
  {
    path: '/packages',
    title: 'Sanctuary Stays & Spa Package Menus | Parma',
    description: 'Explore multi-day wellness stays, Ayurvedic spa menus, and customized health consultation packages at Parma.',
    heading: 'Sanctuary Packages & Menus',
  },
  {
    path: '/portfolio',
    title: 'Sanctuary Suites & Estate Gallery | Parma in Little Washington',
    description: 'Explore the Tapestry Room, Red Room, Panther Suite, Lounge, and lush Blue Ridge grounds at Parma Inn.',
    heading: 'Parma Inn Suites & Estate',
    pageType: 'CollectionPage',
  },
  {
    path: '/real-estate',
    title: 'The Parma Estate & Little Washington Surroundings | Parma',
    description: 'Discover the natural beauty of Rappahannock County, local wineries, golf, Luray Caverns, and the Blue Ridge foothills.',
    heading: 'Explore Rappahannock County',
  },
  {
    path: '/about',
    title: 'About Parma | Vision, Founder & International Team',
    description: 'Learn about founder Dr. Sadhna Nicky Singh and the international team of physicians and spa specialists at Parma.',
    heading: 'About Parma in Little Washington',
    pageType: 'AboutPage',
  },
  {
    path: '/contact',
    title: 'Reservations & Contact | Parma in Little Washington',
    description: 'Reserve your stay or consultation at Parma in Little Washington. Located at 105 Christmas Tree Lane, Washington, VA 22747.',
    heading: 'Reservations & Contact',
    pageType: 'ContactPage',
  },
  {
    path: '/careers',
    title: 'Join Our Team | Parma Spa & Healthcare',
    description: 'Career opportunities for licensed therapists, physicians, and hospitality professionals at Parma in Little Washington.',
    heading: 'Join Our Sanctuary Team',
  },
  {
    path: '/blogs',
    title: 'Wellness & Ayurveda Insights Journal | Parma',
    description: 'Articles on Ayurveda, holistic healing, pranayama, skin aesthetics, and restorative lifestyle from Parma experts.',
    heading: 'Parma Wellness Journal',
    pageType: 'CollectionPage',
  },
  {
    path: '/events',
    title: 'Sanctuary Retreats & Special Gatherings | Parma',
    description: 'Private wellness retreats, quiet gatherings, and holistic healing programs at Parma in Little Washington.',
    heading: 'Sanctuary Retreats & Gatherings',
    pageType: 'CollectionPage',
    indexable: false,
  },
  {
    path: '/event-summit',
    title: 'Integrative Health Summit | Parma Healthcare',
    description: 'Medical and holistic wellness symposiums led by Parma Healthcare and international physicians.',
    heading: 'Integrative Health Summit',
    ogType: 'article',
    indexable: false,
  },
  {
    path: '/kota-london',
    title: 'The Tapestry Room & Suites | Parma Inn Case Showcase',
    description: 'Discover the elegance and antique craftsmanship of the suites at Parma Inn in Little Washington, Virginia.',
    heading: 'The Tapestry Room & Suites',
    ogType: 'article',
  },
]

const serviceRoutes = [
  {
    path: '/services/social-media-management',
    title: 'Ayurvedic Spa Therapies | Parma Spa',
    description: 'Pulse assessments, Abhyanga oil treatments, Kathi Basti, and dosha balancing therapies at Parma Spa in Little Washington.',
    heading: 'Ayurvedic Spa Therapies',
  },
  {
    path: '/services/web-development',
    title: 'Parma Inn Accommodations | Luxury Suites Virginia',
    description: 'Refined accommodations furnished with Nancy Corzine and Baker antiques in the Blue Ridge foothills of Virginia.',
    heading: 'Parma Inn Accommodations',
  },
  {
    path: '/services/brand-strategy-design',
    title: 'Beauty & Medical Aesthetics | Parma Spa',
    description: 'Signature Jewel Facials, fruit acid peels, and physician-administered aesthetics by Dr. Sadhna Nicky Singh.',
    heading: 'Beauty & Medical Aesthetics',
  },
  {
    path: '/services/digital-marketing',
    title: 'Heat & Aqua Experiences | Parma Spa',
    description: 'Hammam milk-and-rose soaks, Kuti Swedhana steam, Vichy shower hydrotherapy, and Aquatic Yoga at Parma Spa.',
    heading: 'Heat & Aqua Experiences',
  },
  {
    path: '/services/software-development',
    title: 'Concierge Healthcare & Second Opinions | Parma',
    description: 'Concierge physician consultations and second opinion teleconsultations with top specialists by Dr. Thara Kodandaramachandra.',
    heading: 'Parma Healthcare',
  },
  {
    path: '/services/brand-consulting',
    title: 'Sushila Shanti Meditation & Yoga | Parma',
    description: 'Asana, pranayama, Yoga Nidra, and spiritual meditation in the lineage of the Bihar School of Yoga.',
    heading: 'Sushila Shanti Meditation',
  },
].map((route) => ({ ...route, schemaType: 'service' }))

const blogRoutes = [
  {
    slug: 'people-trust-people-before-brands',
    title: 'The Sacred Science of Ayurveda in Daily Life',
    description: 'Explore how 5,000-year-old Ayurvedic principles restore natural balance across mind, body, and spirit.',
    date: '2026-06-18',
    category: 'Ayurveda',
  },
  {
    slug: 'how-consistency-increased-engagement-case-study',
    title: 'Quiet Rest in the Blue Ridge Foothills',
    description: 'Discover why Little Washington, Virginia is the ideal sanctuary setting for restorative multi-day stays.',
    date: '2026-06-12',
    category: 'Sanctuary',
  },
  {
    slug: 'raw-content-is-outperforming-polished-content',
    title: 'Integrative Medicine: Combining Ancient & Modern Care',
    description: 'How Parma Healthcare bridges classical Ayurvedic therapies with Mayo Clinic and Cleveland Clinic specialist consultations.',
    date: '2026-06-09',
    category: 'Healthcare',
  },
  {
    slug: 'good-marketing-can-completely-change-a-business',
    title: 'Pranayama & Breathwork for Nervous System Rest',
    description: 'Learn breathing techniques from the Bihar School of Yoga to quiet the mind and improve daily vitality.',
    date: '2026-06-06',
    category: 'Meditation',
  },
  {
    slug: 'people-dont-buy-products-they-buy-feelings',
    title: 'The Art of Antique Suite Design at Parma Inn',
    description: 'A look inside the Nancy Corzine furniture, velvet brocades, and sterling silver pieces at Parma Inn.',
    date: '2026-06-03',
    category: 'Parma Inn',
  },
  {
    slug: 'pretty-feeds-are-dead',
    title: 'Hydrotherapy & Heat Steam Treatments Explained',
    description: 'From Hammam soaks to 5-head Vichy shower tables: understanding the restorative power of aqua spa experiences.',
    date: '2026-05-28',
    category: 'Parma Spa',
  },
  {
    slug: 'great-brands-nobody-notices',
    title: 'Exploring Rappahannock County Wineries & Caverns',
    description: 'Plan your stay around Luray Caverns, historic Washington VA (founded 1769), local golf, and boutique wineries.',
    date: '2026-05-25',
    category: 'Explore',
  },
].map((post) => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} | Parma Journal`,
  description: post.description,
  heading: post.title,
  schemaType: 'blog',
  date: post.date,
  category: post.category,
  ogType: 'article',
}))

const routes = [...coreRoutes, ...serviceRoutes, ...blogRoutes]
const indexableRoutes = routes.filter((route) => route.indexable !== false)
const siteLinks = [
  ['Sanctuary', '/about'],
  ['Inn', '/portfolio'],
  ['Spa', '/services'],
  ['Healthcare', '/packages'],
  ['Meditation', '/events'],
  ['Explore', '/real-estate'],
  ['Reserve', '/contact'],
]
const serviceLinks = serviceRoutes.map((route) => [route.heading, route.path])

const sitemapXml = await readFile(path.join(distDirectory, 'sitemap.xml'), 'utf8')
const sitemapUrls = new Set(
  [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
)
const routeUrls = new Set(
  indexableRoutes.map((route) => route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`),
)

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceMeta(html, attribute, key, content) {
  const expression = new RegExp(
    `<meta\\s+[^>]*${escapeRegExp(attribute)}=["']${escapeRegExp(key)}["'][^>]*>`,
    'i',
  )
  return html.replace(
    expression,
    `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`,
  )
}

function createFallback(route) {
  const nav = siteLinks
    .map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`)
    .join('')
  const services = serviceLinks
    .map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join('')

  return `
    <div class="seo-fallback">
      <header><a href="/" aria-label="Parma home">Parma in Little Washington</a></header>
      <main>
        <h1>${escapeHtml(route.heading)}</h1>
        <p>${escapeHtml(route.description)}</p>
        <nav aria-label="Primary website pages">${nav}</nav>
        <section aria-labelledby="seo-services-heading">
          <h2 id="seo-services-heading">Parma Offerings</h2>
          <ul>${services}</ul>
        </section>
      </main>
    </div>
    <noscript>
      <style>
        #boot-curtain{display:none!important}
        .seo-fallback{max-width:1120px;margin:0 auto;padding:32px;font:16px/1.6 system-ui,sans-serif;color:#17201f}
        .seo-fallback header a{font-size:24px;font-weight:800;color:#3b1812;text-decoration:none}
        .seo-fallback h1{font-size:clamp(2rem,6vw,4rem);line-height:1.05}
        .seo-fallback nav{display:flex;flex-wrap:wrap;gap:16px;margin:28px 0}
        .seo-fallback a{color:#3b1812}
      </style>
    </noscript>`
}

function createSchema(html, route, canonical) {
  const match = html.match(
    /<script\s+type="application\/ld\+json"\s+data-schema="page-graph">([\s\S]*?)<\/script>/i,
  )
  if (!match) throw new Error('Base structured data script was not found in dist/index.html')

  const schema = JSON.parse(match[1])
  const graph = schema['@graph']
  const page = graph.find((node) => node['@type'] === 'WebPage')

  page['@type'] = route.pageType ?? 'WebPage'
  page['@id'] = `${canonical}#webpage`
  page.url = canonical
  page.name = route.title
  page.description = route.description

  if (route.schemaType === 'service') {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: route.heading,
      serviceType: route.heading,
      description: route.description,
      url: canonical,
      provider: { '@id': `${siteUrl}/#organization` },
      areaServed: [
        { '@type': 'Place', name: 'Little Washington, VA' },
        { '@type': 'Place', name: 'Rappahannock County' },
      ],
    })
  }

  if (route.schemaType === 'blog') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${canonical}#article`,
      headline: route.heading,
      description: route.description,
      url: canonical,
      datePublished: route.date,
      dateModified: route.date,
      articleSection: route.category,
      author: { '@type': 'Organization', name: 'Parma Specialists' },
      publisher: { '@id': `${siteUrl}/#organization` },
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
      inLanguage: 'en-US',
    })
  }

  if (route.path !== '/') {
    const breadcrumbs = [{ name: 'Home', item: `${siteUrl}/` }]
    if (route.schemaType === 'service') {
      breadcrumbs.push({ name: 'Services', item: `${siteUrl}/services` })
    }
    if (route.schemaType === 'blog') {
      breadcrumbs.push({ name: 'Blog', item: `${siteUrl}/blogs` })
    }
    breadcrumbs.push({ name: route.heading, item: canonical })
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        ...item,
      })),
    })
  }

  const script = `<script type="application/ld+json" data-schema="page-graph">${JSON.stringify(schema)}</script>`
  return html.replace(match[0], script)
}

function renderRoute(route) {
  const canonical = route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`
  const ogType = route.ogType ?? 'website'
  let html = baseHtml

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
  html = replaceMeta(html, 'name', 'description', route.description)
  html = replaceMeta(
    html,
    'name',
    'robots',
    route.indexable === false
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  )
  html = replaceMeta(html, 'property', 'og:title', route.title)
  html = replaceMeta(html, 'property', 'og:description', route.description)
  html = replaceMeta(html, 'property', 'og:type', ogType)
  html = replaceMeta(html, 'property', 'og:url', canonical)
  html = replaceMeta(html, 'property', 'og:image', defaultImage)
  html = replaceMeta(html, 'property', 'og:image:alt', `Parma in Little Washington - ${route.heading}`)
  html = replaceMeta(html, 'name', 'twitter:title', route.title)
  html = replaceMeta(html, 'name', 'twitter:description', route.description)
  html = replaceMeta(html, 'name', 'twitter:image', defaultImage)
  html = replaceMeta(html, 'name', 'twitter:image:alt', `Parma in Little Washington - ${route.heading}`)
  html = html.replace(
    /<link\s+[^>]*rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonical}" />`,
  )
  html = createSchema(html, route, canonical)
  html = html.replace('<div id="root"></div>', `<div id="root">${createFallback(route)}</div>`)
  return html
}

for (const route of routes) {
  const outputPath =
    route.path === '/'
      ? path.join(distDirectory, 'index.html')
      : path.join(distDirectory, `${route.path.slice(1)}.html`)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, renderRoute(route))
}

console.log(
  `Generated static SEO HTML for ${indexableRoutes.length} indexable and ${routes.length - indexableRoutes.length} noindex routes`,
)

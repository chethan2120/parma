import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDirectory = path.join(projectRoot, 'public')
const distDirectory = path.join(projectRoot, 'dist')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (entry.name.startsWith('PARMA') || entry.name.startsWith('Images') || entry.name === 'Logos__2') {
          return []
        }
        return collectHtmlFiles(fullPath)
      }
      return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : []
    }),
  )
  return nested.flat()
}

const requiredFavicons = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['favicon-48x48.png', 48],
  ['apple-touch-icon.png', 180],
  ['webnxt-icon-192.png', 192],
  ['webnxt-icon-512.png', 512],
]

await access(path.join(publicDirectory, 'favicon.svg'))
await access(path.join(publicDirectory, 'favicon.ico'))

const icoBytes = await readFile(path.join(publicDirectory, 'favicon.ico'))
assert(icoBytes[2] === 1 && icoBytes[3] === 0, 'favicon.ico must be an ICO image type')
assert(icoBytes[4] >= 3, 'favicon.ico must include at least 16/32/48 sizes for Edge')

for (const [fileName, expectedSize] of requiredFavicons) {
  const filePath = path.join(publicDirectory, fileName)
  const metadata = await sharp(filePath).metadata()
  assert(
    metadata.width === expectedSize && metadata.height === expectedSize,
    `${fileName} must be ${expectedSize}×${expectedSize}`,
  )
}

const manifest = JSON.parse(
  await readFile(path.join(publicDirectory, 'site.webmanifest'), 'utf8'),
)
for (const icon of manifest.icons) {
  const iconPath = decodeURIComponent(icon.src.replace(/^\//, '').split('?')[0])
  await access(path.join(publicDirectory, iconPath))
}

const sitemap = await readFile(path.join(publicDirectory, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
assert(sitemapUrls.length > 0, 'sitemap.xml must contain at least one URL')
assert(new Set(sitemapUrls).size === sitemapUrls.length, 'sitemap.xml contains duplicate URLs')

const robots = await readFile(path.join(publicDirectory, 'robots.txt'), 'utf8')
assert(robots.includes('Allow: /'), 'robots.txt must allow public crawling')
assert(
  robots.includes('Sitemap: https://parmainlittlewashington.com/sitemap.xml'),
  'robots.txt must advertise the canonical sitemap',
)

const llms = await readFile(path.join(publicDirectory, 'llms.txt'), 'utf8')
assert(llms.includes('https://parmainlittlewashington.com/'), 'llms.txt must identify the canonical website')
assert(llms.includes('Parma in Little Washington'), 'llms.txt must identify the brand entity')

const htmlFiles = await collectHtmlFiles(distDirectory)
const titles = new Set()
const canonicals = new Set()
let indexableHtmlCount = 0
let noIndexHtmlCount = 0

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8')
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1]
  const description = html.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/i)?.[1]
  const robotsContent = html.match(/<meta\s+name="robots"\s+content="(.*?)"\s*\/?>/i)?.[1]
  const canonical = html.match(/<link\s+rel="canonical"\s+href="(.*?)"\s*\/?>/i)?.[1]
  const schemaText = html.match(
    /<script\s+type="application\/ld\+json"\s+data-schema="page-graph">([\s\S]*?)<\/script>/i,
  )?.[1]

  assert(title, `${htmlFile} is missing a title`)
  assert(description, `${htmlFile} is missing a meta description`)
  assert(robotsContent, `${htmlFile} is missing a robots directive`)
  assert(canonical, `${htmlFile} is missing a canonical URL`)
  assert(schemaText, `${htmlFile} is missing page structured data`)
  assert(!titles.has(title), `Duplicate title found: ${title}`)
  assert(!canonicals.has(canonical), `Duplicate canonical found: ${canonical}`)

  if (/\bnoindex\b/i.test(robotsContent)) {
    assert(!sitemapUrls.includes(canonical), `Noindex URL must not be in sitemap.xml: ${canonical}`)
    noIndexHtmlCount += 1
  } else {
    assert(sitemapUrls.includes(canonical), `Canonical is not listed in sitemap.xml: ${canonical}`)
    indexableHtmlCount += 1
  }

  JSON.parse(schemaText)
  titles.add(title)
  canonicals.add(canonical)
}

assert(
  indexableHtmlCount === sitemapUrls.length,
  `Expected ${sitemapUrls.length} indexable HTML routes, found ${indexableHtmlCount}`,
)

const homeHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8')
assert(
  homeHtml.includes('<title>Parma in Little Washington | Inn, Spa &amp; Wellness Sanctuary</title>'),
  'Homepage title must use the Parma positioning',
)
assert(
  homeHtml.includes('href="/favicon.ico?v=20260831"'),
  'Generated pages must reference the cache-busted ICO favicon first (Edge)',
)
assert(
  homeHtml.includes('href="/favicon.svg?v=20260831"'),
  'Generated pages must reference the supplied SVG favicon',
)
assert(
  homeHtml.includes('href="/favicon-48x48.png?v=20260831"'),
  'Generated pages must reference the 48×48 PNG favicon for Google SERP',
)

console.log(
  `SEO validation passed: ${indexableHtmlCount} indexable routes, ${noIndexHtmlCount} noindex routes, ${requiredFavicons.length + 2} favicon formats`,
)

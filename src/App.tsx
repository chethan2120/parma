/**
 * Done by Daksh Sharma: Refactored App.tsx for performance.
 * Why: Previously, App.tsx was ~1,500 lines because the entire homepage UI,
 * GSAP animation hooks, and homepage-specific state were all defined here.
 * This meant the browser had to parse and evaluate ALL homepage code even
 * when the user navigated to /services, /about, etc. Now the homepage is
 * extracted into HomePage.tsx and lazy-loaded, reducing the main bundle size.
 * Homepage-specific state (openFaq, pkgCategory, svcIndex, etc.) has been
 * moved into HomePage.tsx so that state changes there don't force re-renders
 * of the global routing shell.
 *
 * No animation, logic, or visual behavior has been changed.
 */

import { Suspense, useState, useEffect, useLayoutEffect, useRef, useCallback, lazy } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation, NavLink } from 'react-router-dom'

import './App.css'
import { getActiveLenis, useGsapSmoothScroll } from './hooks/useGsapSmoothScroll'
import { type Page, SITE_NAME, SITE_URL, SEO_BY_PAGE, pathToPage } from './data/constants'
import type { ServiceItem } from './data/services'

/* Done by Daksh Sharma: Restored lazy loading for HomePage to allow Vite to code-split this heavy 52KB component out of the main bundle, using fallback={null} to avoid any visual flash. */
const HomePage = lazy(() => import('./HomePage'))
const ServicesPage = lazy(() => import('./ServicesPage'))
const PortfolioPage = lazy(() => import('./PortfolioPage'))
const AboutPage = lazy(() => import('./AboutPage'))
const ContactPage = lazy(() => import('./ContactPage'))
const BlogPage = lazy(() => import('./BlogPage'))
const RealEstatePage = lazy(() => import('./RealEstatePage'))
const HealthcarePage = lazy(() => import('./HealthcarePage'))
const MeditationPage = lazy(() => import('./MeditationPage'))
const FloatingHelp = lazy(() => import('./components/FloatingHelp'))

type BlogSeoPost = {
  title: string
  excerpt: string
  category: string
  slug: string
  dateISO: string
  author: { name: string }
  tags: string[]
  coverSrc: string
}

function loadScrollTrigger() {
  return import('gsap/ScrollTrigger').then((module) => module.ScrollTrigger)
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const routerNavigate = useNavigate()
  const location = useLocation()
  const currentPage = pathToPage(location.pathname)
  const [showFloatingHelp, setShowFloatingHelp] = useState(false)

  // Inertial (smooth) page scrolling on non-touch, non-reduced-motion devices.
  useGsapSmoothScroll()

  // Done by Daksh Sharma: Track dynamically created head tags for cleanup on unmount
  const createdTagsRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    const createdTags = createdTagsRef.current
    return () => {
      // Done by Daksh Sharma: Clean up all dynamically created head tags on App unmount to prevent leaks/bloat
      createdTags.forEach((tag) => tag.remove())
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = () => {
      if (!cancelled) setShowFloatingHelp(true)
    }
    if ('requestIdleCallback' in window) {
      const idleId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(run, { timeout: 2400 })
      return () => {
        cancelled = true
        ;(window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId)
      }
    }
    const timer = globalThis.setTimeout(run, 1400)
    return () => {
      cancelled = true
      globalThis.clearTimeout(timer)
    }
  }, [])

  const scrollToTopImmediate = useCallback(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtmlBehavior = html.style.scrollBehavior
    const prevBodyBehavior = body.style.scrollBehavior

    // Override global smooth scrolling for deterministic page-to-page resets.
    html.style.scrollBehavior = 'auto'
    body.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)

    getActiveLenis()?.scrollTo(0, { immediate: true, force: true })

    requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      html.style.scrollBehavior = prevHtmlBehavior
      body.style.scrollBehavior = prevBodyBehavior
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    const pathname = location.pathname.replace(/\/$/, '') || '/'
    const baseSeo = SEO_BY_PAGE[currentPage]
    const blogSlug = pathname.startsWith('/blog/') ? pathname.replace('/blog/', '').split('/')[0] : null
    const serviceSlug = pathname.startsWith('/services/') ? pathname.replace('/services/', '').split('/')[0] : null
    const defaultImageUrl = `${SITE_URL}/image.png`
    const getCanonicalUrl = (path: string) => path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`

    const setMeta = (key: string, value: string, type: 'name' | 'property' = 'name') => {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${type}="${key}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(type, key)
        document.head.appendChild(tag)
        // Done by Daksh Sharma: Add tag to created list for unmount cleanup
        createdTagsRef.current.push(tag)
      }
      tag.setAttribute('content', value)
    }

    const setLink = (rel: string, href: string) => {
      let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
      if (!tag) {
        tag = document.createElement('link')
        tag.setAttribute('rel', rel)
        document.head.appendChild(tag)
        // Done by Daksh Sharma: Add tag to created list for unmount cleanup
        createdTagsRef.current.push(tag)
      }
      tag.setAttribute('href', href)
    }

    const applySeo = (seo: typeof baseSeo, imageUrl = defaultImageUrl) => {
      const canonicalUrl = getCanonicalUrl(seo.path)

      document.title = seo.title

      setMeta('description', seo.description)
      setMeta(
        'robots',
        seo.noIndex
          ? 'noindex, follow'
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      )
      setMeta('author', SITE_NAME)
      setMeta('theme-color', '#CA6641')

      setMeta('og:title', seo.title, 'property')
      setMeta('og:description', seo.description, 'property')
      setMeta('og:type', seo.ogType ?? 'website', 'property')
      setMeta('og:url', canonicalUrl, 'property')
      setMeta('og:site_name', SITE_NAME, 'property')
      setMeta('og:image', imageUrl, 'property')
      setMeta('og:image:alt', `${SITE_NAME} - ${seo.title.split(' | ')[0]}`, 'property')

      setMeta('twitter:card', 'summary_large_image')
      setMeta('twitter:title', seo.title)
      setMeta('twitter:description', seo.description)
      setMeta('twitter:image', imageUrl)
      setMeta('twitter:image:alt', `${SITE_NAME} - ${seo.title.split(' | ')[0]}`)

      setLink('canonical', canonicalUrl)
      setMeta('og:locale', 'en_IN', 'property')

      return canonicalUrl
    }

    const applyStructuredData = async (
      seo: typeof baseSeo,
      imageUrl: string,
      blog?: BlogSeoPost,
      service?: ServiceItem,
    ) => {
      const {
        createBaseStructuredData,
        createServicesStructuredData,
        createServiceStructuredData,
        createPackagesStructuredData,
        createBlogStructuredData,
        createFAQStructuredData,
        createBreadcrumbStructuredData,
      } = await import('./utils/seoUtils')

      if (cancelled) return

      const canonicalUrl = getCanonicalUrl(seo.path)
      const graph: Array<Record<string, unknown>> = createBaseStructuredData({
        canonicalUrl,
        imageUrl,
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      })

      if (service) {
        graph.push(...createServiceStructuredData(canonicalUrl, service))
      } else if (currentPage === 'services') {
        graph.push(...createServicesStructuredData())
      }

      if (currentPage === 'packages') {
        const { PACKAGES_DATA, PACKAGE_CATEGORY_ORDER } = await import('./data/packages')
        if (cancelled) return
        graph.push(...createPackagesStructuredData(canonicalUrl, PACKAGES_DATA, PACKAGE_CATEGORY_ORDER))
      }

      if (blog) {
        graph.push(
          ...createBlogStructuredData({
            canonicalUrl,
            imageUrl,
            title: blog.title,
            description: seo.description,
            dateISO: blog.dateISO,
            authorName: blog.author.name,
            category: blog.category,
            keywords: blog.tags,
          }),
        )
      }

      if (currentPage === 'home') {
        graph.push(...createFAQStructuredData())
      } else {
        const breadcrumbs = [{ name: 'Home', url: `${SITE_URL}/` }]
        if (service) breadcrumbs.push({ name: 'Services', url: `${SITE_URL}/services` })
        if (blog) breadcrumbs.push({ name: 'Blog', url: `${SITE_URL}/blogs` })
        breadcrumbs.push({ name: blog?.title ?? service?.title ?? seo.title.split(' | ')[0], url: canonicalUrl })
        graph.push(...createBreadcrumbStructuredData(breadcrumbs))
      }

      let schemaTag = document.head.querySelector<HTMLScriptElement>('script[data-schema="page-graph"]')
      if (!schemaTag) {
        schemaTag = document.createElement('script')
        schemaTag.type = 'application/ld+json'
        schemaTag.setAttribute('data-schema', 'page-graph')
        document.head.appendChild(schemaTag)
        createdTagsRef.current.push(schemaTag)
      }

      schemaTag.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph,
      })
    }

    applySeo(baseSeo)

    void (async () => {
      let seo = baseSeo
      let blog: BlogSeoPost | undefined
      let service: ServiceItem | undefined
      let imageUrl = defaultImageUrl

      if (serviceSlug) {
        const { getServiceBySlug } = await import('./data/services')
        if (cancelled) return
        service = getServiceBySlug(serviceSlug)

        if (service) {
          seo = {
            ...baseSeo,
            title: service.seoTitle,
            description: service.seoDescription,
            keywords: [...service.seoKeywords],
            path: `/services/${service.slug}`,
          }
          applySeo(seo)
        }
      }

      if (blogSlug) {
        const { getBlogPost } = await import('./data/blogs')
        if (cancelled) return
        blog = getBlogPost(blogSlug)

        if (blog) {
          imageUrl = new URL(blog.coverSrc, `${SITE_URL}/`).href
          seo = {
            ...baseSeo,
            title: `${blog.title} | Parma Journal`,
            description: blog.excerpt,
            keywords: [...baseSeo.keywords, blog.category, ...blog.tags.map((t) => t.replace('#', ''))].filter(Boolean),
            path: `/blog/${blog.slug}`,
            ogType: 'article' as const,
          }
          applySeo(seo, imageUrl)
        }
      }

      await applyStructuredData(seo, imageUrl, blog, service)
    })()

    return () => {
      cancelled = true
    }
  }, [currentPage, location.pathname])

  /* Webfonts load non-blockingly (index.html), so they swap in after first paint
     and reflow every text block on the page. Any ScrollTrigger start/end measured
     before that swap is stale, which shows up as reveals firing at the wrong
     scroll position and pins ending early. Re-measure once fonts settle. */
  useEffect(() => {
    if (!document.fonts) return
    let cancelled = false
    void document.fonts.ready.then(() => {
      if (cancelled) return
      void loadScrollTrigger().then((st) => st.refresh())
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return

    const prev = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = prev
    }
  }, [])

  const cleanupHomeScrollState = useCallback(() => {
    // HomePage's GSAP contexts own and revert their own triggers. A global
    // ScrollTrigger.getAll().kill() raced the lazy destination page and could
    // delete its newly-created triggers after navigation.
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    window.scrollTo(0, 0)
  }, [])

  const go = useCallback(
    (path: string) => {
      setMenuOpen(false)
      
      // Handle hash navigation
      const [pathname, hash] = path.split('#')
      
      if (hash) {
        // Navigate to the path first
        routerNavigate(pathname)
        // Then scroll to the hash after a short delay
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            const lenis = getActiveLenis()
            if (lenis) lenis.scrollTo(element)
            else element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      } else {
        // No scrollToTopImmediate() here: the pathname effect below already
        // resets scroll on every route change, and doing it in both places ran
        // two resets (each with its own rAF follow-up) around the same commit,
        // which is what produced the one-frame flash on navigation.
        routerNavigate(path)
      }
    },
    [routerNavigate],
  )

  const prevPageRef = useRef<Page | null>(null)

  useLayoutEffect(() => {
    const prev = prevPageRef.current
    prevPageRef.current = currentPage

    if (prev === null) return
    if (prev !== 'home' || currentPage === 'home') return

    cleanupHomeScrollState()
  }, [cleanupHomeScrollState, currentPage])

  const handleMenuLinkClick = useCallback(() => {
    setMenuOpen(false)
  }, [])

  /* Scroll to top on real route changes (covers NavLink + programmatic go()) */
  useEffect(() => {
    scrollToTopImmediate()
  }, [location.pathname, scrollToTopImmediate])

  /* lock body scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (menuOpen) getActiveLenis()?.stop()
    else getActiveLenis()?.start()
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Done by Daksh Sharma: Memoized route navigation callbacks to prevent page components from re-rendering due to callback reference changes. */
  const handleMenuOpen = useCallback(() => setMenuOpen(true), [])
  const handleGoHome = useCallback(() => go('/'), [go])
  const handleGoContact = useCallback(() => go('/contact'), [go])
  const handleGoPortfolio = useCallback(() => go('/stay'), [go])
  const handleGoServices = useCallback(() => go('/spa'), [go])

  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null)

  const menuItems = [
    { label: 'Home', path: '/', key: 'home', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/home_banner.jpg', tag: '01 / 06 · ESTATE SANCTUARY', title: 'Parma in Little Washington' },
    { label: 'Parma Inn', path: '/stay', key: 'stay', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/parma-inn.jpg', tag: '02 / 06 · PARMA INN', title: 'Luxury Suite Accommodations' },
    { label: 'Parma Spa', path: '/spa', key: 'spa', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/ayurveda-therapi-main.jpg', tag: '03 / 06 · PARMA SPA', title: '5,000-Year Ayurvedic Healing' },
    { label: 'Parma Healthcare', path: '/healthcare', key: 'healthcare', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/health1.jpg', tag: '04 / 06 · HEALTHCARE', title: 'Concierge Integrative Medicine' },
    { label: 'About', path: '/about', key: 'about', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/vision.jpg', tag: '05 / 06 · ABOUT PARMA', title: 'Our Vision & Leadership' },
    { label: 'Contact', path: '/contact', key: 'contact', image: '/PARMA-20260909T145313Z-1-001/PARMA/15-02-2017/15-02-2017/images/panther1.jpg', tag: '06 / 06 · RESERVATIONS', title: 'Inquiries & Estate Directions' },
  ]

  useEffect(() => {
    if (!menuOpen || hoveredNavIndex !== null) return
    const interval = setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % menuItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [menuOpen, hoveredNavIndex, menuItems.length])

  const activeSlideIndex = hoveredNavIndex !== null ? hoveredNavIndex : slideshowIndex
  const currentSlide = menuItems[activeSlideIndex] || menuItems[0]

  return (
    <div className="page-root">
      {/* ──────────────────── FULL-SCREEN NAV MENU ──────────────────── */}
      <div
        className={`menu-overlay${menuOpen ? ' menu-overlay--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        {/* Left panel — clean vertical navigation stack */}
        <div className="menu-left">
          <div className="menu-brand-header" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              className="menu-logo-img"
              src="/parma-official-crest.png"
              alt="Parma Crest Logo"
              style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
              decoding="async"
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '22px', fontWeight: 600, color: 'var(--parma-ivory, #F5EFE5)', letterSpacing: '0.04em' }}>Parma</span>
              <span style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '11px', fontWeight: 400, color: 'var(--parma-antique-gold, #C49A52)', letterSpacing: '0.08em', fontStyle: 'italic' }}>in Little Washington</span>
            </div>
          </div>
          <nav className="menu-nav">
            <div className="menu-v-list">
              {menuItems.map((item, idx) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end={item.key === 'home'}
                  className={({ isActive }) =>
                    `menu-v-link${isActive ? ' menu-v-link--active' : ''}`
                  }
                  onClick={handleMenuLinkClick}
                  onMouseEnter={() => setHoveredNavIndex(idx)}
                  onMouseLeave={() => setHoveredNavIndex(null)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
          <div className="menu-socials">
            <NavLink
              to="/contact"
              className="menu-reserve-cta"
              onClick={handleMenuLinkClick}
            >
              Reserve Your Stay ↗
            </NavLink>
            <div className="menu-contact-info">
              <a href="tel:15409878588" className="menu-social">Phone: 540 987 8588</a>
              <span className="menu-contact-sep">•</span>
              <a href="mailto:info@parmainlittlewashington.com" className="menu-social">Email: info@parmainlittlewashington.com</a>
            </div>
          </div>
        </div>

        {/* Right panel — Image Slideshow */}
        <div className="menu-right">
          <div className="menu-slideshow-container">
            <div className="menu-slideshow-frame">
              <img
                key={currentSlide.image}
                src={currentSlide.image}
                alt={currentSlide.title}
                className="menu-slideshow-img"
              />
              <div className="menu-slideshow-caption">
                <span className="menu-slideshow-tag">{currentSlide.tag}</span>
                <h4 className="menu-slideshow-title">{currentSlide.title}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Header strip close button */}
        <div className="menu-header-strip" style={{ justifyContent: 'flex-end' }}>
          <button
            className="menu-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            Close
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Routed content above closed menu (z-index); menu raises when open.
          Fixed overlays (menu, FloatingHelp) stay outside the content wrapper. */}
      <div id="smooth-wrapper">
      <div id="smooth-content">
      <main className="page-shell">
        {/* Done by Daksh Sharma: Changed fallback from "Loading..." to null.
          Why: To avoid showing a flashing "Loading..." text when routes are loading, ensuring a seamless direct page appearance. */}
        <Suspense fallback={null}>
        <Routes>
          {/* Parma Spa */}
          <Route path="/spa" element={<ServicesPage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onContact={handleGoContact} />} />
          <Route path="/services" element={<Navigate to="/spa" replace />} />

          {/* Parma Inn (Stay) */}
          <Route path="/stay" element={<PortfolioPage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onContact={handleGoContact} />} />
          <Route path="/parma-inn" element={<Navigate to="/stay" replace />} />
          <Route path="/portfolio" element={<Navigate to="/stay" replace />} />

          {/* Parma Healthcare */}
          <Route path="/healthcare" element={<HealthcarePage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onContact={handleGoContact} />} />

          {/* Sushila Shanti Meditation */}
          <Route path="/meditation" element={<MeditationPage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onContact={handleGoContact} />} />

          {/* Explore Little Washington */}
          <Route path="/explore" element={<RealEstatePage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onServices={handleGoServices} onPortfolio={handleGoPortfolio} onCareers={handleGoContact} />} />
          <Route path="/real-estate" element={<Navigate to="/explore" replace />} />

          {/* About, Contact, Blogs, Home */}
          <Route path="/about" element={<AboutPage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onServices={handleGoServices} onCareers={handleGoContact} />} />
          <Route path="/contact" element={<ContactPage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onCareers={handleGoContact} />} />
          <Route path="/blogs" element={<BlogPage onMenuOpen={handleMenuOpen} onHome={handleGoHome} onCareers={handleGoContact} />} />
          <Route path="/packages" element={<Navigate to="/spa" replace />} />
          <Route path="/" element={<HomePage onMenuOpen={handleMenuOpen} onNavigate={go} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>
      </div>
      </div>
      {showFloatingHelp ? (
        <Suspense fallback={null}>
          <FloatingHelp />
        </Suspense>
      ) : null}
    </div>
  )
}

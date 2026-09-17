import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import type { SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import './BlogPage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { BLOG_POSTS, getBlogCategories } from './data/blogs'
import { Footer } from './components/Footer/Footer'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from './data/constants'

const IMG_READ_ARROW = new URL('../res/fd2ba9d9-936f-4d53-9130-582e06bfce11.svg', import.meta.url).href

const BLOG_FALLBACK_COVER = 'https://picsum.photos/seed/webnxt-blog-fallback/1600/900'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onCareers: () => void
}

// Done by Daksh Sharma: Extracted static categories array to module scope to avoid re-running getBlogCategories on every render.
const CATEGORIES = getBlogCategories()

export default function BlogPage({ onMenuOpen, onHome, onCareers }: Props) {
  const [activeCategory, setActiveCategory] = useState('All Posts')
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Done by Daksh Sharma: Wrapped blog posts filtering and partitioning in useMemo
  // to avoid re-filtering and searching the BLOG_POSTS array on unrelated renders.
  const { featured, rest } = useMemo(() => {
    const visiblePosts =
      activeCategory === 'All Posts'
        ? BLOG_POSTS
        : BLOG_POSTS.filter((p) => p.category === activeCategory)
    const featuredPost = visiblePosts.find((p) => p.featured) ?? visiblePosts[0]
    const restPosts = visiblePosts.filter((p) => p.slug !== featuredPost?.slug)
    return { featured: featuredPost, rest: restPosts }
  }, [activeCategory])

  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMotion(rootRef)

  // Done by Daksh Sharma: Memoized handleBlogImageError with useCallback to maintain stable reference.
  const handleBlogImageError = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.src.endsWith(BLOG_FALLBACK_COVER)) return
    img.src = BLOG_FALLBACK_COVER
  }, [])

  return (
    <div className="bl-root page-motion-shell" ref={rootRef}>
      <header className="bl-header">
        <WebnxtHeaderLogo pageClass="bl-logo" onHome={onHome} />
        <div className="header-actions">
          <nav className="hero-social" aria-label="Parma contact options">
            <a href={`tel:${SUPPORT_PHONE.replace(/\s+/g, '')}`} className="hero-social-link" aria-label="Phone" title={`Call ${SUPPORT_PHONE}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hero-social-link" aria-label="Email" title={`Email ${SUPPORT_EMAIL}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </nav>
          <button className="btn-work" onClick={onCareers}>
            Reserve Stay
            <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="btn-menu" aria-label="Open menu" onClick={onMenuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main className="bl-main">
        <section className="bl-hero">
          <span className="bl-kicker">OUR PERSPECTIVES</span>
          <h1>Insights &amp; Innovations</h1>
          <div className="bl-hero-meta">
            <p>
              Exploring the frontier of web technology, digital strategy, and the
              creative evolution of the modern web.
            </p>
            <div className="bl-tabs" role="tablist" aria-label="Blog categories">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  role="tab"
                  aria-selected={activeCategory === category}
                  className={`bl-tab${activeCategory === category ? ' active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bl-articles">
          {featured ? (
            <Link
              className="bl-article bl-article--feature bl-article--clickable"
              to={`/blog/${featured.slug}`}
              aria-label={`Open article: ${featured.title}`}
            >
              <div className="bl-article-copy">
                <div className="bl-meta-line">
                  <span className="grad">{featured.featured ? 'Featured Post' : featured.category}</span>
                  <span className="dot" />
                  <span>{featured.readTime}</span>
                </div>
                <h2>{featured.title}</h2>
                <p>{featured.excerpt}</p>
                <div className="bl-author">
                  {featured.author.avatarSrc ? <img src={featured.author.avatarSrc} alt={featured.author.name} /> : null}
                  <div>
                    <strong>{featured.author.name}</strong>
                    <span>{new Date(featured.dateISO).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="bl-feature-image">
                <img src={featured.coverSrc} alt={featured.title} onError={handleBlogImageError} />
                <span>{featured.label}</span>
              </div>
            </Link>
          ) : null}

          {rest[0] ? (
            <Link
              className="bl-article bl-article--alt bl-article--clickable"
              to={`/blog/${rest[0].slug}`}
              aria-label={`Open article: ${rest[0].title}`}
            >
              <div className="bl-secondary-image">
                <img src={rest[0].coverSrc} alt={rest[0].title} onError={handleBlogImageError} />
                <span>{rest[0].label}</span>
              </div>
              <div className="bl-article-copy">
                <div className="bl-meta-line">
                  <span>{rest[0].category}</span>
                  <span className="dot" />
                  <span>{rest[0].readTime}</span>
                </div>
                <h2>{rest[0].title}</h2>
                <p>{rest[0].excerpt}</p>
                <span className="bl-read-btn">
                  Read Article
                  <img src={IMG_READ_ARROW} alt="" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : null}

          {rest[1] ? (
            <Link
              className="bl-article bl-article--feature bl-article--last bl-article--clickable"
              to={`/blog/${rest[1].slug}`}
              aria-label={`Open article: ${rest[1].title}`}
            >
              <div className="bl-article-copy">
                <div className="bl-meta-line">
                  <span>{rest[1].category}</span>
                  <span className="dot" />
                  <span>{rest[1].readTime}</span>
                </div>
                <h2>{rest[1].title}</h2>
                <p>{rest[1].excerpt}</p>
                <div className="bl-author">
                  {rest[1].author.avatarSrc ? <img src={rest[1].author.avatarSrc} alt={rest[1].author.name} /> : null}
                  <div>
                    <strong>{rest[1].author.name}</strong>
                    <span>{new Date(rest[1].dateISO).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="bl-last-image">
                <img src={rest[1].coverSrc} alt={rest[1].title} onError={handleBlogImageError} />
                <span>{rest[1].label}</span>
              </div>
            </Link>
          ) : null}

          {rest.length > 2 ? (
            <div className="bl-more-grid" aria-label="More blog posts">
              {rest.slice(2).map((post) => (
                <Link
                  key={post.slug}
                  className="bl-more-card bl-article--clickable"
                  to={`/blog/${post.slug}`}
                  aria-label={`Open article: ${post.title}`}
                >
                  <div className="bl-more-image">
                    <img src={post.coverSrc} alt={post.title} loading="lazy" decoding="async" onError={handleBlogImageError} />
                    <span>{post.label}</span>
                  </div>
                  <div className="bl-more-copy">
                    <div className="bl-meta-line">
                      <span>{post.category}</span>
                      <span className="dot" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        <section className="bl-social-posts" aria-labelledby="bl-posts-heading">
          <div className="bl-social-posts-inner">
            <h2 id="bl-posts-heading">Parma Journal</h2>
            <p>Follow Parma in Little Washington where we publish updates, insights, and health journals.</p>
          </div>
          <form
            className="bl-hero-subscribe-card"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Thank you for subscribing to Parma Journal updates.')
            }}
          >
            <div className="bl-subscribe-badge font-mono">Newsletter</div>
            <p className="bl-subscribe-title">Receive Parma Journal updates</p>
            <div className="bl-subscribe-input-row" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="bl-subscribe-input"
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ccc', flex: 1 }}
              />
              <button type="submit" className="bl-subscribe-btn" style={{ padding: '12px 24px', backgroundColor: '#CA6641', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                Subscribe
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer onContact={onCareers} />
    </div>
  )
}


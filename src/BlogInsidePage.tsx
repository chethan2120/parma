import { useEffect, useRef } from 'react'
import type { SyntheticEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './BlogInsidePage.css'
import { usePageMotion } from './hooks/usePageMotion'
import { WebnxtHeaderLogo } from './components/WebnxtHeaderLogo'
import { sendLeadToSupportEmail } from './utils/leadEmail'
import { BLOG_POSTS, getBlogPost } from './data/blogs'
import { Footer } from './components/Footer/Footer'

const BLOG_FALLBACK_COVER = 'https://picsum.photos/seed/webnxt-blog-fallback/1600/900'

interface Props {
  onMenuOpen: () => void
  onHome: () => void
  onCareers: () => void
}

export default function BlogInsidePage({ onMenuOpen, onHome, onCareers }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { slug } = useParams()
  const post = getBlogPost(slug)
  const progressBarRef = useRef<HTMLDivElement | null>(null)

  const related = BLOG_POSTS.filter((p) => p.slug !== post?.slug).slice(0, 3)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // The progress bar is written straight to the DOM inside a rAF instead of
  // going through state: a setState per scroll event re-rendered the whole
  // article on every frame of a fast scroll.
  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const bar = progressBarRef.current
      if (!bar) return
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      bar.style.transform = `scaleX(${total > 0 ? Math.min(1, window.scrollY / total) : 0})`
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  usePageMotion(rootRef)

  useEffect(() => {
    if (!slug) return
    if (!post) navigate('/blogs', { replace: true })
  }, [slug, post, navigate])

  const handleBlogImageError = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.src.endsWith(BLOG_FALLBACK_COVER)) return
    img.src = BLOG_FALLBACK_COVER
  }

  if (!post) return null

  return (
    <div className="bi-root page-motion-shell" ref={rootRef}>

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header className="bi-header">
        <WebnxtHeaderLogo pageClass="bi-logo" onHome={onHome} />
        <div className="header-actions">
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

      {/* ── Reading progress ────────────────────────────────────────────────── */}
      <div className="bi-progress" aria-hidden="true">
        <div className="bi-progress-bar" ref={progressBarRef} />
      </div>

      <main className="bi-main">

        {/* ── Split hero ──────────────────────────────────────────────────── */}
        <section className="bi-hero">
          <div className="bi-hero-left">
            <nav className="bi-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/blogs">Blog</Link>
              <span aria-hidden="true">/</span>
              <span className="bi-crumb-active">{post.label}</span>
            </nav>

            <span className="bi-category-chip">{post.label}</span>

            <h1>{post.title}</h1>

            <p className="bi-subhead">{post.excerpt}</p>

            <div className="bi-author-row">
              {post.author.avatarSrc
                ? <img className="bi-avatar" src={post.author.avatarSrc} alt={post.author.name} />
                : (
                  <div className="bi-avatar-init" aria-hidden="true">
                    {post.author.name.charAt(0)}
                  </div>
                )
              }
              <div className="bi-author-info">
                <strong>{post.author.name}</strong>
                {post.author.role && <span className="bi-author-role">{post.author.role}</span>}
                <div className="bi-author-meta">
                  <time dateTime={post.dateISO}>
                    {new Date(post.dateISO).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </time>
                  <span className="bi-dot" aria-hidden="true" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            <div className="bi-hero-tags" aria-label="Tags">
              {post.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>

          <div className="bi-hero-right" aria-hidden="true">
            <div className="bi-hero-img-shell">
              <img
                src={post.coverSrc}
                alt={post.title}
                loading="eager"
                decoding="async"
                onError={handleBlogImageError}
              />
            </div>
          </div>
        </section>

        {/* ── Two-column: article + sidebar ───────────────────────────────── */}
        <div className="bi-body-grid">

          {/* Article */}
          <article className="bi-article">
            {post.blocks.map((b, idx) => {
              if (b.type === 'intro') return (
                <p key={idx} className="bi-intro">{b.text}</p>
              )
              if (b.type === 'h2') return (
                <h2 key={idx}>{b.text}</h2>
              )
              if (b.type === 'p') return (
                <p key={idx}>{b.text}</p>
              )
              if (b.type === 'quote') return (
                <blockquote key={idx}>
                  <span className="bi-qmark" aria-hidden="true">"</span>
                  <span className="bi-qtext">{b.text}</span>
                </blockquote>
              )
              if (b.type === 'ul') return (
                <ul key={idx}>
                  {b.items.map((it) => (
                    <li key={it}>
                      <span className="bi-li-marker" aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              )
              if (b.type === 'image') return (
                <figure key={idx}>
                  <img src={b.src} alt={b.alt} loading="lazy" decoding="async" onError={handleBlogImageError} />
                  {b.caption && <figcaption>{b.caption}</figcaption>}
                </figure>
              )
              return null
            })}

            <div className="bi-article-tags">
              {post.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="bi-sidebar">

            {/* Related stories */}
            <div className="bi-sidebar-card">
              <div className="bi-sidebar-heading">
                <h3>Related Stories</h3>
                <div className="bi-heading-rule" />
              </div>
              <div className="bi-related-stack">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    className="bi-related-item"
                    to={`/blog/${p.slug}`}
                    aria-label={`Read: ${p.title}`}
                  >
                    <div className="bi-related-thumb">
                      <img src={p.coverSrc} alt={p.title} loading="lazy" decoding="async" onError={handleBlogImageError} />
                    </div>
                    <div className="bi-related-body">
                      <span className="bi-label">{p.category}</span>
                      <h4>{p.title}</h4>
                      <div className="bi-related-meta">
                        <time dateTime={p.dateISO}>
                          {new Date(p.dateISO).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </time>
                        <span className="bi-dot" aria-hidden="true" />
                        <span>{p.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bi-newsletter-card">
              <div className="bi-newsletter-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Stay ahead of the curve</h3>
              <p>Get curated insights about the future of the web, delivered weekly. No spam, just pure tech.</p>
              <form
                className="bi-nl-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  sendLeadToSupportEmail(e.currentTarget, { source: 'Blog Inside Page', subject: 'Newsletter Subscription (Blog Inside)' })
                }}
              >
                <input name="Email" type="email" placeholder="Your email address" aria-label="Your email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>

          </aside>
        </div>
      </main>

      <Footer onContact={onCareers} />
    </div>
  )
}

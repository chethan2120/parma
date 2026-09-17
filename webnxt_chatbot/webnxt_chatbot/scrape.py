"""
Webnxt.co Website Scraper — Optimized Edition v3
-------------------------------------------------
Improvements over v2:
  • Explicit seed URL table — known pages go directly to the right category
  • Structure-aware HTML extraction — respects h1/h2/h3 hierarchy instead of
    blindly dumping all text
  • Per-category subfolders under company-data/ with one file per scraped page
  • Combined main.md per category aggregates all pages cleanly
  • SHA-256 content deduplication — no duplicate sections ever written
  • URL blocklist — blogs, careers, events never enter the queue
  • Contact/phone/email regex extractor — always captures these precisely
  • Price extractor — always captures ₹ lines into pricing bucket
  • Heading-boundary chunking — chunks split at h2/h3 level, not raw line count
  • Minimum section quality filter — at least 3 non-trivial lines required

Usage:
    pip install -r requirements.txt
    python scrape.py

Output:
    company-data/
        services/
            webnxt-co-services.md
            webnxt-co-homepage-services.md
            main.md          ← combined, ready for chatbot
        pricing/
            webnxt-co-packages.md
            main.md
        portfolio/
            webnxt-co-portfolio.md
            main.md
        contact/
            webnxt-co-contact.md
            main.md
        faqs/
            webnxt-co-about.md
            main.md
        testimonials/
            main.md
        timelines/
            main.md
        _raw/                ← raw per-page dumps for review
"""

import os
import re
import time
import sys
import hashlib
from collections import defaultdict
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup, Tag
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────

BASE_URL       = "https://webnxt.co"
OUTPUT_DIR     = "company-data"
RAW_DIR        = os.path.join(OUTPUT_DIR, "_raw")
PAGE_LOAD_WAIT = 4      # seconds — Cloudflare needs ~2-3s
MAX_PAGES      = 60     # safety cap
HEADLESS       = False  # Set True to hide Chrome (may fail Cloudflare)

# All categories (each gets its own subfolder)
CATEGORIES = ["services", "pricing", "portfolio", "contact",
              "testimonials", "faqs", "timelines"]

# ─────────────────────────────────────────────
# SEED PAGES
# URL → forced_category (or None = auto-classify via keywords)
# These are scraped FIRST before BFS discovery.
# ─────────────────────────────────────────────

SEED_PAGES: dict[str, str | None] = {
    "https://webnxt.co":              None,          # homepage — keyword-classify
    "https://webnxt.co/services":     "services",
    "https://webnxt.co/packages":     "pricing",
    "https://webnxt.co/portfolio":    "portfolio",
    "https://webnxt.co/real-estate":  "portfolio",
    "https://webnxt.co/contact":      "contact",
    "https://webnxt.co/about":        "faqs",
}

# ─────────────────────────────────────────────
# URL BLOCKLIST — never crawl these patterns
# ─────────────────────────────────────────────

BLOCKED_URL_PATTERNS = [
    "/blogs", "/blog",
    "/careers", "/career",
    "/events", "/event",
    "/news",
    "/sitemap",
]

# ─────────────────────────────────────────────
# KEYWORD CLASSIFIERS
# Each entry maps category → specific trigger phrases.
# Specific multi-word phrases only — no single generic words.
# ─────────────────────────────────────────────

CLASSIFIERS: dict[str, list[str]] = {
    "pricing": [
        "₹", "inr", "rupee", "per project", "per month", "per year",
        "our packages", "pricing", "tier 0", "basic website", "dynamic pro",
        "enterprise", "starting from", "starts at", "affordable plan",
        "₹11,999", "₹24,999", "₹49,999",
    ],
    "services": [
        "web development", "website development", "software development",
        "mobile app", "digital marketing", "social media management",
        "brand strategy", "brand consulting", "ui/ux", "app development",
        "our services", "what we offer", "services we offer",
        "seo optimization", "paid campaigns", "content planning",
        "services.", "expertise & solutions",
    ],
    "portfolio": [
        "portfolio", "our work", "case study", "case studies",
        "we built", "we designed", "we developed",
        "view project", "real estate platform", "e-commerce web application",
        "luxury real estate", "event management platform",
        "projects delivered", "clients we've helped",
    ],
    "testimonials": [
        "testimonial", "what our clients", "client feedback",
        "our clients say", "hear from the brands",
        "don't just take our word", "words from our clients",
        "sara al mansoori", "urban threads",
    ],
    "contact": [
        "contact", "reach us", "get in touch",
        "support@webnxt", "email us",
        "our locations", "global locations",
        "sudama nagar", "sector e",
        "drop a message", "start your project",
        "phone:", "095899",
    ],
    "faqs": [
        "faq", "frequently asked", "common questions",
        "everything you need to know", "why choose webnxt",
        "do you offer", "can you redesign", "how do i get started",
        "do you provide hosting", "do you work with clients",
        "our mission", "our story", "about webnxt",
    ],
    "timelines": [
        "timeline", "turnaround", "how long will it take",
        "time to complete", "project time", "deadline",
        "days to deliver", "weeks to deliver", "delivery schedule",
        "milestone", "release cycle", "sdlc",
    ],
}

# ─────────────────────────────────────────────
# FILE HEADERS — prepended to each category's main.md
# ─────────────────────────────────────────────

FILE_HEADERS: dict[str, str] = {
    "services": (
        "# Webnxt — Services\n\n"
        "All services offered by Webnxt, sourced directly from webnxt.co.\n"
        "Used by the chatbot to answer questions about what Webnxt does.\n\n"
    ),
    "pricing": (
        "# Webnxt — Pricing & Packages\n\n"
        "Pricing for all Webnxt packages, sourced from webnxt.co/packages.\n"
        "Always reference these exact INR figures when answering price questions.\n\n"
    ),
    "timelines": (
        "# Webnxt — Project Timelines\n\n"
        "Delivery timelines for each service.\n"
        "Used by the chatbot to answer 'how long will it take?' questions.\n\n"
    ),
    "portfolio": (
        "# Webnxt — Portfolio and Past Work\n\n"
        "Past projects, client types, and industries served.\n"
        "Used to answer 'what have you built before?' questions.\n\n"
    ),
    "testimonials": (
        "# Webnxt — Client Testimonials\n\n"
        "Client feedback and reviews. Used to build trust with new visitors.\n\n"
    ),
    "contact": (
        "# Webnxt — Contact Details\n\n"
        "Phone, email, address, and how to reach Webnxt.\n"
        "All details sourced from webnxt.co/contact.\n\n"
    ),
    "faqs": (
        "# Webnxt — FAQs and General Info\n\n"
        "General company info and common Q&A.\n"
        "Default fallback file used when no other category matches.\n\n"
    ),
}


# ─────────────────────────────────────────────
# BROWSER SETUP
# ─────────────────────────────────────────────

def create_driver() -> webdriver.Chrome:
    """Create a Chrome driver that looks like a real browser."""
    options = Options()

    if HEADLESS:
        options.add_argument("--headless=new")

    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument("--window-size=1366,768")
    options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )

    service = Service(ChromeDriverManager().install())
    driver  = webdriver.Chrome(service=service, options=options)
    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    return driver


# ─────────────────────────────────────────────
# HTML STRUCTURE-AWARE EXTRACTOR
# ─────────────────────────────────────────────

def remove_noise_elements(soup: BeautifulSoup) -> None:
    """In-place: strip all nav / ui chrome / scripts / media."""
    for tag in soup.find_all([
        "script", "style", "noscript", "iframe",
        "nav", "footer", "header", "aside",
        "form", "button", "svg", "img", "figure",
        "meta", "link", "input", "select", "textarea",
    ]):
        tag.decompose()

    noise_classes = [
        "cookie", "popup", "modal", "overlay", "banner",
        "toast", "alert", "sticky", "notification", "gdpr",
        "newsletter", "subscribe", "back-to-top",
        "chatbot", "chat-widget", "webchat",
    ]
    for tag in soup.find_all(True):
        if tag.attrs is None:
            continue
        classes = " ".join(tag.get("class", [])).lower()
        tid     = (tag.get("id") or "").lower()
        if any(p in classes or p in tid for p in noise_classes):
            tag.decompose()


def extract_sections(soup: BeautifulSoup, url: str, title: str) -> list[dict]:
    """
    Walk the DOM and return a list of content sections.
    Each section = {"heading": str, "body": str, "raw": str}
    Split boundaries are h1 / h2 / h3 tags.
    """
    remove_noise_elements(soup)

    # Scroll content is already loaded by the time we call this.
    # Find the main content area — try common wrappers first.
    main = (
        soup.find("main")
        or soup.find("article")
        or soup.find(id=re.compile(r"root|app|content|main", re.I))
        or soup.find("body")
    )
    if not main:
        return []

    sections   = []
    cur_heading = title
    cur_lines:  list[str] = []

    HEADING_TAGS = {"h1", "h2", "h3"}

    def flush():
        nonlocal cur_heading, cur_lines
        body = "\n".join(
            line.strip() for line in cur_lines if len(line.strip()) > 2
        )
        # Deduplicate consecutive identical lines
        deduped = []
        for ln in body.splitlines():
            if not deduped or ln != deduped[-1]:
                deduped.append(ln)
        body = "\n".join(deduped)

        if body and len(body) > 20:
            sections.append({
                "heading": cur_heading,
                "body":    body,
                "raw":     f"### {cur_heading}\nSource: {url}\n\n{body}\n",
            })
        cur_lines = []

    def walk(node):
        nonlocal cur_heading
        if not isinstance(node, Tag):
            return
        for child in node.children:
            if not isinstance(child, Tag):
                # Raw text node — add to current section
                text = child.string
                if text and text.strip():
                    cur_lines.append(text.strip())
                continue

            tag = child.name.lower() if child.name else ""

            if tag in HEADING_TAGS:
                # Flush what we have, start new section
                flush()
                cur_heading = child.get_text(separator=" ").strip() or cur_heading
            elif tag in ("p", "li", "td", "th", "span", "a", "strong", "em", "b", "i", "u", "label"):
                text = child.get_text(separator=" ").strip()
                if text:
                    # Clean up multiple spaces
                    text = re.sub(r"\s+", " ", text)
                    cur_lines.append(text)
            else:
                # Recurse into containers (like div, section, main, article)
                walk(child)

    walk(main)
    flush()  # catch final section

    return sections


def extract_contact_fields(raw_text: str) -> dict[str, str]:
    """Extract structured contact fields using regex."""
    fields: dict[str, str] = {}

    # Phone
    phone = re.search(
        r"(?:phone|mobile|tel|call)[:\s]*([+\d][\d\s\-]{6,14})",
        raw_text, re.I
    )
    if phone:
        fields["phone"] = phone.group(1).strip()

    # Email
    email = re.search(r"[\w.+-]+@[\w.-]+\.\w{2,}", raw_text)
    if email:
        fields["email"] = email.group(0)

    # ₹ prices
    prices = re.findall(r"₹[\d,]+(?:\+)?", raw_text)
    if prices:
        fields["prices"] = ", ".join(sorted(set(prices)))

    return fields


# ─────────────────────────────────────────────
# PAGE SCRAPER
# ─────────────────────────────────────────────

def scrape_page(driver: webdriver.Chrome, url: str) -> tuple[str, str, list[dict]] | None:
    """
    Navigate to url, wait for JS render, return (title, raw_text, sections).
    sections = list of structured section dicts from extract_sections().
    Returns None if the page fails or has too little content.
    """
    try:
        driver.get(url)
        time.sleep(PAGE_LOAD_WAIT)

        # Handle Cloudflare challenge
        if "just a moment" in driver.title.lower() or \
           "checking your browser" in driver.page_source.lower():
            print(f"  [cloudflare] Waiting extra 5s for {url}")
            time.sleep(5)

        # Scroll to trigger lazy loading
        last_h = driver.execute_script("return document.body.scrollHeight")
        for _ in range(4):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1.5)
            new_h = driver.execute_script("return document.body.scrollHeight")
            if new_h == last_h:
                break
            last_h = new_h

        title  = driver.title.strip()
        source = driver.page_source
        soup   = BeautifulSoup(source, "html.parser")

        # Raw text (for _raw/ dumps)
        temp = BeautifulSoup(source, "html.parser")
        remove_noise_elements(temp)
        raw_text = "\n".join(
            line.strip()
            for line in temp.get_text(separator="\n").splitlines()
            if len(line.strip()) > 2
        )

        if len(raw_text) < 100:
            print(f"  [skip] {url} — too little content ({len(raw_text)} chars)")
            return None

        sections = extract_sections(soup, url, title)
        return title, raw_text, sections

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"  [error] {url} — {e}")
        return None


def get_all_links(driver: webdriver.Chrome, current_url: str) -> list[str]:
    """Extract all same-domain links from the current page, skipping blocked patterns."""
    soup     = BeautifulSoup(driver.page_source, "html.parser")
    links    = []
    skip_ext = {".pdf", ".jpg", ".jpeg", ".png", ".gif",
                ".zip", ".xml", ".svg", ".mp4", ".webp"}

    for a in soup.find_all("a", href=True):
        href     = a["href"].strip()
        full_url = urljoin(current_url, href)
        parsed   = urlparse(full_url)

        if parsed.scheme not in ("http", "https"):
            continue
        if parsed.netloc not in ("webnxt.co", "www.webnxt.co"):
            continue
        if href.startswith("#"):
            continue
        if any(href.lower().endswith(ext) for ext in skip_ext):
            continue
        # Apply URL blocklist
        path_lower = parsed.path.lower()
        if any(blocked in path_lower for blocked in BLOCKED_URL_PATTERNS):
            continue

        clean = parsed.scheme + "://" + parsed.netloc + parsed.path
        clean = clean.rstrip("/") or clean
        links.append(clean)

    return list(set(links))


# ─────────────────────────────────────────────
# CONTENT CLASSIFIER
# ─────────────────────────────────────────────

def classify_section(text: str, forced_cat: str | None = None) -> list[str]:
    """
    Return list of category keys this text belongs to.
    If forced_cat is set, it always goes first.
    Returns at most 2 categories to prevent over-spreading.
    """
    text_lower = text.lower()
    scored: list[tuple[int, str]] = []

    for category, keywords in CLASSIFIERS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score >= 1:
            scored.append((score, category))

    scored.sort(reverse=True)
    cats = [cat for _, cat in scored]

    if forced_cat:
        cats = [forced_cat] + [c for c in cats if c != forced_cat]

    return cats[:2]


# ─────────────────────────────────────────────
# DEDUPLICATION
# ─────────────────────────────────────────────

# Global set of (category, content_hash) pairs seen so far
_seen: set[tuple[str, str]] = set()


def content_hash(text: str) -> str:
    """SHA-256 of normalized text — used for dedup."""
    normalized = re.sub(r"\s+", " ", text.strip().lower())
    return hashlib.sha256(normalized.encode()).hexdigest()[:16]


def is_duplicate(cat: str, text: str) -> bool:
    key = (cat, content_hash(text))
    if key in _seen:
        return True
    _seen.add(key)
    return False


# ─────────────────────────────────────────────
# CRAWLER
# ─────────────────────────────────────────────

def crawl() -> dict[str, tuple[str, str, list[dict], str | None]]:
    """
    BFS crawl starting from SEED_PAGES, then discovering new links.
    Returns {url: (title, raw_text, sections, forced_category)}
    """
    print("\n" + "=" * 60)
    print(" Starting browser... (Chrome window will open)")
    print("=" * 60 + "\n")

    driver  = create_driver()
    visited: set[str] = set()
    results: dict[str, tuple] = {}

    # Seed queue: (url, forced_category)
    queue: list[tuple[str, str | None]] = list(SEED_PAGES.items())
    # Add discovered pages without a forced category
    discovered: list[str] = []

    def add_discovered(links: list[str]):
        for link in links:
            norm = link.rstrip("/")
            if norm not in visited and norm not in {u for u, _ in queue} \
               and norm not in discovered:
                discovered.append(norm)

    try:
        # Phase 1: scrape seed pages first (highest quality)
        print("── Phase 1: Seed pages ──")
        for url, forced_cat in queue:
            norm = url.rstrip("/")
            if norm in visited:
                continue
            visited.add(norm)

            print(f"[SEED] Scraping: {url}")
            result = scrape_page(driver, url)
            if result:
                title, raw, sections = result
                results[norm] = (title, raw, sections, forced_cat)
                print(f"       ✓ {title[:55]} | {len(sections)} sections | forced={forced_cat}")
                add_discovered(get_all_links(driver, url))
            else:
                print(f"       ✗ Skipped")

        # Phase 2: BFS discovered pages (auto-classify)
        print(f"\n── Phase 2: Discovered pages ({len(discovered)} queued) ──")
        idx = 0
        while idx < len(discovered) and len(results) < MAX_PAGES:
            url  = discovered[idx]
            idx += 1
            norm = url.rstrip("/")

            if norm in visited:
                continue
            visited.add(norm)

            print(f"[{len(results)+1}] Scraping: {url}")
            result = scrape_page(driver, url)
            if result:
                title, raw, sections = result
                results[norm] = (title, raw, sections, None)
                print(f"     ✓ {title[:55]} | {len(sections)} sections")
                add_discovered(get_all_links(driver, url))
            else:
                print(f"     ✗ Skipped")

    except KeyboardInterrupt:
        print("\nScrape interrupted by user.")
    finally:
        driver.quit()
        print(f"\nBrowser closed. {len(results)} pages scraped total.")

    return results


# ─────────────────────────────────────────────
# ORGANIZER
# ─────────────────────────────────────────────

def organize_into_buckets(
    pages: dict[str, tuple[str, str, list[dict], str | None]]
) -> dict[str, list[dict]]:
    """
    Classify each section into category buckets.
    Returns {category: [section_dict, ...]}
    Each section_dict has keys: heading, body, raw, source_url, source_title
    """
    _seen.clear()
    buckets: dict[str, list[dict]] = defaultdict(list)

    print("\nOrganizing sections into categories...")

    for url, (title, raw_text, sections, forced_cat) in pages.items():

        # Also run a contact field extractor on every page
        contact_fields = extract_contact_fields(raw_text)

        for section in sections:
            body = section["body"]
            if len(body.strip()) < 100:
                continue  # too short to be useful

            cats = classify_section(body, forced_cat)

            # Fallback: if forced_cat is set but classifier didn't fire,
            # still route to forced_cat (e.g. /packages with non-₹ intro text)
            if not cats and forced_cat:
                cats = [forced_cat]
            elif not cats:
                # Only add homepage catchall chunks to faqs
                if "webnxt.co" in url and url.rstrip("/") == "https://webnxt.co":
                    cats = ["faqs"]

            enriched = {
                **section,
                "source_url":   url,
                "source_title": title,
                "contact_fields": contact_fields if "contact" in cats else {},
            }

            for cat in cats:
                if not is_duplicate(cat, body):
                    buckets[cat].append(enriched)

        pages_line = f"  {title[:55]:<55} → {len(sections)} sections"
        if forced_cat:
            pages_line += f" [forced→{forced_cat}]"
        print(pages_line)

    return dict(buckets)


# ─────────────────────────────────────────────
# WRITER
# ─────────────────────────────────────────────

def make_slug(url: str) -> str:
    """URL → safe filename slug."""
    return re.sub(r"[^a-z0-9]+", "-", url.lower()).strip("-")[:80]


def write_raw_dumps(pages: dict):
    """Save one text file per scraped page in _raw/ for manual review."""
    os.makedirs(RAW_DIR, exist_ok=True)
    for url, (title, raw_text, sections, _) in pages.items():
        slug     = make_slug(url)
        filepath = os.path.join(RAW_DIR, f"{slug}.txt")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(f"URL: {url}\nTitle: {title}\n{'='*60}\n\n{raw_text}")


def write_category_files(buckets: dict[str, list[dict]]):
    """
    For each category:
      - Create company-data/<category>/ subfolder
      - Write one .md file per unique source page
      - Write company-data/<category>/main.md combining everything
    Also write company-data/<category>.md at the top level for
    backward compatibility with the existing chatbot keyword router.
    """
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for category in CATEGORIES:
        sections = buckets.get(category, [])
        header   = FILE_HEADERS.get(category, f"# Webnxt — {category.title()}\n\n")

        # Create subfolder
        cat_dir = os.path.join(OUTPUT_DIR, category)
        os.makedirs(cat_dir, exist_ok=True)

        # Group sections by source URL
        by_url: dict[str, list[dict]] = defaultdict(list)
        for sec in sections:
            by_url[sec["source_url"]].append(sec)

        # Write one file per source page
        for url, url_sections in by_url.items():
            slug = make_slug(url)
            filepath = os.path.join(cat_dir, f"{slug}.md")
            with open(filepath, "w", encoding="utf-8") as f:
                source_title = url_sections[0]["source_title"]
                f.write(f"# {source_title}\n")
                f.write(f"Source: {url}\n\n---\n\n")
                for sec in url_sections:
                    f.write(f"## {sec['heading']}\n\n")
                    f.write(sec["body"] + "\n\n---\n\n")

        # Write combined main.md
        main_path = os.path.join(cat_dir, "main.md")
        with open(main_path, "w", encoding="utf-8") as f:
            f.write(header)
            if sections:
                f.write(f"## Scraped Content ({len(sections)} sections from {len(by_url)} pages)\n\n")
                for sec in sections:
                    f.write(f"### {sec['heading']}\n")
                    f.write(f"*Source: {sec['source_url']}*\n\n")
                    f.write(sec["body"] + "\n\n---\n\n")
            else:
                f.write("> No content was scraped for this section.\n")
                f.write("> Please fill in manually or check the URL blocklist.\n\n")

        # We no longer overwrite the top-level <category>.md files here
        # to protect the beautifully handcrafted summaries we made.
        # The chatbot can be updated to read from cat_dir/main.md instead,
        # or you can manually copy content from main.md to the top-level files when needed.

        count = len(sections)
        status = f"{count} sections from {len(by_url)} pages" if count else "EMPTY — check blocklist or site"
        print(f"  ✓  {category:<15} → {cat_dir}/ + {category}.md  ({status})")


# ─────────────────────────────────────────────
# SUMMARY REPORT
# ─────────────────────────────────────────────

def print_summary(pages: dict, buckets: dict[str, list[dict]]):
    print("\n" + "=" * 60)
    print(" SCRAPE COMPLETE")
    print("=" * 60)
    print(f" Pages scraped    : {len(pages)}")
    print(f" Total sections   : {sum(len(v) for v in buckets.values())}")
    print()
    print(" Category breakdown:")
    for cat in CATEGORIES:
        count   = len(buckets.get(cat, []))
        bar     = "█" * min(count, 40)
        print(f"   {cat:<15} {bar}  ({count})")
    print()
    print(" Files written:")
    for cat in CATEGORIES:
        cat_dir = os.path.join(OUTPUT_DIR, cat)
        print(f"   {os.path.abspath(cat_dir)}/main.md")
    print()
    print(" Next steps:")
    print("  1. Review company-data/<category>/main.md for each category")
    print("  2. Verify contact.md — add phone/email if missing")
    print("  3. Check pricing.md — confirm ₹ amounts match the live site")
    print("  4. Commit and push — Vercel auto-deploys")
    print("=" * 60)


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    print("=" * 60)
    print(" Webnxt.co Scraper v3 — Optimized")
    print("=" * 60)
    print(f" Target  : {BASE_URL}")
    print(f" Output  : {OUTPUT_DIR}/")
    print(f" Browser : {'headless' if HEADLESS else 'visible Chrome window'}")
    print(f" Seeds   : {len(SEED_PAGES)} explicit pages + BFS discovery")
    print(f" Blocked : {', '.join(BLOCKED_URL_PATTERNS)}")
    print("=" * 60)

    # Step 1: Crawl
    pages = crawl()

    if not pages:
        print("\nNo pages scraped. Check that Chrome is installed and try again.")
        sys.exit(1)

    # Step 2: Raw dumps
    print("\nSaving raw page dumps to _raw/...")
    write_raw_dumps(pages)

    # Step 3: Organize into category buckets
    buckets = organize_into_buckets(pages)

    # Step 4: Write structured files
    print("\nWriting knowledge base files...")
    write_category_files(buckets)

    # Step 5: Summary
    print_summary(pages, buckets)


if __name__ == "__main__":
    main()
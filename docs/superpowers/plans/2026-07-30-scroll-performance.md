# Scroll Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove scroll micro-stutter while preserving the website’s design, content, and animation intent.

**Architecture:** Replace the whole-page ScrollSmoother transform with one Lenis instance driven exclusively by the GSAP ticker. Keep ScrollTrigger synchronized to Lenis, restore native sticky behavior, then re-profile the existing animation hotspots and change only costs confirmed by measurements.

**Tech Stack:** React 19, TypeScript, Vite, GSAP 3, ScrollTrigger, Lenis.

## Global Constraints

- Do not redesign or change content.
- Do not change the visual appearance.
- Do not remove animations unless measurement proves it necessary.
- Use one global animation timing source.
- Do not combine Lenis `autoRaf: true` with manual `lenis.raf()`.
- Clean up tickers, listeners, triggers, and instances on unmount.

---

### Task 1: Single smooth-scroll timing source

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/hooks/useGsapSmoothScroll.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/PageCurtain.tsx`

**Interfaces:**
- Produces: `getActiveLenis()` for route resets and temporary scroll locking.

- [x] Install `lenis`.
- [x] Create one Lenis instance with `autoRaf: false`.
- [x] Register `lenis.on('scroll', ScrollTrigger.update)`.
- [x] Drive `lenis.raf(time * 1000)` from one `gsap.ticker` callback.
- [x] Set `gsap.ticker.lagSmoothing(0)`.
- [x] Remove the ticker callback and destroy Lenis during cleanup.
- [x] Replace ScrollSmoother pause/reset calls with Lenis stop/start/scrollTo calls.
- [x] Stop creating ScrollSmoother-specific sticky pins.

### Task 2: Verify lifecycle and expensive sections

**Files:**
- Inspect: `src/HomePage.tsx`
- Inspect: `src/hooks/usePageMotion.ts`
- Inspect: `src/components/DomeGallery.tsx`
- Inspect: `src/components/OurWorkCarousel.tsx`
- Inspect: `src/components/LazyVideo.tsx`

**Interfaces:**
- Consumes: the single Lenis/GSAP timing source from Task 1.

- [x] Measure ScrollTrigger count, ticker count, dropped frames, long tasks, and layout shifts.
- [x] Navigate away and back; confirm triggers return to the baseline instead of accumulating.
- [x] Confirm offscreen dome rotation and videos pause while scrolling/offscreen.
- [x] Change only remaining hotspots supported by before/after measurements.

### Task 3: Remove diagnostics and validate

**Files:**
- Delete: `src/utils/scrollDiagnostics.ts`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: production code without audit-only globals, timers, or listeners.

- [x] Remove temporary profiling instrumentation.
- [ ] Run `npm run lint` (the project still has 21 pre-existing lint errors; the new timing hook and entry point pass targeted lint).
- [x] Run `npm run build`.
- [x] Re-test desktop scrolling and native touch/reduced-motion fallbacks.
- [x] Confirm no Lenis, ticker, trigger, event-listener, or RAF duplication.

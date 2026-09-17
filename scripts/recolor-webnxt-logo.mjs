import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

/**
 * This script converts the provided logo screenshot into a header-friendly PNG:
 * - removes the purple background (chroma key)
 * - recolors the white wordmark to near-black
 * - outputs a transparent PNG with padding
 *
 * Usage:
 *   node scripts/recolor-webnxt-logo.mjs "<inputPng>" "<outputPng>"
 */

const input = process.argv[2]
const output = process.argv[3]

if (!input || !output) {
  console.error('Usage: node scripts/recolor-webnxt-logo.mjs "<inputPng>" "<outputPng>"')
  process.exit(1)
}

await fs.mkdir(path.dirname(output), { recursive: true })

const img = sharp(input).ensureAlpha()
const meta = await img.metadata()

if (!meta.width || !meta.height) {
  throw new Error('Could not read image dimensions.')
}

const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })

// Background in the provided asset is a dark purple gradient.
// Instead of a single sampled color, we chroma-key by hue/saturation.
function rgbToHsv(r, g, b) {
  const rr = r / 255
  const gg = g / 255
  const bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (d !== 0) {
    switch (max) {
      case rr:
        h = (gg - bb) / d + (gg < bb ? 6 : 0)
        break
      case gg:
        h = (bb - rr) / d + 2
        break
      default:
        h = (rr - gg) / d + 4
        break
    }
    h *= 60
  }
  return { h, s, v }
}

for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const a = data[i + 3]

  if (a === 0) continue

  const { h, s, v } = rgbToHsv(r, g, b)
  const avg = (r + g + b) / 3

  // Key out very dark backdrop (works well for dark screenshots/gradients).
  // Preserve the bright wordmark and its anti-alias edges.
  const isVeryDark = avg < 55

  // Additional purple-ish keying to catch mid-dark areas.
  const isPurpleHue = h >= 235 && h <= 345
  const isDark = v <= 0.42

  const isBg = isVeryDark || (isPurpleHue && isDark && s >= 0.08)
  if (isBg) {
    data[i + 3] = 0
    continue
  }

  // After background keying, force the remaining mark to near-black.
  // Keep alpha for clean anti-aliased edges.
  data[i] = 17
  data[i + 1] = 17
  data[i + 2] = 17
}

const out = sharp(data, { raw: info })
  .trim({ threshold: 8 })
  .extend({
    top: 28,
    bottom: 28,
    left: 34,
    right: 34,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })

await out.toFile(output)
console.log(`Wrote ${output}`)


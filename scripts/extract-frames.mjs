import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import ffmpegPath from 'ffmpeg-static'

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/extract-frames.mjs "<path-to-video>" [outDir]')
  process.exit(1)
}

const outDir = process.argv[3] || path.resolve(process.cwd(), 'tmp-video-frames')
fs.mkdirSync(outDir, { recursive: true })

if (!ffmpegPath) {
  console.error('ffmpeg-static did not provide a binary path.')
  process.exit(1)
}

// Extract a small set of representative frames for analysis.
// We pick frames by time so we can capture: start, mid transitions, end of sequence.
const timestamps = ['00:00:00.0', '00:00:01.0', '00:00:02.0', '00:00:03.0', '00:00:04.0', '00:00:05.0', '00:00:06.0']

let idx = 0
for (const ts of timestamps) {
  idx += 1
  const outFile = path.join(outDir, `frame-${String(idx).padStart(2, '0')}.png`)

  // -ss before -i for speed; -frames:v 1 for one frame
  // -vf scale keeps images readable while reducing size.
  const args = [
    '-hide_banner',
    '-loglevel', 'error',
    '-ss', ts,
    '-i', input,
    '-frames:v', '1',
    '-vf', 'scale=1280:-1',
    outFile,
  ]

  // eslint-disable-next-line no-await-in-loop
  await new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, args, { stdio: 'inherit' })
    p.on('error', reject)
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))))
  })
}

console.log(`Extracted ${timestamps.length} frames to ${outDir}`)


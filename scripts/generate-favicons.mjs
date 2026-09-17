import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const publicDirectory = path.join(projectRoot, 'public')
const sourcePath = path.join(publicDirectory, 'parma-official-crest.png')
const source = await readFile(sourcePath)

const pngTargets = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'favicon-48x48.png', size: 48 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'webnxt-icon-192.png', size: 192 },
  { file: 'webnxt-icon-512.png', size: 512 },
]

const rendered = []

for (const target of pngTargets) {
  const buffer = await sharp(source)
    .resize(target.size, target.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()

  await writeFile(path.join(publicDirectory, target.file), buffer)
  rendered.push({ file: target.file, size: target.size, buffer })
}

function buildIco(entries) {
  const headerSize = 6
  const directorySize = 16 * entries.length
  const header = Buffer.alloc(headerSize + directorySize)

  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // icon type
  header.writeUInt16LE(entries.length, 4)

  let offset = header.length
  let cursor = 6

  for (const entry of entries) {
    header.writeUInt8(entry.size >= 256 ? 0 : entry.size, cursor)
    header.writeUInt8(entry.size >= 256 ? 0 : entry.size, cursor + 1)
    header.writeUInt8(0, cursor + 2) // palette
    header.writeUInt8(0, cursor + 3) // reserved
    header.writeUInt16LE(1, cursor + 4) // color planes
    header.writeUInt16LE(32, cursor + 6) // bits per pixel
    header.writeUInt32LE(entry.buffer.length, cursor + 8)
    header.writeUInt32LE(offset, cursor + 12)
    offset += entry.buffer.length
    cursor += 16
  }

  return Buffer.concat([header, ...entries.map((entry) => entry.buffer)])
}

// Edge and classic crawlers expect a real multi-size ICO at /favicon.ico.
const icoEntries = rendered
  .filter((entry) => [16, 32, 48].includes(entry.size))
  .map(({ size, buffer }) => ({ size, buffer }))

await writeFile(path.join(publicDirectory, 'favicon.ico'), buildIco(icoEntries))

console.log(
  `Generated Webnxt favicon assets from public/favicon.svg (${icoEntries.map((e) => e.size).join('/')} ICO)`,
)

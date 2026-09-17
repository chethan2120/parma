import sharp from 'sharp'

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }
const CHARCOAL = [23, 32, 51]

const clampByte = (value) => Math.max(0, Math.min(255, Math.round(value)))

async function rawImage(input) {
  return sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
}

async function writeFittedWebp(data, info, output, width, height, paddingX = 42, paddingY = 28) {
  await sharp(data, { raw: info })
    .trim({ background: TRANSPARENT, threshold: 2 })
    .resize({
      width: width - paddingX * 2,
      height: height - paddingY * 2,
      fit: 'contain',
      background: TRANSPARENT,
    })
    .extend({
      left: paddingX,
      right: paddingX,
      top: paddingY,
      bottom: paddingY,
      background: TRANSPARENT,
    })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(output)
}

async function rebuildDarkMarkFromLightBackground(input, output, width, height, forceCharcoal = false) {
  const { data, info } = await rawImage(input)

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const distanceFromWhite = Math.max(255 - r, 255 - g, 255 - b)
    const alpha = clampByte((distanceFromWhite - 10) * 2.25)

    if (alpha <= 18) {
      data[i + 3] = 0
      continue
    }

    if (forceCharcoal) {
      data[i] = CHARCOAL[0]
      data[i + 1] = CHARCOAL[1]
      data[i + 2] = CHARCOAL[2]
    }
    data[i + 3] = alpha
  }

  await writeFittedWebp(data, info, output, width, height)
}

async function rebuildHugeWordmark() {
  const { data, info } = await rawImage('ourpartnerlogo/huge.jpg')
  const { width, height } = info

  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      if (r > 175 && g < 90 && b > 80) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4
      if (x < minX || x > maxX || y < minY || y > maxY) {
        data[i + 3] = 0
        continue
      }

      const alpha = clampByte(255 - Math.max(data[i], data[i + 2]))
      if (alpha <= 8) {
        data[i + 3] = 0
        continue
      }

      data[i] = CHARCOAL[0]
      data[i + 1] = CHARCOAL[1]
      data[i + 2] = CHARCOAL[2]
      data[i + 3] = alpha
    }
  }

  await writeFittedWebp(data, info, 'public/Logos__2/16.webp', 900, 357, 80, 50)
}

async function rebuildLitLogo() {
  const { data, info } = await rawImage('ourpartnerlogo/lit.jpg')

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const chroma = max - min
    const alpha = chroma >= 34
      ? clampByte((max - 45) * 4)
      : clampByte((max - 120) * 2)

    if (alpha <= 6) {
      data[i + 3] = 0
      continue
    }

    if (chroma < 34) {
      data[i] = CHARCOAL[0]
      data[i + 1] = CHARCOAL[1]
      data[i + 2] = CHARCOAL[2]
    }
    data[i + 3] = alpha
  }

  await writeFittedWebp(data, info, 'public/Logos__2/17.webp', 732, 900, 58, 58)
}

async function rebuildKotaLogo() {
  const { data, info } = await rawImage('ourpartnerlogo/kota.jpg')

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const min = Math.min(r, g, b)
    const chroma = Math.max(r, g, b) - min
    const whiteness = min - chroma * 1.6
    const alpha = clampByte((whiteness - 145) * 2.5)

    if (alpha <= 6) {
      data[i + 3] = 0
      continue
    }

    data[i] = CHARCOAL[0]
    data[i + 1] = CHARCOAL[1]
    data[i + 2] = CHARCOAL[2]
    data[i + 3] = alpha
  }

  await writeFittedWebp(data, info, 'public/Logos__2/21.webp', 900, 897, 82, 70)
}

async function rebuildRajvanshLogo() {
  const { data, info } = await rawImage('ourpartnerlogo/rajvansh.png')

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    const chroma = Math.max(r, g, b) - Math.min(r, g, b)

    if (a <= 5) {
      data[i + 3] = 0
      continue
    }

    if (chroma < 45) {
      data[i] = CHARCOAL[0]
      data[i + 1] = CHARCOAL[1]
      data[i + 2] = CHARCOAL[2]
      data[i + 3] = clampByte(a * 1.45)
    } else {
      data[i + 3] = clampByte(a * 1.2)
    }
  }

  await writeFittedWebp(data, info, 'public/Logos__2/30.webp', 900, 587, 64, 54)
}

async function rebuildHazarLogo() {
  const { data, info } = await rawImage('ourpartnerlogo/hazarlogo.webp')

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const i = (y * info.width + x) * 4
      const isFrame =
        y < 320 ||
        (y >= 810 && y <= 850) ||
        ((x < 110 || x > info.width - 110) && y >= 320 && y < 810)

      if (isFrame) {
        data[i + 3] = 0
        continue
      }

      const distanceFromWhite = Math.max(255 - data[i], 255 - data[i + 1], 255 - data[i + 2])
      const alpha = clampByte((distanceFromWhite - 6) * 2.25)
      data[i + 3] = alpha <= 10 ? 0 : alpha
    }
  }

  await writeFittedWebp(data, info, 'public/Logos__2/18.webp', 900, 533, 46, 32)
}

async function rebuildManasviCreationLogo() {
  const { data, info } = await rawImage('public/Webnxt Website Stock/Website Stock Footeges/Our works cards logos/Manasvi Creation.png')

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    const distanceFromWhite = Math.max(255 - data[i], 255 - data[i + 1], 255 - data[i + 2])
    const alpha = clampByte((distanceFromWhite - 8) * 2.1)
    data[i + 3] = alpha <= 12 ? 0 : alpha
  }

  await writeFittedWebp(data, info, 'public/Logos__2/manasvi-creation.webp', 900, 540, 50, 36)
}

await rebuildDarkMarkFromLightBackground(
  'ourpartnerlogo/saxena-tatke.png',
  'public/Logos__2/13.webp',
  900,
  502,
  true,
)
await rebuildHugeWordmark()
await rebuildLitLogo()
await rebuildKotaLogo()
await rebuildRajvanshLogo()
await rebuildHazarLogo()
await rebuildManasviCreationLogo()
await rebuildDarkMarkFromLightBackground(
  'ourpartnerlogo/sukriti-logo.jpg',
  'public/Logos__2/43.webp',
  900,
  402,
)

console.log('Regenerated partner logos: 13, 16, 17, 18, 21, 30, 43, Manasvi Creation')

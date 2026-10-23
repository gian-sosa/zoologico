import sharp from 'sharp'

export const MAX_PHOTO_BYTES = 300 * 1024
sharp.cache(false)
sharp.concurrency(1)

/** Decodifica el contenido real y genera un archivo nuevo sin metadatos del original. */
export async function sanitizeWebp(input) {
  if (!input.length || input.length > MAX_PHOTO_BYTES) throw new Error('Invalid input size')
  const options = { limitInputPixels: 40_000_000, failOn: 'warning', animated: false }
  const metadata = await sharp(input, options).metadata()
  if (metadata.format !== 'webp' || (metadata.pages ?? 1) > 1) throw new Error('Invalid image format')
  for (const quality of [78, 66, 54]) {
    // Por defecto Sharp convierte a sRGB y descarta EXIF, XMP, IPTC e ICC.
    const output = await sharp(input, options).rotate()
      .resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 4 }).toBuffer({ resolveWithObject: true })
    if (output.data.length <= MAX_PHOTO_BYTES) return output
  }
  throw new Error('Output exceeds size limit')
}

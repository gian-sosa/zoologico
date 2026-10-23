import { test } from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { MAX_PHOTO_BYTES, sanitizeWebp } from './photo-image.mjs'

test('Redimensiona WebP y elimina EXIF e ICC del archivo almacenado', async () => {
  const original = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: '#246734' } })
    .withMetadata().webp().toBuffer()
  const before = await sharp(original).metadata()
  assert.ok(before.exif)
  assert.ok(before.icc)
  const { data, info } = await sanitizeWebp(original)
  const after = await sharp(data).metadata()
  assert.equal(after.format, 'webp')
  assert.equal(info.width, 1280)
  assert.equal(info.height, 640)
  assert.ok(data.length <= MAX_PHOTO_BYTES)
  for (const key of ['exif', 'icc', 'iptc', 'xmp']) assert.equal(after[key], undefined)
})

test('No amplía imágenes pequeñas', async () => {
  const original = await sharp({ create: { width: 40, height: 20, channels: 4, background: '#24673480' } }).webp().toBuffer()
  const { info } = await sanitizeWebp(original)
  assert.equal(info.width, 40)
  assert.equal(info.height, 20)
})

test('Rechaza contenido falso y archivos fuera de tamaño', async () => {
  await assert.rejects(sanitizeWebp(Buffer.from('not an image')))
  await assert.rejects(sanitizeWebp(Buffer.alloc(0)))
  await assert.rejects(sanitizeWebp(Buffer.alloc(MAX_PHOTO_BYTES + 1)))
  const png = await sharp({ create: { width: 20, height: 20, channels: 3, background: '#fff' } }).png().toBuffer()
  await assert.rejects(sanitizeWebp(png), /Invalid image format/)
})

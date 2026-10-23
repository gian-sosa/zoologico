import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import { test } from 'node:test'
import sharp from 'sharp'
import handler from '../api/photos.mjs'
import { sanitizeWebp, MAX_PHOTO_BYTES } from '../server/photo-image.mjs'
import { fileToCompressedWebP } from '../src/features/community/image.ts'

const OWNER = '11111111-1111-4111-8111-111111111111'
const ADMIN = '22222222-2222-4222-8222-222222222222'
const PHOTO = '33333333-3333-4333-8333-333333333333'
const createWebp = () => sharp({ create: { width: 40, height: 30, channels: 3, background: '#166534' } }).webp().toBuffer()

// Todas las peticiones Supabase se simulan: no se crean cuentas ni fotos reales.
async function request({ method = 'POST', body = Buffer.alloc(0), contentType = 'image/webp', token = true, admin = false, anonymous = !admin, action = 'approve', confirmPending = true } = {}) {
  const fetchBefore = globalThis.fetch
  const envBefore = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY }
  const calls = []
  process.env.SUPABASE_URL = 'https://photos-test.invalid'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key-not-a-real-secret'
  globalThis.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url)
    const verb = options.method ?? 'GET'
    const data = typeof options.body === 'string' ? JSON.parse(options.body) : undefined
    calls.push({ path: url.pathname, method: verb, data })
    let result
    if (url.pathname === '/auth/v1/user') {
      result = { id: admin ? ADMIN : OWNER, aud: 'authenticated', role: 'authenticated', is_anonymous: anonymous }
    } else if (url.pathname === '/rest/v1/photo_admins') {
      result = admin ? [{ user_id: ADMIN }] : []
    } else if (url.pathname === '/rest/v1/visitor_photos') {
      if (verb === 'GET') result = [{ id: PHOTO, owner_id: OWNER, object_path: `${OWNER}/${PHOTO}.webp`, status: 'pending', deletion_requested: false }]
      else if (verb === 'POST') result = null
      else if (verb === 'PATCH') result = confirmPending ? [{ id: PHOTO }] : []
      else throw new Error(`Unexpected photo method ${verb}`)
    } else if (url.pathname.startsWith('/storage/v1/object/visitor-photos/')) {
      result = { Key: url.pathname }
    } else {
      throw new Error(`Unexpected external request ${url}`)
    }
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  const req = Readable.from(body.length ? [body] : [])
  req.method = method
  req.url = `/api/photos?id=${PHOTO}&action=${action}`
  req.headers = { 'content-type': contentType, ...(token ? { authorization: 'Bearer test-access-token' } : {}) }
  const res = {
    statusCode: 200,
    setHeader() {},
    status(code) { this.statusCode = code; return this },
    json(value) { this.body = value; return this },
  }
  try {
    await handler(req, res)
    return { status: res.statusCode, body: res.body, calls }
  } finally {
    globalThis.fetch = fetchBefore
    if (envBefore.url === undefined) delete process.env.SUPABASE_URL
    else process.env.SUPABASE_URL = envBefore.url
    if (envBefore.key === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY
    else process.env.SUPABASE_SERVICE_ROLE_KEY = envBefore.key
  }
}

test('originales: rechaza vídeos, PDF, SVG, GIF y más de 10 MB antes de decodificar', async () => {
  for (const type of ['video/mp4', 'application/pdf', 'image/svg+xml', 'image/gif']) {
    await assert.rejects(fileToCompressedWebP(new File(['archivo'], 'archivo', { type })), /JPG, PNG o WebP/)
  }
  await assert.rejects(fileToCompressedWebP(new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'foto.jpg', { type: 'image/jpeg' })), /10 MB/)
  await assert.rejects(fileToCompressedWebP(new File([], 'foto.jpg', { type: 'image/jpeg' })), /10 MB/)
})

test('originales: rechaza un SVG disfrazado de JPG', async () => {
  await assert.rejects(fileToCompressedWebP(new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], 'foto.jpg', { type: 'image/jpeg' })), /no es una imagen/)
})

test('originales: acepta exactamente 10 MB y comprime antes de enviar (canvas simulado)', async () => {
  const bitmapBefore = globalThis.createImageBitmap
  const documentBefore = globalThis.document
  let closed = false
  globalThis.createImageBitmap = async () => ({ width: 4000, height: 3000, close() { closed = true } })
  globalThis.document = { createElement: () => ({
    getContext: () => ({ drawImage() {} }),
    toBlob: (done) => done(new Blob(['webp procesado'], { type: 'image/webp' })),
  }) }
  try {
    const bytes = new Uint8Array(10 * 1024 * 1024)
    bytes.set([0xff, 0xd8, 0xff])
    const blob = await fileToCompressedWebP(new File([bytes], 'foto.jpg', { type: 'image/jpeg' }))
    assert.equal(blob.type, 'image/webp')
    assert.ok(blob.size <= MAX_PHOTO_BYTES)
    assert.ok(closed)
  } finally {
    if (bitmapBefore === undefined) delete globalThis.createImageBitmap
    else globalThis.createImageBitmap = bitmapBefore
    if (documentBefore === undefined) delete globalThis.document
    else globalThis.document = documentBefore
  }
})

test('servidor: decodifica y recodifica WebP real sin EXIF ni GPS', async () => {
  const original = await sharp(await createWebp()).withMetadata({ exif: { IFD0: { Artist: 'Prueba local' } } }).webp().toBuffer()
  assert.ok((await sharp(original).metadata()).exif)
  const output = await sanitizeWebp(original)
  const metadata = await sharp(output.data).metadata()
  assert.equal(metadata.format, 'webp')
  assert.equal(metadata.width, 40)
  assert.equal(metadata.height, 30)
  assert.equal(metadata.exif, undefined)
  assert.equal(metadata.xmp, undefined)
  assert.equal(metadata.icc, undefined)
  assert.ok(output.data.length <= MAX_PHOTO_BYTES)
})

test('servidor: rechaza archivos falsos, PNG sin convertir y cargas excesivas', async () => {
  await assert.rejects(sanitizeWebp(Buffer.from('<svg/>')))
  const png = await sharp({ create: { width: 1, height: 1, channels: 3, background: 'white' } }).png().toBuffer()
  await assert.rejects(sanitizeWebp(png), /Invalid image format/)
  await assert.rejects(sanitizeWebp(Buffer.alloc(MAX_PHOTO_BYTES + 1)), /Invalid input size/)
})

test('API: exige sesión y rechaza tipos no permitidos o WebP falsificado', async () => {
  assert.equal((await request({ token: false })).status, 401)
  assert.equal((await request({ contentType: 'application/pdf' })).status, 415)
  const fake = await request({ body: Buffer.from('no es una imagen') })
  assert.equal(fake.status, 400)
  assert.ok(!fake.calls.some(call => call.method === 'POST'))
  assert.equal((await request({ body: Buffer.alloc(MAX_PHOTO_BYTES + 1) })).status, 413)
})

test('API: la subida anónima reserva como uploading y termina en pending, nunca published', async () => {
  const result = await request({ body: await createWebp() })
  assert.equal(result.status, 201)
  const reserve = result.calls.find(call => call.path === '/rest/v1/visitor_photos' && call.method === 'POST')
  assert.equal(reserve.data.owner_id, OWNER)
  assert.equal(reserve.data.status, 'uploading')
  const update = result.calls.find(call => call.method === 'PATCH')
  assert.equal(update.data.status, 'pending')
  assert.ok(!result.calls.some(call => call.data?.status === 'published'))
  assert.equal((await request({ body: await createWebp(), confirmPending: false })).status, 409)
})

test('API: visitante no puede aprobar aunque tenga sesión', async () => {
  const result = await request({ method: 'PATCH' })
  assert.equal(result.status, 403)
  assert.ok(!result.calls.some(call => call.method === 'PATCH'))
})

test('API: una sesión anónima no modera ni siquiera con una membresía mal asignada', async () => {
  assert.equal((await request({ method: 'PATCH', admin: true, anonymous: true })).status, 403)
})

test('API: solo administrador autenticado aprueba y deja autor y fecha de revisión', async () => {
  const result = await request({ method: 'PATCH', admin: true })
  assert.equal(result.status, 200)
  const update = result.calls.find(call => call.method === 'PATCH')
  assert.equal(update.data.status, 'published')
  assert.equal(update.data.reviewed_by, ADMIN)
  assert.ok(Number.isFinite(Date.parse(update.data.reviewed_at)))
  assert.equal((await request({ method: 'PATCH', admin: true, action: 'constructor' })).status, 400)
})

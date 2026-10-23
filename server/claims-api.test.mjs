import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import { createHash, randomUUID } from 'node:crypto'
import handler from '../api/claims.mjs'
import { emptyClaim, validateClaim } from '../shared/claims.mjs'

const env = {
  SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-private-key',
  CLAIMS_PROVIDER_NAME: 'Proveedor de prueba', CLAIMS_PROVIDER_RUC: '20123456789',
  CLAIMS_PROVIDER_ADDRESS: 'Dirección de prueba, Ayacucho', CLAIMS_PRIVACY_EMAIL: 'privacy@example.com',
  CLAIMS_PRIVACY_NOTICE: 'Aviso de prueba', RESEND_API_KEY: 'test-resend-key', CLAIMS_EMAIL_FROM: 'test@example.com',
}
const details = validateClaim({
  ...emptyClaim(), name: 'María Torres', document_number: '12345678', address: 'Dirección de prueba 123',
  email: 'maria@example.com', item_description: 'Servicio del zoológico', detail: 'Detalle <script>alert(1)</script>',
  request: 'Solicito una respuesta por escrito.', conformity: true,
}).value

async function withEnv(callback, override = {}) {
  const previous = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]))
  Object.assign(process.env, env, override)
  try { await callback() }
  finally { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value } }
}

async function request(method, payload) {
  const req = Readable.from(payload ? [Buffer.from(JSON.stringify(payload))] : [])
  req.method = method
  req.headers = { 'content-type': 'application/json' }
  const res = { statusCode: 200, body: null, setHeader() {}, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this } }
  await handler(req, res)
  return res
}

test('GET nunca revela claves privadas; recepción sin RUC configurado falla sin crear hoja', async () => {
  await withEnv(async () => {
    const result = await request('GET')
    assert.equal(result.body.ready, true)
    assert.ok(!JSON.stringify(result.body).includes('test-private-key'))
    assert.ok(!JSON.stringify(result.body).includes('test-resend-key'))
  })
  await withEnv(async () => {
    const result = await request('POST', { details, submission_key: randomUUID() })
    assert.equal(result.statusCode, 503)
  }, { CLAIMS_PROVIDER_RUC: '' })
})

test('El fallo de correo no transforma una hoja ya registrada en un error', async () => {
  await withEnv(async () => {
    const original = globalThis.fetch
    globalThis.fetch = async (url) => {
      if (String(url).startsWith('https://api.resend.com')) return new Response('{}', { status: 503 })
      return new Response(JSON.stringify({ id: randomUUID(), code: 'LR-1', created_at: new Date().toISOString(), provider: { name: 'Proveedor', ruc: '20123456789', address: 'Dirección' }, details, receipt_email_status: 'pending', provider_actions: '' }), { status: 201, headers: { 'Content-Type': 'application/json' } })
    }
    try {
      const result = await request('POST', { details, submission_key: randomUUID() })
      assert.equal(result.statusCode, 201)
      assert.equal(result.body.code, 'LR-1')
      assert.equal(result.body.receipt_email_status, 'pending')
    } finally { globalThis.fetch = original }
  })
})

test('El reintento devuelve la misma hoja y el correo escapa contenido HTML', async () => {
  await withEnv(async () => {
    const original = globalThis.fetch
    let mail
    const stored = { id: randomUUID(), code: 'LR-2', created_at: new Date().toISOString(), provider: { name: 'Proveedor', ruc: '20123456789', address: 'Dirección' }, details, receipt_email_status: 'pending', provider_actions: '', payload_hash: createHash('sha256').update(JSON.stringify(details)).digest('hex') }
    globalThis.fetch = async (url, options) => {
      if (String(url).startsWith('https://api.resend.com')) {
        mail = JSON.parse(options.body)
        return new Response(JSON.stringify({ id: 'message-id' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      if (options?.method === 'POST') return new Response(JSON.stringify({ code: '23505' }), { status: 409, headers: { 'Content-Type': 'application/json' } })
      if (options?.method === 'PATCH') return new Response(null, { status: 204 })
      return new Response(JSON.stringify(stored), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    try {
      const result = await request('POST', { details, submission_key: randomUUID() })
      assert.equal(result.statusCode, 201)
      assert.equal(result.body.code, 'LR-2')
      assert.equal(result.body.receipt_email_status, 'sent')
      assert.ok(mail.html.includes('&lt;script&gt;'))
      assert.ok(!mail.html.includes('<script>'))
      const changed = await request('POST', { details: { ...details, request: 'Pedido modificado después del envío.' }, submission_key: randomUUID() })
      assert.equal(changed.statusCode, 409)
    } finally { globalThis.fetch = original }
  })
})

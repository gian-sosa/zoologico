import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { validateClaim, claimEmail } from '../shared/claims.mjs'
import { sendClaimReceipt } from '../server/claim-mail.mjs'

export const config = { api: { bodyParser: false } }

function settings() {
  const provider = {
    name: process.env.CLAIMS_PROVIDER_NAME?.trim() ?? '', ruc: process.env.CLAIMS_PROVIDER_RUC?.trim() ?? '',
    address: process.env.CLAIMS_PROVIDER_ADDRESS?.trim() ?? '', privacyContact: process.env.CLAIMS_PRIVACY_EMAIL?.trim() ?? '',
    privacyNotice: process.env.CLAIMS_PRIVACY_NOTICE?.trim() ?? '',
  }
  const ready = Boolean(provider.name && /^\d{11}$/.test(provider.ruc) && provider.address && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(provider.privacyContact) && provider.privacyNotice
    && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.RESEND_API_KEY && process.env.CLAIMS_EMAIL_FROM)
  return { provider, ready }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const fail = (status, error, errors) => res.status(status).json({ error, errors })
  const setup = settings()
  if (req.method === 'GET') return res.status(200).json(setup)
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return fail(405, 'Método no permitido.') }
  if (!setup.ready) return fail(503, 'El libro virtual aún no está habilitado. Contacta al establecimiento para presentar tu reclamación por otro medio.')
  if (!req.headers['content-type']?.startsWith('application/json')) return fail(415, 'Formato de envío inválido.')
  try {
    const chunks = []
    let bytes = 0
    for await (const chunk of req) {
      bytes += chunk.length
      if (bytes > 64 * 1024) return fail(413, 'La presentación supera el tamaño permitido.')
      chunks.push(chunk)
    }
    let input
    try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return fail(400, 'No se pudo leer la presentación.') }
    if (!input || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submission_key)) return fail(400, 'Identificador de envío inválido.')
    const { value, errors } = validateClaim(input.details)
    if (Object.keys(errors).length) return fail(400, 'Revisa los campos de la hoja.', errors)
    const payloadHash = createHash('sha256').update(JSON.stringify(value)).digest('hex')
    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await db.from('consumer_claims').insert({
      submission_key: input.submission_key, payload_hash: payloadHash, details: value, provider: setup.provider,
      receipt_email_status: claimEmail(value) ? 'pending' : 'not_requested',
    }).select('*').single()
    let claim = data
    if (error?.code === '23505') {
      const { data: existing, error: lookupError } = await db.from('consumer_claims').select('*').eq('submission_key', input.submission_key).single()
      if (lookupError) throw lookupError
      if (existing.payload_hash !== payloadHash) return fail(409, 'El envío anterior tiene otros datos. Conserva esta página y contacta al establecimiento para verificar su registro antes de intentar otra presentación.')
      claim = existing
    } else if (error) throw error
    const emailStatus = await sendClaimReceipt(db, claim)
    return res.status(201).json({
      code: claim.code, created_at: claim.created_at, provider: claim.provider, details: claim.details,
      receipt_email_status: emailStatus, provider_actions: claim.provider_actions,
    })
  } catch (error) {
    console.error('Claim registration failed', error?.code ?? 'unknown')
    return fail(500, 'No se pudo confirmar el registro. Reintenta sin modificar los datos para evitar duplicados.')
  }
}

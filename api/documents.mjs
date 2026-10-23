import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'

export const config = { api: { bodyParser: false } }
const MAX_BYTES = 3 * 1024 * 1024
const BUCKET = 'request-documents'
const TYPES = ['Solicitud', 'Oficio', 'Carta', 'Informe', 'Otro documento']

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const fail = (status, error) => res.status(status).json({ error })
  if (!['POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'POST, DELETE')
    return fail(405, 'Método no permitido.')
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return fail(503, 'Mesa de Partes aún no está configurada.')
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (!token) return fail(401, 'Necesitas una sesión válida.')
  const { data: { user }, error: authError } = await db.auth.getUser(token)
  if (authError || !user) return fail(401, 'La sesión expiró. Recarga la página.')
  try {
    if (req.method === 'DELETE') {
      const id = new URL(req.url, 'https://local.invalid').searchParams.get('id')
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return fail(400, 'Identificador inválido.')
      const { data: admin, error: adminError } = await db.from('photo_admins').select('user_id').eq('user_id', user.id).maybeSingle()
      if (adminError) throw adminError
      if (!admin) return fail(403, 'Solo el personal autorizado puede eliminar documentos.')
      const { data: document, error } = await db.from('discount_requests').select('attachment_path').eq('id', id).maybeSingle()
      if (error) throw error
      if (!document) return fail(404, 'El documento ya no existe.')
      if (document.attachment_path) {
        const { error: removeError } = await db.storage.from(BUCKET).remove([document.attachment_path])
        if (removeError) throw removeError
      }
      const { error: deleteError } = await db.from('discount_requests').delete().eq('id', id)
      if (deleteError) throw deleteError
      return res.status(200).json({ id })
    }
    const contentType = req.headers['content-type'] ?? ''
    if (!contentType.startsWith('multipart/form-data;')) return fail(415, 'Formato de envío inválido.')
    let size = 0
    const chunks = []
    for await (const chunk of req) {
      size += chunk.length
      if (size > MAX_BYTES + 64 * 1024) return fail(413, 'El adjunto supera los 3 MB.')
      chunks.push(chunk)
    }
    let form
    let details
    try {
      form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': contentType } }).formData()
      details = JSON.parse(form.get('details'))
      if (!details || typeof details !== 'object' || Array.isArray(details)) throw new Error('Invalid details')
    } catch { return fail(400, 'No se pudo leer el formulario.') }
    const limits = { name: [2, 150], institution: [0, 250], email: [3, 254], phone: [0, 40], document_number: [0, 80], subject: [5, 200], message: [20, 4000] }
    const values = {}
    for (const [key, [min, max]] of Object.entries(limits)) {
      if (typeof details[key] !== 'string') return fail(400, 'Faltan datos del documento.')
      const value = details[key].trim()
      if (value.length < min || value.length > max || value.includes('\0')) return fail(400, 'Revisa la longitud y el contenido de los campos.')
      values[key] = value
    }
    if (!TYPES.includes(details.document_type) || details.consent !== true || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return fail(400, 'Revisa el tipo, el correo y la autorización de tratamiento de datos.')
    const file = form.get('attachment')
    let bytes
    if (file !== null) {
      if (typeof file === 'string' || file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf') || file.size < 1 || file.size > MAX_BYTES) return fail(400, 'Adjunta un PDF válido de hasta 3 MB.')
      bytes = Buffer.from(await file.arrayBuffer())
      // Es solo validación de formato, no un análisis antivirus ni una garantía de seguridad.
      if (bytes.subarray(0, 5).toString() !== '%PDF-' || !bytes.subarray(-2048).includes(Buffer.from('%%EOF'))) return fail(400, 'El archivo no tiene un formato PDF reconocible.')
    }
    const id = randomUUID()
    const path = bytes ? `${user.id}/${id}.pdf` : null
    // Reservar antes de Storage aplica cuotas y deja rastro para recuperar fallos parciales.
    const { error: insertError } = await db.from('discount_requests').insert({
      ...values, id, owner_id: user.id, document_type: details.document_type,
      attachment_path: path, submission_status: bytes ? 'uploading' : 'received', consent_at: new Date().toISOString(),
    })
    if (insertError?.code === 'P0001') return fail(429, 'Alcanzaste el límite de envíos diarios. Inténtalo más tarde.')
    if (insertError) throw insertError
    if (bytes) {
      const { error: uploadError } = await db.storage.from(BUCKET).upload(path, bytes, { contentType: 'application/pdf', upsert: false, cacheControl: '0' })
      if (uploadError) throw uploadError
      const { error: readyError } = await db.from('discount_requests').update({ submission_status: 'received' }).eq('id', id)
      if (readyError) throw readyError
    }
    return res.status(201).json({ id })
  } catch (error) {
    console.error('Document operation failed', error?.code ?? 'unknown')
    return fail(500, 'No se pudo completar la operación. Inténtalo de nuevo.')
  }
}

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import { MAX_PHOTO_BYTES, sanitizeWebp } from '../server/photo-image.mjs'

const BUCKET = 'visitor-photos'
const MAX_BYTES = MAX_PHOTO_BYTES
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const config = { api: { bodyParser: false } }

/** Node serverless (Vercel). La clave service_role nunca llega al navegador. */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const fail = (status, message) => res.status(status).json({ error: message })
  if (!['POST', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', 'POST, PATCH')
    return fail(405, 'Método no permitido.')
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return fail(503, 'El almacenamiento de fotos aún no está configurado.')
  }
  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (!token) return fail(401, 'Necesitas una sesión para esta acción.')
  const { data: { user }, error: authError } = await db.auth.getUser(token)
  if (authError || !user) return fail(401, 'La sesión expiró. Recarga la página.')

  try {
    if (req.method === 'PATCH') {
      const params = new URL(req.url, 'https://local.invalid').searchParams
      const id = params.get('id')
      const action = params.get('action')
      if (!id || !UUID.test(id)) return fail(400, 'Identificador inválido.')
      const { data: photo, error } = await db.from('visitor_photos').select('id,owner_id,object_path,status,deletion_requested').eq('id', id).maybeSingle()
      if (error) throw error
      if (!photo) return fail(404, 'La foto ya no existe.')
      const { data: admin, error: adminError } = await db.from('photo_admins').select('user_id').eq('user_id', user.id).maybeSingle()
      if (adminError) throw adminError
      if (action === 'request-delete') {
        if (photo.owner_id !== user.id) return fail(403, 'Solo el propietario puede solicitar la eliminación.')
        if (!['pending', 'published', 'rejected'].includes(photo.status)) return fail(409, 'La foto aún no está disponible para esta acción.')
        const { data: requested, error: requestError } = await db.from('visitor_photos')
          .update({ deletion_requested: true, deletion_requested_at: new Date().toISOString(), last_actor_id: user.id })
          .eq('id', id).eq('status', photo.status).select('id')
        if (requestError) throw requestError
        if (!requested.length) return fail(409, 'El estado cambió. Actualiza el muro.')
        return res.status(200).json({ id })
      }
      if (!admin || user.is_anonymous) return fail(403, 'Esta decisión requiere un administrador autorizado.')
      const updates = {
        approve: { status: 'published', reviewed_by: user.id, reviewed_at: new Date().toISOString() },
        reject: { status: 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() },
        'reject-delete': { deletion_requested: false, deletion_requested_at: null },
        'approve-delete': { status: 'deleting' },
      }
      if (!Object.hasOwn(updates, action)) return fail(400, 'Acción inválida.')
      if (['approve', 'reject'].includes(action) && photo.status !== 'pending') return fail(409, 'Esta foto ya fue revisada.')
      if (action === 'reject-delete' && (!photo.deletion_requested || photo.status === 'deleting')) return fail(409, 'No hay solicitud de eliminación que pueda rechazarse.')
      if (action === 'approve-delete' && photo.status === 'uploading') return fail(409, 'La subida sigue en curso.')
      // Bloqueo optimista: evita aplicar decisiones basadas en un estado antiguo.
      const { data: changed, error: changeError } = await db.from('visitor_photos').update({ ...updates[action], last_actor_id: user.id })
        .eq('id', id).eq('status', photo.status).eq('deletion_requested', photo.deletion_requested).select('id')
      if (changeError) throw changeError
      if (!changed.length) return fail(409, 'El estado cambió. Actualiza el panel.')
      if (action === 'approve-delete') {
        // Se elimina primero el archivo usando Storage API, nunca SQL sobre storage.objects.
        const { error: storageError } = await db.storage.from(BUCKET).remove([photo.object_path])
        if (storageError) throw storageError
        const { error: deleteError } = await db.from('visitor_photos').delete().eq('id', id).eq('status', 'deleting')
        if (deleteError) throw deleteError
      }
      return res.status(200).json({ id, action })
    }

    if (req.headers['content-type'] !== 'image/webp') return fail(415, 'Solo se aceptan imágenes WebP.')
    const chunks = []
    let size = 0
    for await (const chunk of req) {
      size += chunk.length
      if (size > MAX_BYTES) return fail(413, 'El archivo supera los 300 KB.')
      chunks.push(chunk)
    }
    if (!size) return fail(400, 'La imagen está vacía.')
    const input = Buffer.concat(chunks)
    let output
    try {
      output = await sanitizeWebp(input)
    } catch {
      return fail(400, 'La imagen es inválida o supera los límites permitidos.')
    }

    const author = (new URL(req.url, 'https://local.invalid').searchParams.get('author') ?? '').trim()
    if (author.length > 40 || [...author].some((char) => char.codePointAt(0) < 32 || char.codePointAt(0) === 127)) return fail(400, 'Nombre inválido (máximo 40 caracteres).')
    const id = randomUUID()
    const path = `${user.id}/${id}.webp`
    // La reserva aplica cuotas con bloqueo transaccional antes de escribir el objeto.
    const { error: reserveError } = await db.from('visitor_photos').insert({
      id, owner_id: user.id, last_actor_id: user.id, author: author || 'Visitante anónimo', object_path: path,
      width: output.info.width, height: output.info.height, byte_size: output.data.length, status: 'uploading',
    })
    if (reserveError?.code === 'P0001') return fail(429, 'Alcanzaste el límite diario de fotos. Inténtalo mañana.')
    if (reserveError) throw reserveError
    const { error: uploadError } = await db.storage.from(BUCKET).upload(path, output.data, { contentType: 'image/webp', upsert: false, cacheControl: '3600' })
    if (uploadError) {
      // Mantener la reserva uploading: un timeout puede haber escrito el objeto.
      throw uploadError
    }
    const { data: pending, error: pendingError } = await db.from('visitor_photos')
      .update({ status: 'pending' }).eq('id', id).eq('status', 'uploading').select('id').maybeSingle()
    if (pendingError) throw pendingError
    if (!pending) return fail(409, 'La subida no pudo confirmarse para revisión. Contacta con el administrador antes de reenviarla.')
    return res.status(201).json({ id })
  } catch (error) {
    console.error('Photo operation failed', error?.code ?? 'unknown')
    return fail(500, 'No se pudo completar la operación. Inténtalo de nuevo.')
  }
}

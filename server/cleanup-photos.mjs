import { createClient } from '@supabase/supabase-js'

// Ejecutar únicamente en un entorno de servidor con secretos configurados.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing server Supabase credentials')
}
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
const { data, error } = await db.from('visitor_photos').select('id,object_path,status')
  .or(`status.eq.deleting,and(status.eq.uploading,created_at.lt.${cutoff})`)
  .order('created_at').limit(100)
if (error) throw error
for (const photo of data) {
  // Reservar la limpieza evita que otra operación cambie el estado entre pasos.
  const { data: reserved, error: reserveError } = await db.from('visitor_photos')
    .update({ status: 'deleting', last_actor_id: null }).eq('id', photo.id).eq('status', photo.status).select('id')
  if (reserveError) throw reserveError
  if (!reserved.length) continue
  const { error: storageError } = await db.storage.from('visitor-photos').remove([photo.object_path])
  if (storageError) throw storageError
  const { error: deleteError } = await db.from('visitor_photos').delete().eq('id', photo.id).eq('status', 'deleting')
  if (deleteError) throw deleteError
}
console.log(`Processed up to ${data.length} incomplete photo operations.`)

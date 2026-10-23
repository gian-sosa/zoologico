import { getSupabase } from '../../shared/lib/supabase'

export interface VisitorPhoto {
  id: string
  author: string
  url: string
  canDelete: boolean
  status: 'pending' | 'published' | 'rejected' | 'deleting'
  deletion_requested: boolean
}

export function photosClient() {
  const db = getSupabase()
  if (!db) throw new Error('Falta configurar Supabase para el muro de fotos.')
  return db
}

export async function listPhotos(moderation = false, page = 0): Promise<{ photos: VisitorPhoto[]; hasMore: boolean }> {
  const db = photosClient()
  const { data: sessionData, error: sessionError } = await db.auth.getSession()
  if (sessionError) throw sessionError
  const userId = sessionData.session?.user.id
  const { data: admin, error: adminError } = userId
    ? await db.from('photo_admins').select('user_id').eq('user_id', userId).maybeSingle()
    : { data: null, error: null }
  if (adminError) throw adminError
  let query = db.from('visitor_photos')
    .select('id,author,owner_id,object_path,status,deletion_requested')
    .order('created_at', { ascending: false }).order('id', { ascending: false })
    .range(page * 100, page * 100 + 100)
  if (moderation) query = query.neq('status', 'uploading')
  if (!moderation) query = query.eq('status', 'published')
  const { data, error } = await query
  if (error) throw error
  if (!data?.length) return { photos: [], hasMore: false }
  const rows = data.slice(0, 100)
  const { data: urls, error: urlError } = await db.storage.from('visitor-photos')
    .createSignedUrls(rows.map((p) => p.object_path), 3600)
  if (urlError) throw urlError
  const signed = new Map(urls?.map((p) => [p.path, p.signedUrl]))
  const photos = rows.map((p) => {
    const url = signed.get(p.object_path)
    if (!url && p.status !== 'deleting') throw new Error('No se pudo obtener acceso a una foto. Recarga la página.')
    return { id: p.id, author: p.author, url: url ?? '', status: p.status, deletion_requested: p.deletion_requested, canDelete: Boolean(admin) || p.owner_id === userId }
  })
  return { photos, hasMore: data.length > 100 }
}

let signingIn: Promise<string> | null = null

async function accessToken(): Promise<string> {
  const db = photosClient()
  const { data, error } = await db.auth.getSession()
  if (error) throw error
  if (data.session) return data.session.access_token
  if (!signingIn) {
    signingIn = db.auth.signInAnonymously().then(({ data: result, error: signInError }) => {
      if (signInError?.code === 'anonymous_provider_disabled') {
        throw new Error('La subida de visitantes aún no está habilitada. Contacta con el administrador del sitio.')
      }
      if (signInError || !result.session) throw new Error('No se pudo iniciar la sesión de visitante. Inténtalo de nuevo.')
      return result.session.access_token
    }).finally(() => { signingIn = null })
  }
  return signingIn
}

export async function photoRequest(method: 'POST' | 'PATCH', query: URLSearchParams, body?: Blob): Promise<void> {
  const token = await accessToken()
  const response = await fetch(`/api/photos?${query}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'image/webp' } : {}) },
    body,
  })
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('El servidor de subida no está disponible. En local, reinicia npm run dev; en producción, verifica el despliegue de /api/photos.')
  }
  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.error ?? 'No se pudo completar la operación de fotos.')
  }
}

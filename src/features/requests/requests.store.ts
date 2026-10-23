import { getSupabase } from '../../shared/supabase'
import type { DocumentDetails, DocumentType } from './documents'
import { validateDocument } from './documents'

export interface DocumentRequest {
  id: string
  name: string
  institution: string
  email: string
  phone: string
  document_type: DocumentType
  document_number: string
  subject: string
  message: string
  attachment_path: string | null
  createdAt: string
  /** Campos heredados: se conservan en los registros educativos anteriores. */
  visitDate?: string | null
  students?: number | null
}

function client() {
  const db = getSupabase()
  if (!db) throw new Error('Mesa de Partes aún no está configurada.')
  return db
}

async function sessionToken() {
  const db = client()
  const { data, error } = await db.auth.getSession()
  if (error) throw error
  if (data.session) return data.session.access_token
  const { data: signedIn, error: signInError } = await db.auth.signInAnonymously()
  if (signInError || !signedIn.session) throw new Error('No se pudo iniciar la sesión para enviar el documento.')
  return signedIn.session.access_token
}

export async function listRequests(): Promise<DocumentRequest[]> {
  // Se conserva el nombre de tabla histórico para no perder las solicitudes existentes.
  const { data, error } = await client().from('discount_requests').select('*').eq('submission_status', 'received').order('createdAt', { ascending: false }).limit(200)
  if (error) throw error
  return data ?? []
}

export async function saveRequest(details: DocumentDetails, attachment: File | null): Promise<{ id: string }> {
  if (Object.keys(validateDocument(details, attachment)).length) throw new Error('Revisa los datos del formulario.')
  const body = new FormData()
  body.set('details', JSON.stringify(details))
  if (attachment) body.set('attachment', attachment)
  const response = await fetch('/api/documents', { method: 'POST', headers: { Authorization: `Bearer ${await sessionToken()}` }, body })
  const result = await response.json().catch(() => null)
  if (!response.ok || !result?.id) throw new Error(result?.error ?? 'No se pudo enviar el documento. Inténtalo de nuevo.')
  return { id: result.id }
}

export async function attachmentUrl(path: string): Promise<string> {
  const { data, error } = await client().storage.from('request-documents').createSignedUrl(path, 60, { download: 'documento.pdf' })
  if (error) throw error
  return data.signedUrl
}

export async function deleteRequest(id: string): Promise<DocumentRequest[]> {
  const response = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${await sessionToken()}` } })
  if (!response.ok) throw new Error('No se pudo eliminar el documento y sus adjuntos.')
  return listRequests()
}

export async function clearRequests(): Promise<DocumentRequest[]> {
  const requests = await listRequests()
  for (const request of requests) await deleteRequest(request.id)
  return listRequests()
}

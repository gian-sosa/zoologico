import { getSupabase } from '../../shared/lib/supabase'
import type { ClaimFields, ClaimErrors } from '../../../shared/claims.mjs'

export interface ClaimsProvider {
  name: string
  ruc: string
  address: string
  privacyContact: string
  privacyNotice: string
}
export interface ClaimReceipt {
  code: string
  created_at: string
  provider: ClaimsProvider
  details: ClaimFields
  receipt_email_status: 'pending' | 'sent' | 'not_requested'
  provider_actions: string
}
export interface StoredClaim extends ClaimReceipt {
  id: string
  response_text: string | null
  response_sent_at: string | null
}
export async function claimsSettings(): Promise<{ ready: boolean; provider: ClaimsProvider }> {
  const response = await fetch('/api/claims')
  if (!response.ok) throw new Error('No se pudo cargar la información del libro.')
  return response.json()
}
export async function submitClaim(details: ClaimFields, submissionKey: string): Promise<{ receipt?: ClaimReceipt; errors?: ClaimErrors; error?: string }> {
  const response = await fetch('/api/claims', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submission_key: submissionKey, details }),
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) return { errors: result?.errors, error: result?.error ?? 'No se pudo confirmar el registro. Reintenta sin modificar los datos.' }
  return { receipt: result }
}
export async function listClaims(page = 0): Promise<StoredClaim[]> {
  const db = getSupabase()
  if (!db) throw new Error('Falta configurar Supabase.')
  const { data, error } = await db.from('consumer_claims')
    .select('id,code,created_at,provider,details,receipt_email_status,provider_actions,response_text,response_sent_at')
    .order('sequence_number', { ascending: false }).range(page * 50, page * 50 + 49)
  if (error) throw error
  return data ?? []
}

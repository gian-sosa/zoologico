export interface ClaimFields {
  name: string
  document_type: string
  document_number: string
  address: string
  phone: string
  email: string
  is_minor: boolean
  guardian_name: string
  guardian_address: string
  guardian_phone: string
  guardian_email: string
  item_type: string
  item_description: string
  amount: string
  incident_date: string
  kind: string
  detail: string
  request: string
  response_channel: string
  conformity: boolean
}
export type ClaimErrors = Partial<Record<keyof ClaimFields, string>>
export const CLAIM_LABELS: Record<keyof ClaimFields, string>
export function emptyClaim(): ClaimFields
export function validateClaim(input: unknown): { value: ClaimFields; errors: ClaimErrors }
export function claimEmail(details: ClaimFields): string
export function claimSheetEntries(details: ClaimFields): { key: keyof ClaimFields; label: string; value: string }[]

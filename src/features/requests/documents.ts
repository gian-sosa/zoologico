export const DOCUMENT_TYPES = ['Solicitud', 'Oficio', 'Carta', 'Informe', 'Otro documento'] as const
export type DocumentType = typeof DOCUMENT_TYPES[number]
export const MAX_DOCUMENT_BYTES = 3 * 1024 * 1024

export interface DocumentDetails {
  name: string
  institution: string
  email: string
  phone: string
  document_type: DocumentType
  document_number: string
  subject: string
  message: string
  consent: boolean
}

export type DocumentErrors = Partial<Record<keyof DocumentDetails | 'attachment', string>>

export function validateDocument(data: DocumentDetails, file: File | null): DocumentErrors {
  const errors: DocumentErrors = {}
  if (data.name.trim().length < 2 || data.name.trim().length > 150) errors.name = 'Ingresa tu nombre completo (entre 2 y 150 caracteres).'
  if (data.institution.trim().length > 250) errors.institution = 'Usa como máximo 250 caracteres.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) || data.email.trim().length > 254) errors.email = 'Ingresa un correo electrónico válido.'
  if (data.phone.length > 40) errors.phone = 'Usa como máximo 40 caracteres.'
  if (!DOCUMENT_TYPES.includes(data.document_type)) errors.document_type = 'Selecciona un tipo de documento.'
  if (data.document_number.trim().length > 80) errors.document_number = 'Usa como máximo 80 caracteres.'
  if (data.subject.trim().length < 5 || data.subject.trim().length > 200) errors.subject = 'Resume el asunto en 5 a 200 caracteres.'
  if (data.message.trim().length < 20 || data.message.trim().length > 4000) errors.message = 'Describe tu presentación en 20 a 4000 caracteres.'
  if (!data.consent) errors.consent = 'Confirma la autorización para tramitar tu documento.'
  if (file && (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf'))) errors.attachment = 'Adjunta un archivo en formato PDF.'
  if (file && (file.size === 0 || file.size > MAX_DOCUMENT_BYTES)) errors.attachment = 'El PDF debe pesar como máximo 3 MB y no estar vacío.'
  return errors
}

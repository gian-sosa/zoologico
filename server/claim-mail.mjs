import { claimSheetEntries, claimEmail } from '../shared/claims.mjs'

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

/** Envía una copia de la hoja completa; `sent` significa aceptada por el servicio, no entregada. */
export async function sendClaimReceipt(db, claim) {
  const recipient = claimEmail(claim.details)
  if (!recipient || claim.receipt_email_status === 'sent') return claim.receipt_email_status
  try {
    if (!process.env.RESEND_API_KEY || !process.env.CLAIMS_EMAIL_FROM) throw new Error('Mail configuration missing')
    const lines = claimSheetEntries(claim.details)
      .map(({ label, value }) => `${escapeHtml(label)}: ${escapeHtml(value)}`)
    const html = `<h1>Hoja de Reclamación ${escapeHtml(claim.code)}</h1><p>${escapeHtml(claim.provider.name)} · RUC ${escapeHtml(claim.provider.ruc)}<br>${escapeHtml(claim.provider.address)}</p><p>Registrada: ${escapeHtml(new Date(claim.created_at).toLocaleString('es-PE', { timeZone: 'America/Lima' }))} (hora de Lima)</p><div style="white-space:pre-wrap">${lines.join('<br><br>')}</div><p>Observaciones y acciones del proveedor al registrar: pendiente de atención.</p><p>Respuesta en un máximo de 15 días hábiles improrrogables. La presentación no impide acudir a otras vías de solución de controversias ni constituye denuncia ante Indecopi.</p>`
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `claim-receipt-${claim.id}` },
      body: JSON.stringify({ from: process.env.CLAIMS_EMAIL_FROM, to: [recipient], subject: `Copia de Hoja de Reclamación ${claim.code}`, html }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('Mail not accepted')
    const result = await response.json()
    const { error } = await db.from('consumer_claims').update({ receipt_email_status: 'sent', receipt_email_id: result.id, receipt_email_sent_at: new Date().toISOString() }).eq('id', claim.id)
    if (error) throw error
    return 'sent'
  } catch {
    // La hoja ya existe: nunca devolver un falso fallo de registro por un fallo de correo.
    return 'pending'
  }
}

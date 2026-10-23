import { createClient } from '@supabase/supabase-js'
import { sendClaimReceipt } from './claim-mail.mjs'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY || !process.env.CLAIMS_EMAIL_FROM) throw new Error('Missing server mail configuration')
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
const { data, error } = await db.from('consumer_claims').select('*').eq('receipt_email_status', 'pending').order('created_at').limit(50)
if (error) throw error
let pending = 0
for (const claim of data) if (await sendClaimReceipt(db, claim) !== 'sent') pending++
console.log(`Receipts processed: ${data.length}. Still pending: ${pending}.`)
if (pending) process.exitCode = 1

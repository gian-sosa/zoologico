/**
 * Verificación de credenciales de administración.
 *
 * La clave NUNCA está en texto plano en el bundle: solo se guardan hashes
 * SHA-256 y la comparación se hace hasheando lo que el usuario escribe.
 * Nada que ver en "Inspeccionar elemento" revela la contraseña.
 *
 * NOTA DE SEGURIDAD: al ser 100% frontend, un usuario avanzado podría
 * alterar el JS en su propio navegador. Para producción real, mover este
 * login a un backend (API + sesión httpOnly).
 */

const USER_SALT = 'totorilla-user'
const PASS_SALT = 't0t0rilla-ayacucho-2026'

// SHA-256("totorilla-user:admin") y SHA-256("<PASS_SALT>:admin")
const EXPECTED_USER_HASH =
  'b161ce6fadb7f27b9f7faa8e2590b979552b13e1bc2f7c7b2bf34a21a023c0bc'
const EXPECTED_PASS_HASH =
  'fca2e1e67fa795d89d74a8e60764c2489fc5405858045ffd282ffb0fe343f085'

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Comparación en tiempo constante para no filtrar por timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return false
  const user = username.trim().toLowerCase()
  if (!user || !password) return false
  const [uh, ph] = await Promise.all([
    sha256Hex(`${USER_SALT}:${user}`),
    sha256Hex(`${PASS_SALT}:${password}`),
  ])
  return safeEqual(uh, EXPECTED_USER_HASH) && safeEqual(ph, EXPECTED_PASS_HASH)
}

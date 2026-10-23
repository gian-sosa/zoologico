import photos from '../api/photos.mjs'
import documents from '../api/documents.mjs'
import claims from '../api/claims.mjs'

const handlers = new Map([
  ['/api/photos', photos],
  ['/api/documents', documents],
  ['/api/claims', claims],
])

/** Ejecuta las API Node existentes en desarrollo, sin añadirlas al bundle web. */
export function localApiPlugin(env) {
  // Vite no carga variables privadas en process.env automáticamente. Copiar solo
  // las que utilizan nuestras API; nunca usar `define` ni enviarlas al cliente.
  const keys = [
    'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
    'CLAIMS_PROVIDER_NAME', 'CLAIMS_PROVIDER_RUC', 'CLAIMS_PROVIDER_ADDRESS',
    'CLAIMS_PRIVACY_EMAIL', 'CLAIMS_PRIVACY_NOTICE', 'RESEND_API_KEY', 'CLAIMS_EMAIL_FROM',
  ]
  return {
    name: 'totorilla-local-api',
    apply: 'serve',
    configureServer(server) {
      for (const key of keys) {
        if (process.env[key] === undefined && env[key]) process.env[key] = env[key]
      }
      server.middlewares.use(async (req, res, next) => {
        const path = new URL(req.url ?? '/', 'http://local.invalid').pathname
        if (!path.startsWith('/api/')) return next()
        res.setHeader('Cache-Control', 'no-store')
        // Métodos mínimos que utilizan los handlers de Vercel.
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (body) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(body))
          return res
        }
        const handler = handlers.get(path)
        if (!handler) return res.status(404).json({ error: 'Endpoint de API no encontrado.' })
        try {
          await handler(req, res)
        } catch (error) {
          // No devolver stack traces, credenciales ni respuestas de terceros.
          console.error('Local API failed', error?.code ?? 'unknown')
          if (!res.headersSent) res.status(500).json({ error: 'No se pudo completar la operación del servidor local.' })
          else res.end()
        }
      })
    },
  }
}

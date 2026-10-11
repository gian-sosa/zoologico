import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppRouter from './app/router'
import { consumePostLoginNext, useAuth } from './features/auth/auth.context'

/**
 * Tras volver de Google, Supabase puede aterrizar en cualquier ruta
 * (p. ej. / si el redirectTo no estaba en su allowlist). Si hay un destino
 * pendiente guardado y ya existe sesión de administrador, redirige allí.
 */
function PostLoginRedirect() {
  const { role, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading || role !== 'administrador') return
    const next = consumePostLoginNext()
    if (next && location.pathname !== next) {
      navigate(next, { replace: true })
    }
  }, [role, loading, location.pathname, navigate])

  return null
}

export default function App() {
  return (
    <>
      <PostLoginRedirect />
      <AppRouter />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

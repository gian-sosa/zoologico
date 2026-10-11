import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth.context'
import { RouteFallback } from '../../shared/components/RouteFallback'

/** Solo rol administrador (Supabase + cuenta institucional). El visitante es redirigido al login interno. */
export default function RequireAdmin({ children }: { children: React.JSX.Element }) {
  const { role, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return <RouteFallback />
  }
  if (role !== 'administrador') {
    return <Navigate to="/administracion" replace state={{ from: location.pathname }} />
  }
  return children
}

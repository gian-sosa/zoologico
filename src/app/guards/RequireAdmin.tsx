import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth.context'

/** Solo rol administrador. El visitante es redirigido al login interno. */
export default function RequireAdmin({ children }: { children: React.JSX.Element }) {
  const { role } = useAuth()
  const location = useLocation()
  if (role !== 'administrador') {
    return <Navigate to="/administracion" replace state={{ from: location.pathname }} />
  }
  return children
}

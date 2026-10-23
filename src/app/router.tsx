import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import RequireAdmin from './guards/RequireAdmin'
import { RouteFallback } from '../shared/components/RouteFallback'

// Code-splitting por ruta: el bundle inicial solo trae Home; el resto se carga bajo demanda.
const HomePage = lazy(() => import('../pages/HomePage'))
const AnimalPage = lazy(() => import('../pages/AnimalPage'))
const TicketsPage = lazy(() => import('../pages/TicketsPage'))
const MesaDePartesPage = lazy(() => import('../pages/MesaDePartesPage'))
const ClaimsPage = lazy(() => import('../pages/ClaimsPage'))
const CommunityPage = lazy(() => import('../pages/CommunityPage'))
const MapaPage = lazy(() => import('../pages/MapaPage'))
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function LegacyAnimalRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={slug ? `/fauna/${slug}` : '/explora#fauna'} replace />
}

function LegacyMapRedirect() {
  const { search, hash } = useLocation()
  return <Navigate to={`/explora${search}${hash === '#directorio' ? '#fauna' : hash}`} replace />
}

export default function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="fauna" element={<Navigate to="/explora#fauna" replace />} />
          <Route path="fauna/:slug" element={<AnimalPage />} />
          <Route path="entradas" element={<TicketsPage />} />
          <Route path="explora" element={<MapaPage />} />
          <Route path="mapa" element={<LegacyMapRedirect />} />
          <Route path="croquis" element={<LegacyMapRedirect />} />
          <Route path="mesadepartes" element={<MesaDePartesPage />} />
          <Route path="mesa-de-partes" element={<Navigate to="/mesadepartes" replace />} />
          <Route path="libro-de-reclamaciones" element={<ClaimsPage />} />
          <Route path="blog" element={<CommunityPage />} />
          {/* Redirecciones desde rutas anteriores */}
          <Route path="animales" element={<Navigate to="/explora#fauna" replace />} />
          <Route path="animales/:slug" element={<LegacyAnimalRedirect />} />
          <Route path="comunidad" element={<Navigate to="/blog" replace />} />
          {/* Administración (rol administrador) */}
          <Route path="administracion" element={<AdminLoginPage />} />
          <Route
            path="administracion/panel"
            element={
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

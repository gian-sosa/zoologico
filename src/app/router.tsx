import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import RequireAdmin from './guards/RequireAdmin'
import { RouteFallback } from '../shared/components/RouteFallback'

// Code-splitting por ruta: el bundle inicial solo trae Home; el resto se carga bajo demanda.
const HomePage = lazy(() => import('../pages/HomePage'))
const AnimalsPage = lazy(() => import('../pages/AnimalsPage'))
const AnimalPage = lazy(() => import('../pages/AnimalPage'))
const TicketsPage = lazy(() => import('../pages/TicketsPage'))
const MesaDePartesPage = lazy(() => import('../pages/MesaDePartesPage'))
const CommunityPage = lazy(() => import('../pages/CommunityPage'))
const MapaPage = lazy(() => import('../pages/MapaPage'))
const DevelopersPage = lazy(() => import('../pages/DevelopersPage'))
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function LegacyAnimalRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={slug ? `/fauna/${slug}` : '/fauna'} replace />
}

export default function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="fauna" element={<AnimalsPage />} />
          <Route path="fauna/:slug" element={<AnimalPage />} />
          <Route path="entradas" element={<TicketsPage />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="croquis" element={<Navigate to="/mapa" replace />} />
          <Route path="mesadepartes" element={<MesaDePartesPage />} />
          <Route path="mesa-de-partes" element={<Navigate to="/mesadepartes" replace />} />
          <Route path="blog" element={<CommunityPage />} />
          {/* Redirecciones desde rutas anteriores */}
          <Route path="animales" element={<Navigate to="/fauna" replace />} />
          <Route path="animales/:slug" element={<LegacyAnimalRedirect />} />
          <Route path="comunidad" element={<Navigate to="/blog" replace />} />
          {/* Proyecto */}
          <Route path="desarrolladores" element={<DevelopersPage />} />
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

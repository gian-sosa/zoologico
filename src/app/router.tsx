import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import RequireAdmin from './guards/RequireAdmin'
import { RouteFallback } from '../shared/components/RouteFallback'

// Code-splitting por ruta: el bundle inicial solo trae Home; el resto se carga bajo demanda.
const HomePage = lazy(() => import('../pages/HomePage'))
const AnimalsPage = lazy(() => import('../pages/AnimalsPage'))
const AnimalPage = lazy(() => import('../pages/AnimalPage'))
const TicketsPage = lazy(() => import('../pages/TicketsPage'))
const CommunityPage = lazy(() => import('../pages/CommunityPage'))
const DevelopersPage = lazy(() => import('../pages/DevelopersPage'))
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export default function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="animales" element={<AnimalsPage />} />
          <Route path="animales/:slug" element={<AnimalPage />} />
          <Route path="entradas" element={<TicketsPage />} />
          <Route path="comunidad" element={<CommunityPage />} />
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

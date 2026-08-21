import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalPage from './pages/AnimalPage'
import NotFoundPage from './pages/NotFoundPage'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <ScrollManager />
      <Navbar />
      <div className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animales" element={<AnimalsPage />} />
          <Route path="/animales/:slug" element={<AnimalPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

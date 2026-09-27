import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ScrollManager from '../../shared/components/ScrollManager'

/** Layout raíz: chrome persistente (nav/footer) + contenido ruteado. */
export default function RootLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <ScrollManager />
      <Navbar />
      {/* La navbar es flotante fija: en páginas internas se compensa con padding superior.
          En el inicio el hero va a todo ancho por detrás de la pastilla. */}
      <div className={`grow ${isHome ? '' : 'pt-[76px] sm:pt-[84px]'}`}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

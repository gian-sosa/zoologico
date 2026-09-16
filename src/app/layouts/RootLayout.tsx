import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ScrollManager from '../../shared/components/ScrollManager'

/** Layout raíz: chrome persistente (nav/footer) + contenido ruteado. */
export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-foreground">
      <ScrollManager />
      <Navbar />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

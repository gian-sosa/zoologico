import { Link } from 'react-router-dom'
import { MapPinIcon } from './icons'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading font-semibold text-foreground">Zoológico de Totorilla</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
            <MapPinIcon className="size-4" />
            Ayacucho, Perú
          </p>
        </div>
        <nav aria-label="Enlaces del sitio">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <li>
              <Link to="/animales" className="text-muted-foreground transition-colors hover:text-primary">
                Animales
              </Link>
            </li>
            <li>
              <Link to="/#fotos" className="text-muted-foreground transition-colors hover:text-primary">
                Comparte tu foto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 Zoológico de Totorilla · Educación y conservación
      </p>
    </footer>
  )
}

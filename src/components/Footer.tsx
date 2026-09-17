import { Link } from 'react-router-dom'
import { LockIcon, MapPinIcon } from './icons'
import { SITE } from '../shared/config/site'

/**
 * Footer institucional: NO repite los menús del header (Inicio, Fauna,
 * Entradas, Blog). Solo identidad, datos de visita y enlaces del
 * proyecto: desarrolladores y acceso interno de administración.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 text-center sm:grid-cols-3 sm:text-left">
        <div>
          <p className="font-heading font-semibold text-foreground">{SITE.name}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
            <MapPinIcon className="size-4 shrink-0" />
            {SITE.address}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{SITE.hours}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Equipo</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/desarrolladores" className="text-foreground transition-colors hover:text-primary">
                Conoce a los desarrolladores
              </Link>
            </li>
            <li className="text-xs leading-relaxed text-muted-foreground">
              Ingeniería de Sistemas · UNSCH
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Zona interna</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                to="/administracion"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <LockIcon className="size-4" />
                Administración
              </Link>
            </li>
            <li className="text-xs text-muted-foreground">Acceso solo para personal del zoológico</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 Universidad Nacional de San Cristóbal de Huamanga
      </p>
    </footer>
  )
}

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PawIcon } from './icons'

const links = [
  { to: '/', label: 'Inicio', match: (p: string) => p === '/' },
  { to: '/animales', label: 'Animales', match: (p: string) => p.startsWith('/animales') },
  { to: '/#fotos', label: 'Comparte tu foto', match: () => false },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
      >
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-on-primary">
            <PawIcon />
          </span>
          Parque Zoológico Totorilla
          <span className="hidden text-sm font-normal text-muted-foreground sm:inline">· Ayacucho</span>
        </Link>

        <ul className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const active = link.match(pathname)
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-muted ${
                    active ? 'bg-primary-soft text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-muted sm:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <ul className="border-t border-border px-6 py-3 sm:hidden">
          {links.map((link) => {
            const active = link.match(pathname)
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    active ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </header>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/auth.context'
import { TicketIcon } from './icons'

const links = [
  { to: '/', label: 'Inicio', match: (p: string) => p === '/' },
  { to: '/fauna', label: 'Fauna', match: (p: string) => p.startsWith('/fauna') },
  { to: '/entradas', label: 'Entradas', match: (p: string) => p.startsWith('/entradas') },
  { to: '/blog', label: 'Blog', match: (p: string) => p.startsWith('/blog') },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { role, logout } = useAuth()
  const isAdmin = role === 'administrador'

  // Cerrar el menú al navegar o con Escape
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open ])

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Pastilla flotante como en el diseño */}
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl items-center gap-1 rounded-full border border-black/5 bg-white/95 py-2 pr-2 pl-2 shadow-[0_16px_45px_-15px_rgba(0,0,0,0.4)] backdrop-blur-md sm:pl-3"
      >
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Zoológico La Totorilla — inicio">
          <img
            src="/logo-zoo.png"
            alt="Logo del zoológico"
            className="size-10 shrink-0 rounded-full object-cover ring-2 ring-jungle/15 sm:size-11"
          />
          <span className="min-w-0 leading-none">
            <span className="block truncate font-heading text-[15px] font-semibold text-[#2e7d32] sm:text-base">
              Zoológico
            </span>
            <span className="block truncate font-heading text-[15px] font-semibold text-[#4e342e] sm:text-base">
              La Totorilla
            </span>
          </span>
        </Link>

        {/* Links escritorio */}
        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = link.match(pathname)
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-full px-4 py-2 font-heading text-[15px] transition-colors duration-200 ${
                    active ? 'font-semibold text-stone-900' : 'font-medium text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span aria-hidden="true" className="absolute inset-x-4 -bottom-0.5 h-[2.5px] rounded-full bg-jungle" />
                  )}
                </Link>
              </li>
            )
          })}
          {isAdmin && (
            <li>
              <Link
                to="/administracion/panel"
                className={`relative rounded-full px-4 py-2 font-heading text-[15px] font-medium transition-colors duration-200 ${
                  pathname.startsWith('/administracion') ? 'font-semibold text-stone-900' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Panel
                {pathname.startsWith('/administracion') && (
                  <span aria-hidden="true" className="absolute inset-x-4 -bottom-0.5 h-[2.5px] rounded-full bg-jungle" />
                )}
              </Link>
            </li>
          )}
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          {isAdmin && (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden cursor-pointer rounded-full px-3 py-2 text-sm font-bold text-stone-500 transition-colors hover:text-stone-900 lg:block"
            >
              Salir
            </button>
          )}
          {/* CTA como en el diseño */}
          <Link
            to="/entradas"
            className="hidden items-center gap-2 rounded-full bg-jungle px-5 py-2.5 font-heading text-[14px] font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-jungle-deep hover:shadow-lg sm:inline-flex"
          >
            <TicketIcon className="size-4" />
            Comprar entradas
          </Link>
          {/* Hamburguesa móvil */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-cream text-stone-800 transition-colors hover:bg-primary-soft lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="size-5">
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
        </div>
      </nav>

      {/* Menú desplegable móvil / tablet */}
      {open && (
        <div className="mx-auto mt-2 max-w-6xl lg:hidden">
          <div
            id="menu-movil"
            className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white p-3 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <ul className="flex flex-col gap-1">
              {links.map((link) => {
                const active = link.match(pathname)
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-2xl px-5 py-3.5 font-heading text-lg transition-colors ${
                        active ? 'bg-cream font-semibold text-jungle' : 'font-medium text-stone-700 hover:bg-cream'
                      }`}
                    >
                      {link.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 ${active ? 'text-jungle' : 'text-stone-300'}`}>
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                )
              })}
              {isAdmin && (
                <>
                  <li>
                    <Link
                      to="/administracion/panel"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-5 py-3.5 font-heading text-lg font-medium text-stone-700 transition-colors hover:bg-cream"
                    >
                      Panel de administración
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full cursor-pointer rounded-2xl px-5 py-3.5 text-left font-heading text-lg font-medium text-stone-500 transition-colors hover:bg-cream"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}
            </ul>
            <Link
              to="/entradas"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-jungle px-5 py-4 font-heading text-base font-semibold text-white shadow-md transition-colors hover:bg-jungle-deep sm:hidden"
            >
              <TicketIcon className="size-5" />
              Comprar entradas
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

import { Link } from 'react-router-dom'
import { LeafIcon, LockIcon, MapPinIcon } from './icons'
import { SITE } from '../shared/config/site'

const footerLinks = [
  { to: '/explora', label: 'Explora el zoológico' },
  { to: '/blog', label: 'Comunidad Totorilla' },
  { to: '/mesadepartes', label: 'Mesa de Partes' },
  { to: '/libro-de-reclamaciones', label: 'Libro de Reclamaciones' },
]

export default function Footer() {
  return (
    <footer className="border-t border-jungle bg-jungle-deep text-center text-white sm:text-left">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-10 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.4fr_1fr_0.9fr] lg:gap-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" aria-label={`${SITE.name} — inicio`} className="inline-flex max-w-full items-center gap-3 rounded-lg focus-visible:outline-cream focus-visible:outline-offset-5">
              <img src="/logo-zoo.png" alt="" width={56} height={56} loading="lazy" className="size-14 shrink-0 rounded-full bg-white object-contain" />
              <span className="font-heading text-xl leading-tight font-semibold">
                <span className="block text-sm font-normal text-white/75">Parque Zoológico</span>
                La Totorilla
              </span>
            </Link>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-white/80 sm:mx-0">
              Un encuentro con la vida silvestre en Ayacucho.
              Conoce, aprende y conecta con la naturaleza.
            </p>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold tracking-wide text-white/80 sm:justify-start">
              <LeafIcon className="size-4 shrink-0" />
              Conservación · Educación · Recreación
            </p>
          </div>

          <section aria-labelledby="footer-visit-heading">
            <h2 id="footer-visit-heading" className="font-heading text-lg font-semibold">Ven a visitarnos</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-semibold tracking-wider text-white/65 uppercase">Horario de atención</dt>
                <dd className="mt-1.5 leading-relaxed text-white/90">{SITE.hours}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wider text-white/65 uppercase">Ubicación</dt>
                <dd className="mt-1.5 flex items-start justify-center gap-2 leading-relaxed text-white/90 sm:justify-start">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                  <address className="not-italic">{SITE.address}</address>
                </dd>
              </div>
            </dl>
            <Link to="/entradas" className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-cream px-5 py-2.5 text-sm font-bold text-jungle-deep transition-colors hover:bg-primary-soft focus-visible:outline-cream focus-visible:outline-offset-5">
              Ver tarifas de ingreso
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-white/70">Entradas en boletería · Pago en efectivo</p>
          </section>

          <nav aria-labelledby="footer-explore-heading">
            <h2 id="footer-explore-heading" className="font-heading text-lg font-semibold">Explora Totorilla</h2>
            <ul className="mt-3 space-y-1">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="inline-flex min-h-11 items-center rounded-md text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-cream focus-visible:outline-offset-5">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-5 border-t border-white/15 py-6 sm:flex-row sm:justify-between">
          <div className="text-xs leading-relaxed text-white/70">
            <p>© {new Date().getFullYear()} Universidad Nacional de San Cristóbal de Huamanga</p>
            <p className="mt-1">Facultad de Ciencias Biológicas · Ayacucho, Perú</p>
          </div>
          <Link to="/administracion" className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-md text-xs text-white/70 transition-colors hover:text-white focus-visible:outline-cream focus-visible:outline-offset-5">
            <LockIcon className="size-4" />
            Acceso del personal
          </Link>
        </div>
      </div>
    </footer>
  )
}

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../shared/components/PageHeader'
import { ArrowRightIcon, MapPinIcon, PawIcon } from '../components/icons'
import { getParkingTypes, getTicketTypes, formatTariff } from '../features/tickets/prices.store'
import { SITE } from '../shared/config/site'

const steps = [
  {
    n: '1',
    title: 'Llega al zoológico',
    text: 'Estamos en Vía Evitamiento, Huamanga, Ayacucho. Abrimos todos los días de 8:00 a 18:00.',
  },
  {
    n: '2',
    title: 'Paga en boletería',
    text: 'Las entradas se venden solo en boletería y en efectivo. No hay venta ni reserva online.',
  },
  {
    n: '3',
    title: 'Disfruta tu visita',
    text: 'Conserva tu ticket durante el recorrido. Cada entrada apoya el rescate de nuestra fauna.',
  },
]

export default function TicketsPage() {
  const tariffs = useMemo(getTicketTypes, [])
  const parking = useMemo(getParkingTypes, [])

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Visita"
        title="Entradas y tarifas"
        description="Las entradas se venden únicamente en la boletería del zoológico y se pagan en efectivo. Sin reservas online."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section aria-label="Tarifas de ingreso" className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-stone-900">Tarifario oficial</h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {tariffs.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <p className="text-[15px] font-bold text-stone-900">{t.name}</p>
                <span className="shrink-0 rounded-full bg-sun px-4 py-1.5 font-heading text-[15px] font-bold text-stone-900">
                  {formatTariff(t.price)}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 font-heading text-[15px] font-bold text-stone-900">Parqueo vehicular</h3>
          <ul className="mt-1 divide-y divide-stone-100">
            {parking.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <p className="text-[15px] font-bold text-stone-900">{t.name}</p>
                <span className="shrink-0 rounded-full bg-sun px-4 py-1.5 font-heading text-[15px] font-bold text-stone-900">
                  {formatTariff(t.price)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm leading-relaxed font-medium text-stone-700">
            Pago <strong>solo en efectivo</strong> en la boletería del recinto.
          </p>
          <div className="mt-3 rounded-2xl border border-jungle/15 bg-primary-soft/50 p-4">
            <p className="font-heading text-[15px] font-bold text-stone-900">
              ¿Vienes con tus estudiantes?
            </p>
            <p className="mt-0.5 text-[13px] font-medium text-stone-600">
              Descuento especial para instituciones educativas públicas.
            </p>
            <Link
              to="/mesadepartes"
              className="group mt-3 inline-flex items-center gap-2 rounded-full bg-jungle px-6 py-2.5 font-heading text-sm font-semibold text-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-jungle-deep"
            >
              Solicitar descuento
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <div className="grid gap-5">
          <section aria-label="Horario y ubicación" className="rounded-3xl bg-[#0e3d24] p-7 text-white sm:p-8">
            <h2 className="font-heading text-xl font-bold">Horario y ubicación</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-4 shrink-0 text-[#d9f99d]">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {SITE.hoursLong}
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <MapPinIcon className="size-4 shrink-0 text-[#d9f99d]" />
                {SITE.address}
              </div>
            </dl>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Zool%C3%B3gico+La+Totorilla+Huamanga+Ayacucho"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-heading text-sm font-bold text-[#0e3d24] transition-all hover:-translate-y-0.5"
              >
                Cómo llegar
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/mapa"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-6 py-2.5 font-heading text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white"
              >
                <MapPinIcon className="size-4" />
                Ver mapa del zoológico
              </Link>
            </div>
          </section>

          <section aria-label="Cómo es la visita" className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-stone-900">
              <PawIcon className="size-5 text-jungle" />
              Tu visita paso a paso
            </h2>
            <ol className="mt-4 space-y-4">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-3">
                  <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-jungle font-heading text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-heading text-[15px] font-bold text-stone-900">{s.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed font-medium text-stone-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/fauna"
          className="group inline-flex items-center gap-2 rounded-full border-2 border-jungle/40 px-7 py-3 font-heading text-[15px] font-semibold text-jungle transition-all hover:-translate-y-0.5 hover:border-jungle"
        >
          Conoce nuestra fauna
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  )
}

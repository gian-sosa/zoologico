import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, LeafIcon, MapPinIcon, PawIcon, TicketIcon } from '../components/icons'
import { getTicketTypes } from '../features/tickets/prices.store'
import { SITE } from '../shared/config/site'

const quickCards = [
  {
    to: '/fauna',
    chip: 'bg-[#7cb342] text-white',
    card: 'bg-[#f1f8d8]',
    icon: <PawIcon />,
    title: 'Conoce nuestra fauna',
    img: '/monochoro.webp',
    alt: 'Mono choro',
  },
  {
    to: '/entradas',
    chip: 'bg-[#b07a3b] text-white',
    card: 'bg-[#faf3e3]',
    icon: <LeafIcon className="size-5" />,
    title: 'Explora el parque',
    img: '/leon.webp',
    alt: 'León',
  },
  {
    to: '/blog',
    chip: 'bg-[#42a5f5] text-white',
    card: 'bg-[#e8f4fe]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Vive nuestras experiencias',
    img: '/pingu.webp',
    alt: 'Pingüino',
  },
  {
    to: '/entradas',
    chip: 'bg-[#e3a008] text-white',
    card: 'bg-[#fef6d8]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    ),
    title: 'Horarios y tarifas',
    img: '/mono.png',
    alt: 'Mono',
  },
]

const pillars = [
  {
    dot: 'bg-[#7cb342]',
    title: 'Rescate y rehabilitación',
    text: 'Acogemos animales víctimas del tráfico ilegal con cuidado veterinario especializado.',
  },
  {
    dot: 'bg-[#b07a3b]',
    title: 'Educación ambiental',
    text: 'Visitas guiadas, talleres y material educativo para una Ayacucho más consciente.',
  },
  {
    dot: 'bg-[#42a5f5]',
    title: 'Conservación local',
    text: 'Protegemos fauna andina y amazónica promoviendo el respeto por la vida silvestre.',
  },
]

export default function HomePage() {
  const tariffs = useMemo(getTicketTypes, [])

  return (
    <main className="bg-cream">
      {/* HERO full-bleed — móvil (<md): portada vertical; md–lg: recorte al 50%
          (mitad izquierda, anclado a la izquierda); lg+: panorámica 2.5:1 completa */}
      <section aria-label="Bienvenida al Parque Zoológico La Totorilla" className="relative flex min-h-[100svh] w-full items-end overflow-hidden md:aspect-[1.25/1] md:min-h-0 lg:aspect-[2.5/1]">
        <h1 className="sr-only">Parque Zoológico La Totorilla — Un refugio de vida silvestre en los Andes, Ayacucho Perú</h1>
        <picture className="absolute inset-0">
          <source media="(min-width: 768px)" srcSet="/portada1.png" />
          <img
            src="/portada3-moviles.png"
            alt="Portada ilustrada de la entrada del Zoológico La Totorilla con fauna andina"
            className="h-full w-full object-cover object-top md:object-right lg:object-center"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {/* Legibilidad solo abajo, sin tapar la ilustración */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-black/10" />

        {/* Contenido inferior: jerarquía clara, responsive */}
        <div className="relative mx-auto w-full max-w-6xl px-4 pt-32 pb-24 sm:px-6 sm:pb-28 md:pt-24 md:pb-20">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1.5 pr-3.5 pl-1.5 text-xs font-extrabold text-stone-800 shadow-lg backdrop-blur sm:pr-4 sm:text-[13px]">
                <span className="grid size-6 place-items-center rounded-full bg-jungle text-white sm:size-7">
                  <MapPinIcon className="size-3.5 sm:size-4" />
                </span>
                Ayacucho
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1.5 pr-3.5 pl-1.5 text-xs font-extrabold text-stone-800 shadow-lg backdrop-blur sm:pr-4 sm:text-[13px]">
                <span className="grid size-6 place-items-center rounded-full bg-jungle text-white sm:size-7">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-3.5 sm:size-4">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <span className="hidden min-[400px]:inline">Lun-Dom · 8am-6pm</span>
                <span className="min-[400px]:hidden">8:00 a.m. - 6:00 p.m.</span>
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/entradas"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-jungle px-7 py-3.5 font-heading text-[15px] font-semibold tracking-wide text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-jungle-deep hover:shadow-2xl sm:w-auto"
              >
                <TicketIcon className="size-5" />
                Comprar entradas
                <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/fauna"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/80 bg-white px-7 py-3 font-heading text-[15px] font-semibold tracking-wide text-jungle shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:shadow-2xl sm:w-auto"
              >
                Conoce nuestra fauna
                <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESOS RÁPIDOS — tarjetas superpuestas al hero */}
      <section aria-label="Accesos rápidos" className="relative z-10 mx-auto -mt-12 max-w-6xl px-3 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className={`group flex items-center gap-3 overflow-hidden rounded-2xl border border-black/5 ${card.card} p-3 pr-0 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
            >
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${card.chip}`}>{card.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-[14px] leading-tight font-semibold text-stone-800">{card.title}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-bold text-stone-500 transition-colors group-hover:text-jungle">
                  Ver más <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </span>
              <img src={card.img} alt={card.alt} loading="lazy" className="h-[72px] w-[72px] shrink-0 self-stretch rounded-l-2xl object-cover" />
            </Link>
          ))}
        </div>
      </section>

      {/* PROPÓSITO */}
      <section aria-labelledby="proposito-heading" className="mx-auto max-w-6xl px-4 pt-14 pb-4 sm:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-primary uppercase">
              <LeafIcon className="size-3.5" /> Nuestro propósito
            </p>
            <h2 id="proposito-heading" className="mt-3 font-heading text-4xl leading-[1.05] font-semibold text-balance text-stone-900 sm:text-[2.75rem]">
              Conservación, educación y recreación <span className="text-[#5a8f2a]">para todos</span>
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed font-medium text-stone-600 lg:pt-10">
            El Zoológico La Totorilla es un centro ecológico recreacional dedicado a la conservación de la fauna, la
            educación ambiental y la recreación familiar, promoviendo el respeto y cuidado de la vida silvestre en los Andes.
          </p>
          <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-[#f1f0e4] p-5 text-center lg:pt-10">
            {[
              { icon: <PawIcon />, big: '+30', small: 'Especies' },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                ),
                big: 'Miles',
                small: 'de visitantes',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6"><path d="M12 22v-7m0 0c-4 0-7-2.5-7-7 3.5 0 6 1.5 7 4 1-2.5 3.5-4 7-4 0 4.5-3 7-7 7Z" /><path d="M12 15V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                ),
                big: 'Áreas verdes',
                small: 'y senderos',
              },
            ].map((s) => (
              <div key={s.big} className="flex flex-col items-center gap-1 text-jungle">
                {s.icon}
                <dt className="sr-only">{s.small}</dt>
                <dd className="font-heading text-lg leading-tight font-semibold text-stone-900">{s.big}</dd>
                <dd className="text-[13px] leading-tight font-bold text-stone-600">{s.small}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Pilares — aireados, no recargados */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.title} className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
              <span className={`inline-block size-2.5 rounded-full ${p.dot}`} />
              <h3 className="mt-3 font-heading text-xl font-semibold text-stone-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed font-medium text-stone-600">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* PLANIFICA TU VISITA */}
      <section aria-labelledby="visita-heading" id="visita" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
        <h2 id="visita-heading" className="text-center font-heading text-3xl font-semibold text-stone-900 sm:text-4xl">
          Planifica tu visita
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[15px] font-medium text-stone-600">
          Horarios, tarifas y cómo llegar. Todo lo esencial en un solo vistazo.
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-stone-400 uppercase">Horario</p>
            <p className="mt-1 font-heading text-lg font-semibold text-stone-900">{SITE.hours}</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm">
            <p className="text-xs font-extrabold tracking-widest text-stone-400 uppercase">Ubicación</p>
            <p className="mt-1 inline-flex items-center justify-center gap-1 font-heading text-lg font-semibold text-stone-900">
              <MapPinIcon className="size-4 shrink-0 text-primary" /> {SITE.addressShort}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl rounded-3xl bg-jungle p-8 text-white shadow-lg">
          <h3 className="text-center font-heading text-xl font-semibold">Tarifas de ingreso</h3>
          <ul className="mt-4 divide-y divide-white/15">
            {tariffs.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-[15px] font-bold">{t.name}</p>
                  <p className="mt-0.5 text-[13px] font-medium text-white/70">{t.description}</p>
                </div>
                <span className="shrink-0 rounded-full bg-sun px-4 py-1.5 font-heading text-lg font-semibold text-stone-900">
                  S/ {t.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 text-center">
            <Link
              to="/entradas"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-heading text-sm font-semibold text-jungle shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Comprar entradas online <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section aria-labelledby="explora-heading" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-jungle to-[#1a6b3c] p-8 text-center text-white shadow-xl sm:p-12">
          <h2 id="explora-heading" className="mx-auto max-w-xl font-heading text-3xl font-semibold text-balance sm:text-4xl">
            ¿Listo para una aventura en los Andes?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] font-medium text-white/80">
            Cada entrada apoya el rescate y cuidado de nuestra fauna. Ven con tu familia este fin de semana.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/entradas"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun px-8 py-3.5 font-heading text-[15px] font-semibold text-stone-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              <TicketIcon className="size-5" /> Comprar entradas
            </Link>
            <Link
              to="/blog"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-3 font-heading text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white sm:w-auto"
            >
              Ver experiencias
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

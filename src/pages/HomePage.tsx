import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LeafIcon, MapPinIcon } from '../components/icons'
import { getParkingTypes, getTicketTypes, formatTariff } from '../features/tickets/prices.store'
import { ZOO_HISTORY } from '../features/zoo/history.data'

const heroFeatures = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7 text-[#2e7d32]">
        <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16Z" />
      </svg>
    ),
    title: 'Conservación',
    text: 'Protegemos nuestra fauna',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7 text-[#f5a623]">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" opacity=".9" />
        <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5H6.5A2.5 2.5 0 0 1 4 19.5Z" />
        <path d="M9 7h7M9 11h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: 'Educación',
    text: 'Aprendizaje para todos',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7 text-[#2e7d32]">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2h16Z" />
        <circle cx="9" cy="7" r="3.5" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M15.5 3.6a3.5 3.5 0 0 1 0 6.8" />
        <circle cx="17.5" cy="8" r="2.6" opacity=".7" />
      </svg>
    ),
    title: 'Diversión familiar',
    text: 'Vive momentos inolvidables',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7 text-[#2e7d32]">
        <path d="m12 2 9 18H3l9-18Z" opacity=".9" />
        <path d="m12 9 4.5 9h-9L12 9Z" fill="#fff" />
      </svg>
    ),
    title: 'Entorno natural',
    text: 'Aire puro en los Andes',
  },
]

const experiencePoints = [
  {
    iconBg: 'bg-[#ffe3d3]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6 text-[#d7532a]">
        <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-2.3 0-7 1.2-7 3.5V20h14v-2.5c0-2.3-4.7-3.5-7-3.5ZM8 14c-.5 0-1 0-1.5.1A4.5 4.5 0 0 0 2 18.5V20h6v-2.5c0-1.3.7-2.3 1.7-3A8 8 0 0 0 8 14Z" />
      </svg>
    ),
    title: 'Para toda la familia',
    text: 'Diversión y aprendizaje para todas las edades.',
  },
  {
    iconBg: 'bg-[#dff0c8]',
    icon: <LeafIcon className="size-6 text-[#4a7d12]" />,
    title: 'Aprende jugando',
    text: 'Talleres, charlas y recorridos guiados.',
  },
  {
    iconBg: 'bg-[#ffd9d9]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6 text-[#d92d20]">
        <path d="M12 21s-7.5-4.7-10-9.3C.4 8.6 2.4 5 5.8 5c2 0 3.4 1.1 4.2 2.3h4c.8-1.2 2.2-2.3 4.2-2.3 3.4 0 5.4 3.6 3.8 6.7C19.5 16.3 12 21 12 21Z" transform="scale(0.95) translate(1 0)" />
      </svg>
    ),
    title: 'Contribuyes',
    text: 'Tu visita apoya la conservación de especies.',
  },
]

const visitorRules = [
  'Está prohibido el ingreso de mascotas.',
  'Está prohibido alimentar a los animales.',
  'Debe respetar las señalizaciones del circuito.',
  'Deposite los residuos sólidos en los recipientes destinados.',
  'Conserve el boleto durante su visita.',
  'El Zoológico NO se hace responsable del cuidado de los niños.',
]

export default function HomePage() {
  const tariffs = useMemo(getTicketTypes, [])
  const parking = useMemo(getParkingTypes, [])

  return (
    <main className="bg-cream">
      {/* HERO — banner.png a pantalla completa */}
      <section aria-label="Bienvenida al Zoológico La Totorilla" className="relative w-full overflow-hidden">
        <h1 className="sr-only">Zoológico La Totorilla — Vive una experiencia única en Ayacucho</h1>
        <div className="absolute inset-0">
          <img
            src="/banner.png"
            alt="Llama sonriendo en los Andes ayacuchanos"
            className="h-full w-full object-cover object-[70%_center] sm:object-center"
            loading="eager"
            fetchPriority="high"
          />
          {/* Luz suave a la izquierda para legibilidad */}
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-white/85 via-white/45 to-transparent sm:from-white/80 sm:via-white/30" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-cream to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl gap-8 px-4 pt-32 pb-20 sm:px-6 md:pt-36 lg:items-center lg:pt-40 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.14em] text-jungle uppercase shadow-sm backdrop-blur">
              <span className="text-[#4a7d12]"></span> Ayacucho
            </p>
            <p className="w-[60%] mt-5 font-heading text-[2.4rem] leading-[1.02] font-bold text-balance text-stone-900 sm:text-6xl">
              Vive una experiencia única en el
              <span className="block text-[#4a7d12]">Zoológico La Totorilla</span>
            </p>
            <p className="w-[60%] mt-4 max-w-md text-[15px] leading-relaxed font-medium text-stone-700">
              Un refugio de vida silvestre en los Andes, donde la conservación, la educación y la
              recreación se unen para toda la familia.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/entradas"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0e3d24] px-7 py-3.5 font-heading text-[15px] font-semibold text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-jungle-deep"
              >
                Ver tarifas de ingreso
              </Link>
              <a
                href="#visita"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-jungle/60 bg-white/90 px-7 py-3 font-heading text-[15px] font-semibold text-jungle shadow-lg backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-jungle"
              >
                Planifica tu visita
              </a>
            </div>
        </div>

        {/* Curva inferior */}
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" className="relative block h-10 w-full text-cream sm:h-14">
          <path d="M0 48C240 8 480 0 720 20s480 28 720 0v44H0V48Z" fill="currentColor" />
        </svg>
      </section>

      {/* TIRA DE VALORES — superpuesta al hero */}
      <section aria-label="Lo que nos distingue" className="relative z-10 mx-auto -mt-4 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-[1.75rem] border border-black/5 bg-white px-6 py-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] lg:grid-cols-4">
          {heroFeatures.map((f, i) => (
            <div key={f.title} className={`flex items-center gap-3 ${i > 0 ? 'lg:border-l lg:border-stone-200 lg:pl-6' : ''}`}>
              <span className="shrink-0">{f.icon}</span>
              <span>
                <span className="block font-heading text-[15px] font-bold text-stone-900">{f.title}</span>
                <span className="block text-[13px] font-medium text-stone-500">{f.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* HISTORIA */}
      <section aria-labelledby="historia-heading" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* Imagen + badges */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-4xl shadow-xl">
              <img
                src="/entrada.jpg"
                alt="Vista del Zoológico La Totorilla en los Andes de Ayacucho"
                loading="lazy"
                className="aspect-4/3 w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
            </div>
            <p className="absolute top-4 left-4 rounded-full bg-white/95 px-4 py-2 font-heading text-xs font-bold text-jungle shadow-lg backdrop-blur">
              Desde {ZOO_HISTORY.foundedYear} · Ayacucho
            </p>
            <p className="absolute bottom-4 left-4 rounded-2xl bg-[#0e3d24]/95 px-4 py-3 font-heading text-[13px] leading-snug font-bold text-white shadow-lg backdrop-blur">
              {ZOO_HISTORY.affiliation}
            </p>
          </div>

          {/* Texto + misión / visión */}
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.2em] text-[#4a7d12] uppercase">Nuestra historia</p>
            <h2 id="historia-heading" className="mt-2 font-heading text-[2rem] leading-[1.05] font-bold text-balance text-stone-900 sm:text-4xl">
              {ZOO_HISTORY.title}
            </h2>
            {ZOO_HISTORY.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-3 text-[15px] leading-relaxed font-medium text-stone-600">
                {p}
              </p>
            ))}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="flex items-center gap-2 font-heading text-[15px] font-bold text-stone-900">
                  <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[#dff0c8] text-[#4a7d12]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
                    </svg>
                  </span>
                  Misión
                </p>
                <p className="mt-2 text-[13px] leading-relaxed font-medium text-stone-600">{ZOO_HISTORY.mission}</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="flex items-center gap-2 font-heading text-[15px] font-bold text-stone-900">
                  <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[#ffe3d3] text-[#d7532a]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  Visión
                </p>
                <p className="mt-2 text-[13px] leading-relaxed font-medium text-stone-600">{ZOO_HISTORY.vision}</p>
              </div>
            </div>

            <ul className="mt-3 flex flex-wrap gap-2">
              {ZOO_HISTORY.values.map((v) => (
                <li key={v.title} title={v.text} className="rounded-full bg-[#0e3d24]/5 border border-jungle/15 px-4 py-2 text-[13px] font-bold text-jungle">
                  {v.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline: 1 col móvil · 2 cols tablet · 4 cols desktop */}
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ZOO_HISTORY.milestones.map((m, i) => (
            <li key={m.year + m.title} className="relative rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <span aria-hidden="true" className="absolute top-5 right-5 font-heading text-3xl font-bold text-stone-100">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="inline-block rounded-full bg-sun px-3 py-1 font-heading text-xs font-bold text-stone-900">
                {m.year}
              </span>
              <p className="mt-3 font-heading text-[15px] font-bold text-stone-900">{m.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed font-medium text-stone-600">{m.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/fauna"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-jungle/40 px-7 py-3 font-heading text-sm font-semibold text-jungle transition-all hover:-translate-y-0.5 hover:border-jungle hover:bg-white sm:w-auto"
          >
            Conoce nuestra fauna
          </Link>
          <Link
            to="/entradas"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-jungle px-7 py-3 font-heading text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-jungle-deep sm:w-auto"
          >
            Planifica tu visita
          </Link>
        </div>
      </section>

      {/* EXPERIENCIA */}
      <section aria-labelledby="experiencia-heading" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] lg:grid-cols-[1fr_1.1fr]">
          {/* Imagen */}
          <div className="relative">
            <img
              src="/portada1-moviles.png"
              alt="Familia visitando el zoológico"
              loading="lazy"
              className="aspect-16/10 h-full w-full object-cover lg:aspect-auto lg:min-h-105"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-white/10" />
            <p className="absolute top-4 left-4 rounded-full bg-[#0e3d24]/95 px-4 py-2 text-center font-heading text-[13px] leading-tight font-bold text-white shadow-lg backdrop-blur">
              <span aria-hidden="true" className="mr-1 text-[#f5d76e]">✦</span>
              Momentos que conectan
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-[11px] font-extrabold tracking-[0.2em] text-[#8a6d3b] uppercase">Una experiencia para todos</p>
            <h2 id="experiencia-heading" className="mt-2 font-heading text-[1.65rem] leading-[1.1] font-bold text-balance text-stone-900 sm:text-4xl">
              Más que una visita, una conexión con la <span className="text-[#4a7d12]">naturaleza</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed font-medium text-stone-600 sm:text-[15px]">
              Disfruta de un espacio seguro, educativo y recreativo, ideal para pasar tiempo en
              familia, aprender sobre la vida silvestre y relajarte en un entorno natural privilegiado.
            </p>
            <ul className="mt-6 grid gap-3">
              {experiencePoints.map((p) => (
                <li key={p.title} className="flex items-start gap-4 rounded-2xl bg-cream p-4 sm:items-center sm:p-4">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-full ${p.iconBg}`}>{p.icon}</span>
                  <span className="min-w-0">
                    <span className="block font-heading text-[15px] font-bold text-stone-900">{p.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug font-medium text-stone-500">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/fauna"
                className="inline-flex w-full items-center justify-center rounded-full bg-jungle px-6 py-3 font-heading text-sm font-semibold text-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-jungle-deep sm:w-auto"
              >
                Descubre la fauna
              </Link>
              <Link
                to="/mapa"
                className="inline-flex w-full items-center justify-center rounded-full border border-jungle/40 px-6 py-3 font-heading text-sm font-semibold text-jungle transition-all duration-200 hover:-translate-y-0.5 hover:border-jungle hover:bg-white sm:w-auto"
              >
                Ver mapa del zoo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VISITA + TARIFAS */}
      <section aria-labelledby="visita-heading" id="visita" className="relative overflow-hidden">
        {/* Fondo: franja de montañas reutilizando el banner con velo crema */}
        <div aria-hidden="true" className="absolute inset-0">
          <img src="/banner.png" alt="" className="h-full w-full object-cover object-bottom" loading="lazy" />
          <div className="absolute inset-0 bg-cream/60" />
          <div className="absolute inset-0 bg-linear-to-b from-cream via-transparent to-cream" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[1.75rem] bg-[#0e3d24] p-7 text-white shadow-[0_24px_60px_-20px_rgba(8,52,35,0.7)] sm:p-8">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d9f99d" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="size-6">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </span>
              <div>
                <h2 id="visita-heading" className="font-heading text-2xl font-bold sm:text-[1.7rem]">
                  Planifica tu visita
                </h2>
                <p className="mt-1 text-sm leading-relaxed font-medium text-white/70">
                  Horarios, tarifas y cómo llegar. Todo lo que necesitas para vivir una gran experiencia.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-[#d9f99d] uppercase">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-4">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  Horario
                </p>
                <p className="mt-1.5 font-heading text-[15px] leading-snug font-bold">Lunes a Domingo<br />8:00 am a 6:00 pm</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-[#d9f99d] uppercase">
                  <MapPinIcon className="size-4" />
                  Ubicación
                </p>
                <p className="mt-1.5 font-heading text-[15px] leading-snug font-bold">Vía Evitamiento,<br />Huamanga, Ayacucho</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-4 sm:col-span-2">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-[#d9f99d] uppercase">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2.5" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
                Pago en boletería
              </p>
              <p className="mt-1.5 text-sm leading-relaxed font-medium text-white/80">
                Las entradas se venden <strong className="text-white">solo en boletería y en efectivo</strong>.
                No hay venta ni reserva online.
              </p>
            </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 p-5">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-[#d9f99d] uppercase">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
                  <path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Normativa del visitante
              </p>
              <ul className="mt-3 space-y-2.5">
                {visitorRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-sm leading-snug font-medium text-white/85">
                    <span aria-hidden="true" className="mt-1.75 size-1.5 shrink-0 rounded-full bg-[#d9f99d]" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-black/5 bg-white p-7 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)] sm:p-8">
            <h3 className="flex items-center gap-2 font-heading text-xl font-bold text-stone-900">
              <span className="grid size-9 place-items-center rounded-xl bg-jungle text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                  <path d="M21.4 11.6 12.4 2.6A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .6 1.4l9 9a2 2 0 0 0 2.8 0l7-7a2 2 0 0 0 0-2.8ZM9 12a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                </svg>
              </span>
              Tarifas de ingreso
            </h3>
            <ul className="mt-5 divide-y divide-stone-100">
              {tariffs.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                  <p className="text-[15px] font-bold text-stone-900">{t.name}</p>
                  <span className="shrink-0 rounded-full bg-sun px-4 py-1.5 font-heading text-[15px] font-bold text-stone-900">
                    {formatTariff(t.price)}
                  </span>
                </li>
              ))}
            </ul>
            <h4 className="mt-5 font-heading text-[15px] font-bold text-stone-900">Parqueo vehicular</h4>
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
            <div className="mt-4 rounded-2xl bg-cream p-5">
              <p className="font-heading text-[15px] font-bold text-stone-900">
                ¿Vienes de visita con tus estudiantes?
              </p>
              <p className="mt-1 text-[13px] leading-relaxed font-medium text-stone-600">
                Accede a un descuento especial para instituciones educativas públicas.
              </p>
              <Link
                to="/mesadepartes"
                className="group mt-3 inline-flex items-center gap-2 rounded-full bg-jungle px-6 py-2.5 font-heading text-sm font-semibold text-white shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-jungle-deep"
              >
                Solicitar descuento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section aria-labelledby="explora-heading" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-4xl bg-linear-to-br from-jungle to-[#1a6b3c] p-8 text-center text-white shadow-xl sm:p-12">
          <h2 id="explora-heading" className="mx-auto max-w-xl font-heading text-3xl font-semibold text-balance sm:text-4xl">
            ¿Listo para una aventura con la naturaleza?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] font-medium text-white/80">
            Cada entrada apoya el rescate y cuidado de nuestra fauna. Ven con tu familia o amigos cualquier día de la semana.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/entradas"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun px-8 py-3.5 font-heading text-[15px] font-semibold text-stone-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              Planifica tu visita
            </Link>
            <Link
              to="/fauna"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-3 font-heading text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white sm:w-auto"
            >
              Ver especies
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

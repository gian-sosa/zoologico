import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, LeafIcon, MapPinIcon, TicketIcon } from '../components/icons'
import { PawIcon } from '../components/icons'
import { getTicketTypes } from '../features/tickets/prices.store'
import { SITE } from '../shared/config/site'

const pillars = [
  {
    title: 'Rescate y rehabilitación',
    text: 'Acogemos animales víctimas del tráfico ilegal y les brindamos cuidado veterinario hasta su recuperación.',
  },
  {
    title: 'Educación ambiental',
    text: 'Visitas guiadas para colegios, talleres y material educativo para formar una Ayacucho más consciente.',
  },
  {
    title: 'Conservación local',
    text: 'Protegemos fauna andina y amazónica, promoviendo la convivencia respetuosa entre comunidad y naturaleza.',
  },
]

const visitInfo = [
  { label: 'Horario', value: SITE.hours },
  { label: 'Ubicación', value: SITE.addressShort },
]

const rules = [
  'No alimentes a los animales: cada especie tiene una dieta supervisada por veterinarios.',
  'Mantén la distancia de las rejas y no toques a los animales.',
  'No uses flash en recintos cerrados ni hagas ruidos fuertes.',
  'Deposita la basura en los tachos y cuida las áreas verdes.',
]

const exploreCards = [
  {
    to: '/fauna',
    icon: <PawIcon />,
    title: 'Nuestra fauna',
    text: 'Fichas interactivas de cada especie: datos, curiosidades y quiz.',
    cta: 'Ver fauna',
  },
  {
    to: '/entradas',
    icon: <TicketIcon className="size-5" />,
    title: 'Compra tus entradas',
    text: 'Evita la cola en boletería. Elige la fecha 100% online.',
    cta: 'Comprar entradas',
  },
  {
    to: '/blog',
    icon: <LeafIcon className="size-5" />,
    title: 'Blog',
    text: 'Comparte tus fotos de visita en el muro del blog Totorilla.',
    cta: 'Compartir mi foto',
  },
]

export default function HomePage() {
  const tariffs = useMemo(getTicketTypes, [])

  return (
    <main>
      {/* Hero institucional */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center sm:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <LeafIcon className="size-4 text-primary" />
          Ayacucho · Desde 2001
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
          Parque Zoológico <span className="text-primary">La Totorilla</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Un centro de rescate y educación ambiental a pocos minutos del centro de Huamanga.
          Cada visita apoya el cuidado de la fauna peruana.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <Link
            to="/entradas"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90"
          >
            Comprar entradas
            <ArrowRightIcon />
          </Link>
          <Link
            to="/fauna"
            className="rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
          >
            Conoce nuestra fauna
          </Link>
        </div>

        {/* Portada bienvenida - entrada principal */}
        <figure className="relative mt-10 overflow-hidden rounded-3xl border border-border shadow-xl shadow-green-950/10 sm:mt-12 sm:rounded-[2rem]">
          <img
            src="/portada-bienvenida.webp"
            alt="Entrada principal del Parque Zoológico La Totorilla, con animales y cuidadores dando la bienvenida a los visitantes"
            className="h-[280px] w-full object-cover sm:h-[420px] lg:h-[520px]"
            loading="eager"
            fetchPriority="high"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 text-left sm:flex-row sm:items-end sm:justify-between sm:p-7">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                <MapPinIcon className="size-3.5" />
                Entrada principal
              </p>
            </div>
          </figcaption>
        </figure>
      </section>

      {/* Quiénes somos */}
      <section aria-labelledby="about-heading" className="border-y border-border bg-muted/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 id="about-heading" className="text-center font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Un refugio de vida silvestre en los Andes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted-foreground">
            El Parque Zoológico La Totorilla nació como centro de acogida para animales rescatados
            del tráfico ilegal de fauna. Hoy es un espacio de encuentro entre la comunidad
            ayacuchana y la naturaleza: más de 30 especies conviven en hábitats cuidados
            mientras inspiramos a nuevas generaciones.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pillars.map((item) => (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-8">
                <h3 className="font-heading text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Información de visita */}
      <section aria-labelledby="visit-heading">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 id="visit-heading" className="text-center font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Planifica tu visita
          </h2>
         
          {/* Horario + ubicación */}
          <dl className="mx-auto mt-10 grid max-w-3xl gap-4 text-center sm:grid-cols-2">
            {visitInfo.map((info) => (
              <div key={info.label} className="rounded-3xl border border-border bg-card p-6">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{info.label}</dt>
                <dd className="mt-1 inline-flex items-center justify-center gap-1 font-heading font-semibold text-foreground">
                  {info.label === 'Ubicación' && <MapPinIcon className="size-4 shrink-0 text-primary" />}
                  {info.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Tarifario */}
          <div className="mx-auto mt-4 max-w-3xl rounded-3xl border border-border bg-card p-8">
            <h3 className="text-center font-heading text-base font-semibold text-foreground">Tarifas de ingreso</h3>
            <ul className="mt-4 divide-y divide-border">
              {tariffs.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  <span className="shrink-0 font-heading text-lg font-bold text-primary">
                    S/ {t.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <Link
                to="/entradas"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 hover:translate-x-0.5"
              >
                Comprar entradas online
                <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-4 grid max-w-3xl gap-4 rounded-3xl border border-border bg-card p-8 sm:grid-cols-2">
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">Cómo llegar</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Estamos en {SITE.address}. Las combis y colectivos que salen del mercado Nery García
                pasan por la Vía Evitamiento cada 20 minutos. También puedes llegar en taxi
                (S/ 12 aprox.) o en auto particular con cochera gratuita.
              </p>
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">Servicios</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>Visitas guiadas para colegios (previa reserva)</li>
                <li>Zona de picnic, cafetería y tienda de recuerdos</li>
                <li>Acceso para sillas de ruedas en el circuito principal</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Normas */}
      <section aria-labelledby="rules-heading" className="border-t border-border bg-muted/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 id="rules-heading" className="text-center font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Normas del visitante
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center leading-relaxed text-muted-foreground">
            Tu comportamiento protege a los animales. Ten en cuenta estas reglas durante tu visita.
          </p>
          <ol className="mx-auto mt-8 grid max-w-3xl gap-3">
            {rules.map((rule, i) => (
              <li key={rule} className="flex gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft font-heading text-sm font-bold text-primary">
                  {i + 1}
                </span>
                {rule}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Explora */}
      <section aria-labelledby="explore-heading">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 id="explore-heading" className="text-center font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Explora el zoológico
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {exploreCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="group rounded-3xl border border-border bg-card p-8 transition-colors duration-200 hover:border-primary/40 hover:bg-primary-soft/30"
              >
                <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
                  {card.icon}
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                  {card.cta}
                  <ArrowRightIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

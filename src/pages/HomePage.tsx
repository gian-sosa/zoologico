import { Link } from 'react-router-dom'
import { animals } from '../data/animals'
import AnimalCard from '../components/AnimalCard'
import PhotoWall from '../components/PhotoWall'
import { ArrowRightIcon, LeafIcon, MapPinIcon } from '../components/icons'

const infoHighlights = [
  {
    title: 'Nuestra misión',
    text: 'Proteger la fauna peruana mediante rescate, rehabilitación y educación ambiental para las familias de Ayacucho.',
  },
  {
    title: 'Más de 30 especies',
    text: 'Desde felinos y primates hasta aves andinas: conviven especies locales e internacionales en hábitats cuidados.',
  },
  {
    title: 'Educación para todos',
    text: 'Programas guiados para colegios, talleres de conservación e infografías interactivas como esta página web.',
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center sm:pt-28">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <LeafIcon className="size-4 text-primary" />
          Educación · Conservación · Naturaleza
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
          Conoce a los animales del{' '}
          <span className="text-primary">Zoológico de Totorilla</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Un refugio de vida silvestre en Ayacucho, Perú. Explora infografías interactivas,
          aprende sobre cada especie y comparte tus fotos de visita.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={() => document.getElementById('animales')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90"
          >
            Ver animales
            <ArrowRightIcon />
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('fotos')?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
          >
            Comparte tu foto
          </button>
        </div>
      </section>

      {/* Sobre el zoológico */}
      <section aria-labelledby="about-heading" className="border-y border-border bg-muted/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 id="about-heading" className="text-center font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Sobre el Zoológico de Totorilla
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted-foreground">
            Ubicado a pocos minutos de la ciudad de Huamanga, el zoológico de Totorilla nació
            como un centro de acogida para animales rescatados del tráfico ilegal de fauna.
            Hoy es un espacio de encuentro entre la comunidad ayacuchana y la naturaleza:
            un lugar donde cada visita apoya la conservación.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {infoHighlights.map((item) => (
              <article key={item.title} className="rounded-3xl border border-border bg-card p-8">
                <h3 className="font-heading text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>

          <dl className="mx-auto mt-10 grid max-w-3xl gap-4 text-center sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Horario</dt>
              <dd className="mt-1 font-heading font-semibold text-foreground">Mar – Dom · 9:00–17:00</dd>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entrada general</dt>
              <dd className="mt-1 font-heading font-semibold text-foreground">S/ 5 · niños S/ 2</dd>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cómo llegar</dt>
              <dd className="mt-1 inline-flex items-center gap-1 font-heading font-semibold text-foreground">
                <MapPinIcon className="size-4 text-primary" />
                Totorilla, Huamanga
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Animales */}
      <section id="animales" aria-labelledby="animals-heading" className="scroll-mt-24">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="animals-heading" className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                Nuestras especies destacadas
              </h2>
              <p className="mt-2 max-w-lg leading-relaxed text-muted-foreground">
                Entra a la ficha de cada animal y descubre su infografía interactiva.
              </p>
            </div>
            <Link
              to="/animales"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 hover:translate-x-0.5 sm:inline-flex"
            >
              Ver todos
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {animals.map((animal) => (
              <AnimalCard key={animal.slug} animal={animal} />
            ))}
          </div>
        </div>
      </section>

      {/* Muro de fotos */}
      <section className="border-t border-border bg-muted/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <PhotoWall />
        </div>
      </section>
    </main>
  )
}

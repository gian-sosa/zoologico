import { Navigate, useParams, Link } from 'react-router-dom'
import { getAnimalBySlug, getOtherAnimals } from '../features/animals/animals.service'
import AnimalSound from '../components/AnimalSound'
import FlipFact from '../components/FlipFact'
import Quiz from '../components/Quiz'
import NotFoundPage from './NotFoundPage'
import { ArrowRightIcon, PawIcon } from '../components/icons'

export default function AnimalPage() {
  const { slug } = useParams<{ slug: string }>()
  const animal = slug ? getAnimalBySlug(slug) : undefined

  if (slug && !animal) return <NotFoundPage />
  if (!animal) return <Navigate to="/" replace />

  const others = getOtherAnimals(animal.slug)

  return (
    <main>
      {/* Hero de la infografía */}
      <section
        className="relative max-w-[2560px] m-auto overflow-hidden"
        style={
          animal.heroImage
            ? {
                backgroundImage: `url(${animal.heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
              }
            : { backgroundColor: animal.accentSoftHex }
        }
      >
        {animal.heroImage && (
          <div
            className="absolute inset-0"
            aria-hidden="true"
          />
        )}
        <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <span
              className="grid size-24 shrink-0 place-items-center rounded-3xl text-white shadow-sm"
              style={{ backgroundColor: animal.accentHex }}
              aria-hidden="true"
            >
              <PawIcon className="size-12" />
            </span>
            <div>
              
              <h1
                className={`mt-1 font-heading text-4xl font-bold tracking-tight sm:text-5xl ${
                  animal.heroImage ? 'text-white' : 'text-foreground'
                }`}
              >
                {animal.name}
              </h1>
              <p
                className={`mt-2 font-body text-lg italic ${
                  animal.heroImage ? 'text-white/85' : 'text-muted-foreground'
                }`}
              >
                {animal.scientificName}
              </p>
              <span
                className="mt-4 inline-block rounded-full bg-card px-4 py-1.5 text-xs font-semibold"
                style={{ color: animal.accentHex }}
              >
                Estado de conservación: {animal.conservationStatus}
              </span>
              {animal.soundFile && (
                <span className="block">
                  <AnimalSound
                    key={animal.slug}
                    src={animal.soundFile}
                    label={animal.soundLabel ?? `Escuchar el sonido del ${animal.name.toLowerCase()}`}
                    accentHex={animal.accentHex}
                  />
                </span>
              )}
            </div>
          </div>
          <p
            className={`mt-8 max-w-lg font-body leading-relaxed ${
              animal.heroImage ? 'text-white/90' : 'text-muted-foreground'
            }`}
          >
            {animal.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
        {/* Estadísticas clave */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="font-heading text-2xl font-semibold text-foreground">
            Datos clave
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {animal.stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-border bg-card p-6 text-center">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </dt>
                <dd
                  className="mt-2 font-heading text-xl font-bold sm:text-2xl"
                  style={{ color: animal.accentHex }}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Hábitat y dieta */}
        <section
          aria-labelledby="habitat-diet-heading"
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 id="habitat-diet-heading" className="font-heading text-lg font-semibold text-foreground">
              Hábitat
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {animal.habitat.map((item) => (
                <li
                  key={item}
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  style={{ backgroundColor: animal.accentSoftHex, color: '#1c241e' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8">
            <h3 className="font-heading text-lg font-semibold text-foreground">Alimentación</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {animal.diet.map((item) => (
                <li
                  key={item}
                  className="rounded-full px-4 py-1.5 text-sm font-medium"
                  style={{ backgroundColor: animal.accentSoftHex, color: '#1c241e' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Datos curiosos interactivos */}
        <section aria-labelledby="facts-heading">
          <h2 id="facts-heading" className="font-heading text-2xl font-semibold text-foreground">
            ¿Sabías que…?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Toca cada tarjeta para descubrir el dato completo.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {animal.facts.map((fact, i) => (
              <FlipFact key={fact.title} fact={fact} accentHex={animal.accentHex} index={i} />
            ))}
          </div>
        </section>

        {/* Quiz */}
        <section aria-labelledby="quiz-heading">
          <h2 id="quiz-heading" className="font-heading text-2xl font-semibold text-foreground">
            Pon a prueba lo aprendido
          </h2>
          <p className="mb-6 mt-2 text-sm text-muted-foreground">
            Responde {animal.quiz.length} preguntas sobre el {animal.name.toLowerCase()}.
          </p>
          <Quiz questions={animal.quiz} accentHex={animal.accentHex} />
        </section>

        {/* Otros animales */}
        <section aria-labelledby="others-heading">
          <h2 id="others-heading" className="font-heading text-2xl font-semibold text-foreground">
            Sigue explorando
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((other) => (
              <Link
                to={`/fauna/${other.slug}`}
                className="flex items-center justify-between rounded-3xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span>
                  <span className="block font-heading text-lg font-semibold text-foreground">{other.name}</span>
                  <span className="text-sm italic text-muted-foreground">{other.tagline}</span>
                </span>
                <ArrowRightIcon className="size-5 shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

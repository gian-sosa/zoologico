import { animals } from '../data/animals'
import AnimalCard from '../components/AnimalCard'

export default function AnimalsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Nuestras especies</p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Animales del zoológico
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Cada animal tiene su propia infografía interactiva con datos clave, curiosidades
          y un mini quiz para aprender mientras te diviertes.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {animals.map((animal) => (
          <AnimalCard key={animal.slug} animal={animal} />
        ))}
      </div>
    </main>
  )
}

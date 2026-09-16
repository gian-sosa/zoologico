import { animals } from '../features/animals/animals.service'
import PageHeader from '../shared/components/PageHeader'
import AnimalCard from '../components/AnimalCard'

export default function AnimalsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Nuestras especies"
        title="Animales del zoológico"
        description="Cada animal tiene su propia infografía interactiva con datos clave, curiosidades y un mini quiz para aprender mientras te diviertes."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {animals.map((animal) => (
          <AnimalCard key={animal.slug} animal={animal} />
        ))}
      </div>
    </main>
  )
}

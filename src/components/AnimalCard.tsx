import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Animal } from '../data/animals'
import { ArrowRightIcon, PawIcon } from './icons'

function AnimalCard({ animal }: { animal: Animal }) {
  return (
    <Link
      to={`/animales/${animal.slug}`}
      className="group flex flex-col rounded-3xl border border-border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: animal.accentHex }}
    >
      <span
        className="grid size-14 place-items-center rounded-2xl"
        style={{ backgroundColor: animal.accentSoftHex, color: animal.accentHex }}
        aria-hidden="true"
      >
        <PawIcon className="size-7" />
      </span>

      <h2 className="mt-6 font-heading text-2xl font-semibold text-foreground">{animal.name}</h2>
      <p className="mt-1 text-sm italic text-muted-foreground">{animal.scientificName}</p>
      <p className="mt-4 grow text-sm leading-relaxed text-muted-foreground">{animal.tagline}</p>

      <span
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: animal.accentHex }}
      >
        Ver infografía
        <ArrowRightIcon />
      </span>
    </Link>
  )
}

export default memo(AnimalCard)

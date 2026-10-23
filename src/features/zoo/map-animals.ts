import { MAP_ENCLOSURES, normalizeMapSearch } from './map.data'
import type { MapEnclosure } from './map.data'

export interface MapAnimal {
  id: string
  name: string
  image: string
  enclosures: MapEnclosure[]
  href: string | null
}

// Imágenes provisionales. Añade aquí el nombre normalizado y su imagen definitiva.
const ANIMAL_IMAGES: Record<string, string> = {
  vizcacha: '/leon.webp',
  alpaca: '/pingu.webp',
  vicuna: '/monochoro.webp',
}
const PLACEHOLDER_IMAGES = ['/leon.webp', '/pingu.webp', '/monochoro.webp']
const DISPLAY_NAMES: Record<string, string> = {
  alpacas: 'Alpaca',
  'tigrillo margay': 'Margay',
}

const byName = new Map<string, MapAnimal>()
for (const enclosure of MAP_ENCLOSURES) {
  // Un recinto puede albergar varias especies; una especie puede ocupar varios recintos.
  for (const label of enclosure.name.split('/')) {
    const original = label.trim()
    const name = DISPLAY_NAMES[normalizeMapSearch(original)] ?? original
    const id = normalizeMapSearch(name)
    const existing = byName.get(id)
    if (existing) {
      if (!existing.enclosures.some(({ n }) => n === enclosure.n)) existing.enclosures.push(enclosure)
      if (enclosure.href !== '/404') existing.href ??= enclosure.href
    } else {
      byName.set(id, {
        id, name, enclosures: [enclosure],
        href: enclosure.href === '/404' ? null : enclosure.href,
        image: ANIMAL_IMAGES[id] ?? PLACEHOLDER_IMAGES[byName.size % PLACEHOLDER_IMAGES.length],
      })
    }
  }
}

export const MAP_ANIMALS = [...byName.values()]

export function matchesMapAnimal(animal: MapAnimal, query: string): boolean {
  const normalized = normalizeMapSearch(query)
  return normalizeMapSearch(animal.name).includes(normalized)
    || animal.enclosures.some(({ n }) => String(n) === normalized)
}

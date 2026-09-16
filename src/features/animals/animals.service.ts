import { animals } from '../../data/animals'
import type { Animal } from '../../data/animals'

const bySlug = new Map(animals.map((a) => [a.slug, a]))

export function getAnimalBySlug(slug: string): Animal | undefined {
  return bySlug.get(slug)
}

export function getOtherAnimals(slug: string): Animal[] {
  return animals.filter((a) => a.slug !== slug)
}

export { animals }
export type { Animal }

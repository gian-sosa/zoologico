import { animals } from './animals.data'
import type { Animal } from './animals.data'

const bySlug = new Map(animals.map((a) => [a.slug, a]))

export function getAnimalBySlug(slug: string): Animal | undefined {
  return bySlug.get(slug)
}

export function getOtherAnimals(slug: string): Animal[] {
  return animals.filter((a) => a.slug !== slug)
}

export { animals }
export type { Animal }

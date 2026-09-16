import { load, save } from '../../shared/lib/storage'

export interface VisitorPhoto {
  id: string
  author: string
  dataUrl: string
}

export const PHOTOS_KEY = 'totorilla-visitor-photos'

export function listPhotos(): VisitorPhoto[] {
  return load<VisitorPhoto[]>(PHOTOS_KEY, [])
}

export function persistPhotos(photos: VisitorPhoto[]): void {
  save(PHOTOS_KEY, photos)
}

export function deletePhoto(id: string): VisitorPhoto[] {
  const next = listPhotos().filter((p) => p.id !== id)
  persistPhotos(next)
  return next
}

export function clearPhotos(): VisitorPhoto[] {
  persistPhotos([])
  return []
}

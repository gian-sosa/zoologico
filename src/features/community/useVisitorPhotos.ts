import { useState } from 'react'
import { listPhotos, persistPhotos } from './photos.store'
import type { VisitorPhoto } from './photos.store'
import { fileToCompressedDataUrl } from './image'

export type { VisitorPhoto }

const MAX_BATCH = 6

export function useVisitorPhotos() {
  const [photos, setPhotos] = useState<VisitorPhoto[]>(listPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function addFiles(files: File[], author: string) {
    const images = files.filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) return
    setUploading(true)
    setError('')
    try {
      const added: VisitorPhoto[] = []
      for (const file of images.slice(0, MAX_BATCH)) {
        const dataUrl = await fileToCompressedDataUrl(file)
        added.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          author: author.trim() || 'Visitante anónimo',
          dataUrl,
        })
      }
      setPhotos((prev) => {
        const next = [...added, ...prev]
        persistPhotos(next)
        return next
      })
    } catch {
      setError('No se pudo procesar la imagen. Intenta con otro archivo.')
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id)
      persistPhotos(next)
      return next
    })
  }

  /** Releer desde storage (lo usa el panel admin tras moderar). */
  function refresh() {
    setPhotos(listPhotos())
  }

  return { photos, uploading, error, addFiles, removePhoto, refresh }
}

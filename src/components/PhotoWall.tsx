import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { XIcon } from './icons'

interface VisitorPhoto {
  id: string
  author: string
  dataUrl: string
}

const STORAGE_KEY = 'totorilla-visitor-photos'

function loadPhotos(): VisitorPhoto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as VisitorPhoto[]) : []
  } catch {
    return []
  }
}

function savePhotos(photos: VisitorPhoto[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
  } catch {
    // Cuota excedida: las fotos se mantienen solo en esta sesión
  }
}

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const maxSide = 720
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas no disponible')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.72)
}

export default function PhotoWall() {
  const [photos, setPhotos] = useState<VisitorPhoto[]>(loadPhotos)
  const [author, setAuthor] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) return

    setUploading(true)
    setError('')

    try {
      const added: VisitorPhoto[] = []
      for (const file of files.slice(0, 6)) {
        const dataUrl = await fileToCompressedDataUrl(file)
        added.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          author: author.trim() || 'Visitante anónimo',
          dataUrl,
        })
      }
      setPhotos((prev) => {
        const next = [...added, ...prev]
        savePhotos(next)
        return next
      })
    } catch {
      setError('No se pudo procesar la imagen. Intenta con otro archivo.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id)
      savePhotos(next)
      return next
    })
  }

  return (
    <section id="fotos" aria-labelledby="fotos-heading" className="scroll-mt-24">
      <h2 id="fotos-heading" className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
        Muro de fotos de visitantes
      </h2>
      <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
        ¿Nos visitaste? Comparte tus mejores fotos del zoológico y aparecerán en este muro.
        Las imágenes se guardan en tu navegador.
      </p>

      <form
        className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="photo-author" className="block text-sm font-semibold text-foreground">
              Tu nombre <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="photo-author"
              type="text"
              value={author}
              maxLength={40}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej. María de Huamanga"
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex h-[46px] w-full cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90 sm:w-auto">
              {uploading ? 'Subiendo…' : 'Elegir fotos'}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                disabled={uploading}
                className="sr-only"
                aria-label="Subir fotos del zoológico"
              />
            </label>
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </form>

      {photos.length === 0 ? (
        <p className="mt-8 rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Todavía no hay fotos. ¡Sé el primero en compartir!
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.id} className="group relative overflow-hidden rounded-3xl border border-border bg-card">
              <img src={photo.dataUrl} alt={`Foto de ${photo.author}`} className="aspect-square w-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-xs font-medium text-white">
                {photo.author}
              </span>
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label={`Eliminar foto de ${photo.author}`}
                className="absolute top-2 right-2 grid size-8 cursor-pointer place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

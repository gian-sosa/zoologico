import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { useVisitorPhotos } from '../features/community/useVisitorPhotos'
import { CheckIcon, LockIcon, XIcon } from './icons'

type PhotosApi = ReturnType<typeof useVisitorPhotos>

interface PhotoWallProps {
  api: PhotosApi
}

export default function PhotoWall({ api }: PhotoWallProps) {
  const { photos, loading, uploading, error, notice, addFiles, removePhoto } = api
  const [author, setAuthor] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    await addFiles(files, author)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <form
        aria-labelledby="photo-upload-heading"
        className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-6 bg-primary-soft/40 p-5 sm:p-7 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-10">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-on-primary sm:size-16">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-7 sm:size-8">
                <path d="M20 20H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h4l2 3h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 id="photo-upload-heading" className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                Sube tus fotos
              </h2>
              <p id="photo-limits" className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Hasta 6 fotos · 10 MB por foto
              </p>
            </div>
          </div>

          <div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="min-w-0">
                <label htmlFor="photo-author" className="block text-sm font-semibold text-foreground">
                  Tu nombre <span className="font-normal text-muted-foreground">(opcional)</span>
                </label>
                <input
                  id="photo-author"
                  type="text"
                  value={author}
                  maxLength={40}
                  disabled={uploading}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  autoComplete="name"
                  className="mt-2 min-h-12 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
                />
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                aria-describedby="photo-limits photo-upload-behavior"
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-jungle-deep disabled:cursor-wait disabled:opacity-60"
              >
                {uploading ? (
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity=".3" />
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                    <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" />
                  </svg>
                )}
                {uploading ? 'Subiendo fotos…' : 'Elegir y subir fotos'}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFiles}
                disabled={uploading}
                hidden
                aria-label="Seleccionar fotos del zoológico"
              />
            </div>
            <p id="photo-upload-behavior" className="mt-2 text-xs leading-relaxed text-muted-foreground">
              JPG, PNG o WebP. Se envían al seleccionarlas.
            </p>
          </div>
        </div>

        <div className="px-5 py-4 sm:px-7">
          <p role="status" className="flex items-center gap-2 text-sm text-primary">
            <CheckIcon className="size-4 shrink-0" />
            {uploading ? 'Enviando tus fotos. No cierres esta página.' : 'Revisamos tus fotos antes de publicarlas.'}
          </p>
          <details className="group mt-2 text-sm text-muted-foreground">
            <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 rounded-lg font-semibold transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
              <LockIcon className="size-4 shrink-0" />
              Normas y privacidad
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 transition-transform group-open:rotate-180">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="mt-2 max-w-2xl space-y-3 border-t border-border pt-4 pb-1 leading-relaxed">
              <ul className="list-disc space-y-1 pl-5">
                <li>Solo fotos tomadas dentro del zoológico.</li>
                <li>Evita primeros planos de otros visitantes.</li>
                <li>Sin contenido ofensivo ni publicidad.</li>
              </ul>
              <p>Convertimos tus fotos a WebP de hasta 300 KB y eliminamos los metadatos, incluida la ubicación GPS.</p>
              <p>Las fotos aprobadas son públicas. Puedes solicitar su eliminación desde tu sesión; el administrador la revisará.</p>
            </div>
          </details>
        </div>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-4 flex items-start gap-2 rounded-2xl border border-primary/20 bg-primary-soft/40 px-5 py-4 text-sm font-medium text-primary">
          <CheckIcon className="mt-0.5 size-4 shrink-0" />
          {notice}
        </p>
      )}

      <section id="fotos" aria-labelledby="fotos-heading" className="mt-10 scroll-mt-28 sm:mt-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="fotos-heading" className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Recuerdos de la comunidad
          </h2>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Cargando…' : photos.length === 100 ? 'Últimas 100 fotos' : `${photos.length} ${photos.length === 1 ? 'foto' : 'fotos'}`}
          </p>
        </div>

        {loading && photos.length === 0 ? (
          <p role="status" className="mt-6 text-sm text-muted-foreground">Cargando fotos…</p>
        ) : photos.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
            <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="9" cy="9" r="1.5" />
                <path d="m21 15-4.5-4.5L6 21" />
              </svg>
            </span>
            <p className="mx-auto mt-4 max-w-xs font-heading text-xl font-semibold text-foreground">
              Tu foto puede ser la primera
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] leading-relaxed font-medium text-muted-foreground">
              Súbela y la verás aquí cuando sea aprobada.
            </p>
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {photos.map((photo) => (
              <li key={photo.id} className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-sm">
                <img
                  src={photo.url}
                  alt={`Foto de ${photo.author}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pt-6 pb-2.5 text-xs font-semibold text-white">
                  {photo.author}
                </span>
                {photo.canDelete && <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  disabled={photo.deletion_requested}
                  aria-label={photo.deletion_requested ? 'Eliminación pendiente de revisión' : `Solicitar eliminación de foto de ${photo.author}`}
                  title={photo.deletion_requested ? 'Eliminación pendiente' : 'Solicitar eliminación'}
                  className="absolute top-2 right-2 grid size-11 cursor-pointer place-items-center rounded-full border border-white/40 bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 focus-visible:outline-sun disabled:cursor-wait disabled:opacity-50"
                >
                  <XIcon className="size-4" />
                </button>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { ArrowRightIcon, MapPinIcon, XIcon } from '../components/icons'
import { MAP_ENCLOSURES } from '../features/zoo/map.data'
import { MAP_ANIMALS, matchesMapAnimal } from '../features/zoo/map-animals'
import type { MapAnimal } from '../features/zoo/map-animals'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const controlBase = 'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-[999px] border disabled:cursor-not-allowed disabled:opacity-40'
const mapControl = `${controlBase} border-border text-foreground hover:not-disabled:bg-muted aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-on-primary aria-pressed:hover:bg-jungle-deep`

export default function MapaPage() {
  const [zoom, setZoom] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [query, setQuery] = useState('')
  const [onlyProfiles, setOnlyProfiles] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const results = useMemo(() => MAP_ANIMALS.filter((animal) => (
    matchesMapAnimal(animal, query) && (!onlyProfiles || animal.href !== null)
  )), [query, onlyProfiles])
  const matches = new Set(query.trim() || onlyProfiles
    ? results.flatMap((animal) => animal.enclosures.map(({ n }) => n))
    : selected)

  function locateAnimal(animal: MapAnimal) {
    const enclosure = animal.enclosures.find(({ position }) => position)
    if (!enclosure?.position || !mapRef.current) return
    setQuery('')
    setOnlyProfiles(false)
    setSelected(animal.enclosures.map(({ n }) => n))
    const viewport = mapRef.current
    viewport.scrollIntoView({ block: 'start' })
    viewport.scrollTo({
      left: enclosure.position[0] / 1920 * viewport.scrollWidth - viewport.clientWidth / 2,
      top: enclosure.position[1] / 1080 * viewport.scrollHeight - viewport.clientHeight / 2,
    })
    viewport.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!fullscreen) return
    const dialog = dialogRef.current
    dialog?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [fullscreen])

  function renderControls(expanded = false) {
    return (
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card p-3 sm:px-5">
        <p className="mr-auto flex items-center gap-2 text-sm font-bold text-foreground">
          <MapPinIcon className="size-4 text-primary" />
          Croquis interactivo
        </p>
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Controles del mapa">
          <button type="button" disabled={zoom <= MIN_ZOOM} aria-label="Reducir zoom" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))} className={mapControl}>−</button>
          <output aria-live="polite" className="w-16 text-center text-sm font-bold">{zoom * 100} %</output>
          <button type="button" disabled={zoom >= MAX_ZOOM} aria-label="Aumentar zoom" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))} className={mapControl}>+</button>
          <button type="button" onClick={() => setZoom(MIN_ZOOM)} className={`${mapControl} px-3 text-sm`}>Ajustar</button>
          <button type="button" onClick={() => setFullscreen(!expanded)} className={`${mapControl} px-3 text-sm`}>
            {expanded ? 'Cerrar' : 'Ampliar pantalla'}
          </button>
          <a href="/maps.png" download="mapa-zoologico-la-totorilla.png" className={`${mapControl} px-3 text-sm`}>Descargar</a>
        </div>
      </div>
    )
  }

  function renderMap(expanded = false) {
    return (
      <div ref={expanded ? undefined : mapRef} className={`${expanded ? 'max-h-[70dvh]' : 'max-h-[70vh]'} scroll-mt-28 overflow-auto overscroll-contain bg-cream`} tabIndex={0} aria-label="Mapa desplazable. Usa las flechas para recorrerlo y Tab para elegir un recinto.">
        <div className="relative min-w-190" style={{ width: `${zoom * 100}%` }}>
          <img src="/maps.png" width={1920} height={1080} alt="Nuevo croquis del Parque Zoológico La Totorilla: recintos numerados, senderos, herpetario y zona recreativa." draggable={false} className="block h-auto w-full select-none" />
          {MAP_ENCLOSURES.map((enclosure) => {
            if (!enclosure.position) return null
            const highlighted = matches.has(enclosure.n)
            return (
              <Link
                key={enclosure.n}
                to={enclosure.href === '/404' ? '/explora#fauna' : enclosure.href}
                onClick={() => {
                  setFullscreen(false)
                  if (enclosure.href === '/404') { setQuery(String(enclosure.n)); setOnlyProfiles(false) }
                }}
                aria-label={`Recinto ${enclosure.n}: ${enclosure.name}. ${enclosure.href === '/404' ? 'Ver en la lista de animales.' : 'Ver ficha del animal.'}`}
                title={`${enclosure.n}. ${enclosure.name}`}
                className={`absolute aspect-square w-[1.65%] min-w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 transition-[background-color,border-color] duration-150 ease-[ease] hover:z-1 hover:border-jungle-deep hover:bg-white/20 hover:shadow-[0_0_0_3px_white] focus-visible:z-1 focus-visible:border-jungle-deep focus-visible:bg-white/20 focus-visible:shadow-[0_0_0_3px_white] ${highlighted ? 'z-1 border-jungle-deep bg-white/20 shadow-[0_0_0_3px_white]' : 'border-transparent'}`}
                style={{ left: `${enclosure.position[0] / 1920 * 100}%`, top: `${enclosure.position[1] / 1080 * 100}%` }}
              >
                <span className="sr-only">{enclosure.n}. {enclosure.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-offset-3">
      <PageHeader eyebrow="Tu recorrido empieza aquí" title="Explora Totorilla" description="Encuentra a tus animales favoritos y descubre dónde viven en el zoológico." />

      <nav aria-label="Secciones del mapa" className="mt-6 flex flex-wrap gap-2">
        <Link to="#croquis" className={`${mapControl} gap-2 bg-card px-5 text-sm font-semibold`}><MapPinIcon className="size-4" />Ver mapa</Link>
        <Link to="#fauna" className={`${controlBase} border-primary bg-primary px-5 text-sm font-semibold text-on-primary hover:bg-jungle-deep`}>Buscar un animal<ArrowRightIcon className="ml-2 size-4" /></Link>
      </nav>

      <section id="croquis" aria-label="Croquis interactivo del zoológico" className="mt-6 scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card">
        {renderControls()}
        {renderMap()}
        <p className="border-t border-border px-5 py-3 text-center text-xs text-muted-foreground">
          Toca un número para conocer sus animales. Amplía o desliza el mapa para recorrerlo.
        </p>
      </section>

      <section id="fauna" aria-labelledby="map-fauna-heading" className="mt-12 scroll-mt-28 sm:mt-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 id="map-fauna-heading" className="font-heading text-3xl font-semibold text-foreground">Nuestros animales</h2>
            <p className="mt-2 text-sm text-muted-foreground">Cada animal, una sola vez. Los números indican sus recintos.</p>
          </div>
          <div className="w-full md:max-w-sm">
            <label htmlFor="map-search" className="mb-2 block text-sm font-semibold">Buscar por nombre o número</label>
            <div className="relative">
              <input id="map-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSelected([]) }} placeholder="Ej. vizcacha, puma o 12" className="min-h-12 w-full rounded-2xl border border-border bg-card py-3 pr-12 pl-4 text-sm text-foreground [&::-webkit-search-cancel-button]:hidden" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda" className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center rounded-xl text-muted-foreground hover:text-primary"><XIcon className="size-4" /></button>}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2" role="group" aria-label="Filtrar animales">
            <button type="button" onClick={() => setOnlyProfiles(false)} aria-pressed={!onlyProfiles} className={`${mapControl} bg-card px-4 text-sm font-semibold`}>Todos</button>
            <button type="button" onClick={() => setOnlyProfiles(true)} aria-pressed={onlyProfiles} className={`${mapControl} bg-card px-4 text-sm font-semibold`}>Con ficha educativa</button>
          </div>
          <p role="status" className="text-sm text-muted-foreground">{results.length} {results.length === 1 ? 'animal encontrado' : 'animales encontrados'}</p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Imágenes provisionales. Las fichas de los recintos 1, 2 y 3 ya están disponibles.</p>
        {results.length ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((animal) => (
              <li key={animal.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-colors focus-within:border-primary hover:border-primary/40">
                <img src={animal.image} alt="" width={88} height={88} loading="lazy" className="size-20 shrink-0 rounded-xl object-cover sm:size-22" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                    <span>{animal.enclosures.length === 1 ? 'Recinto' : 'Recintos'}</span>
                    {animal.enclosures.map(({ n }) => <span key={n} className="inline-flex min-w-6 items-center justify-center rounded-md bg-primary-soft px-1.5 py-0.5 font-bold text-primary">{n}</span>)}
                  </p>
                  <h3 className="mt-1 font-heading text-lg leading-snug font-semibold text-foreground">{animal.name}</h3>
                  {animal.href ? (
                    <Link to={animal.href} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-primary hover:underline">Ver ficha<ArrowRightIcon /></Link>
                  ) : animal.enclosures.some(({ position }) => position) ? (
                    <button type="button" onClick={() => locateAnimal(animal)} className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg text-sm font-semibold text-primary hover:underline"><MapPinIcon className="size-4" />Ubicar en mapa</button>
                  ) : <p className="mt-2 text-xs text-muted-foreground">Solo en la leyenda del mapa</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-8 text-center"><p className="font-semibold">No encontramos animales con esos filtros.</p><button type="button" onClick={() => { setQuery(''); setOnlyProfiles(false) }} className="mt-3 min-h-11 cursor-pointer rounded-full bg-primary px-5 text-sm font-semibold text-on-primary">Ver todos los animales</button></div>}
      </section>

      <dialog ref={dialogRef} onClose={() => setFullscreen(false)} onCancel={() => setFullscreen(false)} onClick={(event) => { if (event.target === event.currentTarget) setFullscreen(false) }} aria-label="Mapa interactivo en pantalla ampliada" className="m-auto max-h-[calc(100dvh-24px)] w-[calc(100vw-24px)] max-w-[1800px] overflow-auto rounded-[20px] border border-border bg-card p-0 text-foreground backdrop:bg-black/80">
        {renderControls(true)}
        {renderMap(true)}
        <p className="border-t border-border p-3 text-center text-xs text-muted-foreground">Pulsa Escape o Cerrar para volver. Los puntos numerados también son interactivos aquí.</p>
      </dialog>
    </main>
  )
}

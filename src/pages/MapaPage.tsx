import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../shared/components/PageHeader'
import { ArrowRightIcon, MapPinIcon } from '../components/icons'

/** Leyenda de especies numeradas según el croquis oficial del zoológico. */
const speciesLegend: { n: string; name: string }[] = [
  { n: '17', name: 'Margay' },
  { n: '18', name: 'Margay' },
  { n: '19', name: 'Mono nocturno' },
  { n: '20', name: 'León africano' },
  { n: '21', name: 'Chosna' },
  { n: '22', name: 'Mono choro' },
  { n: '23', name: 'Hurón plateado' },
  { n: '24', name: 'Ardilla ploma' },
  { n: '25', name: 'Maquisapa negro' },
  { n: '26', name: 'Tortuga motelo' },
  { n: '27', name: 'Isla de monos' },
  { n: '28', name: 'Aguilucho caminero' },
  { n: '29', name: 'Pato crestón' },
  { n: '30', name: 'Pato media luna' },
  { n: '31', name: 'Tortugas / lagartos' },
  { n: '32', name: 'Emú / gansos africanos' },
  { n: '33', name: 'Pava puca cunca' },
  { n: '34', name: 'Huallpata' },
  { n: '35', name: 'Aguilucho caminero' },
  { n: '36', name: 'Mono frayle' },
  { n: '37', name: 'Buitre' },
  { n: '38', name: 'Halcón peregrino' },
  { n: '39', name: 'Loro frente roja' },
  { n: '40', name: 'Mono aullador' },
  { n: '41', name: 'Sajino' },
  { n: '42', name: 'Guacamayo escarlata' },
  { n: '43', name: 'Pacarana' },
  { n: '44', name: 'Puerco esín' },
  { n: '45', name: 'Mono barba blanca' },
  { n: '46', name: 'Boas' },
  { n: '47', name: 'Pavo real' },
  { n: '48', name: 'Paujíl' },
  { n: '49', name: 'Cernícalo' },
  { n: '50', name: 'Sihua' },
  { n: '51', name: 'Loro mercenaria coronada' },
  { n: '52', name: 'Loro frente roja' },
  { n: '53', name: 'Loro amazona amazónica' },
  { n: '54', name: 'Guacamayo azul amarillo' },
  { n: '55', name: 'Guacamayo escarlata' },
  { n: '56', name: 'Guacamayo rojo' },
  { n: '57', name: 'Guacamayo frente castaña' },
  { n: '58', name: 'Pichico barba blanca' },
  { n: '59', name: 'Pava curunculada' },
  { n: '60', name: 'Perico australiano' },
  { n: '61', name: 'Cóndor andino' },
  { n: '62–65', name: 'Herpetario' },
  { n: '66', name: 'Capi z' },
  { n: '67', name: 'Venado' },
]

const circuitLegend = [
  {
    label: 'Acceso vehicular',
    swatch: 'bg-[repeating-linear-gradient(90deg,#d42b2b_0_5px,#ffffff_5px_9px)]',
  },
  { label: 'Acceso peatonal', swatch: 'bg-[#0e7d3a]' },
  { label: 'Circuito Chapu Quichca', swatch: 'bg-[#8fd19a]' },
]

const pointsOfInterest = [
  'Inicio del circuito',
  'Final del circuito',
  'Zona de parqueo',
  'Área de souvenir',
  'Miradores y gruta Tan Francisco',
  'Intihuasi y área de descanso',
  'Andenería y área de compostaje',
  'Acuamundo y casona',
  'Puente del amor y SS.HH.',
  'Campo deportivo público',
]

const MIN_ZOOM = 1
const MAX_ZOOM = 3

export default function MapaPage() {
  const [zoom, setZoom] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return speciesLegend
    return speciesLegend.filter(
      (s) => s.name.toLowerCase().includes(q) || s.n.toLowerCase().includes(q),
    )
  }, [query])

  // Cerrar pantalla completa con Escape y bloquear scroll del fondo
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [fullscreen])

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        eyebrow="Visita"
        title="Mapa del zoológico"
        description="Guíate con el croquis oficial: sigue el circuito verde, ubica cada especie por su número y no te pierdas ningún punto de interés."
      />

      {/* VISOR DEL CROQUIS */}
      <section aria-label="Croquis del zoológico" className="mt-10 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 px-4 py-3 sm:px-5">
          <p className="mr-auto flex items-center gap-1.5 text-sm font-bold text-stone-700">
            <MapPinIcon className="size-4 text-jungle" />
            Croquis oficial
          </p>
          <div className="flex items-center gap-1.5" role="group" aria-label="Controles de zoom">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.5).toFixed(1)))}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Reducir zoom"
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-lg font-bold text-stone-700 transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <span aria-live="polite" className="w-14 text-center font-heading text-sm font-bold text-stone-900">
              {Math.round(zoom * 100)} %
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.5).toFixed(1)))}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Aumentar zoom"
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-lg font-bold text-stone-700 transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
            {zoom > MIN_ZOOM && (
              <button
                type="button"
                onClick={() => setZoom(MIN_ZOOM)}
                className="cursor-pointer rounded-full border border-border px-4 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-cream"
              >
                Ajustar
              </button>
            )}
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="Ver croquis en pantalla completa"
              className="grid size-9 cursor-pointer place-items-center rounded-full bg-jungle text-white transition-colors hover:bg-jungle-deep"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>
            <a
              href="/croquis.png"
              download="croquis-zoologico-la-totorilla.png"
              aria-label="Descargar croquis"
              className="grid size-9 place-items-center rounded-full border border-border text-stone-700 transition-colors hover:bg-cream"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="overflow-auto bg-cream/60">
          <img
            src="/croquis.png"
            alt="Croquis del Zoológico La Totorilla con el circuito de visita, las zonas y la leyenda de especies numeradas"
            loading="eager"
            onClick={() => setFullscreen(true)}
            style={{ width: `${zoom * 100}%` }}
            className="mx-auto min-w-full max-w-none cursor-zoom-in select-none"
          />
        </div>
        <p className="border-t border-stone-100 px-4 py-2.5 text-center text-xs font-medium text-stone-400 sm:px-5">
          Toca la imagen para ampliar · Desliza para recorrer el mapa con zoom
        </p>
      </section>

      {/* LEYENDA + PUNTOS */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section aria-label="Leyenda del circuito" className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-8">
          <h2 className="font-heading text-xl font-bold text-stone-900">Leyenda del circuito</h2>
          <ul className="mt-4 space-y-3">
            {circuitLegend.map((l) => (
              <li key={l.label} className="flex items-center gap-3">
                <span aria-hidden="true" className={`h-4 w-14 shrink-0 rounded-full border border-black/10 ${l.swatch}`} />
                <span className="text-sm font-bold text-stone-800">{l.label}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-heading text-[15px] font-bold text-stone-900">Puntos de interés</h3>
          <ul className="mt-2 grid gap-x-4 sm:grid-cols-2">
            {pointsOfInterest.map((p, i) => (
              <li key={p} className="flex items-start gap-2 py-1 text-sm font-medium text-stone-600">
                <span aria-hidden="true" className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft font-heading text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Buscar especie en el mapa" className="rounded-3xl bg-[#0e3d24] p-7 text-white sm:p-8">
          <h2 className="font-heading text-xl font-bold">¿Dónde está cada especie?</h2>
          <p className="mt-1 text-sm font-medium text-white/70">
            Busca por nombre o número y ubícalo en el croquis.
          </p>
          <label htmlFor="map-search" className="sr-only">Buscar especie por nombre o número</label>
          <input
            id="map-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. cóndor, jaguar o 61…"
            className="mt-4 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white placeholder:text-white/40 focus:border-[#d9f99d] focus:ring-2 focus:ring-[#d9f99d]/30 focus:outline-none"
          />
          <ul className="mt-4 max-h-72 space-y-1 overflow-y-auto pr-1">
            {results.length === 0 && (
              <li className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white/60">
                Sin resultados. Prueba con otro nombre o número.
              </li>
            )}
            {results.map((s) => (
              <li key={`${s.n}-${s.name}`} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-2.5">
                <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-[#d9f99d] font-heading text-xs font-bold text-[#0e3d24]">
                  {s.n}
                </span>
                <span className="text-sm font-semibold">{s.name}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/fauna"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-jungle/40 px-7 py-3 font-heading text-[15px] font-semibold text-jungle transition-all hover:-translate-y-0.5 hover:border-jungle sm:w-auto"
        >
          Conoce nuestra fauna
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          to="/entradas"
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-jungle px-7 py-3.5 font-heading text-[15px] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-jungle-deep sm:w-auto"
        >
          Planifica tu visita
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* PANTALLA COMPLETA */}
      {fullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Croquis del zoológico en pantalla completa"
          onClick={() => setFullscreen(false)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-3 sm:p-6"
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Cerrar pantalla completa"
            className="absolute top-4 right-4 grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="size-5">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <img
            src="/croquis.png"
            alt="Croquis del Zoológico La Totorilla en pantalla completa"
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full cursor-zoom-out rounded-xl object-contain"
          />
        </div>
      )}
    </main>
  )
}

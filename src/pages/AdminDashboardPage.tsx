import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animals } from '../features/animals/animals.service'
import { getParkingTypes, getTicketTypes, refreshPrices, resetParkingOverrides, resetPriceOverrides, saveParkingOverride, savePriceOverride } from '../features/tickets/prices.store'
import { useVisitorPhotos } from '../features/community/useVisitorPhotos'
import { attachmentUrl, clearRequests, deleteRequest, listRequests } from '../features/requests/requests.store'
import type { DocumentRequest } from '../features/requests/requests.store'
import { useAuth } from '../features/auth/auth.context'
import ClaimsInbox from '../features/claims/ClaimsInbox'
import { formatDateES } from '../shared/format'

type Tab = 'resumen' | 'entradas' | 'solicitudes' | 'reclamaciones' | 'comunidad' | 'animales' | 'cuenta'

const TABS: { id: Tab; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'entradas', label: 'Tarifas' },
  { id: 'solicitudes', label: 'Solicitudes' },
  { id: 'reclamaciones', label: 'Reclamaciones' },
  { id: 'comunidad', label: 'Blog' },
  { id: 'animales', label: 'Fauna' },
  { id: 'cuenta', label: 'Cuenta' },
]

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('resumen')
  const { photos, moderatePhoto, error: photosError, notice: photosNotice, refresh: refreshPhotos,
    page: photosPage, hasMore: morePhotos, changePage: changePhotosPage, loading: photosLoading } = useVisitorPhotos(true)
  const [requests, setRequests] = useState<DocumentRequest[]>([])
  const [downloading, setDownloading] = useState<string | null>(null)
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      [...getTicketTypes(), ...getParkingTypes()].map((t) => [t.id, String(t.price)]),
    ),
  )
  const [notice, setNotice] = useState('')
  const [confirmClearPhotos, setConfirmClearPhotos] = useState(false)
  const [confirmClearRequests, setConfirmClearRequests] = useState(false)
  useEffect(() => {
    void listRequests().then(setRequests).catch(() => setNotice('No se pudieron cargar las solicitudes.'))
    void refreshPrices().then(() => setPrices(Object.fromEntries(
      [...getTicketTypes(), ...getParkingTypes()].map((t) => [t.id, String(t.price)]),
    ))).catch(() => setNotice('No se pudieron cargar las tarifas.'))
  }, [])

  const quizCount = useMemo(() => animals.reduce((a, an) => a + an.quiz.length, 0), [])
  const tariffCount = useMemo(() => getTicketTypes().length + getParkingTypes().length, [])

  function flash(msg: string) {
    setNotice(msg)
    window.setTimeout(() => setNotice(''), 3500)
  }

  function handleDeletePhoto(id: string) {
    void moderatePhoto(id, 'approve-delete')
  }

  async function handleClearPhotos() {
    if (!confirmClearPhotos) {
      setConfirmClearPhotos(true)
      return
    }
    let removed = 0
    for (const photo of photos) {
      if (await moderatePhoto(photo.id, 'approve-delete')) removed++
    }
    setConfirmClearPhotos(false)
    flash(`${removed} foto(s) eliminada(s); ${photos.length - removed} operación(es) fallida(s).`)
  }

  async function handleDeleteRequest(id: string) {
    try { setRequests(await deleteRequest(id)); flash('Solicitud eliminada.') }
    catch { flash('No se pudo eliminar la solicitud.') }
  }

  async function handleDownloadDocument(id: string, path: string) {
    setDownloading(id)
    try {
      const url = await attachmentUrl(path)
      const link = document.createElement('a')
      link.href = url
      link.download = 'documento.pdf'
      link.rel = 'noopener noreferrer'
      link.click()
    } catch { flash('No se pudo descargar el adjunto.') }
    finally { setDownloading(null) }
  }

  async function handleClearRequests() {
    if (!confirmClearRequests) {
      setConfirmClearRequests(true)
      return
    }
    try { setRequests(await clearRequests()) }
    catch { flash('No se pudieron eliminar las solicitudes.'); return }
    setConfirmClearRequests(false)
    flash('Bandeja de solicitudes vaciada.')
  }

  async function handleSavePrices() {
    for (const raw of Object.values(prices)) {
      const v = Number(raw)
      if (!Number.isFinite(v) || v < 0 || v > 999) {
        flash('Revisa las tarifas: deben ser números entre 0 y 999.')
        return
      }
    }
    try {
      for (const [id, raw] of Object.entries(prices)) {
        if (id.startsWith('park-')) await saveParkingOverride(id, Number(raw))
        else await savePriceOverride(id, Number(raw))
      }
    } catch { flash('No se pudieron guardar todas las tarifas.'); return }
    flash('Tarifas actualizadas. Ya se reflejan en el tarifario público.')
  }

  async function handleResetPrices() {
    try { await resetPriceOverrides(); await resetParkingOverrides() }
    catch { flash('No se pudieron restablecer las tarifas.'); return }
    setPrices(
      Object.fromEntries(
        [...getTicketTypes(), ...getParkingTypes()].map((t) => [t.id, String(t.price)]),
      ),
    )
    flash('Tarifas restablecidas a los valores base.')
  }

  function handleLogout() {
    void logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Zoo · Administración</p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-foreground">
            Panel de gestión
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sesión de <strong className="text-foreground">{username}</strong> · rol administrador
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 cursor-pointer rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Tabs */}
      <nav aria-label="Secciones del panel" className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id)
              setConfirmClearPhotos(false)
              setConfirmClearRequests(false)
            }}
            aria-pressed={tab === t.id}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-primary text-on-primary' : 'bg-card text-muted-foreground hover:bg-muted'
            } border border-border`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {notice && (
        <p role="status" className="mt-4 rounded-2xl border border-primary/30 bg-primary-soft px-5 py-3 text-sm font-medium text-foreground">
          {notice}
        </p>
      )}

      {tab === 'resumen' && (
        <section aria-label="Resumen" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Especies" value={String(animals.length)} hint={`${quizCount} preguntas de quiz`} />
          <Card label="Tarifas" value={String(tariffCount)} hint="Categorías en el tarifario" />
          <Card label="Solicitudes" value={String(requests.length)} hint="En mesa de partes" />
          <Card label="Fotos" value={String(photos.length)} hint="En el muro de la comunidad" />
        </section>
      )}

      {tab === 'entradas' && (
        <section aria-label="Gestión de tarifas" className="mt-6 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-foreground">Tarifas vigentes</h2>
            <p className="mt-1 text-sm text-muted-foreground">Los cambios se reflejan en el tarifario público. Las entradas se venden solo en boletería y en efectivo. La tarifa de S/ 0 se muestra como GRATIS.</p>
            <h3 className="mt-5 text-sm font-semibold text-foreground">Entradas</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {getTicketTypes().map((t) => (
                <div key={t.id}>
                  <label htmlFor={`price-${t.id}`} className="block text-sm font-semibold text-foreground">
                    {t.name} (S/)
                  </label>
                  <input
                    id={`price-${t.id}`}
                    type="number"
                    min={0}
                    max={999}
                    step={0.5}
                    value={prices[t.id] ?? ''}
                    onChange={(e) => setPrices((p) => ({ ...p, [t.id]: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </div>
              ))}
            </div>
            <h3 className="mt-5 text-sm font-semibold text-foreground">Parqueo vehicular</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {getParkingTypes().map((t) => (
                <div key={t.id}>
                  <label htmlFor={`price-${t.id}`} className="block text-sm font-semibold text-foreground">
                    {t.name} (S/)
                  </label>
                  <input
                    id={`price-${t.id}`}
                    type="number"
                    min={0}
                    max={999}
                    step={0.5}
                    value={prices[t.id] ?? ''}
                    onChange={(e) => setPrices((p) => ({ ...p, [t.id]: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSavePrices}
                className="cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
              >
                Guardar tarifas
              </button>
              <button
                type="button"
                onClick={handleResetPrices}
                className="cursor-pointer rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Restablecer
              </button>
            </div>
          </div>
        </section>
      )}

      {tab === 'solicitudes' && (
        <section aria-label="Solicitudes de mesa de partes" className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Mesa de Partes ({requests.length})
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Documentos recibidos. Los adjuntos son privados; descárgalos solo si confías en su procedencia.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearRequests}
              disabled={requests.length === 0}
              className="cursor-pointer rounded-full border border-red-300 bg-background px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {confirmClearRequests ? 'Confirma: eliminar cargados' : 'Eliminar documentos cargados'}
            </button>
          </div>
          {requests.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Aún no hay solicitudes registradas.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {requests.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border bg-background px-5 py-4 text-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                         {r.subject} <span className="font-normal text-muted-foreground">· {r.document_type}{r.document_number ? ` ${r.document_number}` : ''}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                         {r.name}{r.institution ? ` · ${r.institution}` : ''} · {r.email}{r.phone ? ` · ${r.phone}` : ''}
                       </p>
                       <p className="mt-1 break-all text-xs text-muted-foreground">Registro: {r.id} · Recibido: {formatDateES(r.createdAt)}</p>
                       {r.visitDate && <p className="mt-1 text-xs text-muted-foreground">Presentación educativa anterior · Visita: {formatDateES(r.visitDate)}{r.students ? ` · ${r.students} estudiantes` : ''}</p>}
                      {r.message && (
                         <p className="mt-1.5 whitespace-pre-wrap break-words text-xs leading-relaxed text-muted-foreground">
                          “{r.message}”
                        </p>
                       )}
                       {r.attachment_path && <button type="button" disabled={downloading !== null} onClick={() => { void handleDownloadDocument(r.id, r.attachment_path!) }} className="mt-3 min-h-11 cursor-pointer rounded-full border border-border px-4 text-xs font-semibold text-primary disabled:opacity-50">{downloading === r.id ? 'Preparando descarga…' : 'Descargar documento PDF'}</button>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(r.id)}
                      aria-label={`Eliminar solicitud ${r.id}`}
                      className="shrink-0 cursor-pointer rounded-full border border-border px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'comunidad' && (
        <section aria-label="Moderación del muro" className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
               Fotos de visitantes · página {photosPage + 1} ({photos.length})
            </h2>
            <button
              type="button"
              onClick={handleClearPhotos}
              disabled={photos.length === 0}
              className="cursor-pointer rounded-full border border-red-300 bg-background px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {confirmClearPhotos ? 'Confirma: eliminar cargadas' : 'Eliminar fotos cargadas'}
            </button>
          </div>
          <button type="button" onClick={() => { void refreshPhotos() }} className="mt-3 cursor-pointer text-sm font-semibold text-primary">Actualizar revisión</button>
          {photosError && <p role="alert" className="mt-4 text-sm text-red-600">{photosError}</p>}
          {photosNotice && <p role="status" className="mt-3 text-sm text-primary">{photosNotice}</p>}
          <nav aria-label="Páginas de moderación" className="mt-4 flex gap-4 text-sm">
            <button type="button" disabled={photosPage === 0 || photosLoading} onClick={() => changePhotosPage(photosPage - 1)} className="cursor-pointer text-primary disabled:opacity-40">Anterior</button>
            <button type="button" disabled={!morePhotos || photosLoading} onClick={() => changePhotosPage(photosPage + 1)} className="cursor-pointer text-primary disabled:opacity-40">Siguiente</button>
          </nav>
          {photos.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">El muro está vacío.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {photos.map((p) => (
                <li key={p.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                  {p.url ? <img src={p.url} alt={`Foto de ${p.author}`} loading="lazy" className="aspect-square w-full object-cover" />
                    : <p className="grid aspect-square place-items-center p-4 text-sm text-muted-foreground">Archivo no disponible; reintenta su eliminación.</p>}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                    <span className="truncate text-xs text-muted-foreground">{p.author}</span>
                    <span className="text-xs font-semibold">{({ pending: 'Pendiente', published: 'Publicada', rejected: 'Rechazada', deleting: 'Eliminación en curso' })[p.status]}</span>
                    {p.status === 'pending' && <div className="flex gap-2">
                      <button type="button" onClick={() => { void moderatePhoto(p.id, 'approve') }} className="cursor-pointer rounded-full bg-primary px-3 py-2 text-xs text-white">Aprobar</button>
                      <button type="button" onClick={() => { void moderatePhoto(p.id, 'reject') }} className="cursor-pointer rounded-full border border-border px-3 py-2 text-xs text-red-600">Rechazar</button>
                    </div>}
                    {p.deletion_requested && <div className="w-full text-xs">
                      <p className="mb-2 font-semibold">El propietario solicita eliminar esta foto.</p>
                      <button type="button" onClick={() => { void moderatePhoto(p.id, 'approve-delete') }} className="mr-2 cursor-pointer text-red-600">Aprobar eliminación</button>
                      <button type="button" onClick={() => { void moderatePhoto(p.id, 'reject-delete') }} className="cursor-pointer text-primary">Rechazar eliminación</button>
                    </div>}
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(p.id)}
                      aria-label={`Aprobar eliminación de foto de ${p.author}`}
                      className="shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Eliminar como administrador
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'reclamaciones' && <ClaimsInbox />}

      {tab === 'animales' && (
        <section aria-label="Catálogo de animales" className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">Catálogo publicado ({animals.length})</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            El contenido educativo se versiona en código; aquí ves el estado publicado.
          </p>
          <ul className="mt-4 space-y-3">
            {animals.map((a) => (
              <li key={a.slug} className="rounded-2xl border border-border bg-background px-5 py-4 text-sm">
                <p className="font-semibold text-foreground">
                  {a.name} <span className="font-normal italic text-muted-foreground">· {a.scientificName}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {a.stats.length} datos · {a.facts.length} curiosidades · {a.quiz.length} preguntas · {a.conservationStatus}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'cuenta' && (
        <section aria-label="Cuenta" className="mt-6 max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">Sesión actual</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Usuario</dt>
              <dd className="font-semibold text-foreground">{username}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Rol</dt>
              <dd className="font-semibold text-foreground">administrador</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            La sesión dura 8 horas y vive solo en este navegador. No compartas este acceso.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            Cerrar sesión
          </button>
        </section>
      )}
    </main>
  )
}

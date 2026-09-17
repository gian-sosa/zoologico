import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animals } from '../features/animals/animals.service'
import { clearOrders, deleteOrder, listOrders, ordersToCSV } from '../features/tickets/orders.store'
import { getTicketTypes, resetPriceOverrides, savePriceOverride } from '../features/tickets/prices.store'
import { clearPhotos, deletePhoto, listPhotos } from '../features/community/photos.store'
import { useAuth } from '../features/auth/auth.context'
import { formatDateES, formatPEN } from '../shared/lib/format'

type Tab = 'resumen' | 'entradas' | 'comunidad' | 'animales' | 'cuenta'

const TABS: { id: Tab; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'entradas', label: 'Entradas' },
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
  const [orders, setOrders] = useState(listOrders)
  const [photos, setPhotos] = useState(listPhotos)
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(getTicketTypes().map((t) => [t.id, String(t.price)])),
  )
  const [notice, setNotice] = useState('')
  const [confirmClear, setConfirmClear] = useState<'orders' | 'photos' | null>(null)

  const income = useMemo(() => orders.reduce((a, o) => a + (o.totalPrice ?? 0), 0), [orders])
  const tickets = useMemo(
    () => orders.reduce((a, o) => a + Object.values(o.quantities ?? {}).reduce((x, y) => x + (y ?? 0), 0), 0),
    [orders],
  )
  const quizCount = useMemo(() => animals.reduce((a, an) => a + an.quiz.length, 0), [])

  function flash(msg: string) {
    setNotice(msg)
    window.setTimeout(() => setNotice(''), 3500)
  }

  function handleDeleteOrder(code: string) {
    setOrders(deleteOrder(code))
    flash(`Orden ${code} eliminada.`)
  }

  function handleClearOrders() {
    if (confirmClear !== 'orders') {
      setConfirmClear('orders')
      return
    }
    clearOrders()
    setOrders([])
    setConfirmClear(null)
    flash('Historial de entradas vaciado.')
  }

  function handleDeletePhoto(id: string) {
    setPhotos(deletePhoto(id))
    flash('Foto eliminada del muro.')
  }

  function handleClearPhotos() {
    if (confirmClear !== 'photos') {
      setConfirmClear('photos')
      return
    }
    setPhotos(clearPhotos())
    setConfirmClear(null)
    flash('Muro de fotos vaciado.')
  }

  function handleSavePrices() {
    for (const raw of Object.values(prices)) {
      const v = Number(raw)
      if (!Number.isFinite(v) || v < 0 || v > 999) {
        flash('Revisa las tarifas: deben ser números entre 0 y 999.')
        return
      }
    }
    for (const [id, raw] of Object.entries(prices)) savePriceOverride(id, Number(raw))
    flash('Tarifas actualizadas. Aplican a las próximas compras.')
  }

  function handleResetPrices() {
    resetPriceOverrides()
    setPrices(Object.fromEntries(getTicketTypes().map((t) => [t.id, String(t.price)])))
    flash('Tarifas restablecidas a los valores base.')
  }

  function handleExportCSV() {
    const blob = new Blob([ordersToCSV(orders)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'totorilla-entradas.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleLogout() {
    logout()
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
              setConfirmClear(null)
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
          <Card label="Órdenes" value={String(orders.length)} hint={`${tickets} entradas vendidas`} />
          <Card label="Ingresos" value={formatPEN(income)} hint="Suma de órdenes registradas" />
          <Card label="Fotos" value={String(photos.length)} hint="En el muro de la comunidad" />
        </section>
      )}

      {tab === 'entradas' && (
        <section aria-label="Gestión de entradas" className="mt-6 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-lg font-semibold text-foreground">Tarifas vigentes</h2>
            <p className="mt-1 text-sm text-muted-foreground">Los cambios aplican a las próximas compras.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
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
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Órdenes ({orders.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={orders.length === 0}
                  className="cursor-pointer rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Exportar CSV
                </button>
                <button
                  type="button"
                  onClick={handleClearOrders}
                  disabled={orders.length === 0}
                  className="cursor-pointer rounded-full border border-red-300 bg-background px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {confirmClear === 'orders' ? 'Confirma: vaciar todo' : 'Vaciar historial'}
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Aún no hay órdenes registradas.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {orders.map((o) => {
                  const count = Object.values(o.quantities ?? {}).reduce((a, b) => a + (b ?? 0), 0)
                  return (
                    <li
                      key={o.code}
                      className="flex flex-col gap-2 rounded-2xl border border-border bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">
                          {o.code} · {count} {count === 1 ? 'entrada' : 'entradas'} · {formatPEN(o.totalPrice)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {o.name} · {formatDateES(o.date)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(o.code)}
                        aria-label={`Eliminar orden ${o.code}`}
                        className="shrink-0 cursor-pointer rounded-full border border-border px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>
      )}

      {tab === 'comunidad' && (
        <section aria-label="Moderación del muro" className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Fotos de visitantes ({photos.length})
            </h2>
            <button
              type="button"
              onClick={handleClearPhotos}
              disabled={photos.length === 0}
              className="cursor-pointer rounded-full border border-red-300 bg-background px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {confirmClear === 'photos' ? 'Confirma: eliminar todas' : 'Eliminar todas'}
            </button>
          </div>
          {photos.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">El muro está vacío.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {photos.map((p) => (
                <li key={p.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                  <img src={p.dataUrl} alt={`Foto de ${p.author}`} loading="lazy" className="aspect-square w-full object-cover" />
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <span className="truncate text-xs text-muted-foreground">{p.author}</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(p.id)}
                      aria-label={`Eliminar foto de ${p.author}`}
                      className="shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

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

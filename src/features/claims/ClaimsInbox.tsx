import { useCallback, useEffect, useState } from 'react'
import { listClaims } from './claims.service'
import type { StoredClaim } from './claims.service'
import { claimSheetEntries } from '../../../shared/claims.mjs'

export default function ClaimsInbox() {
  const [claims, setClaims] = useState<StoredClaim[]>([])
  const [page, setPage] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    try { setClaims(await listClaims(page)); setError('') }
    catch { setError('No se pudieron cargar las reclamaciones. Verifica la migración y los permisos del personal.') }
    finally { setLoading(false) }
  }, [page])
  useEffect(() => { void Promise.resolve().then(load) }, [load])

  return <section aria-labelledby="claims-inbox-heading" className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 id="claims-inbox-heading" className="font-heading text-xl font-semibold">Libro de Reclamaciones · Página {page + 1}</h2><button type="button" onClick={() => { setLoading(true); void load() }} className="min-h-11 cursor-pointer px-3 text-sm font-semibold text-primary">Actualizar</button></div>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Responde por el medio elegido dentro de los 15 días hábiles improrrogables y conserva la evidencia de envío. Esta bandeja consulta las hojas; no envía la respuesta al consumidor ni marca trámites atendidos automáticamente.</p>
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    {loading && <p role="status" className="mt-4 text-sm text-muted-foreground">Cargando hojas…</p>}
    {!loading && !claims.length && !error && <p className="mt-4 text-sm text-muted-foreground">No hay hojas en esta página.</p>}
    <ul className="mt-5 space-y-4">{claims.map((claim) => <li key={claim.id} className="rounded-2xl border border-border bg-background p-4 sm:p-5">
      <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{claim.code} · {claim.details.kind}</h3><span className="text-xs text-muted-foreground">{new Date(claim.created_at).toLocaleString('es-PE', { timeZone: 'America/Lima' })} · Lima</span></div>
      <p className="mt-2 text-sm">{claim.details.name} · {claim.response_sent_at ? 'Respuesta registrada' : 'Pendiente de respuesta'}</p>
      <p className="mt-2 text-xs text-muted-foreground">Copia por correo: {({ pending: 'pendiente de envío (requiere seguimiento)', sent: 'aceptada por el servicio de correo; verificar entrega', not_requested: 'sin correo indicado' })[claim.receipt_email_status]}</p>
      <details className="mt-3"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-primary">Consultar hoja completa (datos personales)</summary>
        <p className="mb-4 text-xs">{claim.provider.name} · RUC {claim.provider.ruc} · {claim.provider.address}</p>
        <dl className="grid gap-4 sm:grid-cols-2">{claimSheetEntries(claim.details).map(({ key, label, value }) => <div key={key} className="min-w-0 text-sm"><dt className="font-semibold">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">{value}</dd></div>)}</dl>
        <p className="mt-4 whitespace-pre-wrap text-sm">Acciones del proveedor: {claim.provider_actions || 'Pendientes de registrar.'}</p>
        {claim.response_text && <p className="mt-3 whitespace-pre-wrap text-sm">Respuesta: {claim.response_text}</p>}
      </details>
    </li>)}</ul>
    <nav aria-label="Páginas del libro" className="mt-5 flex gap-4 text-sm"><button type="button" disabled={loading || page === 0} onClick={() => { setLoading(true); setPage(page - 1) }} className="min-h-11 cursor-pointer text-primary disabled:opacity-40">Anterior</button><button type="button" disabled={loading || claims.length < 50} onClick={() => { setLoading(true); setPage(page + 1) }} className="min-h-11 cursor-pointer text-primary disabled:opacity-40">Siguiente</button></nav>
  </section>
}

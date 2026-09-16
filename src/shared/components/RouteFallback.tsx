export function RouteFallback() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 text-center" aria-busy="true" aria-label="Cargando página">
      <div className="mx-auto size-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>
    </div>
  )
}

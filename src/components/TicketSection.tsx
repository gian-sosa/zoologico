import { CheckIcon, TicketIcon } from './icons'
import { useTicketOrder } from '../features/tickets/useTicketOrder'
import { formatDateES, formatPEN, todayISO } from '../shared/lib/format'

export default function TicketSection() {
  const {
    types, quantities, changeQty, date, setDate,
    name, setName, email, setEmail, error,
    orderCode, totalTickets, totalPrice, handleSubmit, reset,
  } = useTicketOrder()

  if (orderCode) {
    return (
      <section id="entradas" aria-labelledby="entradas-heading" className="scroll-mt-24">
        <div className="rounded-3xl border border-primary/30 bg-card p-8 text-center sm:p-12">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-on-primary">
            <CheckIcon />
          </span>
          <h2 id="entradas-heading" className="mt-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            ¡Compra exitosa!
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
            Gracias, {name.trim()}. Hemos reservado{' '}
            <strong className="text-foreground">
              {totalTickets} {totalTickets === 1 ? 'entrada' : 'entradas'}
            </strong>{' '}
            para el <strong className="text-foreground">{formatDateES(date)}</strong>.
            Enviamos tus entradas a <strong className="text-foreground">{email.trim()}</strong>.
          </p>
          <p className="mx-auto mt-6 inline-block rounded-full border border-border bg-muted px-5 py-2 font-heading text-sm font-semibold tracking-wide text-foreground">
            Código de compra: {orderCode} · Total pagado: {formatPEN(totalPrice)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Muestra este código en puerta. Pago demostrativo: no se realizó ningún cargo real.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 cursor-pointer rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Comprar más entradas
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="entradas" aria-labelledby="entradas-heading" className="scroll-mt-24">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <TicketIcon className="size-4 text-primary" />
          Entradas online
        </p>
        <h2 id="entradas-heading" className="mt-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Compra tus entradas online
        </h2>
        <p className="mx-auto mt-2 max-w-xl leading-relaxed text-muted-foreground">
          Evita la cola en boletería. Elige tus entradas, la fecha de visita y recibe tu código QR en el correo.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-6 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1fr_320px]"
      >
        <div>
          <fieldset>
            <legend className="font-heading text-base font-semibold text-foreground">1. Elige tus entradas</legend>
            <ul className="mt-4 space-y-3">
              {types.map((t) => {
                const qty = quantities[t.id] ?? 0
                return (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.name} · <span className="text-primary">{formatPEN(t.price)}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeQty(t.id, -1)}
                        disabled={qty === 0}
                        aria-label={`Quitar una entrada ${t.name}`}
                        className="grid size-9 cursor-pointer place-items-center rounded-full border border-border text-lg font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>
                      <output aria-live="polite" aria-label={`Cantidad de entradas ${t.name}`} className="w-6 text-center font-heading font-semibold">
                        {qty}
                      </output>
                      <button
                        type="button"
                        onClick={() => changeQty(t.id, 1)}
                        disabled={qty >= 20}
                        aria-label={`Agregar una entrada ${t.name}`}
                        className="grid size-9 cursor-pointer place-items-center rounded-full bg-primary text-lg font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="font-heading text-base font-semibold text-foreground">2. Fecha de visita</legend>
            <div className="mt-4 max-w-xs">
              <label htmlFor="ticket-date" className="block text-sm font-semibold text-foreground">
                Fecha de visita
              </label>
              <input
                id="ticket-date"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="font-heading text-base font-semibold text-foreground">3. Tus datos</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ticket-name" className="block text-sm font-semibold text-foreground">
                  Nombre completo
                </label>
                <input
                  id="ticket-name"
                  type="text"
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  autoComplete="name"
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label htmlFor="ticket-email" className="block text-sm font-semibold text-foreground">
                  Correo electrónico
                </label>
                <input
                  id="ticket-email"
                  type="email"
                  value={email}
                  maxLength={80}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        <aside aria-label="Resumen de compra" className="h-fit rounded-2xl bg-muted p-6 lg:sticky lg:top-24">
          <h3 className="font-heading text-base font-semibold text-foreground">Resumen</h3>
          {totalTickets === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Aún no elegiste entradas.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {types.filter((t) => (quantities[t.id] ?? 0) > 0).map((t) => (
                <li key={t.id} className="flex justify-between gap-2 text-muted-foreground">
                  <span>
                    {quantities[t.id]} × {t.name}
                  </span>
                  <span className="font-semibold text-foreground">{formatPEN((quantities[t.id] ?? 0) * t.price)}</span>
                </li>
              ))}
              <li className="border-t border-border pt-2 text-muted-foreground">
                <span>{formatDateES(date) || 'Fecha por elegir'}</span>
              </li>
            </ul>
          )}
          <p className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm font-semibold text-muted-foreground">Total</span>
            <span className="font-heading text-2xl font-bold text-foreground">{formatPEN(totalPrice)}</span>
          </p>
          <button
            type="submit"
            className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90"
          >
            <TicketIcon className="size-4" />
            Pagar y recibir entradas
          </button>
          <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
            Pago 100% online y seguro. Tu visita apoya el rescate de fauna.
          </p>
        </aside>
      </form>
    </section>
  )
}

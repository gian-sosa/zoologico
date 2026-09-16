import { load, save } from '../../shared/lib/storage'
import { TICKET_TYPES } from './tickets.config'
import type { TicketType } from './tickets.config'

const PRICE_KEY = 'totorilla-ticket-prices'

export type PriceOverrides = Record<string, number>

export function loadPriceOverrides(): PriceOverrides {
  return load<PriceOverrides>(PRICE_KEY, {})
}

export function savePriceOverride(id: string, price: number): PriceOverrides {
  const next = { ...loadPriceOverrides(), [id]: price }
  save(PRICE_KEY, next)
  return next
}

export function resetPriceOverrides(): void {
  save(PRICE_KEY, {})
}

/** Tarifas vigentes: base del config + ajustes del administrador. */
export function getTicketTypes(): TicketType[] {
  const overrides = loadPriceOverrides()
  return TICKET_TYPES.map((t) =>
    typeof overrides[t.id] === 'number' && overrides[t.id] >= 0
      ? { ...t, price: overrides[t.id] }
      : t,
  )
}

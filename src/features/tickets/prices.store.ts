import { load, save } from '../../shared/lib/storage'
import { PARKING_TYPES, TICKET_TYPES } from './tickets.config'
import type { TicketType } from './tickets.config'

const PRICE_KEY = 'totorilla-ticket-prices'
const PARKING_PRICE_KEY = 'totorilla-parking-prices'

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

export function loadParkingOverrides(): PriceOverrides {
  return load<PriceOverrides>(PARKING_PRICE_KEY, {})
}

export function saveParkingOverride(id: string, price: number): PriceOverrides {
  const next = { ...loadParkingOverrides(), [id]: price }
  save(PARKING_PRICE_KEY, next)
  return next
}

export function resetParkingOverrides(): void {
  save(PARKING_PRICE_KEY, {})
}

/** Tarifas de parqueo vigentes: base del config + ajustes del administrador. */
export function getParkingTypes(): TicketType[] {
  const overrides = loadParkingOverrides()
  return PARKING_TYPES.map((t) =>
    typeof overrides[t.id] === 'number' && overrides[t.id] >= 0
      ? { ...t, price: overrides[t.id] }
      : t,
  )
}

/** Etiqueta de precio: la tarifa de S/ 0 se muestra como GRATIS. */
export function formatTariff(price: number): string {
  return price === 0 ? 'GRATIS' : `S/ ${price.toFixed(2)}`
}

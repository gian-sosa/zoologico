import { useEffect, useState } from 'react'
import { photosClient } from '../community/photos.store'
import { PARKING_TYPES, TICKET_TYPES } from './tickets.config'
import type { TicketType } from './tickets.config'

let overrides: Record<string, number> = {}
export async function refreshPrices(): Promise<void> {
  const { data, error } = await photosClient().from('tariff_overrides').select('id,price')
  if (error) throw error
  overrides = Object.fromEntries((data ?? []).map((r) => [r.id, Number(r.price)]))
}
export async function savePriceOverride(id: string, price: number): Promise<void> {
  const { error } = await photosClient().from('tariff_overrides').upsert({ id, price })
  if (error) throw error
  overrides = { ...overrides, [id]: price }
}
export const saveParkingOverride = savePriceOverride
async function reset(ids: string[]): Promise<void> {
  const { error } = await photosClient().from('tariff_overrides').delete().in('id', ids)
  if (error) throw error
  await refreshPrices()
}
export const resetPriceOverrides = () => reset(TICKET_TYPES.map((t) => t.id))
export const resetParkingOverrides = () => reset(PARKING_TYPES.map((t) => t.id))
const apply = (types: TicketType[]) => types.map((t) => ({ ...t, price: overrides[t.id] ?? t.price }))
export const getTicketTypes = () => apply(TICKET_TYPES)
export const getParkingTypes = () => apply(PARKING_TYPES)
export function useTariffs() {
  const [tariffs, setTariffs] = useState(getTicketTypes)
  const [parking, setParking] = useState(getParkingTypes)
  useEffect(() => {
    let active = true
    void refreshPrices().then(() => {
      if (active) { setTariffs(getTicketTypes()); setParking(getParkingTypes()) }
    }).catch(() => { /* Sin conexión, mostrar las tarifas base publicadas. */ })
    return () => { active = false }
  }, [])
  return { tariffs, parking }
}
export function formatTariff(price: number): string {
  return price === 0 ? 'GRATIS' : `S/ ${price.toFixed(2)}`
}

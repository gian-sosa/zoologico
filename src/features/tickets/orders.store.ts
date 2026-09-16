import { load, remove, save } from '../../shared/lib/storage'
import { ORDERS_KEY } from './tickets.config'
import type { TicketOrder } from './tickets.config'

export function listOrders(): TicketOrder[] {
  return load<TicketOrder[]>(ORDERS_KEY, [])
}

export function deleteOrder(code: string): TicketOrder[] {
  const next = listOrders().filter((o) => o.code !== code)
  save(ORDERS_KEY, next)
  return next
}

export function clearOrders(): void {
  remove(ORDERS_KEY)
}

export function ordersToCSV(orders: TicketOrder[]): string {
  const header = 'codigo,nombre,email,fecha,entradas,total_soles,creado'
  const rows = orders.map((o) => {
    const tickets = Object.values(o.quantities ?? {}).reduce((a, b) => a + (b ?? 0), 0)
    return [o.code, o.name, o.email, o.date, tickets, o.totalPrice, o.createdAt]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(',')
  })
  return [header, ...rows].join('\n')
}

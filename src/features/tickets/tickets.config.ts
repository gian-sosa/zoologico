export interface TicketType {
  id: string
  name: string
  description: string
  price: number
}

export const TICKET_TYPES: TicketType[] = [
  { id: 'adulto', name: 'Adulto', description: 'Mayores de 18 años. Acceso a todo el zoológico.', price: 6 },
  { id: 'universitario', name: 'Universitario', description: 'Presentando carnet universitario en puerta.', price: 4 },
  { id: 'ninos', name: 'Niños (3 – 11 años)', description: 'Menores de 3 años entran gratis.', price: 2 },
]

export const MAX_PER_TYPE = 20

export const ORDERS_KEY = 'totorilla-ticket-orders'

export interface TicketOrder {
  code: string
  quantities: Record<string, number>
  date: string
  /** Horario de ingreso (solo en órdenes antiguas; ya no se pide al comprar). */
  slot?: string
  name: string
  email: string
  totalPrice: number
  createdAt: string
}

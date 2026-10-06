export interface TicketType {
  id: string
  name: string
  price: number
}

export const TICKET_TYPES: TicketType[] = [
  { id: 'adulto', name: 'Adulto', price: 6 },
  { id: 'puber', name: 'Puber', price: 4 },
  { id: 'ninos', name: 'Niños', price: 2 },
]

export const PARKING_TYPES: TicketType[] = [
  { id: 'park-auto', name: 'Auto', price: 4 },
  { id: 'park-mototaxi', name: 'Mototaxi', price: 3 },
  { id: 'park-moto', name: 'Moto lineal', price: 2 },
]

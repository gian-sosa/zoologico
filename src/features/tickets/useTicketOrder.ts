import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { todayISO } from '../../shared/lib/format'
import { isValidEmail } from '../../shared/lib/validation'
import { load } from '../../shared/lib/storage'
import { MAX_PER_TYPE, ORDERS_KEY } from './tickets.config'
import type { TicketOrder } from './tickets.config'
import { getTicketTypes } from './prices.store'

const INITIAL_QTY = { adulto: 2, universitario: 0, ninos: 0 }

export function useTicketOrder() {
  // Tarifas vigentes al montar (incluye ajustes del administrador).
  const [types] = useState(getTicketTypes)
  const [quantities, setQuantities] = useState<Record<string, number>>(INITIAL_QTY)
  const [date, setDate] = useState(todayISO())
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [orderCode, setOrderCode] = useState('')

  const { totalTickets, totalPrice } = useMemo(() => {
    let tickets = 0
    let price = 0
    for (const t of types) {
      const qty = quantities[t.id] ?? 0
      tickets += qty
      price += qty * t.price
    }
    return { totalTickets: tickets, totalPrice: price }
  }, [quantities, types])

  function changeQty(id: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(MAX_PER_TYPE, Math.max(0, (prev[id] ?? 0) + delta)),
    }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (totalTickets === 0) return setError('Elige al menos 1 entrada para continuar.')
    if (!date) return setError('Elige la fecha de tu visita.')
    if (name.trim().length < 2) return setError('Ingresa tu nombre para generar las entradas.')
    if (!isValidEmail(email)) return setError('Ingresa un correo válido para enviarte las entradas.')

    const code = `TOTO-${Date.now().toString(36).toUpperCase().slice(-6)}`
    setOrderCode(code)
    try {
      const orders = load<TicketOrder[]>(ORDERS_KEY, [])
      orders.push({ code, quantities, date, name, email, totalPrice, createdAt: new Date().toISOString() })
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
    } catch {
      // Si falla el guardado, la compra sigue siendo válida en pantalla
    }
  }

  function reset() {
    setOrderCode('')
    setQuantities(INITIAL_QTY)
    setDate(todayISO())
    setName('')
    setEmail('')
    setError('')
  }

  return {
    types, quantities, changeQty, date, setDate,
    name, setName, email, setEmail, error,
    orderCode, totalTickets, totalPrice, handleSubmit, reset,
  }
}

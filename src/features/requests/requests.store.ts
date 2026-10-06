import { load, remove, save } from '../../shared/lib/storage'

export interface DiscountRequest {
  id: string
  name: string
  institution: string
  email: string
  phone: string
  visitDate: string
  students: number
  message: string
  createdAt: string
}

export type NewDiscountRequest = Omit<DiscountRequest, 'id' | 'createdAt'>

const REQUESTS_KEY = 'totorilla-mesa-partes'

export function listRequests(): DiscountRequest[] {
  return load<DiscountRequest[]>(REQUESTS_KEY, [])
}

export function saveRequest(data: NewDiscountRequest): DiscountRequest {
  const req: DiscountRequest = {
    ...data,
    id: `MP-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    createdAt: new Date().toISOString(),
  }
  const next = [...listRequests(), req]
  save(REQUESTS_KEY, next)
  return req
}

export function deleteRequest(id: string): DiscountRequest[] {
  const next = listRequests().filter((r) => r.id !== id)
  save(REQUESTS_KEY, next)
  return next
}

export function clearRequests(): DiscountRequest[] {
  remove(REQUESTS_KEY)
  return []
}

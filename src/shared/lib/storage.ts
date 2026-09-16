/** Storage seguro y tipado (wrapper sobre localStorage). Evita crashes por JSON corrupto o cuota excedida. */

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // entorno sin storage: no-op
  }
}

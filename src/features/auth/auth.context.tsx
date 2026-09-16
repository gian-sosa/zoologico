import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { load, remove, save } from '../../shared/lib/storage'
import { verifyAdminCredentials } from './adminCredentials'
import type { Role } from './roles'

interface Session {
  username: string
  role: Extract<Role, 'administrador'>
  loginAt: string
  expiresAt: string
}

interface AuthState {
  role: Role
  username: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const SESSION_KEY = 'totorilla-admin-session'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 horas

function readSession(): Session | null {
  const s = load<Session | null>(SESSION_KEY, null)
  if (!s || s.role !== 'administrador') return null
  if (!s.expiresAt || new Date(s.expiresAt).getTime() < Date.now()) {
    remove(SESSION_KEY)
    return null
  }
  return s
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession)

  const login = useCallback(async (username: string, password: string) => {
    const ok = await verifyAdminCredentials(username, password)
    if (!ok) return false
    const now = Date.now()
    const next: Session = {
      username: username.trim().toLowerCase(),
      role: 'administrador',
      loginAt: new Date(now).toISOString(),
      expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
    }
    save(SESSION_KEY, next)
    setSession(next)
    return true
  }, [])

  const logout = useCallback(() => {
    remove(SESSION_KEY)
    setSession(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      role: session ? 'administrador' : 'visitante',
      username: session?.username ?? null,
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

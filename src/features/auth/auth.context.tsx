import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabase, isAdminEmail, isSupabaseConfigured } from '../../shared/lib/supabase'
import type { Role } from './roles'

interface AuthState {
  role: Role
  user: User | null
  username: string | null
  loading: boolean
  configured: boolean
  unauthorizedEmail: string | null
  signInWithGoogle: (next?: string) => Promise<string | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

const POST_LOGIN_NEXT_KEY = 'totorilla-post-login-next'
const POST_LOGIN_NEXT_TTL_MS = 10 * 60 * 1000 // 10 minutos

function savePostLoginNext(next: string): void {
  try {
    sessionStorage.setItem(POST_LOGIN_NEXT_KEY, JSON.stringify({ next, at: Date.now() }))
  } catch {
    // almacenamiento no disponible: no-op
  }
}

/** Lee y consume el destino pendiente del login (null si no hay o expiró). */
export function consumePostLoginNext(): string | null {
  try {
    const raw = sessionStorage.getItem(POST_LOGIN_NEXT_KEY)
    if (!raw) return null
    sessionStorage.removeItem(POST_LOGIN_NEXT_KEY)
    const parsed = JSON.parse(raw) as { next?: unknown; at?: unknown }
    if (typeof parsed.next !== 'string' || !parsed.next.startsWith('/')) return null
    if (typeof parsed.at !== 'number' || Date.now() - parsed.at > POST_LOGIN_NEXT_TTL_MS) {
      return null
    }
    return parsed.next
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }
    const client = supabase
    let mounted = true
    let revision = 0

    async function synchronizeUser(sessionUser: User | null) {
      const currentRevision = ++revision
      if (sessionUser && !sessionUser.is_anonymous && !isAdminEmail(sessionUser.email)) {
        if (!mounted) return
        setUnauthorizedEmail(sessionUser.email ?? 'desconocido')
        void client.auth.signOut()
        setUser(null)
        setLoading(false)
        return
      }
      if (!sessionUser || sessionUser.is_anonymous) {
        if (!mounted) return
        setUser(null)
        setLoading(false)
        return
      }
      // El dominio solo filtra el acceso: los privilegios requieren un alta
      // explícita en BD. Ante cualquier error se deniega el acceso al panel.
      try {
        const { data, error } = await client.from('photo_admins')
          .select('user_id').eq('user_id', sessionUser.id).maybeSingle()
        if (!mounted || currentRevision !== revision) return
        setUser(!error && data ? sessionUser : null)
        setUnauthorizedEmail(!error && data ? null : sessionUser.email ?? 'desconocido')
      } catch {
        if (!mounted || currentRevision !== revision) return
        setUser(null)
      }
      if (mounted && currentRevision === revision) setLoading(false)
    }

    void supabase.auth.getSession().then(({ data, error }) => {
      if (mounted) void synchronizeUser(error ? null : data.session?.user ?? null)
    }).catch(() => { if (mounted) void synchronizeUser(null) })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT') {
        revision++
        setUser(null)
        setLoading(false)
        return
      }
      // No ejecutar consultas Supabase dentro del bloqueo del callback Auth.
      window.setTimeout(() => { if (mounted) void synchronizeUser(session?.user ?? null) }, 0)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async (next?: string): Promise<string | null> => {
    const supabase = getSupabase()
    if (!supabase) return 'Falta configurar Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).'
    setUnauthorizedEmail(null)
    // El state de React Router se pierde al salir a Google, así que el destino
    // viaja dentro del propio redirectTo para volver directo al panel.
    // OJO: esta URL debe estar en la allowlist "Redirect URLs" de Supabase.
    const destination = next && next.startsWith('/') ? next : '/administracion/panel'
    savePostLoginNext(destination)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${destination}`,
        queryParams: { prompt: 'select_account' },
      },
    })
    return error ? error.message : null
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(() => {
    const isAdmin = user !== null && isAdminEmail(user.email)
    return {
      role: isAdmin ? 'administrador' : 'visitante',
      user: isAdmin ? user : null,
      username: isAdmin ? (user?.email ?? null) : null,
      loading,
      configured: isSupabaseConfigured,
      unauthorizedEmail,
      signInWithGoogle,
      logout,
    }
  }, [user, loading, unauthorizedEmail, signInWithGoogle, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../shared/components/PageHeader'
import { useAuth } from '../features/auth/auth.context'
import { LockIcon } from '../components/icons'

const MAX_ATTEMPTS = 5
const LOCK_MS = 30_000

export default function AdminLoginPage() {
  const { role, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [lockedUntil, setLockedUntil] = useState(0)
  const attempts = useRef(0)

  if (role === 'administrador') {
    return <Navigate to={location.state?.from ?? '/administracion/panel'} replace />
  }

  const locked = Date.now() < lockedUntil

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (busy || locked) return
    setError('')
    setBusy(true)
    try {
      const ok = await login(username, password)
      if (ok) {
        attempts.current = 0
        navigate(location.state?.from ?? '/administracion/panel', { replace: true })
      } else {
        attempts.current += 1
        if (attempts.current >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCK_MS)
          attempts.current = 0
          setError('Demasiados intentos. Espera 30 segundos e inténtalo de nuevo.')
        } else {
          setError('Usuario o contraseña incorrectos.')
        }
        setPassword('')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Zoo · Administración"
        title="Acceso interno"
        description="Zona restringida para el personal del zoológico. Si eres visitante, vuelve a la página principal."
      />

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="mx-auto mt-10 max-w-md rounded-3xl border border-border bg-card p-8"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <LockIcon className="size-5" />
        </span>

        <div className="mt-6">
          <label htmlFor="admin-user" className="block text-sm font-semibold text-foreground">
            Usuario
          </label>
          <input
            id="admin-user"
            name="admin-user-field"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            maxLength={40}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="admin-pass" className="block text-sm font-semibold text-foreground">
            Contraseña
          </label>
          <input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            maxLength={80}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        {locked && !error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-600">
            Acceso bloqueado temporalmente por seguridad.
          </p>
        )}

        <button
          type="submit"
          disabled={busy || locked}
          className="mt-6 w-full cursor-pointer rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Verificando…' : 'Ingresar al panel'}
        </button>
      </form>
    </main>
  )
}

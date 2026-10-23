import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../features/auth/auth.context'
import { ADMIN_EMAIL_DOMAIN } from '../shared/supabase'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5.2 3.8-8.9Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5l-.1.1-3.6 2.8v.1C3.5 21.3 7.5 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8-.1.1C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.8-2.5Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.6c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.7 1.4 6.7l3.8 2.9c.9-2.9 3.6-5 6.8-5Z"
      />
    </svg>
  )
}

export default function AdminLoginPage() {
  const { role, loading, configured, unauthorizedEmail, signInWithGoogle } = useAuth()
  const location = useLocation() as { state?: { from?: string } }
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const destination = location.state?.from ?? '/administracion/panel'

  if (!loading && role === 'administrador') {
    return <Navigate to={destination} replace />
  }

  async function handleGoogleLogin() {
    if (busy) return
    setError('')
    setBusy(true)
    try {
      const oauthError = await signInWithGoogle(destination)
      if (oauthError) setError(oauthError)
      // Si no hay error, el navegador redirige a Google y vuelve directo al destino.
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Zoo · Administración"
        title="Acceso interno"
        description="Zona restringida para el personal del zoológico. Ingresa con tu cuenta institucional UNSCH."
      />

      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-border bg-card p-8 text-center">

        <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
          Iniciar sesión con Google
        </h2>
        <p className="mt-2 text-sm leading-relaxed font-medium text-muted-foreground">
          Serás redirigido a Google para autenticarte y volverás automáticamente al panel.
        </p>

        {!configured && (
          <p role="alert" className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-red-600">
            Error de Variables de Entorno. Contactar con el administrador del sistema.
          </p>
        )}
        {unauthorizedEmail && (
          <p role="alert" className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-red-600">
            No se pudo autorizar a {unauthorizedEmail}. Se requiere una cuenta @{ADMIN_EMAIL_DOMAIN} y un alta explícita del responsable del sistema.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        {loading && (
          <p role="status" className="mt-4 text-sm font-medium text-muted-foreground">
            Verificando sesión…
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy || loading || !configured}
          className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-none"
        >
          <GoogleIcon />
          {busy ? 'Redirigiendo a Google…' : 'Continuar con Google'}
        </button>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Al ingresar aceptas usar esta cuenta solo para la gestión interna del zoológico.
        </p>
      </div>
    </main>
  )
}

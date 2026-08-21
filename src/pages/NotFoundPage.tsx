import { Link } from 'react-router-dom'
import { PawIcon } from '../components/icons'

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-muted text-muted-foreground">
        <PawIcon className="size-8" />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">Página no encontrada</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Esta ruta del zoológico no existe. Vuelve al inicio para explorar a nuestros animales.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  )
}

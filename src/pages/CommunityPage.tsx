import { Link } from 'react-router-dom'
import PhotoWall from '../components/PhotoWall'
import { ArrowRightIcon } from '../components/icons'
import { useVisitorPhotos } from '../features/community/useVisitorPhotos'

export default function CommunityPage() {
  const api = useVisitorPhotos()

  return (
    <main className="bg-background [&_:focus-visible]:outline-3">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-7 sm:mb-9">
          <p className="text-xs font-extrabold tracking-[0.16em] text-primary uppercase">
            Comunidad Totorilla
          </p>
          <h1 className="mt-3 font-heading text-4xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            Tu visita, en fotos
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Comparte tus momentos favoritos del zoológico.
          </p>
        </header>

        <PhotoWall api={api} />

        <div className="mt-10 border-t border-border pt-5 text-sm text-muted-foreground">
          <Link to="/entradas" className="inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold transition-colors hover:text-primary">
            ¿Aún no nos visitas? Horarios y tarifas
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </main>
  )
}

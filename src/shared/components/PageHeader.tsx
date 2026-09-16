import { memo } from 'react'

interface Props {
  eyebrow: string
  title: string
  description: string
}

/** Encabezado centrado reutilizado por Animales / Entradas / Comunidad. */
function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">{description}</p>
    </header>
  )
}

export default memo(PageHeader)

import { Link } from 'react-router-dom'
import PageHeader from '../shared/components/PageHeader'
import { ArrowRightIcon, LeafIcon } from '../components/icons'
import { PROJECT_ORIGIN, TEAM_LEADER, TEAM_MEMBERS, TEAM_UNIVERSITY } from '../features/team/team.data'

function MemberCard({
  member,
  featured = false,
}: {
  member: typeof TEAM_LEADER
  featured?: boolean
}) {
  return (
    <article
      className={`rounded-3xl border bg-card p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        featured ? 'border-primary/40 ring-2 ring-primary/20' : 'border-border'
      }`}
    >
      <span
        className={`mx-auto grid size-16 place-items-center rounded-full font-heading text-lg font-bold ${
          featured ? 'bg-primary text-on-primary' : 'bg-primary-soft text-primary'
        }`}
        aria-hidden="true"
      >
        {member.initials}
      </span>
      {featured && (
        <p className="mt-4 inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          Líder del equipo
        </p>
      )}
      <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">{member.name}</h2>
      <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.focus}</p>
      <p className="mt-4 text-xs text-muted-foreground">{TEAM_UNIVERSITY}</p>
    </article>
  )
}

export default function DevelopersPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Desarrolladores"
        title="¿Quiénes creamos esta plataforma?"
        description="Un equipo de estudiantes que convirtió investigaciones de aula en una herramienta real para el zoológico."
      />

      {/* Origen del proyecto */}
      <section aria-labelledby="origen-heading" className="mt-12 rounded-3xl border border-border bg-card p-8 sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <LeafIcon className="size-4 text-primary" />
          Nuestro origen
        </p>
        <h2 id="origen-heading" className="mt-4 font-heading text-2xl font-semibold text-foreground">
          De la investigación en aula al servicio de Ayacucho
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{PROJECT_ORIGIN}</p>
      </section>

      {/* Líder */}
      <section aria-labelledby="lider-heading" className="mt-12">
        <h2 id="lider-heading" className="text-center font-heading text-2xl font-semibold text-foreground">
          Liderazgo
        </h2>
        <div className="mx-auto mt-6 max-w-md">
          <MemberCard member={TEAM_LEADER} featured />
        </div>
      </section>

      {/* Colaboradores */}
      <section aria-labelledby="equipo-heading" className="mt-12">
        <h2 id="equipo-heading" className="text-center font-heading text-2xl font-semibold text-foreground">
          Colaboradores
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TEAM_MEMBERS.map((m) => (
            <MemberCard key={m.initials} member={m} />
          ))}
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-on-primary transition-opacity duration-200 hover:opacity-90"
        >
          Ver el resultado de nuestro trabajo
          <ArrowRightIcon />
        </Link>
      </div>
    </main>
  )
}

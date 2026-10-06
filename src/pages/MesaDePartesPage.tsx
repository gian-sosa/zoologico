import { useState } from 'react'
import type { FormEvent } from 'react'
import PageHeader from '../shared/components/PageHeader'
import { ArrowRightIcon, CheckIcon } from '../components/icons'
import { saveRequest } from '../features/requests/requests.store'
import { isValidEmail } from '../shared/lib/validation'
import { todayISO } from '../shared/lib/format'

const requirements = [
  'Ser una institución educativa pública (colegio, instituto o universidad).',
  'Indicar la fecha tentativa y la cantidad aproximada de estudiantes.',
  'El día de la visita, presentar el oficio o credencial de la institución en boletería.',
  'El pago del ingreso con descuento se realiza solo en efectivo.',
]

export default function MesaDePartesPage() {
  const [name, setName] = useState('')
  const [institution, setInstitution] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [students, setStudents] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (name.trim().length < 2) return setError('Ingresa tu nombre completo.')
    if (institution.trim().length < 2) return setError('Ingresa el nombre de la institución educativa.')
    if (!isValidEmail(email)) return setError('Ingresa un correo válido para responderte.')
    if (!visitDate) return setError('Elige la fecha tentativa de tu visita.')
    const count = Number(students)
    if (!Number.isInteger(count) || count < 1 || count > 2000) {
      return setError('Ingresa la cantidad de estudiantes (entre 1 y 2000).')
    }
    const req = saveRequest({
      name: name.trim(),
      institution: institution.trim(),
      email: email.trim(),
      phone: phone.trim(),
      visitDate,
      students: count,
      message: message.trim(),
    })
    setRequestId(req.id)
  }

  function handleReset() {
    setName('')
    setInstitution('')
    setEmail('')
    setPhone('')
    setVisitDate('')
    setStudents('')
    setMessage('')
    setError('')
    setRequestId('')
  }

  if (requestId) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-primary/30 bg-card p-8 text-center sm:p-12">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-on-primary">
            <CheckIcon />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            ¡Solicitud enviada!
          </h1>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
            Gracias, {name.trim()}. Registramos la solicitud de la{' '}
            <strong className="text-foreground">{institution.trim()}</strong> para el descuento
            educativo. Te responderemos a{' '}
            <strong className="text-foreground">{email.trim()}</strong>.
          </p>
          <p className="mx-auto mt-6 inline-block rounded-full border border-border bg-muted px-5 py-2 font-heading text-sm font-semibold tracking-wide text-foreground">
            Código de solicitud: {requestId}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Guarda este código y preséntalo junto al oficio de tu institución el día de la visita.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 cursor-pointer rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Enviar otra solicitud
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Mesa de partes"
        title="Descuento educativo"
        description="Si vienes de visita con tus estudiantes, solicita aquí el descuento especial para instituciones educativas públicas."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-heading text-xl font-bold text-stone-900">Formulario de solicitud</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="mp-name" className="block text-sm font-semibold text-stone-900">
                Nombre completo del solicitante
              </label>
              <input
                id="mp-name"
                type="text"
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María Torres"
                autoComplete="name"
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="mp-institution" className="block text-sm font-semibold text-stone-900">
                Institución educativa pública
              </label>
              <input
                id="mp-institution"
                type="text"
                value={institution}
                maxLength={100}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Ej. I.E. San Ramón de Ayacucho"
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="mp-email" className="block text-sm font-semibold text-stone-900">
                Correo electrónico
              </label>
              <input
                id="mp-email"
                type="email"
                value={email}
                maxLength={80}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="mp-phone" className="block text-sm font-semibold text-stone-900">
                Teléfono <span className="font-normal text-stone-400">(opcional)</span>
              </label>
              <input
                id="mp-phone"
                type="tel"
                value={phone}
                maxLength={20}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 999 888 777"
                autoComplete="tel"
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="mp-date" className="block text-sm font-semibold text-stone-900">
                Fecha tentativa de visita
              </label>
              <input
                id="mp-date"
                type="date"
                value={visitDate}
                min={todayISO()}
                onChange={(e) => setVisitDate(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="mp-students" className="block text-sm font-semibold text-stone-900">
                N.º de estudiantes
              </label>
              <input
                id="mp-students"
                type="number"
                value={students}
                min={1}
                max={2000}
                onChange={(e) => setStudents(e.target.value)}
                placeholder="Ej. 35"
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="mp-message" className="block text-sm font-semibold text-stone-900">
                Mensaje <span className="font-normal text-stone-400">(opcional)</span>
              </label>
              <textarea
                id="mp-message"
                value={message}
                maxLength={500}
                rows={4}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos sobre tu visita: grado, sección, necesidades especiales…"
                className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="group mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-jungle px-7 py-3.5 font-heading text-[15px] font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-jungle-deep sm:w-auto"
          >
            Enviar solicitud
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <aside aria-label="Requisitos del descuento" className="h-fit rounded-3xl bg-[#0e3d24] p-7 text-white sm:p-8 lg:sticky lg:top-24">
          <h2 className="font-heading text-xl font-bold">Antes de solicitar</h2>
          <ul className="mt-4 space-y-3">
            {requirements.map((r, i) => (
              <li key={r} className="flex items-start gap-3 text-sm leading-relaxed font-medium text-white/85">
                <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 font-heading text-xs font-bold text-[#d9f99d]">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  )
}

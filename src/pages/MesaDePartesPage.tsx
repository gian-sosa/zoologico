import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, CheckIcon, LockIcon } from '../components/icons'
import { saveRequest } from '../features/requests/requests.store'
import { DOCUMENT_TYPES, validateDocument } from '../features/requests/documents'
import type { DocumentDetails, DocumentErrors } from '../features/requests/documents'

const primaryButton = 'inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-[14px] font-bold text-on-primary transition-[background-color] duration-150 ease-[ease] hover:bg-jungle-deep disabled:cursor-wait disabled:opacity-60'

const INITIAL: DocumentDetails = {
  name: '', institution: '', email: '', phone: '', document_type: 'Solicitud',
  document_number: '', subject: '', message: '', consent: false,
}
const LABELS: Record<keyof DocumentDetails | 'attachment', string> = {
  name: 'Nombres y apellidos', institution: 'Institución u organización', email: 'Correo electrónico',
  phone: 'Teléfono', document_type: 'Tipo de documento', document_number: 'Número de documento',
  subject: 'Asunto', message: 'Contenido de la presentación', consent: 'Autorización', attachment: 'Archivo adjunto',
}

function Field({ name, error, optional, children }: { name: keyof DocumentDetails; error?: string; optional?: boolean; children: ReactNode }) {
  return <div>
    <label htmlFor={`mp-${name}`} className="mb-2 block text-sm font-semibold text-foreground">
      {LABELS[name]} {optional && <span className="font-normal text-muted-foreground">(opcional)</span>}
    </label>
    {children}
    {error && <p id={`mp-${name}-error`} className="mt-2 text-sm text-red-700">{error}</p>}
  </div>
}

export default function MesaDePartesPage() {
  const [details, setDetails] = useState<DocumentDetails>({ ...INITIAL })
  const [attachment, setAttachment] = useState<File | null>(null)
  const [errors, setErrors] = useState<DocumentErrors>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [requestId, setRequestId] = useState('')
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const busy = useRef(false)

  useEffect(() => { if (requestId) successRef.current?.focus() }, [requestId])

  function fieldProps(name: keyof DocumentDetails) {
    return {
      id: `mp-${name}`,
      name,
      className: 'min-h-12 w-full rounded-xl border border-border bg-background px-3.5 py-3 text-[14px] text-foreground placeholder:text-muted-foreground aria-invalid:border-[#b91c1c] [&:is(textarea)]:resize-y',
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `mp-${name}-error` : undefined,
      onBlur: () => {
        const issue = validateDocument(details, attachment)[name]
        setErrors((previous) => ({ ...previous, [name]: issue }))
      },
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (busy.current) return
    setServerError('')
    const issues = validateDocument(details, attachment)
    setErrors(issues)
    if (Object.values(issues).some(Boolean)) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    busy.current = true
    setSubmitting(true)
    try {
      const request = await saveRequest(details, attachment)
      setRequestId(request.id)
    } catch (cause) {
      setServerError(cause instanceof Error ? cause.message : 'No se pudo enviar el documento. Inténtalo de nuevo.')
      requestAnimationFrame(() => summaryRef.current?.focus())
    } finally {
      busy.current = false
      setSubmitting(false)
    }
  }

  function reset() {
    setDetails({ ...INITIAL })
    setAttachment(null)
    setErrors({})
    setServerError('')
    setRequestId('')
  }

  if (requestId) return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary"><CheckIcon className="size-7" /></span>
        <p className="mt-6 text-xs font-bold tracking-widest text-primary uppercase">Mesa de Partes</p>
        <h1 ref={successRef} tabIndex={-1} className="mt-2 font-heading text-3xl font-semibold text-foreground">Tu documento fue recibido</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">Registramos tu presentación y el personal podrá revisarla. El correo de contacto que indicaste es <strong className="break-all text-foreground">{details.email}</strong>.</p>
        <dl className="mt-6 space-y-4 rounded-2xl bg-background p-5 text-sm">
          <div><dt className="text-muted-foreground">Código de registro</dt><dd className="mt-1 break-all font-mono font-semibold text-foreground select-text">{requestId}</dd></div>
          <div><dt className="text-muted-foreground">Documento</dt><dd className="mt-1 text-foreground">{details.document_type}{details.document_number && ` · ${details.document_number}`}</dd></div>
          <div><dt className="text-muted-foreground">Asunto</dt><dd className="mt-1 break-words text-foreground">{details.subject}</dd></div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Guarda este código para futuras consultas. El registro acredita la recepción, no la aprobación del trámite. No se envía un correo automático de confirmación.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={primaryButton}>Presentar otro documento</button>
          <Link to="/" className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold">Volver al inicio</Link>
        </div>
      </section>
    </main>
  )

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">Atención al ciudadano</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Mesa de Partes</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">Presenta solicitudes, oficios, cartas, informes y otros documentos dirigidos al Parque Zoológico La Totorilla. Un solo canal para hacer llegar tu documentación.</p>
      </header>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form noValidate onSubmit={handleSubmit} aria-labelledby="mp-form-heading" className="min-w-0 rounded-3xl border border-border bg-card p-5 sm:p-8">
          <h2 id="mp-form-heading" className="font-heading text-2xl font-semibold text-foreground">Presentar un documento</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Completa los campos indicados. Los campos opcionales están señalados.</p>

          <div ref={summaryRef} tabIndex={-1}>
            {(serverError || Object.values(errors).some(Boolean)) && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold">{serverError || 'Revisa los siguientes campos antes de continuar:'}</p>
              <ul className="mt-2 space-y-1">{Object.entries(errors).filter(([, value]) => value).map(([key, value]) => (
                <li key={key}><a className="underline underline-offset-2" href={`#mp-${key}`}>{value}</a></li>
              ))}</ul>
            </div>}
          </div>

          <fieldset disabled={submitting} className="mt-8 min-w-0 space-y-5 border-t border-border pt-6 disabled:opacity-70">
            <legend className="pr-3 text-sm font-bold text-primary">01 / Datos del remitente</legend>
            <Field name="name" error={errors.name}><input {...fieldProps('name')} required autoComplete="name" maxLength={150} value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} placeholder="Escribe tus nombres y apellidos" /></Field>
            <Field name="institution" optional error={errors.institution}><input {...fieldProps('institution')} autoComplete="organization" maxLength={250} value={details.institution} onChange={(e) => setDetails({ ...details, institution: e.target.value })} placeholder="Si presentas el documento en representación de una entidad" /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="email" error={errors.email}><input {...fieldProps('email')} required type="email" autoComplete="email" maxLength={254} value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} placeholder="nombre@correo.com" /></Field>
              <Field name="phone" optional error={errors.phone}><input {...fieldProps('phone')} type="tel" autoComplete="tel" maxLength={40} value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} placeholder="Número de contacto" /></Field>
            </div>
          </fieldset>

          <fieldset disabled={submitting} className="mt-8 min-w-0 space-y-5 border-t border-border pt-6 disabled:opacity-70">
            <legend className="pr-3 text-sm font-bold text-primary">02 / Información del documento</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="document_type" error={errors.document_type}><select {...fieldProps('document_type')} required value={details.document_type} onChange={(e) => setDetails({ ...details, document_type: e.target.value as DocumentDetails['document_type'] })}>{DOCUMENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
              <Field name="document_number" optional error={errors.document_number}><input {...fieldProps('document_number')} maxLength={80} value={details.document_number} onChange={(e) => setDetails({ ...details, document_number: e.target.value })} placeholder="Ej. Oficio N.° 015-2026" /></Field>
            </div>
            <Field name="subject" error={errors.subject}><input {...fieldProps('subject')} required minLength={5} maxLength={200} value={details.subject} onChange={(e) => setDetails({ ...details, subject: e.target.value })} placeholder="Resume el motivo de tu presentación" /></Field>
            <Field name="message" error={errors.message}><textarea {...fieldProps('message')} required minLength={20} maxLength={4000} rows={6} value={details.message} onChange={(e) => setDetails({ ...details, message: e.target.value })} placeholder="Describe tu solicitud, comunicación o documentación presentada. Incluye la información necesaria para su revisión." /><p className="mt-2 text-right text-xs text-muted-foreground">{details.message.length} / 4000 caracteres</p></Field>
          </fieldset>

          <fieldset disabled={submitting} className="mt-8 min-w-0 border-t border-border pt-6 disabled:opacity-70">
            <legend className="pr-3 text-sm font-bold text-primary">03 / Adjunto y envío</legend>
            <label htmlFor="mp-attachment" className="block text-sm font-semibold">Documento adjunto <span className="font-normal text-muted-foreground">(opcional)</span></label>
            <p id="mp-attachment-help" className="mt-2 text-sm text-muted-foreground">Un archivo PDF de hasta 3 MB. Si tiene varias páginas, reúnelas en un solo PDF legible, sin contraseña.</p>
            <div className="mt-3 rounded-2xl border border-dashed border-border bg-background p-4">
              <input ref={fileRef} id="mp-attachment" type="file" accept="application/pdf,.pdf" aria-invalid={Boolean(errors.attachment)} aria-describedby={`mp-attachment-help${errors.attachment ? ' mp-attachment-error' : ''}`} className="w-full min-w-0 text-sm text-muted-foreground file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-[10px] file:border file:border-border file:bg-card file:px-3 file:py-2 file:text-primary" onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setAttachment(file)
                setErrors((previous) => ({ ...previous, attachment: validateDocument(details, file).attachment }))
              }} />
              {attachment && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span className="break-all">{attachment.name} · {(attachment.size / 1024 / 1024).toFixed(2)} MB</span><button type="button" className="min-h-11 cursor-pointer font-semibold text-primary underline" onClick={() => { setAttachment(null); setErrors((previous) => ({ ...previous, attachment: undefined })); if (fileRef.current) fileRef.current.value = '' }}>Quitar archivo</button></div>}
            </div>
            {errors.attachment && <p id="mp-attachment-error" className="mt-2 text-sm text-red-700">{errors.attachment}</p>}
            <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <input id="mp-consent" type="checkbox" required checked={details.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'mp-consent-error' : undefined} onChange={(e) => setDetails({ ...details, consent: e.target.checked })} className="mt-1 size-5 shrink-0 accent-primary" />
              Autorizo el uso de mis datos de contacto y del documento por el personal autorizado para atender esta presentación.
            </label>
            {errors.consent && <p id="mp-consent-error" className="mt-2 text-sm text-red-700">{errors.consent}</p>}
            <button type="submit" disabled={submitting} className={`${primaryButton} mt-6 w-full sm:w-auto`}>{submitting ? 'Enviando documento…' : 'Enviar documento'}<ArrowRightIcon className="size-4" /></button>
            <p role="status" className="mt-3 text-xs leading-relaxed text-muted-foreground">{submitting ? 'Espera a que aparezca tu código de registro. No cierres esta página.' : 'Al completar el envío obtendrás un código de registro en esta página.'}</p>
          </fieldset>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="mp-before-heading">
            <h2 id="mp-before-heading" className="font-heading text-lg font-semibold">Antes de enviar</h2>
            <ul className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li>Verifica tus datos de contacto para que el personal pueda comunicarse contigo.</li>
              <li>Indica un asunto claro y comprueba que el adjunto sea legible.</li>
              <li>No incluyas contraseñas, datos bancarios ni información personal innecesaria.</li>
            </ul>
          </section>
          <section className="rounded-2xl bg-jungle-deep p-6 text-white" aria-labelledby="mp-next-heading">
            <h2 id="mp-next-heading" className="font-heading text-lg font-semibold">¿Qué pasa después?</h2>
            <ol className="mt-4 space-y-4 text-sm leading-relaxed text-white/85">
              <li><span className="font-bold text-white">1. Registro.</span> Recibirás un código al finalizar el envío.</li>
              <li><span className="font-bold text-white">2. Revisión.</span> El personal revisará la documentación presentada.</li>
              <li><span className="font-bold text-white">3. Contacto.</span> Si hace falta información adicional, podrá contactarte por los medios indicados.</li>
            </ol>
          </section>
          <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground"><LockIcon className="mt-0.5 size-4 shrink-0" />Tus datos y archivos no se publican en el sitio. Solo el personal autorizado puede consultarlos.</p>
        </aside>
      </div>
    </main>
  )
}

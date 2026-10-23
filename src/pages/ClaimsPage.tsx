import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, LockIcon } from '../components/icons'
import { claimsSettings, submitClaim } from '../features/claims/claims.service'
import type { ClaimReceipt, ClaimsProvider } from '../features/claims/claims.service'
import { CLAIM_LABELS, emptyClaim, validateClaim, claimEmail, claimSheetEntries } from '../../shared/claims.mjs'
import type { ClaimFields, ClaimErrors } from '../../shared/claims.mjs'
import './ClaimsPage.css'

type TextField = Exclude<keyof ClaimFields, 'is_minor' | 'conformity'>
const dateLabel = (value: string) => new Date(value).toLocaleString('es-PE', { timeZone: 'America/Lima' })
const legalNote = 'La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el Indecopi.'

export default function ClaimsPage() {
  const [fields, setFields] = useState<ClaimFields>(emptyClaim)
  const [errors, setErrors] = useState<ClaimErrors>({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [settings, setSettings] = useState<{ ready: boolean; provider: ClaimsProvider } | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [receipt, setReceipt] = useState<ClaimReceipt | null>(null)
  const summary = useRef<HTMLDivElement>(null)
  const success = useRef<HTMLHeadingElement>(null)
  const submissionKey = useRef<string | null>(null)
  const busy = useRef(false)

  useEffect(() => {
    let active = true
    void claimsSettings().then((data) => { if (active) setSettings(data) })
      .catch(() => { if (active) setSettings(null) })
      .finally(() => { if (active) setConfigLoading(false) })
    return () => { active = false }
  }, [])
  useEffect(() => { if (receipt) success.current?.focus() }, [receipt])

  function control(key: TextField, options: { optional?: boolean; type?: string; choices?: string[]; rows?: number; max?: number } = {}) {
    const props = {
      id: `claim-${key}`, name: key, required: !options.optional, value: fields[key],
      className: 'claim-input', 'aria-invalid': Boolean(errors[key]),
      'aria-describedby': errors[key] ? `claim-${key}-error` : undefined,
      onChange: (event: { target: { value: string } }) => setFields((previous) => ({ ...previous, [key]: event.target.value })),
      onBlur: () => setErrors((previous) => ({ ...previous, [key]: validateClaim(fields).errors[key] })),
    }
    return <div key={key} className="min-w-0">
      <label htmlFor={props.id} className="mb-2 block text-sm font-semibold">{CLAIM_LABELS[key]} {options.optional && <span className="font-normal text-muted-foreground">(opcional)</span>}</label>
      {options.choices ? <select {...props}>{options.choices.map((choice) => <option key={choice}>{choice}</option>)}</select>
        : options.rows ? <textarea {...props} maxLength={options.max ?? 4000} rows={options.rows} />
          : <input {...props} type={options.type ?? 'text'} maxLength={options.max ?? 150} inputMode={key === 'amount' ? 'decimal' : undefined}
            autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : key === 'phone' ? 'tel' : key === 'address' ? 'street-address' : 'off'} />}
      {errors[key] && <p id={`claim-${key}-error`} className="mt-2 text-sm text-red-700">{errors[key]}</p>}
    </div>
  }

  async function register(event: FormEvent) {
    event.preventDefault()
    if (busy.current || !settings?.ready) return
    const validation = validateClaim(fields)
    setErrors(validation.errors)
    setError('')
    if (Object.keys(validation.errors).length) { requestAnimationFrame(() => summary.current?.focus()); return }
    busy.current = true
    setSending(true)
    submissionKey.current ??= crypto.randomUUID()
    try {
      const result = await submitClaim(validation.value, submissionKey.current)
      if (result.receipt) setReceipt(result.receipt)
      else {
        setError(result.error ?? 'No se pudo confirmar el registro.')
        setErrors(result.errors ?? {})
        requestAnimationFrame(() => summary.current?.focus())
      }
    } catch {
      setError('No se pudo confirmar el registro. Reintenta sin cambiar los datos: se conservará el identificador del envío para evitar duplicados.')
      requestAnimationFrame(() => summary.current?.focus())
    } finally { busy.current = false; setSending(false) }
  }

  if (receipt) return (
    <main className="claim-page mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <div className="claim-no-print mb-6 rounded-2xl border border-primary/30 bg-primary-soft p-5">
        <h1 ref={success} tabIndex={-1} className="flex items-center gap-2 font-heading text-2xl font-semibold text-primary"><CheckIcon />Reclamación registrada</h1>
        <p className="mt-2 text-sm leading-relaxed">Guarda o imprime la hoja completa. La respuesta a tu {receipt.details.kind.toLowerCase()} debe darse en un máximo de 15 días hábiles improrrogables.</p>
        <p role="status" className="mt-3 text-sm">{receipt.receipt_email_status === 'sent'
          ? `La copia fue remitida al servicio de correo para ${claimEmail(receipt.details)}. Revisa también tu carpeta de correo no deseado.`
          : receipt.receipt_email_status === 'pending' ? 'Tu hoja está registrada. La copia por correo está pendiente de envío; el personal deberá verificar su entrega. Conserva ahora la copia imprimible.'
            : 'No indicaste correo electrónico para la copia. Imprime o guarda esta hoja como PDF.'}</p>
      </div>
      <article className="claim-receipt rounded-2xl border border-border bg-card p-5 sm:p-8">
        <p className="text-xs font-bold tracking-widest text-primary uppercase">Libro de Reclamaciones · Consumidor</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold">Hoja de Reclamación {receipt.code}</h2>
        <p className="mt-3 text-sm">Fecha y hora: {dateLabel(receipt.created_at)} · Lima, Perú</p>
        <dl className="mt-5 grid gap-3 border-y border-border py-5 text-sm">
          <div><dt className="font-semibold">Proveedor</dt><dd>{receipt.provider.name} · RUC {receipt.provider.ruc}</dd></div>
          <div><dt className="font-semibold">Domicilio del establecimiento</dt><dd>{receipt.provider.address}</dd></div>
        </dl>
        <dl className="mt-5 grid gap-4 text-sm">{claimSheetEntries(receipt.details).map(({ key, label, value }) => (
          <div key={key} className="claim-receipt-row"><dt className="font-semibold">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words">{value}</dd></div>
        ))}</dl>
        <section className="mt-6 border-t border-border pt-5"><h3 className="text-sm font-semibold">Observaciones y acciones del proveedor</h3><p className="mt-2 whitespace-pre-wrap text-sm">{receipt.provider_actions || 'Pendiente de atención al momento de registrar la hoja.'}</p></section>
        <p className="mt-6 text-xs leading-relaxed">Plazo máximo de respuesta: 15 días hábiles improrrogables. {legalNote}</p>
      </article>
      <div className="claim-no-print mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => window.print()} className="claim-primary">Imprimir / Guardar como PDF</button>
        <Link to="/" className="inline-flex min-h-12 items-center rounded-full border border-border px-5 text-sm font-semibold">Volver al inicio</Link>
      </div>
    </main>
  )

  return (
    <main className="claim-page mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
      <header className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">Tus derechos como consumidor</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Libro de Reclamaciones</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">Registra un reclamo o una queja sobre los productos, servicios o la atención del zoológico. El registro es gratuito y no requiere una cuenta ni un pago previo.</p>
      </header>

      <section aria-label="Identificación del proveedor" className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm">
        {settings?.provider.name ? <><p className="font-semibold">{settings.provider.name} · RUC {settings.provider.ruc || 'Pendiente de configurar'}</p><p className="mt-1 text-muted-foreground">{settings.provider.address}</p></>
          : <p className="text-muted-foreground">{configLoading ? 'Cargando identificación del proveedor…' : 'Los datos legales del proveedor aún no están disponibles.'}</p>}
        {!configLoading && !settings?.ready && <p role="alert" className="mt-3 font-semibold text-red-700">Este libro virtual aún no está habilitado para recibir reclamaciones. Contacta al establecimiento para solicitar un medio alternativo. Completar este formulario no constituye registro hasta que se emita tu hoja.</p>}
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form noValidate onSubmit={register} className="min-w-0 rounded-3xl border border-border bg-card p-5 sm:p-8" aria-labelledby="claim-form-heading">
          <h2 id="claim-form-heading" className="font-heading text-2xl font-semibold">Hoja de Reclamación</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">La numeración correlativa y la fecha se asignan al registrar. Los campos opcionales están señalados.</p>
          <div ref={summary} tabIndex={-1}>{(error || Object.values(errors).some(Boolean)) && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p className="font-semibold">{error || 'Revisa los campos señalados:'}</p><ul className="mt-2 space-y-1">{Object.entries(errors).filter(([, issue]) => issue).map(([key, issue]) => <li key={key}><a href={`#claim-${key}`} className="underline">{issue}</a></li>)}</ul></div>}</div>

          <fieldset disabled={sending} className="mt-8 min-w-0 space-y-5 border-t border-border pt-6">
            <legend className="pr-3 text-sm font-bold text-primary">01 / Identificación del consumidor</legend>
            {control('name')}
            <div className="grid gap-5 sm:grid-cols-2">{control('document_type', { choices: ['DNI', 'Carné de extranjería', 'Pasaporte', 'Otro'] })}{control('document_number', { max: 20 })}</div>
            {control('address', { max: 500 })}
            <div className="grid gap-5 sm:grid-cols-2">{control('phone', { type: 'tel', optional: true, max: 40 })}{control('email', { type: 'email', optional: fields.is_minor || fields.response_channel !== 'Correo electrónico', max: 254 })}</div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input id="claim-is_minor" type="checkbox" className="size-5 accent-primary" checked={fields.is_minor} onChange={(event) => setFields((previous) => ({ ...previous, is_minor: event.target.checked }))} />El consumidor es menor de edad.</label>
            {fields.is_minor && <div className="space-y-5 rounded-2xl bg-background p-4"><h3 className="text-sm font-bold">Datos de uno de los padres o representante</h3>{control('guardian_name')}{control('guardian_address', { max: 500 })}<div className="grid gap-5 sm:grid-cols-2">{control('guardian_phone', { optional: true, type: 'tel', max: 40 })}{control('guardian_email', { type: 'email', optional: fields.response_channel !== 'Correo electrónico', max: 254 })}</div></div>}
          </fieldset>

          <fieldset disabled={sending} className="mt-8 min-w-0 space-y-5 border-t border-border pt-6">
            <legend className="pr-3 text-sm font-bold text-primary">02 / Producto o servicio contratado</legend>
            <div className="grid gap-5 sm:grid-cols-2">{control('item_type', { choices: ['Producto', 'Servicio'] })}{control('amount', { optional: true, max: 12 })}</div>
            <p className="text-xs text-muted-foreground">Indica el monto en soles con punto decimal, si corresponde. Puedes dejarlo vacío si no hay un monto determinado.</p>
            {control('item_description', { rows: 3, max: 2000 })}
            {control('incident_date', { type: 'date', optional: true })}
          </fieldset>

          <fieldset disabled={sending} className="mt-8 min-w-0 space-y-5 border-t border-border pt-6">
            <legend className="pr-3 text-sm font-bold text-primary">03 / Detalle y pedido</legend>
            {control('kind', { choices: ['Reclamo', 'Queja'] })}
            <div className="rounded-xl bg-background p-4 text-xs leading-relaxed text-muted-foreground"><p><strong className="text-foreground">Reclamo:</strong> disconformidad relacionada con un producto o servicio.</p><p className="mt-2"><strong className="text-foreground">Queja:</strong> malestar respecto de la atención al público, no relacionado directamente con el producto o servicio.</p></div>
            {control('detail', { rows: 5 })}
            {control('request', { rows: 4 })}
            {control('response_channel', { choices: ['Correo electrónico', 'Domicilio'] })}
            <p className="text-xs leading-relaxed text-muted-foreground">{fields.is_minor ? 'Se utilizarán los datos del representante.' : 'Se utilizarán tus datos de contacto.'} Si proporcionas correo, se enviará también una copia de la hoja, aunque solicites respuesta en tu domicilio.</p>
          </fieldset>

          <fieldset disabled={sending} className="mt-8 min-w-0 space-y-4 border-t border-border pt-6">
            <legend className="pr-3 text-sm font-bold text-primary">04 / Revisión y registro</legend>
            <p className="text-sm leading-relaxed text-muted-foreground">Revisa la información antes de registrar. {legalNote}</p>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed"><input id="claim-conformity" type="checkbox" required className="mt-1 size-5 shrink-0 accent-primary" checked={fields.conformity} aria-invalid={Boolean(errors.conformity)} aria-describedby={errors.conformity ? 'claim-conformity-error' : undefined} onChange={(event) => setFields((previous) => ({ ...previous, conformity: event.target.checked }))} />He revisado el contenido de esta hoja y expreso mi conformidad con el reclamo o queja y el pedido que registro.</label>
            {errors.conformity && <p id="claim-conformity-error" className="text-sm text-red-700">{errors.conformity}</p>}
            <button type="submit" disabled={sending || !settings?.ready} className="claim-primary w-full sm:w-auto">{sending ? 'Registrando hoja…' : 'Registrar reclamación'}</button>
            <p role="status" className="text-xs text-muted-foreground">{sending ? 'No cierres esta página. Se está generando tu hoja de reclamación.' : 'Tras el registro podrás imprimir la hoja completa o guardarla como PDF.'}</p>
          </fieldset>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="rounded-2xl bg-jungle-deep p-6 text-white"><h2 className="font-heading text-xl font-semibold">15 días hábiles</h2><p className="mt-3 text-sm leading-relaxed text-white/85">Es el plazo máximo e improrrogable para atender y responder tanto reclamos como quejas. No se exige pago para su atención.</p></section>
          <section className="rounded-2xl border border-border bg-card p-6"><h2 className="font-heading text-lg font-semibold">Base legal</h2><ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground"><li>Ley N.° 29571, Código de Protección y Defensa del Consumidor.</li><li>D. S. N.° 011-2011-PCM y sus modificatorias, incluido el D. S. N.° 101-2022-PCM.</li></ul><a href="https://consumidor.gob.pe/libro-de-reclamaciones/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline">Orientación de Indecopi ↗</a></section>
          <section className="rounded-2xl border border-border bg-card p-6"><h2 className="flex items-center gap-2 font-heading text-lg font-semibold"><LockIcon className="size-4 shrink-0" />Tus datos personales</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Se tratarán para registrar, atender y conservar tu reclamación y cumplir las obligaciones legales, no para publicidad. No se publican en el sitio.</p><p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{settings?.provider.privacyNotice || 'El responsable debe completar su aviso de privacidad antes de habilitar este libro.'}</p>{settings?.provider.privacyContact && <p className="mt-3 break-words text-xs text-muted-foreground">Para ejercer tus derechos de acceso, rectificación, cancelación u oposición: <a className="text-primary underline" href={`mailto:${settings.provider.privacyContact}`}>{settings.provider.privacyContact}</a>.</p>}<p className="mt-3 text-xs leading-relaxed text-muted-foreground">Ley N.° 29733 y Reglamento aprobado por D. S. N.° 016-2024-JUS. La conservación mínima legal de las hojas es de 2 años.</p></section>
        </aside>
      </div>
    </main>
  )
}

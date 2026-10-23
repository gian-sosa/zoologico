export const CLAIM_LABELS = {
  name: 'Nombres y apellidos del consumidor', document_type: 'Tipo de documento',
  document_number: 'Número de documento', address: 'Domicilio completo', phone: 'Teléfono', email: 'Correo electrónico',
  guardian_name: 'Nombre del padre, madre o representante', guardian_address: 'Domicilio del representante',
  guardian_phone: 'Teléfono del representante', guardian_email: 'Correo del representante',
  item_type: 'Bien contratado', item_description: 'Descripción del producto o servicio', amount: 'Monto reclamado (S/)',
  incident_date: 'Fecha de los hechos', kind: 'Tipo de reclamación', detail: 'Detalle de la reclamación',
  request: 'Pedido concreto del consumidor', response_channel: 'Medio para recibir la respuesta',
  is_minor: 'Consumidor menor de edad', conformity: 'Conformidad con la hoja de reclamación',
}

export function emptyClaim() {
  return {
    name: '', document_type: 'DNI', document_number: '', address: '', phone: '', email: '',
    is_minor: false, guardian_name: '', guardian_address: '', guardian_phone: '', guardian_email: '',
    item_type: 'Servicio', item_description: '', amount: '', incident_date: '', kind: 'Reclamo',
    detail: '', request: '', response_channel: 'Correo electrónico', conformity: false,
  }
}

/** La misma validación se ejecuta en navegador y servidor. No acepta campos arbitrarios. */
export function validateClaim(input) {
  const value = emptyClaim()
  const errors = {}
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {}
  for (const key of Object.keys(value)) {
    if (typeof value[key] === 'boolean') value[key] = source[key] === true
    else value[key] = typeof source[key] === 'string' ? source[key].trim() : ''
  }
  const limits = {
    name: [2, 150], address: [5, 500], document_number: [1, 20], phone: [0, 40], email: [0, 254],
    item_description: [5, 2000], detail: [10, 4000], request: [5, 4000],
  }
  if (value.is_minor) Object.assign(limits, { guardian_name: [2, 150], guardian_address: [5, 500], guardian_phone: [0, 40], guardian_email: [0, 254] })
  else for (const key of ['guardian_name', 'guardian_address', 'guardian_phone', 'guardian_email']) value[key] = ''
  for (const [key, [min, max]] of Object.entries(limits)) {
    if (value[key].length < min || value[key].length > max || value[key].includes('\0')) errors[key] = `${CLAIM_LABELS[key]}: utiliza entre ${min} y ${max} caracteres.`
  }
  for (const [key, choices] of Object.entries({
    document_type: ['DNI', 'Carné de extranjería', 'Pasaporte', 'Otro'], item_type: ['Producto', 'Servicio'],
    kind: ['Reclamo', 'Queja'], response_channel: ['Correo electrónico', 'Domicilio'],
  })) if (!choices.includes(value[key])) errors[key] = 'Selecciona una de las opciones disponibles.'
  if (value.document_type === 'DNI' && !/^\d{8}$/.test(value.document_number)) errors.document_number = 'El DNI debe contener 8 dígitos.'
  for (const key of ['email', 'guardian_email']) if (value[key] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value[key])) errors[key] = 'Ingresa un correo electrónico válido.'
  if (value.response_channel === 'Correo electrónico') {
    const emailKey = value.is_minor ? 'guardian_email' : 'email'
    if (!value[emailKey]) errors[emailKey] = 'Indica el correo al que debe enviarse la respuesta.'
  }
  if (value.amount && !/^\d{1,9}(\.\d{1,2})?$/.test(value.amount)) errors.amount = 'Indica un monto no negativo con hasta 2 decimales, o déjalo vacío si no corresponde.'
  if (value.incident_date) {
    const parsed = new Date(`${value.incident_date}T12:00:00Z`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value.incident_date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value.incident_date || value.incident_date > new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' })) errors.incident_date = 'Indica una fecha válida que no sea futura.'
  }
  if (!value.conformity) errors.conformity = 'Revisa tu hoja y confirma tu conformidad antes de registrarla.'
  return { value, errors }
}

export function claimEmail(details) {
  return details.is_minor ? (details.guardian_email || details.email) : details.email
}

/** Mismos campos en la constancia imprimible, el correo y la consulta del personal. */
export function claimSheetEntries(details) {
  return Object.entries(CLAIM_LABELS)
    .filter(([key]) => !key.startsWith('guardian_') || details.is_minor)
    .map(([key, label]) => ({
      key, label,
      value: typeof details[key] === 'boolean' ? (details[key] ? 'Sí' : 'No') : (details[key] || 'No consignado'),
    }))
}

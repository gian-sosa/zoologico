import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyClaim, validateClaim, claimEmail, claimSheetEntries } from '../shared/claims.mjs'

const valid = {
  ...emptyClaim(), name: 'María Torres', document_number: '12345678', address: 'Av. Ejemplo 123, Ayacucho',
  email: 'maria@example.com', item_description: 'Ingreso y recorrido del zoológico',
  detail: 'No se prestó el servicio en las condiciones ofrecidas.', request: 'Solicito una solución y respuesta por escrito.', conformity: true,
}

test('Valida reclamo y queja; no exige cuenta, pago, teléfono ni monto', () => {
  for (const kind of ['Reclamo', 'Queja']) assert.deepEqual(validateClaim({ ...valid, kind }).errors, {})
})
test('Permite respuesta domiciliaria sin obligar al consumidor a tener correo', () => {
  const { value, errors } = validateClaim({ ...valid, response_channel: 'Domicilio', email: '' })
  assert.deepEqual(errors, {})
  assert.equal(claimEmail(value), '')
})
test('Solicita datos del representante cuando el consumidor es menor', () => {
  const { errors } = validateClaim({ ...valid, is_minor: true })
  for (const key of ['guardian_name', 'guardian_address', 'guardian_email']) assert.ok(errors[key])
  const result = validateClaim({ ...valid, is_minor: true, guardian_name: 'Ana Torres', guardian_address: 'Calle Ejemplo 123', guardian_email: 'ana@example.com' })
  assert.deepEqual(result.errors, {})
  assert.equal(claimEmail(result.value), 'ana@example.com')
})
test('Descarta datos ocultos del representante y campos arbitrarios', () => {
  const { value } = validateClaim({ ...valid, guardian_name: 'No guardar', guardian_email: 'private@example.com', response_text: 'Injected' })
  assert.equal(value.guardian_name, '')
  assert.equal(value.guardian_email, '')
  assert.equal(value.response_text, undefined)
})
test('Rechaza DNI inválido, montos negativos, correo inválido y falta de conformidad', () => {
  const { errors } = validateClaim({ ...valid, document_number: '123', amount: '-1', email: 'invalid', conformity: false })
  for (const key of ['document_number', 'amount', 'email', 'conformity']) assert.ok(errors[key])
})
test('Rechaza fechas imposibles y futuras; acepta datos vacíos sin fallar', () => {
  assert.ok(validateClaim({ ...valid, incident_date: '2026-02-31' }).errors.incident_date)
  assert.ok(validateClaim({ ...valid, incident_date: '9999-01-01' }).errors.incident_date)
  assert.ok(validateClaim(null).errors.name)
  assert.ok(validateClaim({ ...valid, detail: 'a'.repeat(4001) }).errors.detail)
})
test('La copia conserva los campos opcionales como no consignados y no muestra representantes inexistentes', () => {
  const entries = claimSheetEntries(valid)
  assert.equal(entries.find((entry) => entry.key === 'amount').value, 'No consignado')
  assert.equal(entries.find((entry) => entry.key === 'conformity').value, 'Sí')
  assert.ok(!entries.some((entry) => entry.key.startsWith('guardian_')))
})

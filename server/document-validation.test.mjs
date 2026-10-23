import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/features/requests/documents.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { DOCUMENT_TYPES, MAX_DOCUMENT_BYTES, validateDocument } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const valid = {
  name: 'María Torres', institution: '', email: 'maria@example.com', phone: '',
  document_type: 'Solicitud', document_number: '', subject: 'Solicitud de información',
  message: 'Solicito información sobre los programas de conservación.', consent: true,
}

test('Permite todos los tipos de documentos sin institución ni adjunto', () => {
  for (const document_type of DOCUMENT_TYPES) assert.deepEqual(validateDocument({ ...valid, document_type }, null), {})
})

test('Requiere remitente, correo válido, asunto, contenido y consentimiento', () => {
  const issues = validateDocument({ ...valid, name: '', email: 'invalid', subject: '', message: '', consent: false }, null)
  for (const key of ['name', 'email', 'subject', 'message', 'consent']) assert.ok(issues[key])
})

test('Valida tipo y límites de los campos', () => {
  const issues = validateDocument({ ...valid, document_type: 'Inventado', document_number: 'a'.repeat(81), message: 'a'.repeat(4001) }, null)
  for (const key of ['document_type', 'document_number', 'message']) assert.ok(issues[key])
})

test('Solo acepta adjuntos PDF no vacíos de hasta 3 MiB', () => {
  assert.deepEqual(validateDocument(valid, new File(['%PDF-test'], 'oficio.pdf', { type: 'application/pdf' })), {})
  for (const file of [
    new File(['text'], 'file.txt', { type: 'text/plain' }),
    new File([], 'empty.pdf', { type: 'application/pdf' }),
    new File([new Uint8Array(MAX_DOCUMENT_BYTES + 1)], 'large.pdf', { type: 'application/pdf' }),
  ]) assert.ok(validateDocument(valid, file).attachment)
})

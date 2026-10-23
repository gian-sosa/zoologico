import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import ts from 'typescript'

const compile = (source) => {
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
}
const mapModule = compile(await readFile(new URL('../src/features/zoo/map.data.ts', import.meta.url), 'utf8'))
const source = await readFile(new URL('../src/features/zoo/map-animals.ts', import.meta.url), 'utf8')
const { MAP_ANIMALS, matchesMapAnimal } = await import(compile(source.replaceAll("'./map.data'", JSON.stringify(mapModule))))
const { MAP_ENCLOSURES } = await import(mapModule)

test('Lista cada nombre una vez, agrupando los recintos repetidos', () => {
  assert.equal(new Set(MAP_ANIMALS.map(({ id }) => id)).size, MAP_ANIMALS.length)
  assert.deepEqual(MAP_ANIMALS.find(({ id }) => id === 'puma').enclosures.map(({ n }) => n), [12, 20])
  assert.deepEqual(MAP_ANIMALS.find(({ id }) => id === 'mono aullador').enclosures.map(({ n }) => n), [13, 19, 21])
  assert.deepEqual(MAP_ANIMALS.find(({ id }) => id === 'margay').enclosures.map(({ n }) => n), [17, 18])
})

test('Separa los animales que comparten recinto sin perder números', () => {
  for (const enclosure of MAP_ENCLOSURES) assert.ok(MAP_ANIMALS.some(({ enclosures }) => enclosures.some(({ n }) => n === enclosure.n)))
  for (const id of ['machin blanco', 'machin negro']) {
    assert.deepEqual(MAP_ANIMALS.find((animal) => animal.id === id).enclosures.map(({ n }) => n), [22, 26, 27, 40])
  }
})

test('Busca sin tildes y por número exacto, no por fragmentos de números', () => {
  assert.equal(MAP_ANIMALS.filter((animal) => matchesMapAnimal(animal, ' Vicuña ')).length, 1)
  assert.equal(MAP_ANIMALS.filter((animal) => matchesMapAnimal(animal, '1')).length, 1)
  assert.equal(MAP_ANIMALS.filter((animal) => matchesMapAnimal(animal, '22')).length, 2)
  assert.equal(MAP_ANIMALS.filter((animal) => matchesMapAnimal(animal, 'inexistente')).length, 0)
})

test('Solo las fichas disponibles tienen enlace; ninguna tarjeta envía a 404', () => {
  assert.deepEqual(MAP_ANIMALS.filter(({ href }) => href).map(({ href }) => href), ['/fauna/vizcacha', '/fauna/alpaca', '/fauna/vicuna'])
  assert.ok(MAP_ANIMALS.every(({ href }) => href !== '/404'))
  assert.equal(MAP_ANIMALS.find(({ id }) => id === 'loro cabeza azul').enclosures[0].position, null)
})

test('Todas las miniaturas provisionales existen', async () => {
  for (const image of new Set(MAP_ANIMALS.map(({ image }) => image))) await access(new URL(`../public${image}`, import.meta.url))
})

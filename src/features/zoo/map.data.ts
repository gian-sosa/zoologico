/** Coordenadas del centro de cada número en public/maps.png (1920 × 1080).
 * Los recintos 1–3 tienen ficha. Actualizar los enlaces al añadir más especies.
 * El 60 figura en la leyenda, pero no tiene un punto numerado visible en el plano.
 */
export interface MapEnclosure {
  n: number
  name: string
  position: readonly [number, number] | null
  href: string
}

const entries: [number, string, readonly [number, number] | null][] = [
  [1, 'Vizcacha', [465, 628]],
  [2, 'Alpacas', [516, 620]],
  [3, 'Vicuña', [518, 670]],
  [4, 'Venado gris', [467, 679]],
  [5, 'Aguilucho pecho negro', [622, 733]],
  [6, 'Búho americano', [605, 773]],
  [7, 'Halcón peregrino', [588, 811]],
  [8, 'China linda', [574, 847]],
  [9, 'Aguilucho variable / Gallinazos cabeza roja', [550, 884]],
  [10, 'Zorro andino', [643, 857]],
  [11, 'Oso de anteojos', [682, 727]],
  [12, 'Puma', [762, 729]],
  [13, 'Mono aullador', [811, 739]],
  [14, 'Gato de pajonal', [812, 689]],
  [15, 'Otorongo', [926, 733]],
  [16, 'Mono pichico', [1001, 692]],
  [17, 'Margay', [935, 679]],
  [18, 'Tigrillo margay', [972, 640]],
  [19, 'Mono aullador / Mono araña', [1032, 638]],
  [20, 'Puma', [991, 591]],
  [21, 'Mono aullador', [1047, 592]],
  [22, 'Machín negro / Machín blanco', [1056, 563]],
  [23, 'Mono fraile', [1093, 555]],
  [24, 'Loro harinoso / Loro corona amarilla', [1088, 510]],
  [25, 'Mono araña / Mono choro', [1520, 616]],
  [26, 'Machín blanco / Machín negro', [1519, 563]],
  [27, 'Machín blanco / Machín negro', [1566, 443]],
  [28, 'Huallatas', [1688, 306]],
  [29, 'Pato crestón', [1681, 244]],
  [30, 'Yanavico / Pava carunculada', [1663, 197]],
  [31, 'Tortugas y lagartos', [1353, 209]],
  [32, 'Avestruz', [1263, 159]],
  [33, 'Cernícalo', [1235, 233]],
  [34, 'Capibaras', [1134, 163]],
  [35, 'Guacamayo escarlata', [1111, 245]],
  [36, 'Loro cabeza roja', [1180, 292]],
  [37, 'Cóndor real', [1122, 323]],
  [38, 'Guamán / Aguilucho garganta blanca', [1131, 399]],
  [39, 'Aguilucho común', [1130, 452]],
  [40, 'Machín negro / Machín blanco', [1187, 394]],
  [41, 'Sajino', [994, 264]],
  [42, 'Siwa', [1004, 306]],
  [43, 'Pacarana', [993, 352]],
  [44, 'Guacamayo azul amarillo', [938, 338]],
  [45, 'Guacamayo rojo y verde', [884, 357]],
  [46, 'Loro cachete amarillo / Loro harinoso / Loro corona amarilla / Loro mercenario', [881, 316]],
  [47, 'Pavo real', [938, 271]],
  [48, 'Guacamayo militaris', [880, 269]],
  [49, 'Faisán plateado', [881, 213]],
  [50, 'Faisán dorado', [819, 206]],
  [51, 'Pava chillona', [754, 239]],
  [52, 'Loro frente roja', [739, 283]],
  [53, 'Pavo real albino', [734, 332]],
  [54, 'Guacamayo escarlata', [730, 382]],
  [59, 'Aguilucho', [827, 432]],
  [60, 'Loro cabeza azul', null],
  [61, 'Loro andino', [719, 457]],
]

const ENCLOSURE_LINKS: Record<number, string> = {
  1: '/fauna/vizcacha',
  2: '/fauna/alpaca',
  3: '/fauna/vicuna',
}

export const MAP_ENCLOSURES: MapEnclosure[] = entries.map(([n, name, position]) => ({
  n, name, position, href: ENCLOSURE_LINKS[n] ?? '/404',
}))

export function normalizeMapSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

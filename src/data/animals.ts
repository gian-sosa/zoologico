export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface FunFact {
  title: string
  detail: string
}

export interface AnimalStat {
  label: string
  value: string
}

export interface Animal {
  slug: string
  name: string
  scientificName: string
  tagline: string
  description: string
  conservationStatus: string
  statusLevel: 'estable' | 'vulnerable' | 'peligro'
  accentHex: string
  accentSoftHex: string
  stats: AnimalStat[]
  habitat: string[]
  diet: string[]
  facts: FunFact[]
  quiz: QuizQuestion[]
  /** Archivo de sonido en /public (opcional). Ej. '/leon.mp3' */
  soundFile?: string
  soundLabel?: string
  /** Imagen de fondo del hero en /public (opcional). Ej. '/leon.jpeg' */
  heroImage?: string
}

export const animals: Animal[] = [
  {
    slug: 'leon',
    name: 'León',
    scientificName: 'Panthera leo',
    tagline: 'El rey de la sabana',
    description:
      'El león es el único felino que vive en grupos, llamados manadas. Las hembras suelen cazar, mientras los machos protegen el territorio. Su rugido puede escucharse a varios kilómetros y puede pasar hasta 20 horas al día descansando.',
    conservationStatus: 'Vulnerable (UICN)',
    statusLevel: 'vulnerable',
    accentHex: '#d97706',
    accentSoftHex: '#fef3c7',
    soundFile: '/leon.mp3',
    heroImage: '/leon.jpeg',
    stats: [
      { label: 'Peso', value: '150–250 kg' },
      { label: 'Velocidad', value: '80 km/h' },
      { label: 'Esperanza de vida', value: '10–14 años' },
      { label: 'Horas de sueño', value: 'hasta 20 al día' },
    ],
    habitat: ['Sabanas africanas', 'Praderas abiertas', 'Matorrales'],
    diet: ['Carnívoro', 'Cebras y ñus', 'Antílopes'],
    facts: [
      {
        title: 'Rugido potente',
        detail: 'Su rugido alcanza los 114 decibeles y puede escucharse a 8 km de distancia.',
      },
      {
        title: 'Trabajo en equipo',
        detail: 'Las hembras cazan en grupo coordinado, aumentando el éxito hasta 3 veces.',
      },
      {
        title: 'Melón distintivo',
        detail: 'Solo los machos desarrollan melena; su color indica salud y edad.',
      },
    ],
    quiz: [
      {
        question: '¿Cuántos kilómetros puede escucharse el rugido de un león?',
        options: ['2 km', '5 km', '8 km'],
        correctIndex: 2,
        explanation: 'Correcto: su rugido viaja hasta 8 kilómetros para marcar territorio.',
      },
      {
        question: '¿Quiénes cazan principalmente en una manada?',
        options: ['Los machos', 'Las hembras', 'Los cachorros'],
        correctIndex: 1,
        explanation: 'Correcto: las leonas trabajan en equipo para cazar.',
      },
      {
        question: '¿Cuántas horas puede dormir un león al día?',
        options: ['Hasta 8', 'Hasta 12', 'Hasta 20'],
        correctIndex: 2,
        explanation: 'Correcto: ahorran energía durmiendo hasta 20 horas diarias.',
      },
    ],
  },
  {
    slug: 'pinguino',
    name: 'Pingüino',
    scientificName: 'Spheniscus humboldti',
    tagline: 'El nadador elegante',
    description:
      'El pingüino de Humboldt llega desde las costas frías del Pacífico sudamericano. Es un ave que no vuela, pero nada como un torpedo. Conoce sus adaptaciones únicas en esta infografía.',
    conservationStatus: 'Vulnerable (UICN)',
    statusLevel: 'vulnerable',
    accentHex: '#0369a1',
    accentSoftHex: '#e0f2fe',
    stats: [
      { label: 'Profundidad', value: 'hasta 150 m' },
      { label: 'Velocidad en agua', value: '15 km/h' },
      { label: 'Esperanza de vida', value: '15–20 años' },
      { label: 'Temperatura corporal', value: '38–40 °C' },
    ],
    habitat: ['Costas rocosas', 'Islas del Pacífico', 'Aguas frías con corrientes'],
    diet: ['Pescado pequeño', 'Anchoas y sardinas', 'Calamares'],
    facts: [
      {
        title: 'Plumas impermeables',
        detail: 'Tiene alrededor de 70 plumas por centímetro cuadrado que lo aíslan del agua fría.',
      },
      {
        title: 'Vuelo bajo el agua',
        detail: 'Sus alas funcionan como aletas: "vuela" sumergido persiguiendo peces.',
      },
      {
        title: 'Pareja fiel',
        detail: 'Suelen formar parejas estables y reconocen a su pareja entre miles por su voz.',
      },
    ],
    quiz: [
      {
        question: '¿Qué hacen las alas del pingüino?',
        options: ['Le sirven para volar', 'Funcionan como aletas', 'Sirven para regular el calor solo'],
        correctIndex: 1,
        explanation: 'Correcto: sus alas son aletas perfectas para nadar.',
      },
      {
        question: '¿Qué come principalmente el pingüino de Humboldt?',
        options: ['Algas', 'Pescado pequeño', 'Krill exclusivamente'],
        correctIndex: 1,
        explanation: 'Correcto: su dieta es de anchovetas, sardinas y calamares.',
      },
      {
        question: '¿Cómo reconoce a su pareja entre miles?',
        options: ['Por su olor', 'Por su voz', 'Por el color del pico'],
        correctIndex: 1,
        explanation: 'Correcto: cada pingüino tiene un llamado vocal único.',
      },
    ],
  },
  {
    slug: 'mono',
    name: 'Mono',
    scientificName: 'Lagothrix flavicauda',
    tagline: 'El acróbata del bosque',
    description:
      'Nuestro mono choro de cola amarilla es endémico del Perú y una de las especies más carismáticas del zoológico. Ágil, curioso e inteligente: descubre su mundo en la copa de los árboles.',
    conservationStatus: 'En peligro (UICN)',
    statusLevel: 'peligro',
    accentHex: '#15803d',
    accentSoftHex: '#dcfce7',
    stats: [
      { label: 'Longitud de cola', value: 'hasta 75 cm' },
      { label: 'Salto', value: 'hasta 10 m' },
      { label: 'Esperanza de vida', value: '20–25 años' },
      { label: 'Dieta diaria', value: '2–3 kg de fruta' },
    ],
    habitat: ['Bosques nublados', 'Selva alta peruana', 'Copas de árboles'],
    diet: ['Frutas', 'Hojas tiernas', 'Insectos'],
    facts: [
      {
        title: 'Cola prensil',
        detail: 'Su cola funciona como una quinta mano: se enrolla en las ramas mientras duerme.',
      },
      {
        title: 'Endémico del Perú',
        detail: 'El mono choro de cola amarilla solo existe en los bosques del norte peruano.',
      },
      {
        title: 'Memoria de mapa',
        detail: 'Recuerda la ubicación de cientos de árboles frutales en su territorio de varios km².',
      },
    ],
    quiz: [
      {
        question: '¿Para qué usa el mono su cola prensil?',
        options: ['Para nadar', 'Como quinta mano', 'Para defenderse'],
        correctIndex: 1,
        explanation: 'Correcto: su cola se enrolla en ramas y le sirve de apoyo.',
      },
      {
        question: '¿Dónde vive el mono choro de cola amarilla?',
        options: ['En toda Sudamérica', 'Solo en Perú', 'Solo en África'],
        correctIndex: 1,
        explanation: 'Correcto: es endémico de los bosques nublados del Perú.',
      },
      {
        question: '¿Qué tan lejos puede saltar entre árboles?',
        options: ['Hasta 3 m', 'Hasta 10 m', 'Hasta 25 m'],
        correctIndex: 1,
        explanation: 'Correcto: puede cubrir saltos de hasta 10 metros.',
      },
    ],
  },
]

export function getAnimal(slug: string): Animal | undefined {
  return animals.find((a) => a.slug === slug)
}

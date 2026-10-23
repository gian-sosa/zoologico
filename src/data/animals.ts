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
  statusLevel: 'estable' | 'vulnerable' | 'peligro' | 'sin-determinar' | 'domestico'
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
    slug: 'vizcacha',
    name: 'Vizcacha',
    // El croquis no precisa la especie: confirmar antes de asignar un nombre binomial.
    scientificName: 'Lagidium sp.',
    tagline: 'La saltadora de los roquedales andinos',
    description:
      'La vizcacha andina es un roedor de orejas largas y cola peluda que se mueve con agilidad entre las rocas. Vive en grupos y encuentra refugio en las grietas de los roquedales. Se alimenta de vegetación y suele aprovechar el sol durante el día. Su recinto es el número 1 del mapa.',
    conservationStatus: 'Por confirmar según la especie',
    statusLevel: 'sin-determinar',
    accentHex: '#d97706',
    accentSoftHex: '#fef3c7',
    // Recursos provisionales: sustituir manualmente la imagen y el sonido.
    soundFile: '/leon.mp3',
    heroImage: '/leon.webp',
    stats: [
      { label: 'Grupo', value: 'Roedores' },
      { label: 'Actividad', value: 'Diurna' },
      { label: 'Vida en grupo', value: 'Colonias' },
      { label: 'Desplazamiento', value: 'Saltos entre rocas' },
    ],
    habitat: ['Roquedales andinos', 'Laderas de montaña', 'Grietas entre rocas'],
    diet: ['Herbívora', 'Pastos', 'Hojas y otras plantas'],
    facts: [
      {
        title: 'No es un conejo',
        detail: 'Aunque sus orejas recuerdan a las de un conejo, la vizcacha es un roedor de la familia de las chinchillas.',
      },
      {
        title: 'Equilibrio entre rocas',
        detail: 'Sus patas posteriores fuertes y su cola la ayudan a desplazarse y mantener el equilibrio en terrenos rocosos.',
      },
      {
        title: 'Refugios naturales',
        detail: 'Las grietas de las rocas le sirven de refugio frente a los depredadores y las condiciones del clima de montaña.',
      },
    ],
    quiz: [
      {
        question: '¿A qué grupo pertenece la vizcacha?',
        options: ['Conejos', 'Roedores', 'Felinos'],
        correctIndex: 1,
        explanation: 'La vizcacha es un roedor de la familia de las chinchillas, no un conejo.',
      },
      {
        question: '¿Dónde encuentra refugio la vizcacha andina?',
        options: ['En las copas de los árboles', 'Entre las grietas de las rocas', 'Bajo el agua'],
        correctIndex: 1,
        explanation: 'Las grietas de los roquedales le ofrecen protección y refugio.',
      },
      {
        question: '¿Qué come principalmente la vizcacha?',
        options: ['Pastos y otras plantas', 'Peces', 'Carne'],
        correctIndex: 0,
        explanation: 'Es herbívora: se alimenta de pastos, hojas y otras plantas.',
      },
    ],
  },
  {
    slug: 'alpaca',
    name: 'Alpaca',
    scientificName: 'Vicugna pacos',
    tagline: 'Una compañera de los pueblos andinos',
    description:
      'La alpaca es un camélido sudamericano domesticado desde hace miles de años en los Andes. Vive en rebaños, se alimenta de pastos y es conocida por su fibra suave y abrigadora. Forma parte de la vida y la cultura de muchas comunidades altoandinas. Encuentra las alpacas en el recinto número 2 del mapa.',
    conservationStatus: 'Animal domesticado',
    statusLevel: 'domestico',
    accentHex: '#0369a1',
    accentSoftHex: '#e0f2fe',
    // Recursos provisionales: sustituir manualmente la imagen y el sonido.
    soundFile: '/pingu.mp3',
    heroImage: '/pingu.webp',
    stats: [
      { label: 'Grupo', value: 'Camélidos' },
      { label: 'Relación con humanos', value: 'Domesticada' },
      { label: 'Vida en grupo', value: 'Rebaños' },
      { label: 'Cubierta corporal', value: 'Fibra abrigadora' },
    ],
    habitat: ['Pastizales altoandinos', 'Puna', 'Zonas de crianza de los Andes'],
    diet: ['Herbívora', 'Pastos', 'Heno y forraje'],
    facts: [
      {
        title: 'Dos tipos de fibra',
        detail: 'Las alpacas huacaya tienen fibra de aspecto esponjoso; las suri presentan fibras largas que caen en mechones.',
      },
      {
        title: 'Parientes sudamericanos',
        detail: 'La alpaca pertenece a la familia de los camélidos, junto con la llama, la vicuña y el guanaco.',
      },
      {
        title: 'Pies con almohadillas',
        detail: 'Sus pies tienen dos dedos y almohadillas blandas que le ayudan a caminar por el terreno de los Andes.',
      },
    ],
    quiz: [
      {
        question: '¿A qué familia pertenece la alpaca?',
        options: ['Felinos', 'Camélidos', 'Roedores'],
        correctIndex: 1,
        explanation: 'La alpaca es un camélido sudamericano, como la llama, la vicuña y el guanaco.',
      },
      {
        question: '¿Qué come principalmente la alpaca?',
        options: ['Peces', 'Pastos y forraje', 'Insectos'],
        correctIndex: 1,
        explanation: 'Es herbívora y se alimenta de pastos y otros forrajes.',
      },
      {
        question: '¿Cómo se llaman los dos tipos de alpaca según su fibra?',
        options: ['Huacaya y suri', 'Llama y guanaco', 'Puma y otorongo'],
        correctIndex: 0,
        explanation: 'Huacaya y suri se diferencian por la forma y la disposición de su fibra.',
      },
    ],
  },
  {
    slug: 'vicuna',
    name: 'Vicuña',
    scientificName: 'Vicugna vicugna',
    tagline: 'La silueta silvestre de la puna',
    description:
      'La vicuña es un camélido silvestre de los Andes, de cuerpo esbelto y pelaje abrigador. Habita en los pastizales de altura y se alimenta de vegetación. A diferencia de la alpaca, no es un animal domesticado. Representa la riqueza animal en el escudo del Perú y ocupa el recinto número 3 del mapa.',
    conservationStatus: 'Preocupación menor (UICN)',
    statusLevel: 'estable',
    accentHex: '#15803d',
    accentSoftHex: '#dcfce7',
    // Recursos provisionales: sustituir manualmente la imagen y el sonido.
    soundFile: '/monochoro.mp3',
    heroImage: '/monochoro.webp',
    stats: [
      { label: 'Grupo', value: 'Camélidos' },
      { label: 'Condición', value: 'Silvestre' },
      { label: 'Ambiente', value: 'Puna andina' },
      { label: 'Símbolo nacional', value: 'Escudo del Perú' },
    ],
    habitat: ['Puna', 'Pastizales altoandinos', 'Planicies de altura'],
    diet: ['Herbívora', 'Pastos de la puna', 'Otras plantas altoandinas'],
    facts: [
      {
        title: 'En el escudo del Perú',
        detail: 'La vicuña aparece en el escudo nacional como símbolo de la riqueza animal del país.',
      },
      {
        title: 'Fibra contra el frío',
        detail: 'Su fibra fina y densa ayuda a conservar el calor durante las bajas temperaturas de los Andes.',
      },
      {
        title: 'Silvestre, no doméstica',
        detail: 'Aunque está emparentada con la alpaca, la vicuña es silvestre y necesita protección frente a la caza ilegal y la pérdida de hábitat.',
      },
    ],
    quiz: [
      {
        question: '¿Qué representa la vicuña en el escudo del Perú?',
        options: ['La riqueza mineral', 'La riqueza animal', 'La riqueza vegetal'],
        correctIndex: 1,
        explanation: 'La vicuña simboliza la riqueza animal en el escudo nacional.',
      },
      {
        question: '¿Dónde vive la vicuña en estado silvestre?',
        options: ['En arrecifes de coral', 'En pastizales altoandinos', 'En bosques tropicales de tierras bajas'],
        correctIndex: 1,
        explanation: 'Su ambiente natural son los pastizales de altura de los Andes.',
      },
      {
        question: '¿Qué diferencia a la vicuña de la alpaca?',
        options: ['La vicuña es silvestre y la alpaca es doméstica', 'La vicuña es un ave', 'La alpaca es carnívora'],
        correctIndex: 0,
        explanation: 'Ambas son camélidos, pero la vicuña es silvestre y la alpaca fue domesticada.',
      },
    ],
  },
]

export function getAnimal(slug: string): Animal | undefined {
  return animals.find((a) => a.slug === slug)
}

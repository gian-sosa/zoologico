/**
 * Historia institucional del Parque Zoológico La Totorilla.
 * TODO: validar textos con la Escuela Profesional de Biología - UNSCH.
 * Textos de arranque (2001) generados como placeholder serio.
 */

export interface Milestone {
  year: string
  title: string
  text: string
}

export interface ZooValue {
  title: string
  text: string
}

export const ZOO_HISTORY = {
  foundedYear: 2001,
  affiliation: 'Escuela Profesional de Biología · UNSCH',
  affiliationShort: 'UNSCH · Biología',
  title: 'Una historia andina de rescate y aprendizaje',
  paragraphs: [
    'El Parque Zoológico La Totorilla nace en 2001 como un espacio académico de la Escuela Profesional de Biología de la Universidad Nacional de San Cristóbal de Huamanga (UNSCH). Lo que empezó como un área de estudio y práctica para estudiantes, creció con un propósito mayor: dar una segunda oportunidad a la fauna silvestre.',
    'Hoy, la mayoría de nuestros animales proviene del rescate del tráfico ilegal y de situaciones de riesgo. Aquí reciben cuidado veterinario, rehabilitación y un hogar digno, mientras la comunidad aprende a protegerlos.',
  ],
  mission:
    'Rescatar, rehabilitar y proteger la fauna silvestre afectada por el tráfico ilegal, formando biólogos y ciudadanos comprometidos con la conservación de los Andes y la Amazonía.',
  vision:
    'Ser el centro de referencia en Ayacucho para la conservación, la investigación y la educación ambiental, donde cada visita inspire el respeto por la vida silvestre.',
  values: [
    { title: 'Rescate primero', text: 'Cada animal recibe cuidado y dignidad.' },
    { title: 'Ciencia', text: 'Investigación con la UNSCH que guía decisiones.' },
    { title: 'Educación', text: 'Aprender para conservar, desde niños.' },
  ] as ZooValue[],
  milestones: [
    {
      year: '2001',
      title: 'Nace en la UNSCH',
      text: 'La Escuela de Biología crea un espacio de estudio y conservación en La Totorilla.',
    },
    {
      year: '2008',
      title: 'Refugio de rescates',
      text: 'Empiezan a llegar animales rescatados del tráfico ilegal para su rehabilitación.',
    },
    {
      year: '2015',
      title: 'Puertas a la comunidad',
      text: 'Se abre el circuito educativo y las visitas guiadas para colegios y familias.',
    },
    {
      year: 'Hoy',
      title: 'Conservamos juntos',
      text: 'Cada entrada apoya el cuidado de la fauna y la formación de nuevos biólogos.',
    },
  ] as Milestone[],
} as const

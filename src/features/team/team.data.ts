/**
 * Equipo del proyecto — EDÍTALO AQUÍ.
 * Reemplaza los nombres y roles de ejemplo por los reales.
 * Todos: estudiantes de Ingeniería de Sistemas, UNSCH.
 */

export interface TeamMember {
  name: string
  role: string
  focus: string
  initials: string
}

export const TEAM_LEADER: TeamMember = {
  name: 'Gian Carlos Mallqui Sosa',
  role: 'Líder del equipo · Coordinación general',
  focus: 'Arquitectura del proyecto, planificación y integración de los módulos.',
  initials: 'GC',
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Anita Esmeralda Flores Garagundo',
    role: 'Desarrollo frontend',
    focus: 'Infografías interactivas de animales, quiz y datos curiosos.',
    initials: 'C1',
  },
  {
    name: 'Maycol Rubén Loayza de la Cruz',
    role: 'Desarrollo frontend',
    focus: 'Boletería online: flujo de compra, validaciones y resumen.',
    initials: 'C2',
  },
  {
    name: 'Rodrigo Gerardo Pillaca Cabrera',
    role: 'Desarrollo frontend',
    focus: 'Muro de la comunidad: subida, compresión y gestión de fotos.',
    initials: 'C3',
  },
  {
    name: 'Eduard Soto Huamán',
    role: 'Diseño y contenidos',
    focus: 'Identidad visual, contenidos educativos y pruebas con usuarios.',
    initials: 'C4',
  },
]

export const TEAM_UNIVERSITY = 'Ingeniería de Sistemas · UNSCH'

export const PROJECT_ORIGIN =
  'Este proyecto integra trabajos de investigación desarrollados en distintos cursos de la carrera de Ingeniería de Sistemas. Cada módulo —infografías de fauna, boletería online y muro comunitario— nació como una investigación aplicada en el aula y aquí converge en una sola plataforma al servicio del Parque Zoológico La Totorilla y la educación ambiental en Ayacucho.'

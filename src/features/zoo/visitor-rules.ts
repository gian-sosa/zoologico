/**
 * Normativa del visitante — fuente única de verdad.
 * Se muestra en el inicio y en la página de entradas.
 */

export const VISITOR_RULES: readonly string[] = [
  'Está prohibido el ingreso de mascotas.',
  'Está prohibido alimentar a los animales.',
  'Debe respetar las señalizaciones del circuito.',
  'Deposite los residuos sólidos en los recipientes destinados.',
  'Conserve el boleto durante su visita.',
  'El Zoológico NO se hace responsable del cuidado de los niños.',
] as const

# Documentación técnica y arquitectónica — Zoológico La Totorilla

Esta documentación explica el sistema **a partir del código del repositorio**. Conserva la organización temática del [proyecto de referencia](https://github.com/devlizbethjaico/Marketplace-arquitSoft-02/tree/bf0dd8ddb9affd43d60bd9578f08c25c3e83ec69/docs), pero los actores, requisitos, decisiones, tablas y diagramas corresponden al zoológico.

> **Estilo arquitectónico:** cliente-servidor. **Enfoque de diseño:** modular por funcionalidades, con separación en capas lógicas. **Despliegue:** SPA y funciones serverless en Vercel, con Supabase como BaaS. No es Clean Architecture estricta ni un sistema de microservicios.

## 1. Cómo leer los documentos

| Área | Pregunta principal | Contenido |
|---|---|---|
| [01 · Análisis del sistema](01-analisis-de-sistema/01-actores.md) | ¿Quién lo necesita y qué debe resolver? | Actores, historias, requisitos, calidad, restricciones, drivers, decisiones y escenarios medibles. |
| [02 · Arquitectura de software](02-arquitectura-software/arquitectura-inicial.md) | ¿Cómo se distribuyen las responsabilidades? | Vista global, estilo, enfoque y catálogo de componentes. |
| [03 · Diseño de software](03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md) | ¿Cómo está construido por dentro? | Diseño de módulos, contratos, estados, principios y patrones realmente observables. |
| [04 · Modelo C4](04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md) | ¿Cómo explicarlo a diferentes niveles de detalle? | Contexto, contenedores, componentes y código. |

## 2. Índice completo

### Análisis del sistema

1. [Actores](01-analisis-de-sistema/01-actores.md)
2. [Historias de usuario](01-analisis-de-sistema/02-historias-del-usuario.md)
3. [Requisitos funcionales y trazabilidad](01-analisis-de-sistema/03-requisitos-funcionales.md)
4. [Atributos de calidad](01-analisis-de-sistema/04-atributos-de-calidad.md)
5. [Restricciones](01-analisis-de-sistema/05-restricciones.md)
6. [Drivers arquitectónicos](01-analisis-de-sistema/06-driver-arquitectonicos.md)
7. [Decisiones arquitectónicas](01-analisis-de-sistema/07-decisiones-arquitectonicas.md)
8. [Escenarios de atributos de calidad](01-analisis-de-sistema/08-escenarios-atributos-calidad.md)

### Arquitectura de software

1. [Arquitectura global](02-arquitectura-software/arquitectura-inicial.md)
2. [Componentes arquitectónicos](02-arquitectura-software/componentes-arquitectonicos.md)
3. [Enfoque de diseño](02-arquitectura-software/enfoque-aquitectonico.md)
4. [Estilo arquitectónico](02-arquitectura-software/estilo-arquitectonico.md)

### Diseño de software

1. [Diseño interno de módulos](03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md)
2. [Patrones de diseño](03-diseño-de-software/diseño-interno/patrones-de-diseño.md)
3. [Principios de diseño](03-diseño-de-software/diseño-interno/principios-de-diseño.md)

### Modelo C4

1. [Nivel 1 · Contexto](04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md)
2. [Nivel 2 · Contenedores](04-modelo-c4/Nivel2-DiagramadeContenedores.md)
3. [Nivel 3 · Componentes](04-modelo-c4/Nivel3-Diagrama-de-Componentes.md)
4. [Nivel 4 · Código](04-modelo-c4/Nivel4-DiagramadeCodigo.md)

## 3. Convenciones y límites de las afirmaciones

| Etiqueta | Significado |
|---|---|
| **Implementado** | Existe código o SQL que realiza la operación. No certifica que esté configurada y disponible en producción. |
| **Dependiente de configuración** | Requiere secretos de servidor, proveedores, permisos, datos legales o URLs de redirección. |
| **Propuesto / por validar** | Meta o mejora de diseño, no comportamiento demostrado ni compromiso operativo aprobado. |
| **Fuera de alcance actual** | No existe funcionalidad equivalente en el código revisado. |

Los diagramas Mermaid son editables en el propio Markdown y se visualizan en GitHub. Las cajas de código del nivel 4 representan funciones, módulos y tipos TypeScript; **no implican que existan clases o repositorios orientados a objetos**. Las flechas de dependencias de código no son conexiones HTTP.

La imagen [cliente-servidor en PNG](arquitectura-cliente-servidor.png) y su [fuente SVG](arquitectura-cliente-servidor.svg) se conservan para usar en diapositivas.

## 4. Fuentes de evidencia

| Fuente | Qué permite comprobar |
|---|---|
| [`src/app/router.tsx`](../src/app/router.tsx) | Rutas, redirecciones y protección del panel. |
| [`src/features/`](../src/features/) | Funcionalidades, servicios, validaciones, hooks y datos locales. |
| [`api/`](../api/) y [`server/`](../server/) | Handlers HTTP, procesamiento seguro, correo y scripts operativos. |
| [`supabase/migrations/`](../supabase/migrations/) | Tablas, restricciones, grants, políticas y cuotas. |
| [`tests/photos.test.mjs`](../tests/photos.test.mjs) y [`supabase/tests/security.sql`](../supabase/tests/security.sql) | Pruebas automatizadas; sus límites se explican en los escenarios de calidad. |
| [`vercel.json`](../vercel.json), [`vite.config.ts`](../vite.config.ts) y [`package.json`](../package.json) | Despliegue, construcción y ejecución local. |

No se han copiado los módulos de compras, pagos, vendedores, ERP o Redis del ejemplo. Tampoco se exponen credenciales, tokens ni datos personales reales en esta documentación.

## 5. Diagramas para presentaciones

Los documentos C4 incluyen una imagen y su fuente Mermaid desplegable. El SVG es vectorial; el PNG permite insertarlo directamente en diapositivas.

| Vista | Imagen | Vector |
|---|---|---|
| Nivel 1 · Contexto | [PNG](04-modelo-c4/diagramas/nivel1-contexto.png) | [SVG](04-modelo-c4/diagramas/nivel1-contexto.svg) |
| Nivel 2 · Contenedores | [PNG](04-modelo-c4/diagramas/nivel2-contenedores.png) | [SVG](04-modelo-c4/diagramas/nivel2-contenedores.svg) |
| Nivel 3 · Componentes | [PNG](04-modelo-c4/diagramas/nivel3-componentes.png) | [SVG](04-modelo-c4/diagramas/nivel3-componentes.svg) |
| Nivel 4 · Contratos | [PNG](04-modelo-c4/diagramas/nivel4-contratos.png) | [SVG](04-modelo-c4/diagramas/nivel4-contratos.svg) |
| Nivel 4 · Secuencia | [PNG](04-modelo-c4/diagramas/nivel4-secuencia.png) | [SVG](04-modelo-c4/diagramas/nivel4-secuencia.svg) |

## 6. Verificación de esta entrega

Se comprobaron los enlaces locales de los 20 documentos Markdown y la sintaxis de sus 25 diagramas mediante Mermaid 11.12.0. Las exportaciones se generaron con Chrome sin añadir dependencias al proyecto. Si se modifica un bloque Mermaid, se debe actualizar también su SVG/PNG correspondiente.

Además se ejecutaron 33 pruebas Node de reclamaciones, documentos, mapa y fotos, todas satisfactorias. Esta comprobación no incluye ejecución de las pruebas SQL contra una base remota, pruebas de carga, auditoría WCAG ni entrega real de correo. No se cambió código de ejecución de la aplicación.

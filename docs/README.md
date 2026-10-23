# Documentación técnica y arquitectónica — Zoológico La Totorilla

Esta documentación explica el sistema **a partir del código del repositorio**. Conserva la organización temática del [proyecto de referencia](https://github.com/devlizbethjaico/Marketplace-arquitSoft-02/tree/bf0dd8ddb9affd43d60bd9578f08c25c3e83ec69/docs), pero los actores, requisitos, decisiones, tablas y diagramas corresponden al zoológico.

> **Estilo arquitectónico:** cliente-servidor. **Enfoque de diseño:** modular por funcionalidades, con separación de responsabilidades. **Despliegue:** SPA y funciones serverless en Vercel, con Supabase como BaaS.

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

Todos los diagramas se incluyen como **imágenes PNG almacenadas en [`img/`](img/)** y enlazadas desde el documento correspondiente, sin bloques de código de diagramas ni dependencia de un visor especial. Las cajas de código del nivel 4 representan funciones, módulos y tipos TypeScript; **no implican que existan clases o repositorios orientados a objetos**. Las flechas de dependencias de código no son conexiones HTTP.

La imagen [cliente-servidor en PNG](img/arquitectura-cliente-servidor.png) y su [versión SVG](img/arquitectura-cliente-servidor.svg) también están disponibles en esa carpeta. Se conservan los archivos originales de la raíz de `docs/`.

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

Los 25 diagramas de análisis, arquitectura, diseño y C4 están generados en PNG, con una versión SVG adicional, dentro de `docs/img/`. Cada Markdown importa la imagen que le corresponde. El SVG es vectorial; el PNG permite insertarlo directamente en diapositivas. Si cambia un diagrama, deben actualizarse ambas imágenes.

Las imágenes siguen el estilo de la arquitectura cliente-servidor original: fondo crema, tarjetas blancas, verde para cliente/datos, azul para operaciones del servidor y ámbar para correo o recuperación. Los PNG tienen 2880 px de ancho; los diagramas de secuencia usan un lienzo vertical para mantener las etiquetas legibles.

La [fuente de generación](img/fuentes/generar-diagramas.mjs) dibuja directamente los SVG y exporta los PNG con Chrome, sin motores de diagramación. Para regenerarlos desde la raíz del proyecto:

```bash
node docs/img/fuentes/generar-diagramas.mjs
```

En equipos con Chrome en otra ubicación, definir `CHROME_PATH` con la ruta al ejecutable. La exportación comprueba que el texto no salga del lienzo ni de sus tarjetas.

| Vista | Imagen | Vector |
|---|---|---|
| Nivel 1 · Contexto | [PNG](img/nivel1-contexto.png) | [SVG](img/nivel1-contexto.svg) |
| Nivel 2 · Contenedores | [PNG](img/nivel2-contenedores.png) | [SVG](img/nivel2-contenedores.svg) |
| Nivel 3 · Componentes | [PNG](img/nivel3-componentes.png) | [SVG](img/nivel3-componentes.svg) |
| Nivel 4 · Contratos | [PNG](img/nivel4-contratos.png) | [SVG](img/nivel4-contratos.svg) |
| Nivel 4 · Dependencias | [PNG](img/nivel4-dependencias.png) | [SVG](img/nivel4-dependencias.svg) |
| Nivel 4 · Secuencia | [PNG](img/nivel4-secuencia.png) | [SVG](img/nivel4-secuencia.svg) |

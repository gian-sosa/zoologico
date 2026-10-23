# Enfoque de diseño arquitectónico

[Índice general](../README.md) · [Estilo](estilo-arquitectonico.md) · [Diseño interno](../03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md)

## 1. Enfoque seleccionado

**Diseño modular por funcionalidades, con separación en capas lógicas.** Se conserva el nombre del archivo de referencia (`enfoque-aquitectonico.md`) para facilitar la correspondencia entre documentos.

| Elemento | Aplicación al zoológico |
|---|---|
| Objetivo | Facilitar que cada cambio se localice en la funcionalidad responsable y que la seguridad no dependa de la UI. |
| Unidad de organización | Funcionalidades: animales, Auth, comunidad, tarifas, solicitudes, reclamaciones e información del zoológico. |
| Responsabilidades lógicas | Presentación; estado/validación/coordinación; acceso a servicios; procesamiento confiable; persistencia y permisos. |
| Dependencias reales | Hooks importan React; servicios importan el SDK Supabase; handlers conocen HTTP, SDK y helpers. |
| Beneficio | Menos capas artificiales y lectura directa del flujo, con reutilización donde existe una necesidad concreta. |
| Coste aceptado | Acoplamiento tecnológico explícito a React y Supabase, y algunas validaciones duplicadas. |

## 2. Distribución por carpetas

```text
src/
  app/          router, layout, RequireAdmin, ScrollManager
  components/   piezas visuales reutilizables
  pages/        pantallas asociadas a rutas
  features/     datos, servicios, validaciones y hooks por tema
  shared/       cliente público Supabase y utilidades
api/            entrada HTTP de fotos, documentos y reclamos
server/         procesamiento, correo y mantenimiento
shared/         validación de reclamos compartida entre runtimes
supabase/       esquema, permisos, cuotas y pruebas SQL
```

## 3. Dependencias lógicas observables

![Dependencias del diseño modular por funcionalidades](../img/enfoque-aquitectonico-1.png)

Las flechas sin etiqueta HTTP representan imports/uso. `features/` reúne funciones relacionadas para que el proyecto siga siendo fácil de entender.

## 4. Colaboración entre módulos y entornos

| Responsabilidad | Implementación | Criterio de separación |
|---|---|---|
| Presentación | Páginas y componentes React. | Mostrar información y recoger acciones del usuario. |
| Coordinación del navegador | Hooks y servicios de cada funcionalidad. | Gestionar estado, consultas y peticiones sin duplicar detalles en cada página. |
| Procesamiento confiable | Handlers de `api/` y helpers de `server/`. | Comprobar entradas y permisos antes de ejecutar operaciones privilegiadas. |
| Reglas reutilizables | Funciones puras como `shared/claims.mjs`. | Compartir validaciones entre navegador y servidor sin importar componentes visuales. |
| Persistencia y autorización | Supabase, migraciones y políticas. | Conservar datos y aplicar integridad, cuotas y acceso según la operación. |

La separación responde a responsabilidades reales del sistema cliente-servidor. Los servicios usan `getSupabase` o `createClient` en el entorno correspondiente; las credenciales privadas permanecen en el servidor.

## 5. Reglas de mantenimiento

| Regla | Aplicación práctica | Excepción o límite |
|---|---|---|
| Los componentes no deberían dispersar consultas SQL/SDK. | Mantener acceso a datos en servicios de la funcionalidad. | Hooks y formularios siguen coordinando estado de UI. |
| Una funcionalidad no usa el cliente privado de otra. | Tarifas usa `src/shared/supabase.ts`, no `photosClient`. | El cliente común es compartido deliberadamente. |
| Lo reutilizable debe tener un uso real. | `shared/claims.mjs` evita divergencias entre validación web y API. | Mesa de Partes aún tiene validación duplicada que debe revisarse al cambiar reglas. |
| Las API nunca importan componentes de UI. | Los handlers usan Node, helpers y contratos de datos. | Reutilizar validadores puros no implica importar React. |
| No crear nuevas capas sin necesidad. | Mantener `app/`, `components/`, `pages/`, `features/` y `shared/` sencillos. | Extraer un módulo si crece o requiere pruebas/uso independiente. |
| La autorización se comprueba donde se realiza la operación. | Verificación en API y políticas SQL, no solo `RequireAdmin`. | El cliente privilegiado omite RLS: el handler conserva responsabilidad. |

## 6. Ejemplo de un cambio localizado

Para modificar la compresión de fotos se revisan `image.ts`, `photo-image.mjs`, límites de API/bucket y tests. No se modifican el router, las fichas ni las tarifas salvo necesidad concreta. Si cambia un límite, deben alinearse interfaz, servidor, SQL y documentación.

## 7. Criterio para evolucionar

Cuando crezca una funcionalidad, se pueden extraer validadores, coordinadores o servicios más pequeños. La extracción debe responder a responsabilidades repetidas o pruebas difíciles, manteniendo la organización modular y los límites entre navegador, API y servicios gestionados.

# Persistencia y seguridad — Supabase

Proyecto conectado: `tmghqycqicfzsxlercae`.
El esquema se aplicó mediante el MCP de Supabase. Las migraciones versionadas
en `supabase/migrations/` reflejan los mismos identificadores del historial remoto.
No volver a ejecutar estos archivos manualmente sobre el proyecto ya migrado.

## Datos y permisos

| Tabla | Lectura | Escritura |
|---|---|---|
| `tariff_overrides` | Pública | Administradores autorizados mediante RLS |
| `visitor_photos` | Público: publicadas; propietario: sus fotos; administrador: todas | Solo API del servidor |
| `discount_requests` | Solo administradores | Solo API del servidor |
| `consumer_claims` | Solo administradores; no expone claves de idempotencia ni hashes | Alta solo desde API; actualización limitada a correo, acciones y respuesta |
| `photo_admins` | Cada usuario consulta únicamente su propia membresía | Solo gestión confiable desde SQL/servidor |
| `private.daily_submissions` | Sin acceso desde el navegador ni Data API | Contadores transaccionales del servidor |

Todas las tablas tienen RLS y permisos explícitos. No hay autoalta administrativa
por dominio, ni decisiones basadas en `user_metadata`. El frontend también exige
una fila en `photo_admins`; las políticas son la barrera real de autorización.
Se conserva el nombre histórico `discount_requests` para Mesa de Partes.
El contenido educativo, mapa y cuestionarios siguen siendo estáticos.

Las fotos publicadas exponen el autor, ID de propietario (UUID pseudónimo), ruta
y estado necesarios para la interfaz actual, pero no correos ni datos de Auth.
No publicar datos personales en el campo de autor.

## Archivos privados

* `visitor-photos`: solo WebP, máximo 300 KiB. La API Node recodifica la imagen,
  elimina metadatos y reserva el registro antes de subirla. Solo una foto aprobada
  es accesible al público mediante URL firmada; el propietario/personal puede
  consultar las fotos que le correspondan.
* `request-documents`: solo PDF, máximo 3 MiB. Solo el personal autorizado puede
  generar una URL de descarga, y únicamente después de completar la recepción.
* No hay políticas de subida, modificación ni eliminación de objetos desde el
  navegador. Estas operaciones usan las API existentes en `api/`.
* Las URL firmadas son credenciales temporales: no registrarlas en logs ni
  compartirlas indebidamente. La revocación de un permiso no invalida una URL ya
  emitida antes de su vencimiento (fotos: una hora; documentos: un minuto).
* La validación PDF existente **no es antivirus**. Para operación institucional,
  incorporar análisis de archivos antes de habilitar su descarga si se requiere.

### Subida de visitantes y aprobación

El visitante selecciona originales JPG, PNG o WebP de hasta **10 MiB por archivo**
(la interfaz los denomina 10 MB). Se validan tamaño, MIME y firma binaria antes de
decodificar; no se aceptan SVG, GIF, vídeos ni documentos. El navegador convierte
los píxeles a WebP de hasta 300 KiB antes del envío. El servidor no confía en MIME
ni extensión: vuelve a decodificar y recodificar el WebP recibido con Sharp.
El endpoint acepta **solo el archivo procesado**, no originales de 10 MB; así no
se aumenta innecesariamente el límite del bucket ni se depende de aceptar cuerpos
grandes en Vercel. El almacenamiento no conserva EXIF, GPS ni otros metadatos.

La API reserva `uploading` y confirma `pending` después de Storage. Ninguna subida
publica automáticamente. Solo `PATCH /api/photos?action=approve` con un usuario
no anónimo, token verificado y membresía en `photo_admins` puede aprobar; registra
`reviewed_by` y `reviewed_at`. El muro público consulta únicamente `published`.
Esta aprobación es editorial: no hay un detector automático de contenido inapropiado.

Ejecutar `npm run test:photos` con Node 22.18+ (recomendado Node 24). Las pruebas
usan el runner integrado, Sharp y peticiones Supabase simuladas; no suben fotos
reales. Cubren tamaño de originales, archivos disfrazados, recodificación, estado
pendiente y denegación de aprobación a visitantes. La prueba del navegador usa un
canvas simulado, por lo que no sustituye la prueba manual en el sitio desplegado.

## Configuración pendiente de despliegue

1. Frontend: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (acepta la clave
   **publishable**, recomendada). El `.env` local ya apunta al proyecto conectado.
2. Backend Node/Vercel: `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`. Esta última
   es secreta: **nunca** colocarla en una variable `VITE_*`, repositorio o navegador.
   El MCP no proporciona esta clave; debe configurarla el responsable en el host.
3. En Supabase Auth, configurar Google, las URL de redirección exactas de producción
   y localhost, y las sesiones anónimas usadas para fotos/Mesa de Partes.
   Habilitar CAPTCHA y límites de Auth para evitar creación masiva de identidades.
   **Estado comprobado:** Google y `anonymous_users` están habilitados. La opción
   de sesiones anónimas fue activada por el responsable en el Dashboard.
4. El libro requiere `CLAIMS_PROVIDER_*`, `CLAIMS_PRIVACY_*`, `RESEND_API_KEY` y
   `CLAIMS_EMAIL_FROM` de `.env.example`. Usar datos legales reales y un remitente
   verificado. **No se ha habilitado con datos ficticios.**
5. `npm run dev` ejecuta también las API Node de `api/*.mjs` mediante
   `server/vite-api.mjs`. Carga las variables privadas del `.env` solo en el proceso
   del servidor; no las expone al frontend. Configurar `SUPABASE_URL` y
   `SUPABASE_SERVICE_ROLE_KEY` en `.env` y reiniciar el comando después de cambiarlas.
   Si faltan, las API devuelven un error JSON de configuración (503), no código
   JavaScript ni HTML. No enviar la clave por chat ni añadirle el prefijo `VITE_`.
   `npm run preview` sigue sirviendo solo la compilación estática: no probar envíos
   con ese comando. En producción, Vercel ejecuta los handlers sin este adaptador.

### Alta explícita del primer administrador

Primero iniciar sesión con Google usando una cuenta institucional autorizada.
Luego, un responsable del proyecto ejecuta en el SQL Editor, sustituyendo el correo:

```sql
insert into public.photo_admins(user_id)
select id from auth.users
where lower(email) = lower('personal-autorizado@unsch.edu.pe')
  and email_confirmed_at is not null
  and is_anonymous is false
on conflict (user_id) do nothing;
```

La pertenencia al dominio por sí sola no basta. No se ha autorizado ninguna cuenta
real durante esta implementación. Recargar la aplicación después del alta.
Para revocar, eliminar únicamente la membresía identificada por su correo desde
SQL confiable; no eliminar automáticamente el usuario ni los documentos asociados.

## Integridad y operación

* Tarifas: IDs restringidos y precios entre S/ 0 y S/ 100 000, con dos decimales.
  No se duplican las tarifas base: la ausencia de un override conserva los valores
  definidos en `tickets.config.ts` y permite restablecerlos.
* Cuotas iniciales: 12 reservas de fotos y 10 documentos por identidad/día
  (`America/Lima`), incluidas subidas incompletas. Los contadores atómicos no se
  reinician al borrar una fila. No son protección suficiente ante muchas identidades:
  aplicar también CAPTCHA/rate limiting en el host de las API antes de producción.
* Reclamaciones: clave de envío única y hash comprobado por la API. Numeración
  generada por PostgreSQL; las secuencias pueden tener saltos tras conflictos o
  transacciones fallidas. No reiniciar la secuencia ni prometer numeración sin saltos.
* La `service_role` no tiene permiso de borrar reclamaciones ni de modificar su
  contenido original. La bandeja actual solo consulta: no implementa envío de
  respuestas ni una gestión completa del expediente.
* Establecer copias de seguridad y una política de conservación/recuperación con
  el responsable legal. No se programaron borrados automáticos de datos personales.
* Las reservas `uploading` y los archivos huérfanos tras fallos requieren una tarea
  de conciliación. No borrar objetos mediante SQL sobre `storage.objects`: usar la
  API de Storage tras verificar antigüedad y estado.
* Los contadores diarios históricos pueden purgarse mediante una tarea confiable
  después de su ventana de control; no exponen el contenido de los formularios.

## Verificación

`supabase/tests/security.sql` se ejecutó mediante MCP como postgres. Crea fixtures
temporales, cambia a los roles `anon`, `authenticated` y `service_role`, y finaliza
con `ROLLBACK`. No deja usuarios, reclamaciones, archivos ni tarifas de prueba y
no consume numeración real del libro. Cualquier aserción fallida produce un error.

Comprueba RLS, lectura pública de aprobadas, aislamiento de fotos pendientes,
denegación de autoalta y publicación directa, privacidad de documentos/reclamos,
cuotas, upsert administrativo, idempotencia, retención y buckets privados.
No sustituye una prueba completa de Google OAuth, correo ni antivirus.

Los advisors no detectaron problemas del esquema de seguridad. Queda el aviso
preexistente de **protección contra contraseñas filtradas deshabilitada**, configurable
en Auth según el plan: [guía oficial](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
Los índices recién creados pueden aparecer como «sin uso» hasta que haya tráfico;
no eliminarlos solo por ese aviso inicial: [explicación del advisor](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

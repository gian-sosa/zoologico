# Informe — Tipo de proyecto: Sitio web del Parque Zoológico La Totorilla

**Curso:** Desarrollo Web
**Proyecto:** Digitalización e interactividad de la visita al Parque Zoológico La Totorilla (Ayacucho)
**Repositorio:** `zoo-totorilla`
**Sitio de referencia:** https://zoologico-totorilla.vercel.app/

---

## 1. ¿Qué tipo de proyecto tengo en mente construir?

Un **sitio web programado desde cero con código propio**, como una **Single Page Application (SPA) moderna**, y no un sitio armado con un constructor visual ni un tema/plugin PHP de WordPress.

La pregunta del trabajo plantea tres caminos:

1. Sitio desde cero con constructor visual (Elementor, Divi o Gutenberg).
2. Tema o plugin propio en PHP (WordPress).
3. Sitio programado desde cero con tecnologías web actuales.

Elijo la **opción 3**: desarrollo a medida con **React + TypeScript + Vite**, enrutamiento con **React Router**, estilos con **Tailwind CSS** y despliegue como sitio estático en **Vercel**.

El motivo es académico y técnico: el objetivo del curso es aprender desarrollo web real (componentes, rutas, estado, formularios, validación, persistencia y despliegue), y eso solo se logra escribiendo el código. Un constructor visual ocultaría precisamente lo que se quiere evaluar.

---

## 2. ¿De qué trata el proyecto?

El proyecto plantea **digitalizar y hacer más interactiva la visita al zoológico**, que hoy depende casi por completo de la visita física, la boletería presencial y los carteles impresos junto a cada recinto.

Problemas que se abordan:

- El visitante llega sin información previa de especies, horarios, tarifas ni normas.
- Los carteles físicos son estáticos, se deterioran y no permiten escuchar sonidos, ver curiosidades ni evaluar lo aprendido.
- La compra de entradas solo es presencial, lo que genera colas.
- No hay un canal digital donde los visitantes compartan su experiencia ni donde el personal gestione entradas, fotos y contenido.

Objetivo general:

> Construir una plataforma web que acompañe al visitante **antes, durante y después** de la visita: planifica su llegada, aprende con infografías interactivas durante el recorrido y comparte sus fotos al finalizar, mientras el personal administra la operación desde un panel interno.

---

## 3. Alcance funcional

### 3.1. Página institucional (Inicio)

Presentación del zoológico como centro de rescate y educación ambiental, pilares (rescate, educación, conservación), horario, ubicación, tarifas, cómo llegar, servicios y normas del visitante.

### 3.2. Fauna (`/fauna` y `/fauna/:slug`)

Catálogo de especies con fichas individuales en formato de **infografía interactiva**:

- Datos clave (peso, velocidad, esperanza de vida).
- Hábitat y alimentación.
- Tarjetas de datos curiosos con efecto de giro (*flip*).
- Mini quiz por animal con retroalimentación inmediata.
- Reproducción de sonido (por ejemplo, el rugido del león con `/leon.mp3`) mediante el elemento de audio HTML.
- Portada fotográfica por animal (por ejemplo, `/leon.jpeg` como fondo del hero del león).

### 3.3. Entradas (`/entradas`)

Compra de entradas 100 % online: elección de fecha, tipos de entrada, cantidades, validación de formulario, generación de código de orden, guardado local y exportación a CSV para el personal.

### 3.4. Blog / muro comunitario (`/blog`)

Muro donde los visitantes suben fotos de su visita. Las imágenes se **comprimen en el navegador con Canvas** (`createImageBitmap` + `canvas.toDataURL('image/jpeg')`, limitadas a 720 px) para no exceder la cuota de almacenamiento, y se persisten en `localStorage`.

### 3.5. Administración (`/administracion` y `/administracion/panel`)

Acceso restringido por rol (visitante / administrador) con guardia de rutas. El panel permite ver el resumen de ventas, gestionar órdenes y precios, moderar fotos del muro y revisar el catálogo de fauna.

### 3.6. Equipo (`/desarrolladores`)

Página del equipo de Ingeniería de Sistemas (UNSCH) y de cómo cada módulo nació como investigación aplicada en el aula.

---

## 4. Tecnologías utilizadas

| Capa | Tecnología | Uso en el proyecto |
|---|---|---|
| UI | **React 19** | Componentes reutilizables (`AnimalCard`, `Quiz`, `FlipFact`, `PhotoWall`, `TicketSection`, `PageHeader`). |
| Lenguaje | **TypeScript** | Tipado de modelos (`Animal`, `QuizQuestion`, `TicketOrder`), stores y props. Detección de errores en compilación con `tsc -b`. |
| Build | **Vite 8** | Servidor de desarrollo, *code-splitting* por ruta con `React.lazy` y generación del `dist/` para producción. |
| Rutas | **React Router 7 (`BrowserRouter`)** | SPA con rutas `/`, `/fauna`, `/fauna/:slug`, `/entradas`, `/blog`, `/desarrolladores`, `/administracion`, `/administracion/panel`, `/404`. Redirecciones de rutas antiguas (`/animales` → `/fauna`, `/comunidad` → `/blog`). |
| Estilos | **Tailwind CSS 4** | Diseño responsive con utilidades, sin hojas CSS artesanales por página. |
| Estado / persistencia | **LocalStorage + stores propios** | Órdenes de entradas (`orders.store`), tipos y precios (`prices.store`), fotos (`photos.store`). Sin backend en esta etapa. |
| Multimedia | **HTML Audio, Canvas, `createImageBitmap`** | Sonidos de animales y compresión de fotos en el cliente. |
| Calidad | **Oxlint** | Linter rápido para React y TypeScript (`npm run lint`). |
| Despliegue | **Vercel (sitio estático)** | Se publica el `dist/` de Vite. Archivo `vercel.json` con un `rewrite` de `/(.*)` a `/index.html` para que el enrutado del lado del cliente funcione al recargar o entrar directo a una ruta profunda. |

Comandos principales:

- `npm run dev` — desarrollo local.
- `npm run build` — compilación TypeScript + Vite.
- `npm run preview` — vista previa de producción.
- `npm run lint` — análisis estático.

---

## 5. Arquitectura del código

```text
src/
  app/
    router.tsx          # Definición de rutas y redirecciones
    guards/             # RequireAdmin (protección por rol)
    layouts/            # RootLayout (Navbar + Footer + contenido)
  pages/                # HomePage, AnimalsPage, AnimalPage, TicketsPage,
                        # CommunityPage (Blog), DevelopersPage,
                        # AdminLoginPage, AdminDashboardPage, NotFoundPage
  components/           # Navbar, Footer, AnimalCard, Quiz, FlipFact,
                        # PhotoWall, AnimalSound, TicketSection
  features/
    animals/            # Datos y servicios de fauna
    tickets/            # Config, precios, órdenes, hook de compra
    community/          # Subida, compresión y guardado de fotos
    auth/               # Contexto y roles (visitante / administrador)
    team/               # Datos del equipo
  shared/
    config/ lib/ components/  # Config del sitio, storage, formato,
                              # validación, PageHeader, ScrollManager
  data/
    animals.ts          # Catálogo (incluye heroImage y soundFile del león)
public/
  leon.jpeg / leon.mp3  # Medios servidos como archivos estáticos
vercel.json           # Rewrite SPA (/(.*) → /index.html) en Vercel
```

Patrones aplicados: componentes presentacionales reutilizables, lógica encapsulada en *features* y *hooks*, carga diferida por ruta para reducir el bundle inicial y guardia de autenticación para la zona interna.

---

## 6. ¿Por qué no un constructor visual ni PHP/WordPress?

- **Constructor visual (Elementor / Divi / Gutenberg):** sirve para sitios informativos, pero no permite construir con facilidad un quiz interactivo por animal, tarjetas con giro, reproductor de sonidos, compresión de imágenes en el navegador ni un panel con roles y exportación a CSV sin depender de muchos plugins de pago. Además, ocultarían el código, que es justamente lo que el curso debe evaluar.
- **Tema/plugin PHP (WordPress):** es válido para blogs o sitios administrables, pero añadiría un servidor, base de datos y mantenimiento innecesarios para el alcance actual, y el rendimiento en móviles sería menor que el de un sitio estático. La persistencia actual en `localStorage` es suficiente para el prototipo académico y deja abierta la migración a un backend (por ejemplo, una API REST) sin reescribir la interfaz.
- **Sitio a medida con React:** da control total sobre la experiencia interactiva, es rápido (sitio estático + *lazy loading*), es responsive por diseño y permite demostrar competencias de desarrollo front-end moderno: componentes, rutas, formularios, validación, multimedia y despliegue continuo.

---

## 7. Resultado esperado

Al finalizar, cualquier persona puede entrar al sitio, conocer la fauna con infografías interactivas, comprar su entrada online, compartir su foto en el blog y, si es personal del zoológico, administrar la operación. Todo desde el navegador, sin instalar nada y con una base de código propia que documenta lo aprendido en el curso.

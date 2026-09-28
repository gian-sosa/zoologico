# PROPUESTA INICIAL DEL PROYECTO

# Parque Zoológico La Totorilla - Plataforma Web

## 1. Comprender el caso de negocio

El proyecto consiste en desarrollar una plataforma web para el **Parque Zoológico La Totorilla**, ubicado en Ayacucho. El sistema busca digitalizar parte de la experiencia del visitante, permitiendo consultar información del zoológico, conocer las especies disponibles, revisar características y contenido educativo de los animales y planificar una visita desde un navegador web.

La plataforma también incorpora un módulo de **venta de entradas online**, mediante el cual el visitante puede seleccionar tipos y cantidades de entradas, elegir la fecha de visita, registrar sus datos y obtener un código de compra. Actualmente, esta información se almacena localmente en el navegador como parte del prototipo académico.

Además, el sistema dispone de una sección de comunidad donde los visitantes pueden compartir fotografías de su visita y de un **panel de administración** para consultar órdenes, gestionar tarifas, moderar fotografías y revisar el catálogo de especies.

La solución se plantea inicialmente como una aplicación web de tipo SPA, pero su arquitectura debe permitir evolucionar desde el almacenamiento local hacia una infraestructura centralizada basada en **Supabase**, de manera que el sistema pueda crecer, compartir información entre usuarios y soportar una mayor cantidad de operaciones.

La propuesta arquitectónica sigue el enfoque de separación por capas indicado en la guía de Arquitectura de Software, donde cada capa posee responsabilidades específicas y se relaciona con las demás mediante interfaces definidas.

---

# 2. Identificar actores

Los actores representan las personas o sistemas externos que interactúan con la plataforma. La guía establece que un actor puede ser una persona, organización o sistema externo que interactúa con el sistema.

| ID | Actor | Tipo | ¿Qué necesita realizar? |
|---|---|---|---|
| A01 | Visitante | Humano | Consultar información del zoológico, explorar animales, realizar compras de entradas y compartir fotografías. |
| A02 | Administrador | Humano | Gestionar entradas, tarifas, fotografías de visitantes, información del sistema y consultar indicadores básicos. |
| A03 | Pasarela de pago | Sistema externo | Procesar y validar los pagos realizados por los visitantes. |
| A04 | Servicio de facturación | Sistema externo | Generar comprobantes electrónicos asociados a las compras realizadas. |
| A05 | Supabase | Sistema externo / Plataforma | Proporcionar autenticación, base de datos y almacenamiento centralizado para la aplicación. |

> **Nota:** En el prototipo actual las órdenes, precios, fotografías y sesión administrativa utilizan `localStorage`. En la arquitectura propuesta se considera **Supabase como infraestructura de persistencia y servicios para la etapa de escalamiento**.

---

# 3. Identificar historias de usuario

Las historias de usuario describen una necesidad desde la perspectiva del actor y siguen la estructura:

> **Como [actor], quiero [acción], para [beneficio].**

Esta estructura corresponde al formato indicado en la guía.

| ID | Historia de usuario |
|---|---|
| HU01 | Como visitante, quiero consultar información general del zoológico, para conocer sus horarios, ubicación, tarifas y servicios. |
| HU02 | Como visitante, quiero explorar las especies del zoológico, para conocer sus características, hábitat y estado de conservación. |
| HU03 | Como visitante, quiero consultar la ficha detallada de un animal, para obtener información educativa y datos curiosos sobre la especie. |
| HU04 | Como visitante, quiero interactuar con recursos educativos como sonidos y cuestionarios, para aprender de manera entretenida. |
| HU05 | Como visitante, quiero seleccionar y comprar entradas online, para evitar realizar el proceso de compra presencialmente. |
| HU06 | Como visitante, quiero seleccionar la fecha de mi visita, para planificar mi asistencia al zoológico. |
| HU07 | Como visitante, quiero recibir un código de compra después de registrar mis entradas, para utilizarlo como referencia de mi compra. |
| HU08 | Como visitante, quiero compartir fotografías de mi visita, para participar en la comunidad del zoológico. |
| HU09 | Como administrador, quiero iniciar sesión en el panel administrativo, para acceder de manera restringida a las funciones de gestión. |
| HU10 | Como administrador, quiero consultar las órdenes registradas, para controlar las entradas vendidas. |
| HU11 | Como administrador, quiero modificar las tarifas de las entradas, para mantener actualizados los precios del zoológico. |
| HU12 | Como administrador, quiero moderar las fotografías publicadas por visitantes, para mantener controlado el contenido de la comunidad. |
| HU13 | Como administrador, quiero consultar el catálogo de animales publicado, para verificar el contenido disponible en la plataforma. |

---

# 4. Identificar requisitos funcionales

Los requisitos funcionales expresan lo que el sistema debe realizar para satisfacer las historias de usuario. La guía establece que los requisitos funcionales se obtienen a partir de las historias de usuario.

| ID | Requisito funcional |
|---|---|
| RF01 | El sistema debe permitir consultar información general del zoológico. |
| RF02 | El sistema debe permitir consultar horarios, ubicación y tarifas. |
| RF03 | El sistema debe permitir mostrar el listado de especies disponibles. |
| RF04 | El sistema debe permitir consultar el detalle de una especie. |
| RF05 | El sistema debe permitir reproducir sonidos asociados a determinadas especies. |
| RF06 | El sistema debe permitir mostrar datos curiosos e información educativa de los animales. |
| RF07 | El sistema debe permitir realizar cuestionarios interactivos relacionados con las especies. |
| RF08 | El sistema debe permitir seleccionar cantidades de entradas según su categoría. |
| RF09 | El sistema debe permitir seleccionar la fecha de visita. |
| RF10 | El sistema debe permitir registrar nombre y correo electrónico del visitante. |
| RF11 | El sistema debe calcular automáticamente el total de la compra. |
| RF12 | El sistema debe permitir procesar el pago mediante una pasarela de pago externa. |
| RF13 | El sistema debe generar un código único asociado a la compra. |
| RF14 | El sistema debe generar o solicitar el comprobante de pago mediante un servicio de facturación. |
| RF15 | El sistema debe permitir registrar fotografías de los visitantes. |
| RF16 | El sistema debe permitir eliminar fotografías publicadas en el muro comunitario. |
| RF17 | El sistema debe permitir al administrador iniciar sesión. |
| RF18 | El sistema debe restringir el acceso al panel administrativo a usuarios autorizados. |
| RF19 | El sistema debe permitir consultar las órdenes registradas. |
| RF20 | El sistema debe permitir eliminar órdenes registradas. |
| RF21 | El sistema debe permitir exportar las órdenes a formato CSV. |
| RF22 | El sistema debe permitir modificar las tarifas de las entradas. |
| RF23 | El sistema debe permitir restablecer las tarifas a sus valores base. |
| RF24 | El sistema debe permitir al administrador moderar y eliminar fotografías. |
| RF25 | El sistema debe permitir consultar el catálogo de especies desde el panel administrativo. |
| RF26 | El sistema debe almacenar la información de usuarios, compras, especies, fotografías y tarifas en una base de datos centralizada cuando se implemente Supabase. |

---

# 5. Relación entre HU y requisitos funcionales

| Historia de usuario | Requisitos funcionales relacionados |
|---|---|
| HU01 Consultar información general | RF01, RF02 |
| HU02 Explorar especies | RF03, RF04 |
| HU03 Consultar ficha de animal | RF04, RF06 |
| HU04 Interactuar con recursos educativos | RF05, RF06, RF07 |
| HU05 Comprar entradas online | RF08, RF11, RF12, RF13 |
| HU06 Seleccionar fecha de visita | RF09 |
| HU07 Recibir código de compra | RF13 |
| HU08 Compartir fotografías | RF15 |
| HU09 Iniciar sesión administrativa | RF17, RF18 |
| HU10 Consultar órdenes | RF19, RF20, RF21 |
| HU11 Modificar tarifas | RF22, RF23 |
| HU12 Moderar fotografías | RF16, RF24 |
| HU13 Consultar catálogo publicado | RF25 |
| HU05/HU07 Proceso completo de compra | RF10, RF11, RF12, RF13, RF14, RF26 |

---

# 6. Identificar atributos de calidad

Los atributos de calidad describen **cómo debe comportarse el sistema**, además de qué funciones debe realizar. La guía considera como ejemplos rendimiento, disponibilidad, escalabilidad, seguridad y mantenibilidad.

| ID | Atributo de calidad | Escenario de calidad |
|---|---|---|
| AC01 | Rendimiento | Las páginas de inicio, fauna y entradas deben responder rápidamente incluso cuando varios visitantes consulten el sistema simultáneamente. |
| AC02 | Disponibilidad | La plataforma debe permanecer disponible para permitir consultar información y realizar compras durante el horario de atención. |
| AC03 | Escalabilidad | La arquitectura debe permitir aumentar la cantidad de usuarios y operaciones sin rediseñar completamente la aplicación. |
| AC04 | Seguridad | La información de administradores, órdenes y datos de visitantes debe estar protegida frente a accesos no autorizados. |
| AC05 | Usabilidad | El visitante debe poder consultar animales y comprar entradas mediante una interfaz sencilla e intuitiva. |
| AC06 | Mantenibilidad | Los cambios en fauna, entradas, comunidad o administración deben poder realizarse sin afectar innecesariamente otros módulos. |
| AC07 | Compatibilidad | La aplicación debe funcionar correctamente en navegadores web modernos y diferentes tamaños de pantalla. |
| AC08 | Integridad de datos | Las compras, precios, usuarios y registros almacenados deben conservar consistencia entre las operaciones realizadas. |

---

# 7. Identificar restricciones

Las restricciones representan condiciones tecnológicas, organizacionales o de proyecto que limitan las decisiones arquitectónicas. La guía utiliza ejemplos como aplicación web, Git/GitHub, API REST y servicios externos.

| ID | Restricción | Descripción |
|---|---|---|
| RC01 | Aplicación web | El sistema debe ser accesible mediante un navegador web. |
| RC02 | React + TypeScript | El frontend debe mantenerse desarrollado con React y TypeScript. |
| RC03 | Vite | El proyecto utiliza Vite como herramienta de construcción y desarrollo. |
| RC04 | Git y GitHub | El código fuente debe mantenerse versionado mediante Git y alojado en GitHub. |
| RC05 | Arquitectura por capas | La solución debe organizarse inicialmente mediante capas de presentación, lógica de negocio y datos. |
| RC06 | Integración externa | El proceso de pago debe utilizar una pasarela externa. |
| RC07 | Facturación externa | La generación de comprobantes debe realizarse mediante un servicio de facturación externo. |
| RC08 | Supabase | La solución debe estar preparada para utilizar Supabase como plataforma de persistencia y servicios al escalar. |
| RC09 | Navegadores modernos | La aplicación debe mantener compatibilidad con navegadores web actuales. |
| RC10 | Diseño responsive | La interfaz debe adaptarse a dispositivos móviles, tablets y computadoras. |
| RC11 | Protección administrativa | Las funciones de administración deben estar restringidas a usuarios autorizados. |

---

# 8. Identificar drivers arquitectónicos

Un driver arquitectónico es un requisito, atributo de calidad o restricción que tiene una influencia importante sobre las decisiones arquitectónicas. La guía propone precisamente identificar qué condiciones pueden cambiar la forma en que se diseña la arquitectura.

| ID | Driver arquitectónico | Origen | ¿Por qué influye en la arquitectura? |
|---|---|---|---|
| DA01 | El sistema debe soportar un crecimiento progresivo de usuarios y operaciones. | AC03 – Escalabilidad | Obliga a considerar una solución de datos centralizada y preparada para crecimiento. |
| DA02 | El sistema debe proteger la información administrativa y las compras. | AC04 – Seguridad | Influye en autenticación, autorización, políticas de acceso y protección de datos. |
| DA03 | Las consultas de información y operaciones de compra deben responder rápidamente. | AC01 – Rendimiento | Influye en estructura de componentes, carga de datos y comunicación entre capas. |
| DA04 | El sistema debe integrarse con una pasarela de pago externa. | RC06 – Integración externa | Requiere una interfaz de integración desacoplada para comunicarse con el proveedor externo. |
| DA05 | El sistema debe integrarse con un servicio de facturación. | RC07 – Facturación externa | Requiere mecanismos de integración con servicios externos. |
| DA06 | Supabase será utilizado como plataforma de datos al escalar. | RC08 – Supabase | Condiciona la capa de datos y el mecanismo de persistencia centralizada. |
| DA07 | Las funciones administrativas deben estar separadas de las funciones públicas. | AC04 / RC11 | Influye en autenticación, autorización y protección de rutas. |
| DA08 | El sistema debe facilitar cambios y evolución. | AC06 – Mantenibilidad | Favorece una separación clara entre presentación, negocio e infraestructura. |
| DA09 | El frontend debe comunicarse mediante servicios bien definidos. | RC05 – Arquitectura por capas | Permite mantener dependencias controladas entre presentación, negocio y datos. |

---

# 9. Diseñar la arquitectura en capas

La guía propone inicialmente una arquitectura de tres capas:

- **Presentación:** interacción con el usuario.
- **Lógica de negocio:** procesamiento de las funcionalidades.
- **Datos:** almacenamiento de información.

Esta separación permite distribuir responsabilidades y establecer dependencias claras.

Para el proyecto del Zoológico La Totorilla se propone conservar estas tres capas, incorporando las integraciones externas como servicios independientes.

## Diagrama de la arquitectura en capas

```mermaid
flowchart TD

    V["Visitante"]
    A["Administrador"]

    subgraph P["CAPA DE PRESENTACIÓN"]
        WEB["Aplicación Web<br/>React + TypeScript"]
        ROUTER["React Router"]
    end

    subgraph N["CAPA DE LÓGICA DE NEGOCIO"]
        FAUNA["Módulo de Fauna"]
        TICKETS["Módulo de Entradas"]
        COMUNIDAD["Módulo de Comunidad"]
        AUTH["Módulo de Autenticación"]
        ADMIN["Módulo de Administración"]
    end

    subgraph D["CAPA DE DATOS"]
        API["Servicios / API"]
        SUPA["Supabase"]
        DB[("PostgreSQL")]
        STORAGE["Storage"]
    end

    subgraph E["SISTEMAS EXTERNOS"]
        PAGO["Pasarela de Pago"]
        FACT["Servicio de Facturación"]
    end

    V --> WEB
    A --> WEB

    WEB --> ROUTER
    ROUTER --> FAUNA
    ROUTER --> TICKETS
    ROUTER --> COMUNIDAD
    ROUTER --> AUTH
    ROUTER --> ADMIN

    FAUNA --> API
    TICKETS --> API
    COMUNIDAD --> API
    AUTH --> API
    ADMIN --> API

    API --> SUPA
    SUPA --> DB
    SUPA --> STORAGE

    TICKETS --> PAGO
    TICKETS --> FACT
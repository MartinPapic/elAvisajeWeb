# El Avisaje 🌋🗺️

Plataforma de turismo y agenda territorial enfocada en la **Provincia de Llanquihue**, diseñada para visibilizar eventos culturales, turísticos y comunitarios mediante un **mapa interactivo** y **contenidos editoriales curados**.

El Avisaje no es un calendario automático: es una **plataforma editorial territorial**, donde los eventos son **propuestos por la comunidad**, **validados manualmente** y luego publicados con criterios de relevancia, veracidad y utilidad pública.

---

## 🎯 Propósito

* Centralizar eventos relevantes del territorio en un solo lugar confiable
* Facilitar la planificación turística y cultural
* Visibilizar iniciativas locales que no siempre aparecen en plataformas masivas
* Construir memoria territorial a través de contenidos editoriales

---

## 🧭 Alcance

* **Fase 1:** Provincia de Llanquihue
* **Fase 2:** Región de Los Lagos
* **Fase 3:** Otras regiones de Chile

---

## 👥 Usuarios objetivo

* Residentes locales
* Turistas nacionales e internacionales
* Organizadores de eventos
* Municipalidades y corporaciones culturales

---

## 🧩 Funcionalidades principales

* Mapa interactivo con eventos geolocalizados
* Filtro por rango de fechas y categorías
* Fichas descriptivas de cada evento (blog)
* Envío público de eventos mediante formulario
* Curaduría y validación editorial manual
* Eventos destacados (feature premium)

---

## 🏷️ Categorías de eventos

* Música y conciertos
* Artes escénicas (teatro, danza, circo)
* Arte y exposiciones
* Gastronomía y ferias costumbristas
* Naturaleza y actividades al aire libre
* Deportes y recreación
* Educación, charlas y talleres
* Fiestas tradicionales y religiosas
* Actividades familiares
* Comunidad y encuentros locales

---

## 🧠 Arquitectura técnica

### Stack

* **Frontend:** React 19 + Next.js 16 (App Router)
* **Mapa:** MapLibre GL JS
* **CMS / Backend editorial:** Sanity v5
* **UI Components:** shadcn/ui + Radix UI primitives
* **Styling:** Tailwind CSS v4
* **Patrón:** MVVM (Model–View–ViewModel)
* **Hosting:** Serverless (ISR + caching)
* **Lenguaje:** TypeScript 5

---

## 🧱 Patrón MVVM aplicado

### Model

* Schemas de Sanity (`src/sanity/schemaTypes/`)
* Queries GROQ (`src/services/sanityService.ts`)
* Tipos de dominio (`src/models/index.ts`)

### ViewModel

* Lógica de filtros y transformación de datos
* Manejo de estado del mapa (`src/viewmodels/`)
* Conexión entre UI y datos

### View

* Páginas Next.js (`src/app/`)
* Componentes UI (`src/components/`, `src/views/`)
* Mapa y tarjetas de eventos

---

## 🧭 Flujo de envío de eventos

1. Usuario envía evento mediante formulario público (`/proponer`)
2. Prevalidación en cliente (UX)
3. Envío a endpoint seguro (`/api/events/submit`)
4. Validación server-side + defensas anti-spam
5. Creación del evento en Sanity como **draft** (no publicado)
6. Revisión editorial manual en Sanity Studio
7. Publicación mediante botón "Publish" (solo eventos aprobados aparecen en el mapa)

---

## 🔐 Seguridad y control

* Sanity **nunca** es accesible directamente desde el cliente para escritura
* Tokens de escritura solo en el servidor
* Campos `submittedBy` y `submittedAt` de solo lectura
* Validación estricta de datos en API route
* Sistema de drafts de Sanity para moderación

---

## 📊 Estados de evento (Draft/Published System)

El Avisaje usa el **sistema nativo de drafts de Sanity**:

* **Draft (borrador)**: Evento enviado desde formulario público, pendiente de revisión
* **Published (publicado)**: Evento aprobado y visible en el mapa público
* Solo los eventos **publicados** se muestran en el sitio

> **Nota**: No usamos campos custom `status` o `visibility`. Sanity maneja esto automáticamente.

---

## 💰 Estrategia de monetización (progresiva)

* Eventos destacados (pin y card prioritaria)
* Planes mensuales para organizadores
* Contenido patrocinado claramente etiquetado
* Convenios institucionales

La monetización **no interfiere** con la curaduría editorial.

---

## 🧪 Escalabilidad (6 meses)

* Escritura controlada, lectura abierta
* Queries siempre filtradas por fecha y bounding box
* Cache e ISR para reducir carga en Sanity
* Sin backend persistente ni base de datos adicional

---

## 📌 Principios editoriales

* Veracidad antes que volumen
* Relevancia territorial
* Transparencia en contenidos patrocinados
* Prioridad a iniciativas locales

---

## 🚀 Getting Started

### 1. Requisitos previos

* Node.js 18+ (recomendado: 20+)
* npm o pnpm

### 2. Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd elAvisajeWeb

# Instalar dependencias
npm install
```

### 3. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Sanity:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="tu_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"
```

> **Nota**: Puedes obtener estas credenciales creando un proyecto en [sanity.io](https://www.sanity.io)

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el mapa.

---

## 📰 Panel de Administración (CMS)

El proyecto incluye un **Sanity Studio** embebido para gestionar el contenido.

1. Ve a `http://localhost:3000/studio`
2. Inicia sesión con tu cuenta de Sanity
3. **Importante**: Asegúrate de agregar `http://localhost:3000` a los **CORS Origins** en tu proyecto de Sanity (ver [sanity.io/manage](https://www.sanity.io/manage))

### Funcionalidades del CMS

* **Eventos**: Crea pines en el mapa con fecha, categoría y descripción
* **Geocodificación Gratuita**: Busca direcciones (e.g., "Puerto Varas") y obtén coordenadas automáticamente usando OpenStreetMap
* **Categorías**: Define tipos de eventos (Música, Feria, Gastronomía) y sus colores
* **Tags**: Etiquetas adicionales (Gratuito, Familiar, Pet Friendly)
* **Drafts**: Revisa y publica eventos enviados desde el formulario público

---

## 🗂️ Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                  # Homepage con mapa
│   ├── proponer/page.tsx         # Formulario público de envío
│   ├── studio/[[...index]]/page.tsx  # Sanity Studio
│   └── api/events/submit/route.ts    # API para envío de eventos
├── components/
│   ├── EventCard.tsx
│   ├── FilterPanel.tsx
│   ├── EventSubmissionForm.tsx
│   └── ui/                       # Componentes shadcn/ui
├── views/
│   └── map/                      # Componentes del mapa
├── viewmodels/                   # Lógica de negocio
├── models/
│   └── index.ts                  # Tipos TypeScript
├── services/
│   └── sanityService.ts          # Queries a Sanity
├── lib/
│   └── sanity.ts                 # Cliente de Sanity
└── sanity/
    ├── schemaTypes/              # Schemas de Sanity
    ├── components/               # Componentes custom del Studio
    └── sanity.config.ts
```

---

## 🏗️ Roadmap

* [x] Mapa Interactivo Básico
* [x] Integración con Sanity CMS
* [x] Detalle de Eventos
* [x] Búsqueda de Direcciones (Geocoding)
* [x] Filtros por Fecha y Categoría
* [x] Formulario público de envío
* [x] Sistema de drafts/publicación
* [ ] Clustering de pines
* [ ] Eventos destacados (premium)
* [ ] Modo Oscuro
* [ ] Notificaciones por email
* [ ] Extensión a Región de Los Lagos

---

## 🚀 Estado del proyecto

En desarrollo — enfocado en construir un MVP sólido, seguro y escalable, con énfasis en valor territorial y sostenibilidad a mediano plazo.

---

## 📄 Licencia

Por definir.

---

**El Avisaje** — Información local, visible en el territorio.

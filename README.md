# El Avisaje 🌋🗺️

**El Avisaje** es una plataforma digital de turismo y cultura enfocada inicialmente en la **Provincia de Llanquihue (Chile)**, con proyección de escalar a nivel regional y nacional. Su objetivo es **visibilizar eventos, actividades y hitos territoriales** mediante una experiencia centrada en el mapa, combinando información georreferenciada con contenidos editoriales.

La plataforma integra:

* Un **mapa interactivo** con eventos (pines) filtrables por rango de fechas.
* **Tarjetas (cards)** asociadas a cada evento.
* **Entradas tipo blog/noticia** para ampliar la información de cada evento.
* Un **CMS desacoplado** que permite a editores no técnicos gestionar contenido.

Este repositorio guía el desarrollo técnico del proyecto y sirve como referencia para el el entorno de desarrollo.

---

## 🎯 Visión del producto

El Avisaje busca convertirse en una **infraestructura digital territorial**:

* Útil para turistas, residentes y gestores culturales.
* Capaz de articular información dispersa (eventos, ferias, festivales, actividades locales).
* Escalable en cobertura geográfica y tipos de contenido.

La experiencia principal es el **mapa como interfaz**, complementado con contenido editorial que da contexto, relato y profundidad a cada evento.

---

## 🧱 Stack tecnológico

### Frontend

* **React + Next.js (App Router)**
* **MapLibre GL JS** para mapas interactivos
* **TypeScript**
* **Tailwind CSS** (o similar) para UI

### CMS

* **Sanity.io** como Headless CMS

  * Gestión de eventos (pines del mapa)
  * Gestión de cards
  * Entradas de blog / noticias
  * Campos geoespaciales y fechas

### Arquitectura

* Patrón **MVVM (Model–View–ViewModel)** adaptado a React
* Separación clara entre:

  * lógica de dominio
  * estado
  * presentación

---

## 🧠 Patrón de diseño: MVVM en React

El proyecto implementa una adaptación de **MVVM** para mantener escalabilidad, testabilidad y claridad.

### Model

Representa los datos puros del dominio:

* `Event`
* `Location`
* `DateRange`
* `Post`

Estos modelos reflejan la estructura proveniente de Sanity, pero desacoplados del CMS.

### ViewModel

Encapsula la lógica de estado y negocio:

* Fetch de datos desde Sanity
* Transformación de datos (fechas, filtros, clusters, etc.)
* Manejo de filtros por rango de fecha
* Estado del mapa (zoom, bounds, evento activo)

Ejemplos:

* `useEventsViewModel()`
* `useMapViewModel()`
* `useEventDetailViewModel(slug)`

### View

Componentes React **puros y declarativos**:

* `MapView`
* `EventCard`
* `EventPin`
* `EventPage`

Las vistas **no contienen lógica de negocio**, solo consumen props del ViewModel.

---

## 🗺️ Mapa de eventos

* Implementado con **MapLibre**
* Pines generados dinámicamente desde Sanity
* Cada pin representa un evento con:

  * coordenadas
  * fecha(s)
  * categoría

### Funcionalidades clave

* Filtro por **rango de fechas**
* Click en pin → abre card/resumen
* Navegación a página de detalle del evento
* Preparado para clustering en etapas posteriores

---

## 📰 Sistema editorial (Sanity)

Sanity actúa como el **panel de control** del proyecto.

### Tipos de contenido principales

#### Event

* Título
* Slug
* Descripción corta (card)
* Contenido largo (blog)
* Fecha inicio / fecha término
* Ubicación (GeoPoint)
* Imagen destacada
* Categoría

#### Post / Noticia

* Título
* Slug
* Contenido editorial
* Evento relacionado (opcional)
* Fecha de publicación

Sanity permite:

* Edición en tiempo real
* Previsualización
* Control de permisos
* Escalabilidad futura (multi-región)

---

## 🧭 Rutas principales (Next.js)

* `/` → Mapa con eventos activos
* `/eventos/[slug]` → Página descriptiva del evento
* `/noticias` → Listado editorial
* `/noticias/[slug]` → Entrada de blog

Preparado para:

* `/region/[slug]`
* `/categoria/[slug]`

---

## 📐 Principios de diseño

* **Mapa primero** (map-first UX)
* Contenido editorial como capa de profundidad
* Mobile-first
* Accesible y performante
* Pensado como producto cívico-cultural, no solo turístico

---

## 🚀 Escalabilidad futura

* Nuevas regiones y capas territoriales
* Usuarios colaboradores
* Reportes ciudadanos
* Integración con datos municipales o culturales
* Dashboards de actividad territorial

---

## 🧩 User Stories

Las siguientes *user stories* traducen los requerimientos del sistema a necesidades concretas de usuarios y stakeholders. Sirven como base para backlog, priorización de MVP y diseño de funcionalidades.

---

### 👥 Clientes

**US-01 — Descubrimiento por mapa**
Como **usuario**, quiero **ver un mapa con eventos cercanos**, para **descubrir rápidamente qué está ocurriendo**.

**US-02 — Filtro temporal**
Como **usuario**, quiero **filtrar eventos por rango de fechas**, para **planificar actividades**.

**US-03 — Información esencial del evento**
Como **usuario**, quiero **ver información clave al interactuar con un pin o card**, para **decidir rápidamente**.

**US-04 — Profundización editorial**
Como **usuario**, quiero **una página descriptiva del evento**, para **entender su contexto**.

**US-05 — Edición sin fricción**
Como **editor**, quiero **crear y editar eventos desde un CMS**, para **mantener información actualizada**.

---

### 🥊 Competencia

**US-06 — Mapa como interfaz principal**
Como **usuario**, quiero que **el mapa sea la vista principal**, para **no depender de listados**.

**US-07 — Curaduría territorial**
Como **usuario**, quiero **eventos relevantes y contextualizados**, para **evitar ruido**.

**US-08 — Enfoque hiperlocal**
Como **usuario**, quiero **ver eventos de la Provincia de Llanquihue**, para **sentir pertenencia territorial**.

---

### 🗃️ Datos

**US-09 — Datos confiables**
Como **sistema**, quiero **una fuente única de verdad**, para **evitar inconsistencias**.

**US-10 — Georreferenciación nativa**
Como **editor**, quiero **asignar coordenadas y fechas**, para **visualizar eventos correctamente**.

**US-11 — Desacople frontend–CMS**
Como **desarrollador**, quiero **consumir datos desacoplados**, para **escalar el sistema**.

---

### 🚀 Innovación

**US-12 — Estado del mapa controlado**
Como **usuario**, quiero **interacciones fluidas con el mapa**, para **explorar sin fricción**.

**US-13 — Arquitectura mantenible**
Como **desarrollador**, quiero **separar vistas, lógica y modelos**, para **mantener el sistema**.

**US-14 — Relato territorial**
Como **usuario**, quiero **narrativa y contexto**, para **comprender el territorio**.

---

### 💎 Valor

**US-15 — Decisión informada**
Como **usuario**, quiero **comparar eventos cercanos**, para **elegir mejor**.

**US-16 — Visibilidad local**
Como **organizador**, quiero **visibilidad en el mapa**, para **llegar a público relevante**.

**US-17 — Escalabilidad del proyecto**
Como **responsable**, quiero **expandir a otras regiones**, para **maximizar impacto**.

---

## 🗺️ Mapeo de User Stories a Arquitectura

Esta sección conecta cada *user story* con componentes, ViewModels y datos, permitiendo una implementación directa.

### Vista principal (Mapa)

* **US-01, US-06, US-08, US-12, US-15**

  * View: `MapView`, `EventPin`, `EventCard`
  * ViewModel: `useMapViewModel`, `useEventsViewModel`
  * Datos: `Event`, `GeoPoint`, `DateRange`

### Filtros y exploración

* **US-02, US-07**

  * View: `DateRangeFilter`, `CategoryFilter`
  * ViewModel: `useFiltersViewModel`
  * Datos: `DateRange`, `Category`

### Detalle de evento / narrativa

* **US-03, US-04, US-14**

  * View: `EventPage`, `EventHeader`, `EventContent`
  * ViewModel: `useEventDetailViewModel`
  * Datos: `Event`, `Post`

### Sistema editorial (CMS)

* **US-05, US-09, US-10**

  * CMS: Sanity (schemas `event`, `post`, `category`)
  * Datos: `GeoPoint`, `DateRange`, `Slug`

### Arquitectura y escalabilidad

* **US-11, US-13, US-17**

  * Capas: `models/`, `viewmodels/`, `views/`
  * Infraestructura: Next.js App Router, API desacoplada

---

**El Avisaje** — Información local, visible en el territorio.

# BIBLAPP — Sistema de Gestión Bibliotecaria

Sistema integral para la administración y control de bibliotecas, desarrollado con arquitectura desacoplada full stack: **Spring Boot** en el backend, **Angular** con **Angular Material 3** en el frontend, y un ecosistema de especificaciones y agentes en el directorio **.agents**.

---

## Índice

1. [Visión General del Proyecto](#-visión-general-del-proyecto)
2. [Estructura del Repositorio](#-estructura-del-repositorio)
3. [Módulo Backend (`biblapp-backend`)](#-módulo-backend-biblapp-backend)
4. [Módulo Frontend (`biblapp-frontend`)](#-módulo-frontend-biblapp-frontend)
5. [Ecosistema de Agentes y Especificaciones (`.agents`)](#-ecosistema-de-agentes-y-especificaciones-agents)
6. [Módulos Funcionales](#-módulos-funcionales)
7. [Endpoints Principales de la API REST](#-endpoints-principales-de-la-api-rest)
8. [Guía de Instalación y Ejecución](#-guía-de-instalación-y-ejecución)
9. [Estándares de Calidad y Pruebas](#-estándares-de-calidad-y-pruebas)

---

## 📖 Visión General del Proyecto

**BIBLAPP** permite gestionar el ciclo de vida completo de préstamos y reservas de libros en una biblioteca:
* **Catálogo de Libros**: Registro, clasificación por categorías y almacenamiento de portadas en la nube (Supabase Storage).
* **Gestión de Clientes**: Registro y administración de usuarios habilitados para reservas.
* **Módulo Transaccional de Reservas**: Control de disponibilidad de ejemplares, asignación de libros a clientes y transiciones de estado (`PENDIENTE`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`).
* **Búsqueda Avanzada**: Consultas combinadas por cliente (cédula o coincidencia parcial de nombres) y por rangos de fechas con inspección en modales de detalle.

---

## 📂 Estructura del Repositorio

```text
biblapp/
├── .agents/                    # Ecosistema de desarrollo asistido por IA
│   ├── docs/                   # Guías de diseño y arquitectura UI/UX
│   │   └── design.md           # Estándares de componentes, tokens y a11y
│   ├── features/               # Especificaciones funcionales y planes técnicos
│   │   ├── busqueda-spec.md    # Búsqueda y consulta de reservas
│   │   ├── cliente-crud.md     # Especificación de gestión de clientes
│   │   ├── libro-crud.md       # Catálogo de libros y categorías
│   │   ├── libro-photo-upload.md # Carga de portadas de libros
│   │   └── reservas-full-stack.md# Módulo transaccional de reservas
│   └── subagents/              # Roles y directrices de subagentes
│       └── white-code.md       # Rol writer-coder (backend + frontend)
│
├── biblapp-backend/            # API REST desarrollada en Spring Boot
│   ├── src/main/java/com/mitocode/biblappbackend/
│   │   ├── config/             # Configuración de ModelMapper, CORS y beans
│   │   ├── controller/         # Controladores REST (/v1/...)
│   │   ├── dto/                # Records y Data Transfer Objects
│   │   ├── enums/              # Enumeraciones de dominio (EstadoReserva)
│   │   ├── exception/          # Manejador global de excepciones
│   │   ├── model/              # Entidades JPA (Reserva, Libro, Cliente, etc.)
│   │   ├── repo/               # Repositorios Spring Data JPA con JPQL
│   │   └── service/            # Capa de servicio e implementaciones
│   ├── src/main/resources/     # Configuración application.yaml y mensajes
│   ├── pom.xml                 # Dependencias Maven y configuración del proyecto
│   └── mvnw.cmd / mvnw         # Maven Wrapper
│
├── biblapp-frontend/           # Aplicación SPA desarrollada en Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── forms/          # Formularios reactivos basados en Signals
│   │   │   ├── model/          # Interfaces TypeScript de dominio
│   │   │   ├── pages/          # Vistas (Categoria, Cliente, Libro, Reserva, Search, Layout)
│   │   │   ├── services/       # Clientes HTTP y servicio base genérico
│   │   │   ├── shared/         # Componentes y servicios compartidos (ConfirmDialog, etc.)
│   │   │   ├── store/          # Manejo de estado reactivo mediante Signals
│   │   │   ├── app.config.ts   # Proveedores de aplicación y rutas
│   │   │   └── app.routes.ts   # Enrutador principal
│   │   ├── environments/       # Variables de entorno (HOST API)
│   │   └── material-theme.scss # Tema centralizado de Angular Material 3
│   ├── angular.json            # Configuración de compilación y presupuestos
│   └── package.json            # Dependencias npm y scripts
│
└── README.md                   # Documentación general del proyecto
```

---

## ☕ Módulo Backend (`biblapp-backend`)

Construido sobre el framework **Spring Boot** con arquitectura por capas desacopladas y persistencia relacional.

### Tecnologías Clave:
* **Java**: Compatible con compiladores modernos y entornos empresariales.
* **Spring Boot**: `spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`.
* **Base de Datos**: PostgreSQL alojado en Supabase (`org.postgresql.Driver`).
* **Almacenamiento de Archivos**: Integración con **Supabase Storage** para la subida de imágenes de portada de libros.
* **Mapeo de Objetos**: `ModelMapper` para la conversión bidireccional limpia entre entidades JPA y DTOs.
* **Manejo de Excepciones**: `ResponseExceptionHandler` centralizado con `CustomErrorTemplate` para respuestas de error homogéneas (`400`, `404`, `500`).

### Patrones de Diseño Backend:
1. **CRUD Genérico**: Interfaz `ICRUD<T, ID>` y clase base `CRUDImpl<T, ID>` que reducen código duplicado para operaciones estándar.
2. **Consultas Optimizadas (Anti $N+1$)**: Uso de `LEFT JOIN FETCH` en repositorios JPA (`IReservaRepo`) para cargar cliente, detalles y libros en un solo viaje a la base de datos.
3. **DTOs Inmutables**: Uso de Java `record` (por ejemplo `FilterReservaDto`) para payloads de consulta y filtrado.

---

## 🅰️ Módulo Frontend (`biblapp-frontend`)

Aplicación moderna SPA desarrollada en **Angular** con enfoque reactivo de alto rendimiento.

### Tecnologías Clave:
* **Angular**: Standalone Components, control flow (`@if`, `@for`), y tipado estricto.
* **Angular Material 3**: `@use '@angular/material' as mat` con paleta Azure/Slate y densidad 0.
* **Manejo de Estado con Signals**:
  * Señales reactivas (`signal`, `computed`, `effect`) para estado local y global.
  * Formularios mediante `@angular/forms/signals` (`form()`, `required()`, `minLength()`, etc.).
  * Stores dedicados (`SearchStore`, `ReservaStore`, etc.) que exponen señales de datos, carga y error.
* **Diseño Responsivo**: Componentes CSS adaptables a móvil, tablet y escritorio con transiciones suaves y tarjetas elevadas (`.content-card`).

---

## 🤖 Ecosistema de Agentes y Especificaciones (`.agents`)

El proyecto implementa una metodología guiada por especificaciones técnicas estructuradas y subagentes de desarrollo:

### 1. Rol `writer-coder` ([white-code.md](file:///c:/prueba/.agents/subagents/white-code.md))
Subagente responsable de generar código cohesivo para backend y frontend respetando:
* Patrones arquitectónicos preexistentes en el repositorio.
* No modificación innecesaria de clases compartidas (`GenericService`, `ICRUD`).
* Verificación obligatoria de compilación en ambas capas antes de entregar.

### 2. Especificaciones de Funcionalidad ([features/](file:///c:/prueba/.agents/features))
Cada requerimiento cuenta con un documento markdown con especificación funcional, contratos HTTP, consultas JPQL, diseño de UI, plan de implementación y lista de criterios de aceptación verificables:
* [busqueda-spec.md](file:///c:/prueba/.agents/features/busqueda-spec.md): Pantalla de búsqueda reactiva por cliente y rango de fechas con modales de inspección.
* [reservas-full-stack.md](file:///c:/prueba/.agents/features/reservas-full-stack.md): Flujo completo de reservas y control de estados.
* [libro-photo-upload.md](file:///c:/prueba/.agents/features/libro-photo-upload.md): Carga de portadas multipart.
* [cliente-crud.md](file:///c:/prueba/.agents/features/cliente-crud.md) y [libro-crud.md](file:///c:/prueba/.agents/features/libro-crud.md): Módulos maestros de catálogo y usuarios.

### 3. Guía de Diseño ([design.md](file:///c:/prueba/.agents/docs/design.md))
Define la paleta de colores de marca, colores semánticos de estado (chips activos, pendientes, completados), tipografía Roboto, escalas de espaciado, anatomía de diálogos y principios de accesibilidad WCAG 2.1 AA.

---

## 🚀 Módulos Funcionales

| Módulo | Ruta Frontend | Endpoint Base | Descripción |
| :--- | :--- | :--- | :--- |
| **Categorías** | `/pages/categoria` | `/v1/categoria` | Clasificación de libros temáticos. |
| **Clientes** | `/pages/cliente` | `/v1/cliente` | Padrón de usuarios habilitados para préstamo. |
| **Libros** | `/pages/libro` | `/v1/libro` | Catálogo bibliográfico con ISBN, autor y fotos. |
| **Reservas** | `/pages/reserva` | `/v1/reserva` | Transacción de reservas y cambio rápido de estados. |
| **Búsqueda** | `/pages/search` | `/v1/reserva/search/*` | Consulta avanzada de reservas por cliente o fechas. |

---

## 📡 Endpoints Principales de la API REST

### Reservas y Búsqueda
* `GET /v1/reserva`: Lista todas las reservas con cliente y libros detallados.
* `GET /v1/reserva/{id}`: Consulta una reserva por su identificador único.
* `POST /v1/reserva`: Crea una nueva reserva con validación de libros disponibles.
* `PATCH /v1/reserva/{id}/estado?estado={ESTADO}`: Actualiza el estado (`PENDIENTE`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`).
* `POST /v1/reserva/search/others`: Búsqueda por datos del cliente (`cedula` o coincidencia parcial de `fullname`).
* `GET /v1/reserva/search/dates?date1={ISO}&date2={ISO}`: Búsqueda por rango de fechas inclusive.

### Libros
* `GET /v1/libro`: Listado de libros catalogados.
* `POST /v1/libro`: Creación de libro con soporte para archivo multipart (`file`) subido a Supabase.
* `PUT /v1/libro/{id}`: Actualización de datos y portada de libro.

---

## 🛠️ Guía de Instalación y Ejecución

### Requisitos Previos:
* **Java Development Kit (JDK)**: Java 24 o superior (configurado en `JAVA_HOME`).
* **Node.js**: Versión 24 o superior con **npm**.
* **Acceso a Base de Datos**: PostgreSQL (o credenciales configuradas en `application.yaml`).

---

### 1. Levantar el Backend

1. Navegar al directorio del backend:
   ```bash
   cd biblapp-backend
   ```
2. Compilar el proyecto verificando dependencias:
   ```bash
   .\mvnw.cmd clean compile
   ```
3. Ejecutar la aplicación Spring Boot:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
   * El servicio estará disponible en: `http://localhost:8080`.

---

### 2. Levantar el Frontend

1. Navegar al directorio del frontend:
   ```bash
   cd biblapp-frontend
   ```
2. Instalar dependencias npm:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm start
   # o alternativamente:
   npx ng serve
   ```
4. Abrir el navegador en: `http://localhost:4200`.

---

## 🧪 Estándares de Calidad y Pruebas

* **Compilación Backend**:
  ```bash
  .\mvnw.cmd test-compile
  ```
* **Verificación de Tipos Frontend**:
  ```bash
  npx tsc --noEmit
  ```
* **Pruebas Unitarias Frontend (Vitest)**:
  ```bash
  npm test -- --watch=false
  ```
* **Build de Producción**:
  ```bash
  npm run build
  ```
  *(Genera los bundles estáticos optimizados en `biblapp-frontend/dist/biblapp-frontend` sin advertencias de tamaño ni dependencias rotas).*

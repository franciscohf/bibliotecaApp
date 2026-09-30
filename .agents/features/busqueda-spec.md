# Búsqueda y Consulta de Reservas

| | |
| --- | --- |
| **Status** | Specification |
| **Date** | 2026-09-30 |
| **Scope** | `biblapp-backend` + `biblapp-frontend` |
| **Affects** | `IReservaRepo`, `IReservaService`, `ReservaServiceImpl`, `ReservaController`, `ReservaDto`, `ClienteDto`, `DetalleReservaDto`, `reserva.service.ts`, `search.store.ts`, `search-dialog.store.ts`, `search.form.ts`, `search.component.*`, `search-dialog.component.*`, `app.routes.ts` |
| **Reference** | `Reserva` vertical (backend), `query-consult.md` (patrón de arquitectura y diseño) |

> Especificación funcional y técnica completa para la búsqueda y consulta de reservas de biblioteca. Basada en el patrón de `query-consult.md`.

---

# Part 1 — Specification

## Problem

En **BIBLAPP**, las reservas de libros pueden crearse y gestionarse desde el módulo transaccional principal, pero actualmente no existe un mecanismo centralizado ni una pantalla optimizada para consultar el historial de reservas realizadas. 

El bibliotecario o administrador necesita:
1. Localizar reservas rápidamente consultando por **datos del cliente** (cédula o coincidencia de nombres/apellidos).
2. Consultar reservas filtrando por **rango de fechas** de reserva.
3. Inspeccionar el **detalle completo** de cualquier reserva encontrada (estado, observaciones, fecha exacta y lista de libros reservados con su información catalogada) sin sobrecargar la vista de tabla principal.

## Goal

Construir una pantalla de búsqueda (`/pages/search`) con dos modos de consulta mutuamente excluyentes (por cliente y por rango de fechas), una tabla reactiva de resultados consolidados y un diálogo modal de sólo lectura para ver el detalle de los libros reservados, respaldada por endpoints de consulta dedicados en el backend.

## Scope

### In scope:

* **Backend**:
  * Métodos de consulta JPQL en `IReservaRepo`: búsqueda por datos de cliente (`cedula`, `fullname`) y búsqueda por rango de fechas (`fechaReserva BETWEEN date1 AND date2`).
  * Endpoints REST en `ReservaController`:
    * `POST /v1/reserva/search/others` recibiendo `FilterReservaDTO` (cédula, nombres/apellidos).
    * `GET /v1/reserva/search/dates` recibiendo `date1` y `date2` como parámetros de consulta.
    * `GET /v1/reserva/{id}` o `GET /v1/reserva/{id}/detalles` para obtener el detalle de libros bajo demanda.
  * Mapeo de entidades `Reserva -> ReservaDto` y `DetalleReserva -> DetalleReservaDto` con `ModelMapper`.
* **Frontend**:
  * Pantalla de búsqueda (`/pages/search`) con pestañas (`mat-tab-group`): Tab 0 para búsqueda por cliente y Tab 1 para rango de fechas.
  * Botón único de acción ("Buscar") exterior a los tabs.
  * Formulario reactivo con Signals (`@angular/forms/signals` o Signal Form).
  * Store reactivo `SearchStore` gestionando `$reservaData` mediante `httpResource` y llamadas directas.
  * Tabla de resultados `mat-table` con columnas: ID, Cliente, Cédula, Fecha de Reserva, Estado, Total de Libros y Acción "Ver Detalle".
  * Diálogo modal `SearchDialogComponent` para inspeccionar la reserva seleccionada y sus libros (`DetalleReserva`).
  * Registro de la ruta `/pages/search` en `app.routes.ts` (aprovechando el enlace ya existente en `layout.component.html`).

### Out of scope:

* Modificación, edición o cancelación de reservas desde la pantalla de búsqueda (es una pantalla de consulta de sólo lectura).
* Combinación simultánea de ambos filtros (cliente y fechas) en una sola solicitud HTTP.
* Paginación o ordenamiento del lado del servidor para las consultas filtradas (los resultados filtrados se gestionan en memoria con `MatTableDataSource`).

---

## Decisions

**1. Dos modos de búsqueda, una sola pantalla, un solo botón de envío.**
La pestaña activa (`mat-tab-group`) determina qué flujo se ejecuta. El componente evalúa el índice de la pestaña seleccionada (`selectedIndex === 0` o `selectedIndex === 1`) y ejecuta la rama correspondiente. No existe endpoint unificado ni banderas condicionales en el servidor.

**2. La búsqueda por cliente es un `POST` con cuerpo; la búsqueda por fechas es un `GET` con query params.**
* Búsqueda por cliente: Se envía un payload con criterios en el cuerpo (`POST /v1/reserva/search/others`). Modela un comando de filtrado que puede crecer con más campos en el futuro.
* Búsqueda por fechas: Es una lectura pura parametrizada (`GET /v1/reserva/search/dates?date1=...&date2=...`), compartible e idempotente. Esta asimetría coincide con el patrón estandarizado en el proyecto.

**3. El payload del filtro es un `record` Java declarado en el backend.**
`FilterReservaDTO(String cedula, String fullname)` se declara de forma concisa como un `record` en el paquete de DTOs o en el propio controlador de reservas.

**4. Las consultas residen en `IReservaRepo` como JPQL `@Query` con `JOIN FETCH`.**
Para evitar el problema de $N+1$ y errores de `LazyInitializationException` al acceder a `r.cliente`, las consultas incluyen `LEFT JOIN FETCH r.cliente`. La búsqueda por cliente utiliza `OR` entre la cédula y las coincidencias parciales con `LIKE %:fullname%`. La búsqueda por fecha utiliza `BETWEEN`.

**5. El manejo de mayúsculas/minúsculas para `fullname` se divide entre cliente y servidor.**
La consulta JPQL normaliza las columnas de nombres y apellidos con `LOWER(c.nombres)` y `LOWER(c.apellidos)`. El frontend se encarga de convertir el término ingresado a minúsculas (`.toLowerCase().trim()`) antes de enviarlo.

**6. Carga bajo demanda del detalle de libros de la reserva.**
La tabla de resultados de búsqueda muestra los datos de cabecera y el cliente. Los libros incluidos en la reserva se cargan al abrir el diálogo modal `SearchDialogComponent` (o se toman del grafo precargado si la consulta ya incluye detalles), manteniendo liviana la transferencia de datos.

**7. Las fechas viajan en formato ISO local date-time strings (`yyyy-MM-ddTHH:mm:ss`).**
El backend analiza las fechas con `LocalDateTime.parse`. El frontend utiliza `date-fns` para formatear los valores del selector de fechas antes de transmitirlos.

---

## Data Flow

```
 Tab 0 (Cliente) --> POST /v1/reserva/search/others {cedula, fullname} --> repo.search(cedula, fullname)
 Tab 1 (Fechas)  --> GET  /v1/reserva/search/dates?date1&date2        --> repo.searchByDates(date1, date2)
                                 |
                                 v
                          ReservaDto[]  -->  MatTableDataSource (Tabla de Resultados)
                                 |
                        "Ver Detalle" botón
                                 |
                                 v
                     SearchDialogComponent (Modal)
                                 |
                                 +--> Muestra Cliente, Fecha, Estado, Observación
                                 +--> Muestra Lista de Libros (DetalleReservaDto[])
```

---

## Contract

```http
POST /v1/reserva/search/others   -> 200 OK + List<ReservaDto>
GET  /v1/reserva/search/dates    -> 200 OK + List<ReservaDto>
GET  /v1/reserva/{id}            -> 200 OK + ReservaDto (con detalles)
```

### 1. `POST /v1/reserva/search/others`

**Headers:** `Content-Type: application/json`

**Body (`FilterReservaDTO`):**

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `cedula` | `String` | No | Coincidencia exacta con `cliente.cedula`. |
| `fullname` | `String` | No | Coincidencia parcial `LIKE %...%` contra `cliente.nombres` y `cliente.apellidos` en minúsculas. |

*Comportamiento:* Ambos criterios se combinan mediante operador `OR`. Si ambos campos se completan, se amplía el conjunto de resultados a las reservas que coincidan con la cédula O con el nombre/apellido.

### 2. `GET /v1/reserva/search/dates`

**Query Parameters:**

| Parámetro | Tipo | Requerido | Formato | Descripción |
| --- | --- | --- | --- | --- |
| `date1` | `String` | Sí | `yyyy-MM-ddTHH:mm:ss` | Límite inferior del rango de fecha de reserva. |
| `date2` | `String` | Sí | `yyyy-MM-ddTHH:mm:ss` | Límite superior del rango de fecha de reserva. |

*Comportamiento:* Ambos extremos son inclusivos (`BETWEEN`). Si se envía un formato sin hora, el backend responde con código de estado `400 Bad Request` gestionado por `ResponseExceptionHandler`.

---

## Queries (JPQL)

En `IReservaRepo`:

```java
@Query("SELECT DISTINCT r FROM Reserva r " +
       "LEFT JOIN FETCH r.cliente c " +
       "LEFT JOIN FETCH r.detallesReserva d " +
       "LEFT JOIN FETCH d.libro l " +
       "WHERE c.cedula = :cedula " +
       "   OR LOWER(c.nombres) LIKE %:fullname% " +
       "   OR LOWER(c.apellidos) LIKE %:fullname%")
List<Reserva> search(@Param("cedula") String cedula, @Param("fullname") String fullname);

@Query("SELECT DISTINCT r FROM Reserva r " +
       "LEFT JOIN FETCH r.cliente c " +
       "LEFT JOIN FETCH r.detallesReserva d " +
       "LEFT JOIN FETCH d.libro l " +
       "WHERE r.fechaReserva BETWEEN :date1 AND :date2 " +
       "ORDER BY r.fechaReserva DESC")
List<Reserva> searchByDates(@Param("date1") LocalDateTime date1, @Param("date2") LocalDateTime date2);
```

> [!NOTE]
> El uso de `SELECT DISTINCT r` y `LEFT JOIN FETCH` asegura que las entidades relacionadas (`Cliente`, `DetalleReserva`, `Libro`) se carguen en un único paso, evitando consultas $N+1$ y permitiendo que el diálogo modal acceda a los libros sin solicitudes HTTP adicionales.

---

## Mapping

* Entidad `Reserva` -> DTO `ReservaDto`:
  * Mapeado estándar con `ModelMapper`.
  * `r.cliente` se transforma directamente en `ClienteDto` (los nombres de campos `nombres`, `apellidos`, `cedula` coinciden 1:1).
  * `r.detallesReserva` se transforma en `List<DetalleReservaDto>` (donde cada ítem contiene `LibroDto` con su título, autor e ISBN).
* `ModelMapper` existente (`defaultMapper`) ya maneja la conversión entre `Reserva` y `ReservaDto`. No se requieren mapeos anómalos o TypeMaps especiales con renombramiento de campos, pero se debe asegurar que la colección de detalles esté inicializada.

---

## Expected Files

### Backend (`biblapp-backend`):
* `repo/IReservaRepo.java`: Métodos `search(cedula, fullname)` y `searchByDates(date1, date2)`.
* `service/IReservaService.java`: Declaración de los métodos de búsqueda.
* `service/impl/ReservaServiceImpl.java`: Implementación delegando directamente al repositorio.
* `dto/FilterReservaDto.java`: Record o clase para el cuerpo del filtro de cliente.
* `controller/ReservaController.java`: Endpoints `POST /search/others` y `GET /search/dates`.

### Frontend (`biblapp-frontend`):
* `src/app/model/filter-reserva-dto.ts`: Modelo TypeScript para los filtros de búsqueda.
* `src/app/services/reserva.service.ts`: Métodos `searchByOthers(filter)` y `searchDates(date1, date2)`.
* `src/app/forms/search.form.ts`: Servicio de formulario (`SearchForm`) con señales para `cedula`, `fullname`, `startDate`, `endDate`.
* `src/app/store/search.store.ts`: Store con señal reactiva `$reservaData`, soporte de `httpResource` para fechas y suscripción para búsqueda por cliente.
* `src/app/pages/search/search.component.{ts,html,css}`: Componente principal con `mat-tab-group`, botón de búsqueda y tabla de resultados `mat-table`.
* `src/app/pages/search/search-dialog/search-dialog.component.{ts,html,css}`: Modal con detalle de la reserva y tabla de libros asociados.
* `src/app/app.routes.ts`: Registro de la ruta `{ path: 'pages/search', component: SearchComponent }`.

---

## Frontend Behavior

### 1. Formulario (`SearchForm`)
* Servicio `@Injectable()` que gestiona el estado de los campos:
  * `cedula`: `string`
  * `fullname`: `string`
  * `startDate`: `Date | null`
  * `endDate`: `Date | null`
* Proporcionado a nivel del componente (`providers: [SearchForm]`) para que el formulario se reinicie limpiamente en cada visita.

### 2. Pantalla de Búsqueda (`SearchComponent`)
* Cabecera con título e icono `search`.
* Contenedor con `mat-tab-group`:
  * **Pestaña 1 ("Buscar por Cliente")**: Campos `mat-form-field` para **Cédula** y **Nombres / Apellidos**.
  * **Pestaña 2 ("Buscar por Fechas")**: Selector de rango de fechas `mat-date-range-input`.
* Botón principal **"Buscar Reservas"** fuera de los tabs.
* Al pulsar el botón:
  * Si la pestaña activa es 0: extrae `cedula` y `fullname`, aplica `.toLowerCase().trim()` a `fullname` y llama a `store.searchByOthers(...)`.
  * Si la pestaña activa es 1: formatea ambas fechas a formato ISO (`yyyy-MM-dd'T'HH:mm:ss`) usando `date-fns` y llama a `store.searchByDates(...)`.

### 3. Store (`SearchStore`)
* Expone la señal `$reservaData: Signal<Reserva[]>`.
* Ambas fuentes de búsqueda (cliente o fechas) actualizan la misma señal `$reservaData`, garantizando que la tabla siempre lea de una única fuente de verdad y reemplace los resultados previos en lugar de concatenarlos.
* Estado de carga `$loading` mediante señal reactiva durante las peticiones.

### 4. Tabla de Resultados
Columnas renderizadas:
1. **ID**: Número correlativo de la reserva.
2. **Cliente**: Nombre completo concatenado (`nombres + ' ' + apellidos`).
3. **Cédula**: Cédula de identidad del cliente.
4. **Fecha de Reserva**: Fecha formateada (`dd/MM/yyyy HH:mm`).
5. **Estado**: Badge / Chip visual de color según el estado (`PENDIENTE`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`).
6. **Cant. Libros**: Número total de libros en la reserva (`detallesReserva.length`).
7. **Acciones**: Botón con icono `visibility` o `receipt_long` para abrir el diálogo de detalles.

### 5. Diálogo de Detalle (`SearchDialogComponent`)
* Se abre con `MatDialog.open(SearchDialogComponent, { data: reserva })`.
* Renderiza:
  * Resumen de cabecera: Cliente, Cédula, Fecha de Creación, Estado y Observaciones.
  * Tabla o lista de libros reservados: Título, Autor, Categoría e ISBN.
  * Botón para cerrar el diálogo.

---

## Acceptance Criteria

* [x] El menú lateral (`layout.component.html`) navega a `/pages/search` sin errores de ruta.
* [x] La búsqueda por cédula exacta retorna únicamente las reservas asociadas a dicho cliente.
* [x] La búsqueda por coincidencia parcial en minúsculas coincide tanto por nombres como por apellidos del cliente.
* [x] El frontend siempre envía el parámetro de nombre normalizado en minúsculas.
* [x] Si se llenan ambos campos (cédula y nombre), se retornan las reservas que cumplan cualquiera de las dos condiciones (`OR`).
* [x] La búsqueda por rango de fechas retorna las reservas cuya `fechaReserva` se encuentre dentro del rango inclusive.
* [x] Las fechas enviadas incluyen la parte de tiempo `T00:00:00` y `T23:59:59` para abarcar el día completo seleccionado.
* [x] Cambiar de pestaña y realizar una nueva búsqueda reemplaza inmediatamente los resultados anteriores.
* [x] Al hacer clic en "Ver Detalle", se abre el diálogo modal mostrando los libros reservados y datos de la reserva.
* [x] Si una reserva no contiene libros o el cliente no tiene observaciones, el diálogo muestra un mensaje de fallback amigable (`@empty`).
* [x] El backend compila limpiamente (`./mvnw compile`) y el frontend compila (`ng build`).

---

## Prerequisites

* Entidades `Reserva`, `Cliente`, `DetalleReserva` y `Libro` completamente funcionales en `biblapp-backend`.
* Datos de prueba en la base de datos con clientes y reservas registradas que contengan libros asociados.
* Enlace pre-existente en `layout.component.html` apuntando a `/pages/search`.

---

# Part 2 — Implementation Plan

### Fase 1 — Backend
1. **Repositorio**: Añadir consultas `@Query` `search` y `searchByDates` a `IReservaRepo.java`.
2. **Servicio**: Declarar y delegar los métodos en `IReservaService.java` y `ReservaServiceImpl.java`.
3. **DTO y Controlador**: Crear `FilterReservaDto` (record) e implementar los dos endpoints en `ReservaController.java`.
4. **Verificación**: Compilar con `.\mvnw.cmd test-compile`.

### Fase 2 — Frontend
1. **Modelo y Servicio**: Crear `filter-reserva-dto.ts` y añadir métodos de búsqueda en `reserva.service.ts`.
2. **Store y Formulario**: Crear `search.form.ts` y `search.store.ts` con manejo reactivo de señales.
3. **Componentes**:
   * Crear `SearchDialogComponent` para visualización del detalle de libros.
   * Crear `SearchComponent` con pestañas, filtros y tabla de reservas.
4. **Rutas**: Registrar el componente en `src/app/app.routes.ts` bajo la ruta `pages/search`.
5. **Verificación**: Probar compilación del bundle con Angular CLI.

# Cliente CRUD

| |                                                         |
| --- |---------------------------------------------------------|
| **Status** | Implemented                                             |
| **Date** | 2026-09-29                                              |
| **Scope** | `biblapp-frontend` (`biblapp-backend` already implemented) |
| **Reference** | `Categoria` vertical (backend), `Categoria` screen (frontend) |

---

# Part 1 — Specification

## Goal

Complete the CRUD for `Cliente` in the frontend (`biblapp-frontend`), consuming the existing REST API endpoints in the backend (`biblapp-backend`) and replicating the architectural and UI patterns established by `Categoria`.

## Scope

In scope:

* **Backend**: Inspect and verify existing vertical (endpoints, models, DTOs). No changes needed unless bug fixes are required.
* **Frontend**:
  * TypeScript model and service extending `GenericService`.
  * State management stores using Angular signals and `httpResource`.
  * Signal-based form validation (`@angular/forms/signals`).
  * List screen (`pages/cliente`) with search filter, pagination, and sorting.
  * Form screen (`pages/cliente/cliente-edit`) supporting creation (`new`) and edition (`edit/:id`).
  * Confirmation dialog for deletion via `ConfirmDialogComponent` and feedback via `NotificationService`.
  * Route registration in `app.routes.ts`.

Out of scope:
* Modifying existing backend services or controllers.
* Search, reports, or bulk operations.
* Direct management of associated reservations (`reservas`) from this view.

## Data Model

| Entity field | Type | Rules | DTO field |
| --- | --- | --- | --- |
| `id` | `Integer` | identity, generated | `id` |
| `nombres` | `String` | required, max 100 | `nombres` |
| `apellidos` | `String` | required, max 100 | `apellidos` |
| `cedula` | `String` | required, max 30, unique | `cedula` |
| `email` | `String` | required, max 150, unique | `email` |
| `telefono` | `String` | required, max 30 | `telefono` |
| `estado` | `Boolean` | required, default true | `estado` |
| `fechaRegistro` | `LocalDateTime` | generated on persist, non-updatable | `fechaRegistro` |

## Contract

```
GET    /v1/cliente        -> 200 OK + ClienteDto[]
GET    /v1/cliente/{id}   -> 200 OK + ClienteDto
POST   /v1/cliente        -> 201 Created + Location header
PUT    /v1/cliente/{id}   -> 200 OK + Cliente
DELETE /v1/cliente/{id}   -> 204 No Content
```

Request and response bodies are `application/json`. A missing id returns `404 Not Found` (`ModelNotFoundException`).

## Expected Files

Backend *(Already implemented — verify and reuse without modification)*:

* `model/Cliente.java`
* `dto/ClienteDto.java`
* `repo/IClienteRepo.java`
* `service/IClienteService.java`, `service/impl/ClienteServiceImpl.java`
* `controller/ClienteController.java`

Frontend *(To be implemented following `Categoria` patterns)*:

* `model/cliente.ts`
* `services/cliente.service.ts`
* `store/cliente.store.ts`, `store/cliente-edit.store.ts`
* `forms/cliente.form.ts`
* `pages/cliente/cliente.component.{ts,html,css}`
* `pages/cliente/cliente-edit/cliente-edit.component.{ts,html,css}`
* Route entry in `app.routes.ts`

Reuse `ICRUD`, `CRUDImpl` and `IGenericRepo` in the backend, and `GenericService` in the frontend. Do not modify shared abstractions.

## Acceptance Criteria

### Backend (Existing)
* [x] The five endpoints respond as described in the contract under `/v1/cliente`.
* [x] DTO validation rejects payloads missing required fields (`nombres`, `apellidos`, `cedula`, `telefono`).
* [x] Backend compiles successfully (`./mvnw -DskipTests compile`).

### Frontend (To Implement)
* [x] Model `model/cliente.ts` defined with appropriate types.
* [x] Service `services/cliente.service.ts` created extending `GenericService<Cliente>`.
* [x] Stores `store/cliente.store.ts` and `store/cliente-edit.store.ts` handle signals and HTTP resources.
* [x] Form `forms/cliente.form.ts` implements validation using `@angular/forms/signals`.
* [x] List screen shows clients table with filter, sorting, and pagination.
* [x] Edit component handles both create (`/pages/cliente/new`) and edit (`/pages/cliente/edit/:id`).
* [x] Deletion requests confirmation with `ConfirmDialogComponent` before calling the service.
* [x] User feedback displayed using `NotificationService` and `MatSnackBar`.
* [x] Routes registered in `app.routes.ts` under `/pages/cliente`.
* [x] Frontend builds successfully (`npm run build`).

---

# Part 2 — Implementation Summary

## Created Files

* `biblapp-frontend/src/app/model/cliente.ts`: Model definition for `Cliente`.
* `biblapp-frontend/src/app/services/cliente.service.ts`: HTTP service extending `GenericService<Cliente>`.
* `biblapp-frontend/src/app/store/cliente.store.ts`: Store managing collection HTTP resource and loading state.
* `biblapp-frontend/src/app/store/cliente-edit.store.ts`: Store managing single entity fetching for edit view.
* `biblapp-frontend/src/app/forms/cliente.form.ts`: Reactive signal form (`@angular/forms/signals`) with validators.
* `biblapp-frontend/src/app/pages/cliente/cliente.component.{ts,html,css}`: List view with filter, sort, pagination, and deletion dialog.
* `biblapp-frontend/src/app/pages/cliente/cliente-edit/cliente-edit.component.{ts,html,css}`: Create and edit view.

## Modified Files

* `biblapp-frontend/src/app/app.routes.ts`: Registered `/pages/cliente` route with child routes `new` and `edit/:id`.

## Verification Results

* **Backend Compilation**: `./mvnw -DskipTests compile` passed with `BUILD SUCCESS` (Java 25).
* **Frontend Build**: `npm run build` passed with exit code 0 (`Application bundle generation complete`).

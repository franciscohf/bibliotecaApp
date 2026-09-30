# Libro CRUD

| |                                                         |
| --- |---------------------------------------------------------|
| **Status** | Ready for Implementation                                |
| **Date** | 2026-09-29                                              |
| **Scope** | `biblapp-backend` + `biblapp-frontend`                  |
| **Reference** | `Categoria` / `Cliente` screens and `libro-photo-upload.md` |

> Specification only. Part 2 is written after the implementation.

---

# Part 1 — Specification

## Goal

A complete CRUD for `Libro`: REST endpoints in the backend supporting multipart requests for cover image uploads and Supabase storage lifecycle (following `libro-photo-upload.md`), and a full management interface in the frontend adhering to the project's reactive patterns (`Categoria` and `Cliente`).

## Scope

In scope:

* **Backend**:
  * Entity, DTO, Repository, Service, ServiceImpl, Controller.
  * Multipart support on `POST /v1/libro` and `PUT /v1/libro/{id}` (`libro` JSON + optional `file` image).
  * Supabase Storage integration for uploading new covers and deleting old covers when replaced.
  * Validation rules for book attributes and file limits.
* **Frontend**:
  * TypeScript model (`model/libro.ts`).
  * Service (`services/libro.service.ts`) extending `GenericService<Libro>` with `FormData` payload building.
  * State management stores (`store/libro.store.ts` and `store/libro-edit.store.ts`).
  * Signal-based form validation (`forms/libro.form.ts` using `@angular/forms/signals`).
  * List screen (`pages/libro`) displaying table with cover thumbnail, default fallback image (`default-book.svg`), search filter, pagination, sorting, and delete confirmation.
  * Create/edit screen (`pages/libro/libro-edit`) supporting child routes `new` and `edit/:id`, category select dropdown (`CategoriaService`), file upload input, and live image preview.
  * Route registration in `app.routes.ts`.

Out of scope:

* Multiple image uploads per book (single cover only).
* Direct reservation processing from the book management view.

## Data Model

| Entity field | Type | Rules | DTO field |
| --- | --- | --- | --- |
| `id` | `Integer` | identity, generated | `id` |
| `titulo` | `String` | required, max 200 | `titulo` |
| `autor` | `String` | required, max 150 | `autor` |
| `isbn` | `String` | required, max 20, unique | `isbn` |
| `disponible` | `Boolean` | required, default true | `disponible` |
| `editorial` | `String` | optional, max 150 | `editorial` |
| `anioPublicacion` | `Integer` | optional | `anioPublicacion` |
| `cantidadEjemplares` | `Integer` | required, min 0, default 1 | `cantidadEjemplares` |
| `photoUrl` | `String` | optional, max 250 | `photoUrl` |
| `categoria` | `Categoria` | required, ManyToOne relation | `categoria` (`CategoriaDto`) |
| `fechaCreacion` | `LocalDateTime` | generated, non-updatable | `fechaCreacion` |
| `fechaModificacion` | `LocalDateTime` | generated on update | `fechaModificacion` |

## Contract

```
GET    /v1/libro        -> 200 OK + LibroDto[]
GET    /v1/libro/{id}   -> 200 OK + LibroDto
POST   /v1/libro        -> 201 Created + Location header (consumes multipart/form-data)
PUT    /v1/libro/{id}   -> 200 OK + Libro / LibroDto (consumes multipart/form-data)
DELETE /v1/libro/{id}   -> 204 No Content
```

### Multipart Details (`POST` and `PUT`):
* `libro`: `application/json` payload mapped to `LibroDto`.
* `file`: `image/*` file part (optional).
* If a new file is uploaded on `PUT`, any previous photo stored in Supabase is deleted before setting the new `photoUrl`.
* If no file is sent on `PUT`, the existing `photoUrl` is preserved.

## Expected Files

Backend:

* `src/main/resources/application.yaml` (Supabase configuration)
* `model/Libro.java`
* `dto/LibroDto.java`
* `repo/ILibroRepo.java`
* `service/ILibroService.java`
* `service/impl/LibroServiceImpl.java`
* `controller/LibroController.java`

Frontend:

* `public/default-book.svg` (fallback image asset)
* `src/app/model/libro.ts`
* `src/app/services/libro.service.ts`
* `src/app/store/libro.store.ts`
* `src/app/store/libro-edit.store.ts`
* `src/app/forms/libro.form.ts`
* `src/app/pages/libro/libro.component.{ts,html,css}`
* `src/app/pages/libro/libro-edit/libro-edit.component.{ts,html,css}`
* Route entry in `src/app/app.routes.ts`

Reuse `ICRUD`, `CRUDImpl` and `IGenericRepo` in the backend, and `GenericService` in the frontend. Do not modify shared abstractions.

## Acceptance Criteria

### Backend
* [ ] `GET /v1/libro` and `GET /v1/libro/{id}` return books with populated category and `photoUrl`.
* [ ] `POST /v1/libro` receives multipart data, validates `libro` DTO, uploads image to Supabase bucket `photos`, and returns `201 Created` with `Location` header.
* [ ] `PUT /v1/libro/{id}` updates book data and, if a new file is provided, removes the previous photo from Supabase Storage and updates `photoUrl`.
* [ ] Updating a book without a file leaves existing `photoUrl` unchanged.
* [ ] `DELETE /v1/libro/{id}` deletes the record and returns `204 No Content`.
* [ ] Backend compiles successfully with `./mvnw -DskipTests compile`.

### Frontend
* [ ] TypeScript model `model/libro.ts` created.
* [ ] `LibroService` provides `save` and `update` sending `FormData` (`libro` Blob + optional `file`).
* [ ] `LibroStore` manages books collection via `httpResource`.
* [ ] `LibroEditStore` loads book data and categories list for dropdown selection.
* [ ] `LibroForm` enforces validations (`titulo`, `autor`, `isbn`, `cantidadEjemplares`, `categoria`) with `@angular/forms/signals`.
* [ ] List view (`LibroComponent`) renders table with cover image, using `/default-book.svg` when `photoUrl` is not present.
* [ ] Edit view (`LibroEditComponent`) provides image file selector with preview, category dropdown, availability toggle, and handles both `new` and `edit/:id`.
* [ ] Deletion triggers `ConfirmDialogComponent` before deleting.
* [ ] Route `/pages/libro` and child routes registered in `app.routes.ts`.
* [ ] Frontend builds successfully with `npm run build`.

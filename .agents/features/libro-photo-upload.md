# Libro Photo Upload

| | |
| --- | --- |
| **Status** | Ready for Implementation |
| **Date** | 2026-09-29 |
| **Scope** | `biblapp-backend` + `biblapp-frontend` |
| **Affects** | `LibroController`, `LibroServiceImpl`, `LibroDto`, `Libro`, `LibroComponent`, `LibroEditComponent`, `LibroService` |

---

# Part 1 — Specification

## Problem

The book cover/photo is stored as a URL in `Libro.photoUrl`. Users need to upload an image file from the book creation and edit screens. Furthermore, replacing an existing photo should clean up the old file in storage, and books without photos must display a fallback placeholder image in the UI.

## Goal

Send the photo together with the book data in a single request. The backend receives the file, uploads it to a public Supabase Storage bucket, deletes any previously assigned image when replacing it during an update, and persists the resulting public URL into `Libro.photoUrl`. The frontend displays the book cover or a default placeholder (`default-book.svg`) when no photo is available.

## Scope

In scope:

* Upload during book create (`POST /v1/libro`) and update (`PUT /v1/libro/{id}`).
* Storage in a public Supabase bucket named `photos`.
* Deleting replaced photos from the Supabase Storage bucket when a new image is provided on update.
* Server-side validation of file type images (`image/*`) and maximum size of 2MB.
* Frontend fallback to a default image (`default-book.svg`) for books without `photoUrl`.

Out of scope:

* Deleting photos when a book entity itself is deleted (handled separately if required).
* Image resizing, cropping, or format normalization.
* Photo upload for any resource other than `Libro`.

## Decisions

**The file travels through the backend, not straight to Supabase from the browser.**  
The service role key stays server-side, avoiding CORS issues or exposing sensitive credentials to the client.

**The upload is part of `POST /v1/libro` and `PUT /v1/libro/{id}`, not a dedicated endpoint.**  
One single multipart request per user action, avoiding inconsistent or half-saved states.

**The Supabase call lives inside `LibroServiceImpl` (or dedicated helper), with direct HTTP integration.**  
Keeps implementation simple and direct using Spring's `RestClient` or `WebClient`.

**The object name is `libros/{uuid}.{ext}` and does not include the book ID.**  
Allows the upload to happen before the entity is persisted, keeping creation as a single insert operation instead of insert-then-update.

**Replaced photos are deleted from Supabase Storage.**  
When updating a book with a new image and the book already has an existing `photoUrl` in the bucket, the previous file is removed via Supabase Storage API (`DELETE /storage/v1/object/photos/libros/{filename}`).

**Fallback image in frontend for missing photos.**  
If `photoUrl` is null, empty, or whitespace, the UI renders `/default-book.svg` from the application's `public` directory.

**The bucket name `photos` and credentials are not hardcoded.**  
Configuration properties must reside in `application.yaml` / `application.properties`:
* `supabase.url`
* `supabase.key`
* `supabase.bucket=photos`

## Contract

Both endpoints consume `multipart/form-data` with two parts:

| Part | Type | Required | Description |
| --- | --- | --- | --- |
| `libro` | `application/json` | yes | `LibroDto` payload, validated |
| `file` | `image/*` | no | Book cover image to upload |

```
POST /v1/libro        -> 201 Created + Location header
PUT  /v1/libro/{id}   -> 200 OK + Libro / LibroDto
```

The `libro` part must carry the `application/json` content type. A plain string part is rejected with `415 Unsupported Media Type`.

When `file` is absent during an update:
* `photoUrl` is left untouched: the existing URL travels in `LibroDto.photoUrl` and is preserved on the entity.
* No deletion occurs in Supabase Storage.

When `file` is present during an update:
* If the existing entity has a previous `photoUrl`, that object is deleted from the Supabase bucket.
* The new image is uploaded and the new public URL is persisted.

## Acceptance Criteria

* [x] Creating a book with a file stores the object in the bucket and persists its public URL in `photoUrl`.
* [x] Creating a book without a file succeeds and leaves `photoUrl` empty / null.
* [x] Updating a book without a file preserves the existing photo in the database and in storage.
* [x] Updating a book with a new file deletes the old image file from Supabase Storage and saves the new public URL.
* [x] A non-image file is rejected with a validation error (`400 Bad Request`).
* [x] A file exceeding the configured limit (2MB) is rejected.
* [x] `GET /v1/libro` returns the `photoUrl` populated so the UI can render it.
* [x] The frontend displays the book image when `photoUrl` exists, and renders `/default-book.svg` when it does not.
* [x] Backend compiles successfully (`./mvnw -DskipTests compile`) and frontend builds successfully (`npm run build`).

## Prerequisite

A public Storage bucket named `photos` must exist in the Supabase project with proper configuration in `application.yaml`:
* `supabase.url`
* `supabase.key`
* `supabase.bucket=photos`

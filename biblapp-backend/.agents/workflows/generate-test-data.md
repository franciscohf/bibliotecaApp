# Generate Test Data

Generate JSON seed payloads and insert them via curl to populate CRUD entity data, in a dependency-safe sequence, excluding `User` and `Role`.

## Assigned Agent

Use the `spring-test-data-generator` agent to produce the JSON payload files. This workflow defines the execution sequence and runs the curl calls — the agent does not execute requests itself.

## Required Input

* Base URL of the running application (defaults to `http://localhost:8080`).
* Real Supabase credentials for a user allowed to authenticate (used only to obtain a bearer token — never hardcoded into committed files).

## Population Sequence

Entities depend on each other in this order; later entities need ids produced by earlier ones:

1. `Categoria` — no dependencies.
2. `Libro` — needs `categoria_id` from step 1.
3. `Cliente` — no dependencies.

## Workflow

1. Read `CLAUDE.md` and re-derive the in-scope entity list by checking which controllers expose a create (`POST`) endpoint, excluding `User` and `Role`.
2. Delegate to `spring-test-data-generator` to produce `testdata/<entity>.json` for each in-scope entity.
3. For each entity in the order above, `curl -X POST {baseUrl}/v1/<entity-path>`.
4. Confirm each curl call returned a success status (`201 Created` or `200 OK`) before moving to the next dependent entity; stop and report if one fails.
5. Return a final summary including:

    * Entities populated and how many records were inserted for each
    * The resolved ids used to satisfy dependencies (e.g. which `categoria_id` was used for which `Libro`)
    * Any entity skipped and why (missing create endpoint, out of scope, or a failed dependency)

## Acceptance Criteria

- `User`, `Role`, `Menu`, `DetalleReserva`, `Reserva` are never populated by this workflow.
- No real credentials are committed to `testdata/` files — credentials are supplied at run time only.
- Entities are only inserted after their dependencies exist.
- The final summary lists every id created, so the data can be traced or cleaned up later.
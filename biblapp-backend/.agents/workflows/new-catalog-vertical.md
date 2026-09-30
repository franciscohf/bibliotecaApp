# New Catalog Vertical

Create or extend a simple catalog-style CRUD resource in this backend.

## Assigned Agent

Use the `backend-vertical-generator` agent to perform the implementation.

## Required Input

* Resource name in singular form.
* API path under `/v1`.
* Entity fields with types, lengths, required flags, and relationships.
* DTO field names when they differ from entity fields.
* Any endpoint that should be public.

## Workflow

1. Validate that all required input has been provided.
2. Read `CLAUDE.md` to understand the project conventions.
3. Delegate the implementation to the `sbackend-vertical-generator` agent.
4. Review the agent's output for completeness.
5. If compilation or implementation issues are reported, ask the agent to resolve them before continuing.
6. Verify that the implementation satisfies all acceptance criteria.
7. Return a final summary including:

    * Changed files
    * Endpoint contract
    * Validation rules
    * Compilation and verification results

## Acceptance Criteria

* The resource follows the existing CRUD architecture.
* DTO validation rejects invalid request payloads.
* Create returns `201 Created` with a `Location` header.
* Find, update, and delete use the existing not-found behavior.
* The project compiles successfully.
* No shared CRUD, exception, or abstractions are modified unless explicitly required.
* No secrets or environment-specific values are introduced.
## Context

The project starts from an OpenSpec-only repository and needs a complete URL shortener application. The service has three major responsibilities: create shortened URL mappings, redirect visitors from short codes to original URLs, and provide a simple web UI for creating links.

The frontend and backend must be modular enough to run and deploy separately. That means each application owns its package metadata, lockfile, Dockerfile, compose file, tests, TypeScript configuration, and ESLint configuration. The root of the repository only coordinates the full stack for local development.

Target structure:

```text
backend/
  package.json
  bun.lock
  Dockerfile
  docker-compose.yml
  eslint.config.js
  tsconfig.json
  prisma/
  src/
  tests/

frontend/
  package.json
  bun.lock
  Dockerfile
  docker-compose.yml
  eslint.config.js
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  src/
  tests/

package.json
bun.lock
docker-compose.yml
.prettierrc
.prettierignore
```

## Goals / Non-Goals

**Goals:**

- Provide an Express backend that creates short URLs and redirects short-code requests.
- Require user-provided short codes with clear conflict handling when a requested code is already taken.
- Persist URL mappings in PostgreSQL using Prisma.
- Provide a React, Vite, and Material UI frontend for creating short URLs, entering required short codes, and displaying validation or conflict errors.
- Keep backend and frontend independently installable, testable, buildable, containerized, and deployable.
- Provide root-level scripts and compose orchestration for running the full stack together.
- Keep tests local to each application.

**Non-Goals:**

- User accounts, authentication, teams, billing, analytics dashboards, or custom domains.
- Distributed cache, queueing, or multi-region routing.
- A shared package workspace as the primary dependency model.
- Automatic short-code generation, which can be added as a future feature.
- Advanced abuse prevention beyond basic URL and short-code validation.

## Decisions

### Use standalone app packages instead of a Bun workspace dependency model

Each app gets its own `package.json` and `bun.lock`. The backend can run from `backend/` and the frontend can run from `frontend/` without installing dependencies from the repository root.

Rationale: this matches the separate deployment requirement and avoids hidden dependency coupling through the root. A root `package.json` and `bun.lock` can still provide convenience scripts such as `dev`, `test`, and `build`, but those scripts should delegate into the app folders rather than own app dependencies.

Alternative considered: use Bun workspaces with one root lockfile. That would simplify monorepo dependency management, but it makes standalone deployment less explicit and can hide app-level dependency drift.

### Backend owns Prisma and the database contract

Place Prisma under `backend/prisma/`, with the backend package owning Prisma CLI scripts, migrations, generated client usage, and database-related tests.

Rationale: Prisma is part of backend persistence, not a shared root concern. Keeping it local allows the backend to deploy independently with its schema, migrations, and generated client.

Alternative considered: place `prisma/` at the root. That is common in single-service apps, but it weakens the standalone backend boundary.

### Root compose orchestrates the full stack, app compose files support standalone use

Use:

- `backend/docker-compose.yml` for backend plus PostgreSQL.
- `frontend/docker-compose.yml` for frontend-only local/container execution with a configurable backend API URL.
- Root `docker-compose.yml` for frontend, backend, and PostgreSQL together.

Rationale: app-level compose files support isolated development and deployment checks. Root compose gives one command for the integrated local stack.

Alternative considered: root compose only. That is simpler, but it does not satisfy the "standalone folder" requirement as cleanly.

### API boundary between frontend and backend

The frontend communicates with the backend over HTTP using an environment-configurable API base URL, for example `VITE_API_BASE_URL`. The backend exposes JSON API routes for URL creation and serves redirect routes for short codes.

In deployed environments, the frontend and backend are intended to share the same public base URL. API routes should live under `/api/*`, while short-code redirects should live at `/:code`. The backend should use the configured public base URL when returning created short URLs.

Expected backend routes:

- `POST /api/urls`: validate an original URL and required short code, reserve the short code, persist the mapping, and return the short URL.
- `GET /:code`: look up the code and redirect to the original URL.
- `GET /health`: report backend health for compose and deployment checks.

For `POST /api/urls`, the user-provided short code is required. If the requested short code already exists, the backend returns `409 Conflict` with a machine-readable error such as `SHORT_CODE_TAKEN`. The frontend displays that error inline and asks the user to choose a different short code.

If `GET /:code` does not find a matching short code, the backend redirects the visitor to a frontend-owned 404 not found page. The frontend should provide that page as a normal route so missing short-code visits produce a user-friendly not found experience.

Rationale: a clear HTTP boundary lets the frontend and backend deploy to different hosts. The redirect route stays on the backend because it depends on database lookup and HTTP redirect behavior.

Alternative considered: serve the frontend from Express. That is simpler for one container, but it couples the deployable units.

### Use PostgreSQL with Prisma for persistence

Store URL mappings in PostgreSQL with a Prisma model that captures at least:

- Generated ID
- Unique short code
- Original URL
- Creation timestamp
- Optional update timestamp

Rationale: PostgreSQL matches the required stack and Prisma gives typed database access and migration workflow.

Alternative considered: direct `pg` queries. That would reduce dependencies, but Prisma improves schema management and typing for this project.

### Short code assignment requires user-provided codes

Require the user to provide a short code when creating a URL mapping. Validate the provided code before persistence. Use a conservative format such as lowercase letters, digits, and hyphens, with a bounded length.

Enforce uniqueness at the database level for all short codes. For conflicts, return a `409 Conflict` response and let the frontend prompt the user to choose a different code.

Rationale: database uniqueness is the source of truth. Since the first version requires user-selected short codes, conflicts are user-actionable and should be visible in the UI.

Alternative considered: sequential codes from database IDs. That is predictable and easier to enumerate, so random URL-safe codes are a better baseline.

Alternative considered: silently append characters to a requested short code. That would surprise users because the resulting short URL would not match what they asked for.

Alternative considered: generate short codes automatically when the user leaves the field blank. That can be added later, but requiring the short code keeps the first version smaller and makes collision handling explicit.

### App-local TypeScript and ESLint configuration

Use separate `backend/tsconfig.json` and `frontend/tsconfig.json` files. The frontend also gets `frontend/tsconfig.node.json` for Vite/tooling. Use separate `backend/eslint.config.js` and `frontend/eslint.config.js`.

Rationale: backend TypeScript targets Bun/Node-style server code, while frontend TypeScript targets browser and React JSX. Separate lint configs let each app use appropriate globals and plugins.

Alternative considered: root TypeScript and ESLint config only. That is terser, but it conflicts with independent app operation.

## Risks / Trade-offs

- Duplicate config across apps -> Keep app configs small and only extract shared config later if duplication becomes painful.
- Separate lockfiles can drift -> Treat each app as independently deployable and update each app lockfile when its dependencies change.
- Frontend standalone compose cannot provide full product behavior without an API -> Make `VITE_API_BASE_URL` explicit and document that root compose is the full-stack local path.
- Short code conflict -> Return `409 Conflict` and show a clear frontend error asking the user to choose another code.
- Open redirect or invalid URL abuse -> Validate submitted URLs and only accept supported URL protocols such as `http` and `https`.
- CORS issues across separate deployments -> Configure backend CORS from environment variables.

## Migration Plan

1. Add the standalone backend package, Prisma schema, Express app, backend tests, and backend container setup.
2. Add the standalone frontend package, Vite React app, frontend tests, and frontend container setup.
3. Add root scripts and root compose orchestration for the integrated local stack.
4. Run backend and frontend tests independently.
5. Run the full stack through root compose and verify URL creation plus redirect behavior.

Rollback is straightforward during initial development: remove the generated frontend, backend, and root orchestration files before release. No production data migration is involved until the first deployment.

## Open Questions

- None.

## 1. Project Structure and Tooling

- [x] 1.1 Create standalone `backend/` and `frontend/` application directories.
- [x] 1.2 Add root `package.json`, `bun.lock`, `.prettierrc`, and `.prettierignore` for full-stack coordination and shared formatting.
- [x] 1.3 Add `backend/package.json`, `backend/bun.lock`, `backend/tsconfig.json`, and `backend/eslint.config.js`.
- [x] 1.4 Add `frontend/package.json`, `frontend/bun.lock`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`, `frontend/vite.config.ts`, and `frontend/eslint.config.js`.
- [x] 1.5 Add root scripts that delegate install, dev, build, lint, and test commands into `backend/` and `frontend/`.

## 2. Backend Persistence

- [x] 2.1 Add Prisma under `backend/prisma/` with a PostgreSQL datasource and generated Prisma client.
- [x] 2.2 Define a URL mapping model with ID, unique short code, original URL, creation timestamp, and update timestamp.
- [x] 2.3 Add backend scripts for Prisma generate, migrate, and local database workflows.
- [x] 2.4 Add database access helpers for creating mappings and looking up mappings by short code.

## 3. Backend API

- [x] 3.1 Add an Express application entrypoint with JSON parsing, environment configuration, CORS configuration, and error handling.
- [x] 3.2 Implement `POST /api/urls` to require an original URL and user-provided short code.
- [x] 3.3 Validate original URLs so only valid `http` and `https` URLs are accepted.
- [x] 3.4 Validate short codes using the supported normalized lowercase format and length bounds.
- [x] 3.5 Persist valid URL mappings and return the original URL, normalized short code, and absolute short URL.
- [x] 3.6 Return validation errors without persisting when the original URL or short code is missing or invalid.
- [x] 3.7 Return `409 Conflict` with `SHORT_CODE_TAKEN` when the requested short code already exists.
- [x] 3.8 Implement `GET /:code` to redirect known short codes to their stored original URLs.
- [x] 3.9 Redirect unknown short codes to the frontend-owned 404 route.
- [x] 3.10 Ensure `/api/*` routes are not treated as short-code redirect lookups.
- [x] 3.11 Implement `GET /health` for orchestration and deployment checks.

## 4. Backend Tests

- [x] 4.1 Add backend Vitest configuration and test setup local to `backend/`.
- [x] 4.2 Test successful URL creation with a required short code.
- [x] 4.3 Test short-code normalization for uppercase input.
- [x] 4.4 Test validation errors for missing, malformed, or unsupported original URLs.
- [x] 4.5 Test validation errors for missing, malformed, or out-of-bounds short codes.
- [x] 4.6 Test duplicate short-code conflict returns `409 Conflict` and preserves the existing mapping.
- [x] 4.7 Test known short-code redirects preserve full stored destinations, including path, query string, and fragment.
- [x] 4.8 Test missing short-code redirects to the frontend 404 route.
- [x] 4.9 Test `/api/*` requests bypass redirect lookup.
- [x] 4.10 Test `GET /health` returns a successful health response.

## 5. Frontend Application

- [x] 5.1 Create the Vite React application shell under `frontend/src/`.
- [x] 5.2 Add a Material UI URL creation form with original URL and required short-code fields.
- [x] 5.3 Prevent submission and show an inline validation error when the short-code field is empty.
- [x] 5.4 Submit original URL and short code to the backend API using `VITE_API_BASE_URL`.
- [x] 5.5 Display the returned short URL after successful creation.
- [x] 5.6 Display backend validation errors inline without clearing entered values.
- [x] 5.7 Display `SHORT_CODE_TAKEN` conflicts as an inline prompt to choose a different short code.
- [x] 5.8 Add a frontend 404 not found route for missing short-code redirects.

## 6. Frontend Tests

- [x] 6.1 Add frontend Vitest configuration and test setup local to `frontend/`.
- [x] 6.2 Test successful form submission displays the returned short URL.
- [x] 6.3 Test missing short-code client validation blocks submission.
- [x] 6.4 Test backend validation errors render inline and preserve entered values.
- [x] 6.5 Test `SHORT_CODE_TAKEN` renders a conflict message asking for a different short code.
- [x] 6.6 Test the frontend 404 route renders a user-friendly not found page.
- [x] 6.7 Test API requests use the configured `VITE_API_BASE_URL`.

## 7. Docker and Local Orchestration

- [x] 7.1 Add `backend/Dockerfile` for building and running the backend standalone.
- [x] 7.2 Add `frontend/Dockerfile` for building and running the frontend standalone.
- [x] 7.3 Add `backend/docker-compose.yml` for backend plus PostgreSQL standalone development.
- [x] 7.4 Add `frontend/docker-compose.yml` for frontend standalone development with configurable API URL.
- [x] 7.5 Add root `docker-compose.yml` for frontend, backend, and PostgreSQL together.
- [x] 7.6 Configure the backend public base URL and frontend API base URL for local and compose environments.

## 8. Verification

- [x] 8.1 Run backend install, lint, build, and tests from `backend/`.
- [x] 8.2 Run frontend install, lint, build, and tests from `frontend/`.
- [x] 8.3 Run root-level delegated lint, build, and test scripts.
- [x] 8.4 Run the full stack with root compose and verify URL creation, duplicate short-code error handling, known short-code redirect, and missing short-code redirect to the frontend 404 page.
- [x] 8.5 Run `openspec validate build-url-shortener` and resolve any validation issues.

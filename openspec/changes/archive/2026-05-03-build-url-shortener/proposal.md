## Why

Create a focused URL shortening service that lets users turn long URLs into stable short links and lets visitors resolve those short links through HTTP redirects. This establishes the full product baseline: API, persistence, redirect behavior, and a simple web UI.

## What Changes

- Add an Express API for creating shortened URLs from submitted original URLs and required user-provided short codes.
- Add redirect handling so requests to a short code resolve to the stored original URL.
- Persist URL mappings in PostgreSQL through Prisma ORM.
- Add a React and Material UI front-end for creating shortened URLs, entering required short codes, showing conflict errors, and viewing the created short URL.
- Defer automatic short-code generation to a future feature.
- Structure the frontend and backend as standalone Bun applications, each with its own package manifest, Bun lockfile, Dockerfile, compose file, tests, and build scripts.
- Add root-level orchestration for running the full stack together during local development.
- Configure the TypeScript, Bun, Vite, Docker, Vitest, ESLint, and Prettier project foundation needed to build, test, and run the service.

## Capabilities

### New Capabilities
- `short-url-management`: Covers creating, validating, storing, detecting conflicts for, and returning shortened URL mappings with user-provided short codes.
- `short-url-redirection`: Covers resolving short codes and redirecting visitors to original URLs.
- `short-url-web-ui`: Covers the user-facing web application for creating links, entering required short codes, handling conflicts, and displaying shortened URLs.

### Modified Capabilities

## Impact

- `backend/**`: Add standalone Bun package with `package.json` and `bun.lock`, Express application routes, Prisma schema/migrations, backend-local tests, backend Dockerfile, and backend-local compose support.
- `frontend/**`: Add standalone Bun package with `package.json` and `bun.lock`, Vite React application using Material UI, frontend-local tests, frontend Dockerfile, and frontend-local compose support.
- `package.json`, `bun.lock`: Add root-level scripts and dependencies needed to run or coordinate both applications together.
- `docker-compose.yml`: Add root-level orchestration for frontend, backend, and PostgreSQL.
- `backend/eslint.config.js`, `frontend/eslint.config.js`, `backend/tsconfig*.json`, `frontend/tsconfig*.json`, `frontend/vite.config.ts`: Add app-local TypeScript, linting, and build configuration.
- `.prettierrc*`: Add shared formatting configuration.

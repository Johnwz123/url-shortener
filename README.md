# URL Shortener

A TypeScript URL shortening service with separate frontend and backend apps.

- Frontend: React, Vite, Material UI
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL
- Package manager: Bun
- Containerization: Docker

## Requirements

- Bun `>= 1.2`
- Node.js `>= 20`
- Docker Desktop, if running with Compose

## Run The Full Stack

From the repository root:

```sh
docker compose up --build
```

Then open:

- Frontend: <http://localhost:5173>
- Backend health check: <http://localhost:3000/health>

Stop the stack:

```sh
docker compose down
```

## Install Dependencies

```sh
bun install
bun run install:all
```

## Local Development

For full local development outside Docker, start PostgreSQL first. One easy way
is to use the backend compose file for only the database:

```powershell
cd backend
docker compose up -d postgres
```

Set backend environment variables in the shell that runs the backend:

macOS/Linux:

```bash
export DATABASE_URL="postgresql://url_shortener:url_shortener@localhost:5433/url_shortener?schema=public"
export PUBLIC_BASE_URL="http://localhost:3000"
export FRONTEND_BASE_URL="http://localhost:5173"
export FRONTEND_NOT_FOUND_PATH="/404"
export CORS_ORIGIN="http://localhost:5173"
export SHORT_CODE_GENERATION_MIN_LENGTH="6"
export SHORT_CODE_GENERATION_MAX_LENGTH="10"
export SHORT_CODE_GENERATION_MAX_ATTEMPTS="10"
bun run prisma:generate
bun run prisma:migrate
cd ..
```

PowerShell:

```powershell
$env:DATABASE_URL="postgresql://url_shortener:url_shortener@localhost:5433/url_shortener?schema=public"
$env:PUBLIC_BASE_URL="http://localhost:3000"
$env:FRONTEND_BASE_URL="http://localhost:5173"
$env:FRONTEND_NOT_FOUND_PATH="/404"
$env:CORS_ORIGIN="http://localhost:5173"
$env:SHORT_CODE_GENERATION_MIN_LENGTH="6"
$env:SHORT_CODE_GENERATION_MAX_LENGTH="10"
$env:SHORT_CODE_GENERATION_MAX_ATTEMPTS="10"
bun run prisma:generate
bun run prisma:migrate
cd ..
```

Set the frontend API URL, then start both apps from the root:

macOS/Linux:

```bash
export VITE_API_BASE_URL="http://localhost:3000"
bun run dev
```

PowerShell:

```powershell
$env:VITE_API_BASE_URL="http://localhost:3000"
bun run dev
```

## Project Commands

Run from the repository root:

```powershell
bun run lint
bun run build
bun run test
```

Target a single app:

```powershell
bun run lint:backend
bun run test:backend
bun run build:frontend
```

## API Example

Create a short URL:

macOS/Linux:

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://open.gov.sg/","shortCode":"open"}'
```

PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/urls" `
  -ContentType "application/json" `
  -Body '{"originalUrl":"https://open.gov.sg/","shortCode":"open"}'
```

Visit `http://localhost:3000/open` to be redirected to the original URL.

Generate a short code:

macOS/Linux:

```bash
curl -X POST http://localhost:3000/api/short-codes/generate
```

PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/short-codes/generate"
```

Short codes are required. If the requested code is already taken, the backend
returns `409 Conflict` with `SHORT_CODE_TAKEN`.
Original URLs can include `http://` or `https://`; if the protocol is omitted,
the backend stores the URL as `https://`.

## Database Connection

The Docker Compose database is published on `localhost:5433` to avoid conflicts
with local Postgres installations.

```text
Host: localhost
Port: 5433
Database: url_shortener
Username: url_shortener
Password: url_shortener
```

Connection string for desktop tools:

```text
postgresql://url_shortener:url_shortener@localhost:5433/url_shortener?schema=public
```

Containers in the Compose network should use `postgres:5432` instead.

## App READMEs

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

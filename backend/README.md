# Backend

Express API for creating and resolving short URLs.

## Stack

- Node.js runtime
- Bun package manager
- Express
- Prisma
- PostgreSQL
- Vitest

## Requirements

- Bun `>= 1.2`
- Node.js `>= 20`
- Docker Desktop, if using local PostgreSQL through Compose

## Environment

The backend reads configuration from environment variables.

Use `.env.example` as a reference:

macOS/Linux:

```bash
cp .env.example .env
```

PowerShell:

```powershell
copy .env.example .env
```

When running directly with `bun run dev`, set the variables in the shell as well:

macOS/Linux:

```bash
export DATABASE_URL="postgresql://url_shortener:url_shortener@localhost:5433/url_shortener?schema=public"
export PUBLIC_BASE_URL="http://localhost:3000"
export FRONTEND_BASE_URL="http://localhost:5173"
export FRONTEND_NOT_FOUND_PATH="/404"
export CORS_ORIGIN="http://localhost:5173"
```

PowerShell:

```powershell
$env:DATABASE_URL="postgresql://url_shortener:url_shortener@localhost:5433/url_shortener?schema=public"
$env:PUBLIC_BASE_URL="http://localhost:3000"
$env:FRONTEND_BASE_URL="http://localhost:5173"
$env:FRONTEND_NOT_FOUND_PATH="/404"
$env:CORS_ORIGIN="http://localhost:5173"
```

## Database Connection

When PostgreSQL is started with this folder's Compose file, connect from desktop tools with:

```text
Host: localhost
Port: 5433
Database: url_shortener
Username: url_shortener
Password: url_shortener
```

Connection string:

```text
postgresql://url_shortener:url_shortener@localhost:5433/url_shortener?schema=public
```

The backend container uses `postgres:5432` internally.

## Run With Docker

From `backend/`:

```sh
docker compose up --build
```

This starts PostgreSQL and the backend on `http://localhost:3000`.

Stop it:

```sh
docker compose down
```

## Run Locally

From `backend/`, start PostgreSQL:

```sh
docker compose up -d postgres
```

Install dependencies, generate Prisma client, run migrations, and start dev:

```sh
bun install
bun run prisma:generate
bun run prisma:migrate
bun run dev
```

Health check:

macOS/Linux:

```bash
curl http://localhost:3000/health
```

PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

## API

Create a short URL:

macOS/Linux:

```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://google.com/","shortCode":"google"}'
```

PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/urls" `
  -ContentType "application/json" `
  -Body '{"originalUrl":"https://google.com/","shortCode":"google"}'
```

Redirect:

macOS/Linux:

```bash
curl -I http://localhost:3000/google
```

PowerShell:

```powershell
curl.exe -I http://localhost:3000/google
```

Routes:

- `POST /api/urls`: create a short URL with required `originalUrl` and `shortCode`
- `GET /:code`: redirect to the stored original URL
- `GET /health`: health check

Original URLs can include `http://` or `https://`. If the protocol is omitted, the backend stores the URL as `https://`.
Duplicate short codes return `409 Conflict` with `SHORT_CODE_TAKEN`.
Unknown short codes redirect to the frontend 404 route.

## Commands

```sh
bun run dev
bun run build
bun run start
bun run lint
bun run test
bun run prisma:generate
bun run prisma:migrate
bun run prisma:deploy
```

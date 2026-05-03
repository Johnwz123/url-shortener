# Frontend

React web app for creating short URLs and showing a frontend-owned 404 page.

## Stack

- React
- Vite
- Material UI
- Bun package manager
- Vitest

## Requirements

- Bun `>= 1.2`
- Node.js `>= 20`
- Docker Desktop, if running the frontend container

## Environment

The frontend reads configuration from environment variables.

Use `.env.example` as a reference:

macOS/Linux:

```bash
cp .env.example .env
```

PowerShell:

```powershell
copy .env.example .env
```

Shell alternatives:

macOS/Linux:

```bash
export VITE_API_BASE_URL="http://localhost:3000"
```

PowerShell:

```powershell
$env:VITE_API_BASE_URL="http://localhost:3000"
```

If `VITE_API_BASE_URL` is omitted, API calls are made relative to the frontend
origin.

## Run With Docker

From `frontend/`:

```sh
docker compose up --build
```

This serves the frontend at `http://localhost:5173` and points it at
`http://localhost:3000` by default.

To point at a different backend:

macOS/Linux:

```bash
VITE_API_BASE_URL="https://example.com" docker compose up --build
```

PowerShell:

```powershell
$env:VITE_API_BASE_URL="https://example.com"
docker compose up --build
```

Stop it:

```sh
docker compose down
```

## Run Locally

From `frontend/`:

macOS/Linux:

```bash
bun install
export VITE_API_BASE_URL="http://localhost:3000"
bun run dev
```

PowerShell:

```powershell
bun install
$env:VITE_API_BASE_URL="http://localhost:3000"
bun run dev
```

Open <http://localhost:5173>.

## Commands

```sh
bun run dev
bun run build
bun run preview
bun run lint
bun run test
```

## User Flow

The form requires:

- Original URL
- Short code

The app displays:

- The created short URL after success
- Inline validation errors from the backend
- A `SHORT_CODE_TAKEN` message when the requested short code is already used
- A user-friendly 404 page at `/404`

# Short URL Redirection

## Purpose

TBD

## Requirements

### Requirement: Redirect known short code

The system SHALL redirect visitors from a known short code to its stored original URL.

#### Scenario: Known short code redirects

- **WHEN** a visitor requests `GET /:code` for an existing short code
- **THEN** the system responds with an HTTP redirect to the stored original URL

#### Scenario: Redirect preserves stored destination

- **WHEN** a visitor requests a short code whose original URL contains a path, query string, or fragment
- **THEN** the system redirects to the full stored original URL

### Requirement: Redirect missing short code to frontend not found page

The system SHALL redirect visitors to a frontend-owned 404 not found page when a short code does not exist.

#### Scenario: Missing short code redirects to frontend 404

- **WHEN** a visitor requests `GET /:code` for a short code that does not exist
- **THEN** the system responds with an HTTP redirect to the frontend 404 not found route

### Requirement: Keep API and redirect routes distinct

The system SHALL reserve `/api/*` for backend API routes and use root-level non-API paths for short-code redirects.

#### Scenario: API route is not treated as short code

- **WHEN** a request targets a path under `/api/*`
- **THEN** the system handles the request as an API route and does not perform short-code redirect lookup

### Requirement: Expose backend health check

The backend SHALL expose a health check endpoint for local orchestration and deployment checks.

#### Scenario: Health check succeeds

- **WHEN** a client requests `GET /health`
- **THEN** the backend returns a successful health response without requiring database mutation

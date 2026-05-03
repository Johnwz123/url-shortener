## ADDED Requirements

### Requirement: Provide URL creation form
The frontend SHALL provide a form for creating shortened URLs from original URLs and required short codes.

#### Scenario: User submits original URL and short code
- **WHEN** a user enters a valid original URL and valid short code
- **THEN** the frontend sends both values in the create request and displays the returned short URL when creation succeeds

#### Scenario: User omits short code
- **WHEN** a user submits the creation form without a short code
- **THEN** the frontend displays an inline validation error and does not submit the create request

### Requirement: Show validation errors
The frontend SHALL show user-readable validation errors when the backend rejects URL creation input.

#### Scenario: Backend returns validation error
- **WHEN** the backend returns a validation error for the submitted original URL or short code
- **THEN** the frontend displays an inline error without clearing the user's entered values

### Requirement: Show short code conflict error
The frontend SHALL show a clear conflict error when the requested short code is already used.

#### Scenario: Requested short code is taken
- **WHEN** the backend returns `409 Conflict` with `SHORT_CODE_TAKEN`
- **THEN** the frontend displays an inline message asking the user to choose a different short code

### Requirement: Provide frontend not found page
The frontend SHALL provide a 404 not found page for missing short-code redirects.

#### Scenario: Visitor lands on not found route
- **WHEN** a visitor is redirected to the frontend 404 route
- **THEN** the frontend displays a user-friendly not found page

### Requirement: Use configurable backend API base URL
The frontend SHALL use environment configuration for the backend API base URL.

#### Scenario: API base URL is configured
- **WHEN** the frontend is built or run with `VITE_API_BASE_URL`
- **THEN** the frontend sends URL creation requests to that configured API base URL

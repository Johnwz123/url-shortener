## MODIFIED Requirements

### Requirement: Provide URL creation form

The frontend SHALL provide a form for creating shortened URLs from original URLs and required short codes, including a generate action that calls the backend to obtain a short code.

#### Scenario: User submits original URL and short code

- **WHEN** a user enters a valid original URL and valid short code
- **THEN** the frontend sends both values in the create request and displays the returned short URL when creation succeeds

#### Scenario: User omits short code

- **WHEN** a user submits the creation form without a short code
- **THEN** the frontend displays an inline validation error and does not submit the create request

#### Scenario: User generates a short code

- **WHEN** a user clicks the generate short code button
- **THEN** the frontend requests a generated short code from the backend and fills the short code input with the returned value

## ADDED Requirements

### Requirement: Show generation failure error

The frontend SHALL show a clear inline error when short code generation fails.

#### Scenario: Backend returns generation failure

- **WHEN** the backend responds with `SHORT_CODE_GENERATION_FAILED`
- **THEN** the frontend displays a retry message without clearing the user's entered values

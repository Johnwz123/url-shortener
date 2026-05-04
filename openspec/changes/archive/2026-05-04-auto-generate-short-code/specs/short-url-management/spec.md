## MODIFIED Requirements

### Requirement: Create short URL with required short code

The system SHALL require a short code when creating a shortened URL, allowing either a user-provided short code or a system-generated short code returned from the generation endpoint.

#### Scenario: Successful short code creation

- **WHEN** a user submits a valid original URL with an available valid short code
- **THEN** the system persists the URL mapping using the requested short code and returns the original URL, short code, and absolute short URL

#### Scenario: Custom code is normalized consistently

- **WHEN** a user submits a short code with uppercase letters
- **THEN** the system stores and returns the short code using the normalized lowercase representation

### Requirement: Validate required short code

The system SHALL reject create requests when the provided short code is missing or does not match the supported format.

#### Scenario: Missing short code

- **WHEN** a user submits a create request without a short code
- **THEN** the system returns a validation error and does not persist a URL mapping

#### Scenario: Invalid short code format

- **WHEN** a user submits a short code containing unsupported characters
- **THEN** the system returns a validation error and does not persist a URL mapping

#### Scenario: Invalid short code length

- **WHEN** a user submits a short code outside the configured length bounds
- **THEN** the system returns a validation error and does not persist a URL mapping

## ADDED Requirements

### Requirement: Generate unique short code

The system SHALL provide an endpoint that returns a valid, unique short code generated within configured length bounds.

#### Scenario: Generate short code

- **WHEN** a client requests short code generation
- **THEN** the system returns a generated short code that matches the supported format and generation length bounds configured via environment settings

#### Scenario: Generated short code is unique

- **WHEN** a generated short code is returned
- **THEN** the system guarantees the short code is not already stored in the database

#### Scenario: Generation bounds are distinct from validation bounds

- **WHEN** the system generates a short code
- **THEN** it uses the configured generation min/max bounds even if they differ from validation min/max bounds for user-provided short codes

#### Scenario: Generation fails to find unique short code

- **WHEN** the system cannot find a unique short code within the maximum attempt limit
- **THEN** the system returns an error with code `SHORT_CODE_GENERATION_FAILED`

## ADDED Requirements

### Requirement: Create short URL with required short code
The system SHALL require a user-provided short code when creating a shortened URL.

#### Scenario: Successful short code creation
- **WHEN** a user submits a valid original URL with an available valid short code
- **THEN** the system persists the URL mapping using the requested short code and returns the original URL, short code, and absolute short URL

#### Scenario: Custom code is normalized consistently
- **WHEN** a user submits a short code with uppercase letters
- **THEN** the system stores and returns the short code using the normalized lowercase representation

### Requirement: Validate original URL
The system SHALL reject submitted original URLs that are missing, malformed, or use an unsupported protocol.

#### Scenario: Unsupported URL protocol
- **WHEN** a user submits an original URL that does not use `http` or `https`
- **THEN** the system returns a validation error and does not persist a URL mapping

#### Scenario: Missing original URL
- **WHEN** a user submits a create request without an original URL
- **THEN** the system returns a validation error and does not persist a URL mapping

### Requirement: Validate required short code
The system SHALL reject create requests when the user-provided short code is missing or does not match the supported format.

#### Scenario: Missing short code
- **WHEN** a user submits a create request without a short code
- **THEN** the system returns a validation error and does not persist a URL mapping

#### Scenario: Invalid short code format
- **WHEN** a user submits a short code containing unsupported characters
- **THEN** the system returns a validation error and does not persist a URL mapping

#### Scenario: Invalid short code length
- **WHEN** a user submits a short code outside the configured length bounds
- **THEN** the system returns a validation error and does not persist a URL mapping

### Requirement: Reject duplicate short code
The system SHALL return a conflict response when a requested short code is already used.

#### Scenario: Short code already exists
- **WHEN** a user submits a valid original URL with a valid short code that already exists
- **THEN** the system returns `409 Conflict` with a machine-readable `SHORT_CODE_TAKEN` error and does not overwrite the existing mapping

### Requirement: Persist URL mappings
The system SHALL store URL mappings in PostgreSQL through Prisma with a unique short code constraint.

#### Scenario: Stored mapping contains required fields
- **WHEN** a URL mapping is successfully created
- **THEN** the stored mapping contains an ID, unique short code, original URL, creation timestamp, and update timestamp if supported

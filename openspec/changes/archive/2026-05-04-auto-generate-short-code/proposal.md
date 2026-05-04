## Why

Users should be able to create a short URL without inventing a custom short code. Adding a generate option reduces friction and speeds up link creation.

## What Changes

- Add a UI action to generate a valid short code and populate the short code field before submission.
- Allow URL creation to succeed with a system-generated short code when the user chooses to generate one.
- Keep existing behavior for user-provided short codes, including validation and conflict handling.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `short-url-management`: Permit system-generated short codes for create requests when the user opts to generate one.
- `short-url-web-ui`: Provide a generate button that fills the short code field and allows submit with the generated value.

## Impact

- Frontend form behavior and validation states.
- Backend create URL API validation and short code generation flow.
- Tests for UI and API create behavior.

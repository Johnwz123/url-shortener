## Context

The current flow requires users to provide a short code in the UI and the backend validates it as required. This change adds a generate option that calls a backend API to produce a valid, unique short code, then allows the user to submit with that generated value. The change touches both frontend and backend and adds a new backend endpoint for generation.

## Goals / Non-Goals

**Goals:**

- Provide a backend API that returns a valid, unique short code for the user to accept.
- Ensure generated short codes never conflict with existing mappings.
- Add a UI generate action that populates the short code input and preserves existing validation behavior.

**Non-Goals:**

- Changing the existing short code format or validation rules.
- Auto-creating a short URL without explicit user submission.
- Implementing rate limiting, CAPTCHA, or advanced abuse prevention.

## Decisions

- Expose a dedicated backend endpoint (e.g., `POST /api/short-codes/generate`) that returns a generated short code.
  - Alternative: Generate in the frontend. Rejected because uniqueness and format validation depend on backend rules and database state.
- Generate short codes on the backend using the existing validation rules and verify uniqueness against the database before returning.
  - Alternative: Use optimistic generation and rely on create to resolve collisions. Rejected because the UI needs a guaranteed unique value before submission.
- Implement generation as a retry loop with a max attempts guard, using the same character set and length constraints as existing validation.
  - Alternative: Persist a "reserved" code. Rejected to avoid extra persistence and cleanup logic; uniqueness is guaranteed by checking before returning.
- Return a dedicated error code (e.g., `SHORT_CODE_GENERATION_FAILED`) when generation cannot find a unique code within the attempt limit.
  - Alternative: Reuse generic validation errors. Rejected to allow the UI to show a specific retry message.
- Use a randomized generation length within min/max bounds configured in the environment (e.g., `SHORT_CODE_MIN_LENGTH`, `SHORT_CODE_MAX_LENGTH`).
  - Alternative: Fixed length at max. Rejected to allow variability while staying within the same validation bounds.
- Keep create flow unchanged except to accept generated codes as normal user-provided short codes.
  - Alternative: Allow create without short code when a generate flag is set. Rejected to keep API contracts simple and consistent.

## Risks / Trade-offs

- Low-probability collision bursts when the code space is near exhaustion → Mitigation: enforce max attempts and return a clear error if generation fails.
- Additional backend load for generation requests → Mitigation: keep generation lightweight and reuse existing validation logic.
- UI confusion if generation fails or takes time → Mitigation: show inline error and keep user input intact.

## Migration Plan

- Deploy backend endpoint alongside existing create endpoint.
- Update frontend to call generate endpoint and populate the short code field.
- No data migrations required; rollback by disabling the UI generate action and removing the endpoint.

## Open Questions

- None.

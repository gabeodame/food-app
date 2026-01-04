# 0002 - AuthN/AuthZ Strategy: Public Read, Write Protected

## Context

The platform serves public recipe discovery while protecting write operations (create, update, delete). Authentication is already shared across services using common middleware (`currentUser`, `requireAuth`) and JWT-based sessions. The UI and API should keep read paths simple while securing mutations.

## Decision

Use a "public read, authenticated write" policy:

- Read endpoints are accessible without authentication when content is public.
- Write endpoints require authentication via shared middleware (`currentUser`, `requireAuth`).
- Auth context is propagated per request to avoid global session state.

## Alternatives Considered

- Full RBAC with roles/permissions per resource
- API Gateway-only authorization enforcement
- Private-by-default endpoints with explicit allowlists

## Consequences

Pros:

- Simple user experience for public browsing
- Clear security boundary: all mutations require auth
- Reusable auth logic across services via shared middleware

Cons:

- Public read paths must guard against data leakage
- Service-level checks still required to prevent ID enumeration
- Limited granularity without roles or scopes

## How to Revisit / Change Later

Introduce roles or scopes if admin/moderation needs grow. Consider centralized policy (OPA/Authorizer) if authorization becomes inconsistent across services.

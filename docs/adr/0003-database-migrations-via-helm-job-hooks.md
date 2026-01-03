# 0003 - Database Migrations via Helm Job Hooks

## Context

Database migrations must be applied predictably during deploys without blocking application startup or risking inconsistent schema state. The Helm chart already supports Job hooks, and Prisma migrations are used for the recipe service.

## Decision

Run database migrations via Helm Job hooks:

- Use a dedicated Job (not the app container) to run `prisma migrate deploy`.
- Configure hooks for `post-install,post-upgrade` with explicit hook delete policies.
- Keep Jobs idempotent and retry-safe.

## Alternatives Considered

- Run migrations in the app container on startup
- CI/CD pipeline step before Helm deploy
- Manual migration runbook per environment

## Consequences

Pros:

- Migrations are decoupled from app runtime
- Clear hook ordering and auditability in Helm
- Safer rollbacks by not tying app availability to migration logic

Cons:

- Requires Job observability and failure handling
- Hook ordering must be maintained across services
- Rollback of schema changes is still a manual decision

## How to Revisit / Change Later

If migrations become more complex, move to a dedicated migration pipeline step or a versioned migration service. Track migration failures and add alerts for Job failures.

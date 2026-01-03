# 0001 - Microservices Scope and Service Boundaries

## Context

This platform targets a production-style architecture with independent deployability, clear ownership, and event-driven communication. The domain includes authentication, recipes, ingredients, profiles, and uploads, each with different data stores and scaling profiles.

## Decision

Adopt a microservices architecture with the following service boundaries:

- Auth service for identity and session management
- Recipe service for recipe CRUD and search
- Ingredient service for ingredient inventory and associations
- Profile service for user profile data
- Uploads service for file/media handling
- Client (Next.js) as a separate web UI
- RabbitMQ as the event bus for cross-service messaging

## Alternatives Considered

- Monolith with modules and shared database
- Modular monolith with shared runtime and separate schemas
- Service mesh-style decomposition with more granular services

## Consequences

Pros:

- Independent deployability and scaling
- Clear data ownership and schema isolation
- Easier to evolve services with different tech stacks

Cons:

- More operational complexity (deployments, observability, networking)
- Distributed failure modes and eventual consistency
- Higher local development overhead

## How to Revisit / Change Later

Re-evaluate boundaries as traffic patterns and team ownership evolve. If latency or operational overhead dominates, consider merging low-traffic services or introducing a modular monolith for specific domains.

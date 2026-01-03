# 0004 - Container Build Strategy: Prisma Generate + Slim Runtime

## Context

Services that use Prisma require a compatible runtime (OpenSSL/GLIBC) and a generated client. We want small runtime images, reproducible builds, and non-root execution without sacrificing Prisma compatibility.

## Decision

Use multi-stage builds with a slim Debian runtime:

- Builder stage runs `npm ci`, `prisma generate`, and `npm run build`.
- Runtime stage is `node:bookworm-slim` with only production deps.
- Avoid Alpine to prevent Prisma engine compatibility issues.
- Run containers as non-root.

## Alternatives Considered

- Single-stage image with all build tools
- Alpine-based runtime for smaller images
- Pre-built Prisma client committed to repo

## Consequences

Pros:

- Smaller, safer runtime images
- Deterministic builds and clear separation of build/runtime
- Better Prisma engine reliability on Debian slim

Cons:

- Slightly longer build time due to multi-stage copy
- Requires careful copying of Prisma runtime artifacts

## How to Revisit / Change Later

If image size becomes critical, explore distroless with validated Prisma support. If build time becomes an issue, introduce build caching or prebuilt base images with Prisma engines.

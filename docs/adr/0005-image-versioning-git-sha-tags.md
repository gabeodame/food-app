# 0005 - Image Versioning with Git SHA Tags

## Context

Consistent image tagging is required to correlate deployments with source code and avoid ambiguity from `latest`. The build pipeline and Skaffold config already support Git SHA tags.

## Decision

Use Git SHA tags for all container images:

- CI and Skaffold set the image tag to the short commit SHA.
- Helm values accept a `global.imageTag` for consistent deployment.
- Avoid `latest` except for local-only testing.

## Alternatives Considered

- Semver-only tags
- Timestamp-based tags
- `latest` with manual pinning

## Consequences

Pros:

- Precise traceability between code and runtime
- Safer rollbacks to known commits
- Easy to audit deployments

Cons:

- Requires a release process for human-friendly tags
- Multiple images per commit can increase registry usage

## How to Revisit / Change Later

Introduce dual-tagging (semver + SHA) when release automation exists. Consider artifact retention policies to manage registry growth.

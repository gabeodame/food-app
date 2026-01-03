# 0006 - CI/CD Pipeline with Jenkins and Helm

## Context

The repository includes Kubernetes deployment and image build scripts. We need a CI/CD pipeline that can orchestrate linting, tests, image build/scan/push, and Helm deploys with environment-specific values.

## Decision

Use Jenkins with a declarative pipeline defined in `Jenkinsfile`:

- Stage order: lint → test → build → scan → push → deploy → smoke tests.
- Environment mapping: `dev` by default, `main` → `staging`, `release/*` → `prod`.
- Image tagging uses the short Git SHA for traceability.
- Helm deploys use environment-specific values files.

## Alternatives Considered

- GitHub Actions or GitLab CI
- Managed CI (CircleCI, Buildkite)
- Custom scripts invoked manually

## Consequences

Pros:

- Single pipeline for build and deploy with clear stages
- Environment behavior encoded in the pipeline
- Reusable scripts for local and CI usage

Cons:

- Jenkins maintenance overhead (plugins, upgrades)
- Requires credential management and secrets in Jenkins
- Local Jenkins setup is more complex than hosted CI

## How to Revisit / Change Later

If maintenance cost or hosting constraints grow, migrate to a hosted CI runner while keeping the same scripts and Helm workflow. Dual-run Jenkins and GitHub Actions during transition if needed.

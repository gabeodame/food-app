# Food Sharing Platform

A production-style, microservices recipe platform designed to showcase auth, event-driven services, and Kubernetes-first deployment workflows.

## What It Demonstrates

- Microservices with clear service boundaries and shared libraries
- AuthN/AuthZ with public reads and protected writes
- Helm-based Kubernetes deployment (Jobs, ingress/gateway, NetworkPolicy)
- Git SHA image tagging (Skaffold + CI scripts)
- Migration strategy via Helm Job hooks
- API documentation via Swagger/Swagger UI
- Jenkins pipeline wired for lint, test, build, scan, push, deploy, smoke
- CI/CD-ready layout (scripts + Jenkins chart)

## Architecture (High Level)

```
                 +------------------+
                 |   Web Client     |
                 |  Next.js (UI)    |
                 +--------+---------+
                          |
                          v
                +--------------------+
                | Ingress / Gateway  |
                +--+----+----+----+--+
                   |    |    |    |
                   v    v    v    v
               +------+ +------+ +---------+ +---------+
               | Auth | |Recipe| |Ingredient| |Profile |
               +--+---+ +--+---+ +----+----+ +----+----+
                  |        |          |           |
               MongoDB  Postgres   Postgres    Postgres

   +-------------------+           +--------------------+
   | Uploads Service   |<--S3----->|    Object Store    |
   +-------------------+           +--------------------+

         +-----------------------------+
         |     RabbitMQ (Events)       |
         +-----------------------------+

         +-----------------------------+
         | Helm Job: Prisma Migrations |
         +-----------------------------+
```

## Links

- Live demo: Not published yet
- Docs: `docs/`
- ADRs: `docs/adr/`
- Hardening checklist: `docs/hardening.md`
- Jenkins pipeline: `Jenkinsfile`

## Features

- Public read endpoints; authenticated write endpoints (see `currentUser` + `requireAuth` middleware)
- Migration strategy via Helm Job hooks (`infra/helm/food-app/templates/migrations.yaml`)
- Git SHA image tagging via Skaffold and CI scripts (`skaffold.yaml`, `scripts/ci/*.sh`)
- Readiness/liveness probes supported in Helm values (optional per service)
- API docs: Swagger UI for recipe and uploads services, OpenAPI for NestJS services

## Local Dev Quickstart

### Prereqs

- Docker Desktop with Kubernetes enabled
- kubectl, Helm, Skaffold
- Node.js 18+ (for running services outside Kubernetes)

### Environment Variables

Use `.env.example` as a reference for per-service `.env` files when running without Kubernetes. For Kubernetes, secrets are managed via manifests in `infra/k8s/dev/secrets`.

### Run Services Locally (Kubernetes + Skaffold)

```bash
kubectl apply -f infra/k8s/dev/secrets
skaffold dev --profile dev
```

### Run Tests

```bash
scripts/ci/run-tests.sh
```

### Lint / Format

```bash
scripts/ci/run-lint.sh
```

## Kubernetes / Helm Deploy

### Create Namespace

```bash
kubectl create namespace recipe
```

### Install / Upgrade

```bash
helm upgrade --install food-app infra/helm/food-app \
  --namespace recipe \
  --values infra/helm/food-app/values-dev.yaml \
  --set global.imageTag=$(git rev-parse --short HEAD)
```

### Check Status

```bash
kubectl get pods -n recipe
kubectl get jobs -n recipe
kubectl get ingress -n recipe
kubectl get svc -n recipe
```

### Port-Forward Postgres (Example)

```bash
kubectl get pods -n recipe -l app=recipe-postgres
kubectl port-forward -n recipe pod/<recipe-postgres-pod> 5432:5432
```

### Image Tagging and Push

```bash
export IMAGE_TAG=$(git rev-parse --short HEAD)
export IMAGE_NAMESPACE=gabeodame
scripts/ci/build-images.sh
scripts/ci/push-images.sh
```

## CI/CD (Jenkins)

The repository includes a Jenkins pipeline that wires the full delivery path:

- `Jenkinsfile` defines lint → test → build → scan → push → deploy → smoke stages.
- Branch-based environments: `dev` (default), `main` → `staging`, `release/*` → `prod`.
- Image tags default to the short Git SHA (see `IMAGE_TAG` in the pipeline).

### Local Jenkins (Dev)

```bash
docker compose -f infra/jenkins/docker-compose.dev.yaml up -d
```

Access: `http://localhost:8080/jenkins`

Plugins are pinned in `infra/jenkins/plugins.txt` and installed on container startup.

## Troubleshooting (Fast Commands)

```bash
kubectl get pods -n <ns>
kubectl describe pod -n <ns> <pod>
kubectl logs -n <ns> <pod>
kubectl get events -n <ns> --sort-by=.metadata.creationTimestamp
```

### ImagePullBackOff

- Verify image name/tag in Helm values and registry access.
- Check `imagePullSecrets` and node registry auth.

### CrashLoopBackOff

- Inspect logs and readiness configuration.
- Check database and RabbitMQ connectivity from env/secret values.

### Job Failed (Migrations)

- Inspect Job logs and ensure DB is reachable.
- Re-run with `helm upgrade` after fixing the migration/DB issue.

### Ingress 404/502

- Confirm ingress controller class and service selectors.
- Validate routes and service ports in `infra/helm/food-app/values.yaml`.

### DB Connectivity

- Verify the secret-backed `DATABASE_URL`.
- Confirm the DB pod and service are running and reachable.

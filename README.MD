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

Note: secret manifests are intentionally excluded from git; example shapes and mappings live in `docs/examples/`.

### Run Services Locally (Kubernetes + Skaffold)

```bash
kubectl apply -f infra/k8s/dev/secrets
skaffold dev --profile dev
```

### Run Tests

```bash
scripts/ci/run-tests.sh
```

Auth tests use a local MongoDB container when Docker is available. The helper scripts live in `scripts/ci/start-mongo-test.sh` and `scripts/ci/stop-mongo-test.sh`.

Overrides: `MONGO_TEST_CONTAINER`, `MONGO_TEST_PORT`, `MONGO_TEST_IMAGE`.

### Lint / Format

```bash
scripts/ci/run-lint.sh
```

## Kubernetes / Helm Deploy

### Install / Upgrade

```bash
helm upgrade --install food-app infra/helm/food-app \
  --namespace recipe \
  --values infra/helm/food-app/values-dev.yaml \
  --set global.imageTag=$(git rev-parse --short HEAD)
```

### Seeding (Dev Only)

Seed runs as a Helm hook Job after migrations when enabled. It is gated and will not run in production unless explicitly allowed.

```bash
helm upgrade --install food-app infra/helm/food-app \
  --namespace recipe \
  --values infra/helm/food-app/values-dev.yaml \
  --set seed.enabled=true
```

Disable in prod (default):

```bash
helm upgrade --install food-app infra/helm/food-app \
  --namespace recipe \
  --values infra/helm/food-app/values-prod.yaml \
  --set seed.enabled=false
```

Re-run seed safely:

```bash
kubectl delete job -n recipe recipe-seed
helm upgrade --install food-app infra/helm/food-app \
  --namespace recipe \
  --values infra/helm/food-app/values-dev.yaml \
  --set seed.enabled=true
```

Env-specific values files:

- `infra/helm/food-app/values-dev.yaml`
- `infra/helm/food-app/values-staging.yaml`
- `infra/helm/food-app/values-prod.yaml`

You can also use the CI helper script:

```bash
HELM_VALUES_FILE=infra/helm/food-app/values-dev.yaml scripts/ci/deploy-helm.sh
```

### CI/CD Notes (Images, Secrets, Gateway)

- **Image tags:** CI builds and pushes `:SHA` images. Deploys override `global.imageTag` with the same SHA to avoid pull errors.
- **Secrets (default):** Helm renders Kubernetes Secrets from `values.yaml`. Override with `SECRETS_EXTERNAL_ENABLED=true` to rely on an external secret store.
- **Pre-created secrets:** Set `secrets.enabled=false` and use `envFrom` + `APPLY_SECRETS_MANIFESTS=true` in Jenkins. Defaults to `infra/k8s/<env>/secrets` or override with `SECRETS_MANIFEST_DIR`.
- **Registry pull secret (optional):** Set `IMAGE_PULL_SECRET_*` env vars or Jenkins parameters to create an image pull secret during deploy.
- **Gateway CRDs:** `scripts/ci/deploy-helm.sh` can install Gateway API CRDs when `INSTALL_GATEWAY_CRDS=true`.

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
export IMAGE_NAMESPACE=<your-docker-namespace>
scripts/ci/build-images.sh
scripts/ci/push-images.sh
```

In Jenkins, `IMAGE_NAMESPACE` defaults to the username from the `docker-registry-creds` credential when not provided.

Optional image scanning (requires `trivy`):

```bash
scripts/ci/scan-images.sh
```

### Gateway / Ingress

- Gateway is enabled by default in `values-*.yaml` and defines hostnames and optional TLS secrets.
- Ingress is present but disabled in values; enable if you prefer nginx ingress over Envoy Gateway.
- Example TLS secret names: `recipe-dev-tls` (dev) and hostnames like `recipe.dev`, `recipe.staging`, `recipe.prod`.

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

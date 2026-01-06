# Deployment Runbook

## Environments and Image Tags

CI builds and pushes images tagged with the short Git SHA. Helm deployments override `global.imageTag` with the same SHA to prevent pull errors.

## Registry Pull Secret (optional)

If your cluster requires registry auth, enable the pull secret in Jenkins or locally:

Jenkins parameters:
- `CREATE_IMAGE_PULL_SECRET=true`
- `IMAGE_PULL_SECRET_NAME=...`
- `IMAGE_PULL_SECRET_SERVER=https://index.docker.io/v1/`
- `IMAGE_PULL_SECRET_EMAIL=...`
- `IMAGE_NAMESPACE` (optional; defaults to registry username when using Jenkins creds)

The Jenkins job uses the `docker-registry-creds` credential to populate the secret.

Local example:

```bash
IMAGE_PULL_SECRET_ENABLED=true \
IMAGE_PULL_SECRET_NAME=docker-registry-creds \
IMAGE_PULL_SECRET_SERVER=https://index.docker.io/v1/ \
IMAGE_PULL_SECRET_USERNAME="$DOCKER_USER" \
IMAGE_PULL_SECRET_PASSWORD="$DOCKER_PASS" \
scripts/ci/deploy-helm.sh
```

## Secrets Strategy

Default: Helm-managed secrets (`secrets.enabled=true`, `secrets.external.enabled=false`).

External secret store:

- Set `SECRETS_EXTERNAL_ENABLED=true` (or Jenkins `USE_EXTERNAL_SECRETS=true`).
- Provide ExternalSecret/SecretStore manifests via `secrets.external.manifests`.

Pre-created secrets (no secret manager):

- Set `secrets.enabled=false` and create secrets in your pipeline.
- Use `envFrom` in `values.yaml` to reference those secret names.
- In Jenkins, enable `APPLY_SECRETS_MANIFESTS=true`. It defaults to `infra/k8s/<env>/secrets` and can be overridden with `SECRETS_MANIFEST_DIR`.

## Jenkins Secrets (Demo vs Production)

Demo (low risk, non-production):
- Mount pre-created Secret manifests into Jenkins via a ConfigMap.
- Configure `infra/helm/jenkins/values-*.yaml`:

```yaml
secretsManifests:
  enabled: true
  mountPath: /var/jenkins_home/secrets
  files:
    staging.yaml: |
      apiVersion: v1
      kind: Secret
      metadata:
        name: rabbitmq-secret
        namespace: recipe
      type: Opaque
      stringData:
        RABBITMQ_URL: "amqp://changeme:changeme@rabbitmq-service:5672"
```

- Jenkins parameter: `APPLY_SECRETS_MANIFESTS=true`
- Jenkins parameter: `SECRETS_MANIFEST_DIR=/var/jenkins_home/secrets/staging.yaml`

Production:
- Do not mount secret manifests into Jenkins.
- Use ExternalSecrets/Secrets Store CSI and set `secrets.external.enabled=true`.
- Jenkins deploys Helm only; secrets are managed outside CI/CD.

Example values snippet:

```yaml
secrets:
  enabled: true
  external:
    enabled: true
    manifests: |
      apiVersion: external-secrets.io/v1beta1
      kind: ExternalSecret
      metadata:
        name: recipe-secrets
      spec:
        refreshInterval: 1h
        secretStoreRef:
          name: my-secret-store
          kind: ClusterSecretStore
        target:
          name: recipe-postgres-secret
        data:
          - secretKey: DATABASE_URL
            remoteRef:
              key: recipe/database-url
```

## Gateway API CRDs

Enable `INSTALL_GATEWAY_CRDS=true` to install the Gateway API CRDs before Helm deploys.

## Smoke Tests

Configure endpoints with `SMOKE_TEST_ENDPOINTS` (comma-separated).

Example:

```bash
export SMOKE_TEST_URL="http://recipe.dev/"
export SMOKE_TEST_ENDPOINTS="/,/api/1/recipes"
scripts/ci/smoke-test.sh
```

## Local Deploy

```bash
export HELM_VALUES_FILE=infra/helm/food-app/values-dev.yaml
export IMAGE_TAG=$(git rev-parse --short HEAD)
scripts/ci/deploy-helm.sh
```

## Staging Deploy (manual)

1) Build + push images with the current SHA:

```bash
export IMAGE_TAG=$(git rev-parse --short HEAD)
export IMAGE_NAMESPACE=<your-docker-namespace>
scripts/ci/build-images.sh
scripts/ci/push-images.sh
```

2) Deploy to staging (installs Gateway API CRDs if needed):

```bash
export HELM_VALUES_FILE=infra/helm/food-app/values-staging.yaml
export INSTALL_GATEWAY_CRDS=true
export SECRETS_EXTERNAL_ENABLED=false
scripts/ci/deploy-helm.sh
```

3) Smoke test:

```bash
export SMOKE_TEST_URL="http://recipe.staging/"
export SMOKE_TEST_ENDPOINTS="/,/api/1/recipes"
scripts/ci/smoke-test.sh
```

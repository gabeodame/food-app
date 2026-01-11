# Deployment Runbook (Gateway API + Jenkins)

This repo uses Envoy Gateway + Gateway API as the single edge. Jenkins is exposed via
Gateway API and secured with cert-manager (Let's Encrypt).

## Phase 0: Manual Bootstrap (no webhooks required)

1) Install Gateway API CRDs (once)
```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
```

Rollback:
```bash
kubectl delete -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
```

2) Install Envoy Gateway controller
```bash
helm upgrade --install envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  --namespace envoy-gateway-system \
  --create-namespace
kubectl -n envoy-gateway-system wait --timeout=5m deployment/envoy-gateway --for=condition=Available
```

Rollback:
```bash
helm uninstall envoy-gateway -n envoy-gateway-system
```

3) Install cert-manager
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.5/cert-manager.yaml
kubectl apply -f infra/cert-manager/clusterissuer-letsencrypt.yaml
```

Rollback:
```bash
kubectl delete -f infra/cert-manager/clusterissuer-letsencrypt.yaml
kubectl delete -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.5/cert-manager.yaml
```

4) Install Jenkins (Gateway + TLS enabled)
```bash
helm upgrade --install jenkins infra/helm/jenkins \
  --namespace jenkins \
  --create-namespace \
  --values infra/helm/jenkins/values-staging.yaml
```

Rollback:
```bash
helm uninstall jenkins -n jenkins
```

5) DNS
- Point `jenkins.dishsharing.com` to the Envoy Gateway Service external IP/hostname.
- Jenkins URL: `https://jenkins.dishsharing.com/jenkins/`
- Webhook URL: `https://jenkins.dishsharing.com/jenkins/github-webhook/`
- App hostnames:
  - `recipe-dev.dishsharing.com`
  - `recipe-staging.dishsharing.com`
  - `recipe.dishsharing.com`

## Phase 1: Jenkins Multibranch Delivery

1) Configure Jenkins Location URL:
- `https://jenkins.dishsharing.com/jenkins/`

2) Multibranch behavior:
- feature/* and PRs: lint/test/build only, no deploy.
- `staging`: deploy to staging, run smoke tests.
- `main` or tags: deploy to prod, run smoke tests.

3) Registry secret for Kaniko build pods
- Jenkins uses `docker-registry-creds` to create `kaniko-registry` in `jenkins` namespace.
- Secret creation is handled by `scripts/ci/create-registry-secret.sh` in the pipeline.

## Manual vs Pipeline

Manual (Phase 0):
- Gateway API CRDs
- Envoy Gateway controller
- cert-manager + ClusterIssuer
- Jenkins install
- DNS for `jenkins.dishsharing.com`

Pipeline (Phase 1):
- App build, scan, deploy, smoke tests
- Gateway/HTTPRoute/Certificate for app via Helm values

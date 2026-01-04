# Gateway API Migration Plan (Envoy Gateway)

## Inventory

Current Ingress resources and settings:

- `infra/k8s/dev/ingress/ingress-srv-dev.yaml`
  - Host: `recipe.dev`
  - Paths: `/api/users`, `/api/1/recipes`, `/api/1/profile`, `/api/1/ingredient`, `/api/1/uploads`, `/`
  - Annotation: `nginx.ingress.kubernetes.io/use-regex: "true"`
- `infra/k8s/prod/ingress/ingress-srv-prod.yaml`
  - Host: `recipe.dev`
  - Paths: `/api/auth`, `/api/1/recipes`, `/`
  - Annotation: `nginx.ingress.kubernetes.io/use-regex: "true"`
- `infra/k8s/azure/ingress-srv-prod.yaml`
  - Host: `dishsharing.com`
  - Annotations: App Gateway settings (cookie affinity, SSL redirect, timeout)

## Target Architecture

- Gateway API CRDs installed.
- Envoy Gateway controller via Helm.
- `GatewayClass` named `envoy-gateway`.
- Per-environment `Gateway` in `recipe` namespace.
- Shared `HTTPRoute` mapping host/path to services.

## Migration Steps

1) Install Envoy Gateway (staging first).
2) Apply `GatewayClass`, `Gateway`, and `HTTPRoute` manifests.
3) Run routing tests (host/path, TLS, timeouts).
4) Cut over DNS to Envoy Gateway LB.
5) Remove Ingress-NGINX resources once stable.

## Rollback

- Keep Ingress resources and controller until Envoy Gateway is verified.
- Revert DNS to previous LB if issues arise.

## Tests

- Smoke test: `/` and API endpoints for each service.
- TLS termination checks (prod).
- Latency/error rate comparison against baseline.

# Gateway API (Envoy Gateway) Architecture

Ingress resources are fully removed. Envoy Gateway + Gateway API are the only edge.

## Target Architecture

- Gateway API CRDs installed.
- Envoy Gateway controller via Helm.
- `GatewayClass` named `envoy-gateway`.
- Per-environment `Gateway` in `recipe` namespace.
- Shared `HTTPRoute` mapping host/path to services.

## Setup Steps

1) Install Envoy Gateway (staging first).
2) Apply `GatewayClass`, `Gateway`, and `HTTPRoute` manifests.
3) Run routing tests (host/path, TLS, timeouts).
4) Point DNS to the Envoy Gateway LB.

## Rollback

- Revert DNS to the previous LB if issues arise.

## Tests

- Smoke test: `/` and API endpoints for each service.
- TLS termination checks (prod).
- Latency/error rate comparison against baseline.

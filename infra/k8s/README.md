# Kubernetes Manifests (Legacy/Reference)

This directory contains legacy Kubernetes manifests that predate the Helm chart.
The **Helm chart in `infra/helm/food-app` is the source of truth** for app deployments.

Use this folder only for:
- cluster-specific add-ons (e.g., Gateway controllers, CRDs, external secret stores)
- platform examples (AWS/Azure reference configs)

Secrets:
- real secrets must never be committed
- `infra/k8s/*/secrets.example` contains placeholders only

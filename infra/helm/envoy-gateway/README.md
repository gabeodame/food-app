# Envoy Gateway (Gateway API)

Use the OCI Helm chart to install Envoy Gateway in staging/prod.

```bash
helm install envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  --version v1.6.1 \
  --namespace envoy-gateway-system \
  --create-namespace

kubectl wait --timeout=5m -n envoy-gateway-system deployment/envoy-gateway --for=condition=Available

kubectl apply -f https://github.com/envoyproxy/gateway/releases/download/v1.6.1/quickstart.yaml -n default
```

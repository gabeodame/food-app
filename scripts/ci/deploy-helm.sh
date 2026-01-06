#!/usr/bin/env bash
set -euo pipefail

release=${HELM_RELEASE:-food-app}
namespace=${HELM_NAMESPACE:-recipe}
chart_path=${HELM_CHART_PATH:-infra/helm/food-app}
values_file=${HELM_VALUES_FILE:-infra/helm/food-app/values-dev.yaml}
image_tag=${IMAGE_TAG:-}
install_gateway_crds=${INSTALL_GATEWAY_CRDS:-false}
gateway_crds_url=${GATEWAY_CRDS_URL:-https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml}
secrets_enabled=${SECRETS_ENABLED:-}
secrets_external_enabled=${SECRETS_EXTERNAL_ENABLED:-}

if ! command -v helm >/dev/null 2>&1; then
  echo "helm is required for deployment" >&2
  exit 1
fi

if [[ "${install_gateway_crds}" == "true" ]]; then
  if ! command -v kubectl >/dev/null 2>&1; then
    echo "kubectl is required to install Gateway API CRDs" >&2
    exit 1
  fi
  echo "Installing Gateway API CRDs from ${gateway_crds_url}"
  kubectl apply -f "${gateway_crds_url}"
fi

set_args=()
if [[ -z "${image_tag}" ]]; then
  image_tag=$(git rev-parse --short HEAD)
fi
set_args+=(--set "global.imageTag=${image_tag}")
if [[ -n "${secrets_enabled}" ]]; then
  set_args+=(--set "secrets.enabled=${secrets_enabled}")
fi
if [[ -n "${secrets_external_enabled}" ]]; then
  set_args+=(--set "secrets.external.enabled=${secrets_external_enabled}")
fi

helm upgrade --install "$release" "$chart_path" \
  --namespace "$namespace" \
  --create-namespace \
  -f "$values_file" \
  "${set_args[@]}"

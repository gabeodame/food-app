#!/usr/bin/env bash
set -euo pipefail

release=${HELM_RELEASE:-food-app}
namespace=${HELM_NAMESPACE:-recipe}
chart_path=${HELM_CHART_PATH:-infra/helm/food-app}
values_file=${HELM_VALUES_FILE:-infra/helm/food-app/values-dev.yaml}
image_tag=${IMAGE_TAG:-}

if ! command -v helm >/dev/null 2>&1; then
  echo "helm is required for deployment" >&2
  exit 1
fi

set_args=()
if [[ -z "${image_tag}" ]]; then
  image_tag=$(git rev-parse --short HEAD)
fi
set_args+=(--set "global.imageTag=${image_tag}")

helm upgrade --install "$release" "$chart_path" \
  --namespace "$namespace" \
  --create-namespace \
  -f "$values_file" \
  "${set_args[@]}"

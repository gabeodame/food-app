#!/usr/bin/env bash
set -euo pipefail

unset KUBECONFIG

namespace=${REGISTRY_SECRET_NAMESPACE:-jenkins}
secret_name=${REGISTRY_SECRET_NAME:-kaniko-registry}
registry=${DOCKER_REGISTRY:-docker.io}
username=${REGISTRY_USER:-}
password=${REGISTRY_PASSWORD:-}
email=${REGISTRY_EMAIL:-}

if [[ -z "${username}" || -z "${password}" ]]; then
  echo "REGISTRY_USER and REGISTRY_PASSWORD are required." >&2
  exit 1
fi

kubectl get namespace "${namespace}" >/dev/null 2>&1 || kubectl create namespace "${namespace}"

kubectl -n "${namespace}" create secret docker-registry "${secret_name}" \
  --docker-server="${registry}" \
  --docker-username="${username}" \
  --docker-password="${password}" \
  --docker-email="${email}" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Registry secret applied: ${namespace}/${secret_name}"

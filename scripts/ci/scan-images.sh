#!/usr/bin/env bash
set -euo pipefail

image_tag=${IMAGE_TAG:-local}
registry=${DOCKER_REGISTRY:-docker.io}
namespace=${IMAGE_NAMESPACE:-gabeodame}

if ! command -v trivy >/dev/null 2>&1; then
  echo "trivy not installed; skipping image scan" >&2
  exit 0
fi

images=(
  recipe-client
  auth-service
  recipe-backend
  ingredient-backend
  userprofile-backend
  uploads-backend
)

for image in "${images[@]}"; do
  full_tag="${registry}/${namespace}/${image}:${image_tag}"
  echo "Scanning ${full_tag}"
  trivy image --no-progress --exit-code 1 "${full_tag}"
done

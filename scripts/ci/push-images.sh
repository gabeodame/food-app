#!/usr/bin/env bash
set -euo pipefail

image_tag=${IMAGE_TAG:-local}
registry=${DOCKER_REGISTRY:-docker.io}
namespace=${IMAGE_NAMESPACE:-gabeodame}

if [[ -n "${REGISTRY_USER:-}" && -n "${REGISTRY_PASSWORD:-}" ]]; then
  echo "${REGISTRY_PASSWORD}" | docker login "${registry}" -u "${REGISTRY_USER}" --password-stdin
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
  echo "Pushing ${full_tag}"
  docker push "${full_tag}"
done

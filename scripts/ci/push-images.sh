#!/usr/bin/env bash
set -euo pipefail

image_tag=${IMAGE_TAG:-local}
registry=${DOCKER_REGISTRY:-docker.io}
namespace=${IMAGE_NAMESPACE:-gabeodame}

# Default images (can be overridden by setting IMAGES env var as a space-separated list)
default_images=(
  recipe-client
  auth-service
  recipe-backend
  ingredient-backend
  userprofile-backend
  uploads-backend
)

# If IMAGES is set, use it; otherwise use defaults.
# Usage: IMAGES="auth-service recipe-backend" IMAGE_TAG=... ./scripts/ci/push-images.sh
if [[ -n "${IMAGES:-}" ]]; then
  # shellcheck disable=SC2206
  images=(${IMAGES})
else
  images=("${default_images[@]}")
fi

# If either is set, require both.
if [[ -n "${REGISTRY_USER:-}" || -n "${REGISTRY_PASSWORD:-}" ]]; then
  if [[ -z "${REGISTRY_USER:-}" || -z "${REGISTRY_PASSWORD:-}" ]]; then
    echo "ERROR: set both REGISTRY_USER and REGISTRY_PASSWORD (or neither)." >&2
    exit 1
  fi

  # Prevent accidental credential leak if shell xtrace is enabled externally (bash -x).
  set +x
  echo "${REGISTRY_PASSWORD}" | docker login "${registry}" -u "${REGISTRY_USER}" --password-stdin
  set -x 2>/dev/null || true
fi

for image in "${images[@]}"; do
  full_tag="${registry}/${namespace}/${image}:${image_tag}"

  # Ensure the local image exists before pushing.
  if ! docker image inspect "${full_tag}" >/dev/null 2>&1; then
    echo "ERROR: local image not found: ${full_tag}" >&2
    echo "Build/tag it first (or fix registry/namespace/image_tag)." >&2
    exit 1
  fi

  echo "Pushing ${full_tag}"
  docker push "${full_tag}"
done

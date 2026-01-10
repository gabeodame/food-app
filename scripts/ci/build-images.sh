#!/usr/bin/env bash
set -euo pipefail

image_tag=${IMAGE_TAG:-local}
registry=${DOCKER_REGISTRY:-docker.io}
namespace=${IMAGE_NAMESPACE:-}

if [[ -z "${namespace}" ]]; then
  echo "IMAGE_NAMESPACE is required (e.g., your DockerHub org/user)." >&2
  exit 1
fi

declare -A images=(
  [recipe-client]="services/client"
  [auth-service]="services/auth"
  [recipe-backend]="services/recipe"
  [ingredient-backend]="services/ingredient"
  [userprofile-backend]="services/profile"
  [uploads-backend]="services/uploads"
)

for image in "${!images[@]}"; do
  context="${images[$image]}"
  if [[ ! -f "${context}/Dockerfile" ]]; then
    echo "Skipping ${image}: missing Dockerfile in ${context}" >&2
    continue
  fi

  full_tag="${registry}/${namespace}/${image}:${image_tag}"
  echo "Building ${full_tag} from ${context}"
  docker build -t "${full_tag}" "${context}"
done

#!/usr/bin/env bash
set -euo pipefail

image_tag=${IMAGE_TAG:-local}
registry=${DOCKER_REGISTRY:-docker.io}
namespace=${IMAGE_NAMESPACE:-}
kaniko_enabled=${KANIKO_ENABLED:-false}
kaniko_executor=${KANIKO_EXECUTOR:-/kaniko/executor}
docker_config=${DOCKER_CONFIG:-/kaniko/.docker}

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
  if [[ "${kaniko_enabled}" == "true" ]]; then
    if [[ ! -x "${kaniko_executor}" ]]; then
      echo "Kaniko executor not found or not executable: ${kaniko_executor}" >&2
      exit 1
    fi
    DOCKER_CONFIG="${docker_config}" "${kaniko_executor}" \
      --context "dir://${PWD}/${context}" \
      --dockerfile "${PWD}/${context}/Dockerfile" \
      --destination "${full_tag}" \
      --cache=true
  else
    docker build -t "${full_tag}" "${context}"
  fi
done

#!/usr/bin/env bash
set -euo pipefail

services=(
  "services/client"
  "services/ingredient"
  "services/profile"
  "services/uploads"
)

for service in "${services[@]}"; do
  if [[ -f "${service}/package.json" ]]; then
    echo "Linting ${service}"
    (cd "${service}" && npm run lint)
  else
    echo "Skipping ${service}: no package.json"
  fi
done

#!/usr/bin/env bash
set -euo pipefail

services=(
  "services/auth"
  "services/recipe"
  "services/ingredient"
  "services/profile"
  "services/uploads"
)

for service in "${services[@]}"; do
  if [[ -f "${service}/package.json" ]]; then
    echo "Testing ${service}"
    (cd "${service}" && npm test -- --watchAll=false)
  else
    echo "Skipping ${service}: no package.json"
  fi
done

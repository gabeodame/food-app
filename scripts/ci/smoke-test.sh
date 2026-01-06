#!/usr/bin/env bash
set -euo pipefail

url=${SMOKE_TEST_URL:-"http://recipe.dev/"}
expected=${SMOKE_TEST_EXPECT:-"200"}
endpoints=${SMOKE_TEST_ENDPOINTS:-"/,/api/1/recipes"}

IFS=',' read -r -a checks <<< "${endpoints}"

for endpoint in "${checks[@]}"; do
  endpoint=$(echo "${endpoint}" | xargs)
  [[ -z "${endpoint}" ]] && continue
  target="${url%/}${endpoint}"
  status=$(curl -k -s -o /dev/null -w "%{http_code}" "${target}")
  if [[ "${status}" != "${expected}" ]]; then
    echo "Smoke test failed: ${target} returned ${status} (expected ${expected})" >&2
    exit 1
  fi
  echo "Smoke test passed: ${target} returned ${status}"
done

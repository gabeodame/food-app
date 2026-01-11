#!/usr/bin/env bash
set -euo pipefail

url=${SMOKE_TEST_URL:-"https://recipe-staging.dishsharing.com/"}
expected=${SMOKE_TEST_EXPECT:-"200"}
endpoints=${SMOKE_TEST_ENDPOINTS:-"/,/api/1/recipes"}
insecure=${SMOKE_TEST_INSECURE:-false}

IFS=',' read -r -a checks <<< "${endpoints}"

for endpoint in "${checks[@]}"; do
  endpoint=$(echo "${endpoint}" | xargs)
  [[ -z "${endpoint}" ]] && continue
  target="${url%/}${endpoint}"
  curl_args=(-s -o /dev/null -w "%{http_code}")
  if [[ "${insecure}" == "true" ]]; then
    curl_args+=(-k)
  fi
  status=$(curl "${curl_args[@]}" "${target}")
  if [[ "${status}" != "${expected}" ]]; then
    echo "Smoke test failed: ${target} returned ${status} (expected ${expected})" >&2
    exit 1
  fi
  echo "Smoke test passed: ${target} returned ${status}"
done

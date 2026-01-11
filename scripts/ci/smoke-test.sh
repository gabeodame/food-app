#!/usr/bin/env bash
set -euo pipefail

scheme=${SMOKE_TEST_SCHEME:-"http"}
service=${SMOKE_TEST_SERVICE:-"recipe-client-service"}
namespace=${SMOKE_TEST_NAMESPACE:-"recipe"}
port=${SMOKE_TEST_PORT:-"3000"}
basepath=${SMOKE_TEST_BASEPATH:-""}
url=${SMOKE_TEST_URL:-"${scheme}://${service}.${namespace}.svc.cluster.local:${port}${basepath}"}
expected=${SMOKE_TEST_EXPECT:-"200"}
endpoints=${SMOKE_TEST_ENDPOINTS:-"/,/api/1/recipes"}
insecure=${SMOKE_TEST_INSECURE:-false}

echo "Smoke test base URL: ${url}"
echo "Smoke test endpoints: ${endpoints}"

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

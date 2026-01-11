#!/usr/bin/env bash
set -euo pipefail

scheme=${SMOKE_TEST_SCHEME:-"http"}
service=${SMOKE_TEST_SERVICE:-"recipe-client-service"}
namespace=${SMOKE_TEST_NAMESPACE:-"recipe"}
port=${SMOKE_TEST_PORT:-"3000"}
basepath=${SMOKE_TEST_BASEPATH:-""}
url=${SMOKE_TEST_URL:-"${scheme}://${service}.${namespace}.svc.cluster.local:${port}${basepath}"}

# Allow multiple expected codes (comma-separated)
expected_codes=${SMOKE_TEST_EXPECT_CODES:-"200,301,302,307,308"}
endpoints=${SMOKE_TEST_ENDPOINTS:-"/,/api/1/recipes"}

# Curl behavior
connect_timeout=${SMOKE_TEST_CONNECT_TIMEOUT:-3}
max_time=${SMOKE_TEST_MAX_TIME:-10}
retries=${SMOKE_TEST_RETRIES:-3}
retry_delay=${SMOKE_TEST_RETRY_DELAY:-1}
insecure=${SMOKE_TEST_INSECURE:-false}

echo "Smoke test base URL: ${url}"
echo "Smoke test endpoints: ${endpoints}"
echo "Expected HTTP codes: ${expected_codes}"

IFS=',' read -r -a checks <<< "${endpoints}"
IFS=',' read -r -a expected <<< "${expected_codes}"

is_expected() {
  local code="$1"
  for e in "${expected[@]}"; do
    [[ "$(echo "$e" | xargs)" == "$code" ]] && return 0
  done
  return 1
}

for endpoint in "${checks[@]}"; do
  endpoint="$(echo "${endpoint}" | xargs)"
  [[ -z "${endpoint}" ]] && continue

  target="${url%/}${endpoint}"

  curl_args=(
    -s -o /dev/null -w "%{http_code}"
    --connect-timeout "${connect_timeout}"
    --max-time "${max_time}"
    --retry "${retries}"
    --retry-delay "${retry_delay}"
    --retry-connrefused
  )
  [[ "${insecure}" == "true" ]] && curl_args+=(-k)

  status="$(curl "${curl_args[@]}" "${target}")"

  if ! is_expected "${status}"; then
    echo "Smoke test failed: ${target} returned ${status} (expected one of: ${expected_codes})" >&2
    exit 1
  fi

  echo "Smoke test passed: ${target} returned ${status}"
done

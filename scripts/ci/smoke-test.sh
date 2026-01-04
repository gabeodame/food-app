#!/usr/bin/env bash
set -euo pipefail

url=${SMOKE_TEST_URL:-"http://recipe.dev/"}
expected=${SMOKE_TEST_EXPECT:-"200"}

status=$(curl -k -s -o /dev/null -w "%{http_code}" "$url")
if [[ "$status" != "$expected" ]]; then
  echo "Smoke test failed: $url returned $status (expected $expected)" >&2
  exit 1
fi

echo "Smoke test passed: $url returned $status"

#!/usr/bin/env bash
set -euo pipefail

name=${MONGO_TEST_CONTAINER:-auth-test-mongo}

if ! command -v docker >/dev/null 2>&1; then
  exit 0
fi

docker rm -f "${name}" >/dev/null 2>&1 || true

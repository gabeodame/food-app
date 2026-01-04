#!/usr/bin/env bash
set -euo pipefail

name=${MONGO_TEST_CONTAINER:-auth-test-mongo}
port=${MONGO_TEST_PORT:-27018}
image=${MONGO_TEST_IMAGE:-mongo:6.0}

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not available"
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^${name}$"; then
  docker rm -f "${name}" >/dev/null 2>&1 || true
fi

docker run -d --rm --name "${name}" -p "${port}:27017" "${image}" >/dev/null

for i in {1..30}; do
  if docker exec "${name}" mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo "Mongo test container ready"
    exit 0
  fi
  sleep 1
done

echo "Mongo test container failed to start"
exit 1

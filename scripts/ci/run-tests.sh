#!/usr/bin/env bash
set -euo pipefail

services=(
  "services/auth"
  "services/recipe"
  "services/ingredient"
  "services/profile"
  "services/uploads"
)

can_bind_local_port() {
  node -e "const net=require('net');const server=net.createServer();server.once('error',()=>process.exit(1));server.listen(0,'127.0.0.1',()=>server.close(()=>process.exit(0)));"
}

can_run_docker() {
  command -v docker >/dev/null 2>&1
}

for service in "${services[@]}"; do
  if [[ -f "${service}/package.json" ]]; then
    if [[ "${service}" == "services/auth" ]]; then
      if can_run_docker; then
        echo "Starting Mongo test container for ${service}"
        scripts/ci/start-mongo-test.sh
        trap 'scripts/ci/stop-mongo-test.sh' EXIT
        (
          cd "${service}" \
          && MONGO_URI="mongodb://localhost:${MONGO_TEST_PORT:-27018}/auth-test" npm test -- --watchAll=false
        )
        scripts/ci/stop-mongo-test.sh
        trap - EXIT
        continue
      fi

      if ! can_bind_local_port; then
        echo "Skipping ${service}: local port binding not available for MongoMemoryServer"
        continue
      fi
    fi

    echo "Testing ${service}"
    (cd "${service}" && npm test -- --watchAll=false)
  else
    echo "Skipping ${service}: no package.json"
  fi
done

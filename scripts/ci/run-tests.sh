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
  command -v docker >/dev/null 2>&1 && docker ps >/dev/null 2>&1
}

wait_for_mongo() {
  local uri hostport host port
  uri="${MONGO_URI#mongodb://}"
  hostport="${uri%%/*}"
  hostport="${hostport#*@}"
  host="${hostport%%:*}"
  port="${hostport##*:}"
  if [[ "${host}" == "${port}" ]]; then
    port="27017"
  fi

  if [[ "${host}" != "localhost" && "${host}" != "127.0.0.1" ]]; then
    return 0
  fi

  for _ in {1..30}; do
    if node -e "const net=require('net');const s=net.connect({host:'${host}',port:${port}},()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1));"; then
      return 0
    fi
    sleep 1
  done

  echo "Mongo not reachable at ${host}:${port} after 30s" >&2
  return 1
}

for service in "${services[@]}"; do
  if [[ -f "${service}/package.json" ]]; then
    if [[ "${service}" == "services/auth" ]]; then
      if [[ -n "${MONGO_URI:-}" ]]; then
        echo "Testing ${service} with external Mongo: ${MONGO_URI}"
        wait_for_mongo
        (
          cd "${service}"
          if [[ ! -d node_modules ]]; then
            npm ci
          fi
          MONGO_URI="${MONGO_URI}" npm test -- --watchAll=false
        )
        continue
      fi

      if can_run_docker; then
        echo "Starting Mongo test container for ${service}"
        scripts/ci/start-mongo-test.sh
        trap 'scripts/ci/stop-mongo-test.sh' EXIT
        (
          cd "${service}" \
          && if [[ ! -d node_modules ]]; then npm ci; fi \
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
    (
      cd "${service}"
      if [[ ! -d node_modules ]]; then
        npm ci
      fi
      npm test -- --watchAll=false
    )
  else
    echo "Skipping ${service}: no package.json"
  fi
done

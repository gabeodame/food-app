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

for service in "${services[@]}"; do
  if [[ -f "${service}/package.json" ]]; then
    if [[ "${service}" == "services/auth" ]] && ! can_bind_local_port; then
      echo "Skipping ${service}: local port binding not available for MongoMemoryServer"
      continue
    fi

    echo "Testing ${service}"
    (cd "${service}" && npm test -- --watchAll=false)
  else
    echo "Skipping ${service}: no package.json"
  fi
done

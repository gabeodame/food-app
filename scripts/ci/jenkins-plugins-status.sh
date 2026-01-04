#!/usr/bin/env bash
set -euo pipefail

container=${1:-jenkins-dev}

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required" >&2
  exit 1
fi

echo "Checking plugin list in ${container}..."
docker exec -it "${container}" ls /var/jenkins_home/plugins 2>/dev/null | sed 's/\.jpi$//' | sort | head -n 50

if docker exec -it "${container}" test -f /var/jenkins_home/plugins/plugins.txt 2>/dev/null; then
  echo "Found plugins.txt in Jenkins home."
else
  echo "plugins.txt not found in Jenkins home (this is OK if plugins are installed from /usr/share/jenkins/ref)."
fi

#!/bin/bash

# Check for input arguments (environment and Skaffold command)
ENV=$1
COMMAND=$2

# Validate environment input
if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
  echo "Unknown environment: $ENV"
  exit 1
fi

# Run Skaffold with the appropriate profile for the environment
echo "Running Skaffold in '$ENV' environment with '$COMMAND' command..."
skaffold $COMMAND -p $ENV

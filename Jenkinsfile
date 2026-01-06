pipeline {
  agent any

  parameters {
    choice(name: "DEPLOY_ENV_OVERRIDE", choices: ["", "dev", "staging", "prod"], description: "Override environment selection (optional).")
    booleanParam(name: "INSTALL_GATEWAY_CRDS", defaultValue: true, description: "Install Gateway API CRDs before Helm deploy.")
    booleanParam(name: "USE_EXTERNAL_SECRETS", defaultValue: false, description: "Disable Helm-managed secrets and rely on an external secret store.")
  }

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: "20"))
  }

  triggers {
    githubPush()
  }

  environment {
    HELM_RELEASE    = "food-app"
    HELM_NAMESPACE  = "recipe"
    HELM_CHART_PATH = "infra/helm/food-app"
    DEPLOY_ENV      = "dev"
    HELM_VALUES_FILE = "infra/helm/food-app/values-dev.yaml"
    SMOKE_TEST_URL  = "http://recipe.dev/"
    IMAGE_TAG       = ""
    DOCKER_REGISTRY = "docker.io"
    IMAGE_NAMESPACE = "gabeodame"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("Prep") {
      steps {
        script {
          def branch = env.BRANCH_NAME ?: "dev"
          if (params.DEPLOY_ENV_OVERRIDE) {
            env.DEPLOY_ENV = params.DEPLOY_ENV_OVERRIDE
          } else if (branch == "main") {
            env.DEPLOY_ENV = "staging"
          } else if (branch.startsWith("release/")) {
            env.DEPLOY_ENV = "prod"
          } else {
            env.DEPLOY_ENV = "dev"
          }

          env.IMAGE_TAG = env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : "local"
          env.HELM_VALUES_FILE = "infra/helm/food-app/values-${env.DEPLOY_ENV}.yaml"
          env.INSTALL_GATEWAY_CRDS = params.INSTALL_GATEWAY_CRDS ? "true" : "false"
          env.SECRETS_EXTERNAL_ENABLED = params.USE_EXTERNAL_SECRETS ? "true" : "false"
          env.SECRETS_ENABLED = params.USE_EXTERNAL_SECRETS ? "false" : "true"

          if (env.DEPLOY_ENV == "prod") {
            env.SMOKE_TEST_URL = "http://recipe.prod/"
          } else if (env.DEPLOY_ENV == "staging") {
            env.SMOKE_TEST_URL = "http://recipe.staging/"
          } else {
            env.SMOKE_TEST_URL = "http://recipe.dev/"
          }
        }
      }
    }

    stage("Static Analysis") {
      steps {
        sh "scripts/ci/run-lint.sh"
      }
    }

    stage("Unit & Integration Tests") {
      steps {
        sh "scripts/ci/run-tests.sh"
      }
    }

    stage("Build Images") {
      steps {
        sh "scripts/ci/build-images.sh"
      }
    }

    stage("Image Scan") {
      steps {
        sh "scripts/ci/scan-images.sh"
      }
    }

    stage("Push Images") {
      steps {
        withCredentials([usernamePassword(credentialsId: "docker-registry-creds", usernameVariable: "REGISTRY_USER", passwordVariable: "REGISTRY_PASSWORD")]) {
          sh "scripts/ci/push-images.sh"
        }
      }
    }

    stage("Deploy via Helm") {
      when {
        anyOf {
          branch "main"
          branch "release/*"
        }
      }
      steps {
        sh "scripts/ci/deploy-helm.sh"
      }
    }

    stage("Smoke Tests") {
      when {
        anyOf {
          branch "main"
          branch "release/*"
        }
      }
      steps {
        sh "scripts/ci/smoke-test.sh"
      }
    }
  }
}

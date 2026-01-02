pipeline {
  agent any

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
          if (branch == "main") {
            env.DEPLOY_ENV = "staging"
          } else if (branch.startsWith("release/")) {
            env.DEPLOY_ENV = "prod"
          } else {
            env.DEPLOY_ENV = "dev"
          }

          env.IMAGE_TAG = env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : "local"
          env.HELM_VALUES_FILE = "infra/helm/food-app/values-${env.DEPLOY_ENV}.yaml"

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

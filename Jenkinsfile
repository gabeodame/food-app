pipeline {
  agent any

  options {
    timestamps()
  }

  triggers {
    githubPush()
  }

  environment {
    HELM_RELEASE    = "food-app"
    HELM_NAMESPACE  = "recipe"
    HELM_CHART_PATH = "infra/helm/food-app"
    HELM_VALUES_FILE = "infra/helm/food-app/values-dev.yaml"
    SMOKE_TEST_URL  = "http://recipe.dev/"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
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
        sh "scripts/ci/push-images.sh"
      }
    }

    stage("Deploy via Helm") {
      steps {
        sh "scripts/ci/deploy-helm.sh"
      }
    }

    stage("Smoke Tests") {
      steps {
        sh "scripts/ci/smoke-test.sh"
      }
    }
  }
}

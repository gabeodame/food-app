pipeline {
  agent any

  parameters {
    choice(name: "DEPLOY_ENV_OVERRIDE", choices: ["", "dev", "staging", "prod"], description: "Override environment selection (optional).")
    booleanParam(name: "INSTALL_GATEWAY_CRDS", defaultValue: true, description: "Install Gateway API CRDs before Helm deploy.")
    booleanParam(name: "USE_EXTERNAL_SECRETS", defaultValue: false, description: "Disable Helm-managed secrets and rely on an external secret store.")
    booleanParam(name: "APPLY_SECRETS_MANIFESTS", defaultValue: false, description: "Apply pre-created Secret manifests before Helm deploy.")
    string(name: "SECRETS_MANIFEST_DIR", defaultValue: "", description: "Directory containing Secret manifests to apply (optional).")
    booleanParam(name: "CREATE_IMAGE_PULL_SECRET", defaultValue: false, description: "Create imagePullSecret during Helm deploy.")
    string(name: "IMAGE_PULL_SECRET_NAME", defaultValue: "docker-registry-creds", description: "Name for the image pull secret.")
    string(name: "IMAGE_PULL_SECRET_SERVER", defaultValue: "https://index.docker.io/v1/", description: "Registry server for image pull secret.")
    string(name: "IMAGE_PULL_SECRET_EMAIL", defaultValue: "", description: "Email for image pull secret (optional).")
    string(name: "IMAGE_NAMESPACE", defaultValue: "gabeodame", description: "Docker registry namespace/org for image tags.")
  }

  options {
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
          env.IMAGE_PULL_SECRET_ENABLED = params.CREATE_IMAGE_PULL_SECRET ? "true" : "false"
          env.IMAGE_PULL_SECRET_NAME = params.IMAGE_PULL_SECRET_NAME
          env.IMAGE_PULL_SECRET_SERVER = params.IMAGE_PULL_SECRET_SERVER
          env.IMAGE_PULL_SECRET_EMAIL = params.IMAGE_PULL_SECRET_EMAIL
          env.IMAGE_NAMESPACE = params.IMAGE_NAMESPACE
          env.APPLY_SECRETS_MANIFESTS = params.APPLY_SECRETS_MANIFESTS ? "true" : "false"
          env.SECRETS_MANIFEST_DIR = params.SECRETS_MANIFEST_DIR?.trim()
          if (!env.SECRETS_MANIFEST_DIR) {
            env.SECRETS_MANIFEST_DIR = "infra/k8s/${env.DEPLOY_ENV}/secrets"
          }
          if (!env.IMAGE_NAMESPACE?.trim()) {
            withCredentials([usernamePassword(credentialsId: "docker-registry-creds", usernameVariable: "REGISTRY_USER", passwordVariable: "REGISTRY_PASSWORD")]) {
              env.IMAGE_NAMESPACE = env.REGISTRY_USER
            }
          }

          if (env.DEPLOY_ENV == "prod") {
            env.SMOKE_TEST_URL = "http://recipe.prod/"
          } else if (env.DEPLOY_ENV == "staging") {
            env.SMOKE_TEST_URL = "http://recipe.staging/"
          } else {
            env.SMOKE_TEST_URL = "http://recipe.dev/"
          }
          env.SMOKE_TEST_ENDPOINTS = "/,/api/1/recipes"
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

    stage("Apply Secrets") {
      when {
        expression { return params.APPLY_SECRETS_MANIFESTS }
      }
      steps {
        script {
          if (!fileExists(env.SECRETS_MANIFEST_DIR)) {
            error("Secrets manifest dir not found: ${env.SECRETS_MANIFEST_DIR}")
          }
          sh "kubectl apply -f ${env.SECRETS_MANIFEST_DIR}"
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
        script {
          if (params.CREATE_IMAGE_PULL_SECRET) {
            withCredentials([usernamePassword(credentialsId: "docker-registry-creds", usernameVariable: "REGISTRY_USER", passwordVariable: "REGISTRY_PASSWORD")]) {
              sh """
                IMAGE_PULL_SECRET_USERNAME=${REGISTRY_USER} \
                IMAGE_PULL_SECRET_PASSWORD=${REGISTRY_PASSWORD} \
                scripts/ci/deploy-helm.sh
              """
            }
          } else {
            sh "scripts/ci/deploy-helm.sh"
          }
        }
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

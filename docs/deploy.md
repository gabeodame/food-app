# Deployment Runbook (CKA-Friendly)

This document provides a clean, end‑to‑end deployment flow for this project and explains **why** each step exists. It is written to be both production‑ready and a learning tool for Kubernetes administrators.

## Table of Contents

- [Quick Start](#quick-start)
- [Decision Matrix](#decision-matrix)
- [Core Concepts](#core-concepts)
- [Jenkins CI/CD (Recommended)](#jenkins-cicd-recommended)
  - [A) In‑cluster Jenkins (staging/prod)](#a-in-cluster-jenkins-stagingprod)
  - [B) Local Jenkins (dev)](#b-local-jenkins-dev)
- [Manual Helm Deploy (staging example)](#manual-helm-deploy-staging-example)
- [Kustomize + Helm (GitOps)](#kustomize--helm-gitops)
- [Troubleshooting](#troubleshooting)

## Quick Start

If you just want a clean staging deployment:

1) Jenkins is running in the cluster.
2) Registry credentials are configured.
3) Secrets exist under `infra/k8s/staging/secrets`.
4) Run the Jenkins pipeline with:
   - `DEPLOY_ENV_OVERRIDE=staging`
   - `INSTALL_GATEWAY_CRDS=true`
   - `APPLY_SECRETS_MANIFESTS=true`

## Decision Matrix

Choose your path:

- **Jenkins inside the cluster** (recommended for staging/prod):  
  Use ServiceAccount + Role/RoleBinding and a kubeconfig (stored as a secret) so Jenkins can run `kubectl`.

- **Jenkins on your laptop** (dev):  
  Use a kubeconfig secret and mount it into Jenkins.

- **GitOps flow**:  
  Use Kustomize overlays with Helm chart inflation.

## Core Concepts

**Image tags**
- All services are deployed with a single `IMAGE_TAG` (git SHA).
- This prevents “image not found” issues across environments.

**Secrets**
- **Production standard:** ExternalSecrets / Secrets Store CSI.  
  Jenkins does not handle secret values.
- **Demo / low‑cost:** Pre‑create secrets in `infra/k8s/<env>/secrets` and apply them in CI.

**Gateway CRDs**
- The chart uses Gateway/HTTPRoute resources.  
  CRDs must exist before Helm install.

## Jenkins CI/CD (Recommended)

### A) In‑cluster Jenkins (staging/prod)

1) **Install Jenkins**
```bash
helm upgrade --install jenkins infra/helm/jenkins \
  --namespace jenkins \
  --create-namespace \
  --values infra/helm/jenkins/values-staging.yaml
```

2) **Access Jenkins**
```bash
kubectl -n jenkins port-forward svc/jenkins 8080:8080
kubectl -n jenkins exec -it <jenkins-pod> -- cat /var/jenkins_home/secrets/initialAdminPassword
```

3) **Credentials**
- `docker-registry-creds` (DockerHub username/password)
- GitHub token (if repo is private)

4) **Grant Jenkins access to `recipe` namespace + kubeconfig**

Even in‑cluster, Jenkins needs a kubeconfig file if your pipeline runs `kubectl`.
This chart mounts `/var/jenkins_home/.kube/config` and sets `KUBECONFIG` for you.

Automated:
```bash
export ENSURE_JENKINS_RBAC=true
export TARGET_NAMESPACE=recipe
export JENKINS_SERVICE_ACCOUNT=jenkins-deployer
export GENERATE_SA_KUBECONFIG=true
export CREATE_KUBECONFIG_SECRET=true
scripts/ci/create-jenkins-kubeconfig-secret.sh
```

Manual (CKA practice):
```bash
kubectl -n jenkins create serviceaccount jenkins-deployer

kubectl -n recipe apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: jenkins-deployer-role
  namespace: recipe
rules:
  - apiGroups: ["", "apps", "batch", "networking.k8s.io", "gateway.networking.k8s.io"]
    resources:
      - configmaps
      - secrets
      - services
      - serviceaccounts
      - deployments
      - statefulsets
      - jobs
      - cronjobs
      - ingresses
      - networkpolicies
      - persistentvolumeclaims
      - gateways
      - httproutes
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
EOF

kubectl -n recipe apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: jenkins-deployer-binding
  namespace: recipe
subjects:
  - kind: ServiceAccount
    name: jenkins-deployer
    namespace: jenkins
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: jenkins-deployer-role
EOF
```

5) **Verify kubectl is available in the pod**

The chart installs `kubectl` during init:
```bash
kubectl -n jenkins exec -it <jenkins-pod> -- kubectl version --client
kubectl -n jenkins exec -it <jenkins-pod> -- kubectl config get-contexts
```

6) **Run the pipeline (staging example)**
Set parameters:
- `DEPLOY_ENV_OVERRIDE=staging`
- `INSTALL_GATEWAY_CRDS=true`
- `USE_EXTERNAL_SECRETS=false`
- `APPLY_SECRETS_MANIFESTS=true`
- `SECRETS_MANIFEST_DIR=infra/k8s/staging/secrets`

Pipeline stages:
1) Build images  
2) Push images  
3) Apply secrets  
4) Helm deploy  
5) Smoke tests

### B) Local Jenkins (dev)

Use this when Jenkins runs on your laptop or docker‑compose.

1) **Create kubeconfig secret**
```bash
export KUBECONFIG=/absolute/path/to/kubeconfig
scripts/ci/create-jenkins-kubeconfig-secret.sh
```

2) **Mount Docker + kubeconfig**
- Docker socket: `/var/run/docker.sock`
- Kubeconfig: `/var/jenkins_home/.kube/config`

These are already wired in the Jenkins Helm chart via:
- `dockerSocket.enabled=true`
- `kubeconfig.enabled=true`

3) **Verify kubectl is available**
```bash
kubectl -n jenkins exec -it <jenkins-pod> -- kubectl version --client
```

## Manual Helm Deploy (staging example)

1) Build + push images:
```bash
export IMAGE_TAG=$(git rev-parse --short HEAD)
export IMAGE_NAMESPACE=<your-docker-namespace>
scripts/ci/build-images.sh
scripts/ci/push-images.sh
```

2) Apply secrets:
```bash
kubectl apply -f infra/k8s/staging/secrets
```

3) Helm deploy:
```bash
export HELM_VALUES_FILE=infra/helm/food-app/values-staging.yaml
export INSTALL_GATEWAY_CRDS=true
export SECRETS_EXTERNAL_ENABLED=false
scripts/ci/deploy-helm.sh
```

4) Smoke test:
```bash
export SMOKE_TEST_URL="http://recipe.staging/"
export SMOKE_TEST_ENDPOINTS="/,/api/1/recipes"
scripts/ci/smoke-test.sh
```

## Kustomize + Helm (GitOps)

Run Helm chart inflation declaratively:

```bash
kubectl kustomize --enable-helm k8s/overlays/dev | kubectl apply -f -
```

Overlays:
- `k8s/overlays/dev` → `values-dev.yaml`
- `k8s/overlays/prod` → `values-prod.yaml` + sidecar patch

## Troubleshooting

- **Jenkins plugins missing**:  
  Check init logs:  
  `kubectl -n jenkins logs <pod> -c install-jenkins-plugins`

- **Namespace conflicts**:  
  Use `--create-namespace` and keep `namespaceCreate=false` in Jenkins values.

- **Image pull errors**:  
  Verify `IMAGE_TAG` exists in registry.

- **Init container runAsNonRoot errors**:  
  Ensure busybox init containers set `runAsUser` and `runAsNonRoot`.

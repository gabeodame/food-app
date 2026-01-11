# DEPLOYMENT.md — Gateway API + Envoy Gateway + Jenkins (Multibranch) + Kaniko

This repo deploys via **Jenkins Multibranch Pipeline** to Kubernetes using **Envoy Gateway + Gateway API** as the **only edge**.
Jenkins is exposed under the path prefix **`/jenkins`** (Jenkins runs with `--prefix=/jenkins`) and receives GitHub webhooks at:
- `https://jenkins.dishsharing.com/jenkins/github-webhook/`

---

## 0) Architecture Summary

### Edge / Routing (Only)
- **Envoy Gateway controller** (GatewayClass: `envoy-gateway`)
- **Gateway + HTTPRoute** resources per service/environment
- **TLS** via **cert-manager** + Let’s Encrypt (ACME)

### CI/CD
- Jenkins runs in-cluster (`namespace: jenkins`)
- Multibranch indexing via **GitHub Webhooks**
- Images built in Kubernetes using **Kaniko** in **ephemeral Jenkins agent pods**
- No `docker.sock` mounts

### Environments + FQDNs
Jenkins:
- `jenkins.dishsharing.com`

App:
- `recipe-dev.dishsharing.com`
- `recipe-staging.dishsharing.com`
- `recipe.dishsharing.com` (prod)

---

## 1) Requirements (Hard)

### External Reachability
For GitHub webhooks + Let’s Encrypt issuance to work:
- DNS must resolve publicly to Envoy Gateway’s external address
- Port **80** and **443** must be reachable at the edge
- HTTP must be available for **ACME HTTP-01** unless you switch to DNS-01

### Jenkins URL Prefix
- Jenkins is served under `/jenkins`
- Any edge routing must forward `/jenkins` to the Jenkins service

---

## 2) Repo Conventions / Knobs

### Jenkins Helm Values (Expected)
Your Jenkins chart values must enforce:
- `dockerSocket.enabled: false`
- `jenkinsOpts: "--prefix=/jenkins"`
- `gateway.enabled: true` (for real exposure)
- `certManager.enabled: true` (for real TLS)

### Gateway Route Values (Expected)
The HTTPRoute should match:
- `gatewayRoute.path: /jenkins`
- `gatewayRoute.pathType: PathPrefix`

---

## 3) Phase 0 — Manual Bootstrap (No Webhooks Required)

This phase must be run manually once per cluster to avoid bootstrap deadlocks.

> **Prereqs:** You have `kubectl` + `helm`, and cluster access.

### 3.1 Verify cluster access
```bash
kubectl cluster-info
kubectl get nodes -o wide
helm version
```

### 3.2 Install Gateway API CRDs (one-time)
```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
kubectl get crd | rg gateway
```

Rollback:
```bash
kubectl delete -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
```

### 3.3 Install Envoy Gateway controller
```bash
helm upgrade --install envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  -n envoy-gateway-system --create-namespace

kubectl -n envoy-gateway-system wait --for=condition=Available deploy/envoy-gateway --timeout=5m
kubectl -n envoy-gateway-system get svc -o wide
```

Rollback:
```bash
helm uninstall envoy-gateway -n envoy-gateway-system
```

### 3.4 Install cert-manager (Helm)
```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm upgrade --install cert-manager jetstack/cert-manager \
  -n cert-manager --create-namespace \
  --set crds.enabled=true

kubectl -n cert-manager get pods
```

Apply ACME issuer:

IMPORTANT: Update the email in `infra/cert-manager/clusterissuer-letsencrypt.yaml` before applying.

```bash
kubectl apply -f infra/cert-manager/clusterissuer-letsencrypt.yaml
kubectl get clusterissuer
```

Rollback:
```bash
kubectl delete -f infra/cert-manager/clusterissuer-letsencrypt.yaml
helm uninstall cert-manager -n cert-manager
```

### 3.5 Configure DNS (Required)
Find Envoy Gateway’s external address:
```bash
kubectl -n envoy-gateway-system get svc -o wide
```

Create DNS records (A or CNAME depending on external address):
- `jenkins.dishsharing.com`
- `recipe-dev.dishsharing.com`
- `recipe-staging.dishsharing.com`
- `recipe.dishsharing.com`

Verify DNS resolution:
```bash
dig +short jenkins.dishsharing.com
dig +short recipe-staging.dishsharing.com
```

ACME HTTP-01 requirement: Port 80 must be reachable at the hostname for certificate issuance. Ensure your Jenkins Gateway has an HTTP listener on 80.

### 3.6 Install Jenkins (Gateway + TLS enabled)
```bash
helm upgrade --install jenkins infra/helm/jenkins \
  -n jenkins --create-namespace \
  -f infra/helm/jenkins/values-staging.yaml
```

Verify Jenkins routing and TLS:
```bash
kubectl -n jenkins get gateway,httproute
kubectl -n jenkins get certificate
kubectl -n jenkins get secret jenkins-tls
```

If cert is not Ready:
```bash
kubectl -n jenkins describe certificate jenkins-tls
kubectl -n jenkins get order,challenge
kubectl -n jenkins describe challenge <challenge-name>
```

Verify externally:
```bash
curl -I https://jenkins.dishsharing.com/jenkins/login
curl -I https://jenkins.dishsharing.com/jenkins/github-webhook/
```

Expected:
- `/jenkins/login` -> 200/302
- `/jenkins/github-webhook/` -> 200/403 (must not be 404)

Rollback:
```bash
helm uninstall jenkins -n jenkins
```

### 3.7 Jenkins UI Configuration (Critical)
In Jenkins:
Manage Jenkins → System → Jenkins Location

Jenkins URL: `https://jenkins.dishsharing.com/jenkins/`

---

## 4) Phase 1 — Jenkins Multibranch + Webhooks + Deploy

### 4.1 Create Jenkins Credentials
GitHub PAT (Multibranch + private branches)
Recommended credential type: Username with password
- username: your GitHub username
- password: PAT

PAT scopes:
- Private repo: `repo` (classic) or fine-grained equivalent
- If Jenkins will manage webhooks automatically: include repo hook admin permissions
- If you create webhooks manually: you can avoid hook admin scope

Registry creds (Kaniko push)
Create credential in Jenkins:
- ID: `docker-registry-creds` (or match pipeline expectation)
- Use token/password for your registry

### 4.2 Create Multibranch Pipeline Job
Jenkins → New Item → Multibranch Pipeline

Branch source: GitHub
Credentials: GitHub PAT credential
Repo: `gabeodame/food-app` (or your fork)

Behaviors:
- Discover branches
- Discover PRs

Triggers:
- Enable webhook-based indexing
- Optional periodic scan fallback (e.g. every 1 hour)

### 4.3 Create GitHub Webhook (Manual Recommended)
GitHub repo → Settings → Webhooks → Add webhook

Payload URL: `https://jenkins.dishsharing.com/jenkins/github-webhook/`
Content type: `application/json`
Events: Push + Pull Request
Secret: recommended

Verify webhook deliveries show HTTP 200.

### 4.4 Branch Gating (Expected Pipeline Behavior)
- feature/* and PRs: lint/test/build (optional), NO deploy
- staging: deploy staging + smoke test
- main or tags: deploy prod + smoke test (if enabled)

---

## 5) Kaniko Build (No Docker Socket)

### 5.1 Registry Secret
The pipeline creates a K8s secret (in namespace jenkins) used by Kaniko build pods:
- Secret name: `kaniko-registry`

Verify:
```bash
kubectl -n jenkins get secret kaniko-registry
```

Kaniko expects docker config at:
`/kaniko/.docker/config.json`

### 5.2 Agent Pod Expectations
Kaniko runs in ephemeral Jenkins Kubernetes agents. Ensure:
- Jenkins Kubernetes plugin is configured
- Agent pods can run in the target namespace
- Workspace is available to the Kaniko container
- Network egress to your image registry is allowed

---

## 6) End-to-End Deployment Test Procedure

### 6.1 Verify no Ingress resources exist
```bash
kubectl get ingress -A
```

Expected: none related to this repo.

### 6.2 Trigger staging deployment (webhook test)
```bash
git checkout staging
git commit --allow-empty -m "e2e: trigger staging deploy"
git push origin staging
```

### 6.3 Watch Jenkins
Multibranch job -> staging branch build should start automatically

### 6.4 Watch cluster rollout
(Adjust namespace/release names to your repo structure.)

```bash
kubectl get ns
kubectl -n recipe get deploy,po,svc
kubectl -n recipe get gateway,httproute
kubectl -n recipe rollout status deploy/<deployment-name>
```

### 6.5 Validate external endpoints
```bash
curl -I https://recipe-staging.dishsharing.com/
curl -i https://recipe-staging.dishsharing.com/api/1/recipes
```

### 6.6 Negative test (feature branch must not deploy)
```bash
git checkout -b feature/no-deploy-test
git commit --allow-empty -m "e2e: feature branch build only"
git push origin feature/no-deploy-test
```

Expected:
- Build runs
- No Helm deploy executed

---

## 7) Troubleshooting (Fast)

Jenkins webhook returns 404
- Wrong URL path: must include `/jenkins/`
- HTTPRoute path mismatch: ensure `/jenkins` is routed
- Jenkins prefix missing: ensure `--prefix=/jenkins` is set

Certificate stuck Pending/Failed
- DNS not pointing to Envoy LB
- Port 80 not reachable (HTTP listener missing or blocked)
- Issuer solver parentRefs wrong (name/namespace mismatch)

Debug:
```bash
kubectl -n jenkins get order,challenge
kubectl -n jenkins describe challenge <name>
kubectl -n jenkins describe certificate jenkins-tls
```

Kaniko build fails
Common causes:
- registry secret missing/incorrect type
- Dockerfile path/context incorrect
- workspace not mounted into Kaniko container
- registry egress blocked

---

## 8) Security Notes (Do Not Ignore)

- Never mount `/var/run/docker.sock` into Jenkins.
- Keep Jenkins edge protected (auth enabled, TLS enforced).
- Keep Jenkins deploy RBAC least-privilege (namespace-scoped Roles).
- Store secrets in Jenkins Credentials / K8s Secrets only — never in repo.

---

## 9) Rollback / Cleanup

Remove app releases:
```bash
helm -n recipe uninstall <release-name>
```

Remove Jenkins:
```bash
helm -n jenkins uninstall jenkins
```

Remove cert-manager:
```bash
kubectl delete -f infra/cert-manager/clusterissuer-letsencrypt.yaml
helm -n cert-manager uninstall cert-manager
```

Remove Envoy Gateway:
```bash
helm -n envoy-gateway-system uninstall envoy-gateway
```

Remove Gateway API CRDs (last resort):
```bash
kubectl delete -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
```

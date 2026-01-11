# DEPLOYMENT.md — Phase 1 (CKA Practice Mode)

This repo is configured to practice real-world Kubernetes/DevOps workflows:
- **Gateway API + Envoy Gateway** (single edge model)
- **Jenkins in-cluster (private)** for Multibranch pipelines
- **Kaniko builds in Kubernetes agent pods** (no docker.sock)
- Deploy via Helm (and existing overlays if present)
- Access via **kubectl port-forward** (or LAN-only NodePort if you choose)

---

## 1) Goals (Phase 1)

- Practice cluster management and troubleshooting (CKA style)
- Practice CI/CD pipeline flows end-to-end
- Keep infrastructure private and safe (no internet exposure)
- Repeatable setup / teardown

Non-goals (explicitly out of scope for Phase 1):
- Public DNS (dishsharing.com)
- GitHub webhooks
- cert-manager / Let’s Encrypt
- WAF / Cloudflare / internet hardening
- Recruiter/demo polish

---

## 2) High-Level Architecture (Phase 1)

### Edge / Routing
- Envoy Gateway controller installed in `envoy-gateway-system`
- Gateway API CRDs installed once
- App routing exercised via Gateway/HTTPRoute using local access (port-forward or NodePort)

### CI/CD
- Jenkins runs in `jenkins` namespace as **ClusterIP**
- Multibranch indexing driven by **periodic scanning** (polling), not webhooks
- Images built/pushed using **Kaniko** in ephemeral Kubernetes agent pods

### Namespaces (recommended)
- `envoy-gateway-system` — Envoy Gateway controller
- `jenkins` — Jenkins controller + agent pods
- `recipe` — app workloads

---

## 3) Prerequisites

### Tools on your workstation
- `kubectl`
- `helm`
- `git`

Verify:
```bash
kubectl cluster-info
kubectl get nodes -o wide
helm version
```

Registry access (required for Kaniko):
- You need credentials to push images to your container registry.
- These credentials are stored in Jenkins Credentials and used to create a K8s secret for Kaniko.

---

## 4) Phase 1 Bootstrap (Manual)

### 4.1 Install Gateway API CRDs (one-time per cluster)
```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
kubectl get crd | rg gateway
```

Rollback (rare):
```bash
kubectl delete -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
```

### 4.2 Install Envoy Gateway controller
```bash
helm upgrade --install envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  -n envoy-gateway-system --create-namespace

kubectl -n envoy-gateway-system wait --for=condition=Available deploy/envoy-gateway --timeout=5m
kubectl -n envoy-gateway-system get deploy,po,svc
```

Rollback:
```bash
helm uninstall envoy-gateway -n envoy-gateway-system
```

### 4.3 Install Jenkins (private, no edge exposure)
Requirements for Phase 1 values:
- `gateway.enabled=false`
- `certManager.enabled=false`
- `dockerSocket.enabled=false`

Install (adjust values file path to match repo):
```bash
helm upgrade --install jenkins infra/helm/jenkins \
  -n jenkins --create-namespace \
  -f infra/helm/jenkins/values-staging.yaml \
  --set gateway.enabled=false \
  --set certManager.enabled=false \
  --set dockerSocket.enabled=false
```

Verify:
```bash
kubectl -n jenkins get deploy,po,svc
kubectl -n jenkins get pods -w
```

Rollback:
```bash
helm uninstall jenkins -n jenkins
```

---

## 5) Access Jenkins (Phase 1)

### 5.1 Port-forward Jenkins UI
```bash
kubectl -n jenkins port-forward svc/jenkins 8080:8080
```

Open in browser:
```
http://localhost:8080/jenkins/
```

### 5.2 Jenkins Location URL (Phase 1)
Set Jenkins URL to:
```
http://localhost:8080/jenkins/
```

Path:
Manage Jenkins → System → Jenkins Location

---

## 6) Jenkins Credentials (Phase 1)

### 6.1 GitHub PAT (for repo scanning)
Since we’re not using webhooks, Jenkins will scan branches periodically.

Create a GitHub PAT with minimum permissions needed to read the repo:
- For public repo: read-only is enough
- For private branches/repo: repo read permissions required

Add in Jenkins Credentials:
- Type: Username with password
- ID: `github-pat` (or match your Jenkinsfile expectation)

### 6.2 Registry credentials (for Kaniko push)
Add in Jenkins Credentials:
- ID: `docker-registry-creds` (recommended)
- Used by pipeline to create `kaniko-registry` secret in `jenkins` namespace

---

## 7) Multibranch Pipeline Setup (Phase 1)

### 7.1 Create Multibranch Job
Jenkins → New Item → Multibranch Pipeline

Branch source: GitHub  
Credentials: your GitHub PAT  
Repo: `gabeodame/food-app`

Behaviors:
- Discover branches
- Discover PRs (optional for Phase 1)

Triggering:
- Enable Periodic scan (recommended during practice): every 1–5 minutes

Phase 1 intentionally does NOT use webhooks.

---

## 8) Kaniko Build Requirements (Phase 1)

### 8.1 Secret created in cluster
The pipeline should create:
- `kaniko-registry` secret in namespace `jenkins`

Verify:
```bash
kubectl -n jenkins get secret kaniko-registry
```

### 8.2 Agent pods
During builds, you should see Jenkins agent pods spinning up in the `jenkins` namespace:
```bash
kubectl -n jenkins get pods -w
```

If agent pods fail:
- Check Jenkins Kubernetes plugin config
- Check RBAC for Jenkins service account
- Check registry secret contents/type

---

## 9) End-to-End Deployment Test (Phase 1)

### 9.1 Confirm no Ingress resources exist
```bash
kubectl get ingress -A
```

### 9.2 Trigger a staging pipeline run (poll-based)
Make a commit to `staging` (or whichever branch deploys staging in your Jenkinsfile):
```bash
git checkout staging
git commit --allow-empty -m "phase1: trigger staging pipeline"
git push origin staging
```

Wait for the Multibranch periodic scan to discover changes and start a build.

### 9.3 Watch pipeline
In Jenkins:
Multibranch job → staging branch → build should run:
- lint/tests
- Kaniko build + push
- deploy via Helm
- smoke test (Phase 1 targets internal access)

### 9.4 Validate Kubernetes rollout
(Adjust namespace/resource names to match your repo.)
```bash
kubectl -n recipe get deploy,po,svc
kubectl -n recipe rollout status deploy/<deployment-name>
kubectl -n recipe describe deploy/<deployment-name>
kubectl -n recipe logs deploy/<deployment-name> --tail=150
```

### 9.5 Validate service reachability (Phase 1)
Pick one method:

Option A: Port-forward app service
```bash
kubectl -n recipe port-forward svc/<service-name> 3000:3000
curl -I http://localhost:3000/
```

Option B: Port-forward Gateway service (exercise Gateway API locally)
```bash
kubectl -n envoy-gateway-system get svc
kubectl -n envoy-gateway-system port-forward svc/<envoy-service> 8081:80
curl -I http://localhost:8081/
```

Phase 1 does not require external DNS. You’re proving deploy correctness and routing behavior.

### 9.6 Negative test (feature branch must not deploy)
```bash
git checkout -b feature/no-deploy-test
git commit --allow-empty -m "phase1: feature branch build only"
git push origin feature/no-deploy-test
```

Expected:
- Build runs
- No Helm deploy executed

---

## 10) Branch Gating Expectations (Phase 1)

Recommended gating:
- feature/* and PRs: build/test only, no deploy
- staging: deploy staging
- main: optional (can be disabled in Phase 1)

---

## 11) Troubleshooting Cheatsheet (Phase 1)

Jenkins UI not reachable:
```bash
kubectl -n jenkins get svc,po
kubectl -n jenkins logs deploy/jenkins --tail=200
```

Multibranch not scanning:
- Confirm periodic scan is configured
- Check GitHub credentials in branch source config

Kaniko build fails:
Common causes:
- Registry credentials missing / wrong secret type
- Workspace not mounted into Kaniko container
- Dockerfile path incorrect
- Registry egress blocked

Verify:
```bash
kubectl -n jenkins get pods
kubectl -n jenkins logs <agent-pod> -c kaniko --tail=200
kubectl -n jenkins get secret kaniko-registry -o yaml
```

Deploy fails (RBAC):
If Helm/kubectl fail in pipeline:
- Jenkins SA lacks permission in target namespace

Check:
```bash
kubectl -n jenkins get sa
kubectl -n jenkins get role,rolebinding
kubectl -n recipe get role,rolebinding
```

---

## 12) Clean Teardown (Phase 1)

Remove app releases (adjust release name):
```bash
helm -n recipe uninstall <release-name>
```

Remove Jenkins:
```bash
helm -n jenkins uninstall jenkins
kubectl delete ns jenkins
```

Remove Envoy Gateway:
```bash
helm -n envoy-gateway-system uninstall envoy-gateway
kubectl delete ns envoy-gateway-system
```

Gateway API CRDs (optional last resort):
```bash
kubectl delete -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml
```

---

One key note: In Phase 1, smoke tests should not assume public FQDNs. They should target either:
- Port-forwarded local URL, or
- Cluster-internal service URL, or
- LAN-only NodePort.

If your current `scripts/ci/smoke-test.sh` still defaults to public DNS, change it now (Phase 1 assumes it doesn’t).

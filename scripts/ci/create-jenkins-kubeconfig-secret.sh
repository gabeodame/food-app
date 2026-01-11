#!/usr/bin/env bash
set -euo pipefail

namespace=${JENKINS_NAMESPACE:-jenkins}
secret_name=${JENKINS_KUBECONFIG_SECRET:-jenkins-kubeconfig}
kubeconfig_path=${KUBECONFIG:-}
ensure_rbac=${ENSURE_JENKINS_RBAC:-false}
target_namespace=${TARGET_NAMESPACE:-recipe}
service_account=${JENKINS_SERVICE_ACCOUNT:-jenkins-deployer}
generate_sa_kubeconfig=${GENERATE_SA_KUBECONFIG:-false}
sa_kubeconfig_out=${SA_KUBECONFIG_OUT:-/tmp/jenkins-sa.kubeconfig}
create_kubeconfig_secret=${CREATE_KUBECONFIG_SECRET:-true}

if [[ "${create_kubeconfig_secret}" == "true" && "${generate_sa_kubeconfig}" == "false" ]]; then
  if [[ -z "${kubeconfig_path}" ]]; then
    echo "KUBECONFIG is not set. Export it or pass an absolute path." >&2
    exit 1
  fi
fi

if [[ "${create_kubeconfig_secret}" == "true" && "${generate_sa_kubeconfig}" == "false" ]]; then
  if [[ "${kubeconfig_path}" != /* ]]; then
    echo "KUBECONFIG must be an absolute path: ${kubeconfig_path}" >&2
    exit 1
  fi
fi

if [[ "${create_kubeconfig_secret}" == "true" && "${generate_sa_kubeconfig}" == "false" ]]; then
  if [[ ! -f "${kubeconfig_path}" ]]; then
    echo "KUBECONFIG file not found: ${kubeconfig_path}" >&2
    exit 1
  fi
fi

get_perms() {
  if stat -f "%Lp" "${kubeconfig_path}" >/dev/null 2>&1; then
    stat -f "%Lp" "${kubeconfig_path}"
  else
    stat -c "%a" "${kubeconfig_path}"
  fi
}

if [[ "${create_kubeconfig_secret}" == "true" && "${generate_sa_kubeconfig}" == "false" ]]; then
  perms=$(get_perms)
  if [[ "${perms}" -gt 600 ]]; then
    echo "Tightening kubeconfig permissions (current: ${perms})" >&2
    chmod 600 "${kubeconfig_path}"
  fi
fi

kubectl get namespace "${namespace}" >/dev/null 2>&1 || kubectl create namespace "${namespace}"

if [[ "${ensure_rbac}" == "true" ]]; then
  kubectl -n "${namespace}" get serviceaccount "${service_account}" >/dev/null 2>&1 || \
    kubectl -n "${namespace}" create serviceaccount "${service_account}"

  kubectl -n "${target_namespace}" apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ${service_account}-role
  namespace: ${target_namespace}
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
      - networkpolicies
      - persistentvolumeclaims
      - gateways
      - httproutes
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
EOF

  kubectl -n "${target_namespace}" apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: ${service_account}-binding
  namespace: ${target_namespace}
subjects:
  - kind: ServiceAccount
    name: ${service_account}
    namespace: ${namespace}
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: ${service_account}-role
EOF
fi

if [[ "${generate_sa_kubeconfig}" == "true" ]]; then
  if [[ "${ensure_rbac}" != "true" ]]; then
    echo "GENERATE_SA_KUBECONFIG=true requires ENSURE_JENKINS_RBAC=true" >&2
    exit 1
  fi

  server=$(kubectl config view --raw -o jsonpath='{.clusters[0].cluster.server}')
  ca_data=$(kubectl config view --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')
  token=$(kubectl -n "${namespace}" create token "${service_account}")

  cat > "${sa_kubeconfig_out}" <<EOF
apiVersion: v1
kind: Config
clusters:
- name: jenkins-target
  cluster:
    certificate-authority-data: ${ca_data}
    server: ${server}
contexts:
- name: jenkins-target
  context:
    cluster: jenkins-target
    namespace: ${target_namespace}
    user: ${service_account}
current-context: jenkins-target
users:
- name: ${service_account}
  user:
    token: ${token}
EOF

  kubeconfig_path="${sa_kubeconfig_out}"
fi

if [[ "${create_kubeconfig_secret}" != "true" ]]; then
  echo "Skipping kubeconfig secret creation (CREATE_KUBECONFIG_SECRET=false)"
  exit 0
fi

kubectl -n "${namespace}" create secret generic "${secret_name}" \
  --from-file=config="${kubeconfig_path}" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "kubeconfig secret applied: ${namespace}/${secret_name}"

resource "helm_release" "prometheus" {
  count            = var.enable_prometheus ? 1 : 0
  name             = "kube-prometheus-stack"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  version          = var.prometheus_chart_version
  namespace        = var.namespace
  create_namespace = true
}

resource "helm_release" "loki" {
  count            = var.enable_loki ? 1 : 0
  name             = "loki-stack"
  repository       = "https://grafana.github.io/helm-charts"
  chart            = "loki-stack"
  version          = var.loki_chart_version
  namespace        = var.namespace
  create_namespace = true
}

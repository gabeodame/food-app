variable "namespace" {
  description = "Namespace for observability stack"
  type        = string
  default     = "observability"
}

variable "enable_prometheus" {
  description = "Enable kube-prometheus-stack"
  type        = bool
  default     = true
}

variable "enable_loki" {
  description = "Enable Loki stack"
  type        = bool
  default     = true
}

variable "prometheus_chart_version" {
  description = "kube-prometheus-stack chart version"
  type        = string
  default     = "56.6.2"
}

variable "loki_chart_version" {
  description = "loki-stack chart version"
  type        = string
  default     = "2.10.2"
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for the cluster"
  type        = list(string)
}

variable "node_group_min_size" {
  description = "Minimum node count"
  type        = number
  default     = 1
}

variable "node_group_max_size" {
  description = "Maximum node count"
  type        = number
  default     = 3
}

variable "node_group_desired_size" {
  description = "Desired node count"
  type        = number
  default     = 2
}

variable "node_instance_types" {
  description = "EC2 instance types"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}

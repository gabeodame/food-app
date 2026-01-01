output "endpoint" {
  description = "RDS endpoint"
  value       = module.rds.db_instance_endpoint
}

output "port" {
  description = "RDS port"
  value       = module.rds.db_instance_port
}

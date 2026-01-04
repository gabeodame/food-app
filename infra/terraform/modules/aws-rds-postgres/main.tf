module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier     = var.identifier
  engine         = "postgres"
  engine_version = var.engine_version

  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage

  db_name  = var.db_name
  username = var.username
  password = var.password

  storage_encrypted       = var.storage_encrypted
  kms_key_id              = var.kms_key_id
  backup_retention_period = var.backup_retention_period

  create_db_subnet_group = true
  subnet_ids             = var.subnet_ids

  vpc_security_group_ids = var.vpc_security_group_ids

  publicly_accessible = var.publicly_accessible
  skip_final_snapshot = false
  deletion_protection = var.deletion_protection

  tags = var.tags
}

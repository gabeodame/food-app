locals {
  default_tags = merge(
    {
      Environment = var.environment
      Project     = "food-app"
    },
    var.tags
  )
}

module "vpc" {
  source = "../../modules/aws-vpc"

  name                 = "${var.cluster_name}-vpc"
  cidr_block           = var.vpc_cidr
  azs                  = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs

  tags = local.default_tags
}

module "eks" {
  source = "../../modules/aws-eks"

  cluster_name = var.cluster_name
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.private_subnet_ids

  enable_irsa                     = var.eks_enable_irsa
  cluster_endpoint_private_access = var.eks_endpoint_private_access
  cluster_endpoint_public_access  = var.eks_endpoint_public_access

  tags = local.default_tags
}

resource "aws_security_group" "rds" {
  name        = "${var.cluster_name}-rds"
  description = "RDS access from EKS"
  vpc_id      = module.vpc.vpc_id

  tags = local.default_tags
}

resource "aws_security_group_rule" "rds_ingress" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds.id
  source_security_group_id = module.eks.cluster_security_group_id
}

module "rds_postgres" {
  source = "../../modules/aws-rds-postgres"

  identifier             = var.db_identifier
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  subnet_ids             = module.vpc.private_subnet_ids
  vpc_security_group_ids = [aws_security_group.rds.id]

  storage_encrypted       = var.rds_storage_encrypted
  kms_key_id              = var.rds_kms_key_id
  backup_retention_period = var.rds_backup_retention_period
  publicly_accessible     = var.rds_publicly_accessible
  deletion_protection     = var.rds_deletion_protection

  tags = local.default_tags
}

module "observability" {
  source = "../../modules/observability"

  tags = local.default_tags
}

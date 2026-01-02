# Terraform

This directory contains reusable Terraform modules and per-environment stacks.

## Layout

- `modules/` reusable infrastructure modules (VPC, EKS, RDS, observability)
- `envs/` environment stacks (`dev`, `staging`, `prod`)

## Remote state

Each environment expects an S3 backend with DynamoDB locks. Provide backend config with `backend.hcl`:

```bash
terraform -chdir=infra/terraform/envs/dev init -backend-config=backend.hcl
```

Use the `.example` files as a starting point:
- `infra/terraform/envs/dev/backend.hcl.example`
- `infra/terraform/envs/staging/backend.hcl.example`
- `infra/terraform/envs/prod/backend.hcl.example`

## Variables

Create a `terraform.tfvars` per environment (see `terraform.tfvars.example`). Keep secrets out of the repo and pass them via:

```bash
export TF_VAR_db_password="..."
```

## Validate/Plan

```bash
terraform -chdir=infra/terraform/envs/dev fmt -recursive
terraform -chdir=infra/terraform/envs/dev validate
terraform -chdir=infra/terraform/envs/dev plan
```

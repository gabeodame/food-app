# Secret Examples

These files show the expected shape of Kubernetes Secrets referenced by the Helm chart.
Replace all values before applying in any environment.

## Service ↔ Secret Mapping

- `recipe-client` -> `recipe-secret` (`docs/examples/recipe-client-secret.yaml`)
- `auth-service` -> `mongo-secret`, `rabbitmq-secret`, `jwt-secret`
- `recipe` -> `recipe-postgres-secret`, `rabbitmq-secret`, `jwt-secret`
- `ingredient` -> `ingredient-postgres-secret`, `rabbitmq-secret`, `jwt-secret`
- `userprofile` -> `userprofile-postgres-secret`, `rabbitmq-secret`, `s3-secret`
- `uploads-service` -> `s3-secret`
- `rabbitmq` -> `rabbitmq-secret`

## Example Files

- `docs/examples/jwt-secret.yaml`
- `docs/examples/mongo-secret.yaml`
- `docs/examples/rabbitmq-secret.yaml`
- `docs/examples/recipe-client-secret.yaml`
- `docs/examples/recipe-postgres-secret.yaml`
- `docs/examples/ingredient-postgres-secret.yaml`
- `docs/examples/userprofile-postgres-secret.yaml`
- `docs/examples/s3-secret.yaml`

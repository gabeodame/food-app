# Hardening Checklist and Quick Wins (Public Demo Safe)

This checklist focuses on low-risk, high-signal hardening steps suitable for a public recruiter-facing demo.

## A) Demo-Safe Security Controls

- **Rate limiting**: Apply per-IP limits at the gateway and per-service for write endpoints.
- **Pagination caps**: Enforce a max page size (e.g., 50-100) on public list endpoints.
- **CORS rules**: Restrict allowed origins to known demo domains; avoid `*` for authenticated endpoints.
- **Public GET only**: Keep read-only endpoints public; require auth for all creates/updates/deletes.
- **Avoid ID enumeration**: Use UUIDs or opaque IDs and enforce ownership checks on reads.
- **Basic bot protection**: Add request throttling on search and auth endpoints; consider CAPTCHA only for signup.

## B) Kubernetes Hardening (CKA-Style Basics)

- **Namespaces**: Separate `dev`, `staging`, `prod` namespaces to isolate blast radius.
- **Resource requests/limits**: Define CPU/memory in Helm values for all deployments and statefulsets.
- **Liveness/readiness probes**: Configure HTTP or TCP probes per service in Helm values.
- **PodDisruptionBudgets**: Add PDBs for API services and RabbitMQ where availability matters.
- **NetworkPolicy baseline**: Start with deny-all, then allow only required service-to-service traffic.
- **Non-root containers**: Keep non-root execution in Dockerfiles and k8s security contexts.
- **Secrets**: Use Kubernetes Secrets or external secret managers; keep secrets out of git.
- **imagePullPolicy**: Use `IfNotPresent` for dev, `Always` for prod to ensure fresh pulls.

## C) Observability Quick Wins

- **Structured logs**: Emit JSON logs with `requestId`, `userId`, `service`, and `latencyMs`.
- **Health endpoints**: Add `/healthz` or `/readyz` in each service for probes.
- **Metrics**: Add HTTP request rate/error/latency metrics as a next step.
- **Dashboards**: Track p95 latency, 5xx rate, queue depth (RabbitMQ), and DB connections.

## D) Operational Runbook

### Golden Commands (Validate a Deploy in < 2 Minutes)

```bash
kubectl get pods -n <ns>
kubectl get svc -n <ns>
kubectl get jobs -n <ns>
kubectl get gateway -n <ns>
kubectl logs -n <ns> deploy/<service> --tail=100
```

### Common Failure Patterns and Diagnosis

- **ImagePullBackOff**: Check image tag, registry access, and `imagePullSecrets`.
- **CrashLoopBackOff**: Review container logs; confirm required env vars and DB/RabbitMQ reachability.
- **Migration Job Failed**: Inspect Job logs; verify DB is reachable and schema is compatible.
- **Gateway 404/502**: Validate GatewayClass, listener hostnames, HTTPRoute parentRefs, and service selectors.
- **DB connectivity**: Confirm secrets, network policies, and that DB pods are Ready.

## Related ADRs

- `docs/adr/0002-authn-authz-strategy-public-read-write-protected.md`
- `docs/adr/0003-database-migrations-via-helm-job-hooks.md`
- `docs/adr/0005-image-versioning-git-sha-tags.md`

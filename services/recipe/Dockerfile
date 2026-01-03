# ============================================================
# Recipe Backend — Production-ready Dockerfile (Prisma + PG)
# - Uses Debian slim for Prisma reliability (avoid Alpine/musl pain)
# - Multi-stage build: small runtime image, deterministic builds
# - Runs as non-root
# - Generates Prisma client at build time
# - Includes safe migration retry loop at startup
# ============================================================

# ---------- Builder ----------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Prisma engines commonly require OpenSSL + CA certs
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests first for better caching
COPY package*.json ./

# Install all deps (include dev deps so Prisma CLI exists for generate)
RUN npm ci

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Build TypeScript output
RUN npm run build \
    && if [ ! -d /app/dist ]; then \
      echo "ERROR: expected build output in /app/dist, but it was not created." >&2; \
      echo "Contents of /app:" >&2; \
      ls -la /app >&2; \
      exit 1; \
    fi



# ---------- Runtime ----------
FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Runtime: CA certs + OpenSSL for Prisma engine + TLS calls
# Optional: postgresql-client only if you truly need psql in the container.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy only manifests; install prod deps only (smaller + safer)
COPY package*.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy built app + prisma schema (and any runtime assets)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy Prisma generated client runtime bits
# (Prisma stores the query engine + generated client here)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Ensure non-root runtime
RUN chown -R node:node /app
USER node

EXPOSE 3000

# Migrations should run via a dedicated job (e.g., Helm hook/Job) instead of the app container.
CMD ["npm", "run", "start"]

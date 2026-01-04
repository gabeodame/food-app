import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL || "postgresql://localhost:5432/recipe";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "node dist/prisma/seed.js",
  },
});

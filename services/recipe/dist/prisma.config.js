"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/recipe";
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema.prisma",
    datasource: {
        url: databaseUrl,
    },
    migrations: {
        seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
});

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["reflect-metadata"], // ✅ Ensures decorators work
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "^@gogittix/common$": "<rootDir>/__mock__/@gogittix/common.ts", // ✅ Ensures Jest maps @gogittix/common correctly
    "^@/lib/prisma$": "<rootDir>/__mock__/prisma.ts", // ✅ Ensures Prisma is mocked correctly
  },
  testMatch: ["**/__test__/**/*.test.ts"], // ✅ Ensures Jest finds your test files
  collectCoverage: true, // ✅ Enables test coverage reports
};

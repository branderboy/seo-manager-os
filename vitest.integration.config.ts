/// Integration and authorization tests. These need a migrated, seeded database and a running
/// application at TEST_BASE_URL. They run serially because they share tenant fixtures.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/integration/**/*.{test,spec}.ts"],
    environment: "node",
    globals: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
    reporters: ["default"],
    passWithNoTests: false,
  },
});

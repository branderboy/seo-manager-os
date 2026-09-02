// Flat config. Next.js 16 removed `next lint`, so ESLint runs directly and
// eslint-config-next is consumed as flat config rather than through .eslintrc.
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "node_modules/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  ...nextCoreWebVitals,
]);

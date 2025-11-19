import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/tests/setup.tsx"],
    globals: true,
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/e2e/**", // Playwright E2E tests
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,playwright}.config.*",
      // Exclude hooks tests - these require complex DOM mocking, covered by E2E tests
      "**/tests/hooks/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/lib/**/*.{ts,tsx}",
        "src/constants/**/*.{ts,tsx}",
        "src/components/ui/complex/phone-input.tsx",
        "src/app/**/(_schemas|_constants)/**/*.{ts,tsx}",
        "src/server/api/modules/**/**.{schema,service,controller}.{ts,tsx}",
        "src/server/db/postgres-error.ts",
      ],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/e2e/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/tests/**",
        "src/lib/svg.tsx",
        "src/constants/chat-bot-conversation.ts",
        "src/constants/default-map-coordinates.ts",
        "src/utils/**",
        "src/server/api/modules/**/**.router.{ts,tsx}", // Routers are tRPC boilerplate
        "src/server/api/modules/location/location.schema.ts", // Empty unused file
      ],
      all: true,
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});

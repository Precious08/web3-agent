import { defineConfig } from "@playwright/test";

// Fallback-mode walkthrough (no API): proves pages render, navigate and persist
// locally. Live-API e2e joins when staging lands (Phase 9).
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "pnpm exec next dev --port 3100",
    port: 3100,
    reuseExistingServer: true,
  },
});

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    browserName: "chromium",
    headless: true,
  },
  webServer: {
    command: "node tests/fixture/server.mjs",
    port: 4173,
    reuseExistingServer: false,
  },
});

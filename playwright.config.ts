import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E tests
 * Web app runs on port 3000, Admin app runs on port 3001
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Web app tests
    {
      name: "web-chromium",
      testDir: "./e2e/web",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
      },
    },
    {
      name: "web-firefox",
      testDir: "./e2e/web",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "http://localhost:3000",
      },
    },
    {
      name: "web-webkit",
      testDir: "./e2e/web",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "http://localhost:3000",
      },
    },

    // Admin app tests
    {
      name: "admin-chromium",
      testDir: "./e2e/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
      },
    },

    // Mobile tests
    {
      name: "mobile-chrome",
      testDir: "./e2e/web",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3000",
      },
    },
    {
      name: "mobile-safari",
      testDir: "./e2e/web",
      use: {
        ...devices["iPhone 12"],
        baseURL: "http://localhost:3000",
      },
    },
  ],

  // Local dev server configuration
  webServer: [
    {
      command: "yarn workspace @repo/web dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "yarn workspace @repo/admin dev",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
  testDir: "tests/specs",
  reporter: [
    ["list"],
    [
      "html",
      { open: "never", outputFolder: "html-report", outputFile: "report.html" },
    ],
  ],
  retries: 1,
  globalTimeout: 60000,
  timeout: 10000,
  expect: {
    timeout: 2000,
  },

  use: {
    video: "retry-with-video",
    trace: "retry-with-trace",
    screenshot: "only-on-failure",

    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },

    baseURL: "http://localhost:5173",

    testIdAttribute: "id",
  },

  projects: [
    {
      name: "chrome-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox-desktop",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "safari-desktop",
      use: { ...devices["Desktop Safari"] },
    },
    // mobile emulation
    {
      name: "chrome-mobile",
      use: { ...devices["Galaxy S9+"] },
    },
    {
      name: "safari-mobile",
      use: { ...devices["iPhone 14 Pro"] },
    },
    {
      name: "firefox-mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],

  webServer: [
    // frontend
    {
      command: "npm run dev",
      // url: "http://localhost",
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
      stdout: "pipe",
    },
    // backend
    {
      command: "cd ../backend && npm run dev",
      // url: "http://localhost",
      port: 4000,
      reuseExistingServer: !process.env.CI,
      timeout: 10000,
      stdout: "pipe",
    },
  ],
});

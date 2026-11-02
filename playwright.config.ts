import { defineConfig, devices } from "@playwright/test";

// Customer checks against the static export in out/ (run `pnpm build` first).
// Four screen sizes in Chrome, plus an iPhone in Safari's engine (`npx playwright install webkit` once).
// Set PW_CHROMIUM_PATH if Chromium isn't found; set BASE_URL to test a deployed copy instead.
const PORT = 3411;
const chromiumPath = process.env.PW_CHROMIUM_PATH;
const launchOptions = chromiumPath ? { executablePath: chromiumPath } : {};
const remote = process.env.BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: remote ?? `http://127.0.0.1:${PORT}` },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, launchOptions } },
    { name: "laptop", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 }, launchOptions } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, launchOptions } },
    { name: "phone", use: { ...devices["Pixel 7"], launchOptions } },
    { name: "iphone", use: { ...devices["iPhone 15"] } },
  ],
  webServer: remote
    ? undefined
    : { command: `node tests/serve.mjs ${PORT}`, url: `http://127.0.0.1:${PORT}`, reuseExistingServer: true },
});

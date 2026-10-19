import { defineConfig } from '@playwright/test';

// Roda contra o build (`npm run build` antes), servido por scripts/serve-dist.mjs. CHROME_BIN permite usar um
// Chromium já instalado em vez de baixar o da versão do Playwright.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  workers: 2, // a máquina de desenvolvimento tem 7 GB; mais workers não compensam
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321/portflio/',
    launchOptions: process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {},
  },
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: 'http://localhost:4321/portflio/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

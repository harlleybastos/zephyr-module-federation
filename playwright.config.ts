import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'pnpm --filter zephyr-mf-host dev',
    url: 'http://localhost:3000',
    env: { ZE_DISABLED: 'true' }, // local check only, never deploys
    reuseExistingServer: false,
  },
});

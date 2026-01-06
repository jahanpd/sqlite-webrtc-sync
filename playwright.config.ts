import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: {
    headless: false,
    baseURL: 'http://localhost:3000',
    launchOptions: {
      args: [
        // WebRTC flags for local testing
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
        // Allow WebRTC to work locally
        '--disable-web-security',
        '--allow-running-insecure-content',
      ],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});

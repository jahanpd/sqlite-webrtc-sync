import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: {
    headless: true,
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
    // Default tests using the static server (port 3001)
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        baseURL: 'http://localhost:3001',
      },
      testIgnore: ['**/vite.spec.ts'],
    },
    // Vite dev server tests (port 3002)
    {
      name: 'vite-dev',
      use: { 
        browserName: 'chromium',
        baseURL: 'http://localhost:3002',
      },
      testMatch: '**/vite.spec.ts',
    },
    // Vite preview/production tests (port 3003)
    {
      name: 'vite-preview',
      use: { 
        browserName: 'chromium',
        baseURL: 'http://localhost:3003',
      },
      testMatch: '**/vite.spec.ts',
    },
  ],
  webServer: [
    // Static server for regular tests
    {
      command: 'PORT=3001 node server.mjs',
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    // Vite dev server
    {
      command: 'cd test-vite && npm run dev',
      port: 3002,
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    // Vite preview server (production build)
    {
      command: 'cd test-vite && npm run build && npm run preview',
      port: 3003,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});

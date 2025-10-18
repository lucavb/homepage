import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:4321';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { open: 'never' }], ['list'], ...(process.env.CI ? [['github' as const]] : [])],
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                userAgent: `${devices['Desktop Chrome'].userAgent} Playwright-Test`,
            },
        },

        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                userAgent: `${devices['Desktop Firefox'].userAgent} Playwright-Test`,
            },
        },

        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                userAgent: `${devices['Desktop Safari'].userAgent} Playwright-Test`,
            },
        },
    ],

    webServer: process.env.CI
        ? undefined
        : {
              command: 'npm run preview',
              port: 4321,
              reuseExistingServer: true,
              timeout: 120_000,
          },
});

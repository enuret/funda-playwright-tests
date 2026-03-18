import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /// limited workers to 3 not to trigger bot detection
  workers: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //headless: false, // had to keep it to avoid being recognized as a spammer
    baseURL: 'https://www.funda.nl/',
    extraHTTPHeaders: {
      'User-Agent': process.env.FUNDA_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
    },
    // data state used for all tests except GDPR
    // it includes GDPR consent and passing bot captcha
    // therefore it needs to be generated manually
    storageState: 'data/state.json',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // had to add it to limit network requests
    // and stabilize tests, it works more stable than fixtures
    launchOptions: {
            args: [
                '--host-rules=MAP securepubads.g.doubleclick.net 127.0.0.1, MAP googlesyndication.com 127.0.0.1, MAP pubmatic.com 127.0.0.1'
            ]
        }
  },

  projects: [
    // wide screen tests (run all tests)
    {
      name: 'widescreen',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 }}
    },

    //only run for filters, because only filters are affected
    {
      name: 'laptop',
      testMatch: /.*filter.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 }}
    },
  ],

});



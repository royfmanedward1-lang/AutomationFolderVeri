// @ts-check
const { devices } = require("@playwright/test");

const config = {
  testDir: "./tests",
  // Default timeout for tests - 30 seconds
  timeout: 30000,
  // Expect assertions timeout - 5 seconds
  expect: {
    timeout: 5000,
  },
  retries: 1,
  
  reporter: [
    ['html'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }]
  ],
  workers: 1,
  
  projects: [
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        headless: false,
        viewport: null,
        screenshot: "on",
        acceptDownloads: true,
        ignoreHttpsErrors: false,
        launchOptions: {
          args: [
            "--start-maximized",
            "--window-position=0,0",
            "--window-size=1920,1080",
          ],
        },
        permissions: ["geolocation"],
        video: {
          mode: "on",
          size: { width: 1920, height: 1080 }
        },
        trace: "on", // Options: "off", "on", "retain-on-failure", "on-first-retry"
      },
    },
  ],
};

module.exports = config;
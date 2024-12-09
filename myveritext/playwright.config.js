// @ts-check
const { devices } = require("@playwright/test");

const DEFAULT_TIMEOUT = 30 * 1000;

const config = {
  testDir: "./MV-tests",

  timeout: DEFAULT_TIMEOUT,
  expect: {
    timeout: 5000,
  },

  reporter: [["html"], ["allure-playwright"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  projects: [
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        headless: false,
        viewport: null,
        screenshot: "on",
        ignoreHttpsErrors: false,
        launchOptions: {
          args: [
            "--start-maximized", // Maximize browser window
            "--window-position=0,0", // Set position to top left corner
            "--window-size=1920,1080", // Set window size to Full HD, or adjust to your screen resolution
          ],
        },

        permissions: ["geolocation"],

        video: "on",

        trace: "on", //off,on

        //...devices["iPhone 14 Pro Max landscape"]
      },
    },
    //{

    //name:'webkitprofile',
    //use: {

    //browserName : 'webkit',
    //headless : false,
    //screenshot : 'on',
    //trace : 'on',//off,on
    //...devices['iPhone 11']
    //},

    //}
  ],
};

module.exports = config;

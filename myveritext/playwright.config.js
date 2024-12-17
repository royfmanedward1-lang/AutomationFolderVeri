// @ts-check
const { devices } = require("@playwright/test");

const DEFAULT_TIMEOUT = 120 * 1000;

const config = {
  testDir: "./tests",

  timeout: DEFAULT_TIMEOUT,
  globalTimeout: 30 * 60 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 1,
  

  reporter: [["html"], ["allure-playwright"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  workers: 1,

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
  //workers: 2, 
};

module.exports = config;

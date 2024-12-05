// @ts-check
const { devices } = require('@playwright/test');

const DEFAULT_TIMEOUT = 30 * 1000;


const config = {
  testDir: './MV-tests',
  
  timeout: DEFAULT_TIMEOUT,  
  expect: {
    timeout: 5000  
  },
  
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  projects: [
    {
      name:'chrome',
  use: {

    browserName : 'chromium',
    headless : false,
    //viewport : {width: 720, height: 720},
    screenshot : 'on',
    ignoreHttpsErrors: false,
    reporter: "allure-playwright",
    Permissions:["geolocation"],
    video: 'on',
    trace : 'on',//off,on
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
]


};

module.exports = config;

// @ts-check
const { devices } = require('@playwright/test');
//const { permission } = require('process');

const config = {
  testDir: './MV-tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
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

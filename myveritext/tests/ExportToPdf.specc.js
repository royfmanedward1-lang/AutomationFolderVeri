const { test, expect, chromium } = require('@playwright/test');
const { PageManager } = require('../managers/PageManager');
const testData = require('../utils/testData');
const path = require('path');

test.describe('Export Proceeding to PDF', () => {
  let browser, context, page, pageManager, pages;

  test.beforeAll(async () => {
    browser = await chromium.launch({ 
      //headless: true, 
      args: ['--disable-dev-shm-usage', '--kiosk-printing'] // Enable kiosk printing
    });

    context = await browser.newContext({
      acceptDownloads: true // Enable downloads
    });

    page = await context.newPage();
    pageManager = new PageManager(page);
    pages = {
      login: pageManager.getLoginPage(),
      calendar: pageManager.getCalendarPage(),
      jobDetails: pageManager.getJobDetailsPage()
    };
  });

  test('Login and proceeding to Calendar', async () => {
    await pages.login.goto();
    await pages.login.enterValidCredentials(
      testData.validCredentials.username,
      testData.validCredentials.password
    );
    await pages.login.clickLoginButton();
    await page.waitForURL(testData.urls.calendarPage);
    await pages.calendar.handleRetentionPolicyModal();
  });

  test('Export proceeding to PDF', async () => {
    test.setTimeout(60000); 
    await pages.calendar.clickEventInDay(3);
    await page.waitForTimeout(2000);
    await pages.jobDetails.clickOptionsButton();
    await pages.jobDetails.clickExportToPdf();
  
    // Simulate the print action
    await page.evaluate(() => {
      window.print(); 
    });
  
    console.log('Print completed. Check default save location.');
  });
  
  test.afterAll(async () => {
    if (context) await context.close();
    if (browser) await browser.close();
  });
});

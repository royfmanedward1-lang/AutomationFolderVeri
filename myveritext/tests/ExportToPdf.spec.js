const { test, expect, chromium } = require('@playwright/test');
const { PageManager } = require('../managers/PageManager');
const testData = require('../utils/testData');
const robot = require('robotjs');

test.describe('Export Proceeding to PDF', () => {
  let browser, context, page, pageManager, pages;

  test.beforeAll(async () => {
    browser = await chromium.launch({ 
      //headless: true, This will only be successfully executed on non-headless mode due to the behavior of the Export to PDF option
      args: ['--disable-dev-shm-usage', '--kiosk-printing']
    });

    context = await browser.newContext({
      acceptDownloads: true
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

    await page.waitForTimeout(2000);

    try {
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      const filename = `proceeding_${randomNumber}`;
      
      robot.typeString(filename);
      await page.waitForTimeout(500);
      robot.keyTap('enter');
      await page.waitForTimeout(3000);
      
      console.log(`PDF saved as: ${filename}.pdf in your Downloads folder`);
      
    } catch (error) {
      console.error('Failed to save PDF:', error);
      throw error;
    }
  });
  
  test.afterAll(async () => {
    if (context) await context.close();
    if (browser) await browser.close();
  });
});
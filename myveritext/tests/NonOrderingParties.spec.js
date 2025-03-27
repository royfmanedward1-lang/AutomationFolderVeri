const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { chromium } = require("playwright");

test.describe("Non Ordering Parties", () => {
  let browser;
  let context;
  let page;
  let pageManager;
  let loginPage;
  let calendarPage;
  let jobCardPage;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    pageManager = new PageManager(page);

    // Initialize page objects
    loginPage = pageManager.getLoginPage();
    calendarPage = pageManager.getCalendarPage();
    jobCardPage = pageManager.getJobCardPage();

    await test.step("Given the user logs to MyVeritext", async () => {
      // Navigate to the Login Page
      await loginPage.goto();

      await loginPage.enterValidCredentials(
        testData.nonOrderingPartiers.username,
        testData.nonOrderingPartiers.password
      );
      await loginPage.clickLoginButton();

      await page.waitForURL(testData.urls.calendarPage);
    });

    await test.step("And the user handle the Retention policy", async () => {
      await calendarPage.handleRetentionPolicyModal();
    });
  });

  test("Validate user cannot confirm a job", async () => {
    await test.step("Click on a future job", async () => {
      await calendarPage.clickMonthView();
      await calendarPage.clickFutureJob();
    });

    await test.step("Validate user cannot confirm a job", async () => {
      await jobCardPage.clickOptions();
      await jobCardPage.verifyEditScheduleIsDisable();
    });
  });

  test("Validate user cannot cancel a job", async () => {
    await test.step("Click on a future job", async () => {
      await calendarPage.clickMonthView();
      await calendarPage.clickFutureJob();
    });

    await test.step("Validate user cannot cancel a job", async () => {
      await jobCardPage.clickOptions();
      await jobCardPage.verifyCancelScheduleIsDisable();
    });
  });
  
  test("Validate user cannot edit a job", async () => {
    await test.step("Click on a future job", async () => {
      await calendarPage.clickMonthView();
      await calendarPage.clickFutureJob();
    });

    await test.step("Validate user cannot edit a job", async () => {
      await jobCardPage.clickOptions();
      await jobCardPage.verifyEditScheduleIsDisable();
    });
  });
   
});

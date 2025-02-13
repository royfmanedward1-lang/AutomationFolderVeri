const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { chromium } = require("playwright");

test.describe("Calendar Page Functionality", () => {
  let browser;
  let context;
  let page;
  let pageManager;
  let loginPage;
  let calendarPage;
  let snapJobPage;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    pageManager = new PageManager(page);

    // Initialize page objects
    loginPage = pageManager.getLoginPage();
    calendarPage = pageManager.getCalendarPage();
    snapJobPage  = pageManager.getSnapJobPage();

    await test.step("Given the user logs to MyVeritext", async () => {
      // Navigate to the Login Page
      await loginPage.goto();

      await loginPage.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
      await loginPage.clickLoginButton();

      await page.waitForURL(testData.urls.calendarPage);
    });

    await test.step("And the user handle the Retention policy", async () => {
      await calendarPage.handleRetentionPolicyModal();
    });
  });

  test("Successfully Snap Job Creation", async () => {
    await test.step("When upload a file", async () => {
      await snapJobPage.uploadFile();
    });

    await test.step("And fill out the required fields", async () => {
      await snapJobPage.clickVideoGrapher();
      await snapJobPage.fillNotes();
      await snapJobPage.clickSave();
    });

    await test.step("Then the snap job will be created", async () => {
      const successPopupMessage = await snapJobPage.getSuccessPopupMessage();
      expect(successPopupMessage).toContain("Successfully Schedule");

      const successMessage = await snapJobPage.getSuccessMessage();
      expect(successMessage).toContain("Success! You're All Set.");
    });
  });
});

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
  let proceedingSearchPage;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    pageManager = new PageManager(page);

    // Initialize page objects
    loginPage = pageManager.getLoginPage();
    calendarPage = pageManager.getCalendarPage();
    proceedingSearchPage  = pageManager.getProceedingSearchPage();

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

  test("Validate the past jobs with Confirmed status", async () => {
    await test.step("Access Proceeding Search page", async () => {
      await proceedingSearchPage.selectProceedingTab();
    });

    await test.step("And fill out the required fields", async () => {
      await proceedingSearchPage.selectFilter(testData.assignmentNumber.confirmed);
      const successPopupMessage = await proceedingSearchPage.getFilterMessage();
      expect(successPopupMessage).toContain("Your filters have been successfully applied");
    });

    await test.step("Then verify the menu", async () => {
      await proceedingSearchPage.clickOnKebabMenu();
      await proceedingSearchPage.validateMenus();
    });
  });

  test("Validate the past jobs with Cancelled status", async () => {
    await test.step("Access Proceeding Search page", async () => {
      await proceedingSearchPage.selectProceedingTab();
    });

    await test.step("And fill out the required fields", async () => {
      await proceedingSearchPage.selectFilter(testData.assignmentNumber.cancelled);
      const successPopupMessage = await proceedingSearchPage.getFilterMessage();
      expect(successPopupMessage).toContain("Your filters have been successfully applied");
    });

    await test.step("Then verify the menu", async () => {
      await proceedingSearchPage.clickOnKebabMenu();
      await proceedingSearchPage.validateMenus();
    });
  });
  
  test("Validate the past jobs with Files Ready status", async () => {
    await test.step("Access Proceeding Search page", async () => {
      await proceedingSearchPage.selectProceedingTab();
    });

    await test.step("And fill out the required fields", async () => {
      await proceedingSearchPage.selectFilter(testData.assignmentNumber.filesReady);
      const successPopupMessage = await proceedingSearchPage.getFilterMessage();
      expect(successPopupMessage).toContain("Your filters have been successfully applied");
    });

    await test.step("Then verify the menu", async () => {
      await proceedingSearchPage.clickOnKebabMenu();
      await proceedingSearchPage.validateMenus();
    });
  });
});

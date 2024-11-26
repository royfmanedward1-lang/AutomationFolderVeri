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

  test.beforeAll(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    pageManager = new PageManager(page);

    // Initialize page objects
    loginPage = pageManager.getLoginPage();
    calendarPage = pageManager.getCalendarPage();

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

  test("Verify Month view displays the current month", async () => {
    await test.step("When the user clicks the Month button", async () => {
      await calendarPage.clickMonthView();
    });

    await test.step("Then the Month View is displayed showing the current month", async () => {
      const displayedMonth = await calendarPage.getCurrentMonth();

      const formattedMonth = testData.getCurrentFormattedDate({
        month: "long",
        year: "numeric",
      });
      expect(displayedMonth).toContain(formattedMonth);
    });
  });

  test("Verify Week view displays the current week", async () => {
    await test.step("When the user clicks the Week button", async () => {
      await calendarPage.clickWeekView();
    });
    await test.step("Then the Week View is displayed showing the current week", async () => {
      const displayedWeek = await calendarPage.getCurrentWeek();

      const expectedWeek = testData.getCurrentWeekDates();

      expect(displayedWeek).toEqual(expect.arrayContaining(expectedWeek));
    });
  });

  test("Verify Day view displays the current day", async () => {
    await test.step("When the user clicks the Day button", async () => {
      await calendarPage.clickDayView();
    });

    await test.step("Then the Day View is displayed showing the current day and date", async () => {
      const displayedHeaderDate = await calendarPage.getCurrentHeaderDate();

      const formattedHeaderDate = testData.getCurrentFormattedDate({
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      expect(displayedHeaderDate).toContain(formattedHeaderDate);
    });
  });

  test("Verify Today button functionality in Month View", async () => {
    await test.step("Given the Today button is initially disabled", async () => {
      const isDisabled = await calendarPage.isTodayButtonDisabled();
      expect(isDisabled).toBe(true);
    });

    await test.step("When the user clicks the Month button", async () => {
        await calendarPage.clickMonthView();
      });

    await test.step("And the user navigates to another month", async () => {
      await calendarPage.navigateToPrevious();
    });

    await test.step("Then the Today button is enabled", async () => {
      const isDisabled = await calendarPage.isTodayButtonDisabled();
      expect(isDisabled).toBe(false);
    });

    await test.step("When the user clicks the Today button", async () => {
      await calendarPage.clickTodayButton();
    });

    await test.step("Then the Month View returns to the current month", async () => {
      const displayedMonth = await calendarPage.getCurrentMonth();
      const formattedMonth = testData.getCurrentFormattedDate({
        month: "long",
        year: "numeric",
      });
      expect(displayedMonth).toContain(formattedMonth);
    });
  });

  test("Verify Today button functionality in Week View", async () => {
    await test.step("Given the Today button is initially disabled", async () => {
      const isDisabled = await calendarPage.isTodayButtonDisabled();
      expect(isDisabled).toBe(true);
    });

    await test.step("When the user switches to Week View and navigates to another week", async () => {
      await calendarPage.clickWeekView();
      await calendarPage.navigateToPrevious();
    });

    await test.step("Then the Today button is enabled", async () => {
      const isDisabled = await calendarPage.isTodayButtonDisabled();
      expect(isDisabled).toBe(false);
    });

    await test.step("When the user clicks the Today button", async () => {
      await calendarPage.clickTodayButton();
    });

    await test.step("Then the Week View returns to the current week", async () => {
      const displayedWeek = await calendarPage.getCurrentWeek();
      const expectedWeek = testData.getCurrentWeekDates();
      expect(displayedWeek).toEqual(expect.arrayContaining(expectedWeek));
    });
  });

  test("Verify Today button functionality in Day View", async () => {
    await test.step("Given the Today button is initially disabled", async () => {
      const isDisabled = await calendarPage.isTodayButtonDisabled();
      expect(isDisabled).toBe(true);
    });

    await test.step("When the user switches to Day View and navigates to another day", async () => {
      await calendarPage.clickDayView();
      await calendarPage.navigateToNext();
    });

    await test.step("Then the Today button is enabled", async () => {
      const isDisabled = await calendarPage.isTodayButtonDisabled();
      expect(isDisabled).toBe(false);
    });

    await test.step("When the user clicks the Today button", async () => {
      await calendarPage.clickTodayButton();
    });

    await test.step("Then the Day View returns to the current day", async () => {
      const displayedHeaderDate = await calendarPage.getCurrentHeaderDate();
      const formattedHeaderDate = testData.getCurrentFormattedDate({
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      expect(displayedHeaderDate).toContain(formattedHeaderDate);
    });
  });
});

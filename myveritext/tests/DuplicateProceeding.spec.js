const { test, expect } = require('@playwright/test');
const { PageManager } = require('../managers/PageManager');
const testData = require('../utils/testData');
const { chromium } = require('playwright');

test.describe('Duplicate a Proceeding', () => {
  let browser, context, page, pageManager, pages;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();

    pageManager = new PageManager(page);
    pages = {
      login: pageManager.getLoginPage(),
      calendar: pageManager.getCalendarPage(),
      jobDetails: pageManager.getJobDetailsPage(),
      jobCard: pageManager.getJobCardPage(),
      dateAndTime2: pageManager.getDateAndTimePage2()
    };

    await test.step('Login and handle retention policy', async () => {
      await pages.login.goto();
      await pages.login.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
      await pages.login.clickLoginButton();
      await page.waitForURL(testData.urls.calendarPage);
      await pages.calendar.handleRetentionPolicyModal();
    });
  });

  test('Duplicate proceeding and add witness', async () => {
    await test.step('Select and duplicate proceeding', async () => {
      await pages.calendar.clickEventInDay(3);
      await pages.jobDetails.clickOptionsButton();
      await pages.jobDetails.clickDuplicate();
    });

    await test.step("Select a new date", async () => {
        let attempts = 0;
        let success = false;
  
        while (attempts < 5 && !success) {
          const randomDate = testData.dateAndTime.getDynamicDate(60); // Generate date 60 days ahead
  
          // Attempt to select the date
          success = await pages.dateAndTime2.selectNewDate(
            randomDate.day,
            randomDate.month,
            randomDate.year
          );
          attempts++;
        }
  
        await pages.jobCard.clickSaveSchedule();
      });
  
    await test.step("Select a new time", async () => {
        const randomTime = getRandomItem(testData.dateAndTime.timeOptions);
        const amPm = randomTime.includes("AM") ? "AM" : "PM";
  
        await pages.dateAndTime2.selectNewTime(randomTime.split(":")[0], amPm);
        await pages.jobCard.clickSaveSchedule();
        await pages.jobDetails.clickCreate();
      });

    await test.step('Verify success', async () => {
      const successMessage = await pages.jobCard.getSuccessMessage();
      expect(successMessage).toContain("Success! You're All Set.");
      
      const status = await pages.jobCard.verifyStatus();
      expect(status).toBe('SCHEDULED');
    });
  });

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  test.afterAll(async () => {
    await context.close();
    await browser.close();
  });
});
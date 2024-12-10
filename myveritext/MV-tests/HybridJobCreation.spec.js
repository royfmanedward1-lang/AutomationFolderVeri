const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { chromium } = require("playwright");

test.describe("Job Creation Hybrid Proceeding with Witness, Remote Participants, and Random Time Zone Selection", () => {
  let browser, context, page, pageManager;
  let loginPage, calendarPage, proceedingTypePage, caseNamePage, dateAndTimePage, 
      locationPage, proceedingServicesPage, participantsPage, jobCardPage;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();

    pageManager = new PageManager(page);
    loginPage = pageManager.getLoginPage();
    calendarPage = pageManager.getCalendarPage();
    proceedingTypePage = pageManager.getProceedingTypePage();
    caseNamePage = pageManager.getCaseNamePage();
    dateAndTimePage = pageManager.getDateAndTimePage();
    locationPage = pageManager.getLocationPage();
    proceedingServicesPage = pageManager.getProceedingServicesPage();
    participantsPage = pageManager.getParticipantsPage();
    jobCardPage = pageManager.getJobCardPage();
  });

  test.beforeEach(async () => {
    await test.step("Navigate to MyVeritext Page", async () => {
      await loginPage.goto();
    });

    await test.step("Log in with valid credentials", async () => {
      await loginPage.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
      await loginPage.clickLoginButton();
    });

    await test.step("Handle Retention Policy Modal", async () => {
      await page.waitForURL(testData.urls.calendarPage);
      await calendarPage.handleRetentionPolicyModal();
    });
  });

  const hybridJobCreationSteps = async () => {
    await test.step("When user clicks Schedule proceeding button", async () => {
      await calendarPage.clickScheduleProceeding();
    });

    await test.step("And selects a proceeding type", async () => {
      await proceedingTypePage.selectProceedingType(testData.jobDetails.proceedingTypes[0]);
    });

    await test.step("And fills the proceeding basics", async () => {
      await caseNamePage.selectCaseName();
      await caseNamePage.selectCountry(testData.jobDetails.country);
      await caseNamePage.clickNext();
    });

    await test.step("And selects the proceeding date and time", async () => {
      const randomTime = testData.dateAndTime.timeOptions[
        Math.floor(Math.random() * testData.dateAndTime.timeOptions.length)
      ];
      const randomTimeZoneAbbreviation = testData.dateAndTime.timeZoneOptions[
        Math.floor(Math.random() * testData.dateAndTime.timeZoneOptions.length)
      ];
      const timeZoneValue = testData.dateAndTime.getTimeZone(randomTimeZoneAbbreviation);
      
      await dateAndTimePage.selectDate();
      await dateAndTimePage.selectTime(randomTime);
      await dateAndTimePage.selectTimeZone(timeZoneValue);
      await dateAndTimePage.clickNext();
    });

    await test.step("And selects Hybrid proceeding", async () => {
      await locationPage.selectHybridOption();
      await locationPage.selectVeritextOfficesOption(testData.jobDetails.veritextOffices[0]);
      await locationPage.clickNext();
    });

    await test.step("And moves through services to participants page", async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Small delay to ensure stability
      
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.MuiTypography-root', { hasText: 'Who Is Attending This Proceeding?' }))
        .toBeVisible({ timeout: 1000 });
    });

    await test.step("And setup the participants", async () => {
      await participantsPage.adjustAttendees(
        testData.jobDetails.participants.attendees
      );
      await participantsPage.selectAttyLawyer(
        testData.jobDetails.participants.attyLawyer
      );
      await participantsPage.selectPointOfContact(
        testData.jobDetails.participants.pointOfContact
      );
      await participantsPage.selectSchedulingOffice(
        testData.jobDetails.participants.schedulingOffice
      );

      const randomWitness = testData.jobDetails.participants.witnesses[
        Math.floor(Math.random() * testData.jobDetails.participants.witnesses.length)
      ];
      await participantsPage.addWitness(randomWitness);
      await participantsPage.clickNext();
    });

    await test.step("And schedule the proceeding", async () => {
      await participantsPage.clickScheduleProceeding();
      await participantsPage.confirmScheduleProceeding();
    });

    await test.step("Then the Proceeding has been scheduled", async () => {
      const successMessage = await jobCardPage.getSuccessMessage();
      expect(successMessage).toContain(testData.jobCardDetails.successMessage);

      const jobNumber = await jobCardPage.getJobNumber();
      expect(jobNumber).toMatch(/^[0-9]{7}$/);

      const status = await jobCardPage.verifyStatus();
      expect(status).toBe(testData.jobCardDetails.status);
    });
  };

  test("Create a hybrid job with witness", async () => {
    await hybridJobCreationSteps();
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
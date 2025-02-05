const { test, expect } = require('@playwright/test');
const { PageManager } = require('../managers/PageManager');
const testData = require('../utils/testData');
const { generateRandomName, generateRandomEmail, generateRandomPhone } = require('../utils/dataGenerator');
const { chromium } = require('playwright');
const { JobCardPage } = require('../pageobjects/JobCardPage');

test.describe('Create New Proceeding with New Participants', () => {
  let browser, context, page, pageManager;
  let loginPage, calendarPage, proceedingTypePage, caseNamePage, dateAndTimePage,
      locationPage, proceedingServicesPage, participantsPage, jobCardPage;
  let newAttorneyData, newContactData;

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

    newAttorneyData = {
      firstName: generateRandomName(),
      lastName: generateRandomName(),
      email: generateRandomEmail(),
      phone: generateRandomPhone()
    };

    newContactData = {
      firstName: generateRandomName(),
      lastName: generateRandomName(),
      email: generateRandomEmail(),
      phone: generateRandomPhone()
    };

    await test.step('Navigate to MyVeritext Page', async () => {
      await loginPage.goto();
    });

    await test.step('Login with Valid Credentials', async () => {
      await loginPage.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
      await loginPage.clickLoginButton();
    });

    await test.step('Handle Retention Policy', async () => {
      await page.waitForURL(testData.urls.calendarPage);
      await calendarPage.handleRetentionPolicyModal();
    });
  });

  test('Schedule new proceeding with new attorney and contact', async () => {
    await test.step('When user clicks Schedule proceeding button', async () => {
      await calendarPage.clickScheduleProceeding();
    });

    await test.step('And selects a proceeding type', async () => {
      await proceedingTypePage.selectProceedingType(testData.jobDetails.proceedingTypes[0]);
    });

    await test.step('Fill proceeding basics', async () => {
      const caseData = {
        plaintiff: generateRandomName(),
        defendant: generateRandomName()
      };
      await caseNamePage.addCaseButton.click();
      await caseNamePage.plaintiffInput.fill(caseData.plaintiff);
      await caseNamePage.defendantInput.fill(caseData.defendant);
      await caseNamePage.submitCaseButton.click();
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

    await test.step("And selects a Remote Proceeding", async () => {
      await locationPage.selectRemoteOption();
    });

    await test.step("And selects multiple Proceeding Services", async () => {
      const randomServices = testData.proceedingServices.additionalServices
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      await proceedingServicesPage.selectRandomServices(randomServices);
      await proceedingServicesPage.clickNext();
    });

    await test.step('Add new attorney', async () => {
      await participantsPage.clickAddAttorneyButton();
      await participantsPage.fillContactForm({
        firstName: newAttorneyData.firstName,
        lastName: newAttorneyData.lastName,
        email: newAttorneyData.email,
        phone: newAttorneyData.phone
      }, true);  // true for attorney
      // the atty info has been filled
      await participantsPage.clickAddContactConfirmButton();
      // the atty info has been added
    });

    
    await test.step('Add new point of contact', async () => {
      // new contact started
      await participantsPage.selectPointOfContact("Ariana Grande");
      // Contact added and selected
    });

    await test.step('Add Scheduling Office', async () => {
      await participantsPage.selectSchedulingOffice("");
      // Scheduling Office added and selected
    });

    await test.step('Add witness', async () => {
      const randomWitness = testData.jobDetails.participants.witnesses[
        Math.floor(Math.random() * testData.jobDetails.participants.witnesses.length)
      ];
      await participantsPage.addWitness(randomWitness);
      // Witness added
    });

    await test.step('Complete proceeding scheduling', async () => {
      await participantsPage.clickNext();
      // Proceeding completed
    });

    await test.step('Add Remote participants', async () => {
      await participantsPage.addRemoteParticipants();
      // Remote participants added
      await participantsPage.clickScheduleProceeding();
      await participantsPage.confirmScheduleProceeding();
    });
   
    await test.step('Verify success and participants', async () => {
      const successMessage = await jobCardPage.getSuccessMessage();
      expect(successMessage).toContain("Success! You're All Set.");

      const status = await jobCardPage.verifyStatus();
      expect(status).toBe('SCHEDULED');
    });
  });

  test.afterAll(async () => {
    await context.close();
    await browser.close();
  });
});
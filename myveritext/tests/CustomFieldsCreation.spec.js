const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { generateRandomName } = require('../utils/dataGenerator');
const { chromium } = require("playwright");

test.describe("Job Creation Hybrid Proceeding with Custom Fields", () => {
  let browser, context, page, pageManager;
  let loginPage, calendarPage, proceedingTypePage, caseNamePage, dateAndTimePage, 
      locationPage, proceedingServicesPage, participantsPage, jobCardPage, customFieldsPage;

  test.beforeAll(async () => {
    // Manually create the browser, context, and page
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();

    // Initialize the PageManager and page objects
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
    customFieldsPage = pageManager.getCustomFieldsPage();

    await test.step("Navigate to MyVeritext Page", async () => {
      await loginPage.goto();
    });

    await test.step("Login with Valid Credentials", async () => {
      await loginPage.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
      await loginPage.clickLoginButton();
    });

    await test.step("Handle Retention Policy", async () => {
      await page.waitForTimeout(2000);
      await page.waitForURL(testData.urls.calendarPage);
      await calendarPage.handleRetentionPolicyModal();
    });
  });

  // Common steps for hybrid job creation
  const commonJobCreationSteps = async (locationOption) => {
    await test.step("When user clicks Schedule proceeding button", async () => {
      await calendarPage.clickScheduleProceeding();
    });

    await test.step("And selects a proceeding type", async () => {
      await proceedingTypePage.selectProceedingType(testData.jobDetails.proceedingTypes[0]);
    });

    await test.step("And fills the proceeding basics", async () => {
      await caseNamePage.selectCaseName();
      await caseNamePage.selectEntityForCustomFields();
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
      await dateAndTimePage.selectTime2();
      await dateAndTimePage.selectTimeZone2(timeZoneValue);
      await dateAndTimePage.clickNext();
    });

    await test.step("And selects In-Person proceeding", async () => {
      await locationPage.selectInPersonOption();
      await locationOption();
    });

  };

  // Common steps after location selection
  const completeJobCreation = async () => {
    await test.step("And selects proceeding services", async () => {
      await page.waitForLoadState('networkidle');
      
      // Select random services
      const randomServices = testData.proceedingServices.additionalServices
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
        
      await proceedingServicesPage.selectRandomServices(randomServices);
      await proceedingServicesPage.clickNext();

      // Create a custom field
      await customFieldsPage.fillClaimField(generateRandomName());
      await customFieldsPage.fillAdjusterField(generateRandomName());
      await customFieldsPage.fillPriorityDropdown();
      await customFieldsPage.fillMatterField(generateRandomName());
      await customFieldsPage.fillFileField(generateRandomName());
      await customFieldsPage.fillProbabilityField(generateRandomName());
      await customFieldsPage.clickNext();
      
      // Wait for the participants page to load
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('.MuiTypography-root:has-text("Who Is Attending This Proceeding?")', {
        state: 'visible',
        timeout: 5000
      });
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

  test("Create an in person job using Custom Fields", async () => {
    await commonJobCreationSteps(async () => {
      await locationPage.selectAddressBookOption();
      await locationPage.selectAddressBookOption2();
      await locationPage.clickNext();
    });
    await completeJobCreation();

    await test.step("Validate max characteres", async () => {
      await jobCardPage.clickEventManagementButton();
      await jobCardPage.clickEditEventDetails();
      await customFieldsPage.fillClaimField("Test input validation containing more than 50 characteres to be allowed to see the error message");
      await jobCardPage.clickSaveSchedule();

      const updateMessage = await jobCardPage.getSuccessAlert();
      expect(updateMessage).toContain(testData.jobCardDetails.updateJobMessage);

      const editCustomField = await jobCardPage.verifyEditCustomField();
      expect(editCustomField).toBe(testData.jobCardDetails.claimCustomFieldMax);
    });

    await test.step("Validate invalid inputs", async () => {
      await jobCardPage.clickEventManagementButton();
      await jobCardPage.clickEditEventDetails();
      await customFieldsPage.fillClaimField("!@#$%¨&*((& (*&$#%&((");
      await jobCardPage.clickSaveSchedule();

      const updateMessage = await jobCardPage.getSuccessAlert();
      expect(updateMessage).toContain(testData.jobCardDetails.updateJobMessage);
    });

    await test.step("Validate null input", async () => {
      await jobCardPage.clickEventManagementButton();
      await jobCardPage.clickEditEventDetails();
      await customFieldsPage.fillClaimField(" ");
      await jobCardPage.clickSaveSchedule();

      const updateMessage = await jobCardPage.getSuccessAlert();
      expect(updateMessage).toContain(testData.jobCardDetails.updateJobMessage);
    });
  });

  test("Create an in person job adding a witness", async () => {
    await commonJobCreationSteps(async () => {
      await locationPage.selectAddressBookOption();
      await locationPage.selectAddressBookOption2();
      await locationPage.clickNext();
    });
    await completeJobCreation();

    await test.step("Add a new witness", async () => {
      await jobCardPage.clickEventManagementButton();
      await jobCardPage.clickEditEventDetails();
      const randomWitness = testData.jobDetails.participants.witnesses[
        Math.floor(Math.random() * testData.jobDetails.participants.witnesses.length)
      ];
      await participantsPage.addWitness(randomWitness);

      await jobCardPage.clickSaveSchedule();

      const updateMessage = await jobCardPage.getSuccessAlert();
      expect(updateMessage).toContain(testData.jobCardDetails.updateJobMessage);
    });
  });
  
  test.afterAll(async () => {
    await browser.close();
  });
});
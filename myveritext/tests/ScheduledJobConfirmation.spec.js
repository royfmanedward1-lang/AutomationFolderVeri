const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { chromium } = require("playwright");

test.describe("Job Creation Hybrid Proceeding with Multiple Location Options", () => {
  let browser, context, page, pageManager;
  let loginPage, calendarPage, proceedingTypePage, caseNamePage, dateAndTimePage, 
      locationPage, proceedingServicesPage, participantsPage, jobCardPage;

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
      await page.waitForURL(testData.urls.calendarPage);
      await calendarPage.handleRetentionPolicyModal();
    });
  });

  // Common steps for hybrid job creation
  const commonJobCreationSteps = async () => {
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

    await test.step("And confirms the job", async () => {
      await jobCardPage.clickConfirmNow();
      await jobCardPage.confirmJob();
      
      const bannerText = await jobCardPage.getConfirmationBannerText();
      expect(bannerText).toContain("Job confirmed successfully");
      
      const isConfirmed = await jobCardPage.verifyConfirmedStatus();
      expect(isConfirmed).toBe(true);
    }); 
  };

  // Create a new function without the confirmation steps
  const createJobWithoutConfirmation = async () => {
    await test.step("And selects proceeding services", async () => {
      await page.waitForLoadState('networkidle');
      
      // Select random services
      const randomServices = testData.proceedingServices.additionalServices
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
        
      await proceedingServicesPage.selectRandomServices(randomServices);
      await proceedingServicesPage.clickNext();
      
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

  test("Create a hybrid job using Address Book for in-person location", async () => {
    await commonJobCreationSteps();
    
    await test.step("And selects an address from the address book", async () => {
      await locationPage.selectAddressBookOption(testData.jobDetails.address);
      await locationPage.clickNext();
    });

    await completeJobCreation(); 
  });

  test("Create a hybrid job using Veritext Offices for in-person location", async () => {
    await commonJobCreationSteps();
    
    await test.step("And selects a Veritext office", async () => {
      const randomOffice = testData.jobDetails.veritextOffices[
        Math.floor(Math.random() * testData.jobDetails.veritextOffices.length)
      ];
      await locationPage.selectVeritextOfficesOption(randomOffice);
    });

    await completeJobCreation(); 
  });

  test("Create a hybrid job using Find Me a Location for in-person location", async () => {
    await commonJobCreationSteps();
    
    await test.step("And enters location details", async () => {
      await locationPage.selectFindMeLocationOption();
      await locationPage.fillStateAndCity(
        testData.jobDetails.findLocationDetails.state,
        testData.jobDetails.findLocationDetails.city
      );
      await locationPage.clickNext();
    });

    await completeJobCreation();
  });

  test("Verify job remains scheduled when declining confirmation", async () => {
    await commonJobCreationSteps();
    
    await test.step("And selects an address from the address book", async () => {
      await locationPage.selectAddressBookOption(testData.jobDetails.address);
      await locationPage.clickNext();
    });
    await createJobWithoutConfirmation();
  
    await test.step("When declining job confirmation", async () => {
      await page.waitForLoadState('networkidle');
      await jobCardPage.clickConfirmNow();
      await jobCardPage.clickNoOnConfirm();
      
      const status = await jobCardPage.verifyScheduledStatus();
      expect(status.text).toBe('SCHEDULED');
      expect(status.isBlue).toBe(true);
      
      await jobCardPage.confirmNowButton.waitFor({ state: 'visible' });
      expect(await jobCardPage.confirmNowButton.isVisible()).toBe(true);
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
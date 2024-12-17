const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { chromium } = require("playwright");

test.describe("Job Remote Creation", () => {
  let browser, context, page, pageManager;
  let loginPage,
    calendarPage,
    proceedingTypePage,
    caseNamePage,
    dateAndTimePage,
    locationPage,
    proceedingServicesPage,
    participantsPage,
    addRemoteParticipantsPage,
    jobCardPage;

  test.beforeAll(async () => {
    // Manually create the browser, context, and page
    browser = await chromium.launch();
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
    addRemoteParticipantsPage = pageManager.getAddRemoteParticipantsPage();

    // Perform login
    await test.step("Enter Valid Credentials", async () => {
      await loginPage.goto();
      await loginPage.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
    });

    //Click the login button
    await test.step("When the user clicks the Log In button", async () => {
      await loginPage.clickLoginButton();
      await page.waitForURL(testData.urls.calendarPage);
    });

    await test.step("And the user handle the Retention policy", async () => {
      await calendarPage.handleRetentionPolicyModal();
    });
  });
  test("Create a Remote proceeding", async () => {
    await test.step("When the user clicks the Schedule Proceeding button", async () => {
      await calendarPage.clickScheduleProceeding();
    });

    await test.step("And selects a Proceeding Type", async () => {
      await proceedingTypePage.selectProceedingType(
        testData.jobDetails.proceedingTypes[
          Math.floor(Math.random() * testData.jobDetails.proceedingTypes.length)
        ]
      );
    });

    await test.step("And Fill in Proceeding Basics", async () => {
      await caseNamePage.selectCaseName();
      await caseNamePage.selectCountry(testData.jobDetails.country);
      await caseNamePage.clickNext();
    });

    await test.step("And Select Date and Time", async () => {
      const randomTime =
        testData.dateAndTime.timeOptions[
          Math.floor(Math.random() * testData.dateAndTime.timeOptions.length)
        ];

      const randomTimeZoneAbbreviation =
        testData.dateAndTime.timeZoneOptions[
          Math.floor(
            Math.random() * testData.dateAndTime.timeZoneOptions.length
          )
        ];

      const timeZoneValue = testData.dateAndTime.getTimeZone(
        randomTimeZoneAbbreviation
      );

      await dateAndTimePage.selectDate(); //TO DO, improve logic to select a random date.
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
    await test.step("And sets up participants", async () => {
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

      //Select a random witness
      const randomWitness =
        testData.jobDetails.participants.witnesses[
          Math.floor(
            Math.random() * testData.jobDetails.participants.witnesses.length
          )
        ];
      await participantsPage.addWitness(randomWitness);

      await participantsPage.clickNext();
    });

    await test.step("And adds remote participants", async () => {
      // Select random values for the participant
      const randomFirstName =
        testData.remoteParticipants.firstNames[
          Math.floor(
            Math.random() * testData.remoteParticipants.firstNames.length
          )
        ];
      const randomLastName =
        testData.remoteParticipants.lastNames[
          Math.floor(
            Math.random() * testData.remoteParticipants.lastNames.length
          )
        ];
      const randomRole =
        testData.remoteParticipants.roles[
          Math.floor(Math.random() * testData.remoteParticipants.roles.length)
        ];
      const randomEmail =
        testData.remoteParticipants.emails[
          Math.floor(Math.random() * testData.remoteParticipants.emails.length)
        ];

      await addRemoteParticipantsPage.addRemoteParticipant({
        firstName: randomFirstName,
        lastName: randomLastName,
        role: randomRole,
        email: randomEmail,
      });

      await addRemoteParticipantsPage.clickScheduleProceeding();
    });
    await test.step("And confirm Scheduling the proceeding", async () => {
      await participantsPage.confirmScheduleProceeding();
    });

    await test.step("Then the Proceeding has been scheduled", async () => {
      const successMessage = await jobCardPage.getSuccessMessage();
      expect(successMessage).toContain(testData.jobCardDetails.successMessage);

      const jobNumber = await jobCardPage.getJobNumber();
      expect(jobNumber).toMatch(/^[0-9]{7}$/);

      const status = await jobCardPage.verifyStatus();
      expect(status).toContain(testData.jobCardDetails.status);
    });
  });
});

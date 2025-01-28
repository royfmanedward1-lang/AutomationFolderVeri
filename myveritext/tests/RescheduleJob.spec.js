const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { chromium } = require("playwright");

test.describe("Rescheduling a Proceeding", () => {
  let browser, context, page, pageManager, pages;

  test.beforeAll(async () => {
    await test.step("Launch browser and initialize pages", async () => {
      browser = await chromium.launch();
      context = await browser.newContext();
      page = await context.newPage();

      // Initialize PageManager and page objects
      pageManager = new PageManager(page);
      pages = {
        login: pageManager.getLoginPage(),
        calendar: pageManager.getCalendarPage(),
        proceedingType: pageManager.getProceedingTypePage(),
        caseName: pageManager.getCaseNamePage(),
        dateAndTime2: pageManager.getDateAndTimePage2(),
        location: pageManager.getLocationPage(),
        services: pageManager.getProceedingServicesPage(),
        participants: pageManager.getParticipantsPage(),
        jobCard: pageManager.getJobCardPage(),
        addRemoteParticipants: pageManager.getAddRemoteParticipantsPage(),
      };
    });

    await test.step("Perform login with valid credentials", async () => {
      await pages.login.goto();
      await pages.login.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
      await pages.login.clickLoginButton();
      await page.waitForURL(testData.urls.calendarPage);
    });

    await test.step("Handle Retention Policy modal", async () => {
      await pages.calendar.handleRetentionPolicyModal();
    });

    await test.step("Click Schedule Proceeding and select Proceeding Type", async () => {
      await pages.calendar.clickScheduleProceeding();
      await pages.proceedingType.selectProceedingType(
        getRandomItem(testData.jobDetails.proceedingTypes)
      );
    });

    await test.step("Fill in proceeding basics", async () => {
      await pages.caseName.selectCaseName();
      await pages.caseName.selectCountry(testData.jobDetails.country);
      await pages.caseName.clickNext();
    });

    await test.step("Select a random date and time", async () => {
      await selectRandomDateTime();
    });

    await test.step("Select remote proceeding and services", async () => {
      await pages.location.selectRemoteOption();
      const randomServices = getRandomServices(2);
      await pages.services.selectRandomServices(randomServices);
      await pages.services.clickNext();
    });

    await test.step("Set up participants and confirm proceeding", async () => {
      await setupParticipants();
      await confirmProceeding();
    });
  });

  // Helper function: Select random date and time
  async function selectRandomDateTime() {
    let attempts = 0;
    let success = false;

    while (attempts < 5 && !success) {
      const randomDate = testData.dateAndTime.getDynamicDate(60);
      success = await pages.dateAndTime2.selectDate(
        randomDate.day,
        randomDate.month,
        randomDate.year
      );
      attempts++;
    }

    const randomTime = getRandomItem(testData.dateAndTime.timeOptions);
    const timeZoneValue = testData.dateAndTime.getTimeZone(
      getRandomItem(testData.dateAndTime.timeZoneOptions)
    );

    await pages.dateAndTime2.selectTime(randomTime);
    await pages.dateAndTime2.selectTimeZone(timeZoneValue);
    await pages.dateAndTime2.clickNext();
  }

  // Helper function: Set up participants
  async function setupParticipants() {
    await pages.participants.adjustAttendees(
      testData.jobDetails.participants.attendees
    );
    await pages.participants.selectAttyLawyer(
      testData.jobDetails.participants.attyLawyer
    );
    await pages.participants.selectPointOfContact(
      testData.jobDetails.participants.pointOfContact
    );
    await pages.participants.selectSchedulingOffice(
      testData.jobDetails.participants.schedulingOffice
    );
    await pages.participants.addWitness(
      getRandomItem(testData.jobDetails.participants.witnesses)
    );
    await pages.participants.clickNext();
  }

  // Helper function: Confirm proceeding
  async function confirmProceeding() {
    const participant = {
      firstName: getRandomItem(testData.remoteParticipants.firstNames),
      lastName: getRandomItem(testData.remoteParticipants.lastNames),
      role: getRandomItem(testData.remoteParticipants.roles),
      email: getRandomItem(testData.remoteParticipants.emails),
    };

    await pages.addRemoteParticipants.addRemoteParticipant(participant);
    await pages.addRemoteParticipants.clickScheduleProceeding();
    await pages.participants.confirmScheduleProceeding();
  }

  // Helper function: Get random item
  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Helper function: Get multiple random services
  function getRandomServices(count) {
    return testData.proceedingServices.additionalServices
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  // Test: Reschedule a created job
  test("Reschedule a created job", async () => {
    await test.step("Open Options+ menu and click Edit Schedule", async () => {
      await pages.jobCard.clickOptions();
      await pages.jobCard.clickEditSchedule();
    });

    await test.step("Select a new date", async () => {
      let attempts = 0;
      let success = false;

      while (attempts < 2 && !success) {
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
    });

    await test.step("Save the new schedule", async () => {
      await page.waitForTimeout(2000);
      await pages.jobCard.clickSaveSchedule();
    });

    await test.step("Verify the success alert", async () => {
      const updateMessage = await pages.jobCard.getSuccessAlert();
      expect(updateMessage).toContain(testData.jobCardDetails.updateJobMessage);
    });
  });
});

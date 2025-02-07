const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");
const { chromium } = require("playwright");

test.describe("Job Creation Remote Proceeding", () => {
  let browser, context, page, pageManager;
  let loginPage,
    calendarPage,
    proceedingTypePage,
    caseNamePage,
    dateAndTimePage,
    locationPage,
    proceedingServicesPage,
    participantsPage,
    addressPage,
    jobCardPage;

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
    addressPage = pageManager.getAddressPage();
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

  // Common steps for creating a job for reuse
  const commonJobCreationSteps = async (locationOption) => {
    await test.step("When user clicks Schedule proceeding button", async () => {
      await calendarPage.clickScheduleProceeding();
    });

    await test.step("And selects a proceeding type", async () => {
      //Select a random proceeding
      await proceedingTypePage.selectProceedingType(
        testData.jobDetails.proceedingTypes[
          Math.floor(Math.random() * testData.jobDetails.proceedingTypes.length)
        ]
      );
    });

    await test.step("And fills the proceeding basics", async () => {
      test.slow();
      await caseNamePage.selectCaseName();
      await caseNamePage.selectCountry(testData.jobDetails.country);
      await caseNamePage.clickNext();
    });

    await test.step("And selects the proceeding date and time", async () => {
      //Select a random time and timezone
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
      await dateAndTimePage.selectDate(); //Using date selected by default in the date picker.TO DO refine logic for picking random date.
      await dateAndTimePage.selectTime(randomTime);
      await dateAndTimePage.selectTimeZone(timeZoneValue);
      await dateAndTimePage.clickNext();
    });

    await test.step("And selects In-Person proceeding", async () => {
      await locationPage.selectInPersonOption();
      await locationOption();
    });

    await test.step("And selects the proceeding services", async () => {
      //Select a random proceeding service
      const randomServices = testData.proceedingServices.additionalServices
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      await proceedingServicesPage.selectRandomServices(randomServices);
      await proceedingServicesPage.clickNext();
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
      //Select a random witness
      const randomWitness =
        testData.jobDetails.participants.witnesses[
          Math.floor(
            Math.random() * testData.jobDetails.participants.witnesses.length
          )
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
      expect(status).toContain(testData.jobCardDetails.status);
    });
  };

  test("Create an In-Person job using Address Book option", async () => {
    await test.step("And selects an address from the address book", async () => {
      await commonJobCreationSteps(async () => {
        await locationPage.selectAddressBookOptionAndLocator(testData.jobDetails.address);
        await locationPage.clickNext();
      });
    });
  });

  test("Create an In-Person job using Veritext Offices option", async () => {
    await test.step("And selects a Veritext office", async () => {
      await commonJobCreationSteps(async () => {
        //Select a random veritext office
        const randomOffice =
          testData.jobDetails.veritextOffices[
            Math.floor(
              Math.random() * testData.jobDetails.veritextOffices.length
            )
          ];
        await locationPage.selectVeritextOfficesOption(randomOffice);
      });
    });
  });

  test("Create an In-Person job using Find Me a Location option", async () => {
    await test.step("And enters a state and city", async () => {
      await commonJobCreationSteps(async () => {
        await locationPage.selectFindMeLocationOption();
        await locationPage.fillStateAndCity(
          testData.jobDetails.findLocationDetails.state,
          testData.jobDetails.findLocationDetails.city
        );
        await locationPage.clickNext();
      });
    });
  });

  test("Add a new location and validate address is not saved", async () => {
    await test.step("And selects an address from the address book", async () => {
      await commonJobCreationSteps(async () => {
        await locationPage.selectAddressBookOption(testData.jobDetails.address);
        await addressPage.fillAddressFormWihoutSave();
        await locationPage.clickNext();
      });
    });

    await test.step("Then the Proceeding has been scheduled", async () => {
      const locatorScheduled = await jobCardPage.getLocator();
      expect(locatorScheduled).toContain(testData.jobDetails.caseName[0]);

      const addressScheduled = await jobCardPage.getAddress();
      expect(addressScheduled).toContain(testData.jobDetails.address);
    });
  });

  test("Add a new location and validate address has been saved", async () => {
    await test.step("And selects an address from the address book", async () => {
      await commonJobCreationSteps(async () => {
        await locationPage.selectAddressBookOption(testData.jobDetails.address);
        await addressPage.fillAddressFormWihoutSave();
        await addressPage.clickSaveAddress();
        await locationPage.clickNext();
      });
    });

    await test.step("Then the Proceeding has been scheduled", async () => {
      const locatorScheduled = await jobCardPage.getLocator();
      expect(locatorScheduled).toContain(testData.jobDetails.caseName[0]);

      const addressScheduled = await jobCardPage.getAddress();
      expect(addressScheduled).toContain(testData.jobDetails.address);
    });

    await test.step("Go back to verify the new address added", async () => {
      await test.step("Handle Retention Policy", async () => {
        await calendarPage.clickMyVeritext();
        await page.waitForURL(testData.urls.calendarPage);
        await calendarPage.handleRetentionPolicyModal();

        await test.step("When user clicks Schedule proceeding button", async () => {
          await calendarPage.clickScheduleProceeding();
        });
    
        await test.step("And selects a proceeding type", async () => {
          //Select a random proceeding
          await proceedingTypePage.selectProceedingType(
            testData.jobDetails.proceedingTypes[
              Math.floor(Math.random() * testData.jobDetails.proceedingTypes.length)
            ]
          );
        });
    
        await test.step("And fills the proceeding basics", async () => {
          test.slow();
          await caseNamePage.selectCaseName();
          await caseNamePage.selectCountry(testData.jobDetails.country);
          await caseNamePage.clickNext();
        });
    
        await test.step("And selects the proceeding date and time", async () => {
          //Select a random time and timezone
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
          await dateAndTimePage.selectDate(); //Using date selected by default in the date picker.TO DO refine logic for picking random date.
          await dateAndTimePage.selectTime(randomTime);
          await dateAndTimePage.selectTimeZone(timeZoneValue);
          await dateAndTimePage.clickNext();
        });
    
        await test.step("And selects In-Person proceeding", async () => {
          await locationPage.selectInPersonOption();
          await locationPage.selectAddressBookOption(testData.jobDetails.address);
        });

        await test.step("Verify Address saved", async () => {
          expect(testData.jobDetails.caseName[0]).toBeTruthy();
        });
      });
    });
  });
});

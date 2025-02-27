import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { FilterJobPage } from '../pages/FilterJobPage.js';
import { AssignmentPage } from '../pages/AssignmentPage.js';
import { AssignPartnerPage } from '../pages/assignement/AssignPartnerPage.js';
import { loginService } from '../services/loginService';
import { JobService } from '../services/jobService';
import * as utils from "../utility/utils.js";
import JobClass from '../utility/jobClass';
import { VendorService } from '../services/vendorService';

let accessToken;
let jobService;
let jobId;
let jobResponse;
let vendorService;

const partnerTypeList = [
    { name: 'Interpreter', id: [2], includesVpz: true },
    { name: 'Videographer', id: [3], includesVpz: true },
    { name: 'Proofreader', id: [4], includesVpz: true },
    { name: 'Other', id: [5], includesVpz: true },
    { name: 'Scopist', id: [6], includesVpz: true },
    { name: 'Transcriber', id: [8], includesVpz: false },
    { name: 'Digital Reporter', id: [1, 9], includesVpz: true },
    { name: 'Steno Reporter', id: [1, 9], includesVpz: true },
    { name: 'Process Server', id: [10], includesVpz: true },
    { name: 'Corrector', id: [11], includesVpz: true },
    { name: 'Concierge-Tech', id: [12], includesVpz: true },
    { name: 'Mediator', id: [14], includesVpz: false },
    { name: 'Trial Tech', id: [15], includesVpz: false }
];

const multiplePartnerTypeList = [
    [
        { name: 'Steno Reporter', id: [1, 9], includesVpz: true },
        { name: 'Videographer', id: [3], includesVpz: true },
    ],
    [
        { name: 'Digital Reporter', id: [1, 9], includesVpz: true },
        { name: 'Trial Tech', id: [15], includesVpz: false },
    ],
    [
        { name: 'Transcriber', id: [8], includesVpz: false },
        { name: 'Mediator', id: [14], includesVpz: false },
    ]
];

test.describe("Assigning Partner for Big 5 existing", () => {
    test.beforeEach('Logging in and set jobs', async ({ page }, testInfo) => {
        const partnerType = testInfo.title.match(/\(([^)]+)\)/)[1];
        let hasDigitalReporter = false;
        let hasTranscriber = false;
        let hasCourtReporter = false;
        let hasInterpreter = false;
        let hasVideographer = false;
        switch (partnerType) {
            case 'Steno Reporter':
                hasCourtReporter = true;
                break;
            case 'Digital Reporter':
                hasDigitalReporter = true;
                break;
            case 'Transcriber':
                hasTranscriber = true;
                break;
            case 'Interpreter':
                hasInterpreter = true;
                break;
            case 'Videographer':
                hasVideographer = true;
                break;
            default:
                break;
        }
        jobService = new JobService();
        accessToken = await loginService();
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const formattedDate = today.toISOString().split('T')[0];
        const jobObject = new JobClass({
            caseId: 301515,
            defendant: "",
            plaintiff: "",
            proceedingTypeId: 5,
            thirdPartyId: 123914,
            divisionId: 50,
            deliveryDays: 0,
            timeZoneId: 7,
            deliveryMethod: "Daily",
            depositionDate: formattedDate + "T07:00:00.000-04:00",
            depositionEnd: formattedDate + "T16:00:00.000-04:00",
            locationId: null,
            locationTypeId: 1,
            locationNotes: "",
            locationAddress1: "1000 Virginia Center Pkwy",
            locationAddress2: "",
            locationCity: "New York",
            locationName: "The Virginia Crossing Hotel and Conference Center",
            locationState: "VA",
            locationZip: "23059",
            locationContactPhone: "",
            locationContact: "",
            hasDigitalReporter: hasDigitalReporter,
            hasTranscriber: hasTranscriber,
            hasCourtReporter: hasCourtReporter,
            hasInterpreter: hasInterpreter,
            hasVideographer: hasVideographer,
            notes: "",
            numberOfAttorneys: "2",
            numberOfWitnesses: "1",
            attorneyContactId: 1079987,
            callerContactId: 1080009,
            clientAddressId: 427947,
            clientId: 268252,
        });
        jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());
        const loginPage = new LoginPage(page);
        await loginPage.login();
    });

    const partnerTypeList = ['Steno Reporter', 'Digital Reporter', 'Transcriber', 'Interpreter', 'Videographer'];
    for (const partnerType of partnerTypeList) {
        test(`Assigning Partner for Big 5 (${partnerType}) exists`, { partnerType: partnerType }, async ({ page }) => {
            await test.step('Wait for grid to load', async () => {
                await utils.waitGridToLoad(page);
            });

            await test.step(`Assign ${partnerType} button appears on job list`, async () => {
                const job = await page.locator(`//*[@data-id="${jobId}"]`).getByText(partnerType);
                const jobPartnerType = await job.textContent()
                await expect(jobPartnerType).toBe(`Assign ${partnerType}`);
            });
        });
    };

});

test.describe("Partner Assignament", () => {
    test.beforeEach('Logging in and set jobs', async ({ page }) => {
        jobService = new JobService();
        accessToken = await loginService();
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const formattedDate = today.toISOString().split('T')[0];
        const jobObject = new JobClass({
            caseId: 301515,
            defendant: "",
            plaintiff: "",
            proceedingTypeId: 5,
            thirdPartyId: 123914,
            divisionId: 50,
            deliveryDays: 0,
            timeZoneId: 7,
            deliveryMethod: "Daily",
            depositionDate: formattedDate + "T07:00:00.000-04:00",
            depositionEnd: formattedDate + "T16:00:00.000-04:00",
            locationId: null,
            locationTypeId: 1,
            locationNotes: "",
            locationAddress1: "1000 Virginia Center Pkwy",
            locationAddress2: "",
            locationCity: "New York",
            locationName: "The Virginia Crossing Hotel and Conference Center",
            locationState: "VA",
            locationZip: "23059",
            locationContactPhone: "",
            locationContact: "",
            hasDigitalReporter: true,
            hasTranscriber: false,
            hasCourtReporter: false,
            hasInterpreter: false,
            hasVideographer: false,
            notes: "",
            numberOfAttorneys: "2",
            numberOfWitnesses: "1",
            attorneyContactId: 1079987,
            callerContactId: 1080009,
            clientAddressId: 427947,
            clientId: 268252,
        });
        jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());
        const loginPage = new LoginPage(page);
        await loginPage.login();
    });

    test(`Partner page is loading via ASSIGN PARTNER`, async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);

        await test.step('Wait for grid to load', async () => {
            await utils.waitGridToLoad(page);
        });

        await test.step(`Select a random ASSIGN PARTNER button`, async () => {
            const numberOfOptions = await assignmentPage.assignPartnerButton.count();
            const randomIndex = Math.floor(Math.random() * numberOfOptions) - 1;
            await assignmentPage.assignPartnerButton.nth(randomIndex).click();
        });

        await test.step('Partner Page loads', async () => {
            await expect(assignPartnerPage.hideJobDetails).toBeVisible();
            await expect(assignPartnerPage.partnerTab).toBeVisible();
        });
    });

    test(`Partner page is loading via ADD NEW`, async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);

        await test.step('Wait for grid to load', async () => {
            await utils.waitGridToLoad(page);
        });

        await test.step(`Open page through ADD NEW button`, async () => {
            await assignmentPage.addNewButton.first().click();
            await expect(assignmentPage.confirmationPopup).toBeVisible();
        });

        await test.step('Selecting partner types', async () => {
            const allBlankCheckboxes = await assignmentPage.partnerTypesBlankCheckbox.count();
            const randomCheckbox = Math.floor(Math.random() * allBlankCheckboxes) - 1;
            await assignmentPage.partnerTypesBlankCheckbox.nth(randomCheckbox).click({ force: true });
        });

        await test.step('Handling Interpreter scenario', async () => {
            if (await assignmentPage.selectLanguageList.isVisible()) {
                await assignmentPage.selectLanguageList.click();
                const dropdown = page.getByRole('listbox');
                const numberOfOptions = await dropdown.getByRole('option').count();
                const randomIndex = Math.floor(Math.random() * numberOfOptions) - 1;
                await dropdown.getByRole('option').nth(randomIndex).click();
            };
        });

        await test.step('Confirm Add', async () => {
            await expect(assignPartnerPage.addButton).toBeEnabled();
            await assignPartnerPage.addButton.click();
        });

        await test.step('Partner Page loads', async () => {
            await expect(assignPartnerPage.hideJobDetails).toBeVisible();
            await expect(assignPartnerPage.partnerTab).toBeVisible();
        });
    });

    test(`Selecting a partner`, async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);

        await test.step('Wait for grid to load', async () => {
            await utils.waitGridToLoad(page);
        });

        await test.step(`Open page through ASSIGN PARTNER button`, async () => {
            await assignmentPage.assignPartnerButton.first().click();
        });

        await test.step('Wait for partner`s list loading', async () => {
            await utils.waitLoadToFinish(page);
        });

        await test.step('Selecting a random available partner', async () => {
            await expect(assignPartnerPage.addButton.first()).toBeEnabled();
            const enabledAddButton = await assignPartnerPage.findAvailablePartner();
            await enabledAddButton.click()
        });

        await test.step('Add button is enabled and partner is selected', async () => {
            await expect(assignPartnerPage.removePartnerButton).toBeEnabled();
            await page.mouse.move(0, 0); /* info is different in the same button if the mouse is over it or not. in this case it should not be hovering it */
            await expect(assignPartnerPage.partnerSelected).toBeVisible();
            await expect(assignPartnerPage.applyButton).toBeEnabled();
        });
    });

    test(`Assing a partner to a job`, async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);
        let jobId;
        let partnerName;

        await test.step('Wait for grid to load', async () => {
            await utils.waitGridToLoad(page);
        });

        await test.step('Filtering only valid jobs', async () => {
            const filterJobPage = new FilterJobPage(page);
            await filterJobPage.applyOnlyValidJobs();
        });

        await test.step(`Open page through ASSIGN PARTNER button`, async () => {
            await assignmentPage.assignPartnerButton.first().click();
        });

        await test.step('Wait for partner`s list loading', async () => {
            await utils.waitLoadToFinish(page);
        });

        await test.step('Selecting an available partner', async () => {
            const enabledAddButton = await assignPartnerPage.findAvailablePartner();
            await enabledAddButton.click()
            await page.mouse.move(0, 0);
        });

        await test.step('Getting job and partner info', async () => {
            jobId = await assignPartnerPage.jobId.textContent();
            const selectedRow = assignPartnerPage.partnerSelected.locator('//ancestor::*[@data-rowindex]').first();
            const firstName = await selectedRow.locator('//descendant::*[@data-field="firstName"]').textContent();
            const lastName = await selectedRow.locator('//descendant::*[@data-field="lastName"]').textContent();
            partnerName = firstName.concat(' ', lastName);
        });

        await test.step('Applying partner', async () => {
            await expect(assignPartnerPage.applyButton.first()).toBeEnabled();
            await assignPartnerPage.applyButton.first().click();
        });

        await test.step('Wait for job`s list loading', async () => {
            await utils.waitLoadToFinish(page);
        });

        await test.step('Confirm partner was added', async () => {
            expect(page.getByTestId(jobId).locator(`//descendant::*[@aria-label="${partnerName}"`)).toBeVisible;
        });
    });
});

test.describe("VPZ not required for Partner Types", () => {
    test.beforeAll('Logging in and setting up jobs', async ({ }) => {
      jobService = new JobService();
      accessToken = await loginService();
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const formattedDate = today.toISOString().split('T')[0];
      const jobObject = new JobClass({
        caseId: 301515,
        defendant: "",
        plaintiff: "",
        proceedingTypeId: 5,
        thirdPartyId: 123914,
        divisionId: 50,
        deliveryDays: 0,
        timeZoneId: 7,
        deliveryMethod: "Daily",
        depositionDate: formattedDate + "T07:00:00.000-04:00",
        depositionEnd: formattedDate + "T16:00:00.000-04:00",
        locationId: null,
        locationTypeId: 1,
        locationNotes: "",
        locationAddress1: "1000 Virginia Center Pkwy",
        locationAddress2: "",
        locationCity: "New York",
        locationName: "The Virginia Crossing Hotel and Conference Center",
        locationState: "VA",
        locationZip: "23059",
        locationContactPhone: "",
        locationContact: "",
        hasDigitalReporter: false,
        hasTranscriber: false,
        hasCourtReporter: false,
        hasInterpreter: false,
        hasVideographer: false,
        notes: "",
        numberOfAttorneys: "2",
        numberOfWitnesses: "1",
        attorneyContactId: 1079987,
        callerContactId: 1080009,
        clientAddressId: 427947,
        clientId: 268252,
      });
      jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());
      jobResponse = await jobService.getJob(accessToken, jobId);
      console.log('Job VPZ ID:', jobResponse.data.job.vpz.id);
    });
  
    test.beforeEach('Logging in', async ({ page }) => {
      const loginPage = new LoginPage(page)
      await loginPage.login()
    })
  
    for (const partnerType of partnerTypeList) {
      test(`VPZ required for Partner Types (${partnerType.name}) ${partnerType.includesVpz ? 'Yes' : 'No'}`, async ({ page }) => {
        vendorService = new VendorService();
        accessToken = await loginService();
        const assignmentPage = new AssignmentPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);
        let vendorId = 0;
        let vpzExists = false;
  
        await test.step('Wait for grid to load', async () => {
          await utils.waitGridToLoad(page);
        });
  
        await test.step(`Add Another Partner Type to a job (${jobId})`, async () => {
          const jobAddNewButton = await page.locator(`//*[@data-id="${jobId}"]`).getByRole('button', { name: 'Add New' });
          await jobAddNewButton.click();
        });
  
        await test.step(`Check Partner Type (${partnerType.name}) Id (${partnerType.id})`, async () => {
          await expect(assignmentPage.confirmationPopup).toBeVisible();
          await page.getByLabel(partnerType.name).click();
        });
  
        if (await assignmentPage.selectLanguageList.isVisible()) {
          await test.step('Handling Interpreter scenario', async () => {
            await assignmentPage.selectLanguageList.click();
            const dropdown = page.getByRole('listbox');
            const numberOfOptions = await dropdown.getByRole('option').count();
            const randomIndex = Math.floor(Math.random() * numberOfOptions);
            await dropdown.getByRole('option').nth(randomIndex).click();
          });
        }
  
        await test.step(`Confirm Add`, async () => {
          await expect(assignPartnerPage.addButton).toBeEnabled();
          await assignPartnerPage.addButton.click();
        });
  
        await test.step('Get vendor Id', async () => {
          await utils.waitLoadToFinish(page);
          const vendorLocator = page.locator(
            'xpath=/html/body/div[4]/div[3]/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div[1]'
          );
          vendorId = await vendorLocator.getAttribute('data-id');
          console.log('Vendor Id:', vendorId);
        });
  
        await test.step(`Get Vendor's ${vendorId} Id VPZ list `, async () => {
          let responseVpz = await vendorService.getVPZByVendorsId(accessToken, parseInt(vendorId, 10));
          console.log('Vendor VPZ:', responseVpz.data.vendor);
          vpzExists = responseVpz.data.vendor.vpzs.some(
            item => item.id === jobResponse.data.job.vpz.id
          );
        });
        await test.step(`Validate VPZ ${jobResponse.data.job.vpz.id} from Job should ${partnerType.includesVpz ? '' : 'No'} Exist in Vendors VPZ list`, async () => {
          expect(vpzExists).toBe(partnerType.includesVpz);
        });
  
      });
    }
  
    for (const partnerTypes of multiplePartnerTypeList) {
      test(`VPZ required for Multiple Partner Types (${partnerTypes[0].name} ${partnerTypes[0].includesVpz ? 'Yes' : 'No'}) and (${partnerTypes[1].name} ${partnerTypes[1].includesVpz ? 'Yes' : 'No'})`, async ({ page }) => {
        const vendorService = new VendorService();
        const accessToken = await loginService();
        const assignmentPage = new AssignmentPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);
        let vendorId = 0;
        let vpzExists = false;
  
        await test.step('Wait for grid to load', async () => {
          await utils.waitGridToLoad(page);
        });
  
        await test.step(`Add Another Partner Type to a job (${jobId})`, async () => {
          const jobAddNewButton = page.locator(`//*[@data-id="${jobId}"]`).getByRole('button', { name: 'Add New' });
          await jobAddNewButton.click();
        });
  
        await test.step(`Confirm pop up opened`, async () => {
          await expect(assignmentPage.confirmationPopup).toBeVisible();
        });
  
        for (const partnerType of partnerTypes) {
          await test.step(`Check Partner Types (${partnerType.name}) Id (${partnerType.id})`, async () => {
            await page.getByLabel(partnerType.name).click();
          });
        }
  
        if (await assignmentPage.selectLanguageList.isVisible()) {
          await test.step('Handling Interpreter scenario', async () => {
            await assignmentPage.selectLanguageList.click();
            const dropdown = page.getByRole('listbox');
            const numberOfOptions = await dropdown.getByRole('option').count();
            const randomIndex = Math.floor(Math.random() * numberOfOptions);
            await dropdown.getByRole('option').nth(randomIndex).click();
          });
        }
  
        await test.step(`Confirm Add`, async () => {
          await expect(assignPartnerPage.addButton).toBeEnabled();
          await assignPartnerPage.addButton.click();
        });
  
        for (const partnerType of partnerTypes) {
          await test.step(`Get vendor Id for first partner type (${partnerType.name})`, async () => {
            await utils.waitLoadToFinish(page);
            const tabName = ['Steno Reporter', 'Digital Reporter'].includes(partnerType.name)
              ? 'COURT REPORTER'
              : partnerType.name.toUpperCase();
            const tab = page.getByRole('tab', { name: tabName });
            await tab.click();
            await utils.waitLoadToFinish(page);
            const vendorLocator = page.locator('xpath=/html/body/div[4]/div[3]/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div[1]');
            vendorId = await vendorLocator.getAttribute('data-id');
            console.log('Vendor Id for first partner:', vendorId);
          });
  
          await test.step(`Get Vendor's ${vendorId} Id VPZ list for first partner type (${partnerType.name})`, async () => {
            const responseVpz = await vendorService.getVPZByVendorsId(accessToken, parseInt(vendorId, 10));
            console.log('Vendor VPZ:', responseVpz.data.vendor);
            vpzExists = responseVpz.data.vendor.vpzs.some(
              item => item.id === jobResponse.data.job.vpz.id
            );
          });
  
          await test.step(`Validate VPZ ${jobResponse.data.job.vpz.id} from Job should ${partnerType.includesVpz ? '' : 'No'} Exist in Vendors VPZ list`, async () => {
            expect(vpzExists).toBe(partnerType.includesVpz);
          });
        }
      })
    }
  })

test.describe("Assignment Conflict - Selecting Partners to be assigned", () => {
  test.beforeEach('Logging in and set jobs', async ({ page }) => {
    jobService = new JobService();
    accessToken = await loginService();
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const formattedDate = today.toISOString().split('T')[0];
    const jobObject = new JobClass({
      caseId: 301515,
      defendant: "",
      plaintiff: "",
      proceedingTypeId: 5,
      thirdPartyId: 123914,
      divisionId: 50,
      deliveryDays: 0,
      timeZoneId: 7,
      deliveryMethod: "Daily",
      depositionDate: formattedDate + "T07:00:00.000-04:00",
      depositionEnd: formattedDate + "T16:00:00.000-04:00",
      locationId: null,
      locationTypeId: 1,
      locationNotes: "",
      locationAddress1: "1000 Virginia Center Pkwy",
      locationAddress2: "",
      locationCity: "New York",
      locationName: "The Virginia Crossing Hotel and Conference Center",
      locationState: "VA",
      locationZip: "23059",
      locationContactPhone: "",
      locationContact: "",
      hasDigitalReporter: true,
      hasTranscriber: false,
      hasCourtReporter: false,
      hasInterpreter: false,
      hasVideographer: false,
      notes: "",
      numberOfAttorneys: "2",
      numberOfWitnesses: "1",
      attorneyContactId: 1079987,
      callerContactId: 1080009,
      clientAddressId: 427947,
      clientId: 268252,
    });
    jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());
    const loginPage = new LoginPage(page);
    await loginPage.login();
  });

  test(`Select Partner, No Tab Change`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    const assignPartnerPage = new AssignPartnerPage(page);
    let partnerName = '';

    await test.step('Wait for grid to load', async () => {
      await utils.waitGridToLoad(page);
    });

    const job = await page.locator(`//*[@data-id="${jobId}"]`);
    await test.step(`Check Digital Reporter status appears on job list`, async () => {
      await expect(job.getByText('DIGITAL REPORTER').first()).toBeVisible();
    });

    await test.step(`Assign Digilat Reporter partner`, async () => {
      await job.getByText('DIGITAL REPORTER').first().click();
    });

    await test.step('Wait for partner`s list loading', async () => {
      await utils.waitLoadToFinish(page);
    });

    await test.step('Selecting an available partner', async () => {
      const enabledAddButton = await assignPartnerPage.findAvailablePartner();
      await enabledAddButton.click()
      await page.mouse.move(0, 0);
    });

    await test.step('Getting job and partner info', async () => {
      jobId = await assignPartnerPage.jobId.textContent();
      const selectedRow = assignPartnerPage.partnerSelected.locator('//ancestor::*[@data-rowindex]').first();
      const firstName = await selectedRow.locator('//descendant::*[@data-field="firstName"]').textContent();
      const lastName = await selectedRow.locator('//descendant::*[@data-field="lastName"]').textContent();
      partnerName = firstName.concat(' ', lastName);
    });

    await test.step('Check if partner was added to cart', async () => {
      const cart = page.getByText(partnerName);
      await expect(cart).toBeVisible();
    });
  });

  test(`Select Partner, Tab is Changed`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    const assignPartnerPage = new AssignPartnerPage(page);
    let partnerName = '';

    await test.step('Wait for grid to load', async () => {
      await utils.waitGridToLoad(page);
    });

    const job = await page.locator(`//*[@data-id="${jobId}"]`);
    await test.step(`Check Digital Reporter status appears on job list`, async () => {
      await expect(job.getByText('DIGITAL REPORTER').first()).toBeVisible();
    });

    await test.step(`Assign Digilat Reporter partner`, async () => {
      await job.getByText('DIGITAL REPORTER').first().click();
    });

    await test.step('Wait for partner`s list loading', async () => {
      await utils.waitLoadToFinish(page);
    });

    await test.step('Selecting an available partner', async () => {
      const enabledAddButton = await assignPartnerPage.findAvailablePartner();
      await enabledAddButton.click()
      await page.mouse.move(0, 0);
    });

    await test.step('Getting job and partner info', async () => {
      jobId = await assignPartnerPage.jobId.textContent();
      const selectedRow = assignPartnerPage.partnerSelected.locator('//ancestor::*[@data-rowindex]').first();
      const firstName = await selectedRow.locator('//descendant::*[@data-field="firstName"]').textContent();
      const lastName = await selectedRow.locator('//descendant::*[@data-field="lastName"]').textContent();
      partnerName = firstName.concat(' ', lastName);
    });

    await test.step('Check if partner was added to cart', async () => {
      const cart = page.getByText(partnerName);
      await expect(cart).toBeVisible();
    });

    await test.step('Click on Notes Cart', async () => {
      await page.getByRole('tab', { name: 'NOTES' }).click();
    });

    await test.step('Click back to the partner type to be assigned', async () => {
      await page.getByRole('tab', { name: 'COURT REPORTER' }).click();
    });

    await test.step('the previously selected partner should be moved to the top of the list', async () => {
      const baseXPathButton = '//html/body/div[4]/div[3]/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div[1]/div[14]/button';
      const locator = page.locator(`xpath=${baseXPathButton}`);
      await locator.waitFor({ state: 'visible' });
      const buttonText = await locator.textContent();
      await expect(buttonText).toEqual('Selected');
    });
  });

  test(`Entering Partner Assignment Modal with Applied partner`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    const assignPartnerPage = new AssignPartnerPage(page);
    let partnerName = '';

    await test.step('Wait for grid to load', async () => {
      await utils.waitGridToLoad(page);
    });

    const job = await page.locator(`//*[@data-id="${jobId}"]`);
    await test.step(`Check Digital Reporter status appears on job list`, async () => {
      await expect(job.getByText('DIGITAL REPORTER').first()).toBeVisible();
    });

    await test.step(`Assign Digilat Reporter partner`, async () => {
      await job.getByText('DIGITAL REPORTER').first().click();
    });

    await test.step('Wait for partner`s list loading', async () => {
      await utils.waitLoadToFinish(page);
    });

    await test.step('Selecting an available partner', async () => {
      const enabledAddButton = await assignPartnerPage.findAvailablePartner();
      await enabledAddButton.click()
      await page.mouse.move(0, 0);
    });

    await test.step('Getting job and partner info', async () => {
      jobId = await assignPartnerPage.jobId.textContent();
      const selectedRow = assignPartnerPage.partnerSelected.locator('//ancestor::*[@data-rowindex]').first();
      const firstName = await selectedRow.locator('//descendant::*[@data-field="firstName"]').textContent();
      const lastName = await selectedRow.locator('//descendant::*[@data-field="lastName"]').textContent();
      partnerName = firstName.concat(' ', lastName);
    });

    await test.step('Check if partner was added to cart', async () => {
      const cart = page.getByText(partnerName);
      await expect(cart).toBeVisible();
    });


    await test.step('Applying partner', async () => {
      await expect(assignPartnerPage.applyButton.first()).toBeEnabled();
      await assignPartnerPage.applyButton.first().click();
    });

    await test.step('Wait for job`s list loading', async () => {
      await utils.waitGridToLoad(page);
    });

    await test.step(`Click on its Notes`, async () => {
      await job.getByText('NOTES').first().click();
    });

    await test.step('Wait for partner`s list loading', async () => {
      await utils.waitLoadToFinish(page);
    });

    await test.step('Click back to the partner type to be assigned', async () => {
      await page.getByRole('tab', { name: 'COURT REPORTER' }).click();
    });

    await test.step('the previously selected partner should be moved to the top of the list', async () => {
      const baseXPathButton = '//html/body/div[4]/div[3]/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div[1]/div[14]/button';
      const locator = page.locator(`xpath=${baseXPathButton}`);
      await locator.waitFor({ state: 'visible' });
      const buttonText = await locator.textContent();
      await expect(buttonText).toEqual('Selected');
    });
  });
});

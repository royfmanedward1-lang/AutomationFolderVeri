import * as utils from '../utility/utils.js';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { AssignmentPage } from '../pages/AssignmentPage.js';
import { AssignPartnerPage } from '../pages/assignement/AssignPartnerPage.js';
import { loginService } from '../services/loginService';
import { JobService } from '../services/jobService';
import JobClass from '../utility/jobClass';


let jobId;
let accessToken;
let jobService;

const partnerTypeList = ['Steno Reporter', 'Digital Reporter', 'Transcriber', 'Interpreter', 'Videographer'];
test.describe("Check Job is assigned to an existing job on list", () => {
    test.beforeEach('Logging in', async ({ page }, testInfo) => {
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
            language: 'Spanish'
        });
        jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());
        const loginPage = new LoginPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);
        await loginPage.login();
        await utils.waitGridToLoad(page);
        await assignPartnerPage.assignVendor(jobId, 'ASSIGN ' + partnerType);
    });

    for (const partnerType of partnerTypeList) {
        test(`Check (${partnerType}) is assigned to an existing job on list`, async ({ page }) => {
            await test.step('Wait for Job List', async () => {
                await utils.waitGridToLoad(page);
            });

            await test.step(`Check ${partnerType} is present on the list`, async () => {
                const job = await page.locator(`//*[@data-id="${jobId}"]`);
                await expect(job.getByText(partnerType).first(), `Job list contains at least one ${partnerType} partner assigned to a job`).toBeVisible();
                await expect(job.getByLabel('Select Partner Status')).toBeVisible()
            });
        });
    }
    test('Validate (Videographer) removal flow until confirmation popup', async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);

        await test.step('Wait for Job List', async () => {
            await utils.waitLoadToFinish(page);
        });

        await test.step('Get a random assigned partner and click on it', async () => {
            const amount = await assignmentPage.partnerStatusButton.first();
            const numberOfOptions = await amount.count();
            const randomIndex = Math.floor(Math.random() * numberOfOptions) - 1;
            await assignmentPage.partnerStatusButton.nth(randomIndex).click();
        });

        await test.step('Remove the partner from the job', async () => {
            await assignmentPage.removePartnerOption.click();
        });

        await test.step('Check confirmation modal appears', async () => {
            await expect(assignmentPage.confirmationPopup, 'Confirmation modal should appear').toBeVisible();
            await expect(assignmentPage.removePartnerConfirmationButton, 'Remove partner confirmation button should appear').toBeVisible();
            await expect(assignmentPage.cancelButton, 'Cancel button should appear').toBeVisible();
        });
    });


    test('Canceling (Steno Reporter) a partner removal', async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);

        let jobDetails;
        let partners;
        let partnersCount;
        let partnersType;
        let partnersTypeCount;

        await test.step('Wait for Job List', async () => {
            await utils.waitLoadToFinish(page);
        });

        await test.step('Get job info', async () => {
            jobDetails = await assignmentPage.findJobInfoFromLocator(assignmentPage.partnerStatusButton.first());

            partners = jobDetails.selectedJob.locator('//*[@class="MuiTypography-root MuiTypography-body1 MuiTypography-noWrap mui-4pko7e"]');
            partnersCount = await partners.count();
            partnersType = jobDetails.selectedJob.locator('//*[@class="MuiTypography-root MuiTypography-body1 mui-16p2gi1"]');
            partnersTypeCount = await partnersType.count();
        });

        await test.step('Click on one of the job partner`s status', async () => {
            await jobDetails.selectedJob.locator('//*[@aria-haspopup="listbox"]').first().click();
        });

        await test.step('Try to remove partner but cancel', async () => {
            await assignmentPage.removePartnerOption.click();
            await assignmentPage.cancelButton.click();
        });

        await test.step('Confirm change was made', async () => {
            await expect(assignmentPage.confirmationPopup, 'Confirmation modal should not be appearing anymore').not.toBeVisible();
            await expect(partners).toHaveCount(partnersCount);
            await expect(partnersType).toHaveCount(partnersTypeCount);
        });
    });

    test('Remove (Transcriber) any partner from a job and verify it got removed', async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);

        let jobDetails;
        let partners;
        let partnersCount;
        let partnersType;
        let partnersTypeCount;

        await test.step('Wait for Job List', async () => {
            await utils.waitLoadToFinish(page);
        });

        await test.step('Get job info', async () => {
            jobDetails = await assignmentPage.findJobInfoFromLocator(assignmentPage.partnerStatusButton.first());

            partners = jobDetails.selectedJob.locator('//*[@class="MuiTypography-root MuiTypography-body1 MuiTypography-noWrap mui-4pko7e"]');
            partnersCount = await partners.count();
            partnersType = jobDetails.selectedJob.locator('//*[@class="MuiTypography-root MuiTypography-body1 mui-16p2gi1"]');
            partnersTypeCount = await partnersType.count();
        });

        await test.step('Click on one of the job partner`s status', async () => {
            await jobDetails.selectedJob.locator('//*[@aria-haspopup="listbox"]').first().click();
        });

        await test.step('Remove the partner from the job', async () => {
            await assignmentPage.removePartnerOption.click();
            await assignmentPage.removePartnerConfirmationButton.click();
        });

        await test.step('Wait for Job List to load again', async () => {
            await utils.waitGridToLoad(page);
            await expect(assignmentPage.confirmationPopup, 'Confirmation modal should not be appearing anymore').not.toBeVisible();
        });

        await test.step('Confirm change was made', async () => {
            await expect(page.locator('//*[@id="vendor-assigner-toast"]').getByRole('alert')).toContainText('successfully removed from the Job');
            await expect(partners).toHaveCount(partnersCount - 1);
            await expect(partnersType).toHaveCount(partnersTypeCount - 1);
        });
    });
})
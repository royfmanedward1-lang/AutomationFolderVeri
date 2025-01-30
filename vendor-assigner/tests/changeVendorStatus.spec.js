import * as utils from '../utility/utils.js';
import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { AssignmentPage } from '../pages/AssignmentPage.js';
import { AssignPartnerPage } from '../pages/assignement/AssignPartnerPage.js';
import { loginService } from '../services/loginService';
import { JobService } from '../services/jobService';
import JobClass from '../utility/jobClass';

let jobId;
let accessToken;
let jobService;

const statusTypes = ['Confirmed', 'Pending', 'Assigned', 'Wait for call'];
test.describe("Statuses for a partner assigned to a job exists in the list", () => {
    test.beforeEach('Logging in', async ({ page }, testInfo) => {
        const status = testInfo.title.match(/\(([^)]+)\)/)[1];
        let hasDigitalReporter = false;
        let hasTranscriber = false;
        let hasCourtReporter = false;
        let hasInterpreter = false;
        let hasVideographer = false;
        let partnerType;
        switch (status) {
            case 'Confirmed':
                hasCourtReporter = true;
                partnerType = 'STENO REPORTER';
                break;
            case 'Pending':
                hasDigitalReporter = true;
                partnerType = 'DIGITAL REPORTER';
                break;
            case 'Assigned':
                hasTranscriber = true;
                partnerType = 'TRANSCRIBER';
                break;
            case 'Wait for call':
                hasVideographer = true;
                partnerType = 'VIDEOGRAPHER';
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
            clientId: 268252
        });
        jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());
        const loginPage = new LoginPage(page);
        const assignPartnerPage = new AssignPartnerPage(page);
        const assignmentPage = new AssignmentPage(page);
        await loginPage.login();
        await utils.waitGridToLoad(page);
        await assignPartnerPage.assignVendor(jobId, 'ASSIGN ' + partnerType);
        if (status != 'Pending') {
            await utils.waitGridToLoad(page);
            await assignmentPage.changeVendorStatus(jobId, status);
        }
    });
    for (const status of statusTypes) {
        test(`Status (${status}) for a partner assigned to a job exists in the list`, async ({ page }) => {
            await test.step('Wait for grid to load', async () => {
                await utils.waitGridToLoad(page);
            });
            await test.step(`Check ${status} status appears on job list`, async () => {
                const job = await page.locator(`//*[@data-id="${jobId}"]`);
                await expect(job.getByText(status).first()).toBeVisible();
            });
        });
    };
    test('Cancel (Pending) Partner Assignement change', async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);
        let statusButton;
        let statusName;


        await test.step('Selecting a status button', async () => {
            statusButton = assignmentPage.partnerStatusButton.first()
            statusName = await statusButton.textContent();
            await statusButton.click();
        });

        await test.step('Select Change Status option', async () => {
            await assignmentPage.changeStatusOption.hover();
        });

        await test.step(`Select a random new status`, async () => {
            const selector = page.getByRole('menuitem').filter({ hasNotText: statusName });
            const statusList = await selector.count();
            const randomNum = Math.floor(Math.random() * statusList) - 1;
            await selector.nth(randomNum).click();
        });

        await test.step('Canceling status change', async () => {
            await expect(assignmentPage.cancelButton, 'Cancel Button is visible').toBeVisible();
            await assignmentPage.cancelButton.click();
        });

        await test.step('Nothing changed', async () => {
            await expect(statusButton).toHaveText(statusName);
        });
    });
});

test.describe("These should run in serial order so they don't end up selecting the same button by mistake", () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeEach('Logging in', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login();
        await utils.waitGridToLoad(page);
    });
    for (const newStatus of statusTypes) {
        test(`Change Partner Assignment to ${newStatus} and confirm`, async ({ page }) => {
            const assignmentPage = new AssignmentPage(page);
            let originalStatusButton;
            let originalStatusName;
            let originalStatusSelector;
            let changedStatusSelector;
            let jobId;
            let originalStatusOnJobIdAmount;
            let changedStatusOnJobIdAmount;

            await test.step('Selecting a status button', async () => {
                originalStatusButton = assignmentPage.partnerStatusButton.filter({ hasNotText: newStatus }).first();
                originalStatusName = await originalStatusButton.textContent();
            });

            await test.step('Get job Id', async () => {
                jobId = await originalStatusButton.locator("//ancestor::*[@data-id]").getAttribute("data-id");
            });

            await test.step('Get the amount of the current status on the job', async () => {
                originalStatusSelector = page.locator(`//*[@data-id="${jobId}"]`).getByText(originalStatusName);
                originalStatusOnJobIdAmount = await originalStatusSelector.count();
            });

            await test.step(`Click on ${originalStatusName} Button`, async () => {
                originalStatusButton = originalStatusSelector.first();
                await originalStatusButton.click();
            });

            await test.step('Get the amount of the soon-to-be-changed status on the job', async () => {
                changedStatusSelector = page.locator(`//*[@data-id=${jobId}]`).locator(`//descendant::*[@value="${newStatus}"]`);
                changedStatusOnJobIdAmount = await changedStatusSelector.count();
            });

            await test.step('Select the change status option', async () => {
                await assignmentPage.changeStatusOption.hover();
            });

            await test.step(`Select the new status ${newStatus}`, async () => {
                await page.getByRole('menuitem', { name: newStatus }).click();
            });

            await test.step(`Confirm the change`, async () => {
                await expect(assignmentPage.confirmationPopup, 'Confirm popup appears').toBeVisible();
                await assignmentPage.confirmStatusChangeButton.click();
            });

            await test.step(`Confirm the changed status ${newStatus} is on the job correctly`, async () => {
                await expect(changedStatusSelector, 'Changed status is on the job').toBeVisible();
                await expect(changedStatusSelector, 'More of the changed status on the job').toHaveCount(changedStatusOnJobIdAmount + 1);
                await expect(originalStatusSelector, 'Less of the old status on the job').toHaveCount(originalStatusOnJobIdAmount - 1);
            });
        });
    };
});
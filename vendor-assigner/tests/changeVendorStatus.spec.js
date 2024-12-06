import * as utils from '../utility/utils.js';
import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { AssignmentPage } from '../pages/AssignmentPage.js';

test.beforeEach('Logging in', async ({ page }) => {
    //login
    const loginPage = new LoginPage(page);
    await loginPage.login();
});

const statusTypes = ['Confirmed','Pending','Assigned','Wait for call'];
for (const status of statusTypes) {
    test(`Status (${status}) for a partner assigned to a job exists in the list`, async ({ page }) => {
        await test.step('Wait for grid to load', async () => {
            await utils.waitGridToLoad(page);
        });

        await test.step(`Check ${status} status appears on job list` , async () => {
            await expect(page.getByText(status).first()).toBeVisible();
        });
    });
};

test('Check ability to select a status and change it', async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    let everyPartnerStatusAvailable;

    await test.step('Wait for grid to load', async () => {
        await utils.waitGridToLoad(page);
    });

    await test.step('Selecting and clicking on a random status button', async () => {
        everyPartnerStatusAvailable = await assignmentPage.partnerStatusButton.count();
        const randomNum = Math.floor(Math.random() * everyPartnerStatusAvailable) - 1;
        await assignmentPage.partnerStatusButton.nth(randomNum).click();
        await expect(assignmentPage.changeStatusOption).toBeVisible();
    });

    await test.step('Select Change Status option', async () => {
        await assignmentPage.changeStatusOption.hover();
    });

    await test.step(`Confirm all 4 statuses list appear`, async () => {
        for (const status of statusTypes) {
            await expect(page.getByRole('menuitem', { name: status })).toBeVisible();
        };
    });
});

test('Cancel Partner Assignement change', async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    let statusButton;
    let statusName;

    await test.step('Wait for grid to load', async () => {
        await utils.waitGridToLoad(page);
    });

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

test.describe("These should run in serial order so they don't end up selecting the same button by mistake", () => {
    test.describe.configure({ mode: 'serial' });
    for (const newStatus of statusTypes) {
        test(`Change Partner Assignment to ${newStatus} and confirm`, async ({page}) => {
            const assignmentPage = new AssignmentPage(page);
            let originalStatusButton;
            let originalStatusName;
            let originalStatusSelector;
            let changedStatusSelector;
            let jobId;
            let originalStatusOnJobIdAmount;
            let changedStatusOnJobIdAmount;

            await test.step('Wait for grid to load', async () => {
                await utils.waitGridToLoad(page);
            });

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
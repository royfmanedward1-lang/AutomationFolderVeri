import * as utils from '../utility/utils.js';
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { AssignmentPage } from '../pages/AssignmentPage.js';

test.beforeEach('Logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
});

const partnerTypeList = ['Steno Reporter', 'Digital Reporter', 'Transcriber', 'Interpreter', 'Videographer'];
for (const partnerType of partnerTypeList) {
    test(`Check ${partnerType} is assigned to an existing job on list`, async ({ page }) => {        
        await test.step('Wait for Job List', async () => {
            await utils.waitLoadToFinish(page);
        });

        await test.step(`Check ${partnerType} is present on the list`, async () => {
            await expect(page.getByText(partnerType).first(), `Job list contains at least one ${partnerType} partner assigned to a job`).toBeVisible();
        });
    });
}

test('Validate removal flow until confirmation popup', async ({ page }) => {
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


test('Canceling a partner removal', async ({ page }) => {
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

test('Remove any partner from a job and verify it got removed', async ({ page }) => {
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
        await utils.waitLoadToFinish(page);
        await expect(assignmentPage.confirmationPopup, 'Confirmation modal should not be appearing anymore').not.toBeVisible();
    });
    
    await test.step('Confirm change was made', async () => {
        await expect(page.locator('//*[@id="vendor-assigner-toast"]').getByRole('alert')).toContainText('successfully removed from the Job');
        await expect(partners).toHaveCount(partnersCount - 1);
        await expect(partnersType).toHaveCount(partnersTypeCount - 1);
    });
});
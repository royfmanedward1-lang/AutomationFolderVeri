import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { FilterJobPage } from '../pages/FilterJobPage.js';
import { AssignmentPage } from '../pages/AssignmentPage.js';
import { AssignPartnerPage } from '../pages/assignement/AssignPartnerPage.js';
import * as utils from "../utility/utils.js";

test.beforeEach('Logging in and set jobs', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
});

const partnerTypeList = ['Steno Reporter', 'Digital Reporter', 'Transcriber', 'Interpreter', 'Videographer'];
for (const partnerType of partnerTypeList) {
    test(`Assigning Partner for Big 5 (${partnerType}) exists`, async ({ page }) => {
        await test.step('Wait for grid to load', async () => {
            await utils.waitGridToLoad(page);
        });
    
        await test.step(`Assign ${partnerType} button appears on job list` , async () => {
            await expect(page.getByText(`Assign ${partnerType}`).first()).toBeVisible();
        });
    });
};

test(`Partner page is loading via ASSIGN PARTNER`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    const assignPartnerPage = new AssignPartnerPage(page);

    await test.step('Wait for grid to load', async () => {
        await utils.waitGridToLoad(page);
    });

    await test.step(`Select a random ASSIGN PARTNER button` , async () => {
        const numberOfOptions = await assignmentPage.assignPartnerButton.count();
        const randomIndex = Math.floor(Math.random() * numberOfOptions) - 1;
        await assignmentPage.assignPartnerButton.nth(randomIndex).click();
    });

    await test.step('Partner Page loads', async () => { 
        await expect(assignPartnerPage.showJobDetails).toBeVisible();
        await expect(assignPartnerPage.partnerTab).toBeVisible();
    });
});

test(`Partner page is loading via ADD NEW`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    const assignPartnerPage = new AssignPartnerPage(page);
    
    await test.step('Wait for grid to load', async () => {
        await utils.waitGridToLoad(page);
    });

    await test.step(`Open page through ADD NEW button` , async () => {
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
        await expect(assignPartnerPage.showJobDetails).toBeVisible();
        await expect(assignPartnerPage.partnerTab).toBeVisible();
    });
});

test(`Selecting a partner`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page);
    const assignPartnerPage = new AssignPartnerPage(page);
    
    await test.step('Wait for grid to load', async () => {
        await utils.waitGridToLoad(page);
    });
    
    await test.step(`Open page through ASSIGN PARTNER button` , async () => {
        await assignmentPage.assignPartnerButton.first().click();
    });

    await test.step('Wait for partner`s list loading', async () => {
        await utils.waitLoadToFinish(page);
    });

    await test.step('Selecting a random available partner', async () => {
        await expect(assignPartnerPage.addButton.first()).toBeEnabled();
        const numberOfOptions = await assignPartnerPage.enabledAddButton.count();
        const randomIndex = Math.floor(Math.random() * numberOfOptions) - 1;
        await assignPartnerPage.enabledAddButton.nth(randomIndex).click();
    });

    await test.step('Add button is enabled and partner is selected', async () => {
        await expect(assignPartnerPage.removePartnerButton).toBeEnabled();
        await page.mouse.move(0,0); /* info is different in the same button if the mouse is over it or not. in this case it should not be hovering it */
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

    await test.step(`Open page through ASSIGN PARTNER button` , async () => {
        await assignmentPage.assignPartnerButton.first().click();
    });

    await test.step('Wait for partner`s list loading', async () => {
        await utils.waitLoadToFinish(page);
    });

    await test.step('Selecting an available partner', async () => {
        await assignPartnerPage.enabledAddButton.first().click();
        await page.mouse.move(0,0);
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

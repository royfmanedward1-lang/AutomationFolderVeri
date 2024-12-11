import { test, expect } from '@playwright/test';
import { BulkActionPage } from '../pages/assignement/BulkActionPage.js';
import { FilterJobPage } from '../pages/FilterJobPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import * as utils from '../utility/utils.js';

test.beforeEach('Logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
});

test('Change partner statuses in bulk action menu', async ({ page }) => {
    const bulkAction = new BulkActionPage(page);
    const filterJob = new FilterJobPage(page);
    let afterFilters; 
    let selectedTo;   

    await test.step('Wait for grid to load and select all checkboxes', async () => {
        await utils.waitGridToLoad(page);
        await bulkAction.selectAllIdCheckbox.check();
        await expect(filterJob.filterButton).not.toBeVisible();
    });

    await test.step('Open bulk action menu and check visibility of options', async () => {
        await bulkAction.bulkActionComboBox.waitFor({ state: 'visible' });
        await expect(bulkAction.bulkActionComboBox).toBeVisible();
        await bulkAction.bulkActionComboBox.click({ force: true });
        await expect(bulkAction.updatePartnerStatusOption).toBeVisible();
        await bulkAction.updatePartnerStatusOption.click();
    });

    await test.step('Verify that partner status change options are disabled initially', async () => {
        const isChangeStatusToComboBoxDisabled = await bulkAction.chageStatustoComboBox.isDisabled();
        expect(isChangeStatusToComboBoxDisabled).toBe(true);
        
        const isSelectPartnerTypesComboBoxDisabled = await bulkAction.selectParterTypesComboBox.isDisabled();
        expect(isSelectPartnerTypesComboBoxDisabled).toBe(true);
    });

    await test.step('Select "from" status and verify "to" status is enabled', async () => {
        await bulkAction.changeStatusFromCombobox.click();
        await bulkAction.selectStatusFrom();
        await bulkAction.menuOption.click();

        const isChangeStatusToComboBoxEnabled = await bulkAction.chageStatustoComboBox.isEnabled();
        expect(isChangeStatusToComboBoxEnabled).toBe(true);
        
        await bulkAction.chageStatustoComboBox.click();
    });

    await test.step('Select "to" status and enable update button', async () => {
        selectedTo = await bulkAction.selectStatusTo()  ;
        const isUpdateStatusButtonEnabled = await bulkAction.updateStatusButton.isEnabled();
        expect(isUpdateStatusButtonEnabled).toBe(true);
    });

    await test.step('Select partner type and verify partner selection', async () => {
        await bulkAction.selectParterTypesComboBox.click();
        await bulkAction.selectPartnerType('All Partner Types');
        await bulkAction.menuOption.click();
        await bulkAction.menuOption.waitFor({ state: 'detached' });
        await bulkAction.partnerSelected.click();
        await bulkAction.partnerSelected.waitFor({ state: 'visible' });
        
        const partnersText = await bulkAction.partnerSelected.innerText();
        afterFilters = parseInt(partnersText.match(/\d+/)[0], 10);
        expect(afterFilters).toBeGreaterThan(0);
    });

    await test.step('Update status and confirm bulk action', async () => {
        await bulkAction.updateStatusButton.click();
        const statusUpdateMessageLocator = page.getByText('The partner status for the');
        await expect(statusUpdateMessageLocator).toHaveText(`The partner status for the ${afterFilters > 1 ? afterFilters : ''} partner${afterFilters > 1 ? 's' : ''} you've selected will be updated to "${selectedTo}".`);
        
        await bulkAction.confirmButton.click();
    });

    await test.step('Verify bulk action success message', async () => {
        const buttonBulkApplied = page.getByText('​Bulk changes applied successfully.');
        await expect(buttonBulkApplied).toHaveText(`​Bulk changes applied successfully.`);
    });
});
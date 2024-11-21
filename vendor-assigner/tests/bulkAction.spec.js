import { BulkActionPage } from '../pages/assignament/BulkActionPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'
import { LoginPage } from '../pages/LoginPage.js'
const { test, expect } = require('@playwright/test')
import * as utils from '../utility/utils.js'

test.beforeEach('Logging in', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.login()
})

test('Change partner statuses in bulk action menu', async ({ page }) => {
    const bulkAction = new BulkActionPage(page)
    const filterJob = new FilterJobPage(page)
    await utils.waitGridToLoad(page)
    await bulkAction.selectAllIdCheckbox.check()
    await expect(filterJob.filterButton).not.toBeVisible()
    await bulkAction.bulkActionComboBox.waitFor({ state: 'visible' });
    await expect(bulkAction.bulkActionComboBox).toBeVisible()
    await bulkAction.bulkActionComboBox.click({ force: true })
    await expect(bulkAction.updatePartnerStatusOption).toBeVisible()
    await bulkAction.updatePartnerStatusOption.click()
    const isChageStatustoComboBoxDisabled = await bulkAction.chageStatustoComboBox.isDisabled()
    await expect(isChageStatustoComboBoxDisabled).toBe(true)
    const isSelectParterTypesComboBoxDisabled = await bulkAction.selectParterTypesComboBox.isDisabled()
    await expect(isSelectParterTypesComboBoxDisabled).toBe(true)
    await bulkAction.changeStatusFromCombobox.click()
    await bulkAction.selectStatusFrom()
    await bulkAction.menuOption.click()
    const chageStatustoComboBoxEnabled = await bulkAction.chageStatustoComboBox.isEnabled();
    await bulkAction.chageStatustoComboBox.click()
    const selectedTo = await bulkAction.selectStatusTo() 
    await expect(chageStatustoComboBoxEnabled).toBe(true);
    const isUpdateStatusButtonEnabled = await bulkAction.updateStatusButton.isEnabled();
    await expect(isUpdateStatusButtonEnabled).toBe(true);
    await bulkAction.selectParterTypesComboBox.click()
    await bulkAction.selectPartnerType('All Partner Types')
    await bulkAction.menuOption.click()
    await bulkAction.partnerSelected.waitFor({ state: 'visible' });
    const parteners = await bulkAction.partnerSelected.innerText()
    const afterFilters = parseInt(parteners.match(/\d+/)[0], 10);
    await expect(afterFilters).toBeGreaterThan(0);
    await bulkAction.updateStatusButton.click()
    await page.getByText('The partner status for the').waitFor({ state: 'visible' });
    const statusUpdateMessageLocator = await page.getByText('The partner status for the')
    await expect(statusUpdateMessageLocator).toHaveText(`The partner status for the partner${afterFilters > 1 ? 's' : ''} you've selected will be updated to "${selectedTo}".`)
    await bulkAction.confirmButton.click()
    const buttonBulkApplied = await page.getByText('​Bulk changes applied successfully.')
    await expect(buttonBulkApplied).toHaveText(`​Bulk changes applied successfully.`)    
})
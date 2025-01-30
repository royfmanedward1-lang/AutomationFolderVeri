import { test, expect } from '@playwright/test';
import { BulkActionPage } from '../pages/assignement/BulkActionPage.js';
import { FilterJobPage } from '../pages/FilterJobPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import JobClass from '../utility/jobClass';
import * as utils from '../utility/utils.js';
import { AssignPartnerPage } from '../pages/assignement/AssignPartnerPage.js';
import { HeaderPage } from '../pages/assignement/HeaderPage.js';
import { loginService } from '../services/loginService';
import { JobService } from '../services/jobService';

let jobStenoReporterId
let accessToken;
let jobService;

test.beforeEach('Logging in', async ({ page }) => {
    jobService = new JobService();
    accessToken = await loginService();
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const formattedDate = today.toISOString().split('T')[0];
    const jobStenoReporter = new JobClass({
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
        hasCourtReporter: true,
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
    jobStenoReporterId = await jobService.createNewJob(accessToken, jobStenoReporter.generateQuery());
    const loginPage = new LoginPage(page);
    const headerPage = new HeaderPage(page);
    const assignPartnerPage = new AssignPartnerPage(page);
    await loginPage.login();
    await utils.waitGridToLoad(page);
    const filterJobPage = new FilterJobPage(page);
    await filterJobPage.applyOnlyValidJobs();
    await assignPartnerPage.assignVendor(jobStenoReporterId, 'ASSIGN STENO REPORTER');
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
        selectedTo = await bulkAction.selectStatusTo();
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
import * as utils from '../utility/utils.js'
import { test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { FilterPage } from '../pages/FilterPage.js'
import { AssignmentPage } from '../pages/AssignmentPage.js'

test.beforeEach('Logging in', async ({ page }) => {
    //login
    const loginPage = new LoginPage(page)
    await loginPage.login()

    //clear all filters
    const filterPage = new FilterPage(page)
    await utils.waitGridToLoad(page)
    await filterPage.changeFilterDate()
})

const partnerTypeList = ['Steno Reporter', 'Digital Reporter', 'Transcriber', 'Interpreter', 'Videographer'];

for (const partnerType of partnerTypeList) {
    test(`Remove ${partnerType} from a job and verify if it was removed`, async ({ page }) => {
        const assignmentPage = new AssignmentPage(page);
        let jobDetails;
        await test.step('Find job with the partner type', async () => {
            await utils.waitGridToLoad(page)
            jobDetails = await utils.findJobWithPartnerType(page, partnerType);
        });

        await test.step('Click on the job status', async () => {
            await assignmentPage.clickOnStatus(jobDetails.button);
        });

        await test.step('Remove the partner from the job', async () => {
            await assignmentPage.removePartner(jobDetails.jobId, jobDetails.partnerName, partnerType);
        });
    });
}
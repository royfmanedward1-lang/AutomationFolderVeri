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
    await filterPage.changeFilterDate()
})

const partnerTypeList = ['Steno Reporter','Digital Reporter','Transcriber','Interpreter','Videographer']
for (const partnerType of partnerTypeList) {
    test(`Remove ${partnerType} from a job and verify if it was removed`, async ({ page }) => {
        const assignmentPage = new AssignmentPage(page)
        const jobDetails = await utils.findJobWithPartnerType(page, partnerType)
        await assignmentPage.clickOnStatus(jobDetails.button)
        await assignmentPage.removePartner(jobDetails.jobId, jobDetails.partnerName, partnerType)
    })
}
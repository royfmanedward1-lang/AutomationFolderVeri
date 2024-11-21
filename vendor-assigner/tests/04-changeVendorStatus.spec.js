import * as utils from '../utility/utils.js'
import { test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { FilterPage } from '../pages/FilterPage.js'
import { AssignmentPage } from '../pages/AssignmentPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'


test.beforeEach('Logging in and set jobs', async ({ page }) => {
    //login
    const loginPage = new LoginPage(page)
    await loginPage.login()

    //change date
    const filterPage = new FilterPage(page)
    await filterPage.changeFilterDate()
    //re-filter jobs if too few or too many are available
    await filterPage.setAverageJobAmount(15, 200)
})

const statusTypes = ['Confirmed','Pending','Assigned','Wait for call']
for (const currentStatus of statusTypes) {
    for (const newStatus of statusTypes) {
        if(currentStatus !== newStatus) {
            test(`Change Partner Assignement from ${currentStatus} to ${newStatus} and confirm`, async ({page}) => {
                const assignmentPage = new AssignmentPage(page)
                const jobDetails = await utils.findJobDetailsWithPartnerStatus(page, currentStatus)
                await assignmentPage.clickOnStatus(jobDetails.button)
                await assignmentPage.selectChangeStatus()
                await assignmentPage.clickOnNewStatus(newStatus)
                await assignmentPage.confirmStatusChange(true, jobDetails.jobId, jobDetails.partnerName, jobDetails.partnerType, currentStatus, newStatus)
            })
        }
    }
}

test(`Cancel Partner Assignement change`, async ({page}) => {
    const assignmentPage = new AssignmentPage(page)
    const currentStatus = utils.getRandomDifferent(statusTypes)
    const newStatus = utils.getRandomDifferent(statusTypes, currentStatus)
    const jobDetails = await utils.findJobDetailsWithPartnerStatus(page, currentStatus)
    await assignmentPage.clickOnStatus(jobDetails.button)
    await assignmentPage.selectChangeStatus()
    await assignmentPage.clickOnNewStatus(newStatus)
    await assignmentPage.confirmStatusChange(false, jobDetails.jobId, jobDetails.partnerName, jobDetails.partnerType, currentStatus, newStatus) 
})
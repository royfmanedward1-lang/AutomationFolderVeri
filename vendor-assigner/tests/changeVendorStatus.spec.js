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
    await filterPage.clearAllFilters()
})

const statusTypes = ['Pending', 'Assigned', 'Confirmed', 'Wait for call']
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

            test(`Cancel Partner Assignement changing from ${currentStatus} to ${newStatus}`, async ({page}) => {
                const assignmentPage = new AssignmentPage(page)
                const jobDetails = await utils.findJobDetailsWithPartnerStatus(page, currentStatus)
                await assignmentPage.clickOnStatus(jobDetails.button)
                await assignmentPage.selectChangeStatus()
                await assignmentPage.clickOnNewStatus(newStatus)
                await assignmentPage.confirmStatusChange(false, jobDetails.jobId, jobDetails.partnerName, jobDetails.partnerType, currentStatus, newStatus) 
            })
        }
    }
}





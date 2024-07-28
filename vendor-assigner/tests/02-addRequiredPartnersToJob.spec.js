import { test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'
import { AssignmentPage } from '../pages/AssignmentPage.js'

test.beforeEach('Logging in and set jobs', async ({ page }) => {
  //login
  const loginPage = new LoginPage(page)
  await loginPage.login()
})

const partnerTypeList = ['Steno Reporter', 'Digital Reporter', 'Transcriber', 'Interpreter', 'Videographer']
for (const partnerType of partnerTypeList) {
  test(`Add ${partnerType} to a job and verify if ${partnerType} is added`, async ({ page }) => {
    const filterJobPage = new FilterJobPage(page)
    const assignmentPage = new AssignmentPage(page)
    await filterJobPage.applyOnlyValidJobs()
    await assignmentPage.selectJobAndAssignPartner(partnerType)
    await assignmentPage.addPartner(partnerType)
  })
}
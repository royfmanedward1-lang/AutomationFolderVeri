import { test} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { AssignmentPage } from '../pages/AssignmentPage.js'

test.beforeEach('Logging in', async ({ page }) => {
  //login
  const loginPage = new LoginPage(page)
  await loginPage.login()
  await page.waitForLoadState('load')


  //clear all filters
  const assignmentPage = new AssignmentPage(page)
  await assignmentPage.changeFilterDate()
  await assignmentPage.clearAllFilters()
})

const partnerTypeList = ['Steno Reporter', 'Digital Reporter','Transcriber','Interpreter','Videographer']
for (const partnerType of partnerTypeList) {
  test(`Add ${partnerType} to a job and verify if ${partnerType} is added`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page)
    await assignmentPage.selectJobAndAssignPartner(partnerType)
    await assignmentPage.addPartner(partnerType)
  })
}
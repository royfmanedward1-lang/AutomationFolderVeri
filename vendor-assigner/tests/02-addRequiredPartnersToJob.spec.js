import { test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { FilterPage } from '../pages/FilterPage.js'
import { AssignmentPage } from '../pages/AssignmentPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'

test.beforeEach('Logging in', async ({ page }) => {
  //login
  const loginPage = new LoginPage(page)
  await loginPage.login()

  const filterPage = new FilterPage(page)
  await filterPage.changeFilterDate()

    //Assign new filters
    const filterJobPage = new FilterJobPage(page)
    await filterJobPage.setNewFilters()
})

const partnerTypeList = ['Steno Reporter', 'Digital Reporter','Transcriber','Interpreter','Videographer']
for (const partnerType of partnerTypeList) {
  test(`Add ${partnerType} to a job and verify if ${partnerType} is added`, async ({ page }) => {
    const assignmentPage = new AssignmentPage(page)
    await assignmentPage.selectJobAndAssignPartner(partnerType)
    await assignmentPage.addPartner(partnerType)
  })
}
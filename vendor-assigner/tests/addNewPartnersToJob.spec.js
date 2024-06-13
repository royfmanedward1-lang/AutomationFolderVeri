import { test } from '@playwright/test'
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

const partnerTypePrimaryList = ['Steno Reporter','Transcriber','Interpreter','Videographer', 'Digital Reporter']
for (const partnerType of partnerTypePrimaryList) {
  test(`Add ${partnerType} to a job using ADD NEW and verify if ${partnerType} is added`, async ({ page }) => {
    let isPrimaryType = true
    const assignmentPage = new AssignmentPage(page) 
    await assignmentPage.selectJobToAddNewPartner(partnerType, isPrimaryType)
    await assignmentPage.selectPartnerTypeToAddNew(partnerType)
    await assignmentPage.addPartner(partnerType)
  })
}

const partnerTypeSecondaryList = ['Proofreader', 'Mediator','Concierge-Tech','Corrector','Scopist','Process Server','Trial Tech']
for (const partnerType of partnerTypeSecondaryList) {
  test(`Add ${partnerType} to a job using ADD NEW and verify if ${partnerType} is added`, async ({ page }) => {
    let isPrimaryType = false
    const assignmentPage = new AssignmentPage(page) 
    await assignmentPage.selectJobToAddNewPartner(partnerType, isPrimaryType)
    await assignmentPage.selectPartnerTypeToAddNew(partnerType)
    await assignmentPage.addPartner(partnerType)
  })
}
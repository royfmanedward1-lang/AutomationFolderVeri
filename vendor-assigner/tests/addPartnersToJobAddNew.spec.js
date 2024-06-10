import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { FilterPage } from '../pages/FilterPage'
import { findJobDetailsForAddNew, findPartnerDetails } from '../utility/utils'

const partnerTypePrimaryList = ['Steno Reporter','Transcriber','Interpreter','Videographer', 'Digital Reporter']
for (const partnerTypePrimary of partnerTypePrimaryList) {
  test(`Add ${partnerTypePrimary} to a job using ADD NEW and verify if ${partnerTypePrimary} is added`, async ({ page }) => {
    await testPartnerAddition(page, partnerTypePrimary, true)
  })
}

const partnerTypeSecondaryList = ['Proofreader', 'Mediator','Concierge-Tech','Corrector','Scopist','Process Server','Trial Tech']
for (const partnerTypeSecondary of partnerTypeSecondaryList) {
  test(`Add ${partnerTypeSecondary} to a job using ADD NEW and verify if ${partnerTypeSecondary} is added`, async ({ page }) => {
    await testPartnerAddition(page, partnerTypeSecondary)
  })
}

async function testPartnerAddition(page, partnerType, isPrimaryType) {
    //login
    const loginPage = new LoginPage(page)
    await loginPage.login()

    await page.waitForLoadState('load')
    const filterPage = new FilterPage(page)
    await filterPage.changeFilterDate()
    
    await page.waitForLoadState('load')
    await filterPage.clearAllFilters()
    
    await page.waitForLoadState('load')
    const jobDetails = await findJobDetailsForAddNew(page, partnerType, isPrimaryType)

    await jobDetails.button.click()
    console.log("Clicked on job with jobid: " + jobDetails.jobId + " for adding " + partnerType)

    await page.getByLabel(partnerType).check()
    await page.getByRole('button', { name: 'Add' }).click()  
    console.log("Selected job with jobid: " + jobDetails.jobId + " for " + partnerType) 
    
    const partnerDetails = await findPartnerDetails(page, partnerType)
    await partnerDetails.button.click()
    
    await page.waitForLoadState('load')
    await page.getByRole('button', {name : 'Apply', exact: true}).click()
    console.log("Selected partner " + partnerDetails.partnerName + " as a " + partnerType)

    //verify partner is added to the job
    await page.waitForLoadState('load')
    await expect(page.locator('//div[@data-id="' + jobDetails.jobId + '" and .//p[text()="' + partnerType + '"]]//parent::p[@aria-label="' + partnerDetails.partnerName + '"]')).toBeVisible()
  }
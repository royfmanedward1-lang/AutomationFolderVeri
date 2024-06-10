import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { FilterPage } from '../pages/FilterPage'
import { findJobDetails, findPartnerDetails } from '../utility/utils'

const partnerTypeList = ['Steno Reporter','Transcriber','Interpreter','Videographer', 'Digital Reporter']

for (const partnerType of partnerTypeList) {

  test(`Add ${partnerType} to a job and verify if ${partnerType} is added`, async ({ page }) => {
    await testPartnerAddition(page, partnerType)
  })

}

async function testPartnerAddition(page, partnerType) {
    //login
    const loginPage = new LoginPage(page)
    await loginPage.login()

    await page.waitForLoadState('load')
    const filterPage = new FilterPage(page)
    await filterPage.changeFilterDate()
    
    await page.waitForLoadState('load')
    await filterPage.clearAllFilters()
    
    await page.waitForLoadState('load')
    const jobDetails = await findJobDetails(page, partnerType)

    await jobDetails.button.click()
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
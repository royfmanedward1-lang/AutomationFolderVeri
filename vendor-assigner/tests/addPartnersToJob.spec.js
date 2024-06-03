import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { FilterPage } from '../pages/FilterPage'
import { findJobDetails, findPartnerDetails } from '../utility/utils'

const partnerTypeList = ['Steno Reporter', 'Digital Reporter','Transcriber','Interpreter','Videographer']

for (const partnerType of partnerTypeList) {

  test(`Add ${partnerType} to a job and verify if ${partnerType} is added`, async ({ page }) => {
    await testPartnerAddition(page, partnerType)
  })

}

async function testPartnerAddition(page, partnerType) {
    //login
    const loginPage = new LoginPage(page)
    await loginPage.login()

    //clear all filters
    const filterPage = new FilterPage(page)
    await filterPage.changeFilterDate()
    await filterPage.clearAllFilters()
 
    await page.waitForSelector('//div[@data-id]')
    const jobDetails = await findJobDetails(page, partnerType)

    await jobDetails.button.click()    
    const partnerDetails = await findPartnerDetails(page, partnerType)

    await partnerDetails.button.click()
    await page.waitForTimeout(2000)
    await page.getByRole('button', {name : 'Apply', exact: true}).click()

    //verify partner is added to the job
    await expect(page.locator('//div[@data-id="' + jobDetails.jobId + '" and .//p[text()="' + partnerType + '"]]//parent::p[@aria-label="' + partnerDetails.partnerName + '"]')).toBeVisible()
  }
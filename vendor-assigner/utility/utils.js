import { expect } from "@playwright/test"

module.exports = {
        findJobDetailsWithPartnerStatus: async function(page, status) {
        await this.waitLoadToFinish(page)        
        const allJobs = await page.locator('//*[contains(text(),"' + status + '")]/ancestor::*[@data-id]')
        let numberOfOptions = await allJobs.count()
        if (numberOfOptions > 20) {
            numberOfOptions = 20
        }
        const statusOptionNumber = Math.floor(Math.random() * numberOfOptions) - 1
        const job = await allJobs.nth(statusOptionNumber)
        const jobId = await job.getAttribute('data-id')

        const partnerStatusButton = await page.locator('//*[@data-id="' + jobId + '"]/descendant::*[contains(text(),"' + status + '")][1]')
        const selectedPartnerDetails = await partnerStatusButton.locator('//ancestor::*[@class="MuiGrid-root MuiGrid-item mui-style-1wxaqej"]')

        const partnerNameDiv = await selectedPartnerDetails
                        .locator('//descendant::*[@class="MuiTypography-root MuiTypography-body1 MuiTypography-noWrap mui-style-1hqbags"]')
        const partnerName = await partnerNameDiv.getAttribute('aria-label')
        const partnerType = await partnerNameDiv.locator('//parent::*/preceding-sibling::*').textContent()

        console.log("Found JobId: " + jobId + " with a partner called " + partnerName + " assigned as a " + partnerType + "  with status " + status)
        
        return {
            jobId : jobId,
            partnerName : partnerName,
            partnerType: partnerType,
            button : partnerStatusButton  
        }
    },

    getRandomDifferent: function (arr, last = undefined) {
        let num
        do {
            num = Math.floor(Math.random() * arr.length)
        } while (arr[num] === last)
        return arr[num]
    },
    
    findJobWithPartnerType: async function(page, partnerType) {
        const allJobs = page.locator('//div[@data-id and .//p[contains(text(),"' + partnerType + '")]]')
        const numberOfOptions = await allJobs.count()
        if (numberOfOptions == 0) {
            throw new Error('"There are no partner types of ' + partnerType + ' assigned to any job in the list"')
        } else {
            const statusOptionNumber = Math.floor(Math.random() * numberOfOptions)
            const job = await allJobs.nth(statusOptionNumber)
            const jobId = await job.getAttribute('data-id')
            
            const partnerInfo = await page.locator('//div[@data-id="' + jobId + '"]/descendant::*[text()="' + partnerType + '"]')
            const partnerName = await partnerInfo.locator('//following-sibling::*/descendant::*').first().textContent()
            const partnerStatusButton = await partnerInfo.locator('//following-sibling::*/descendant::*[text()="' + partnerName + '"]' +
                                    '/ancestor::*[@class="MuiGrid-root MuiGrid-item mui-style-1wxaqej"]/descendant::*[@aria-label="Select Partner Status"]')
            return {
                jobId : jobId,
                partnerName : partnerName,
                button : partnerStatusButton  
            }
        }
    },

    waitLoadToFinish: async function (page) {
        await page.waitForLoadState('domcontentloaded')
        await expect(page.getByRole('grid').getByRole('progressbar')).not.toBeAttached() 

    },
    waitGridToLoad: async function (page) {
        await page.locator('button.MuiLoadingButton-loading:has-text("APPLY")').waitFor({ state: 'visible' })
        const applyButton = page.locator('button.MuiLoadingButton-loading:has-text("APPLY")');
        await applyButton.locator('span.MuiLoadingButton-loadingIndicator').waitFor({ state: 'detached' });
    }
}
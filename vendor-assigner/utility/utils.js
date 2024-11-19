import { expect } from "@playwright/test"

module.exports = {
    findJobDetailsToAssignPartner: async function (page, partnerType) {
        const job = await page.locator('//div[@data-id and .//button[text()="Assign ' + partnerType + '"]]')
        const jobId = await job.first().getAttribute('data-id')

        console.log("Found JobId: " + jobId + " which needs a " + partnerType)

        const button = page.locator('//div[@data-id="' + jobId + '"]//button[text()="Assign ' + partnerType + '"]')

        //Created a JS object so can return both jobId and the button 
        return {
            jobId: jobId,
            button: button
        }
    },

    findJobDetailsForAddNew: async function(page, partnerType, isPrimaryType) {
        let job
        let jobId
        const allJobs = page.locator('//div[@data-id and .//p[text()="ADD NEW"]]')
        const numberOfOptions = await allJobs.count()
        
        if (numberOfOptions > 20) {
            numberOfOptions = 20
        }
        const addNewButtonNumber = Math.floor(Math.random() * numberOfOptions) - 1
        
        do {
            if (isPrimaryType) {
                if (await page.locator('//div[@data-id and .//p[text()="' + partnerType + '"]]').count() != 0) {
                    job = await page.locator('//div[@data-id and .//p[text()="' + partnerType + '"]]').first()
                } else {
                    job = await allJobs.nth(addNewButtonNumber)
                }
            } else {
                job = await allJobs.nth(addNewButtonNumber)
            }
            jobId = await job.getAttribute('data-id')
        }  while (await page.locator('//div[@data-id="' + jobId + '" and .//button[text()="Assign ' + partnerType + '"]]').count() != 0)

        console.log("Found JobId: " + jobId + " to add a new " + partnerType)

        const button = page.locator('//*[@data-id="' + jobId + '"]/descendant::*[(text()="ADD NEW")]/ancestor::button')

        return {
            jobId: jobId,
            button: button
        }
    },

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

    findPartnerDetails: async function(page, partnerType) {
        await this.waitLoadToFinish(page)
        const partner = await page.locator('//div[@data-field="availability" and .//span[text()="Available"]]' +
            '/ancestor::*//button[not(@disabled) and text()="Add Partner"]/ancestor::*[@data-id]')

        console.log(await partner.count() + " " + partnerType + " partners available")

        if (await partner.count() === 0) {
            throw new Error("There are no partners available for a " + partnerType)
        } else {
            const partnerId = await partner.first().getAttribute('data-id')
            const firstName = await page.locator('//div[@data-id="' + partnerId + '"]//div[@data-field="firstName"]').textContent()
            const lastName = await page.locator('//div[@data-id="' + partnerId + '"]//div[@data-field="lastName"]').textContent()

            console.log("Found partner " + firstName + " " + lastName + " who is a " + partnerType)

            const button = await page.locator('//div[@data-id="' + partnerId + '"]//button[text()="Add Partner"]')

            return {
                partnerName: firstName + " " + lastName,
                button: button
            }
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
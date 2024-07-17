module.exports = {
    findJobDetailsToAssignPartner: async function (page, partnerType) {
        const job = await page.locator('//div[@data-id and .//button[text()="Assign ' + partnerType + '"]][1]')
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
        if (isPrimaryType) {
            job = await page.locator('//div[@data-id and .//p[text()="' + partnerType + '"]]')
        } else {
            let allJobs = page.locator('//div[@data-id and .//p[text()="ADD NEW"]]')
            let numberOfOptions = await allJobs.count()
            if (numberOfOptions > 20) {
                numberOfOptions = 20
            }
            const addNewButtonNumber = Math.floor(Math.random() * numberOfOptions) + 1
            job = await allJobs.nth(addNewButtonNumber)
        }
        const jobId = await job.first().getAttribute('data-id')

        console.log("Found JobId: " + jobId + " to add a new " + partnerType)

        const button = page.locator('//*[@data-id="' + jobId + '"]/descendant::*[(text()="ADD NEW")]/ancestor::button')

        return {
            jobId: jobId,
            button: button
        }
    },

    findJobDetailsWithPartnerStatus: async function(page, status) {
        await this.waitTillHTMLRendered(page)        
        const allJobs = await page.locator('//*[contains(text(),"' + status + '")]/ancestor::*[@data-id]')
        let numberOfOptions = await allJobs.count()
        if (numberOfOptions > 20) {
            numberOfOptions = 20
        }
        const statusOptionNumber = Math.floor(Math.random() * numberOfOptions)
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
        await this.waitTillHTMLRendered(page)
        const partner = await page.locator('//div[@data-field="availability" and .//span[text()="Available"]]' +
            '/ancestor::*[@data-id and .//button[not(@disabled) and text()="Add Partner"]][1]')

        console.log(await partner.count() + " " + partnerType + " partners available")

        if (await partner.count() === 0) {
            throw new Error("There are no partners available for a " + partnerType)
        } else {
            const dataId = await partner.first().getAttribute('data-id')
            const firstName = await page.locator('//div[@data-id="' + dataId + '"]//div[@data-field="firstName"]').textContent()
            const lastName = await page.locator('//div[@data-id="' + dataId + '"]//div[@data-field="lastName"]').textContent()

            console.log("Found partner " + firstName + " " + lastName + " who is a " + partnerType)

            const button = await page.locator('//div[@data-id="' + dataId + '"]//button[text()="Add Partner"]')

            return {
                partnerName: firstName + " " + lastName,
                button: button
            }
        }
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

    waitTillHTMLRendered: async function (page, timeout = 30000) {
        const checkDurationMsecs = 1000
        const maxChecks = timeout / checkDurationMsecs
        let lastHTMLSize = 0
        let checkCounts = 1
        let countStableSizeIterations = 0
        const minStableSizeIterations = 3

        while (checkCounts++ <= maxChecks) {
            let html = await page.content()
            let currentHTMLSize = html.length

            let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length)

            if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) {
                countStableSizeIterations++
            } else {
                //reset the counter
                countStableSizeIterations = 0
            }
            if (countStableSizeIterations >= minStableSizeIterations) {
                break
            }

            lastHTMLSize = currentHTMLSize
            await page.waitForTimeout(checkDurationMsecs)
        }
    }
}
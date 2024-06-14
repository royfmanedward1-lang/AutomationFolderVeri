module.exports = {
    findJobDetails: async function (page, partnerType) {
        await this.waitTillHTMLRendered(page)

        const job = await page.locator('//div[@data-id and .//button[text()="Assign ' + partnerType + '"]][1]')
        const jobId = await job.first().getAttribute('data-id')

        console.log("Found JobId: " + jobId + " which needs a " + partnerType)

        const button = page.locator('//div[@data-id="' + jobId + '"]//button[text()="Assign ' + partnerType + '"]')

        //Created a JS object so can return both jobId and the button 
        return {
            jobId : jobId,
            button : button  
        }
    },
    findJobDetailsForAddNew: async function(page, partnerType, isPrimaryType) {
        await this.waitTillHTMLRendered(page)
        
        let job
        if (isPrimaryType) {
            job = await page.locator('//div[@data-id and .//p[text()="' + partnerType + '"]]')
        } else {
            const allJobs = page.locator('//div[@data-id and .//p[text()="ADD NEW"]]')
            const numberOfOptions = await allJobs.count()      
            const addNewButtonNumber = Math.floor(Math.random() * numberOfOptions) + 1
            job = await allJobs.nth(addNewButtonNumber)
        }
        const jobId = await job.first().getAttribute('data-id')

        console.log("Found JobId: " + jobId + " to add a new " + partnerType)

        const button = page.locator('//*[@data-id="' + jobId + '"]/descendant::*[contains(text(), "ADD NEW")]/ancestor::button')

        return {
            jobId : jobId,
            button : button  
        }
    },
    findPartnerDetails: async function(page, partnerType) {
        await this.waitTillHTMLRendered(page)

        const partner = await page.locator('//div[@data-field="availability" and .//span[text()="Available"]]' +
                                    '/ancestor::*[@data-id and .//button[not(@disabled) and starts-with(text(),"Add")]][1]')
        
        console.log(await partner.count() + " " + partnerType + " partners available")

        if (await partner.count() === 0){
            throw new Error("There are no partners available for a " + partnerType)
        } else {
            const dataId = await partner.first().getAttribute('data-id')
            const firstName = await page.locator('//div[@data-id="' + dataId + '"]//div[@data-field="firstName"]').textContent()
            const lastName = await page.locator('//div[@data-id="' + dataId + '"]//div[@data-field="lastName"]').textContent()

            console.log("Found partner " + firstName + " " + lastName + " who is a " + partnerType)
            
            const button = await page.locator('//div[@data-id="' + dataId + '"]//button[starts-with(text(), "Add")]')

            return {
                partnerName : firstName + " " + lastName,
                button : button
            }
        }
    },

    waitTillHTMLRendered: async function(page, timeout = 30000) {
        const checkDurationMsecs = 1000
        const maxChecks = timeout / checkDurationMsecs
        let lastHTMLSize = 0
        let checkCounts = 1
        let countStableSizeIterations = 0
        const minStableSizeIterations = 3
        
        while(checkCounts++ <= maxChecks){
            let html = await page.content()
            let currentHTMLSize = html.length 
        
            let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length)
    
            console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize)
    
            if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) {
                countStableSizeIterations++
            } else {
                //reset the counter
                countStableSizeIterations = 0 
            }
            if (countStableSizeIterations >= minStableSizeIterations) {
                console.log("Page rendered fully..")
                break
            }
        
            lastHTMLSize = currentHTMLSize
            await page.waitForTimeout(checkDurationMsecs)
        }
    }
}
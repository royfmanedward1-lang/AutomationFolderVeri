module.exports = {
    findJobDetails: async function (page, partnerType) {
        
        const job = await page.locator('(//div[@data-id and .//button[text()="Assign ' + partnerType + '"]])[1]');
        const jobId = await job.getAttribute('data-id');
      
        console.log("Found JobId: " + jobId + " which has a " + partnerType);
 
        const button = page.locator('//div[@data-id="' + jobId + '"]//button[text()="Assign ' + partnerType + '"]');

        //Created a JS object so can return both jobId and the button 
        return {
          jobId : jobId,
          button : button  
        };
    },
    findJobDetailsForAddNew: async function(page, partnerType, isPrimaryType) {

        let job;
        if (isPrimaryType) {
            job = await page.locator('(//div[@data-id and .//p[text()="' + partnerType + '"]])[1]');
        } else {
            const addNewButtonNumber = Math.floor(Math.random() * 10) + 1;  
            job = await page.locator('(//div[@data-id and .//p[text()="ADD NEW"]])[' + addNewButtonNumber + ']');
        }

        const jobId = await job.getAttribute('data-id');
        
        console.log("Found JobId: " + jobId + " which has a " + partnerType);

        const button = page.locator('//div[@data-id="' + jobId + '"]//p[text()="ADD NEW"]');

        return {
            jobId : jobId,
            button : button  
          };
    },
    findPartnerDetails: async function(page, partnerType) {
        const partner = await page.locator('//div[@data-id and .//button[not(@disabled) and text()="Add Partner"]' +
                                    ' and .//div[@data-field="availability" and .//span[text()="Available"]]][1]');

        const dataId = await partner.getAttribute('data-id');

        const firstName = await page.locator('//div[@data-id="' + dataId + '"]//div[@data-field="firstName"]').textContent();
        const lastName = await page.locator('//div[@data-id="' + dataId + '"]//div[@data-field="lastName"]').textContent();

        console.log("Found partner " + firstName + " " + lastName + " who is a " + partnerType);
        
        const button = await page.locator('//div[@data-id="' + dataId + '"]//button[text()="Add Partner"]');

        return {
            partnerName : firstName + " " + lastName,
            button : button
        };
    }
}
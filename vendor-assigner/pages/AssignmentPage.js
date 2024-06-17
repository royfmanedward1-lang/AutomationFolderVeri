import * as utils from '../utility/utils'
import { expect } from '@playwright/test'

export class AssignmentPage {
    constructor(page){
        this.page = page
        this.jobDetails
        
        this.applyButton = this.page.getByRole('button', {name : 'Apply', exact: true})
        this.addButton = this.page.getByRole('button', { name: 'Add' })
    }
    
    async selectJobToAddNewPartner(partnerType, isPrimaryType) {
        await utils.waitTillHTMLRendered(this.page)
        this.jobDetails = await utils.findJobDetailsForAddNew(this.page, partnerType, isPrimaryType)
        await this.jobDetails.button.click()
        
        console.log("Clicked on job with jobid: " + this.jobDetails.jobId + " for adding " + partnerType)
    }

    async selectJobAndAssignPartner(partnerType) {
        await utils.waitTillHTMLRendered(this.page)
        this.jobDetails = await utils.findJobDetails(this.page, partnerType)
        await this.jobDetails.button.click()
        console.log("Selected job with jobid: " + this.jobDetails.jobId + " for " + partnerType)
    }
    
    async selectPartnerTypeToAddNew(partnerType) {
        await this.page.getByLabel(partnerType).check()
        
        if (partnerType === 'Interpreter') {
            await this.page.getByRole('combobox', { name: 'Select Interpreter Language' }).click()
            const dropdown = await this.page.getByRole('listbox')
            const numberOfOptions = await dropdown.getByRole('option').count()
            const randomIndex = Math.floor(Math.random() * numberOfOptions)
            await dropdown.getByRole('option').nth(randomIndex).click()
        }
        
        await this.addButton.click()  
        
        console.log("Selected job with jobid: " + this.jobDetails.jobId + " for " + partnerType)  
    }

    async addPartner(partnerType) {
        await utils.waitTillHTMLRendered(this.page)
        const partnerDetails = await utils.findPartnerDetails(this.page, partnerType)
    
        await partnerDetails.button.click()
        await this.applyButton.click()

        console.log("Selected partner " + partnerDetails.partnerName + " as a " + partnerType)

        const viewMorePartners = await this.page.locator('//div[@data-id=' + this.jobDetails.jobId + ']/descendant::*[contains(text(), "VIEW MORE")]')
        if (await viewMorePartners.isVisible()){
            await viewMorePartners.click()
        }
        
        await utils.waitTillHTMLRendered(this.page)
        await expect(this.page.locator('//div[@data-id="' + this.jobDetails.jobId + '" and .//p[text()="' + partnerType + '"]]//parent::p[@aria-label="' + partnerDetails.partnerName + '"]')).toBeVisible()
    }    
}
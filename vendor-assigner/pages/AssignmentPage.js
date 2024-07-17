import * as utils from '../utility/utils'
import { expect } from '@playwright/test'

export class AssignmentPage {
    constructor(page){
        this.page = page
        this.jobDetails
        
        //Partner Page
        this.applyButton = this.page.getByRole('button', {name : 'Apply', exact: true})
        this.addButton = this.page.getByRole('button', { name: 'Add' })

        //Partner Status
        this.changeStatusOption = page.getByRole('option', { name: 'Change Status' })
        this.removePartnerOption = page.getByRole('option', { name: 'Remove Partner' })

        //Confirmation Modal
        this.confirmStatusChangeButton = page.getByRole('button', { name: 'Yes, Change' })
        this.removePartnerButton = page.getByRole('button', { name: 'Remove' })
        this.cancelButton = page.getByRole('button', { name: 'Cancel' })
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
        
        await expect(this.page.locator('//div[@data-id="' + this.jobDetails.jobId + '" and .//p[text()="' + partnerType + '"]]//parent::p[@aria-label="' + partnerDetails.partnerName + '"]')).toBeVisible()
    } 
    
    async clickOnStatus(status) {
        await status.waitFor()
        await status.click()
    }

    async clickOnNewStatus(newStatus) {
        const statusSelector = await this.page.getByRole('menuitem', { name: newStatus })
        await statusSelector.click() 
    }

    async confirmStatusChange(confirmChange, jobId, partnerName, partnerType, currentStatus, newStatus) {
        const statusLocator = '//*[@data-id="' + jobId + '"]/descendant::*[contains(text(), "' + partnerType + '")]/following-sibling::*/descendant::*' +
                '[@aria-label="' + partnerName + '"]/ancestor::*[@class="MuiGrid-root MuiGrid-item mui-style-1wxaqej"]/descendant::*[@aria-label="Select Partner Status"]'
        let statusButton
        if (confirmChange) {
            await this.confirmStatusChangeButton.waitFor()
            await this.confirmStatusChangeButton.click()

            await utils.waitTillHTMLRendered(this.page)
            statusButton = await this.page.locator(statusLocator).first()
            await expect(statusButton).toHaveText(newStatus)

            console.log(partnerName + ", assigned as a " + partnerType + " partner to job " + jobId + ", had their status successfully updated from " + currentStatus + " to " + newStatus)
        } else {
            await this.cancelButton.waitFor()
            await this.cancelButton.click()

            await utils.waitTillHTMLRendered(this.page)
            statusButton = await this.page.locator(statusLocator).first()
            await expect(statusButton).toHaveText(currentStatus)

            console.log("Tried selecting status change from " + currentStatus + " to " + newStatus + " then canceled")
        }
    }

    async removePartner(jobId, partnerName, partnerType) {
        const jobLocator = '//div[@data-id="' + jobId + '"]/descendant::*[text()="' + partnerType + '"]/following-sibling::*/descendant::*[text()="' + partnerName + '"]'
        await expect(this.page.locator(jobLocator)).toBeVisible()
        await this.removePartnerOption.click()
        await this.removePartnerButton.click()
        await expect(this.page.locator(jobLocator)).not.toBeVisible()
    }

    async selectChangeStatus() {
        await this.changeStatusOption.waitFor()
        await this.changeStatusOption.hover()
    }

    async selectJobAndAssignPartner(partnerType) {
        await utils.waitTillHTMLRendered(this.page)
        this.jobDetails = await utils.findJobDetailsToAssignPartner(this.page, partnerType)
        await this.jobDetails.button.click()
        console.log("Selected job with jobid: " + this.jobDetails.jobId + " for " + partnerType)
    }

    async selectJobToAddNewPartner(partnerType, isPrimaryType) {
        await utils.waitTillHTMLRendered(this.page)
        this.jobDetails = await utils.findJobDetailsForAddNew(this.page, partnerType, isPrimaryType)
        await this.jobDetails.button.click()
        
        console.log("Clicked on job with jobid: " + this.jobDetails.jobId + " for adding " + partnerType)
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
}
import * as utils from '../utility/utils.js'
import { expect } from '@playwright/test'
import { FilterPage } from './FilterPage.js'

export class AssignmentPage {
    constructor(page){
        this.page = page
        this.jobDetails

        this.selectAllCheckbox = this.page.getByLabel('Select all rows')
        this.columnSettingsButton = this.page.getByLabel('Column Settings')
        this.columns = this.page.getByRole('columnheader')
        
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
        const partnerDetails = await utils.findPartnerDetails(this.page, partnerType)
    
        console.log("Selected partner " + partnerDetails.partnerName + " as a " + partnerType)

        await partnerDetails.button.click()
        await expect(this.applyButton).toBeEnabled()
        await this.applyButton.click()

        await expect(this.page.getByText('Partners assigned to the job #' + this.jobDetails.jobId)).toBeVisible()
        
        const viewMorePartners = await this.page.locator('//div[@data-id=' + this.jobDetails.jobId + ']/descendant::*[contains(text(), "VIEW MORE")]')
        if (await viewMorePartners.isVisible()){
            await viewMorePartners.click()
        }
        
        await expect(this.page.locator('//div[@data-id="' + this.jobDetails.jobId + '" and .//p[text()="' + partnerType + '"]]//parent::p[@aria-label="' + partnerDetails.partnerName + '"]')).toBeVisible()
    } 
    
    async clickOnStatus(status) {
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
            await this.confirmStatusChangeButton.click()

            await utils.waitLoadToFinish(this.page)
            const filterPage = new FilterPage(this.page)
            await filterPage.checkFiltersWereApplied()

            statusButton = await this.page.locator(statusLocator).first()
            await expect(statusButton).toHaveText(newStatus)

            console.log(partnerName + ", assigned as a " + partnerType + " partner to job " + jobId + ", had their status successfully updated from " + currentStatus + " to " + newStatus)
        } else {
            await this.cancelButton.click()

            await utils.waitLoadToFinish(this.page)
            statusButton = await this.page.locator(statusLocator).first()
            await expect(statusButton).toHaveText(currentStatus)

            console.log("Tried selecting status change from " + currentStatus + " to " + newStatus + " then canceled")
        }
    }

    async checkColumnList(defaultColumnList) {
        const pageColumnList = await this.columns.allInnerTexts()
        await expect(this.selectAllCheckbox).toBeVisible()
        await expect(this.columnSettingsButton).toBeVisible()
        expect(pageColumnList.filter(Boolean), "Should have all default columns and in order").toEqual(defaultColumnList)
    }

    async removePartner(jobId, partnerName, partnerType) {
        const jobLocator = '//div[@data-id="' + jobId + '"]/descendant::*[text()="' + partnerType + '"]/following-sibling::*/descendant::*[text()="' + partnerName + '"]'
        await expect(this.page.locator(jobLocator)).toBeVisible()
        await this.removePartnerOption.click()
        await this.removePartnerButton.click()
        await expect(this.page.locator(jobLocator)).not.toBeVisible()
    }

    async selectChangeStatus() {
        await this.changeStatusOption.hover()
    }

    async selectJobAndAssignPartner(partnerType) {
        this.jobDetails = await utils.findJobDetailsToAssignPartner(this.page, partnerType)
        await this.jobDetails.button.click()
        console.log("Selected job with jobid: " + this.jobDetails.jobId + " for " + partnerType)
        await utils.waitLoadToFinish(this.page)
    }

    async selectJobToAddNewPartner(partnerType, isPrimaryType) {
        this.jobDetails = await utils.findJobDetailsForAddNew(this.page, partnerType, isPrimaryType)
        await this.jobDetails.button.click()
        
        console.log("Clicked on job with jobid: " + this.jobDetails.jobId + " for adding " + partnerType)
        await utils.waitLoadToFinish(this.page)
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

    async sortRandomColumn(column, order) {
        const selectedColumn = await this.columns.filter({ hasText: column })
        const type = await selectedColumn.getAttribute('data-field')
        const sortButton = await selectedColumn.getByRole("presentation").getByLabel("Sort")
        let listOrder
        if (order === "Ascending") {
            listOrder = await sortButton.getByTestId("ArrowUpwardIcon")
        } else if (order === "Descending") {
            listOrder = await sortButton.getByTestId("ArrowDownwardIcon")
        }

        while (!(await listOrder.isVisible())) {
            await selectedColumn.hover()
            await sortButton.click()
        }
        await this.page.waitForLoadState('domcontentloaded')
        
        let listLocator
        let allValues

        switch (type) {
            case 'jobNumber':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]/descendant::*[@class="MuiBox-root mui-style-70qvj9"]').allTextContents()
                allValues = listLocator.map((element) => {
                    return parseInt(element, 10)
                })
                break
            case 'jobDate':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]').allTextContents()
                const date = listLocator.map((element) => {
                    return Date.parse(element)
                })
                allValues = date.slice(1)
                break
            case 'depositionDate':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]').allTextContents()
                const time = listLocator.map((element) => {
                    const spaceOnly = element.replace(":", " ")
                    const array = spaceOnly.split(" ")
                    let hours = parseInt(array[0])
                    const minutes = parseInt(array[1])
                    if (array[2] === "PM" && hours != 12)
                        hours = hours + 12
                    const total = hours * 60 + minutes
                    return total
                })
                allValues = time.slice(1)
                break
            case 'caseName':
            case 'schedulingClient':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]/descendant::*[@class="MuiBox-root mui-style-0"]').allTextContents()
            case 'location':
            case 'locationCity':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]').allTextContents()
                const lowerCase = listLocator.map((element) => {
                    return element.toLowerCase()
                })
                allValues = lowerCase.slice(1)
                break
            default:
                strings = "No value found"
        }

        let expectedResult
        for (let i = 0; i < allValues.length - 1; i++) {
            if (order === "Ascending") {
                expectedResult = allValues[i] <= allValues[i+1]
            } else if (order === "Descending") {
                expectedResult = allValues[i] >= allValues[i+1]
            }    
            //toBeGreater only works for int/float, and we are comparing sorting with strings, dates and so on
            expect(expectedResult).toBe(true)
        }
    }
}
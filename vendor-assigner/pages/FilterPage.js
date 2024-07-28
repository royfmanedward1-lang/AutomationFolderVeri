import * as utils from '../utility/utils.js'
import { expect } from '@playwright/test'
import { FilterJobPage } from './FilterJobPage.js'

export class FilterPage {
    constructor(page){
        this.page = page
        this.failedToSetFiltersAlert = this.page.getByText('Jobs were unable to be loaded. Please try again')
        this.refreshedAlert = this.page.getByText('Job List refreshed successfully')
        this.setFilterSuccessfulAlert = this.page.getByText('Filters successfully applied')
        this.removeFilterIcon = this.page.getByTestId('CancelIcon')
        this.filterThreeDots = this.page.getByTestId('MoreHorizIcon')
        this.clearAllFiltersButton = this.page.getByTestId('clearAllId').getByTestId('CancelIcon')
        this.refreshButton = this.page.getByRole('button', { name: 'REFRESH' })
    }

    async clearAllFilters() {
        if (await this.removeFilterIcon.first().isVisible()) {
            await expect(this.clearAllFiltersButton.or(this.filterThreeDots)).toBeVisible()
            if (await this.filterThreeDots.isVisible())
                this.filterThreeDots.click()
            await this.clearAllFiltersButton.click()
        }
        await this.checkFiltersWereApplied()
    }
    
    //start end date para optional
    async changeFilterDate(start, end) {
        const startDate = start || process.env.START_DATE
        const endDate = end || process.env.END_DATE
        if (startDate != undefined && endDate != undefined) {
            const filterDate = await this.page.getByPlaceholder('MM/DD/YYYY – MM/DD/YYYY')
            await filterDate.fill(startDate + " – " + endDate)
            await filterDate.fill(startDate + " – " + endDate)
            await this.page.locator('//button[@id=":r2:"]').click()
            await utils.waitLoadToFinish(this.page)
            await this.checkFiltersWereApplied()
        }
    }

    async checkFiltersWereApplied() {
        if (this.failedToSetFiltersAlert.isVisible()) {
            await this.refreshButton.click()
            await utils.waitLoadToFinish(this.page)
        }
    }
    async getTotalJobs() {
        return await this.page.getByRole('grid').getAttribute('aria-rowcount') - 1
    }

    async setAverageJobAmount(minJobs, maxJobs) {
        const filterJobPage = new FilterJobPage(this.page)
        let jobAmount = await this.getTotalJobs()
        let tries = 0
        do {
            if (tries > 3){
                console.log('"Could not set jobs to average amount. Jobs To Test: ' + jobAmount + '"')
                break
            }
            else if (jobAmount > maxJobs) {
                if (await this.removeFilterIcon.first().isVisible()) {
                    await this.removeFilterIcon.first().click()
                } else {
                    await filterJobPage.applyRandomDivisionAsFilter() //no filters means max 400 jobs appear
                }
            } 
            else if (jobAmount < minJobs) {
                await filterJobPage.applyRandomDivisionAsFilter()
            }
            await utils.waitLoadToFinish(this.page)
            jobAmount = await this.getTotalJobs()
            tries++
        } while (jobAmount < minJobs || jobAmount > maxJobs)
        
        console.log("There is a good amount of jobs available to run the test: " + jobAmount)
    }

    
}
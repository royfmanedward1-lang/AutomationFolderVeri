const { start } = require("repl")

exports.FilterPage = class FilterPage {
    constructor(page){
        this.page= page
    }

    async clearAllFilters() {
        try {
            await this.page.getByTestId('MoreHorizIcon').click({ timeout: 3000}) //Looking for three dots
        } catch (error) {}
        try {
            await this.page.getByTestId('clearAllId').getByTestId('CancelIcon').click({ timeout: 10000})
        } catch (error) {}
 
    }
//start end date para optional
    async changeFilterDate(start, end) {
        const startDate = start || process.env.START_DATE
        const endDate = end || process.env.END_DATE
        if (startDate != undefined && endDate != undefined) {
            const filterDate = await this.page.getByPlaceholder('MM/DD/YYYY – MM/DD/YYYY')
            await filterDate.fill(startDate + " – " + endDate)
            await filterDate.fill(startDate + " – " + endDate)
            await this.page.locator('//button[@id=":r2:"]').waitFor()
            await this.page.locator('//button[@id=":r2:"]').click()
        }
    }
}
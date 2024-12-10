import { expect } from '@playwright/test';

export class AssignmentPage {
    constructor(page){
        this.page = page;
        this.jobDetails;

        this.selectAllCheckbox = this.page.getByLabel('Select all rows');
        this.columnSettingsButton = this.page.getByLabel('Column Settings');
        this.columns = this.page.getByRole('columnheader');

        //Job List
        this.assignPartnerButton = this.page.getByRole('button', {name: 'Assign'});
        this.addNewButton = this.page.getByRole('button', {name: 'Add New'});
        
        //Partner Types Dialog
        this.partnerTypesBlankCheckbox = this.page.getByRole('dialog').getByTestId('CheckBoxOutlineBlankIcon');
        this.selectLanguageList = this.page.getByText('Select a Language');
        
        //Partner Status
        this.partnerStatusButton = page.locator('//*[@aria-label="Select Partner Status"]');
        this.changeStatusOption = page.getByRole('option', { name: 'Change Status' });
        this.removePartnerOption = page.getByRole('option', { name: 'Remove Partner' });
        
        //Confirmation Modal
        this.confirmationPopup = this.page.getByRole('dialog');
        this.confirmStatusChangeButton = page.getByRole('button', { name: 'Yes, Change' });
        this.removePartnerButton = page.getByRole('button', { name: 'Remove' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    };
    
    async clickOnStatus(status) {
        await status.click()
    }

    async checkColumnList(defaultColumnList) {
        const pageColumnList = await this.columns.allInnerTexts();
        await expect(this.selectAllCheckbox).toBeVisible();
        await expect(this.columnSettingsButton).toBeVisible();
        expect(pageColumnList.filter(Boolean), "Should have all default columns and in order").toEqual(defaultColumnList);
    };

    async removePartner(jobId, partnerName, partnerType) {
        const jobLocator = '//div[@data-id="' + jobId + '"]/descendant::*[text()="' + partnerType + '"]/following-sibling::*/descendant::*[text()="' + partnerName + '"]';
        await expect(this.page.locator(jobLocator)).toBeVisible();
        await this.removePartnerOption.click();
        await this.removePartnerButton.click();
        await expect(this.page.locator(jobLocator)).not.toBeVisible();
    };

    async sortRandomColumn(column, order) {
        const selectedColumn = await this.columns.filter({ hasText: column });
        const type = await selectedColumn.getAttribute('data-field');
        const sortButton = await selectedColumn.getByRole("presentation").getByLabel("Sort");
        let listOrder;
        if (order === "Ascending") {
            listOrder = await sortButton.getByTestId("ArrowUpwardIcon");
        } else if (order === "Descending") {
            listOrder = await sortButton.getByTestId("ArrowDownwardIcon");
        };

        while (!(await listOrder.isVisible())) {
            await selectedColumn.hover();
            await sortButton.click({ force: true });
        };
        await this.page.waitForLoadState('domcontentloaded');
        
        let listLocator;
        let allValues;

        switch (type) {
            case 'jobNumber':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]/descendant::*[@class="MuiBox-root mui-style-70qvj9"]').allTextContents();
                allValues = listLocator.map((element) => {
                    return parseInt(element, 10);
                });
                break;
            case 'jobDate':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]').allTextContents();
                const date = listLocator.map((element) => {
                    return Date.parse(element);
                });
                allValues = date.slice(1);
                break;
            case 'depositionDate':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]').allTextContents();
                const time = listLocator.map((element) => {
                    const spaceOnly = element.replace(":", " ");
                    const array = spaceOnly.split(" ");
                    let hours = parseInt(array[0]);
                    const minutes = parseInt(array[1]);
                    if (array[2] === "PM" && hours != 12);
                        hours = hours + 12;
                    const total = hours * 60 + minutes;
                    return total;
                });
                allValues = time.slice(1);
                break;
            case 'caseName':
            case 'schedulingClient':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]/descendant::*[@class="MuiBox-root mui-style-0"]').allTextContents();
            case 'location':
            case 'locationCity':
                listLocator = await this.page.locator('//*[@data-field="' + type + '"]').allTextContents();
                const lowerCase = listLocator.map((element) => {
                    return element.toLowerCase();
                });
                allValues = lowerCase.slice(1);
                break;
            default:
                strings = "No value found";
        };

        let expectedResult;
        for (let i = 0; i < allValues.length - 1; i++) {
            if (order === "Ascending") {
                expectedResult = allValues[i] <= allValues[i+1];
            } else if (order === "Descending") {
                expectedResult = allValues[i] >= allValues[i+1];
            };
            //toBeGreater only works for int/float, and we are comparing sorting with strings, dates and so on
            expect(expectedResult).toBe(true);
        };
    };
};
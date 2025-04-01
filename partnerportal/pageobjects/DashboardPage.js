class DashboardPage {
    static sortOptions = [
        { value: 'caption-asc', text: 'Caption (A-Z)' },
        { value: 'caption-desc', text: 'Caption (Z-A)' },
        { value: 'dueDate-asc', text: 'Due Date (Oldest First)' },
        { value: 'dueDate-desc', text: 'Due Date (Newest First)' },
        { value: 'depositionDate-asc', text: 'Job Date (Oldest First)' },
        { value: 'depositionDate-desc', text: 'Job Date (Newest First)' },
        { value: 'jobId-asc', text: 'Job Number (0-9)' },
        { value: 'jobId-desc', text: 'Job Number (9-0)' }
    ];

    constructor(page) {
        this.page = page;
        this.dashboardLink = page.locator('a.jss424[href="#/app/dashboard"]');
        this.yourJobsTitle = page.locator('h4.MuiTypography-root.jss448');
        this.toAcceptFilter = page.locator('text=To Accept');
        this.upcomingFilter = page.locator('text=Upcoming');
        this.dueNowFilter = page.locator('text=Due Now');
        this.inProgressFilter = page.locator('text=In Progress');
        this.backOrderedFilter = page.locator('text=Back Ordered');
        this.completedFilter = page.locator('text=Completed');
        this.canceledFilter = page.locator('text=Canceled');
        this.sortByDropdown = page.locator('select.MuiSelect-outlined');
        this.moreItemsButton = page.locator('button[name="more-items-button"]');
        this.newsSwitch = page.locator('label:has-text("News") .MuiSwitch-input');
        this.newsSwitchLabel = page.locator('.MuiFormControlLabel-label:has-text("News")');
        this.newsModal = page.locator('.MuiDialog-paper');
        this.newsModalTitle = page.locator('#dialog-title span');
        this.newsModalContent = page.locator('#modal-description');
        this.newsModalCloseButton = page.locator('.MuiDialogActions-root button:has-text("Close")');
        this.newsCardTitles = page.locator('.MuiImageListItemBar-title span');
        this.newsCards = page.locator('.MuiImageListItem-root');
        this.newsCardTitles = page.locator('.MuiImageListItemBar-title span');
        this.jobCards = page.locator('.jss5130 .MuiPaper-root');
        this.jobTitles = page.locator('.jss5130 h6.MuiTypography-h6');
        this.clientNames = page.locator('.jss5130 .MuiGrid-container p.MuiTypography-body2').first();
        this.jobInfoLines = page.locator('.jss5130 p.MuiTypography-body2:has-text("-")');
        this.jobDateLines = page.locator('.jss5130 p.MuiTypography-body2:has-text("Job Date")');
        this.dueDateLines = page.locator('.jss5130 p.MuiTypography-body2:has-text("Due Date")');
        this.vendorTypeCells = page.locator('.jss5130 table tbody tr td:first-child p');
    }

    async waitForPageLoad() {
        await this.yourJobsTitle.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToDashboard() {
        await this.dashboardLink.click();
    }

    async isYourJobsTitleVisible() {
        return await this.yourJobsTitle.isVisible();
    }

    async areAllFiltersVisible() {
        const filters = [
            this.toAcceptFilter,
            this.upcomingFilter,
            this.dueNowFilter,
            this.inProgressFilter,
            this.backOrderedFilter,
            this.completedFilter,
            this.canceledFilter
        ];
        for (const filter of filters) {
            if (!(await filter.isVisible())) {
                return false;
            }
        }
        return true;
    }

    async getSortOptions() {
        const options = await this.sortByDropdown.evaluate(select => 
            Array.from(select.options).map(option => ({
                value: option.value,
                text: option.text
            }))
        );
        return options;
    }

    async selectSortOption(option) {
        await this.sortByDropdown.selectOption(option);
    }

    async getCurrentSortOption() {
        return await this.sortByDropdown.inputValue();
    }

    async clickFilter(filterName) {
        switch (filterName.toLowerCase()) {
            case 'to accept':
                await this.toAcceptFilter.click();
                break;
            case 'upcoming':
                await this.upcomingFilter.click();
                break;
            case 'due now':
                await this.dueNowFilter.click();
                break;
            case 'in progress':
                await this.inProgressFilter.click();
                break;
            case 'back ordered':
                await this.backOrderedFilter.click();
                break;
            case 'completed':
                await this.completedFilter.click();
                break;
            case 'canceled':
                await this.canceledFilter.click();
                break;
        }
    }

    async clickMoreItemsButton() {
        await this.moreItemsButton.click();
    }

    async isNewsSwitchEnabled() {
        return await this.newsSwitch.isChecked();
    }

    async isNewsModalVisible() {
        return await this.newsModal.isVisible();
    }

    async getNewsModalTitle() {
        return await this.newsModalTitle.textContent();
    }

    async closeNewsModal() {
        await this.newsModalCloseButton.click();
    }

    async getNewsCardTitle(index) {
        const title = this.newsCardTitles.nth(index);
        return await title.textContent();
    }

    async clickNewsCard(index) {
        const card = this.newsCards.nth(index);
        await card.click();
    }

    async getNewsCardTitle(index) {
        const title = this.newsCardTitles.nth(index);
        return await title.textContent();
    }

    async getJobTitle(index = 0) {
        return await this.jobTitles.nth(index).textContent();
    }

    async getClientName(index = 0) {
        return await this.clientNames.nth(index).textContent();
    }

    async getJobInfo(index = 0) {
        const infoText = await this.jobInfoLines.nth(index).textContent();
        const matches = infoText.match(/([A-Z]+)\s+(\d+)\s+-\s+(.+)/);
        if (matches && matches.length >= 4) {
            return {
                division: matches[1],
                jobNumber: matches[2],
                status: matches[3].trim()
            };
        }
        return null;
    }

    async getJobDate(index = 0) {
        const dateText = await this.jobDateLines.nth(index).textContent();
        return dateText.replace('Job Date:', '').trim();
    }
    
    async getDueDate(index = 0) {
        const dateText = await this.dueDateLines.nth(index).textContent();
        return dateText.replace('Due Date:', '').trim();
    }
    
    async getVendorTypes(index = 0) {
        const table = this.vendorTypeTables.nth(index);
        const rows = table.locator('tbody tr');
        const count = await rows.count();
        const types = [];
        for (let i = 0; i < count; i++) {
            const typeCell = rows.nth(i).locator('td:first-child p');
            types.push(await typeCell.textContent());
        }
        return types;
    }

    async hasJobCards() {
        return (await this.jobCards.count()) > 0;
    }

    async getJobCount() {
        return await this.jobCards.count();
    }

    async validateFirstJobCard() {
        const hasTitle = await this.jobTitles.first().isVisible();
        const hasClientName = await this.clientNames.first().isVisible();
        const hasJobInfo = await this.jobInfoLines.first().isVisible();
        const hasJobDate = await this.jobDateLines.first().isVisible();
        const hasDueDate = await this.dueDateLines.first().isVisible();
        return {
            hasTitle,
            hasClientName,
            hasJobInfo,
            hasJobDate,
            hasDueDate,
            allPresent: hasTitle && hasClientName && hasJobInfo && hasJobDate && hasDueDate
        };
    }

    async isJobInfoComplete() {
        const hasTitle = await this.jobTitle.isVisible();
        const hasClientName = await this.clientName.isVisible();
        const hasJobInfo = await this.jobInfoLine.isVisible();
        const hasJobDate = await this.jobDateLine.isVisible();
        const hasDueDate = await this.dueDateLine.isVisible();
        const hasVendorType = await this.vendorTypes.first().isVisible();
        console.log({
            hasTitle,
            hasClientName,
            hasJobInfo,
            hasJobDate,
            hasDueDate,
            hasVendorType
        });

        return hasTitle && hasClientName && hasJobInfo && hasJobDate && hasDueDate && hasVendorType;
    }
}

module.exports = DashboardPage;
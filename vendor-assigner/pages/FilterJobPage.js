import * as utils from "../utility/utils.js"
import { expect } from "@playwright/test"
const timer = 3000;
export class FilterJobPage {
    constructor(page) {
        this.page = page
        this.filterButton = page.getByTestId('jobFilter')
        this.filterPreset = page.locator('#filter-preset')
        this.filterPresetDefaultOption = page.getByRole('option', { name: 'System Default' })
        this.filterDivisions = page.locator('#filter-divisions')
        this.filterCoverageAreas = page.locator('#filter-coverageAreas')
        this.filterLocation = page.locator('#filter-locationTypes')
        this.filterMenu = page.locator('#menu- > .MuiBackdrop-root')
        this.filterPartner = page.locator('#filter-serviceTypes')
        this.filterStatus = page.locator('#filter-jobStatuses')
        this.filterProceeding = page.locator('#filter-proceedingTypes')
        this.filterServices = page.locator('#filter-services')
        this.createEditToggle = page.getByLabel('Create/Edit Preset')
        this.defaultCheckbox = page.locator('#set-as-default-checkbox')
        this.createFilterTextbox = page.locator('#create-filter-preset-textbox')
        this.buttonSave = page.getByRole('button', { name: 'Save' })
        this.buttonSaveNew = page.getByRole('menuitem', { name: 'Save as new' })
        this.buttonUpdatePreset = page.getByRole('menuitem', { name: 'Update preset' })
        this.buttonDelete = page.getByRole('button', { name: 'DELETE' })
        this.buttonApply = page.locator('#apply-button')
        this.successAlertSaved = page.getByText('Filter preset saved.')
        this.noJobMatched = page.getByText('No Jobs match selected filters')
        this.successAlertUpdated = page.getByText('Filter preset updated.')
        this.buttonCloseFilter = page.getByRole('button', { name: 'Close' })
        this.successAlertError = page.getByText('Your preset could not be saved. No filters have been selected. Please select filters before proceeding.')
    }

    async clickWithDelay(element, delay) {
        await this.page.waitForTimeout(delay);
        await element.click();
    }

    async applyRandomDivisionAsFilter() {
        const division = await this.getRandomItems('divisions', 1)
        await this.filterButton.click()
        await this.setFilter(this.page, 'division', division)
        await this.buttonApply.click()
    }

    async applyOnlyValidJobs() {
        //let statuses = ["Confirmed", "Invoiced", "Scheduled", "Wait for call"]
        let statuses = ["Archived", "Cancelled", "Closed"]
        await this.filterButton.click()
        await this.setFilter(this.page, 'status', statuses)
        await this.buttonApply.click()
        await utils.waitLoadToFinish(this.page)
    }

    getRandomItems = async (type, number) => {
        const divisions = [
            "California",
            "Florida",
            "Canada",
            "Mountain",
            "National",
            "Central",
            "Northeast",
            "South",
            "Texas",
            "Corporate",
            "New Jersey"
        ];
        const locations = [
            "Veritext",
            "Client",
            "Remote",
            "Other",
            "TBD"
        ];
        const partners = [
            "Court Reporter",
            "Interpreter",
            "Videographer",
            "Transcriber"
        ];
        const statuses = [
            "Archived",
            "Cancelled",
            "Closed",
            "Confirmed",
            "Invoiced",
            "Scheduled",
            "Wait for call"
        ];
        const proceeding = [
            "Arbitration",
            "Asbestos",
            "Boardroom Rental Only",
            "Captioning/Cart",
            "CNA",
            "Courts/Trials/Bankruptcy",
            "Cross-Examination",
            "Depositions",
            "Discovery / Questioning",
            "EUO/Statement"
        ];
        const services = [
            "Audio/Video Transcription",
            "Conference Call",
            "Loaner Laptop(s)",
            "Realtime",
            "Remote Realtime",
            "Rough Draft",
            "Tech Support",
            "Time Stamping",
            "Day In the Life",
            "Duplicate Video"
        ];
        let strings
        switch (type) {
            case 'divisions':
                strings = divisions
                break
            case 'locations':
                strings = locations
                break
            case 'partners':
                strings = partners
                break
            case 'statuses':
                strings = statuses
                break
            case 'proceeding':
                strings = proceeding
                break
            case 'services':
                strings = services
                break
            default:
                strings = "No value found";
        }

        for (let i = strings.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [strings[i], strings[j]] = [strings[j], strings[i]];
        }
        return strings.slice(0, number);
    }

    setFilter = async (page, combo, items) => {
        let comboLocator
        let filterMenu = page.locator('#menu- > .MuiBackdrop-root')
        switch (combo) {
            case 'division':
                comboLocator = '#filter-divisions'
                break
            case 'location':
                comboLocator = '#filter-locationTypes'
                break
            case 'partners':
                comboLocator = '#filter-serviceTypes'
                break
            case 'status':
                comboLocator = '#filter-jobStatuses'
                break
            case 'proceeding':
                comboLocator = '#filter-proceedingTypes'
                break
            case 'service':
                comboLocator = '#filter-services'
                break
            default:
                strings = "No value found";
        }

        let filterCombo = page.locator(comboLocator)
        await filterCombo.click()
        if (combo == 'division') {
            await this.unSelectAllComboBox(page, true, filterCombo)
        }
        else {
            await this.unSelectAllComboBox(page, false, filterCombo)
        }
        for (const item of items) {
            await page.getByRole('option', { name: item, exact: true }).first().click()
        }
        await filterMenu.click()

    }

    unSelectAllComboBox = async (page, isDivision, comboBox) => {
        if (isDivision) {
            const divisionItemsId = await comboBox.getAttribute('aria-controls')
            const divisionItemsParent = await page.locator(`[id='${divisionItemsId}']`)
            const divisionItems = await divisionItemsParent.locator('li')
            for (let index = 0; index < await divisionItems.count(); index++) {
                const element = await divisionItems.nth(index);
                const isSelected = await element.getAttribute('aria-selected')
                if (isSelected == 'true') {
                    await element.click()
                }
            }
        }
        else {
            const itemsId = await comboBox.getAttribute('aria-controls')
            const itemsParent = await page.locator(`[id='${itemsId}']`)
            const items = await itemsParent.locator('li')
            const element = await items.nth(0)
            if (await element.getAttribute('tabindex') == '-1') {
                await element.click()
            }
            else {
                await element.click()
                await element.click()
            }
        }
    }

    comboBoxItemsCount = async (page, comboBox) => {
        const itemsId = await comboBox.getAttribute('aria-controls')
        const itemsParent = await page.locator(`[id='${itemsId}']`)
        const items = await itemsParent.locator('li')
        return await items.count()
    }

    createFilter = async (name, isCoverage) => {
        let divisions
        if (isCoverage) {
            divisions = await this.getRandomItems('divisions', 1)
        }
        else {
            divisions = await this.getRandomItems('divisions', 3)
        }
        let locations = await this.getRandomItems('locations', 3)
        let partners = await this.getRandomItems('partners', 3)
        let statuses = await this.getRandomItems('statuses', 3)
        let proceeding = await this.getRandomItems('proceeding', 3)
        let services = await this.getRandomItems('services', 3)
        await utils.waitGridToLoad(this.page)
        await this.filterButton.click()
        await this.setFilter(this.page, 'division', divisions)
        await this.setFilter(this.page, 'location', locations)
        await this.setFilter(this.page, 'partners', partners)
        await this.setFilter(this.page, 'status', statuses)
        await this.setFilter(this.page, 'proceeding', proceeding)
        await this.setFilter(this.page, 'service', services)
        await this.createEditToggle.click()
        await this.defaultCheckbox.click()
        await this.createFilterTextbox.fill(name)
        await this.buttonSave.click()
        await this.buttonSaveNew.click()
        await this.clickWithDelay(this.buttonApply, timer)
    }

    createFilterWithoutSelectingFilters = async (name) => {
        await utils.waitGridToLoad(this.page)
        await this.filterButton.click()
        await this.filterPreset.click()
        await this.filterPresetDefaultOption.click()
        await this.filterDivisions.click()
        await this.unSelectAllComboBox(this.page, true, this.filterDivisions)
        await this.filterMenu.click()
        await this.filterLocation.click()
        await this.unSelectAllComboBox(this.page, false, this.filterLocation)
        await this.filterMenu.click()
        await this.filterPartner.click()
        await this.unSelectAllComboBox(this.page, false, this.filterPartner)
        await this.filterMenu.click()
        await this.filterStatus.click()
        await this.unSelectAllComboBox(this.page, false, this.filterStatus)
        await this.filterMenu.click()
        await this.filterProceeding.click()
        await this.unSelectAllComboBox(this.page, false, this.filterProceeding)
        await this.filterMenu.click()
        await this.filterServices.click()
        await this.unSelectAllComboBox(this.page, false, this.filterServices)
        await this.filterMenu.click()
        await this.createEditToggle.click()
        await this.defaultCheckbox.click()
        await this.createFilterTextbox.fill(name)
        await this.buttonSave.click()
        await this.buttonSaveNew.click()
        await expect(this.buttonApply).toBeDisabled()
    }

    updateFilter = async (name) => {
        await this.filterButton.click()
        await this.createEditToggle.click()
        await this.createFilterTextbox.fill(name)
        await this.clickWithDelay(this.buttonSave, timer)
        await this.clickWithDelay(this.buttonUpdatePreset, timer)
        await this.successAlertUpdated.first().waitFor({ state: 'visible' })
        await this.successAlertUpdated.first().waitFor({ state: 'detached' })
        await this.buttonApply.click()
    }

    deleteFilter = async (name) => {
        await this.clickWithDelay(this.filterButton, timer)
        await this.filterPreset.click()
        const filterCurrentPreset = this.page.getByRole('option', { name: `${name}` })
        await filterCurrentPreset.click();
        await this.createEditToggle.click()
        await this.clickWithDelay(this.buttonDelete, timer)
        const successAlertDelete = await this.page.getByText(`Your Filter Preset ${name} has successfully been deleted.`)
        await successAlertDelete.waitFor({ state: 'visible' })
        await expect(successAlertDelete).toHaveText(`Your Filter Preset ${name} has successfully been deleted.`)
        await this.buttonCloseFilter.click()
    }

    async setNewFilters() {
        let statuses = ["Confirmed", "Invoiced", "Scheduled", "Wait for call"]
        await this.filterButton.click()
        const division = await this.getRandomItems('divisions', 1)
        await this.setFilter(this.page, 'division', division)
        await this.setFilter(this.page, 'status', statuses)
        await this.buttonApply.click()
        await utils.waitLoadToFinish(this.page)
    }
}

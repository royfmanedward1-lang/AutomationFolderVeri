import { expect } from "@playwright/test"
import * as utils from '../utility/utils'
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
        this.successAlertUpdated = page.getByText('Filter preset updated.')
        this.buttonCloseFilter = page.getByRole('button', { name: 'Close' })
        this.successAlertError = page.getByText('Your preset could not be saved. No filters have been selected. Please select filters before proceeding.')
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
        if (type == 'divisions') {
            strings = divisions
        } else if (type === 'locations') {
            strings = locations;
        } else if (type === 'partners') {
            strings = partners;
        } else if (type === 'statuses') {
            strings = statuses;
        } else if (type === 'proceeding') {
            strings = proceeding;
        } else if (type === 'services') {
            strings = services;
        }

        for (let i = strings.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [strings[i], strings[j]] = [strings[j], strings[i]];
        }
        return strings.slice(0, number);
    }

    unSelectAllComboBox = async (page, comboBox) => {
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

    unSelectAllComboBoxDivisions = async () => {
        const divisionItemsId = await this.filterDivisions.getAttribute('aria-controls')
        const divisionItemsParent = await this.page.locator(`[id='${divisionItemsId}']`)
        const divisionItems = await divisionItemsParent.locator('li')
        for (let index = 0; index < await divisionItems.count(); index++) {
            const element = await divisionItems.nth(index);
            const isSelected = await element.getAttribute('aria-selected')
            if (isSelected == 'true') {
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

    createFilter = async (name) => {
        let divisions = await this.getRandomItems('divisions', 3)
        let locations = await this.getRandomItems('locations', 3)
        let partners = await this.getRandomItems('partners', 3)
        let statuses = await this.getRandomItems('statuses', 3)
        let proceeding = await this.getRandomItems('proceeding', 3)
        let services = await this.getRandomItems('services', 3)
        await this.filterButton.click()
        await utils.setFilter(this.page, 'division', divisions)
        await utils.setFilter(this.page, 'location', locations)
        await utils.setFilter(this.page, 'partners', partners)
        await utils.setFilter(this.page, 'status', statuses)
        await utils.setFilter(this.page, 'proceeding', proceeding)
        await utils.setFilter(this.page, 'service', services)
        await this.createEditToggle.click()
        await this.defaultCheckbox.click()
        await this.createFilterTextbox.fill(name)
        await this.buttonSave.click()
        await this.buttonSaveNew.click()
        await this.buttonApply.click()
    }

    createFilterWithCoverage = async (name) => {
        let divisions = await this.getRandomItems('divisions', 1)
        let locations = await this.getRandomItems('locations', 3)
        let partners = await this.getRandomItems('partners', 3)
        let statuses = await this.getRandomItems('statuses', 3)
        let proceeding = await this.getRandomItems('proceeding', 3)
        let services = await this.getRandomItems('services', 3)
        await this.filterButton.click()
        await utils.setFilter(this.page, 'division', divisions)
        await utils.setFilter(this.page, 'location', locations)
        await utils.setFilter(this.page, 'partners', partners)
        await utils.setFilter(this.page, 'status', statuses)
        await utils.setFilter(this.page, 'proceeding', proceeding)
        await utils.setFilter(this.page, 'service', services)
        await this.createEditToggle.click()
        await this.defaultCheckbox.click()
        await this.createFilterTextbox.fill(name)
        await this.buttonSave.click()
        await this.buttonSaveNew.click()
        await this.buttonApply.click()
    }

    createFilterWithoutSelectingFilters = async (name) => {
        await this.filterButton.click()
        await this.filterPreset.click()
        await this.filterPresetDefaultOption.click()
        await this.filterDivisions.click()
        await this.unSelectAllComboBox(this.page, this.filterDivisions)
        await this.filterMenu.click()
        await this.filterLocation.click()
        await this.unSelectAllComboBox(this.page, this.filterLocation)
        await this.filterMenu.click()
        await this.filterPartner.click()
        await this.unSelectAllComboBox(this.page, this.filterPartner)
        await this.filterMenu.click()
        await this.filterStatus.click()
        await this.unSelectAllComboBox(this.page, this.filterStatus)
        await this.filterMenu.click()
        await this.filterProceeding.click()
        await this.unSelectAllComboBox(this.page, this.filterProceeding)
        await this.filterMenu.click()
        await this.filterServices.click()
        await this.unSelectAllComboBox(this.page, this.filterServices)
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
        await this.buttonSave.click()
        await this.buttonUpdatePreset.click()
        await this.buttonApply.click()
    }

    deleteFilter = async (name) => {
        await this.filterButton.click()
        await this.createEditToggle.click()
        await this.buttonDelete.click()
        const successAleetDelete = await this.page.getByText(`Your Filter Preset ${name} has successfully been deleted.`)
        await expect(successAleetDelete).toHaveText(`Your Filter Preset ${name} has successfully been deleted.`)
        await this.buttonCloseFilter.click()
    }
}

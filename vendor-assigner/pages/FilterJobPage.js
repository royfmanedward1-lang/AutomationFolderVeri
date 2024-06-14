import { expect } from "@playwright/test"

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

    getRandomItems = async (type) => {
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
        return strings.slice(0, 3);
    }

    selectComboBoxItems = async (page, items) => {
        for (const item of items) {
            await page.getByRole('option', { name: item, exact: true }).first().getByRole('checkbox').check()
        }
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

    selectFirstComboBoxDivision = async () => {
        const divisionItemsId = await this.filterDivisions.getAttribute('aria-controls')
        const divisionItemsParent = await this.page.locator(`[id='${divisionItemsId}']`)
        const divisionItems = await divisionItemsParent.locator('li')
        await divisionItems.nth(0).click()
    }

    selectFirstComboBox = async (page, comboBox) => {
        const itemsId = await comboBox.getAttribute('aria-controls')
        const itemsParent = await page.locator(`[id='${itemsId}']`)
        const items = await itemsParent.locator('li')
        await items.nth(1).click()
    }

    selectFirstComboBoxService = async (page, comboBox) => {
        const itemsId = await comboBox.getAttribute('aria-controls')
        const itemsParent = await page.locator(`[id='${itemsId}']`)
        const items = await itemsParent.locator('li')
        await items.nth(2).click()
    }

    createFilter = async (name) => {
        await expect(this.filterButton).toHaveText('FILTER')
        await this.filterButton.click()
        await expect(this.filterPreset).toBeVisible()
        await this.filterPreset.click()
        await this.filterPresetDefaultOption.click()
        await expect(this.filterDivisions).toBeVisible()
        await this.filterDivisions.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterDivisions)).toBeGreaterThan(0)
        await this.unSelectAllComboBoxDivisions()
        await this.selectComboBoxItems(this.page, await this.getRandomItems('divisions'))
        await this.filterMenu.click()
        await expect(this.filterCoverageAreas).toBeDisabled()
        await expect(this.filterLocation).toBeVisible()
        await this.filterLocation.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterLocation)).toBeGreaterThan(0)
        await this.unSelectAllComboBox(this.page, this.filterLocation)
        await this.selectComboBoxItems(this.page, await this.getRandomItems('locations'))
        await this.filterMenu.click()
        await expect(this.filterPartner).toBeVisible()
        await this.filterPartner.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterPartner)).toBeGreaterThan(0)
        await this.unSelectAllComboBox(this.page, this.filterPartner)
        await this.selectComboBoxItems(this.page, await this.getRandomItems('partners'))
        await this.filterMenu.click()
        await this.filterStatus.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterStatus)).toBeGreaterThan(0)
        await this.unSelectAllComboBox(this.page, this.filterStatus)
        await this.selectComboBoxItems(this.page, await this.getRandomItems('statuses'))
        await this.filterMenu.click()
        await this.filterProceeding.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterProceeding)).toBeGreaterThan(0)
        await this.unSelectAllComboBox(this.page, this.filterProceeding)
        await this.selectComboBoxItems(this.page, await this.getRandomItems('proceeding'))
        await this.filterMenu.click()
        await this.filterServices.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterServices)).toBeGreaterThan(0)
        await this.unSelectAllComboBox(this.page, this.filterServices)
        await this.selectComboBoxItems(this.page, await this.getRandomItems('services'))
        await this.filterMenu.click()
        await this.createEditToggle.click()
        await this.defaultCheckbox.click()
        await this.createFilterTextbox.fill(name)
        await expect(this.createFilterTextbox).toHaveValue(name)
        await this.buttonSave.click()
        await this.buttonSaveNew.click()
        await this.buttonApply.click()
        await expect(this.successAlertSaved).toHaveText('Filter preset saved.')
        await expect(this.successAlertUpdated).toHaveText('Filter preset updated.')
    }

    createFilterWithCoverage = async (name) => {
        await expect(this.filterButton).toHaveText('FILTER')
        await this.filterButton.click()
        await expect(this.filterPreset).toBeVisible()
        await this.filterPreset.click()
        await this.filterPresetDefaultOption.click()
        await expect(this.filterDivisions).toBeVisible()
        await this.filterDivisions.click()
        await this.unSelectAllComboBoxDivisions()
        await this.selectFirstComboBoxDivision()
        await this.filterMenu.click()
        await expect(this.filterCoverageAreas).toBeEnabled()
        await this.filterCoverageAreas.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterCoverageAreas)).toBeGreaterThan(0)
        await this.filterMenu.click()
        await expect(this.filterLocation).toBeVisible()
        await this.filterLocation.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterLocation)).toBeGreaterThan(0)
        await this.filterMenu.click()
        await expect(this.filterPartner).toBeVisible()
        await this.filterPartner.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterPartner)).toBeGreaterThan(0)
        await this.filterMenu.click()
        await this.filterStatus.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterStatus)).toBeGreaterThan(0)
        await this.filterMenu.click()
        await this.filterProceeding.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterProceeding)).toBeGreaterThan(0)
        await this.filterMenu.click()
        await this.filterServices.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterServices)).toBeGreaterThan(0)
        await this.filterMenu.click()
        await this.createEditToggle.click()
        await this.defaultCheckbox.click()
        await this.createFilterTextbox.fill(name)
        await expect(this.createFilterTextbox).toHaveValue(name)
        await this.buttonSave.click()
        await this.buttonSaveNew.click()
        await this.buttonApply.click()
        await expect(this.successAlertSaved).toHaveText('Filter preset saved.')
        await expect(this.successAlertUpdated).toHaveText('Filter preset updated.')
    }

    createFilterWithoutSelectingFilters = async (name) => {
        await expect(this.filterButton).toHaveText('FILTER')
        await this.filterButton.click()
        await expect(this.filterPreset).toBeVisible()
        await this.filterPreset.click()
        await this.filterPresetDefaultOption.click()
        await expect(this.filterDivisions).toBeVisible()
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
        await expect(this.successAlertError).toHaveText('Your preset could not be saved. No filters have been selected. Please select filters before proceeding.')

    }

    updateFilter = async (name) => {
        await this.filterButton.click()
        await expect(this.filterButton).toHaveText('FILTER')
        await expect(this.filterPreset).toBeVisible()
        await this.createEditToggle.click()
        await this.createFilterTextbox.fill(name)
        await this.buttonSave.click()
        await this.buttonUpdatePreset.click()
        await this.buttonApply.click()
    }

    deleteFilter = async (name) => {
        await this.filterButton.click()
        await expect(this.filterButton).toHaveText('FILTER')
        await expect(this.filterPreset).toBeVisible()
        await this.createEditToggle.click()
        await this.buttonDelete.click()
        const successAleetDelete = await this.page.getByText(`Your Filter Preset ${name} has successfully been deleted.`)
        await expect(successAleetDelete).toHaveText(`Your Filter Preset ${name} has successfully been deleted.`)
        await this.buttonCloseFilter.click()
    }

    selectFilterOptions = async () => {
        await expect(this.filterButton).toHaveText('FILTER')
        await this.filterButton.click()
        await expect(this.filterPreset).toBeVisible()
        await this.filterPreset.click()
        await this.filterPresetDefaultOption.click()
        await expect(this.filterDivisions).toBeVisible()
        await this.filterDivisions.click()
        await this.unSelectAllComboBoxDivisions()
        await this.selectFirstComboBoxDivision()
        await this.filterMenu.click()
        await this.filterCoverageAreas.click()
        await this.unSelectAllComboBox(this.page, this.filterCoverageAreas)
        await this.selectFirstComboBox(this.page, this.filterCoverageAreas)
        await this.filterMenu.click()
        await expect(this.filterLocation).toBeVisible()
        await this.filterLocation.click()
        await this.unSelectAllComboBox(this.page, this.filterLocation)
        await this.selectFirstComboBox(this.page, this.filterLocation)
        await this.filterMenu.click()
        await expect(this.filterPartner).toBeVisible()
        await this.filterPartner.click()
        await this.unSelectAllComboBox(this.page, this.filterPartner)
        await this.selectFirstComboBox(this.page, this.filterPartner)
        await this.filterMenu.click()
        await this.filterStatus.click()
        await this.unSelectAllComboBox(this.page, this.filterStatus)
        await this.selectFirstComboBox(this.page, this.filterStatus)
        await this.filterMenu.click()
        await this.filterProceeding.click()
        await this.unSelectAllComboBox(this.page, this.filterProceeding)
        await this.selectFirstComboBox(this.page, this.filterProceeding)
        await this.filterMenu.click()
        await this.filterServices.click()
        await this.unSelectAllComboBox(this.page, this.filterServices)
        await this.selectFirstComboBoxService(this.page, this.filterServices)
        await this.filterMenu.click()
        await this.buttonApply.click()
    }

    verifyExistingFilter = async () => {
        await expect(this.filterButton).toHaveText('FILTER')
        await this.filterButton.click()
        await expect(this.filterPreset).toBeVisible()
        await this.filterPreset.click()
        await expect(await this.comboBoxItemsCount(this.page, this.filterPreset)).toEqual(1)
    }
}

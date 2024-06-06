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

    unSelectAllComboBoxStatus = async (page) => {
        await page.getByRole('option', { name: 'Select All' }).getByRole('checkbox').uncheck()
    }

    selectComboBoxStatus = async (page, statuses) => {
        for (const status of statuses) {
            await page.getByRole('option', { name: status }).getByRole('checkbox').check()
        }
    }

    unSelectComboBoxDivisions = async (page, filterJobPage) => {
        const divisionItemsId = await filterJobPage.filterDivisions.getAttribute('aria-controls')
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

    comboBoxItemsCount = async (page, comboBox) => {
        const itemsId = await comboBox.getAttribute('aria-controls')
        const itemsParent = await page.locator(`[id='${itemsId}']`)
        const items = await itemsParent.locator('li')
        return await items.count()
    }

    selectFirstComboBoxDivision = async (page, filterJobPage) => {
        const divisionItemsId = await filterJobPage.filterDivisions.getAttribute('aria-controls')
        const divisionItemsParent = await page.locator(`[id='${divisionItemsId}']`)
        const divisionItems = await divisionItemsParent.locator('li')
        await divisionItems.nth(0).click()
    }

    unSelectComboBox = async (page, comboBox) => {
        const itemsId = await comboBox.getAttribute('aria-controls')
        const itemsParent = await page.locator(`[id='${itemsId}']`)
        const items = await itemsParent.locator('li')
        for (let index = 0; index < await items.count(); index++) {
            const element = await items.nth(index);
            const isSelected = await element.getAttribute('aria-selected')
            if (isSelected == 'true') {
                await element.click()
            }
        }
    }

    createFilter = async (page, filterJobPage, name, statuses) => {
        await expect(filterJobPage.filterButton).toHaveText('FILTER')
        await filterJobPage.filterButton.click()
        await expect(filterJobPage.filterPreset).toBeVisible()
        await filterJobPage.filterPreset.click()
        await filterJobPage.filterPresetDefaultOption.click()
        await expect(filterJobPage.filterDivisions).toBeVisible()
        await filterJobPage.filterDivisions.click()
        await filterJobPage.filterMenu.click()
        await expect(filterJobPage.filterCoverageAreas).toBeDisabled()
        await expect(filterJobPage.filterLocation).toBeVisible()
        await filterJobPage.filterLocation.click()
        await filterJobPage.filterMenu.click()
        await expect(filterJobPage.filterPartner).toBeVisible()
        await filterJobPage.filterPartner.click()
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterStatus.click()
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterProceeding.click()
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterServices.click()
        await filterJobPage.filterMenu.click()
        await filterJobPage.createEditToggle.click()
        await filterJobPage.defaultCheckbox.click()
        await filterJobPage.createFilterTextbox.fill(name)
        await expect(filterJobPage.createFilterTextbox).toHaveValue(name)
        await filterJobPage.filterStatus.click()
        await filterJobPage.unSelectAllComboBoxStatus(page)
        await filterJobPage.selectComboBoxStatus(page, statuses)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterDivisions.click()
        await filterJobPage.filterMenu.click()
        await filterJobPage.buttonSave.click()
        await filterJobPage.buttonSaveNew.click()
        await filterJobPage.buttonApply.click()
        await expect(filterJobPage.successAlertSaved).toHaveText('Filter preset saved.')
        await expect(filterJobPage.successAlertUpdated).toHaveText('Filter preset updated.')
    }

    createFilterWithCoverage = async (page, filterJobPage, name, statuses) => {
        await expect(filterJobPage.filterButton).toHaveText('FILTER')
        await filterJobPage.filterButton.click()
        await expect(filterJobPage.filterPreset).toBeVisible()
        await filterJobPage.filterPreset.click()
        await filterJobPage.filterPresetDefaultOption.click()
        await expect(filterJobPage.filterDivisions).toBeVisible()
        await filterJobPage.filterDivisions.click()
        await filterJobPage.unSelectComboBoxDivisions(page, filterJobPage)
        await filterJobPage.selectFirstComboBoxDivision(page, filterJobPage)
        await filterJobPage.filterMenu.click()
        await expect(filterJobPage.filterCoverageAreas).toBeEnabled()
        await filterJobPage.filterCoverageAreas.click()
        await expect(await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterCoverageAreas)).toBeGreaterThan(0)
        await filterJobPage.filterMenu.click()
        await expect(filterJobPage.filterLocation).toBeVisible()
        await filterJobPage.filterLocation.click()
        await expect(await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterLocation)).toBeGreaterThan(0)
        await filterJobPage.filterMenu.click()
        await expect(filterJobPage.filterPartner).toBeVisible()
        await filterJobPage.filterPartner.click()
        await expect(await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterPartner)).toBeGreaterThan(0)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterStatus.click()
        await expect(await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterStatus)).toBeGreaterThan(0)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterProceeding.click()
        await expect(await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterProceeding)).toBeGreaterThan(0)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterServices.click()
        await expect(await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterServices)).toBeGreaterThan(0)
        await filterJobPage.filterMenu.click()
        await filterJobPage.createEditToggle.click()
        await filterJobPage.defaultCheckbox.click()
        await filterJobPage.createFilterTextbox.fill(name)
        await expect(filterJobPage.createFilterTextbox).toHaveValue(name)
        await filterJobPage.filterStatus.click()
        await filterJobPage.unSelectAllComboBoxStatus(page)
        await filterJobPage.selectComboBoxStatus(page, statuses)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterDivisions.click()
        await filterJobPage.filterMenu.click()
        await filterJobPage.buttonSave.click()
        await filterJobPage.buttonSaveNew.click()
        await filterJobPage.buttonApply.click()
        await expect(filterJobPage.successAlertSaved).toHaveText('Filter preset saved.')
        await expect(filterJobPage.successAlertUpdated).toHaveText('Filter preset updated.')
    }

    createFilterWithoutSelectingFilters = async (page, filterJobPage, name) => {
        await expect(filterJobPage.filterButton).toHaveText('FILTER')
        await filterJobPage.filterButton.click()
        await expect(filterJobPage.filterPreset).toBeVisible()
        await filterJobPage.filterPreset.click()
        await filterJobPage.filterPresetDefaultOption.click()
        await expect(filterJobPage.filterDivisions).toBeVisible()
        await filterJobPage.filterDivisions.click()
        await filterJobPage.unSelectComboBox(page, filterJobPage.filterDivisions)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterLocation.click()
        await filterJobPage.unSelectComboBox(page, filterJobPage.filterLocation)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterPartner.click()
        await filterJobPage.unSelectComboBox(page, filterJobPage.filterPartner)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterStatus.click()
        await filterJobPage.unSelectComboBox(page, filterJobPage.filterStatus)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterProceeding.click()
        await filterJobPage.unSelectComboBox(page, filterJobPage.filterProceeding)
        await filterJobPage.filterMenu.click()
        await filterJobPage.filterServices.click()
        await filterJobPage.unSelectComboBox(page, filterJobPage.filterServices)
        await filterJobPage.filterMenu.click()
        await filterJobPage.createEditToggle.click()
        await filterJobPage.defaultCheckbox.click()
        await filterJobPage.createFilterTextbox.fill(name)
        await filterJobPage.buttonSave.click()
        await filterJobPage.buttonSaveNew.click()
        await expect(filterJobPage.buttonApply).toBeDisabled()
        await expect(this.successAlertError).toHaveText('Your preset could not be saved. No filters have been selected. Please select filters before proceeding.')

    }

    updateFilter = async (filterJobPage, name) => {
        await filterJobPage.filterButton.click()
        await expect(filterJobPage.filterButton).toHaveText('FILTER')
        await expect(filterJobPage.filterPreset).toBeVisible()
        await filterJobPage.createEditToggle.click()
        await filterJobPage.createFilterTextbox.fill(name)
        await filterJobPage.buttonSave.click()
        await filterJobPage.buttonUpdatePreset.click()
        await filterJobPage.buttonApply.click()
    }

    deleteFilter = async (page, filterJobPage, name) => {
        await filterJobPage.filterButton.click()
        await expect(filterJobPage.filterButton).toHaveText('FILTER')
        await expect(filterJobPage.filterPreset).toBeVisible()
        await filterJobPage.createEditToggle.click()
        await filterJobPage.buttonDelete.click()
        const successAleetDelete = await page.getByText(`Your Filter Preset ${name} has successfully been deleted.`)
        await expect(successAleetDelete).toHaveText(`Your Filter Preset ${name} has successfully been deleted.`)
        await filterJobPage.buttonCloseFilter.click()
    }
}

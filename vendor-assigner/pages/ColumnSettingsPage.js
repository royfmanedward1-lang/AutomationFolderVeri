import { expect } from "@playwright/test"

export class ColumnSettingsPage {
    constructor(page) {
        this.page = page
        this.menu = page.locator('#menu- div').first()
        this.settingsButton = page.getByLabel('Column Settings')
        this.createEditToggle = page.getByLabel('Create/Edit Preset')
        this.defaultCheckbox = page.getByLabel('Set as Default')
        this.createColumnTextBox = page.getByPlaceholder('Create Column Preset')
        this.saveButton = page.getByRole('button', { name: 'Save' })
        this.saveAsNewButton = page.getByRole('menuitem', { name: 'Save as new' })
        this.updatePresetButton = page.getByRole('menuitem', { name: 'Update preset' })
        this.deleteButton = page.getByRole('button', { name: 'DELETE' })
        this.closeButton = page.getByRole('button', { name: 'Close' })
        this.applyButton = page.getByRole('button', { name: 'Apply', exact: true })
        this.cancelButton = page.getByRole('button', { name: 'Cancel' })
        this.successSave = page.getByText('Column preset successfully')
        this.successUpdate = page.getByText('Column preset successfully')
        this.succesDelete = page.getByText('Your Filter Preset System')

    }

    unCheckRandomColumn = async (number) => {
        const columnsChecked = [
            "Case Name",
            "Job Date",
            "Start Time",
            "Scheduling Client",
            "Location Type",
            "City",
        ];
        for (let i = columnsChecked.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [columnsChecked[i], columnsChecked[j]] = [columnsChecked[j], columnsChecked[i]];
        }
        for (const item of columnsChecked.slice(0, number)) {
            await this.page.getByRole('row', { name: `${item} Unselect row`, exact: true }).first().getByLabel('Unselect row').click()
        }
    }

    checkRandomColumn = async (number) => {
        const columUnckecked = [
            "End Time",
            "Job Status",
            "Caller",
            "Division",
            "Child Division",
            "State",
            "Third Party Client",
            "Witness Type(s)",
            "Proceeding Type",
            "Witness(es)",
            "Attorney"
        ];

        for (let i = columUnckecked.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [columUnckecked[i], columUnckecked[j]] = [columUnckecked[j], columUnckecked[i]];
        }

        for (const item of columUnckecked.slice(0, number)) {
            await this.page.getByRole('row', { name: `${item} Select row`, exact: true }).first().getByLabel('Select row').click()
        }

    }

    validateExistingConfigurations = async () => {
        await this.settingsButton.click()
        const combo = await this.page.getByRole('combobox')
        const itemsId = await combo.getAttribute('aria-controls')
        await combo.click()
        const itemsParent = await this.page.locator(`[id='${itemsId}']`)
        const items = await itemsParent.locator('li')
        return items.count()
    }

    createSettingInvalidCharacter = async () => {
        await this.settingsButton.click()
        await this.unCheckRandomColumn(3)
        await this.checkRandomColumn(5)
        await this.createEditToggle.click()
        await this.createColumnTextBox.fill('Test*')
        const invalidCharacterHint = await this.page.getByText('Remove invalid character "*"')
        return invalidCharacterHint
    }
    createSettingExeedingCharacters = async () => {
        await this.settingsButton.click()
        await this.unCheckRandomColumn(3)
        await this.checkRandomColumn(5)
        await this.createEditToggle.click()
        await this.createColumnTextBox.fill('test_exeeding_character_more_than_40_characters')
        const text = await this.createColumnTextBox.inputValue()
        const length = await text.length;
        return length
    }

    createSetting = async (name) => {
        await this.settingsButton.click()
        await this.unCheckRandomColumn(3)
        await this.checkRandomColumn(5)
        await this.createEditToggle.click()
        await this.createColumnTextBox.fill(name)
        await this.saveButton.click()
        await this.saveAsNewButton.click('Save as new')
        const successSave = await this.page.getByText(`Column preset successfully`)
        return successSave
    }

    createSettingWithNameUsed = async (name) => {
        await this.settingsButton.click()
        await this.createEditToggle.click()
        await this.createColumnTextBox.fill(name)
        await this.saveButton.click()
        await this.saveAsNewButton.click('Save as new')
        const existingPreset = await this.page.getByText('Preset name already exists.').first()
        return existingPreset
    }

    createSettingWithConfigurationUsed = async (name) => {
        await this.settingsButton.click()
        await this.createEditToggle.click()
        await this.createColumnTextBox.fill(name)
        await this.saveButton.click()
        await this.saveAsNewButton.click('Save as new')
        const existingConfigurationPreset = await this.page.getByText('Preset already exists with this columns configuration.').first()
        return existingConfigurationPreset
    }

    updateFilter = async (name) => {
        await this.settingsButton.click()
        await this.createEditToggle.click()
        await this.createColumnTextBox.fill(name)
        await this.saveButton.click()
        await this.updatePresetButton.click()
        await this.closeButton.click()
        const confirmationUpdated = await this.page.getByText('Column preset successfully Updated.')
        return confirmationUpdated
    }

    deleteFilter = async (name) => {
        await this.settingsButton.click()
        await this.createEditToggle.click()
        await this.deleteButton.click()
        const confirmationDeleted = await this.page.getByText(`Your Filter Preset ${name} has successfully been deleted.`)
        return confirmationDeleted
    }
}

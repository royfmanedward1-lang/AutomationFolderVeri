import { ColumnSettingsPage } from '../pages/ColumnSettingsPage.js'
import { LoginPage } from '../pages/LoginPage.js'
import { expect } from "@playwright/test"
const { test } = require('@playwright/test')

test.beforeEach('Logging in', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login()
})
test('No Presets Created', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page)
  const items = await columnSettings.validateExistingConfigurations()
  await expect(await items).toEqual(1)
})
test('Invalid Characters', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page)
  const hint = await columnSettings.createSettingInvalidCharacter()
  await expect(hint).toHaveText('Remove invalid character "*"') 
})
test('Exceeding Characters', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page)
  const length = await columnSettings.createSettingExeedingCharacters()
  await expect(await length).toEqual(40)
})
test('Creating a Preset', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page)
  const successSave = await columnSettings.createSetting('Test')
  await expect(successSave).toHaveText(`Column preset successfully created.`)
  await columnSettings.closeButton.click()
  const confirmationUpdated = await columnSettings.updateFilter('Test_Update')
  await expect(confirmationUpdated).toHaveText(`Column preset successfully updated.`)
  const confirmationDeleted = await columnSettings.deleteFilter('Test_Update')
  await expect(confirmationDeleted).toHaveText(`Your Filter Preset Test_Update has successfully been deleted.`)
})

test('Creating a new Preset with a name already in use', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page)
  const successSave = await columnSettings.createSetting('Test')
  await expect(successSave).toHaveText(`Column preset successfully created.`)
  await columnSettings.closeButton.click()
  const existingPreset = await columnSettings.createSettingWithNameUsed('Test')
  await expect(existingPreset).toHaveText(`Preset name already exists.`)
})

test('Creating a new Preset with the columns in a configuration already in use', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page)
  const successSave = await columnSettings.createSetting('Test')
  await expect(successSave).toHaveText(`Column preset successfully created.`)
  await columnSettings.closeButton.click()
  const existingConfigurationPreset = await columnSettings.createSettingWithConfigurationUsed('Test_copy')
  await expect(existingConfigurationPreset).toHaveText(`Preset already exists with this columns configuration.`)
})
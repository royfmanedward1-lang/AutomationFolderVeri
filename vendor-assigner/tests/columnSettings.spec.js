import { ColumnSettingsPage } from '../pages/ColumnSettingsPage.js'
import { LoginPage } from '../pages/LoginPage.js'
import { expect } from "@playwright/test"
const { test } = require('@playwright/test')

test.beforeEach('Logging in', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login()
})

test('No Presets Created', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Validate existing configurations in Column Settings', async () => {
      const items = await columnSettings.validateExistingConfigurations();
      await expect(items).toEqual(1);
  });
});

test('Invalid Characters', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);
  const hint = await columnSettings.createSettingInvalidCharacter();
 
  await test.step('Verify hint message for invalid character', async () => {
      await expect(hint).toHaveText('Remove invalid character "*"');
  });
});

test('Exceeding Characters', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  let length;
  await test.step('Attempt to create a setting with exceeding characters', async () => {
    length = await columnSettings.createSettingExeedingCharacters();
  });

  await test.step('Verify the length of characters exceeds the limit', async () => {
    await expect(length).toEqual(40);
  });
});

test('Creating a Preset', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  let successSave;
  await test.step('Create a column preset with the name "Test"', async () => {
    successSave = await columnSettings.createSetting('Test');
  });
  
  await test.step('Verify that the preset was successfully created', async () => {
    await expect(successSave).toHaveText('Column preset successfully created.');
  });
  
  await test.step('Click on the apply button', async () => {
    await columnSettings.applyButton.click();
  });
  
  let confirmationUpdated;
  await test.step('Update the column preset to "Test_Update"', async () => {
    confirmationUpdated = await columnSettings.updateFilter('Test_Update');
  });
  
  await test.step('Verify that the preset was successfully updated', async () => {
    await expect(confirmationUpdated).toHaveText('Column preset successfully updated.');
  });
  
  let confirmationDeleted;
  await test.step('Delete the preset "Test_Update"', async () => {
    confirmationDeleted = await columnSettings.deleteFilter('Test_Update');
  });

  await test.step('Verify that the preset was successfully deleted', async () => {
    await expect(confirmationDeleted).toHaveText('Your Filter Preset Test_Update has successfully been deleted.');
  });
});

test('Creating a new Preset with a name already in use', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);
  
  let successSave;
  await test.step('Create a column preset with the name "Test"', async () => {
    successSave = await columnSettings.createSetting('Test');
  });

  await test.step('Verify that the preset was successfully created', async () => {
    await expect(successSave).toHaveText('Column preset successfully created.');
  });
 
  await test.step('Click on the apply button', async () => {
    await columnSettings.applyButton.click();
  });
 
  let existingPreset;
  await test.step('Try to create a preset with the name "Test" again', async () => {
    existingPreset = await columnSettings.createSettingWithNameUsed('Test');
  });

  await test.step('Verify that the error message for duplicate preset name is shown', async () => {
    await expect(existingPreset).toHaveText('Preset name already exists.');
  });  
  
  await test.step('Delete the preset "Test"', async () => {
    await columnSettings.deleteButton.click()
  })
  
});


test('Creating a new Preset with the columns in a configuration already in use', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page)
  const successSave = await columnSettings.createSetting('Test')
  await expect(successSave).toHaveText(`Column preset successfully created.`)
  await columnSettings.applyButton.click()
  const existingConfigurationPreset = await columnSettings.createSettingWithConfigurationUsed('Test_copy')
  await expect(existingConfigurationPreset).toHaveText(`Preset already exists with this columns configuration.`)
})
import { ColumnSettingsPage } from '../pages/ColumnSettingsPage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { expect } from "@playwright/test";
import { createWitness } from '../services/witnessService.js';
import { loginService } from '../services/loginService';
import JobClass from '../utility/jobClass';
import { JobService } from '../services/jobService';
const { test } = require('@playwright/test');
import * as utils from "../utility/utils.js";

test.beforeEach('Logging in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
});

test('No Presets Created', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Validate existing configurations in Column Settings', async () => {
    const items = await columnSettings.validateExistingConfigurations();
    expect(items).toEqual(1);
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
    expect(length).toEqual(40);
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
    await confirmationUpdated.waitFor({ state: 'detached' });
  });

  let confirmationDeleted;
  await test.step('Delete the preset "Test_Update"', async () => {
    confirmationDeleted = await columnSettings.deleteFilter('Test_Update');
  });

  await test.step('Verify that the preset was successfully deleted', async () => {
    await expect(confirmationDeleted).toHaveText('Your Column Preset Test_Update has successfully been deleted.');
  });
});

test('Creating a new Preset with a name already in use', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  let successSave;
  await test.step('Create a column preset with the name "Test1"', async () => {
    successSave = await columnSettings.createSetting('Test1');
  });

  await test.step('Verify that the preset was successfully created', async () => {
    await expect(successSave).toHaveText('Column preset successfully created.');
  });

  await test.step('Click on the apply button', async () => {
    await columnSettings.applyButton.click();
  });

  let existingPreset;
  await test.step('Try to create a preset with the name "Test1" again', async () => {
    existingPreset = await columnSettings.createSettingWithNameUsed('Test1');
  });

  await test.step('Verify that the error message for duplicate preset name is shown', async () => {
    await expect(existingPreset).toHaveText('Preset name already exists.');
  });

  await test.step('Delete the preset "Test1"', async () => {
    await columnSettings.deleteButton.click();
  });
});

test('Creating a new Preset with the columns in a configuration already in use', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Create a new preset named "Test2"', async () => {
    const successSave = await columnSettings.createSetting('Test2');
    await expect(successSave).toHaveText('Column preset successfully created.');
  });

  await test.step('Apply the "Test2" preset', async () => {
    await columnSettings.applyButton.click();
  });

  await test.step('Attempt to create a new preset with an existing column configuration', async () => {
    const existingConfigurationPreset = await columnSettings.createSettingWithConfigurationUsed('Test_copy');
    await expect(existingConfigurationPreset).toHaveText('Preset already exists with this columns configuration.');
  });

  await test.step('Delete the preset "Test2"', async () => {
    await columnSettings.deleteButton.click();
  });
});

test('Updating a Preset with a different column order', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Create a new preset named "Test3"', async () => {
    await columnSettings.createSetting('Test3');
  });

  await test.step('Update the preset with a different column order', async () => {
    const successSave = await columnSettings.updatePresetDifferentColumnOrder();
    await expect(successSave).toHaveText('Column preset successfully updated.');
  });

  await test.step('Delete the preset "Test3"', async () => {
    const successDelete = await columnSettings.deleteExistingFilter('Test3');
    await expect(successDelete).toHaveText('Your Column Preset Test3 has successfully been deleted.');
  });
});

test('Updating a Preset with different columns activated', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Create a new preset named "Test4"', async () => {
    await columnSettings.createSetting('Test4');
  });

  await test.step('Update the preset with different columns activated', async () => {
    const successSave = await columnSettings.updatePresetDifferentColumnActivation();
    await expect(successSave).toHaveText('Column preset successfully updated.');
  });

  await test.step('Delete the preset "Test4"', async () => {
    const successDelete = await columnSettings.deleteExistingFilter('Test4');
    await expect(successDelete).toHaveText('Your Column Preset Test4 has successfully been deleted.');
  });
});

test('Updating a Preset with a different name', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Create a new preset named "Test5"', async () => {
    await columnSettings.createSetting('Test5');
  });

  await test.step('Update the preset name', async () => {
    const successSave = await columnSettings.updatePresetName();
    await expect(successSave).toHaveText('Column preset successfully updated.');
  });

  await test.step('Delete the preset with the new name "Test_Different Name"', async () => {
    let successDelete = await columnSettings.deleteExistingFilter('Test_Different Name');
    await expect(successDelete).toHaveText('Your Column Preset Test_Different Name has successfully been deleted.');
  });
});

test('Selecting another Preset', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Wait for the grid to load', async () => {
    await utils.waitGridToLoad(page);
  });

  let columnHeadersBefore;
  let columnHeadersAfter;

  await test.step('Capture column headers before the preset change', async () => {
    columnHeadersBefore = await page
      .getByRole('columnheader')
      .allTextContents();
  });

  await test.step('Create a new preset named "Test6"', async () => {
    await columnSettings.createSetting('Test6');
  });

  await test.step('Update preset with different column activation', async () => {
    const successSave = await columnSettings.updatePresetDifferentColumnActivation();
    await expect(successSave).toHaveText('Column preset successfully updated.');
  });

  await test.step('Capture column headers after the preset change', async () => {
    columnHeadersAfter = await page
      .getByRole('columnheader')
      .allTextContents();
  });

  await test.step('Validate that the column headers have changed', async () => {
    await expect(columnHeadersBefore.map((text) => text.trim()).filter((text) => text !== '')).not.toEqual(columnHeadersAfter.map((text) => text.trim()).filter((text) => text !== ''));
  });

  await test.step('Delete the preset "Test6"', async () => {
    let successDelete = await columnSettings.deleteExistingFilter('Test6');
    await expect(successDelete).toHaveText('Your Column Preset Test6 has successfully been deleted.');
  });
});


test('Deleting a Default Preset', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  let successSave;
  await test.step('Create a column preset with the name "Test7"', async () => {
    successSave = await columnSettings.createSettingSetAsDefault('Test7');
  });

  await test.step('Verify that the preset was successfully created', async () => {
    await expect(successSave).toHaveText('Column preset successfully created.');
    await successSave.waitFor({ state: 'detached' });
  });

  await test.step('Click on the apply button', async () => {
    await columnSettings.applyButton.click();
  });


  let confirmationDeleted;
  await test.step('Delete the preset "Test7"', async () => {
    confirmationDeleted = await columnSettings.deleteFilter('Test7');
  });

  await test.step('Verify that the preset was successfully deleted', async () => {
    await expect(confirmationDeleted).toHaveText('Your Column Preset Test7 has successfully been deleted.');
  });
});

test('Undoing a Preset Deletion', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  let successSave;
  await test.step('Create a column preset with the name "Test8"', async () => {
    successSave = await columnSettings.createSettingSetAsDefault('Test8');
  });

  await test.step('Verify that the preset was successfully created', async () => {
    await expect(successSave).toHaveText('Column preset successfully created.');
    await successSave.waitFor({ state: 'detached' });
  });

  await test.step('Click on the apply button', async () => {
    await columnSettings.applyButton.click();
  });

  let confirmationDeleted;
  await test.step('Delete the preset "Test8"', async () => {
    confirmationDeleted = await columnSettings.deleteFilter('Test8');
  });

  await test.step('Verify that the preset was successfully deleted', async () => {
    await expect(confirmationDeleted).toHaveText('Your Column Preset Test8 has successfully been deleted.');
  });

  await test.step('Undoing preset deletion"', async () => {
    await columnSettings.buttonUndo.click();
  });

  await test.step('Verify that undoing deletion succeded', async () => {
    const confirmUndoDeleition = page.getByText('Column preset updated.');
    await expect(confirmUndoDeleition).toHaveText('Column preset updated.');
    await page.getByText('Column preset updated.').waitFor({ state: 'detached' });
  });

  await test.step('Delete the preset "Test"', async () => {
    await columnSettings.applyButton.click();
    confirmationDeleted = await columnSettings.deleteExistingFilter('Test8');
  });

  await test.step('Verify that the preset was successfully deleted', async () => {
    await expect(confirmationDeleted).toHaveText('Your Column Preset Test8 has successfully been deleted.');
  });
});

test('Adding Witness to the columns view', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);

  await test.step('Open column settings', async () => {
    await columnSettings.settingsButton.click();
  });

  await test.step('Uncheck a random column', async () => {
    await columnSettings.unCheckRandomColumn(3);
  });

  await test.step('Check "Witness Type(s)" column', async () => {
    await columnSettings.checkColumn('Witness Type(s)');
  });

  await test.step('Apply the filter', async () => {
    await columnSettings.applyButton.click();
  });

  await test.step('Verify "Witness Type(s)" column is visible', async () => {
    await expect(page.getByRole('columnheader', { name: 'Witness Type(s)' })).toBeVisible();
  });
});

test('Checking for a job with no Witness', async ({ page }) => {
  const columnSettings = new ColumnSettingsPage(page);
  const jobService = new JobService();
  const accessToken = await loginService();
  const today = new Date();
  let jobId;

  today.setDate(today.getDate() + 1);
  const formattedDate = today.toISOString().split('T')[0];

  const jobObject = new JobClass({
    caseId: 301515,
    defendant: "",
    plaintiff: "",
    proceedingTypeId: 5,
    thirdPartyId: 123914,
    divisionId: 50,
    deliveryDays: 0,
    timeZoneId: 7,
    deliveryMethod: "Daily",
    depositionDate: formattedDate + "T07:00:00.000-04:00",
    depositionEnd: formattedDate + "T16:00:00.000-04:00",
    locationId: null,
    locationTypeId: 1,
    locationNotes: "",
    locationAddress1: "1000 Virginia Center Pkwy",
    locationAddress2: "",
    locationCity: "New York",
    locationName: "The Virginia Crossing Hotel and Conference Center",
    locationState: "VA",
    locationZip: "23059",
    locationContactPhone: "",
    locationContact: "",
    hasDigitalReporter: true,
    hasTranscriber: false,
    hasCourtReporter: false,
    hasInterpreter: false,
    hasVideographer: false,
    notes: "",
    numberOfAttorneys: "2",
    numberOfWitnesses: "1",
    attorneyContactId: 1079987,
    callerContactId: 1080009,
    clientAddressId: 427947,
    clientId: 268252,
  });

  jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());

  await test.step('Open column settings and add "Witness Type(s)" column', async () => {
    await columnSettings.settingsButton.click();
    await columnSettings.unCheckRandomColumn(3);
    await columnSettings.checkColumn('Witness Type(s)');
    await columnSettings.applyButton.click();
  });

  await test.step('Verify "Witness Type(s)" column is visible', async () => {
    await expect(page.getByRole('columnheader', { name: 'Witness Type(s)' })).toBeVisible();
  });

  await test.step('Verify that job without witnesses display a "-" indicator', async () => {
    const jobRow = await page.locator(`//*[@data-id="${jobId}"]`);
    await expect(jobRow).toBeVisible();

    const witnessTypeColumn = await jobRow.locator('//*[@data-field="witnessType"]');
    const witnessTypeText = await witnessTypeColumn.innerText();
    await expect(witnessTypeText).toBe('-');
  });
});

test('Checking for a job with a single Witness', async ({ page }) => {
  const jobService = new JobService();
  const columnSettings = new ColumnSettingsPage(page);
  const accessToken = await loginService();
  const today = new Date();
  let jobId;

  today.setDate(today.getDate() + 1);
  const formattedDate = today.toISOString().split('T')[0];

  const jobObject = new JobClass({
    caseId: 301515,
    defendant: "",
    plaintiff: "",
    proceedingTypeId: 5,
    thirdPartyId: 123914,
    divisionId: 50,
    deliveryDays: 0,
    timeZoneId: 7,
    deliveryMethod: "Daily",
    depositionDate: formattedDate + "T07:00:00.000-04:00",
    depositionEnd: formattedDate + "T16:00:00.000-04:00",
    locationId: null,
    locationTypeId: 1,
    locationNotes: "",
    locationAddress1: "1000 Virginia Center Pkwy",
    locationAddress2: "",
    locationCity: "New York",
    locationName: "The Virginia Crossing Hotel and Conference Center",
    locationState: "VA",
    locationZip: "23059",
    locationContactPhone: "",
    locationContact: "",
    hasDigitalReporter: true,
    hasTranscriber: false,
    hasCourtReporter: false,
    hasInterpreter: false,
    hasVideographer: false,
    notes: "",
    numberOfAttorneys: "2",
    numberOfWitnesses: "1",
    attorneyContactId: 1079987,
    callerContactId: 1080009,
    clientAddressId: 427947,
    clientId: 268252,
  });

  jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());

  await test.step('Add Plaintiff witnesses to the job', async () => {
    await createWitness(accessToken, 'automation', jobId, 1);
  });

  await test.step('Open column settings and add "Witness Type(s)" column', async () => {
    await columnSettings.settingsButton.click();
    await columnSettings.unCheckRandomColumn(3);
    await columnSettings.checkColumn('Witness Type(s)');
    await columnSettings.applyButton.click();
  });

  await test.step('Verify the "Witness Type(s)" column is visible', async () => {
    await expect(page.getByRole('columnheader', { name: 'Witness Type(s)' })).toBeVisible();
  });

  await test.step('Verifying a job with a single Witness Plaintiff assigned', async () => {
    const jobRow = await page.locator(`//*[@data-id="${jobId}"]`);
    const witnessTypeColumn = await jobRow.locator('//*[@data-field="witnessType"]');
    const witnessTypeText = await witnessTypeColumn.innerText();
    await expect(witnessTypeText).toBe('Plaintiff');
  });
});

test('Verifying a job with multiple Witness Types', async ({ page }) => {
  const jobService = new JobService();
  const columnSettings = new ColumnSettingsPage(page);
  const accessToken = await loginService();
  const today = new Date();
  let jobId;
  today.setDate(today.getDate() + 1);
  const formattedDate = today.toISOString().split('T')[0];

  const jobObject = new JobClass({
    caseId: 301515,
    defendant: "",
    plaintiff: "",
    proceedingTypeId: 5,
    thirdPartyId: 123914,
    divisionId: 50,
    deliveryDays: 0,
    timeZoneId: 7,
    deliveryMethod: "Daily",
    depositionDate: formattedDate + "T07:00:00.000-04:00",
    depositionEnd: formattedDate + "T16:00:00.000-04:00",
    locationId: null,
    locationTypeId: 1,
    locationNotes: "",
    locationAddress1: "1000 Virginia Center Pkwy",
    locationAddress2: "",
    locationCity: "New York",
    locationName: "The Virginia Crossing Hotel and Conference Center",
    locationState: "VA",
    locationZip: "23059",
    locationContactPhone: "",
    locationContact: "",
    hasDigitalReporter: true,
    hasTranscriber: false,
    hasCourtReporter: false,
    hasInterpreter: false,
    hasVideographer: false,
    notes: "",
    numberOfAttorneys: "2",
    numberOfWitnesses: "1",
    attorneyContactId: 1079987,
    callerContactId: 1080009,
    clientAddressId: 427947,
    clientId: 268252,
  });

  jobId = await jobService.createNewJob(accessToken, jobObject.generateQuery());

  await test.step('Add multiple witnesses to the job, Unknown and Plaintiff', async () => {
    await createWitness(accessToken, 'automation', jobId, 0);
    await createWitness(accessToken, 'automation', jobId, 1);
  });

  await test.step('Open column settings and add "Witness Type(s)" column', async () => {
    await columnSettings.settingsButton.click();
    await columnSettings.unCheckRandomColumn(3);
    await columnSettings.checkColumn('Witness Type(s)');
    await columnSettings.applyButton.click();
  });

  await test.step('Verify that the "Witness Type(s)" column is visible', async () => {
    await expect(page.getByRole('columnheader', { name: 'Witness Type(s)' })).toBeVisible();
  });

  await test.step('Verify the job has multiple Witness Types', async () => {
    const jobRow = page.locator(`//*[@data-id="${jobId}"]`).locator('//*[@data-field="witnessType"]').getByRole('button');
    await jobRow.click();

    const witnessPopover = page.locator('//*[@id="see-names-popover"]/div[3]/div');
    const witnessPopoverText = await witnessPopover.innerText();
    const witnessTypeList = witnessPopoverText.split('\n');

    await expect(witnessTypeList).toContain('Plaintiff');
    await expect(witnessTypeList).toContain('Unknown');
  });

});



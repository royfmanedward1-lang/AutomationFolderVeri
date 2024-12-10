import { LoginPage } from '../pages/LoginPage.js';
import { HeaderPage } from '../pages/assignement/HeaderPage.js';
import { FilterJobPage } from '../pages/FilterJobPage.js';
import * as utils from "../utility/utils.js";
const { test, expect } = require('@playwright/test');

test.beforeEach('Logging in', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login()
})

test('Create Filter Job', async ({ page }) => {
  const filterJobPage = new FilterJobPage(page);

  await test.step('Create filter "test filter 1"', async () => {
    await filterJobPage.createFilter('test filter 1', false);
    await expect(filterJobPage.successAlertSaved).toHaveText('Filter preset saved.');
    await filterJobPage.successAlertSaved.waitFor({ state: 'detached' });
  });

  await test.step('Update filter "filter updated 1"', async () => {
    if (await filterJobPage.noJobMatched.first().isVisible()) {
      await filterJobPage.noJobMatched.first().waitFor({ state: 'detached' });
    }
    await filterJobPage.updateFilter('filter updated 1');
  });

  await test.step('Delete updated filter', async () => {
    await filterJobPage.deleteFilter('filter updated 1');
  });
});

test('Create Filter job with coverage', async ({ page }) => {
  const filterJobPage = new FilterJobPage(page);

  await test.step('Create filter "test filter 2" with coverage', async () => {
    await filterJobPage.createFilter('test filter 2', true);
    await expect(filterJobPage.successAlertSaved).toHaveText('Filter preset saved.');
  });

  await test.step('Delete filter with coverage', async () => {
    await filterJobPage.deleteFilter('test filter 2');
  });
});

test('Create Filter job without selecting filters', async ({ page }) => {
  const filterJobPage = new FilterJobPage(page);

  await test.step('Attempt to create filter "test filter 3" without selecting filters', async () => {
    await filterJobPage.createFilterWithoutSelectingFilters('test filter 3');
    await expect(filterJobPage.successAlertError).toHaveText('Your preset could not be saved. No filters have been selected. Please select filters before proceeding.');
  });
});

test('Sign Out And Sign In Again', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const headerPage = new HeaderPage(page);
  const filterJobPage = new FilterJobPage(page);

  await test.step('Create filter "test filter 4" and sign out', async () => {
    await filterJobPage.createFilter('test filter 4');
    await headerPage.logOut();
  });

  await test.step('Sign in again and validate filter presence', async () => {
    await loginPage.login();
    await utils.waitGridToLoad(page);
    await filterJobPage.filterButton.click();
    await filterJobPage.filterPreset.click();
    const filterJobsCountItems = await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterPreset);
    await expect(filterJobsCountItems).toBeGreaterThan(1);
  });

  await test.step('Close filter menu and delete filter', async () => {
    await filterJobPage.filterMenu.click();
    await filterJobPage.buttonCloseFilter.click();
    await filterJobPage.deleteFilter('test filter 4');
  });
});


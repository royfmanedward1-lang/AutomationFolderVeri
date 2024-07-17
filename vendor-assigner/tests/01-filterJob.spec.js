import { LoginPage } from '../pages/LoginPage.js'
import { HeaderPage } from '../pages/assignament/HeaderPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'
const { test, expect } = require('@playwright/test')

//Create a filter job
test('Create Filter Job', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilter('test filter', false)
  await expect(filterJobPage.successAlertSaved).toHaveText('Filter preset saved.')
  await expect(filterJobPage.successAlertUpdated).toHaveText('Filter preset updated.')
  await filterJobPage.updateFilter('filter updated')
  await filterJobPage.deleteFilter('filter updated')
})
//Create a filter with coverage
test('Create Filter job with coverage ', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilter('test filter', true)
  await expect(filterJobPage.successAlertSaved).toHaveText('Filter preset saved.')
  await expect(filterJobPage.successAlertUpdated).toHaveText('Filter preset updated.')

})
//Create a filter without selecting filters
test('Create Filter job without selecting filters', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilterWithoutSelectingFilters('test filter')
  await expect(filterJobPage.successAlertError).toHaveText('Your preset could not be saved. No filters have been selected. Please select filters before proceeding.')

})

test('Sign Out And Sign In Again', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const headerPage = new HeaderPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilter('test filter')
  await headerPage.logOut()
  await loginPage.login()
  await filterJobPage.filterButton.click()
  await expect(await filterJobPage.comboBoxItemsCount(page, filterJobPage.filterPreset)).toEqual(1)
})


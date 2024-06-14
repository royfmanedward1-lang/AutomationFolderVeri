import { LoginPage } from '../pages/LoginPage.js'
import { HeaderPage } from '../pages/assignament/HeaderPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'
const { test, expect } = require('@playwright/test')

//Creat a filter job
test('Create Filter Job', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilter('test filter')

})
//Creat a filter with coverage
test('Create Filter job with coverage ', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilterWithCoverage('test filter')

})
//Creat a filter without selecting filters
test('Create Filter job without selecting filters', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilterWithoutSelectingFilters('test filter')

})
//update a filter job
test('Update Filter Job', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilter('test filter')
  await filterJobPage.updateFilter('filter updated')

})
//delete a filter job
test('Delete Filter Job', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilter('test filter')
  await filterJobPage.deleteFilter('test filter')
})
//Select Filter Options
test('Select Filter Options', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.selectFilterOptions()
})
//Apply Filters To Job List
test('Sign Out And Sign In Again', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const headerPage = new HeaderPage(page)
  const filterJobPage = new FilterJobPage(page)
  await loginPage.login()
  await filterJobPage.createFilter('test filter')
  await headerPage.logOut()
  await loginPage.login()
  await filterJobPage.verifyExistingFilter()
})


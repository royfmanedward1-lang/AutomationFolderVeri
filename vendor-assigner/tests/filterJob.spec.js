import { LoginPage } from '../pages/LoginPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'
const { test } = require('@playwright/test')

//Creat a filter job
test('Create Filter Job', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)

  const statuses = ['Cancelled', 'Closed', 'Confirmed'];
  
  await loginPage.login()

  await filterJobPage.createFilter(page, filterJobPage, 'test filter', statuses);

})
//Creat a filter with coverage
test('Create Filter job with coverage ', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)

  const statuses = ['Cancelled', 'Closed', 'Confirmed'];
  
  await loginPage.login()

  await filterJobPage.createFilterWithCoverage(page, filterJobPage, 'test filter', statuses);

})
//Creat a filter without selecting filters
test('Create Filter job without selecting filters', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)
  
  await loginPage.login()

  await filterJobPage.createFilterWithoutSelectingFilters(page, filterJobPage, 'test filter');

})
//update a filter job
test('Update Filter Job', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)

  const statuses = ['Cancelled', 'Closed', 'Confirmed'];
  
  await loginPage.login()

  await filterJobPage.createFilter(page, filterJobPage, 'test filter', statuses);
  await filterJobPage.updateFilter(filterJobPage, 'filter updated');

})
//delete a filter job
test('Delete Filter Job', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const filterJobPage = new FilterJobPage(page)

  const statuses = ['Cancelled', 'Closed', 'Confirmed'];
  
  await loginPage.login()

  await filterJobPage.createFilter(page, filterJobPage, 'test filter', statuses);
  await filterJobPage.deleteFilter(page, filterJobPage, 'test filter');
})


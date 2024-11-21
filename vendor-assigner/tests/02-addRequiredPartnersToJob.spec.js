import { test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { FilterJobPage } from '../pages/FilterJobPage.js'
import { AssignmentPage } from '../pages/AssignmentPage.js'
import * as utils from "../utility/utils.js"

test.beforeEach('Logging in and set jobs', async ({ page }) => {
  //login
  const loginPage = new LoginPage(page)
  await loginPage.login()
})

const partnerTypeList = ['Steno Reporter', 'Digital Reporter', 'Transcriber', 'Interpreter', 'Videographer'];

for (const partnerType of partnerTypeList) {
  test(`Add ${partnerType} to a job and verify if ${partnerType} is added`, async ({ page }) => {
    const filterJobPage = new FilterJobPage(page);
    const assignmentPage = new AssignmentPage(page);

    await test.step('Wait for grid to load', async () => {
      await utils.waitGridToLoad(page);
    });

    await test.step('Apply only valid jobs filter', async () => {
      await filterJobPage.applyOnlyValidJobs();
    });

    await test.step('Select job and assign partner', async () => {
      await assignmentPage.selectJobAndAssignPartner(partnerType);
    });

    await test.step('Add the partner to the job', async () => {
      await utils.waitGridToLoad(page);
      await assignmentPage.addPartner(partnerType);
    });
  });
}
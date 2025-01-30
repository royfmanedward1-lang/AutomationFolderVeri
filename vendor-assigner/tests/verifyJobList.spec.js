import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { AssignmentPage } from '../pages/AssignmentPage.js';
import * as utils from "../utility/utils.js";

test.beforeEach('Logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
});

test('Check Job List and Columns', async ({ page }) => {
    const defaultColumnList = ["Job Number", "Case Name", "Job Date", "Start Time", "Scheduling Client", "Location Type", "City", "Note", "Partner Assignment"];
    const assignmentPage = new AssignmentPage(page);

    await test.step('Wait for grid to load', async () => {
        await utils.waitGridToLoad(page);
    });

    await test.step('Verify default column list in job list', async () => {
        await assignmentPage.checkColumnList(defaultColumnList);
    });
});

const defaultColumnList = ["Job Number", "Case Name", "Job Date", "Start Time", "Scheduling Client", "Location Type", "City"];

for (const order of ["Ascending", "Descending"]) {
    for (const columns of defaultColumnList) {
        test(`${order} Sorting Job Column ${columns}`, async ({ page }) => {
            const assignmentPage = new AssignmentPage(page);

            await test.step('Wait for grid to load', async () => {
                await utils.waitGridToLoad(page);
            });

            await test.step(`Sort column "${columns}" in ${order} order`, async () => {
                await assignmentPage.sortRandomColumn(columns, order);
            });
        });
    };
};
import { test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage.js'
import { AssignmentPage } from '../pages/AssignmentPage.js'

test.beforeEach('Logging in', async ({ page }) => {
    //login
    const loginPage = new LoginPage(page)
    await loginPage.login()
})

test('Check Job List and Columns', async ({ page }) => {
    const defaultColumnList = ["Job Number", "Case Name", "Job Date", "Start Time", "Scheduling Client", "Location Type", "City", "Note", "Partner Assignment"]
    const assignmentPage = new AssignmentPage(page)
    await assignmentPage.checkColumnList(defaultColumnList)
})

const defaultColumnList = ["Job Number", "Case Name", "Job Date", "Start Time", "Scheduling Client", "Location Type", "City"]
for (const order of ["Ascending", "Descending"]) {
    for (const columns of defaultColumnList) {
        test(`${order} Sorting Job Column ${columns}`, async ({ page }) => {
            const assignmentPage = new AssignmentPage(page)
            await assignmentPage.sortRandomColumn(columns, order)
        })
    }
}




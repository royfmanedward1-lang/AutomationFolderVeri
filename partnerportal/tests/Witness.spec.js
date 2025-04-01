const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageobjects/LoginPage');
const DashboardPage = require('../pageobjects/DashboardPage');
const JobDetailsPage = require('../pageobjects/JobDetailsPage');
const TestData = require('../utils/testData');
const { generateRandomWitnessData } = require('../utils/testHelpers');

test.describe('Witness Functionality Tests', () => {
    let loginPage;
    let dashboardPage;
    let jobDetailsPage;
    const validUser = TestData.credentials.validUser;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        jobDetailsPage = new JobDetailsPage(page);
        
        await loginPage.navigateToLoginPage();
        await loginPage.login(validUser.username, validUser.password);
        
        await loginPage.waitForDashboardToLoad();
    });

    test('Create a Witness', async () => {
        await jobDetailsPage.findAndClickJobWithVs();
        
        const witnessData = generateRandomWitnessData();
        
        const witnessAdded = await jobDetailsPage.addWitness(witnessData.lastName);
        
        expect(witnessAdded).toBeTruthy();
    });
});
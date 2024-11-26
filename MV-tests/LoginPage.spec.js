const { test, expect } = require("@playwright/test");
const { PageManager } = require("../managers/PageManager");
const testData = require("../utils/testData");

test.describe("Login Test: Verify the login functionality for MyVeritext", () => {
  let pageManager;
  let loginPage;

  // Setup Page Manager and Login Page before each test
  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page); // Initialize the Page Manager
    loginPage = pageManager.getLoginPage(); // Get the LoginPage object
    await loginPage.goto(); // Navigate to the login page
  });

  test("Access MyVeritext with valid credentials", async ({ page }) => {
    //Enter valid credentials
    await test.step("When the user enters valid credentials", async () => {
      await loginPage.enterValidCredentials(
        testData.validCredentials.username,
        testData.validCredentials.password
      );
    });

    //Click the login button
    await test.step("When the user clicks the Log In button", async () => {
      await loginPage.clickLoginButton();
    });

    //Validate successful login
    await test.step("Then the user should be logged in successfully", async () => {
      await page.waitForURL(testData.urls.calendarPage);
    });
  });

  test("Attempt to access with Incorrect username", async ({ page }) => {
    //Enter invalid credentials
    await test.step("When the user enters invalid username", async () => {
      await loginPage.enterValidCredentials(
        testData.invalidUsername.username,
        testData.invalidUsername.password
      );
    });

    //Click the login button
    await test.step("When the user clicks the Log In button", async () => {
      await loginPage.clickLoginButton();
    });

    //Verify the error message
    await test.step("Then the user should see an error message", async () => {
      await expect(loginPage.errorMessage).toContainText(
        testData.messages.invalidUsername
      );
    });
  });

  test("Attempt to access with Incorrect password", async ({ page }) => {
    //Enter invalid credentials
    await test.step("When the user enters invalid password", async () => {
      await loginPage.enterValidCredentials(
        testData.invalidPassword.username,
        testData.invalidPassword.password
      );
    });

    //Click the login button
    await test.step("When the user clicks the Log In button", async () => {
      await loginPage.clickLoginButton();
    });

    //Verify the error message
    await test.step("Then the user should see an error message", async () => {
      await expect(loginPage.errorMessage).toContainText(
        testData.messages.invalidPassword
      );
    });
  });

  test("Navigate to forgot password page", async ({ page }) => {
    //Verify the Forgot Password link
    await test.step("Then the Forgot Password link should be visible", async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    //Click the Forgot Password link
    await test.step("When the user clicks the Forgot Password link", async () => {
      await loginPage.clickForgotPassword();
    });

    //Navigate to Forgot Password web page
    await test.step("Then the user should be navigated to the Forgot Password page", async () => {
      await page.waitForURL(testData.urls.forgotPasswordPage);
    });
  });
});

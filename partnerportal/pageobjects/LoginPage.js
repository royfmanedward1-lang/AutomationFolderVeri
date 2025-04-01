class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#save');
        this.errorMessage = page.locator('h6.MuiTypography-root.MuiTypography-subtitle1[style*="color: red"]');
        this.jobCards = page.locator('.MuiPaper-root');
    }

    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    async navigateToLoginPage() {
        await this.page.goto('https://partner-portal-qa.108.veritext.com/');
    }

    async enterUsername(username) {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async isLoginButtonVisible() {
        return await this.loginButton.isVisible();
    }

    async getCurrentUrl() {
        return await this.page.url();
    }

    async getErrorMessage() {
        await this.errorMessage.waitFor({ state: 'visible' });
        return await this.errorMessage.innerText();
    }

    async isErrorMessageVisible() {
        return await this.errorMessage.isVisible();
    }
    
    async waitForDashboardToLoad() {
        await this.page.waitForURL('**/dashboard');
        await this.jobCards.first().waitFor({ state: 'visible', timeout: 60000 });
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        console.log('Dashboard fully loaded');
    }
}

module.exports = LoginPage;
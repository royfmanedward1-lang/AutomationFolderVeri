class LoginPage {
  constructor(page) {
    this.page = page;
    this.userName = page.getByLabel("Username");
    this.password = page.getByLabel("Password");
    this.signInButton = page.getByRole("button", { name: "Log In" });
    this.errorMessage = page.getByRole("alert");
    this.forgotPasswordLink = page.locator("text=Forgot Password?");
  }

  async goto() {
    await this.page.goto("https://myqa.veritext.com/");
  }

  async enterValidCredentials(username, password) {
    await this.userName.fill(username);
    await this.password.fill(password);
  }

  async clickLoginButton() {
    await this.signInButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}

module.exports = { LoginPage };

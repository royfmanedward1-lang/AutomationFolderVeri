class JobCardPage {
  constructor(page) {
    this.page = page;

    this.successMessageLocator = this.page.locator("h3", {
      hasText: "Success! You're All Set.",
    });
    this.jobNumberLocator = page
      .locator("div")
      .filter({ hasText: /^[0-9]{7}$/ }); // Match a 7-digit job number
    this.statusLocator = page.locator("div").filter({ hasText: /^SCHEDULED$/ });
  }

  async getSuccessMessage() {
    await this.successMessageLocator.waitFor({ state: "visible" });
    return await this.successMessageLocator.textContent();
  }

  async getJobNumber() {
    await this.jobNumberLocator.waitFor({ state: "visible" });
    return await this.jobNumberLocator.textContent();
  }

  async verifyStatus() {
    await this.statusLocator.waitFor({ state: "visible" });
    return await this.statusLocator.textContent();
  }
}

module.exports = { JobCardPage };

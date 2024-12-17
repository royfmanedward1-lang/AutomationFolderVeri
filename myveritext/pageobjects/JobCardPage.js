class JobCardPage {
  constructor(page) {
    this.page = page;

    this.successMessageLocator = this.page.locator("h3", {
      hasText: "Success! You're All Set.",
    });
    this.jobNumberLocator = page
      .locator("div")
      .filter({ hasText: /^[0-9]{7}$/ }); // Match a 7-digit job number
    this.statusLocator = page
      .locator("div")
      .filter({ hasText: /^SCHEDULED/ })
      .first();
    this.optionsButton = page.getByRole("button", { name: "OPTIONS +" });
    this.editScheduleButton = page.getByRole("button", {
      name: "EDIT SCHEDULE",
    });
    this.saveScheduleButton = page.getByRole("button", { name: "Save" });
    this.successAlert = this.page
      .locator("div")
      .filter({ hasText: "Job updated successfully" })
      .nth(2);
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
    const fullStatus = await this.statusLocator.textContent();
    return "SCHEDULED";
  }

  async getFullStatus() {
    await this.statusLocator.waitFor({ state: "visible" });
    return await this.statusLocator.textContent();
  }
  async clickOptions() {
    await this.optionsButton.waitFor({ state: "visible" });
    await this.optionsButton.click();
  }

  async clickEditSchedule() {
    await this.editScheduleButton.waitFor({ state: "visible" });
    await this.editScheduleButton.click();
  }

  async clickSaveSchedule() {
    await this.saveScheduleButton.waitFor({ state: "visible", timeout: 10000 });
    await this.saveScheduleButton.click();
  }

  async getSuccessAlert() {
    await this.successAlert.waitFor({ state: "visible"});
    return await this.successAlert.textContent();
  }
}

module.exports = { JobCardPage };

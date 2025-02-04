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
    this.cancelledStatusLocator = page
      .locator("div")
      .filter({ hasText: /^CANCELLED/ })
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
    this.cancelledAlert = this.page
      .locator("div")
      .filter({ hasText: "Job cancelled successfully" })
      .nth(2);
    this.attorneyInfoSection = page.locator('text=Attorney/Caller Information');
    this.attorneyName = page.locator('text=Attorney Name:').locator('xpath=following-sibling::*');
    this.attorneyEmail = page.locator('text=Contact Email:').first();
    this.contactName = page.locator('text=Contact Name:').locator('xpath=following-sibling::*');
    this.contactEmail = page.locator('text=Contact Email:').last();
    this.confirmNowButton = page.locator('button:has-text("CONFIRM NOW")');
    this.confirmYesButton = page.getByRole('button', { name: 'Yes' });
    this.confirmationBanner = page.locator('div[role="alert"]');
    this.confirmedStatus = page.locator('h6:has-text("CONFIRMED")');
    this.confirmationBanner = page.locator('.MuiSnackbarContent-message:has-text("Job confirmed successfully")');
    this.noButton = page.locator('button.MuiButton-root:has-text("No")').first();
    this.scheduledStatus = page.locator('h6.MuiTypography-subtitle1:has-text("SCHEDULED")');
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

  async verifyCancelledStatus() {
    await this.cancelledStatusLocator.waitFor({ state: "visible" });
    const fullStatus = await this.cancelledStatusLocator.textContent();
    return "CANCELLED";
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

  async getSuccessfulCancelAlert() {
    await this.cancelledAlert.waitFor({ state: "visible" });
    return await this.cancelledAlert.textContent();
  }

  async getAttorneyInfo() {
    return {
      name: await this.attorneyName.textContent(),
      email: await this.attorneyEmail.textContent()
    };
  }

  async getContactInfo() {
    return {
      name: await this.contactName.textContent(),
      email: await this.contactEmail.textContent()
    };
  }

  async clickConfirmNow() {
    await this.confirmNowButton.click();
  }

  async confirmJob() {
    await this.confirmYesButton.click();
  }

  async getConfirmationBannerText() {
    await this.page.waitForLoadState('networkidle');
    await this.confirmationBanner.waitFor({ 
      state: 'visible',
      timeout: 10000
    });
    return await this.confirmationBanner.textContent();
  }

  async verifyConfirmedStatus() {
    await this.confirmedStatus.waitFor({ state: 'visible' });
    return await this.confirmedStatus.isVisible();
  }

  async clickNoOnConfirm() {
    await this.page.waitForLoadState('networkidle');
    await this.noButton.waitFor({ state: 'visible' });
    await this.noButton.click();
  }

  async getScheduledStatus() {
    await this.scheduledStatus.waitFor({ state: 'visible' });
    return await this.scheduledStatus.textContent();
  }

  async verifyScheduledStatus() {
    await this.scheduledStatus.waitFor({ state: 'visible' });
    const fullText = await this.scheduledStatus.textContent();
    const scheduledText = fullText.split('(')[0].trim();
    
    const color = await this.scheduledStatus.evaluate(el => 
      window.getComputedStyle(el).getPropertyValue('color')
    );
    
    return {
      text: scheduledText,
      isBlue: color === 'rgb(21, 136, 204)' 
    };
  }

}

module.exports = { JobCardPage };

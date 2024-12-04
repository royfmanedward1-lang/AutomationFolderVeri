class JobCardPage {
    constructor(page) {
      this.page = page;
  
      // Specific locators
      this.successMessageLocator = this.page.locator('h3', { hasText: "Success! You're All Set." }); // Specific success message
      this.jobNumberLocator = page.locator('div').filter({ hasText: /^[0-9]{7}$/ }); // Match a 7-digit job number
      this.statusLocator = page.locator('div').filter({ hasText: /^SCHEDULED$/ }); // Status locator for "SCHEDULED"
    }
  
    // Method to retrieve the success message
    async getSuccessMessage() {
      await this.successMessageLocator.waitFor({ state: 'visible', timeout: 5000 });
      return await this.successMessageLocator.textContent();
    }
  
    // Method to retrieve the job number
    async getJobNumber() {
      await this.jobNumberLocator.waitFor({ state: 'visible', timeout: 5000 });
      return await this.jobNumberLocator.textContent();
    }
  
    // Method to verify the job status
    async verifyStatus() {
      await this.statusLocator.waitFor({ state: 'visible', timeout: 5000 });
      return await this.statusLocator.textContent();
    }
  }
  
  module.exports = { JobCardPage };
  
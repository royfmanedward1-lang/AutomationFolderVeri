class SnapJobPage {
  constructor(page) {
    this.page = page;
    this.browse = page.getByText('Browse');
    this.videographer = page.getByRole('button', { name: 'Videographer' });
    this.notes = page.getByRole('textbox');
    this.save = page.getByRole('button', { name: 'Save' });
    this.successPopup = page.getByText('Successfully Schedule');
    this.successMessageLocator = this.page.locator("h3", {
      hasText: "Success! You're All Set.",
    });
  }

  async uploadFile() {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),

      await this.browse.click(),
    ])
    await fileChooser.setFiles(['../files/example.txt']);
  }

  async clickVideoGrapher() {
    await this.videographer.click();
  }

  async fillNotes() {
    const testData = require('../utils/testData');
    const formattedHeaderDate = testData.getCurrentFormattedDate({
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    await this.notes.fill("Test " + formattedHeaderDate);
  }

  async clickSave() {
    await this.save.click();
  }

  async getSuccessPopupMessage() {
    await this.successPopup.waitFor({ state: "visible" });
    return await this.successPopup.textContent();
  }

  async getSuccessMessage() {
    await this.successMessageLocator.waitFor({ state: "visible" });
    return await this.successMessageLocator.textContent();
  }
}

module.exports = { SnapJobPage };

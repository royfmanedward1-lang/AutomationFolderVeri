class CustomFieldsPage {
  constructor(page) {
    this.page = page;
    this.claimField = page.getByLabel('Claim #');
    this.adjusterField = page.getByLabel('Adjuster');
    this.priorityDropdown = page.getByLabel('Priority');
    this.highOption = page.getByRole('option', { name: 'High' });
    this.matterField = page.getByLabel('Matter #');
    this.fileField = page.getByLabel('File No');
    this.probabilityField = page.getByLabel('Probability');
    this.nextButton = page.getByRole("button", { name: "NEXT", exact: true });
  }

  async fillClaimField(text) {
    await this.claimField.waitFor({ state: "visible" });
    await this.claimField.fill(text);
  }

  async fillAdjusterField(text) {
    await this.adjusterField.waitFor({ state: "visible" });
    await this.adjusterField.fill(text);
  }

  async fillPriorityDropdown() {
    await this.priorityDropdown.waitFor({ state: "visible" });
    await this.priorityDropdown.click();
    await this.highOption.click();
  }

  async fillMatterField(text) {
    await this.matterField.waitFor({ state: "visible" });
    await this.matterField.fill(text);
  }

  async fillFileField(text) {
    await this.fileField.waitFor({ state: "visible" });
    await this.fileField.fill(text);
  }

  async fillProbabilityField(text) {
    await this.probabilityField.waitFor({ state: "visible" });
    await this.probabilityField.fill(text);
  }

  async clickNext() {
    await this.nextButton.click();
  }
}

module.exports = { CustomFieldsPage };

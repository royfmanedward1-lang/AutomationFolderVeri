class CaseNamePage {
  constructor(page) {
    this.page = page;
    this.caseDropdown = page.getByLabel('Select the Case *'); // Using label selector
    this.countryDropdown = page.locator('select[name="country"]'); // Dropdown for country
    this.nextButton = page.getByRole('button', { name: 'NEXT' }); // Next button
  }

  // Select a case by name
  async selectCaseName() {
    await this.caseDropdown.waitFor({ state: 'visible', timeout: 30000 }); // Wait for dropdown
    await this.caseDropdown.click(); // Open the dropdown
    await this.page.getByRole('listbox', { name: 'Select the Case' }).click();
  }
    
  // Select a country by value
  async selectCountry(countryName) {
    await this.countryDropdown.waitFor({ state: "visible", timeout: 30000 });
    await this.countryDropdown.selectOption({ label: countryName });
  }

  // Click the next button
  async clickNext() {
    await this.nextButton.waitFor({ state: 'visible', timeout: 30000 }); // Ensure button is visible
    await this.nextButton.click(); // Click to proceed
  }
}

module.exports = { CaseNamePage };

class CaseNamePage {
  constructor(page) {
    this.page = page;
    this.caseDropdown = page.getByLabel('Select the Case *'); 
    this.countryDropdown = page.locator('select[name="country"]'); 
    this.nextButton = page.getByRole('button', { name: 'NEXT' }); 
  }

  
  async selectCaseName() {
    await this.caseDropdown.waitFor({ state: 'visible' }); 
    await this.caseDropdown.click(); 
    await this.page.getByRole('listbox', { name: 'Select the Case' }).click();
  }
    
  
  async selectCountry(countryName) {
    await this.countryDropdown.waitFor({ state: 'visible' });
    await this.countryDropdown.selectOption({ label: countryName });
  }

  
  async clickNext() {
    await this.nextButton.waitFor({ state: 'visible' });
    await this.nextButton.click(); 
  }
}

module.exports = { CaseNamePage };

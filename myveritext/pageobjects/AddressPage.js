const testData = require("../utils/testData");

class AddressPage {
  constructor(page) {
    this.page = page;
    // Form fields
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.locationField = page.getByLabel('Location');
    this.addressField = page.getByLabel('Address', { exact: 'true' });
    this.suiteField = page.getByLabel('Suite');
    this.cityField = page.getByLabel('City');
    this.stateDropdown = page.getByLabel('', { exact: true });
    this.stateOption = page.getByRole('option', { name: 'Arizona', exact: true });
    this.zipField = page.getByLabel('Zip/Postal');
    this.contactNameField = page.getByLabel('Contact Name');
    this.phonefield = page.getByPlaceholder('+1 (702) 123-');
    this.countryDropdown = page.locator('select[name="country"]');
    this.saveAddressCheckbox = page.getByLabel('Would you like to save this');
  }

  async fillAddressFormWihoutSave() {
    await this.locationField.fill(testData.jobDetails.caseName[0]);
    await this.addressField.fill(testData.jobDetails.address);
    await this.suiteField.fill(testData.jobDetails.caseName[0]);
    await this.cityField.fill(testData.jobDetails.country);
    await this.suiteField.fill(testData.jobDetails.country);
    await this.zipField.fill("11432");
    await this.contactNameField.fill(testData.remoteParticipants.firstNames[1]);
    await this.phonefield.fill("155555512344");
    await this.countryDropdown.selectOption('1');
    await this.stateDropdown.click();
    await this.stateOption.click();
  }

  async clickSaveAddress() {
    await this.saveAddressCheckbox.check();
  }
}

module.exports = { AddressPage };
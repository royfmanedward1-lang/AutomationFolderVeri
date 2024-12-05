class LocationPage {
  constructor(page) {
    this.page = page;

    // Location types
    this.inPersonOption = page.getByRole("button", {
      name: "IN-PERSON PROCEEDING",
    });
    this.remoteOption = page.getByRole("button", { name: "REMOTE PROCEEDING" });
    this.hybridOption = page.getByRole("button", { name: "HYBRID PROCEEDING" });

    //In-person options
    this.addressBookOption = page.getByRole("button", { name: "ADDRESS BOOK" });
    this.veritextOfficesOption = page.getByRole("button", {
      name: "VERITEXT OFFICES",
    });
    this.findMeLocationOption = page.getByRole("button", {
      name: "FIND ME A LOCATION",
    });

    // Address Book locators
    this.savedAddressCheckbox = page
      .locator('input.PrivateSwitchBase-input[type="checkbox"]')
      .nth(1);

    // Veritext Offices locators
    this.veritextOfficeButtons = page.locator(".MuiButtonBase-root:has(h6)");

    //Find Me a Location locators
    this.countryDropdown = page.locator(
      ".MuiNativeSelect-select.MuiNativeSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input"
    );
    this.stateDropdown = page.getByLabel("", { exact: true });
    this.cityInput = page.getByLabel("City");
    this.zipPostalInput = page.locator('input[name="Zip/Postal"]');
    this.nextButton = page.getByRole("button", { name: "NEXT" });

    // Common locators
    this.nextButton = page.getByRole("button", { name: "NEXT" });
  }

  async selectInPersonOption() {
    await this.inPersonOption.click();
  }

  async selectRemoteOption() {
    await this.remoteOption.click();
  }

  async selectHybridOption() {
    await this.hybridOption.click();
  }

  // Methods to select in-person options
  async selectAddressBookOption(address) {
    await this.addressBookOption.click(); // Click to open the Address Book options

    // Dynamically find the checkbox by address label
    const addressLocator = this.page.locator(
      `label:has-text("${address}") >> input[type="checkbox"]`
    );

    // Wait for the checkbox to be visible
    await addressLocator.waitFor({ state: "visible" });

    // Check the checkbox
    await addressLocator.check();
  }

  async selectVeritextOfficesOption(officeName) {
    await this.veritextOfficesOption.click(); // Navigate to the Veritext Offices page

    // Dynamically select the office by its name
    const officeLocator = this.veritextOfficeButtons.filter({
      hasText: officeName,
    });
    await officeLocator.waitFor({ state: "visible" });
    await officeLocator.click(); // Click the office button
  }

  async selectFindMeLocationOption() {
    await this.findMeLocationOption.click();
  }
  // Fill in State/Province and City
  async fillStateAndCity(state, city) {
    await this.stateDropdown.click();
    await this.page.getByRole("option", { name: state }).click();
    await this.cityInput.click();
    await this.cityInput.fill(city);
  }

  // Fill in a Canadian Zip/Postal Code
  async fillZipPostal(zipCode) {
    await this.zipPostalInput.fill(zipCode);
  }

  // Method to proceed to the next step
  async clickNext() {
    await this.nextButton.click();
  }
}

module.exports = { LocationPage };

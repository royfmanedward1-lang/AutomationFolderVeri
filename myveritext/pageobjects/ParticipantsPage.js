class ParticipantsPage {
  constructor(page) {
    this.page = page;
    this.attendeesSlider = page.locator('input[type="range"]');
    this.attyLawyerDropdown = page.getByLabel("Atty/Lawyer *");
    this.pointOfContactDropdown = page.getByLabel("Point of Contact *");
    this.schedulingOfficeDropdown = page.getByLabel("Scheduling Office *");
    this.addWitnessButton = page.locator('button:has-text("+ Witness")');
    this.lastNameField = page.getByLabel("Last Name *");
    this.nextButton = page.getByRole('button', { name: 'NEXT' });
    this.addWitnessConfirmButton = page.locator(
      'button:has-text("Add Witness")'
    );
    this.scheduleProceedingButton = page.locator(
      "button.MuiButton-text.MuiButton-textSecondary",
      { hasText: "SCHEDULE PROCEEDING" }
    );
    this.confirmProceedingButton = page.locator(
      "button.MuiButton-contained.MuiButton-containedPrimary p",
      { hasText: "SCHEDULE PROCEEDING" }
    );
  }

  async adjustAttendees(count) {
    await this.attendeesSlider.fill(count.toString());
  }

  async selectAttyLawyer(lawyerName) {
    await this.attyLawyerDropdown.click();
    await this.page.getByRole("option", { name: lawyerName }).click();
  }

  async selectPointOfContact(contactName) {
    await this.pointOfContactDropdown.click();
    await this.page.getByRole("option", { name: contactName }).click();
  }

  async selectSchedulingOffice(officeName) {
    await this.schedulingOfficeDropdown.click();
    await this.page.getByRole("option", { name: officeName }).click();
  }

  async addWitness(lastName) {
    await this.addWitnessButton.click();
    await this.lastNameField.fill(lastName);
    await this.addWitnessConfirmButton.click();
  }

  async clickScheduleProceeding() {
    await this.scheduleProceedingButton.click();
  }
  async confirmScheduleProceeding() {
    await this.confirmProceedingButton.click();
  }
  async clickNext() {
    await this.nextButton.click();
  }
}

module.exports = { ParticipantsPage };

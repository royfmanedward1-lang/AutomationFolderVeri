const SMALL_WAIT = 2000;
const MEDIUM_WAIT = 5000;

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
    this.addWitnessConfirmButton = page.locator('button:has-text("Add Witness")');
    this.scheduleProceedingButton = page.locator("button.MuiButton-text.MuiButton-textSecondary", { hasText: "SCHEDULE PROCEEDING" });
    this.confirmProceedingButton = page.locator("button.MuiButton-contained.MuiButton-containedPrimary p", { hasText: "SCHEDULE PROCEEDING" });
    this.addAttorneyButton = page.locator('button.MuiButtonBase-root.MuiButton-root:has-text("+")').first();
    this.addContactButton = page.locator('button.MuiButtonBase-root.MuiButton-root:has-text("+")').nth(1);
    
    // Form fields
    this.firstNameField = page.getByLabel('First Name *');
    this.lastNameField = page.getByLabel('Last Name *');
    this.emailField = page.getByLabel('Email *');
    this.phoneField = page.getByLabel('Phone');
    this.addContactConfirmButton = page.getByRole('button', { name: 'ADD CONTACT' });
    this.titleDropdown = page.getByLabel('Titles *');
  }

  async selectAttyLawyer(lawyerName) {
    try {
      await this.attyLawyerDropdown.click();
      await this.page.getByRole("option", { name: lawyerName }).click();
    } catch (error) {
      console.error("Error selecting attorney:", error);
      throw error;
    }
  }

  async clickAddContactButton() {
    console.log("Starting add contact process");

    try {
      await this.page.waitForLoadState('networkidle');
      await this.addContactButton.waitFor({ state: 'attached', timeout: MEDIUM_WAIT });
      const isVisible = await this.addContactButton.isVisible();
      console.log(`Contact button visibility: ${isVisible}`);
      
      if (!isVisible) {
        console.log("Button not immediately visible, waiting longer...");
        await this.page.waitForTimeout(SMALL_WAIT);
      }
      
      await this.addContactButton.click();
      console.log("Contact button clicked successfully");
      
      await this.page.waitForTimeout(SMALL_WAIT);
    } catch (error) {
      console.error("Error clicking add contact button:", error);
      // Alternative approach if the first attempt fails
      try {
        console.log("Trying alternative selector...");
        const altButton = this.page.locator('button:has(svg.notes_svg__a)').nth(1);
        await altButton.click({ force: true });
        console.log("Clicked using alternative selector");
      } catch (altError) {
        console.error("Both attempts failed:", altError);
        throw error;
      }
    }
  }

  async fillContactForm(contactData, isAttorney = false) {
    await this.page.waitForTimeout(SMALL_WAIT);
    if (isAttorney) {
      await this.titleDropdown.selectOption('1');
    } else {
      const titleOptions = ['3', '4', '5', '7', '10', '11'];
      const randomTitle = titleOptions[Math.floor(Math.random() * titleOptions.length)];
      await this.titleDropdown.selectOption(randomTitle);
    }
    await this.firstNameField.fill(contactData.firstName);
    await this.lastNameField.fill(contactData.lastName);
    await this.emailField.fill(contactData.email);
    await this.phoneField.fill(contactData.phone.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4'));
  }

  async adjustAttendees(count) {
    await this.attendeesSlider.fill(count.toString());
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

  async addRemoteParticipants() {
    await this.firstNameField.fill("test");
    await this.lastNameField.fill("Test 2");
    await this.emailField.fill("test@gmail.com");
  }

  async clickScheduleProceeding() {
    await this.scheduleProceedingButton.isVisible();
    await this.scheduleProceedingButton.click();
  }

  async confirmScheduleProceeding() {
    await this.confirmProceedingButton.isVisible();
    await this.confirmProceedingButton.click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickAddAttorneyButton() {
    await this.addAttorneyButton.click();
  }

  async clickAddContactConfirmButton() {
    await this.addContactConfirmButton.click();
  }
}

module.exports = { ParticipantsPage };
class ParticipantsPage {
    constructor(page) {
        this.page = page;
        this.attendeesSlider = page.locator('input[type="range"]'); // Slider for attendees
        this.attyLawyerDropdown = page.getByLabel('Atty/Lawyer *'); // Lawyer dropdown
        this.pointOfContactDropdown = page.getByLabel('Point of Contact *'); // Point of Contact dropdown
        this.schedulingOfficeDropdown = page.getByLabel('Scheduling Office *'); // Scheduling Office dropdown
        this.addWitnessButton = page.locator('button:has-text("+ Witness")'); // Add Witness button
        this.lastNameField = page.getByLabel('Last Name *'); // Witness last name field
        this.addWitnessConfirmButton = page.locator('button:has-text("Add Witness")'); // Add Witness confirmation button
        this.scheduleProceedingButton = page.locator('button.MuiButton-text.MuiButton-textSecondary', { hasText: 'SCHEDULE PROCEEDING' });
        this.confirmProceedingButton = page.locator('button.MuiButton-contained.MuiButton-containedPrimary p', { hasText: 'SCHEDULE PROCEEDING' });
    }
  
    async adjustAttendees(count) {
      // Adjust attendees using slider
      await this.attendeesSlider.fill(count.toString());
    }
  
    async selectAttyLawyer(lawyerName) {
        // Select the specified lawyer from the dropdown
        await this.attyLawyerDropdown.click();
        await this.page.getByRole('option', { name: lawyerName }).click();
      }
    
      async selectPointOfContact(contactName) {
        // Select the specified point of contact
        await this.pointOfContactDropdown.click();
        await this.page.getByRole('option', { name: contactName }).click();
      }
    
      async selectSchedulingOffice(officeName) {
        // Select the specified scheduling office
        await this.schedulingOfficeDropdown.click();
        await this.page.getByRole('option', { name: officeName }).click();
      }
    
      async addWitness(lastName) {
        // Add a witness
        await this.addWitnessButton.click();
        await this.lastNameField.fill(lastName);
        await this.addWitnessConfirmButton.click();
      }
    
      async clickScheduleProceeding() {
        // Click the Schedule Proceeding button
        await this.scheduleProceedingButton.click();
      }
      async confirmScheduleProceeding() {
        // Click the Schedule Proceeding button
        await this.confirmProceedingButton.click();
      }
  }
  
  module.exports = { ParticipantsPage };
  
class AddRemoteParticipantsPage {
  constructor(page) {
    this.page = page;
    this.firstNameField = page.getByLabel('First Name *');
    this.lastNameField = page.getByLabel('Last Name *');
    this.roleDropdown = page.getByRole('combobox');
    this.emailField = page.getByLabel('Email *');
    this.addParticipantButton = page.getByRole('button', { name: 'ADD PARTICIPANT' });
    this.scheduleProceedingButton = page.getByRole('button', { name: 'SCHEDULE PROCEEDING' });
  }

  async addRemoteParticipant(participant) {
    await this.firstNameField.click();
    await this.firstNameField.fill(participant.firstName);

    await this.lastNameField.click();
    await this.lastNameField.fill(participant.lastName);

    await this.roleDropdown.selectOption(participant.role);

    await this.emailField.click();
    await this.emailField.fill(participant.email);

    await this.addParticipantButton.click();
  }

  async clickScheduleProceeding() {
    await this.scheduleProceedingButton.click();
  }
}

module.exports = { AddRemoteParticipantsPage };

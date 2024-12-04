class ProceedingServicesPage {
    constructor(page) {
      this.page = page;
      this.confirmButton = this.page.getByRole('button', { name: 'CONFIRM' }); // Confirm button
      this.nextButton = page.getByRole('button', { name: 'NEXT', exact: true }); // Next button
    }
  
    // Select one or more services dynamically
    async selectRandomServices(services) {
      for (const service of services) {
        const serviceLocator = this.page.getByLabel(service); // Use dynamic labels from testData
        await serviceLocator.waitFor({ state: 'visible', timeout: 5000 }); // Wait for service to be visible
        await serviceLocator.click(); // Click the checkbox to select/deselect
        if (service.toLowerCase() === 'reporter') {
          // Handle confirm dialog if deselecting "Reporter"
          const confirmDialogVisible = await this.confirmButton.isVisible().catch(() => false);
          if (confirmDialogVisible) {
            await this.confirmButton.click(); // Confirm the removal of "Reporter"
          }
        }
      }
    }
  
    // Proceed to the next step
    async clickNext() {
      await this.nextButton.click();
    }
  }
  
  module.exports = { ProceedingServicesPage };
  
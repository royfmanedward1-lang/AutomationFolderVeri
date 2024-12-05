class ProceedingServicesPage {
  constructor(page) {
    this.page = page;
    this.confirmButton = this.page.getByRole("button", { name: "CONFIRM" });
    this.nextButton = page.getByRole("button", { name: "NEXT", exact: true });
  }

  // Select one or more services dynamically
  async selectRandomServices(services) {
    for (const service of services) {
      const serviceLocator = this.page.getByLabel(service);
      await serviceLocator.waitFor({ state: "visible" });
      await serviceLocator.click(); // Click the checkbox to select/deselect
      if (service.toLowerCase() === "reporter") {
        const confirmDialogVisible = await this.confirmButton
          .isVisible()
          .catch(() => false);
        if (confirmDialogVisible) {
          await this.confirmButton.click();
        }
      }
    }
  }

  async clickNext() {
    await this.nextButton.click();
  }
}

module.exports = { ProceedingServicesPage };

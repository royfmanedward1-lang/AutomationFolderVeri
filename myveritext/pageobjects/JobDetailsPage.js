class JobDetailsPage {
    constructor(page) {
        this.page = page;
        this.optionsButton = page.getByRole('button', { name: 'OPTIONS +' });
        this.duplicateButton = page.getByRole('button', { name: 'DUPLICATE' });
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.exportToPdfButton = page.locator('text=EXPORT TO PDF');
        this.printButton = page.locator('button:has-text("Print")');
      }
 
    async clickOptionsButton() {
      await this.optionsButton.waitFor({ state: 'visible' });
      await this.optionsButton.click();
    }
 
    async clickDuplicate() {
      await this.duplicateButton.waitFor({ state: 'visible' });
      await this.duplicateButton.click();
    }
 
    async clickCreate() {
      await this.createButton.waitFor({ state: 'visible' });
      await this.createButton.click();
    }

    async clickExportToPdf() {
      await this.exportToPdfButton.waitFor({ state: 'visible' });
      await this.exportToPdfButton.click();
      // Let the print dialog load without additional logic
      await this.page.waitForTimeout(3000); // Allow some time for the print dialog
    }
      
}
 
module.exports = { JobDetailsPage };
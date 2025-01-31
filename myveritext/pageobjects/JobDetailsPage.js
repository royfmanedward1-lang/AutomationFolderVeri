const SMALL_WAIT = 3000;

class JobDetailsPage {
    constructor(page) {
        this.page = page;
        this.optionsButton = page.getByRole('button', { name: 'OPTIONS +' });
        this.duplicateButton = page.getByRole('button', { name: 'DUPLICATE' });
        this.cancelButton = page.getByRole('button', { name: 'CANCEL' });
        this.yesButton = page.getByRole('button', { name: 'Yes' });
        this.NoButton = page.getByRole('button', { name: 'No' });
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

    async clickCancel() {
      await this.cancelButton.waitFor({ state: 'visible' });
      await this.cancelButton.click();
    }

    async clickYesButton() {
      await this.yesButton.waitFor({ state: 'visible' });
      await this.yesButton.click();
    }

    async clickNoButton() {
      await this.NoButton.waitFor({ state: 'visible' });
      await this.NoButton.click();
    }
 
    async clickCreate() {
      await this.createButton.waitFor({ state: 'visible' });
      await this.createButton.click();
    }

    async clickExportToPdf() {
      await this.exportToPdfButton.waitFor({ state: 'visible' });
      await this.exportToPdfButton.click();
      await this.page.waitForTimeout(SMALL_WAIT); 
    }
      
}
 
module.exports = { JobDetailsPage };
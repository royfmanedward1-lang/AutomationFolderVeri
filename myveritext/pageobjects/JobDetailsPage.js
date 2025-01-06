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
        await this.page.evaluate(() => {
          window.waitForPrintDialog = new Promise(f => window.print = f);
        });
        
        await this.exportToPdfButton.waitFor({ state: 'visible' });
        await this.exportToPdfButton.click();
        await this.page.waitForFunction('window.waitForPrintDialog');
      }

    async handlePrintDialog() {
      try {
        await this.page.waitForTimeout(3000);
        await this.page.keyboard.press('Control+s');
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);

      } catch (error) {
        console.log('First attempt failed, trying alternative method...');
      
        await this.page.keyboard.press('Control+p');
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Enter');
      }
    }
}
 
module.exports = { JobDetailsPage };
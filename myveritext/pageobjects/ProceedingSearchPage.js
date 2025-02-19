const { test, expect } = require("@playwright/test");

class ProceedingSearchPage {
    constructor(page) {
      this.page = page;
      this.proceedingSearchTab = page.getByRole('tab', { name: 'PROCEEDING SEARCH' });
      this.dateField = page.locator('form[name="refine-by"] div').filter({ hasText: 'Date Range *' }).nth(2);
      this.assignmentNumber = page.getByRole('textbox', { name: 'Assignment Number' });
      this.applyButton = page.getByRole('button', { name: 'Apply' });
      this.filterMessage = page.getByText('Your filters have been');
      this.kebabMenu = page.getByRole('grid').getByRole('button').nth(3);
      this.viewProceedingDetails = page.getByRole('menuitem', { name: 'View Proceeding Details' });
      this.duplicateProceeding = page.getByRole('menuitem', { name: 'Duplicate Proceeding' });
      this.calendarEvent = page.getByRole('menuitem', { name: 'Download Calendar Event' });
      this.exportProceeding = page.getByRole('menuitem', { name: 'Export Proceeding Details to' });
      this.editProceeding = page.getByRole('menuitem', { name: 'Edit Proceeding Details' });
      this.cancelProceeding = page.getByRole('menuitem', { name: 'Cancel Proceeding' });
    }
  
    async selectProceedingTab() {
      await this.proceedingSearchTab.waitFor({ state: "visible" });
      await this.proceedingSearchTab.click();
    }

    async selectFilter(number) {
      await this.assignmentNumber.fill(number);
      await this.applyButton.click();
    }

    async getFilterMessage() {
      await this.filterMessage.waitFor({ state: "visible" });
      return await this.filterMessage.textContent();
    }

    async clickOnKebabMenu() {
      await this.kebabMenu.click();
    }

    async validateMenus() {
      await expect(this.viewProceedingDetails).toBeEditable();
      await expect(this.duplicateProceeding).toBeEditable();
      await expect(this.calendarEvent).toBeEditable();
      await expect(this.exportProceeding).toBeEditable();
      await expect(this.editProceeding).toBeDisabled();
      await expect(this.cancelProceeding).toBeDisabled();
    }
    
  }
  
  module.exports = { ProceedingSearchPage };

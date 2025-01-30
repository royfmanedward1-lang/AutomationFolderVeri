class ProceedingTypePage {
    constructor(page) {
      this.page = page;
      this.proceedingTypeButtons = page.locator(".MuiTypography-root.MuiTypography-body1.jss1891"); 
    }
  
    async selectProceedingType(type) {
      await this.page.getByText(type, { exact: true }).click();
    }
    
  }
  
  module.exports = { ProceedingTypePage };

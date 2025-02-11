import * as utils from '../../utility/utils.js';
export class AssignPartnerPage {
  constructor(page) {
    this.page = page;

    this.showJobDetails = this.page.getByRole('button', { name: 'Show Job Details' });
    this.jobId = this.page.locator("id=jobId");
    this.jobNumber = this.page.locator('[data-field="jobNumber"]');
    this.partnerTab = this.page.getByRole('tab', { name: 'Partners' });
    this.addButton = this.page.getByRole('button', { name: 'Add' });
    this.applyButton = this.page.getByRole('button', { name: 'Apply', exact: true });
    this.partnerSelected = this.page.getByRole('button', { name: 'Selected', exact: true });
    this.removePartnerButton = this.page.getByRole('button', { name: 'Remove' });
    this.partnerTab = this.page.getByRole('tab', { name: 'Partners' });

  };

  async findAvailablePartner() {
    const baseXPath = '/html/body/div[4]/div[3]/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div[{number}]/div[11]/div';
    const baseXPathButton = '//html/body/div[4]/div[3]/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div[{number}]/div[14]/button';
    let number = 1;
    while (true) {
      const currentXPath = baseXPath.replace('{number}', number);
      const currentXPathButton = baseXPathButton.replace('{number}', number);
      const locator = this.page.locator(`xpath=${currentXPath}`);
      const locatorButton = this.page.locator(`xpath=${currentXPathButton}`);
      if (await locator.count() === 0) {
        break;
      }
      const text = await locator.textContent();
      const isEnabled = await locatorButton.isEnabled();
      if (text && text.includes('Available')) {
        if (isEnabled) {
          return locatorButton;
        }
      }
      number++;
    }
    return null;
  }

  async findAvailableAgency() {
    const baseXPathButton = '/html/body/div[4]/div[3]/div/div/div/div[2]/div/div[2]/div/div[3]/div[2]/div/div[2]/div/div[{number}]/div[11]/button';
    let number = 1;
    while (true) {
      const currentXPathButton = baseXPathButton.replace('{number}', number);
      const locatorButton = this.page.locator(`xpath=${currentXPathButton}`);
      if (await locatorButton.count() === 0) {
        break;
      }
      const isEnabled = await locatorButton.isEnabled();
      if (isEnabled) {
        return locatorButton;
      }
    }
    return null;
  }

  async assignVendor(jobId, partnerType) {
    const job = this.page.locator(`//*[@data-id="${jobId}"]`).getByText(partnerType);
    await job.click();
    await utils.waitLoadToFinish(this.page);
    const isPartnerSelected = await this.partnerTab.getAttribute('aria-selected')
    let enabledAddButton;
    if (isPartnerSelected === 'true') {
      enabledAddButton = await this.findAvailablePartner();
    }
    else {
      enabledAddButton = await this.findAvailableAgency();
    }
    await enabledAddButton.click()
    await this.applyButton.first().click();
    await utils.waitLoadToFinish(this.page);
  }
};


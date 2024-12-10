export class AssignPartnerPage {
    constructor(page){
        this.page = page;

        this.showJobDetails = this.page.getByRole('button', { name: 'Show Job Details' });
        this.jobId = this.page.locator("id=jobId");
        this.partnerTab = this.page.getByRole('tab', { name: 'Partners' });
        this.addButton = this.page.getByRole('button', { name: 'Add' });
        this.enabledAddButton = this.page.getByRole('button', { name: 'Add', state: 'enabled' });
        this.applyButton = this.page.getByRole('button', { name : 'Apply', exact: true });
        this.partnerSelected = this.page.getByRole('button', { name : 'Selected', exact: true });
        this.removePartnerButton = this.page.getByRole('button', { name : 'Remove' });
    };
};


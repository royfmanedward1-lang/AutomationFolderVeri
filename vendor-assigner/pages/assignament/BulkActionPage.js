import { expect } from "@playwright/test"
export class BulkActionPage {
    constructor(page) {
        this.page = page
        this.selectAllIdCheckbox = page.getByLabel('Select all rows')
        this.bulkActionComboBox = page.locator('#bulk-action').first()
        this.updatePartnerStatusOption = page.getByRole('option', { name: 'Update Partner Statuses' })
        this.changeStatusFromCombobox = page.getByRole('combobox').nth(1)
        this.chageStatustoComboBox = page.getByLabel('Select Status To')
        this.selectParterTypesComboBox = page.getByRole('combobox').nth(3)
        this.menuOption = page.locator('#menu- > .MuiBackdrop-root')
        this.pendingOption = page.getByRole('option', { name: 'Pending' })
        this.assignedOption = page.getByRole('option', { name: 'Assigned' })
        this.confirmedOption = page.getByRole('option', { name: 'Confirmed' })
        this.waitForCallOption = page.getByRole('option', { name: 'Wait for call' })
        this.allPartnerTypesOption = page.getByRole('option', { name: 'All Partner Types' })
        this.stenoReporterOption = page.getByRole('option', { name: 'Steno Reporter' })
        this.interpreterOption = page.getByRole('option', { name: 'Interpreter' })
        this.videographerOption = page.getByRole('option', { name: 'Videographer' })
        this.proofreaderOption  = page.getByRole('option', { name: 'Proofreader' })
        this.otherOption  = page.getByRole('option', { name: 'Other' })
        this.scopistOption = page.getByRole('option', { name: 'Scopist' })
        this.transcriberOption  = page.getByRole('option', { name: 'Transcriber' })
        this.digitalReporteOption = page.getByRole('option', { name: 'Digital Reporter' })
        this.processServerOption = page.getByRole('option', { name: 'Process Server' })
        this.correctorOption  = page.getByRole('option', { name: 'Corrector' })
        this.conciergeTechOption = page.getByRole('option', { name: 'Concierge-Tech' })
        this.mediatorOption = page.getByRole('option', { name: 'Mediator' })
        this.trialTechOption = page.getByRole('option', { name: 'Trial Tech' })
        this.partnerSelected = page.getByRole('heading', { name: 'Partner Selected' })
        this.closeButton = page.getByRole('button', { name: 'Close' })
        this.updateStatusButton = page.getByRole('button', { name: 'Update Status' })
        this.cancelButton = page.getByRole('button', { name: 'Cancel' })
        this.confirmButton = page.getByRole('button', { name: 'Confirm' })
       
    }
 
   
   
    selectStatusFrom = async () => {
        if (await this.waitForCallOption.isVisible()) {
            await this.waitForCallOption.click();
        } else if (await this.pendingOption.isVisible()) {
            await this.pendingOption.click();
        } else if (await this.assignedOption.isVisible()) {
            await this.assignedOption.click();
        } else if (await this.confirmedOption.isVisible()) {
            await this.confirmedOption.click();
        } else {
            throw new Error('No status option is visible.');
        }
    }

    selectStatusTo = async () => {
        if (await this.waitForCallOption.isVisible()) {
            await this.waitForCallOption.click();
            return 'Wait for call';
        } else if (await this.pendingOption.isVisible()) {
            await this.pendingOption.click();
            return 'Pending';
        } else if (await this.assignedOption.isVisible()) {
            await this.assignedOption.click();
            return 'Assigned';
        } else if (await this.confirmedOption.isVisible()) {
            await this.confirmedOption.click();
            return 'Confirmed';
        } else {
            throw new Error('No status option is visible.');
        }
    };
    
    selectPartnerType = async (status) => {
        switch (status) {
            case 'All Partner Types':
                await expect(this.allPartnerTypesOption).toBeVisible(); 
                await this.allPartnerTypesOption.click(); 
                break;
            case 'Steno Reporter':
                await expect(this.stenoReporterOption).toBeVisible(); 
                await this.stenoReporterOption.click(); 
                break;
            case 'Interpreter':
                await expect(this.interpreterOption).toBeVisible(); 
                await this.interpreterOption.click(); 
                break;
            case 'Videographer':
                await expect(this.videographerOption).toBeVisible();
                await this.videographerOption.click(); 
                break;
                case 'Proofreader':
                await expect(this.proofreaderOption).toBeVisible(); 
                await this.proofreaderOption.click(); 
                break;
            case 'Other':
                await expect(this.otherOption).toBeVisible(); 
                await this.otherOption.click(); 
                break;
            case 'Scopist':
                await expect(this.scopistOption).toBeVisible();
                await this.scopistOption.click(); 
                break;
                case 'Transcriber':
                await expect(this.transcriberOption).toBeVisible();
                await this.transcriberOption.click(); 
                break;
                case 'Digital Reporter':
                await expect(this.digitalReporteOption).toBeVisible();
                await this.digitalReporteOption.click(); 
                break;
                case 'Process Server':
                await expect(this.processServerOption).toBeVisible();
                await this.processServerOption.click(); 
                break;
                case 'Corrector':
                 await expect(this.correctorOption).toBeVisible();
                await this.correctorOption.click(); 
                break;
                case 'Concierge-Tech':
                await expect(this.conciergeTechOption).toBeVisible();
                await this.conciergeTechOption.click(); 
                break;
                case 'Mediator':
                await expect(this.mediatorOption).toBeVisible();
                await this.mediatorOption.click(); 
                break;
                case 'Trial Tech':
                await expect(this.trialTechOption).toBeVisible();
                await this.trialTechOption.click(); 
                break;
        }
    }
}

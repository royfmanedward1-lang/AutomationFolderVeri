import { expect} from "@playwright/test";
//import { attorney, caller, clientAddress } from "../nextgen.config";
//import  clientData from '../testdata/clientData.json'

export class Client {
    constructor(page){
        this.page = page

        // Client name
        this.clientField =  page.locator('#clientName').getByRole('combobox')   
        this.checkIconName = page.locator('#clientName').getByTestId('checkIcon')
        this.invalidClientName = page.getByRole('strong')
        // client office
        this.addressField =  page.locator('#clientOffice').getByRole('combobox')
        this.checkIconAddress = page.locator('#clientOffice').getByTestId('checkIcon')
        // division
        this.divisionField =  page.locator('#division').getByRole('combobox')
        this.checkIconDivision = page.locator('#division').getByTestId('checkIcon')
        // Caller
        this.callerField =  page.locator('#caller').getByRole('combobox')
        this.checkIconCaller = page.locator('#caller').getByTestId('checkIcon')
        // Attorney
        this.attorneyField =  page.locator('#attorney').getByRole('combobox')
        this.checkIconAttorney = page.locator('#attorney').getByTestId('checkIcon')
    }

    async searchClientName (clientName){
        await this.clientField.click()
        await this.clientField.fill(clientName)
        await this.page.getByText(clientName).nth(0).click()
        expect(this.checkIconName).toBeVisible
        expect(this.page.getByText('Select an existing client.')).not.toBeVisible()
    }
    
    async searchInvalidClientName (clientName){
        await this.clientField.click()
        await this.clientField.fill(clientName)
        await this.clientInput.click()
        await expect(this.invalidClientName).toContainText('No results found.')
        await this.page.getByText('Client Name *', { exact: true }).click()
        await expect(this.page.getByTestId('ErrorIcon')).toBeVisible()
        await expect(this.page.getByText('Select an existing client.')).toBeVisible()    
    }

    async searchClientOffice(clientAddress){
        await this.addressField.click()
        await this.addressField.fill(clientAddress)
        await this.page.getByText(clientAddress).nth(0).click()
        expect(this.checkIconAddress).toBeVisible
    }

    async searchDivision(division){
        await this.divisionField.click()
        await this.divisionField.fill(division)
        await this.page.getByText(division).nth(0).click()
        expect(this.checkIconDivision).toBeVisible
    }

    async searchCaller(caller){
        await this.callerField.click()
        await this.callerField.fill(caller)
        await this.page.getByText(caller).nth(0).click()
        expect(this.checkIconCaller).toBeVisible
        
    }

    async searchAttorney(attorney){
        await this.attorneyField.click()
        await this.attorneyField.fill(attorney)
        await this.page.getByText(attorney).nth(0).click()
        expect(this.checkIconAttorney).toBeVisible

    }
}
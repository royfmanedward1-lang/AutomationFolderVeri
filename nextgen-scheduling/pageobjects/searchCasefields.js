import { expect} from "@playwright/test";

export class Case {

    constructor(page){
        this.page = page
       
        //Plaintiff
        this.PlaintiffField =  page.locator('#plaintiff').getByRole('combobox') 
     //   this.PlaintiffInput =  page.locator('//*[@id=":rq:"]')
    //    this.PlaintiffSelect =  page.locator('//*[@id=":rq:-option-0"]')
        this.checkIconPlaintiff = page.locator('#plaintiff').getByTestId('checkIcon')
   
        //Defendant
        this.DefendantField =  page.locator('#defendant').getByRole('combobox') 
     //   this.DefendantInput =  page.locator('//*[@id=":rt:"]')
     //   this.DefendantSelect =  page.locator('//*[@id=":rt:-option-0"]')
        this.checkIconDefendant = page.locator('#defendant').getByTestId('checkIcon')

        //case number
        this.caseNbrField =  page.locator('#caseNumber').getByRole('combobox') 
     //   this.caseNbrInput =  page.locator('//*[@id=":rk:"]')
     //   this.caseNbrSelect =  page.locator('//*[@id=":rk:-option-0"]')
        this.checkIconcaseNbr = page.locator('#caseNumber').getByTestId('checkIcon')

        //case name
        this.caseNameField =  page.locator('#caseName').getByRole('combobox') 
      //  this.caseNameInput =  page.locator('//*[@id=":rn:"]')
      //  this.caseNameSelect =  page.locator('//*[@id=":rn:-option-0"]')
        this.checkIconcaseName = page.locator('#caseName').getByTestId('checkIcon')
    }

     
    async searchCaseNbr(caseNbr){
        await this.caseNbrField.click()
        if(await this.caseNbrSelect.count() > 0){
            await this.caseNbrSelect.click()
            expect(this.checkIconcaseNbr).toBeVisible
        } else {
            await this.caseNbrInput.fill(caseNbr)
        }   
    }

    async searchCaseName(caseName){
        await this.caseNameField.click()
        if(await this.caseNameSelect.count() > 0){
            await this.caseNameSelect.click()
            expect(this.checkIconcaseName).toBeVisible
        } else {
            await this.caseNameInput.fill(caseName)
        }
    }

    async searchPlaintiff(plaintiff){
        await this.PlaintiffField.click()
        await this.PlaintiffField.fill(plaintiff)
        await this.page.getByText(plaintiff).nth(0).click()
        expect(this.checkIconPlaintiff).toBeVisible
    }

    async searchDefendant(defendant){
        await this.DefendantField.click()
        await this.DefendantField.fill(defendant)
        await this.page.getByText(defendant).nth(0).click()
        expect(this.checkIconDefendant).toBeVisible  
    }
        
}
export class PartnerInfoPage {
    constructor(page) {
        this.page = page
        this.searchText = page.getByPlaceholder('Search Partner Last Name /')
        this.NoFoundOption = page.getByText('No Partner or Agency Found');
        this.inputFirstName = page.locator(`[name='firstName']`).first()  
        this.inputLastName = page.locator(`[name='lastName']`).first()
        this.inputEmail = page.locator(`[name='email']`).first()
        this.inputBillingEmail = page.locator(`[name='billingEmail']`).first()
        this.errorEmail = page.getByText('Enter a valid email address.Example: email@example.com').first()
        this.menu = page.locator('.app > div > div > div').first()
        this.inputAgencyName = page.locator(`[name='name']`).first() 
        this.buttonSave = page.getByRole('button', { name: 'Save' })

    }   

    selectFirstOption = async () => {
        const searchBar = await this.page.getByRole('option').nth(0)
        await searchBar.click()
    }   
}



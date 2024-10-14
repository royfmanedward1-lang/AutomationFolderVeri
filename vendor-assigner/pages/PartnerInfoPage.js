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
        this.inputIndependentContractor = page.getByLabel('Independent Contractor')
        this.serviceLink = page.getByRole('tab', { name: 'Services' }).nth(1)
        this.succesNoResults = page.locator('div').filter({ hasText: 'No Results FoundTry a new' }).nth(2)
    }

    getServiceLocator = async () => {
        const serviceLabel = await this.page.locator('label').filter({
            hasText: 'Service'
        })
        const attributeFor = await serviceLabel.getAttribute('for')
        const serviceSelector = `[id='${attributeFor}']`;
        return this.page.locator(serviceSelector)
    }
    selectFirstOption = async () => {
        const searchBar = await this.page.getByRole('option').nth(0)
        await searchBar.click()
    }

    verifyServiceAlphabeticalOrder = async () =>{
        const serviceArray = await this.getServiceList()
        return this.verifyAlphabeticalOrder(serviceArray)
    }

    verifyServiceCharacterContain = async (str) =>{
        const serviceArray = await this.getServiceList()
        return this.itemsContainStringIgnoreCase(serviceArray, str)
    }

    getServiceList = async () => {
        const serviceLabel = await this.page.locator('label').filter({
            hasText: 'Service'
        })
        const attributeFor = await serviceLabel.getAttribute('for')
        const serviceArray = [];
        let index = 0;
        while (true) {
            const serviceSelector = `[id='${attributeFor}-option-${index}']`;
            const serviceItem = await this.page.locator(serviceSelector);
            
            if (await serviceItem.count() === 0) {
                break;
            }
            
            const span = await serviceItem.textContent();
            serviceArray.push(span.trim());
            index++;
        }
        return serviceArray;
    }

    verifyAlphabeticalOrder(servicesArray) {
        const sortedArray = [...servicesArray].sort((a, b) => a.localeCompare(b));
        return JSON.stringify(servicesArray) === JSON.stringify(sortedArray);
    }

    itemsContainStringIgnoreCase(array, str) {
        const lowerCaseStr = str.toLowerCase();
        return array.every(item => item.toLowerCase().includes(lowerCaseStr));
    }
}
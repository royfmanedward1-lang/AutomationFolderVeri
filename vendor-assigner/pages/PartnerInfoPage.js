export class PartnerInfoPage {
    constructor(page) {
        this.page = page;
        this.searchText = page.getByPlaceholder('Search Partner Last Name /');
        this.NoFoundOption = page.getByText('No Partner or Agency Found');
        this.inputFirstName = page.locator(`[name='firstName']`).first();
        this.inputLastName = page.locator(`[name='lastName']`).first();
        this.inputEmail = page.locator(`[name='email']`).first();
        this.inputBillingEmail = page.locator(`[name='billingEmail']`).first();
        this.errorEmail = page.getByText('Enter a valid email address.Example: email@example.com').first();
        this.menu = page.locator('#profile-form');
        this.inputAgencyName = page.locator(`[name='name']`).first();
        this.buttonSave = page.getByRole('button', { name: 'Save' });
        this.inputIndependentContractor = page.getByLabel('Independent Contractor');
        this.serviceLink = page.getByRole('tab', { name: 'Services' }).nth(1);
        this.serviceLabel =  page.locator('label').filter({ hasText: 'Service' })
        this.successNoResults = page.locator('div').filter({ hasText: 'No Results Found' }).nth(2);
        this.searchBar = this.page.getByRole('option');
        this.requiredError = this.page.getByTestId('ErrorIcon');
        this.firstNameRequiredFieldWarn = this.page.getByText('Enter a partner first name.');
        this.lastNameRequiredFieldWarn = this.page.getByText('Enter a partner last name.');
        this.invalidCharacterWarn = this.page.getByText('Remove invalid character');
        this.exceedingCharactersWarn = this.page.getByText('Enter 50 characters or less.');
    };

    clearInputField = async (inputField) => {
        await inputField.click();
        await inputField.selectText();
        await inputField.press('Backspace');
        await this.buttonSave.click({force: true});
    };

    getServiceLocator = async () => {
        const attributeFor = await this.serviceLabel.getAttribute('for');
        const serviceSelector = `[id='${attributeFor}']`;
        return this.page.locator(serviceSelector);
    };

    selectFirstOption = async () => {
        const firstResult = await this.searchBar.first();
        await firstResult.click();
    };

    verifyServiceAlphabeticalOrder = async () =>{
        const serviceArray = await this.getServiceList();
        return this.verifyAlphabeticalOrder(serviceArray);
    };

    verifyServiceCharacterContain = async (str) =>{
        const serviceArray = await this.getServiceList();
        return this.itemsContainStringIgnoreCase(serviceArray, str);
    };

    getServiceList = async () => {
        const attributeFor = await this.serviceLabel.getAttribute('for');
        const serviceArray = [];
        let index = 0;
        while (true) {
            const serviceSelector = `[id='${attributeFor}-option-${index}']`;
            const serviceItem = await this.page.locator(serviceSelector);
            
            if (await serviceItem.count() === 0) {
                break;
            };
            
            const span = await serviceItem.textContent();
            serviceArray.push(span.trim());
            index++;
        }
        return serviceArray;
    };

    isServiceFieldFocused= async () => {
        const attributeFor = await this.serviceLabel.getAttribute('for');
        const serviceOptionsSelector = `[aria-owns='${attributeFor}-listbox']`;
        const serviceOptions = await this.page.locator(serviceOptionsSelector);
        return serviceOptions;
    };

    verifyAlphabeticalOrder(servicesArray) {
        const sortedArray = [...servicesArray].sort((a, b) => a.localeCompare(b));
        return JSON.stringify(servicesArray) === JSON.stringify(sortedArray);
    };

    itemsContainStringIgnoreCase(array, str) {
        const lowerCaseStr = str.toLowerCase();
        return array.every(item => item.toLowerCase().includes(lowerCaseStr));
    };
};
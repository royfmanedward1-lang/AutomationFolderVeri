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
        this.buttonClearAll = page.getByRole('button', { name: 'Clear All' }).nth(1)
        this.buttonClearAllConfirmation = page.getByRole('button', { name: 'Clear All' })
        this.inputIndependentContractor = page.getByLabel('Independent Contractor');
        this.serviceLink = page.getByRole('tab', { name: 'Services' }).nth(1);
        this.languageLink = page.getByRole('tab', { name: 'Languages' })
        this.partnerTypeLink = page.getByRole('tab', { name: 'Partner Types' })
        this.serviceLabel =  page.locator('label').filter({ hasText: 'Service' })
        this.parterTypeLabel = page.locator('label').filter({ hasText: 'Partner Type' })
        this.languageLabel= page.locator('label').filter({ hasText: 'language' })
        this.successNoResults = page.locator('div').filter({ hasText: 'No Results Found' }).nth(2);
        this.searchBar = this.page.getByRole('option');
        this.partnerList = this.page.getByRole('listbox');
        this.searchError = this.page.getByText('Select an existing Partner or Agency.');
        this.requiredError = this.page.getByTestId('ErrorIcon');
        this.searchFieldErrorIcon = this.page.getByTestId('ErrorOutlinedIcon')
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

    getParterTypeLocator = async () => {
    const attributeFor = await this.parterTypeLabel.getAttribute('for');
    const partnertypeSelector =  `[id='${attributeFor}']`;
    return this.page.locator(partnertypeSelector);
    };

    getLanguageLocator = async () => {
        const attributeFor = await this.languageLabel.getAttribute('for');
        const languageSelector =  `[id='${attributeFor}']`;
        return this.page.locator(languageSelector);
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

    getLanguages = async () => {
        const attributeFor = await this.languageLabel.getAttribute('for');
        console.log(attributeFor, 'attributeFor')
        const languageArray = [];
        let index = 0;
        while (true) {
            const languageSelector = `[id='${attributeFor}-option-${index}']`;
            const languageItem = await this.page.locator(languageSelector);
            
            if (await languageItem.count() === 0) {
                break;
            };
            
            const span = await languageItem.textContent();
            languageArray.push(span.trim());
            index++;
        }
        return languageArray;
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
class JobDetailsPage {
    constructor(page) {
        this.page = page;
        this.jobHeader = page.locator('h1, h2, h3, h4, h5, h6').filter({ hasText: 'vs.' }).first();
        this.witnessPanel = page.locator('#witness-panel');
        this.witnessesHeading = this.witnessPanel.getByRole('heading', { name: 'Witnesses' });
        this.witnessesAddButton = this.witnessPanel.getByRole('button', { name: 'Add' });
        this.witnessForm = page.locator('fieldset:has-text("Main Witness Info")');
        this.prefixInput = page.locator('input[name="salutation"]');
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.suffixInput = page.locator('input[name="suffix"]');
        this.expertiseDropdown = page.locator('select#expertise-dropdown');
        this.saveAndContinueButton = page.locator('button#witness-save-add-button');
        this.saveAndCloseButton = page.locator('button#witness-save-close-button');
        this.successNotification = page.locator('text=Witness saved successfully');
        this.witnessList = page.locator('ul.MuiList-root');
        this.witnessListItems = page.locator('ul.MuiList-root .MuiTypography-root');
    }

    async waitForJobDetailsPageToLoad() {
        await this.jobHeader.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
        console.log('Job details page loaded with header:', await this.jobHeader.textContent());
    }

    async findAndClickJobWithVs() {
        console.log('Finding job with "vs." in the title');
        const vsJobTitle = this.page.locator('h6.MuiTypography-h6:has-text("vs.")').first();
        const titleText = await vsJobTitle.textContent();
        console.log(`Found job with title: "${titleText}"`);
        const parentAnchor = vsJobTitle.locator('xpath=ancestor::a');
        console.log('About to click on job card with vs. in title');
        await parentAnchor.click();
        await this.page.waitForLoadState('networkidle');
        console.log('Clicked on job card and waited for page to load');
        await this.waitForJobDetailsPageToLoad();
    }

    async waitForWitnessSectionToLoad() {
        await this.witnessPanel.waitFor({ state: 'visible', timeout: 15000 });
        await this.witnessesHeading.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Witnesses section is loaded');
    }

    async clickWitnessesAddButton() {
        await this.waitForWitnessSectionToLoad();
        console.log('Found Add button in Witnesses section, clicking it');
        await this.witnessesAddButton.click();
        console.log('Clicked on Witnesses Add button');
        await this.witnessForm.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Witness form is now visible');
    }

    async fillWitnessForm(witnessData) {
        if (witnessData.prefix) {
            await this.prefixInput.fill(witnessData.prefix);
        }
        if (witnessData.firstName) {
            await this.firstNameInput.fill(witnessData.firstName);
        }
        if (witnessData.middleName) {
            await this.middleNameInput.fill(witnessData.middleName);
        }
        await this.lastNameInput.fill(witnessData.lastName);
        console.log(`Filled last name with: ${witnessData.lastName}`);
        if (witnessData.suffix) {
            await this.suffixInput.fill(witnessData.suffix);
        }
        if (witnessData.expertise) {
            await this.expertiseDropdown.selectOption({ label: witnessData.expertise });
        }
    }

    async verifyWitnessSaveButtonsVisible() {
        await this.saveAndContinueButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.saveAndCloseButton.waitFor({ state: 'visible', timeout: 5000 });
        const isContinueVisible = await this.saveAndContinueButton.isVisible();
        const isCloseVisible = await this.saveAndCloseButton.isVisible();
        console.log('Save buttons visibility:', { isContinueVisible, isCloseVisible });
        return isContinueVisible && isCloseVisible;
    }

    async clickSaveAndCloseButton() {
        await this.saveAndCloseButton.click();
        console.log('Clicked Save & Close button');
        await this.page.waitForTimeout(500);
    }

    async waitForSuccessNotification() {
        await this.successNotification.waitFor({ state: 'visible', timeout: 5000 });
        console.log('Success notification appeared');
        return await this.successNotification.isVisible();
    }

    async isWitnessInList(lastName) {
        await this.page.waitForTimeout(1000);        
        const count = await this.witnessListItems.count();
        console.log(`Found ${count} witnesses in the list`);
        for (let i = 0; i < count; i++) {
            const text = await this.witnessListItems.nth(i).textContent();
            console.log(`Witness ${i}: ${text}`);
            if (text.includes(lastName)) {
                return true;
            }
        }
        return false;
    }
    
    async addWitness(lastName) {
        await this.clickWitnessesAddButton();
        await this.fillWitnessForm({ lastName });
        await this.verifyWitnessSaveButtonsVisible();
        await this.clickSaveAndCloseButton();
        await this.waitForSuccessNotification();
        return await this.isWitnessInList(lastName);
    }
    
    async addWitnessWithFullData(witnessData) {
        await this.clickWitnessesAddButton();
        await this.fillWitnessForm(witnessData);
        await this.verifyWitnessSaveButtonsVisible();
        await this.clickSaveAndCloseButton();
        await this.waitForSuccessNotification();
        return await this.isWitnessInList(witnessData.lastName);
    }
}

module.exports = JobDetailsPage;
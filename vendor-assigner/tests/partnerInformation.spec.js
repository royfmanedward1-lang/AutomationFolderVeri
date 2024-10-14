import { LoginPage } from '../pages/LoginPage.js'
import { HeaderPage } from '../pages/assignament/HeaderPage.js'
import { PartnerInfoPage } from '../pages/PartnerInfoPage.js'
const { test, expect } = require('@playwright/test')


test.beforeEach('Logging in', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.login()
  })

test('search invalid partner information', async ({page}) => {
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('zzz')
    await expect(partnerInfoPage.NoFoundOption).toHaveText('No Partner or Agency Found')

})

test('search partner information', async ({page}) => {
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('Ancalade')
    await partnerInfoPage.selectFirstOption()
    const firstName = await partnerInfoPage.inputFirstName.inputValue()
    await expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Ancalade')
    await partnerInfoPage.searchText.fill('')
    await partnerInfoPage.searchText.fill(firstName)
    await expect(partnerInfoPage.NoFoundOption).toHaveText('No Partner or Agency Found')
})

test('search agency information', async ({page}) => {
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('Brandon Legal')
    await partnerInfoPage.selectFirstOption()
    await expect(partnerInfoPage.buttonSave).toBeDisabled()
    await expect(await partnerInfoPage.inputAgencyName.inputValue()).toContain('Brandon')
    await partnerInfoPage.inputEmail.fill('-')
    await expect(partnerInfoPage.buttonSave).toBeEnabled()
    await partnerInfoPage.menu.click()
    await expect(await partnerInfoPage.errorEmail).toHaveText('Enter a valid email address.Example: email@example.com')
    await partnerInfoPage.inputEmail.click()
    await partnerInfoPage.page.keyboard.press('Backspace')
    await partnerInfoPage.menu.click()
    await partnerInfoPage.inputBillingEmail.fill('-')
    await partnerInfoPage.menu.click()
    await expect(await partnerInfoPage.errorEmail).toHaveText('Enter a valid email address.Example: email@example.com')
    await partnerInfoPage.inputBillingEmail.click()
    await partnerInfoPage.page.keyboard.press('Backspace')
    await partnerInfoPage.menu.click()
})
test('Partner has a type and an email filled ',async ({page})=>{
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('Alfara')
    await partnerInfoPage.selectFirstOption()
    await expect(await partnerInfoPage.inputIndependentContractor).toHaveText('Independent Contractor')
    await expect(await partnerInfoPage.inputEmail).toHaveValue(/.+/);
})

test('Service type is selectable ',async ({page})=>{
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('Alfara')
    await partnerInfoPage.selectFirstOption()
    await expect(await partnerInfoPage.inputIndependentContractor).toHaveText('Independent Contractor')
    await expect(await partnerInfoPage.inputEmail).toHaveValue(/.+/);
    const partnerTypeCount = page.locator('.MuiBox-root.mui-style-1wmkppu');
    const lengthValue = await partnerTypeCount.getAttribute('length');
    expect(lengthValue).toBe('1');
    await partnerInfoPage.serviceLink.click()
    const dropDownService = await partnerInfoPage.getServiceLocator()
    await dropDownService.waitFor({ state: 'visible' });
    let servicePlaceholder = await dropDownService.getAttribute('placeholder')
    await expect(servicePlaceholder).toEqual('Select Service')
    await dropDownService.click()
    servicePlaceholder = await dropDownService.getAttribute('placeholder')
    await expect(servicePlaceholder).toEqual('')
    const areServicesAphabeticalOrder = await partnerInfoPage.verifyServiceAlphabeticalOrder();
    expect(areServicesAphabeticalOrder).toBeTruthy()
})

test('Filtering services with a single character search',async ({page})=>{
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('Alfara')
    await partnerInfoPage.selectFirstOption()
    const dropDownService = await partnerInfoPage.getServiceLocator()
    await dropDownService.fill('R');
    const areServicesAphabeticalOrder = await partnerInfoPage.verifyServiceAlphabeticalOrder();
    expect(areServicesAphabeticalOrder).toBeTruthy()
    const areServicesItemsWithCharacter = await partnerInfoPage.verifyServiceCharacterContain("R");
    expect(areServicesItemsWithCharacter).toBeTruthy()
})


test('Filtering services with multiple characters search',async ({page})=>{
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('Alfara')
    await partnerInfoPage.selectFirstOption()
    const dropDownService = await partnerInfoPage.getServiceLocator()
    await dropDownService.fill('CA');
    const areServicesAphabeticalOrder = await partnerInfoPage.verifyServiceAlphabeticalOrder();
    expect(areServicesAphabeticalOrder).toBeTruthy()
    const areServicesItemsWithCharacter = await partnerInfoPage.verifyServiceCharacterContain("CA");
    expect(areServicesItemsWithCharacter).toBeTruthy()
})

test('filtering services with empty result',async ({page})=>{
    const headerPage = new HeaderPage(page)
    const partnerInfoPage = new PartnerInfoPage(page)
    await headerPage.partnerInformationTab.click()
    await partnerInfoPage.searchText.fill('Alfara')
    await partnerInfoPage.selectFirstOption()
    const dropDownService = await partnerInfoPage.getServiceLocator()
    await dropDownService.fill('Rft');
    await expect(partnerInfoPage.succesNoResults).toHaveText('No Results FoundTry a new search.')
    await partnerInfoPage.menu.click();
})
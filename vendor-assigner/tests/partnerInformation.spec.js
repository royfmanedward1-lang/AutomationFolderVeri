const { test, expect } = require('@playwright/test');
import { LoginPage } from '../pages/LoginPage.js';
import { HeaderPage } from '../pages/assignement/HeaderPage.js';
import { PartnerInfoPage } from '../pages/PartnerInfoPage.js';
import { AssignPartnerPage } from '../pages/assignement/AssignPartnerPage.js';
import { PartnerInfoService } from '../services/partnerInfoService';
import { loginService } from '../services/loginService';
import { JobService } from '../services/jobService.js';
import PartnerInfoClass from '../utility/partnerInfoClass.js';
import * as utils from '../utility/utils.js';

test.beforeEach('Logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login();
});

test('Get Partner Information In GDS', async ({ page }) => {
    let accessToken; 
    let jobId;
    let vpzId;
    let partnerInfoService = new PartnerInfoService();
    let jobService = new JobService();
    
    let allJobs
    await test.step('Get job`s list', async() => {        
        await utils.waitGridToLoad(page);
        const assignPartnerPage = new AssignPartnerPage(page);
        allJobs = await assignPartnerPage.jobNumber.allInnerTexts();
        jobId = parseInt(allJobs[1]);
    })
    
    await test.step('Logging into GDS', async() => {
        accessToken = await loginService();
    })

    await test.step('Get job VPZ', async() => {
        const jobResponse = await jobService.getJob(accessToken, jobId);
        vpzId = jobResponse.data.job.vpz.id;
    })

    await test.step('Getting the info', async() => {
        const partner = new PartnerInfoClass({
            jobId: jobId,
            serviceTypeIds: 1,
            VPZIds: vpzId
        });
    
        const partnerInfo = await partnerInfoService.getPartnerAvailability(accessToken, partner.generateQueryByJob());
    })
});

test.describe('Search functionality and search bar'), () => {

    test('Search partner information', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Ancalade"', async () => {
            await partnerInfoPage.searchText.fill('Ancalade');
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        const firstName = await partnerInfoPage.inputFirstName.inputValue();
    
        await test.step('Verify last name contains "Ancalade"', async () => {
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Ancalade');
        });
    
        await test.step('Clear search and re-search with first name', async () => {
            await partnerInfoPage.searchText.fill('');
            await partnerInfoPage.searchText.fill(firstName);
        });
    
        await test.step('Verify "No Partner or Agency Found" message appears', async () => {
            await expect(partnerInfoPage.NoFoundOption).toHaveText('No Partner or Agency Found');
        });
    });
    
    test('Search agency information', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for agency "Brandon"', async () => {
            await partnerInfoPage.searchText.fill('Brandon');
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify save button is disabled and agency name is "Brandon"', async () => {
            await expect(partnerInfoPage.buttonSave).toBeDisabled();
            await expect(await partnerInfoPage.inputAgencyName.inputValue()).toContain('Brandon');
        });
    
        await test.step('Fill invalid email and verify save button is enabled', async () => {
            await partnerInfoPage.inputEmail.fill('-');
            await expect(partnerInfoPage.buttonSave).toBeEnabled();
        });
    
        await test.step('Trigger email validation error with invalid email', async () => {
            await partnerInfoPage.menu.click();
            await expect(await partnerInfoPage.errorEmail).toHaveText('Enter a valid email address.Example: email@example.com');
        });
    
        await test.step('Clear email and retry invalid input to trigger error again', async () => {
            await partnerInfoPage.inputEmail.click();
            await partnerInfoPage.page.keyboard.press('Backspace');
            await partnerInfoPage.menu.click();
    
            await partnerInfoPage.inputEmail.fill('-');
            await partnerInfoPage.menu.click();
    
            await expect(await partnerInfoPage.errorEmail).toHaveText('Enter a valid email address.Example: email@example.com');
        });
    
        await test.step('Clear email input after validation error', async () => {
            await partnerInfoPage.inputEmail.click();
            await partnerInfoPage.page.keyboard.press('Backspace');
            await partnerInfoPage.menu.click();
        });
    });
    
    test('Search invalid partner information', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Enter an invalid partner name "zzz"', async () => {
            await partnerInfoPage.searchText.fill('zzz');
        });
    
        await test.step('Verify "No Partner or Agency Found" message appears', async () => {
            await expect(partnerInfoPage.NoFoundOption).toHaveText('No Partner or Agency Found');
        });
    });
}

test.describe('Partner information inside profile'), () => {

    test('Partner has a type and an email filled', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Alfara"', async () => {
            await partnerInfoPage.searchText.fill('Alfara');
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify "Independent Contractor" text in Partner Info Page', async () => {
            await expect(partnerInfoPage.inputIndependentContractor).toHaveText('Independent Contractor');
        });
    
        await test.step('Verify that the email field is filled', async () => {
            await expect(partnerInfoPage.inputEmail).toHaveValue(/.+/);
        });
    });
}

test.describe('Name Field inside partner profile'), () => {

    test('Name Fields are Editable', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Gail Mascaro"', async () => {
            await partnerInfoPage.searchText.fill('Mascaro');
            await expect(partnerInfoPage.searchBar.first()).toContainText("Gail Mascaro");
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        const firstName = await partnerInfoPage.inputFirstName.inputValue();
    
        await test.step('Verify last name contains "Mascaro"', async () => {
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Mascaro');
        });
    
        await test.step('Typing into last name field', async () => {
            const inputText = "abcdefg";
            await partnerInfoPage.inputLastName.fill(inputText);
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain(inputText);
        });
    
        await test.step('Typing into first name field', async () => {
            const inputText = "abcdefg";
            await partnerInfoPage.inputFirstName.fill(inputText);
            expect(await partnerInfoPage.inputFirstName.inputValue()).toContain(inputText);
        });
    });
    
    test('Name Fields are Required', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Gail Mascaro"', async () => {
            await partnerInfoPage.searchText.fill('Mascaro');
            await expect(partnerInfoPage.searchBar.first()).toContainText("Gail Mascaro");
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify last name contains "Mascaro"', async () => {
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Mascaro');
        });
    
        await test.step('Erasing last name field completely', async () => {
            await partnerInfoPage.clearInputField(partnerInfoPage.inputLastName);
        });
    
        await test.step('Last Name Field is Required', async () => {
            await expect(partnerInfoPage.requiredError.first()).toBeVisible();
            await expect(partnerInfoPage.lastNameRequiredFieldWarn).toBeVisible();
        });
    
        await test.step('Erasing first name field completely', async () => {
            await partnerInfoPage.clearInputField(partnerInfoPage.inputFirstName);
        });
    
        await test.step('First Name Field is Required', async () => {
            await expect(partnerInfoPage.requiredError.first()).toBeVisible();
            await expect(partnerInfoPage.firstNameRequiredFieldWarn).toBeVisible();
        });
    });
    
    test('Invalid Characters in Name Fields', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Gail Mascaro"', async () => {
            await partnerInfoPage.searchText.fill('Mascaro');
            await expect(partnerInfoPage.searchBar.first()).toContainText("Gail Mascaro");
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify last name contains "Mascaro"', async () => {
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Mascaro');
        });
    
        await test.step('Checking invalid characters into last name field', async () => {
            for (const list of utils.invalidCharacters) {
                await partnerInfoPage.inputLastName.fill(list);
                await partnerInfoPage.inputFirstName.click();
                await expect(partnerInfoPage.invalidCharacterWarn).toContainText(list);
            };
        });
    
        await test.step('Filling last name back', async () => {
            await partnerInfoPage.clearInputField(partnerInfoPage.inputLastName);
            await partnerInfoPage.inputLastName.fill('Mascaro');
        });
    
        await test.step('Checking invalid characters into first name field', async () => {
            for (const list of utils.invalidCharacters) {
                await partnerInfoPage.inputFirstName.fill(list);
                await partnerInfoPage.inputLastName.click();
                await expect(partnerInfoPage.invalidCharacterWarn).toContainText(list);
            };
        });
    });
    
    test('Exceeding Characters in Last Name Field', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Gail Mascaro"', async () => {
            await partnerInfoPage.searchText.fill('Mascaro');
            await expect(partnerInfoPage.searchBar.first()).toContainText("Gail Mascaro");
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify last name contains "Mascaro"', async () => {
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Mascaro');
        });
    
        await test.step('Checking exceeding characters into last name field', async () => {
            const randomString = utils.createRandomString(51);
            await partnerInfoPage.inputLastName.fill(randomString);
            await expect(partnerInfoPage.exceedingCharactersWarn).toBeVisible();
        });
    
        await test.step('Warning disappears if limit is not surpassed', async () => {
            await partnerInfoPage.inputLastName.press('Backspace');
            await expect(partnerInfoPage.exceedingCharactersWarn).not.toBeVisible();
        });
    
        await test.step('Nothing new can be typed after threshold', async () => {
            const randomString = utils.createRandomString(80);
            await partnerInfoPage.inputLastName.fill(randomString);
            await expect(partnerInfoPage.exceedingCharactersWarn).toBeVisible();
            await expect(partnerInfoPage.inputLastName).toHaveValue(randomString);
            await partnerInfoPage.inputLastName.press("A");
            await expect(partnerInfoPage.inputLastName).toHaveValue(randomString);
        });
    });
    
    test('Exceeding Characters in First Name Field', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Gail Mascaro"', async () => {
            await partnerInfoPage.searchText.fill('Mascaro');
            await expect(partnerInfoPage.searchBar.first()).toContainText("Gail Mascaro");
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify last name contains "Gail"', async () => {
            expect(await partnerInfoPage.inputFirstName.inputValue()).toContain('Gail');
        });
    
        await test.step('Checking exceeding characters into first name field', async () => {
            const randomString = utils.createRandomString(51);
            await partnerInfoPage.inputFirstName.fill(randomString);
            await expect(partnerInfoPage.exceedingCharactersWarn).toBeVisible();
        });
    
        await test.step('Warning disappears if limit is not surpassed', async () => {
            await partnerInfoPage.inputFirstName.press('Backspace');
            await expect(partnerInfoPage.exceedingCharactersWarn).not.toBeVisible();
        });
    
        await test.step('Nothing new can be typed after threshold', async () => {
            const randomString = utils.createRandomString(80);
            await partnerInfoPage.inputFirstName.fill(randomString);
            await expect(partnerInfoPage.exceedingCharactersWarn).toBeVisible();
            await expect(partnerInfoPage.inputFirstName).toHaveValue(randomString);
            await partnerInfoPage.inputFirstName.press("A");
            await expect(partnerInfoPage.inputFirstName).toHaveValue(randomString);
        });
    });
}

test.describe('Service Type inside partner profile'), () => {

    test('Service type is selectable ', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Given I select Partner Information TAB', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('And I fill in "Brandon" in the search text field', async () => {
            await partnerInfoPage.searchText.fill('Alfara');
        });
    
        await test.step('And I select the first Option', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Then I should see Independent contractor in the partner Info Page', async () => {
            await expect(await partnerInfoPage.inputIndependentContractor).toHaveText('Independent Contractor');
        });
    
        await test.step('And I should see partner type count to have length 1', async () => {
            const partnerTypeCount = page.locator('//html/body/div[1]/main/div/div/form/div[1]/div[3]/div[4]/div/div[1]/div[2]/div/div[1]');
            const lengthValue = await partnerTypeCount.getAttribute('length');
            expect(lengthValue).toBe('1');
        });
    
        const dropDownService = await partnerInfoPage.getServiceLocator();
        let servicePlaceholder = await dropDownService.getAttribute('placeholder');
    
        await test.step('I should see Select Service placeholder', async () => {
            await partnerInfoPage.serviceLink.click({ force: true });
            await dropDownService.waitFor({ state: 'visible' });
            expect(servicePlaceholder).toEqual('Select Service');
        });
    
        await test.step('When I click on service Dropdown', async () => {
            await dropDownService.click();
        });
    
        await test.step('Then I should see empty string as place holder value for service Dropdown', async () => {
            servicePlaceholder = await dropDownService.getAttribute('placeholder');
            await expect(servicePlaceholder).toEqual('');
            const areServicesAphabeticalOrder = await partnerInfoPage.verifyServiceAlphabeticalOrder();
            expect(areServicesAphabeticalOrder).toBeTruthy();
        });
    });
    
    test('Filtering services with a single character search', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Alfara"', async () => {
            await partnerInfoPage.searchText.fill('Alfara');
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Filter services by single character "R"', async () => {
            const dropDownService = await partnerInfoPage.getServiceLocator();
            await dropDownService.fill('R');
        });
    
        await test.step('Verify services are in alphabetical order', async () => {
            const areServicesAlphabeticalOrder = await partnerInfoPage.verifyServiceAlphabeticalOrder();
            expect(areServicesAlphabeticalOrder).toBeTruthy();
        });
    
        await test.step('Verify all services contain the character "R"', async () => {
            const areServicesItemsWithCharacter = await partnerInfoPage.verifyServiceCharacterContain("R");
            expect(areServicesItemsWithCharacter).toBeTruthy();
        });
    });
    
    test('Filtering services with multiple characters search', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Alfara"', async () => {
            await partnerInfoPage.searchText.fill('Alfara');
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Filter services by multiple characters "CA"', async () => {
            const dropDownService = await partnerInfoPage.getServiceLocator();
            await dropDownService.fill('CA');
        });
    
        await test.step('Verify services are in alphabetical order', async () => {
            const areServicesAlphabeticalOrder = await partnerInfoPage.verifyServiceAlphabeticalOrder();
            expect(areServicesAlphabeticalOrder).toBeTruthy();
        });
    
        await test.step('Verify all services contain the characters "CA"', async () => {
            const areServicesItemsWithCharacter = await partnerInfoPage.verifyServiceCharacterContain("CA");
            expect(areServicesItemsWithCharacter).toBeTruthy();
        });
    });
    
    test('Filtering services with empty result', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Alfara"', async () => {
            await partnerInfoPage.searchText.fill('Alfara');
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Filter services with character sequence "Rft"', async () => {
            const dropDownService = await partnerInfoPage.getServiceLocator();
            await dropDownService.fill('Rft');
        });
    
        await test.step('Verify "No Results Found" message appears', async () => {
            await expect(partnerInfoPage.successNoResults).toHaveText('No Results FoundTry a new search.');
        });
    
        await test.step('Click on the menu after no results are found', async () => {
            await partnerInfoPage.menu.click();
        });
    });
    
    test('Confirmation of Service Addition to the Profile', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
    
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });
    
        await test.step('Search for partner "Alfara"', async () => {
            await partnerInfoPage.searchText.fill('Alfara');
        });
    
        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify partner type count is 1', async () => {
            const partnerTypeCount = page.locator('//html/body/div[1]/main/div/div/form/div[1]/div[3]/div[4]/div/div[1]/div[2]/div/div[1]');
            const lengthValue = await partnerTypeCount.getAttribute('length');
            expect(lengthValue).toBe('1');
        });
    
        await test.step('Click on service link', async () => {
            await partnerInfoPage.serviceLink.click({ force: true });
        });
    
        await test.step('Verify no services are displayed initially', async () => {
            const serviceLabel = page.locator('#skills');
            await expect(serviceLabel.locator('span')).toHaveCount(0);
        });
    
        const dropDownService = await partnerInfoPage.getServiceLocator();
    
        await test.step('Wait for service dropdown to become visible', async () => {
            await dropDownService.waitFor({ state: 'visible' });
        });
    
        await test.step('Verify service dropdown placeholder', async () => {
            let servicePlaceholder = await dropDownService.getAttribute('placeholder');
            expect(servicePlaceholder).toEqual('Select Service');
        });
    
        await test.step('Click on service dropdown to open options', async () => {
            await dropDownService.click();
        });
    
        await test.step('Verify service dropdown placeholder is cleared', async () => {
            let servicePlaceholder = await dropDownService.getAttribute('placeholder');
            expect(servicePlaceholder).toEqual('');
        });
    
        await test.step('Verify services are in alphabetical order', async () => {
            const areServicesAphabeticalOrder = await partnerInfoPage.verifyServiceAlphabeticalOrder();
            expect(areServicesAphabeticalOrder).toBeTruthy();
        });
    
        await test.step('Filter and add services to the profile', async () => {
            const dropDownService = await partnerInfoPage.getServiceLocator();
            await dropDownService.fill('CART');
            await partnerInfoPage.selectFirstOption();
    
            await dropDownService.fill('Video');
            await partnerInfoPage.selectFirstOption();
    
            await dropDownService.fill('Arbitration');
            await partnerInfoPage.selectFirstOption();
        });
    
        await test.step('Verify services are added and in alphabetical order', async () => {
            const serviceContainer = page.locator('.MuiBox-root.css-1i0cgck');
            const servicesAdded = serviceContainer.locator('.MuiBox-root.css-auo5id p');
            const servicesAddedText = await servicesAdded.allTextContents();
            const areServicesAddedAphabeticalOrder = partnerInfoPage.verifyAlphabeticalOrder(servicesAddedText);
            expect(areServicesAddedAphabeticalOrder).toBeTruthy();
        });
    
        await test.step('Verify service dropdown has expanded class', async () => {
            const dropDownServiceOptions = await partnerInfoPage.isServiceFieldFocused();
            await expect(dropDownServiceOptions).toHaveClass(/Mui-expanded/);
        });
    
    });
}

test.describe('Interpreter and Language inside partner profile'), () => {
    
    test('Interpreter Partner page displays the basic sections', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);

        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });

        await test.step('Search for partner "Granados"', async () => {
            await partnerInfoPage.searchText.fill('Granados');
        });

        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });

        await test.step('Click on the "Languages" link', async () => {
            await partnerInfoPage.languageLink.click();
        });

        await test.step('Validate the page scrolls the section into view', async () => {
            let dropDownLanguages = await partnerInfoPage.getLanguageLocator();
            await expect(dropDownLanguages).toBeVisible();
        });
    });

    test('Language Field is a required one', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);
        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });

        await test.step('Search for partner "Barbe"', async () => {
            await partnerInfoPage.searchText.fill('Barbe');
        });

        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });

        await test.step('Verify last name contains "Barbe"', async () => {
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Barbe');
        });

        await test.step('Click Partner Type and verify placeholder', async () => {
            const dropDownPartnerType = await partnerInfoPage.getParterTypeLocator();
            let partnerTypePlaceholder = await dropDownPartnerType.getAttribute('placeholder');

            await test.step('Verify placeholder shows "Select Partner Type"', async () => {
                await partnerInfoPage.partnerTypeLink.click({ force: true });
                await dropDownPartnerType.waitFor({ state: 'visible' });
                expect(partnerTypePlaceholder).toEqual('Select Partner Type');
            });

            await test.step('Click on Partner Type dropdown', async () => {
                await dropDownPartnerType.click();
            });

            await test.step('Verify Partner Type placeholder is cleared', async () => {
                let updatedPlaceholder = await dropDownPartnerType.getAttribute('placeholder');
                expect(updatedPlaceholder).toEqual('');
            });

            await test.step('Filter and select "Interpreter" as Partner Type', async () => {
                await dropDownPartnerType.fill('Interpreter');
                await partnerInfoPage.selectFirstOption();
                await dropDownPartnerType.click();
            });

            await test.step('Verify Languages section appears', async () => {
                await page.getByText('Languages *').waitFor();
                await expect(page.getByText('Languages *')).toHaveText('Languages *');
            });

            await test.step('Click Partner Type and verify placeholder', async () => {
                const dropDownlanguage = await partnerInfoPage.getLanguageLocator();
                let languagePlaceholder = await dropDownlanguage.getAttribute('placeholder');

                await test.step('Verify placeholder shows "Select Partner Type"', async () => {
                    await partnerInfoPage.languageLink.click({ force: true });
                    await dropDownlanguage.waitFor({ state: 'visible' });
                    expect(languagePlaceholder).toEqual('Select Language');
                });

                await test.step('Click on language dropdown', async () => {
                    await dropDownlanguage.click();
                    await page.keyboard.press('Tab');
                    const textLocator = page.locator('div').filter({ hasText: /^At least one language is required$/ });
                    await expect(textLocator).toBeVisible();
                });
            });
        });
    });

    test('Add a Language to a Partner Profile', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);

        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });

        await test.step('Search for partner "Barbe"', async () => {
            await partnerInfoPage.searchText.fill('Barbe');
        });

        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });

        await test.step('Verify last name contains "Barbe"', async () => {
            expect(await partnerInfoPage.inputLastName.inputValue()).toContain('Barbe');
        });

        await test.step('Click Partner Type and verify placeholder', async () => {
            const dropDownPartnerType = await partnerInfoPage.getParterTypeLocator();
            let partnerTypePlaceholder = await dropDownPartnerType.getAttribute('placeholder');

            await test.step('Verify placeholder shows "Select Partner Type"', async () => {
                await partnerInfoPage.partnerTypeLink.click({ force: true });
                await dropDownPartnerType.waitFor({ state: 'visible' });
                expect(partnerTypePlaceholder).toEqual('Select Partner Type');
            });

            await test.step('Click on Partner Type dropdown', async () => {
                await dropDownPartnerType.click();
            });

            await test.step('Verify Partner Type placeholder is cleared', async () => {
                let updatedPlaceholder = await dropDownPartnerType.getAttribute('placeholder');
                expect(updatedPlaceholder).toEqual('');
            });

            await test.step('Filter and select "Interpreter" as Partner Type', async () => {
                await dropDownPartnerType.fill('Interpreter');
                await partnerInfoPage.selectFirstOption();
                await dropDownPartnerType.click();
            });

            await test.step('Verify Languages section appears', async () => {
                await page.getByText('Languages *').waitFor();
                await expect(page.getByText('Languages *')).toHaveText('Languages *');
            });

            await test.step('Click Partner Type and verify placeholder', async () => {
                const dropDownlanguage = await partnerInfoPage.getLanguageLocator();
                let languagePlaceholder = await dropDownlanguage.getAttribute('placeholder');

                await test.step('Verify placeholder shows "Select Partner Type"', async () => {
                    await partnerInfoPage.languageLink.click({ force: true });
                    await dropDownlanguage.waitFor({ state: 'visible' });
                    expect(languagePlaceholder).toEqual('Select Language');
                });

                await test.step('Click on language dropdown', async () => {
                    await dropDownlanguage.click();
                });

                await test.step('Verify language placeholder is cleared', async () => {
                    let updatedPlaceholder = await dropDownlanguage.getAttribute('placeholder');
                    expect(updatedPlaceholder).toEqual('');
                });

                await test.step('Filter and select "Albanian" as language', async () => {
                    await dropDownlanguage.fill('Albanian');
                    await partnerInfoPage.selectFirstOption();
                    await dropDownlanguage.click();
                });

                await test.step('Validate language list is in alphabetical order', async () => {
                    let dropDownLanguages = await partnerInfoPage.getLanguageLocator();
                    await dropDownLanguages.click();

                    let languages = await partnerInfoPage.getLanguages();
                    let filteredLanguages = languages.slice(1);

                    const areLanguagesAlphabeticalOrder = partnerInfoPage.verifyAlphabeticalOrder(filteredLanguages);
                    expect(areLanguagesAlphabeticalOrder).toBeTruthy();
                });
            });
        });
    });

    test('Removing a Language', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);

        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });

        await test.step('Search for partner "Barre"', async () => {
            await partnerInfoPage.searchText.fill('Barre');
        });

        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });

        await test.step('Verify last name contains "Melinda"', async () => {
            expect(await partnerInfoPage.inputFirstName.inputValue()).toContain('Melinda');
        });

        const languagesBox = page.locator('//html/body/div[1]/main/div/div/form/div[1]/div[3]/div[4]/div/div[2]/div[2]/div');
        let languagesAdded;
        let availableLanguages;
        await test.step('Get added Languages in the Language container', async () => {
            languagesAdded = await languagesBox.locator('//div').evaluateAll(nodes =>
                nodes.map(n => n.innerText.trim())
            );
        });
        await test.step('Get Available Languages in List', async () => {
            let dropDownLanguages = await partnerInfoPage.getLanguageLocator();
            await dropDownLanguages.click();
            availableLanguages = await partnerInfoPage.getLanguages();
        });
        await test.step('VaLidate added languages are not available in the list', async () => {
            let existInLanguages = languagesAdded.some(lang => availableLanguages.includes(lang));
            expect(existInLanguages).toBeFalsy();
        });

        await test.step('Remove the first selected language', async () => {
            const languagesBox = page.locator('//html/body/div[1]/main/div/div/form/div[1]/div[3]/div[4]/div/div[2]/div[2]/div');
            const buttonsLocators = await languagesBox.locator('//div/button');
            await buttonsLocators.first().click();
        });

        await test.step('Verify the language removed is back on the available language list', async () => {
            let dropDownLanguages = await partnerInfoPage.getLanguageLocator();
            await dropDownLanguages.click();

            let languages = await partnerInfoPage.getLanguages();
            expect(languages).toContain(languagesAdded[0]);
        });
    });

    test('Clear All Languages', async ({ page }) => {
        const headerPage = new HeaderPage(page);
        const partnerInfoPage = new PartnerInfoPage(page);

        await test.step('Navigate to Partner Information Tab', async () => {
            await headerPage.partnerInformationTab.click();
        });

        await test.step('Search for partner "Barre"', async () => {
            await partnerInfoPage.searchText.fill('Barre');
        });

        await test.step('Select the first option in search results', async () => {
            await partnerInfoPage.selectFirstOption();
        });

        await test.step('Verify last name contains "Melinda"', async () => {
            expect(await partnerInfoPage.inputFirstName.inputValue()).toContain('Melinda');
        });

        const languagesBox = page.locator('//html/body/div[1]/main/div/div/form/div[1]/div[3]/div[4]/div/div[2]/div[2]/div');
        let languagesAdded;
        let availableLanguages;
        await test.step('Get added Languages in the Language container', async () => {
            languagesAdded = await languagesBox.locator('//div').evaluateAll(nodes =>
                nodes.map(n => n.innerText.trim())
            );
        });
        await test.step('Get Available Languages in List', async () => {
            let dropDownLanguages = await partnerInfoPage.getLanguageLocator();
            await dropDownLanguages.click();
            availableLanguages = await partnerInfoPage.getLanguages();
        });
        await test.step('VaLidate added languages are not available in the list', async () => {
            let existInLanguages = languagesAdded.some(lang => availableLanguages.includes(lang));
            expect(existInLanguages).toBeFalsy();
        });

        await test.step('Clear all selected languages', async () => {
            await partnerInfoPage.buttonClearAll.click();
            await partnerInfoPage.buttonClearAllConfirmation.click();
        });

        await test.step('Verify languages are cleared', async () => {
            const languagesBoxAfterClear = page.locator('//html/body/div[1]/main/div/div/form/div[1]/div[3]/div[4]/div/div[2]/div[2]/div');
            const numberOfLanguagesAdded = await languagesBoxAfterClear.getAttribute('length');
            expect(numberOfLanguagesAdded).toBeNull();
        });

        await test.step('Verify all languages are back in the list', async () => {
            let dropDownLanguages = await partnerInfoPage.getLanguageLocator();
            await dropDownLanguages.click();
            availableLanguages = await partnerInfoPage.getLanguages();
            for (const lang of languagesAdded) {
                expect(availableLanguages).toContain(lang);
            }
        });
    });
}
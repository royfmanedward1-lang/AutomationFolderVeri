import { expect} from "@playwright/test";

export class Client {
    constructor(page){
        this.page = page
 
        this.fields = (text) => page.locator(`#${text}`).getByRole('combobox');
        this.checkIcon = (text) => page.locator(`#${text}`).getByTestId('checkIcon');
        
    }

    async searchField(locatorField, fieldValue){
        await this.fields(locatorField).click()
        await this.fields(locatorField).fill(fieldValue)
        await this.page.getByText(fieldValue).nth(0).click()
        await expect(this.checkIcon(locatorField)).toBeVisible
    }
}
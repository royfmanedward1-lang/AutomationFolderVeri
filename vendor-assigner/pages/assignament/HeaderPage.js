
export class HeaderPage {

    constructor(page) {
        this.page = page
        this.userIcon = page.locator('header').getByRole('button')
        this.logOutButton = page.getByRole('menuitem', { name: 'Logout' })
        this.assignmentTab = page.getByRole('link', { name: 'ASSIGNMENT' })
        this.partnerInformationTab = page.getByRole('link', { name: 'PARTNER INFORMATION' })
    }

    async logOut() {
        await this.userIcon.click()
        await this.logOutButton.click()
        await this.page.getByRole('button', { name: 'LOGIN' }).waitFor({ state: 'visible' })
    }
}
import { expect } from "@playwright/test"

module.exports = {
    getRandomDifferent: function (arr, last = undefined) {
        let num
        do {
            num = Math.floor(Math.random() * arr.length)
        } while (arr[num] === last)
        return arr[num]
    },

    waitLoadToFinish: async function (page) {
        await page.waitForLoadState('domcontentloaded')
        await expect(page.getByRole('grid').getByRole('progressbar')).not.toBeAttached() 

    },
    waitGridToLoad: async function (page) {
        await page.locator('button.MuiLoadingButton-loading:has-text("APPLY")').waitFor({ state: 'visible' })
        const applyButton = page.locator('button.MuiLoadingButton-loading:has-text("APPLY")');
        await applyButton.locator('span.MuiLoadingButton-loadingIndicator').waitFor({ state: 'detached' });
    }
}
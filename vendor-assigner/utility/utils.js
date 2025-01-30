import { expect } from "@playwright/test";

module.exports = {
    getRandomDifferent: function (arr, last = undefined) {
        let num;
        do {
            num = Math.floor(Math.random() * arr.length);
        } while (arr[num] === last);
        return arr[num];
    },

    waitLoadToFinish: async function (page) {
        await page.waitForLoadState('domcontentloaded');
        await expect(page.getByRole('grid').getByRole('progressbar')).not.toBeAttached();
    },

    waitGridToLoad: async function (page) {
        await page.locator('button.MuiLoadingButton-loading:has-text("APPLY")').first().waitFor({ state: 'visible' });
        const applyButton = page.locator('button.MuiLoadingButton-loading:has-text("APPLY")');
        await applyButton.locator('span.MuiLoadingButton-loadingIndicator').first().waitFor({ state: 'detached' });
    },

    createRandomString: function (length) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    invalidCharacters: ["!","@","#","$","%","^","&","*","(",")","=","1","2","3","4","5","6","7","8","9","0","_","+","[","]","'",".","/","<",">",","]
};

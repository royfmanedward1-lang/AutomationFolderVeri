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

    invalidCharacters: ["!","@","#","$","%","^","&","*","(",")","=","1","2","3","4","5","6","7","8","9","0","_","+","[","]","'",".","/","<",">",","],    

    partnerTypeList: [
        { name: 'Interpreter', id: [2], includesVpz: true },
        { name: 'Videographer', id: [3], includesVpz: true },
        { name: 'Proofreader', id: [4], includesVpz: true },
        { name: 'Other', id: [5], includesVpz: true },
        { name: 'Scopist', id: [6], includesVpz: true },
        { name: 'Transcriber', id: [8], includesVpz: false },
        { name: 'Digital Reporter', id: [1, 9], includesVpz: true },
        { name: 'Steno Reporter', id: [1, 9], includesVpz: true },
        { name: 'Process Server', id: [10], includesVpz: true },
        { name: 'Corrector', id: [11], includesVpz: true },
        { name: 'Concierge-Tech', id: [12], includesVpz: true },
        { name: 'Mediator', id: [14], includesVpz: false },
        { name: 'Trial Tech', id: [15], includesVpz: false }
    ],

    getPartnerTypeId: function (partnerTypeName) {
        const item = this.partnerTypeList.find(obj => obj.name === partnerTypeName);
        return item ? item.id : null;
    },

    containsProperty: function (list, property, value) {
        return list.some(obj => {
            if (property === 'vendor.id' || property === 'id') {
                return obj.vendor.id === value;
            }
            return obj.property === value;
        });
    }
};

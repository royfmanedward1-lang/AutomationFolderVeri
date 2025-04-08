import { LoginPage } from '../pages/LoginPage.js';
import { GridColumnFilter } from '../pages/assignement/GridColumnFilter.js';
const { test } = require('@playwright/test');
import { expect } from "@playwright/test";

const partnerTypeList = [
  "Corrector", "Digital Reporter", "Steno Reporter", "Interpreter",
  "Mediator", "Process Server", "Proofreader", "Scopist",
  "Transcriber", "Trial Tech", "Videographer", "Other", "Concierge-Tech"
];

test.beforeEach('Logging in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login();
});

test('Selecting filter by partner type', async ({ page }) => {
  const partnerFilter = new GridColumnFilter(page);

  await test.step('When I hover over partner assignment column', async () => {
    await page.locator('div:nth-child(12) > .MuiDataGrid-columnHeaderDraggableContainer').hover();
  });

  await test.step('And I click on Kebab', async () => {
    await partnerFilter.kebabMenu.click();
  });

  await test.step('Then the Filter dropdown appears with the following options: Filter by partner Type; Filter by Partner Status; Filter by Partner Name', async () => {
    await expect(partnerFilter.kebabMenuPartnerTypeOption).toBeVisible();
    await expect(partnerFilter.kebabMenuPartnerStatusOption).toBeVisible();
    await expect(partnerFilter.kebabMenuPartnerNameOption).toBeVisible();
  });

  await test.step('When I select filter by partner type', async () => {
    await partnerFilter.kebabMenuPartnerTypeOption.click();
  });

  await test.step('Then the filter control box appears', async () => {
    await partnerFilter.filterBox.waitFor({ state: 'visible' });
  });

  await test.step('And the column dropdown is preselected as "Partner Assignment"', async () => {
    await expect(partnerFilter.filterBoxColumnPartnerAssignamentDropDown).toBeVisible();
  });

  await test.step('And the "Partner Info" dropdown is preselected as "Partner Type"', async () => {
    await expect(partnerFilter.filterBoxOperatorPartnerTypeDropDown).toBeVisible();
  });

  await test.step('And the value input is active and shows placeholder "Select Partner Type"', async () => {
    await expect(partnerFilter.filterBoxValuesDropDown).toBeEnabled();
    await expect(partnerFilter.filterBoxValuesDropDownPlaceHolder).toBeVisible();
  });
});

for (const partnerType of partnerTypeList) {
  test(`Filtering by partner type (${partnerType})`, async ({ page }) => {
    const partnerFilter = new GridColumnFilter(page);

    await test.step('When I hover over partner assignment column', async () => {
      await page.locator('div:nth-child(12) > .MuiDataGrid-columnHeaderDraggableContainer').hover();
    });

    await test.step('And I click on Kebab', async () => {
      await partnerFilter.kebabMenu.click();
    });

    await test.step('Then the Filter dropdown appears with the following options: Filter by partner Type; Filter by Partner Status; Filter by Partner Name', async () => {
      await expect(partnerFilter.kebabMenuPartnerTypeOption).toBeVisible();
      await expect(partnerFilter.kebabMenuPartnerStatusOption).toBeVisible();
      await expect(partnerFilter.kebabMenuPartnerNameOption).toBeVisible();
    });

    await test.step('When I select filter by partner type', async () => {
      await partnerFilter.kebabMenuPartnerTypeOption.click();
    });

    await test.step('Then the filter control box appears', async () => {
      await partnerFilter.filterBox.waitFor({ state: 'visible' });
    });

    await test.step('And the column dropdown is preselected as "Partner Assignment"', async () => {
      await expect(partnerFilter.filterBoxColumnPartnerAssignamentDropDown).toBeVisible();
    });

    await test.step('And the "Partner Info" dropdown is preselected as "Partner Type"', async () => {
      await expect(partnerFilter.filterBoxOperatorPartnerTypeDropDown).toBeVisible();
    });

    await test.step('And the value input is active and shows placeholder "Select Partner Type"', async () => {
      await expect(partnerFilter.filterBoxValuesDropDown).toBeEnabled();
      await expect(partnerFilter.filterBoxValuesDropDownPlaceHolder).toBeVisible();
    });

    await test.step('When I click on Value', async () => {
      await partnerFilter.filterBoxValuesDropDown.click();
    });

    await test.step('Verify that the partner types dropdown is displayed.', async () => {
      await expect(partnerFilter.filterBoxValuesDropDownList).toBeVisible();
    });

    await test.step('Verify that the partner types dropdown shows options for all partner types.', async () => {
      const partnerTypeOptions = await partnerFilter.filterBoxValuesDropDownOptions.allTextContents();
      expect(partnerTypeOptions.sort()).toEqual(partnerTypeList.sort());
    });

    await test.step(`Select partner type (${partnerType})`, async () => {
      await page.getByRole('option', { name: partnerType }).click();
    });

    await test.step(`Verify that each item in the column contains the partnerType (${partnerType}) in all rows`, async () => {
      await page.locator('//*[@data-field="vendorAssignment"]').first().waitFor({ state: 'visible' });

      const columnItemsVendorAssignment = await page.locator('//*[@data-field="vendorAssignment"]').allTextContents();

      const columnItemsVendorAssignmentWithOutHeader = columnItemsVendorAssignment.slice(1);

      if (columnItemsVendorAssignmentWithOutHeader.length > 0) {
        for (const item of columnItemsVendorAssignmentWithOutHeader) {
          expect(item).toContain(partnerType);
        }
      }
    });

  });
}
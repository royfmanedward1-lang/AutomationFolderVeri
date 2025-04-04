const testData = require("../utils/testData");

class DateAndTimePage {
  constructor(page) {
    this.page = page;
    this.datePicker = page.locator(
      'button[role="gridcell"][aria-selected="true"]'
    );
    this.timeDropdown = page.getByRole("combobox").first();
    this.timeZoneDropdown = page.getByRole("combobox").nth(1);
    this.nextButton = page.getByRole("button", { name: "NEXT", exact: true });
    this.dateInput = page.locator('input[aria-label="Proceeding Date"]');
    this.calendarHeader = page.locator(".MuiPickersCalendarHeader-label");
    this.nextMonthButton = page.getByLabel("Next month");
    this.dayButton = (day) =>
      page.locator(`button[role="gridcell"]:not([disabled])`, { hasText: day });
    this.dateField = page.locator("img").first();
    this.dateGridCell = (day) =>
      page.locator(`button[role="gridcell"]:not([disabled])`, { hasText: day });
    this.timeField = page.locator("img").nth(1);
    this.clockFace = page.locator(".MuiClock-squareMask");
    this.amPmButton = (amPm) => page.getByRole("button", { name: amPm });
    this.closeTimeButton = page.getByRole("button", { name: "x", exact: true });

    // New Locators
    this.startTimeField = page.getByLabel('Choose time').first();
    this.hour = page.getByLabel('12 hours');
    this.okButtton = page.getByRole('button', { name: 'OK' });
  }

  async selectDate() {
    //Wait for the suggested date to be available
    await this.datePicker.waitFor({ state: "visible" });
    // Click the suggested date
    await this.datePicker.waitFor({ state: "visible" });
    await this.datePicker.click();
  }

  async selectTime(time) {
    await this.timeDropdown.waitFor({ state: "visible" });
    await this.timeDropdown.selectOption(time);
  }

  async selectTime2() {
    await this.startTimeField.waitFor({ state: "visible" });
    await this.startTimeField.click();
    await this.hour.click();
    await this.okButtton.click();
  }

  async selectTimeZone2(time) {
    await this.timeDropdown.waitFor({ state: "visible" });
    await this.timeDropdown.selectOption(time);
  }

  async selectTimeZone(timeZoneValue) {
    await this.timeZoneDropdown.waitFor({ state: "visible" });
    await this.timeZoneDropdown.selectOption(timeZoneValue);
  }

  async clickNext() {
    await this.nextButton.click();
  }
  async clickDateField() {
    await this.dateField.waitFor({ state: "visible" });
    await this.dateField.click();
  }

  async selectNewDate(day) {
    await this.nextMonthButton.waitFor({ state: "visible" });
    await this.nextMonthButton.click();
  const targetDate = this.page
  .locator('button[role="gridcell"]:not([disabled])')
  .filter({ hasText: day.toString() })
  .first(); 
  await targetDate.waitFor({ state: "visible" });
  await targetDate.click();
  }

  async clickTimeField() {
    await this.timeField.click();
  }

  async selectNewTime(hour, amPm) {
    await this.timeField.waitFor({ state: "visible" });
    await this.timeField.click();
    await this.clockFace.waitFor({ state: "visible" });
    await this.clockFace.click();
    await this.amPmButton(amPm).waitFor({ state: "visible" });
    await this.amPmButton(amPm).click();
  }
 
}

module.exports = { DateAndTimePage };

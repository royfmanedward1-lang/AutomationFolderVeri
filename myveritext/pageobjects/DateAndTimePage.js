const testData = require('../utils/testData');

class DateAndTimePage {
  constructor(page) {
    this.page = page;
    this.datePicker = page.locator('button[role="gridcell"][aria-selected="true"]');
    this.timeDropdown = page.getByRole('combobox').first();
    this.timeZoneDropdown = page.getByRole('combobox').nth(1);
    this.nextButton = page.getByRole('button', { name: 'NEXT', exact: true });
    this.dateInput = page.locator('input[aria-label="Proceeding Date"]');
    this.calendarHeader = page.locator('.MuiPickersCalendarHeader-label');
    this.nextMonthButton = page.locator('button[aria-label="Next month"]');
    this.dayButton = (day) => page.locator(`button[role="gridcell"]:not([disabled])`, { hasText: day });
  }



 
  async selectDate() {

   //Wait for the suggested date to be available
    await this.datePicker.waitFor({ state: 'visible' });
  
    // Click the suggested date
    await this.datePicker.click();
   
  }

  async selectTime(time) {
    await this.timeDropdown.selectOption(time);
  }

  async selectTimeZone(timeZoneValue) {
    await this.timeZoneDropdown.selectOption(timeZoneValue);
  }

  async clickNext() {
    await this.nextButton.click();
  }
}

module.exports = { DateAndTimePage };

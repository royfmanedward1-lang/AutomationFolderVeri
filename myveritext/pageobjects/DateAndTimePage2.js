class DateAndTimePage2 {
  constructor(page) {
    this.page = page;
    this.nextMonthButton = page.getByLabel("Next month");
    this.previousMonthButton = page.getByLabel("Previous month");
    this.yearHeader = page.locator(".MuiPickersCalendarHeader-label");
    this.timeDropdown = page.getByRole("combobox").first();
    this.timeZoneDropdown = page.getByRole("combobox").nth(1);
    this.nextButton = page.getByRole("button", { name: "NEXT", exact: true });
    this.dateField = page.locator("img").first(); // Locator for Date Field
    this.timeField = page.locator("img").nth(1); // Locator for Time Field
    this.clockFace = page.locator(".MuiClock-squareMask");
    this.amPmButton = (amPm) => page.getByRole("button", { name: amPm });
    this.dateGridCell = (day) =>
      this.page.locator(`button[role="gridcell"]:not([disabled])`, {
        hasText: day.toString(),
      });
  }

  async navigateToMonthAndYear(targetMonth, targetYear) {
    while (true) {
      const headerText = await this.yearHeader.textContent();
      const [displayedMonth, displayedYear] = headerText.split(" ");
      // Break loop if correct month and year are displayed
      if (displayedMonth === targetMonth && displayedYear === targetYear) {
        break; // Stop when the correct month and year are displayed
      }
      if (
        parseInt(displayedYear) < parseInt(targetYear) ||
        displayedMonth !== targetMonth
      ) {
        await this.nextMonthButton.click();
      } else {
        await this.previousMonthButton.click();
      }
      await this.yearHeader.waitFor({ state: "visible" });
    }
  }

  async selectDate(day, month, year) {
    await this.navigateToMonthAndYear(month, year);

    // Locate only enabled days
    const enabledDays = this.page
      .locator(`button[role="gridcell"]:not([disabled])`, { hasText: day })
      .filter({ hasNot: this.page.locator("[aria-disabled='true']") });

    // Ensure at least one enabled day exists
    if ((await enabledDays.count()) === 0) {
      return false;
    }

    // Click the first enabled day
    const dayLocator = enabledDays.first();
    await dayLocator.waitFor({ state: "visible" });
    await dayLocator.click();
    return true;
  }

  async selectTime(time) {
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

  async clickTimeField() {
    await this.timeField.waitFor({ state: "visible" });
    await this.timeField.click();
  }

  async selectNewDate(day, month, year) {
    await this.clickDateField();
    await this.navigateToMonthAndYear(month, year);

    // Scope the locator to only visible gridcells for the current calendar view
    const visibleGridCells = this.page
      .locator(`button[role="gridcell"]:not([disabled])`)
      .filter({ hasText: day.toString() });

    // Ensure at least one enabled day exists
    if ((await visibleGridCells.count()) === 0) {
      return false;
    }

    const targetDate = visibleGridCells.first();
    await targetDate.waitFor({ state: "visible" });
    await targetDate.click();
    return true; // Indicate success
  }

  async selectNewTime(hour, amPm) {
    await this.clickTimeField(); // Bring up the clock face
    await this.clockFace.waitFor({ state: "visible" });
    await this.clockFace.click(); // Open clock face
    await this.amPmButton(amPm).waitFor({ state: "visible" });
    await this.amPmButton(amPm).click();
  }
}

module.exports = { DateAndTimePage2 };

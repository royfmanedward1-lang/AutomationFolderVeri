class CalendarPage {
  constructor(page) {
    this.page = page;

    this.policyDialog = page.locator(".MuiDialog-container");
    this.acknowledgeButton = page.locator("button:has-text('Acknowledged')");
    this.monthViewButton = page.locator("button:has-text('Month')");
    this.weekViewButton = page.locator("button:has-text('Week')");
    this.dayViewButton = page.locator('button[title="Day view"]');
    this.currentMonth = page.locator(".fc-toolbar-title");
    this.currentWeek = page.locator('th[role="columnheader"][data-date]');
    this.currentDay = page.locator('th[role="columnheader"].fc-day-today');
    this.currentHeaderDate = page.locator(".fc-toolbar-title");
    this.todayButton = page.locator("button:has-text('Today')");
    this.previousButton = page.locator(".fc-prev-button.fc-button.fc-button-primary");
    this.nextButton = page.locator(".fc-next-button.fc-button.fc-button-primary");
    this.scheduleProceedingButton = page.locator("button:has-text('Schedule Proceeding')");

  }

  // Handle retention policy modal
  async handleRetentionPolicyModal() {
    if (await this.policyDialog.isVisible()) {
      await this.policyDialog.evaluate((dialog) => {
        dialog.scrollTo(0, dialog.scrollHeight);
      });

      await this.acknowledgeButton.waitFor({ state: "visible" });
      await this.acknowledgeButton.click();
    }

    // Wait for the modal to disappear
    await this.policyDialog.waitFor({ state: "detached" });
  }

  async clickMonthView() {
    await this.monthViewButton.waitFor({ state: "visible" });
    await this.monthViewButton.click();
  }

  async clickWeekView() {
    await this.weekViewButton.waitFor({ state: "visible" });
    await this.weekViewButton.click();
  }

  async clickDayView() {
    await this.dayViewButton.waitFor({ state: "visible" });
    await this.dayViewButton.click();
  }

  async getCurrentMonth() {
    await this.currentMonth.waitFor({ state: "visible" });
    return await this.currentMonth.textContent();
  }

  async getCurrentWeek() {
    await this.currentWeek.first().waitFor({ state: "visible" });

    // Get all the days of the current week
    const days = await this.currentWeek.allTextContents();

    return days;
  }

  async getCurrentHeaderDate() {
    await this.currentHeaderDate.waitFor({ state: "visible" });
    return await this.currentHeaderDate.textContent();
  }

  async getCurrentDayInCalendar() {
    await this.currentDay.waitFor({ state: "visible" });
    return await this.currentDay.getAttribute("data-date");
  }

  async clickTodayButton() {
    await this.todayButton.waitFor({ state: "visible" });
    await this.todayButton.click();
  }

  async isTodayButtonDisabled() {
    return await this.todayButton.isDisabled();
  }

  async navigateToPrevious() {
    await this.previousButton.waitFor({ state: "visible" });
    await this.previousButton.click();
  }

  async navigateToNext() {
    await this.nextButton.click();
  }

  async clickScheduleProceeding() {
    await this.scheduleProceedingButton.waitFor({ state: "visible" });
    await this.scheduleProceedingButton.click();
  }
}

module.exports = { CalendarPage };

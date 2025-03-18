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
    this.myVeritextButton =page.getByRole('button', { name: 'MyVeritext' });

    // New locators for calendar events
    this.calendarEventsContainer = page.locator('.fc-daygrid-day-events');
    this.calendarEventFrame = page.locator('.fc-event-main-frame');
    this.calendarEventTitle = page.locator('.fc-event-title');
    this.eventHarness = page.locator('.fc-daygrid-event-harness');
    this.jobId = page.getByRole('gridcell', { name: 'March 28,' }).locator('a').nth(1);
  }

  // Existing methods
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
    const days = await this.currentWeek.allTextContents();
    return days;
  }

  async clickFutureJob() {
    await this.jobId.click();
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

  async clickMyVeritext() {
    await this.myVeritextButton.click();
  }

  async clickScheduleProceeding() {
    await this.scheduleProceedingButton.waitFor({ state: "visible" });
    await this.scheduleProceedingButton.click();
  }

  // New methods for calendar event handling
  async waitForCalendarEvents() {
    // Wait for calendar container to be visible
    await this.calendarEventsContainer.waitFor({ state: 'visible' });
    
    // Wait for event content to be loaded
    await this.page.waitForFunction(() => {
      const events = document.querySelectorAll('.fc-event-main-frame');
      const hasEvents = events.length > 0;
      const hasContent = events[0]?.querySelector('.fc-event-title')?.textContent?.trim().length > 0;
      return hasEvents && hasContent;
    }, { timeout: 30000 });
  }

  async clickEventInDay(dayColumn = 3) { // default to 3rd column (Tuesday)
    const eventLocator = this.page.locator(
      `td:nth-child(${dayColumn}) > .fc-daygrid-day-frame > .fc-daygrid-day-events > div > .fc-event`
    ).first();
    await eventLocator.waitFor({ state: 'visible' });
    await eventLocator.click();
  }

  async getAllEvents() {
    await this.waitForCalendarEvents();
    return await this.calendarEventFrame.all();
  }

  async clickEventByTitle(title) {
    await this.waitForCalendarEvents();
    const eventTitle = this.calendarEventTitle.filter({ hasText: title }).first();
    await eventTitle.waitFor({ state: 'visible' });
    await eventTitle.click();
  }

  async clickFirstEvent() {
    await this.waitForCalendarEvents();
    const events = await this.getAllEvents();
    if (events.length > 0) {
      await events[0].click();
      return true;
    }
    throw new Error('No calendar events found');
  }

  async getEventCount() {
    await this.waitForCalendarEvents();
    const events = await this.getAllEvents();
    return events.length;
  }
}

module.exports = { CalendarPage };
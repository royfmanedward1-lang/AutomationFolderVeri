class PageManager {
  constructor(page) {
    this.page = page;
    this.loginPage = null; // Placeholder for LoginPage
    this.calendarPage = null; // Placeholder for CalendarPage
  }

  getLoginPage() {
    if (!this.loginPage) {
      const { LoginPage } = require("../pageobjects/LoginPage");
      this.loginPage = new LoginPage(this.page);
    }
    return this.loginPage;
  }

  getCalendarPage() {
    if (!this.calendarPage) {
      const { CalendarPage } = require("../pageobjects/CalendarPage");
      this.calendarPage = new CalendarPage(this.page);
    }
    return this.calendarPage;
  }
}

module.exports = { PageManager };

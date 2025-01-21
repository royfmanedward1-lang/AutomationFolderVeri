class PageManager {
  constructor(page) {
    this.page = page;
    this.loginPage = null; // Placeholder for LoginPage
    this.calendarPage = null; // Placeholder for CalendarPage
    this.proceedingTypePage = null; // Placeholder for ProceedingTypePage
    this.caseNamePage = null; // Placeholder for CaseNamePage
    this.dateAndTimePage = null;
    this.locationPage = null;
    this.proceedingServicesPage = null;
    this.participantsPage = null;
    this.jobCardPage = null;
    this.addRemoteParticipants = null;
    this.dateAndTimePage2 = null;
    this.jobDetailsPage = null;
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

  getProceedingTypePage() {
    if (!this.proceedingTypePage) {
      const { ProceedingTypePage } = require("../pageobjects/ProceedingTypePage");
      this.proceedingTypePage = new ProceedingTypePage(this.page);
    }
    return this.proceedingTypePage;
  }

  getCaseNamePage() {
    if (!this.caseNamePage) {
      const { CaseNamePage } = require("../pageobjects/CaseNamePage");
      this.caseNamePage = new CaseNamePage(this.page);
    }
    return this.caseNamePage;
  }

  getDateAndTimePage() {
    if (!this.dateAndTimePage) {
      const { DateAndTimePage } = require("../pageobjects/DateAndTimePage");
      this.dateAndTimePage = new DateAndTimePage(this.page);
    }
    return this.dateAndTimePage;
  }

  getLocationPage() {
    if (!this.locationPage) {
      const { LocationPage } = require("../pageobjects/LocationPage");
      this.locationPage = new LocationPage(this.page);
    }
    return this.locationPage;
  }


  getProceedingServicesPage() {
    if (!this.proceedingServicesPage) {
      const { ProceedingServicesPage } = require("../pageobjects/ProceedingServicesPage");
      this.proceedingServicesPage = new ProceedingServicesPage(this.page);
    }
    return this.proceedingServicesPage;
  }

  getParticipantsPage() {
    if (!this.participantsPage) {
      const { ParticipantsPage } = require("../pageobjects/ParticipantsPage");
      this.participantsPage = new ParticipantsPage(this.page);
    }
    return this.participantsPage;
  }

  getJobCardPage() {
    if (!this.jobCardPage) {
      const { JobCardPage } = require("../pageobjects/JobCardPage");
      this.jobCardPage = new JobCardPage(this.page);
    }
    return this.jobCardPage;
  }

  getAddRemoteParticipantsPage() { 
    if (!this.addRemoteParticipantsPage) {
      const { AddRemoteParticipantsPage } = require("../pageobjects/AddRemoteParticipantsPage"); 
      this.addRemoteParticipantsPage = new AddRemoteParticipantsPage(this.page);
    }
    return this.addRemoteParticipantsPage;
  }
  getDateAndTimePage2() {
    if (!this.dateAndTimePage2) {
      const { DateAndTimePage2 } = require("../pageobjects/DateAndTimePage2");
      this.dateAndTimePage2 = new DateAndTimePage2(this.page);
    }
    return this.dateAndTimePage2;
  }

  getJobDetailsPage() {
    if (!this.jobDetailsPage) {
      const { JobDetailsPage } = require("../pageobjects/JobDetailsPage");
      this.jobDetailsPage = new JobDetailsPage(this.page);
    }
    return this.jobDetailsPage;
  }
    
}

module.exports = { PageManager };

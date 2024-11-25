const testData = {
  validCredentials: {
    username: "canadacontact@email.com",
    password: "12345",
  },
  invalidUsername: {
    username: "canadacontacts@email.com",
    password: "12345",
  },
  invalidPassword: {
    username: "canadacontact@email.com",
    password: "123456",
  },
  urls: {
    loginPage: "https://myqa.veritext.com/",
    calendarPage: "https://myqa.veritext.com/home/calendar",
    forgotPasswordPage: "https://myqa.veritext.com/forgotpassword",
  },
  messages: {
    invalidUsername: "User Account is Unknown Please Contact Support",
    invalidPassword: "Incorrect Username or Password Please Try Again",
  },
  getCurrentFormattedDate: (format) => {
    const today = new Date();
    return today.toLocaleDateString("en-US", format);
  },
  getCurrentWeekDates: () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "numeric",
          day: "numeric",
        })
        .replace(",", ""); // Remove the comma
    });
  },
};

module.exports = testData;

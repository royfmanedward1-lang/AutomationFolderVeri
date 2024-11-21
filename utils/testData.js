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
};

module.exports = testData;

const testData = {
  assignmentNumber: {
    confirmed: "6792136",
    cancelled: "6792012",
    filesReady: "6793682",
  },
  validCredentials: {
    username: "newyorkcontact@email.com",
    // username: "canadacontact@email.com",
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

  jobDetails: {
    proceedingTypes: [
      "Deposition or Proceeding",
      "CART",
      "Examination Under Oath",
      "Worker's Compensation",
      "Arbitration",
      "Mediation",
      "Trial Event",
      "Hearing",
      "Meeting",
      "Video Event Only",
      "Other",
    ],
    caseName: ["Canada Case", "Krayoxx Lawsuit #123 $100!"],
    country: "Canada",

    // address: "3225 Pitfield BlvdLaval,",
    address: "4817 Longview Avenue",
    participants: {
      // attyLawyer: "Canada Contact",
      // pointOfContact: "Canada Contact",
      attyLawyer: "New York Contact",
      pointOfContact: "New York Contact",
      schedulingOffice: "4817 Longview Avenue, Jamaica NY 11432",
      // schedulingOffice: "Pitfield Blvd, Laval QC H7A 0A1",
      witnesses: [
        "Markle",
        "Liotta",
        "Pesci",
        "Pacino",
        "Travolta",
        "De Niro",
        "Stallone",
        "Schwarzenegger",
      ],
      attendees: Math.floor(Math.random() * 12) + 1,
    },
    veritextOffices: [
      "New Westminster, BC",
      "Vancouver, BC",
      "Victoria, BC",
      "Winnipeg, MB",
      "Toronto, ON",
      "Regina, SK",
    ],
    findLocationDetails: {
      state: "British Columbia",
      city: "Vancouver",
      zipCode: "S7K 1W8",
    },
  },
  dateAndTime: {
    getDynamicDate: function (daysAhead = 30) {
      const today = new Date();
      let futureDate;
  
      do {
        // Generate a random number of days ahead, starting from tomorrow (1 day ahead)
        const randomDays = Math.floor(Math.random() * daysAhead) + 1;
        futureDate = new Date(today);
        futureDate.setDate(today.getDate() + randomDays);
      } while (futureDate.getDay() === 6 || futureDate.getDay() === 0); // Skip weekends
  
      // Return dynamic date details
      return {
        day: futureDate.getDate().toString(),
        month: futureDate.toLocaleString("default", { month: "long" }), // Full month name, e.g., "January"
        year: futureDate.getFullYear().toString(),
        formatted: futureDate.toISOString().split("T")[0], // ISO formatted date, e.g., "2025-12-19"
      };
      
    },
    timeOptions: [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:30 PM",
      "4:30 PM",
    ],
    timeZones: {
      EST: "4",
      PST: "1",
      CST: "2",
    },
    timeZoneOptions: ["EST", "PST", "CST"], // Add a list of abbreviations for random selection
    getTimeZone: function (abbr) {
      return this.timeZones[abbr] || null;
    },
  },
  proceedingServices: {
    additionalServices: [
      "High-quality legal event",
      "Tailored AV and technical",
      "Secure teleconferencing",
      "Native file exhibit capture",
      "Streamlined, secure paperless",
      "Live transcription during proceedings",
      "Quick preliminary transcripts",
      "Seamless video conferencing",
    ],
  },
  remoteParticipants: {
    firstNames: [
      "Gustavo",
      "John",
      "Emily",
      "Michael",
      "Sarah",
      "William",
      "Sophia",
      "James",
      "Oliver",
      "Emma",
    ],
    lastNames: [
      "Landa",
      "Doe",
      "Smith",
      "Johnson",
      "Brown",
      "Williams",
      "Jones",
      "Garcia",
      "Martinez",
      "Davis",
    ],
    roles: ["Attorney", "Paralegal/Legal Assistant", "Witness", "Other"],
    emails: [
      "gustavo.landa@example.com",
      "john.doe@example.com",
      "emily.smith@example.com",
      "michael.johnson@example.com",
      "sarah.brown@example.com",
      "william.williams@example.com",
      "sophia.jones@example.com",
      "james.garcia@example.com",
      "oliver.martinez@example.com",
      "emma.davis@example.com",
    ],
  },
  jobCardDetails: {
    successMessage: "Success! You're All Set.",
    status: "SCHEDULED",
    cancelledStatus: "CANCELLED",
    updateJobMessage: "Job updated successfully",
  },
};

module.exports = testData;

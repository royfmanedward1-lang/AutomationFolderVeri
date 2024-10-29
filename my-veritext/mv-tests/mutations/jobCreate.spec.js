const { test, expect } = require('@playwright/test');
const fs = require('fs');
const Auth = require('../../Auth');
const jobCreate = require('../../GDS/mutations/jobCreate');
require('dotenv').config();  

let token = "";

test.beforeAll(async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);
});

// Test
test('Create Job', async ({ request, baseURL }) => {
  const caseId = parseInt(process.env.caseId,10);
  const proceedingTypeId = parseInt(process.env.proceedingTypeId,10);
  const thirdPartyId = parseInt(process.env.thirdPartyId,10);
  const depositionDate = process.env.depositionDate;
  const depositionEnd = process.env.depositionEnd;
  const deliveryDays = parseInt(process.env.deliveryDays,10);
  const timeZoneId = parseInt(process.env.timeZoneId,10);
  const locationTypeId = parseInt(process.env.locationTypeId,10);
  const scheduleAddressId = parseInt(process.env.scheduleAddressId,10);
  const attorneyContactId = parseInt(process.env.attorneyContactId,10);
  const callerContactId = parseInt(process.env.callerContactId,10);
  const clientAddressId = parseInt(process.env.clientAddressId,10);
  const clientId = parseInt(process.env.clientId,10);



    // Calls Function
  const userResponse = await request.post(baseURL + '/graphql', {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apollographql-client-name': 'gds-graphiql',
          'apollographql-client-version': 'buildkitsandbox:1.35.2'
      },
      data: {
          operationName: "jobCreate",
          query: jobCreate,
          variables: {
            job: {
                "caseId": caseId,
                "defendant": "Varrick Labs",
                "plaintiff": "Carlos Pereira",
                "proceedingTypeId": proceedingTypeId,
                "thirdPartyId": thirdPartyId,
                "depositionDate": depositionDate,
                "deliveryDays": deliveryDays,
                "depositionEnd": depositionEnd,
                "timeZoneId": timeZoneId,
                "deliveryMethod": "Expedited",
                "locationId": null,
                "locationTypeId": locationTypeId,
                "locationNotes": "",
                "locationAddress1": "2205 4th Street",
                "locationAddress2": "Suite 20",
                "locationCity": "Tuscaloosa",
                "locationName": "Tuscaloosa,AL",
                "locationState": "AL",
                "locationZip": "35401",
                "locationContact": "",
                "locationContactPhone": "",
                "scheduleAddressId": scheduleAddressId,
                "hasDigitalReporter": false,
                "hasTranscriber": false,
                "hasCourtReporter": true,
                "hasInterpreter": false,
                "hasVideographer": false,
                "notes": "",
                "numberOfAttorneys": "2",
                "numberOfWitnesses": "1",
                "attorneyContactId": attorneyContactId,
                "callerContactId": callerContactId,
                "clientAddressId": clientAddressId,
                "clientId": clientId
          }
        }
      }
  });

  // Show error if response not OK
  if (!userResponse.ok()) {
      const errorBody = await userResponse.text();
      console.error("Response Error Body:", errorBody);
      throw new Error(`Request failed with status ${userResponse.status()}`);
  }

  // Validations
  expect(userResponse.ok()).toBeTruthy();

  // Print Response Body
  const responseBody = await userResponse.json();
  console.log(JSON.stringify(responseBody, null, 2));

  // More Validations
  expect(responseBody).not.toBeNull();

// Extracting id created and updating on env File.
const jobId = responseBody.data.jobCreate.id;
const envFilePath = '.env';

let envConfig = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';

if (envConfig.includes('JOB_ID')) {
  // Update Value if exists.
  envConfig = envConfig.replace(/JOB_ID=\d+/g, `JOB_ID=${jobId}`);
} else {
  // Create variable if doesn't exists.
  envConfig += `\nJOB_ID=${jobId}`;
  console.log(`Variable JOB_ID creada en .env con el valor ${jobId}`);
}
fs.writeFileSync(envFilePath, envConfig);

});
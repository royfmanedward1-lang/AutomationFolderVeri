const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');
const getBuildingsQuery = require('../../GDS/querys/getBuildings');
require('dotenv').config();  

let token = "";

test.beforeAll(async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);
});

// Test
test('Get Buildings Information', async ({ request, baseURL }) => {
  // Calls Function
  const buildingsResponse = await request.post(baseURL + '/graphql', {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apollographql-client-name': 'gds-graphiql',
          'apollographql-client-version': 'buildkitsandbox:1.35.2'
      },
      data: {
          operationName: "getBuildings",
          query: getBuildingsQuery
      }
  });

  // Show error if response not OK
  if (!buildingsResponse.ok()) {
      const errorBody = await buildingsResponse.text();
      console.error("Response Error Body:", errorBody);
      throw new Error(`Request failed with status ${buildingsResponse.status()}`);
  }

  // Validations
  expect(buildingsResponse.ok()).toBeTruthy();

  // Print Response Body
  const responseBody = await buildingsResponse.json();
  console.log(JSON.stringify(responseBody, null, 2));

  // More Validations
  expect(responseBody).not.toBeNull();

});
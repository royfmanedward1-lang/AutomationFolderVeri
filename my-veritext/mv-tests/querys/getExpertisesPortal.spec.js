const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');
const getExpertisesPortalQuery = require('../../GDS/querys/getExpertisesPortal');
require('dotenv').config();  

let token = "";

test.beforeAll(async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);
});

// Test
test('Get Expertise Portal', async ({ request, baseURL }) => {

  // Calls Function
  const userResponse = await request.post(baseURL + '/graphql', {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apollographql-client-name': 'gds-graphiql',
          'apollographql-client-version': 'buildkitsandbox:1.35.2'
      },
      data: {
          operationName: "getExpertises_Portal",
          query: getExpertisesPortalQuery,
          variables: {}
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

});
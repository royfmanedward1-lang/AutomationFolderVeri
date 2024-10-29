const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');
const getUserFullQuery = require('../../GDS/querys/getUserFull');
require('dotenv').config();  

let token = "";

// Makes Login
test.beforeAll(async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);
});

// Test
test('Get full user data by ID', async ({ request, baseURL }) => {
  const userId = parseInt(process.env.USERID, 10);

  // Calls  Function
  const fullUserResponse = await request.post(baseURL + '/graphql', {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apollographql-client-name': 'gds-graphiql',
          'apollographql-client-version': 'buildkitsandbox:1.35.2'
      },
      data: {
          operationName: "getUserFull",
          query: getUserFullQuery,
          variables: { id: userId }
      }
  });

  // Show error if response not OK
  if (!fullUserResponse.ok()) {
      const errorBody = await fullUserResponse.text();
      console.error("Response Error Body:", errorBody);
      throw new Error(`Request failed with status ${fullUserResponse.status()}`);
  }

  // Validations
  expect(fullUserResponse.ok()).toBeTruthy();

  // Print Response Body
  const responseBody = await fullUserResponse.json();
  console.log(JSON.stringify(responseBody, null, 2));

  // More Validations
  expect(responseBody).not.toBeNull();
  expect(responseBody.data.user.id).toBe(1578380);


});

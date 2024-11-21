const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');

//query
const divs = "query lookupDivision { divisions {id, name} }";
let token = "";

test('Look up a division', async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);

    const response = await request.post(baseURL + '/graphql', {
        headers:{
            'Content-Type': 'application/json',
            'apollographql-client-name': 'gds-graphiql',
            'apollographql-client-version': 'buildkitsandbox:1.35.2',
            'Authorization': 'Bearer ' + token,
        },

        data: {
            query: divs
        }
    })

    expect(response.ok()).toBeTruthy();
    expect(response.body()).not.toBeNull();
})
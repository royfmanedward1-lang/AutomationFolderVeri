const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');

//queries
const sendEmail = 'mutation sendEmail{emailSend(bodyParams:"{}",customSubject:"test",recipients:["vmartinez@veritext.com"], sent:1, sendFrom:"vmartinez@veritext.com", templateId:500) {id,sent}}';
const sendInvalidEmail = 'mutation sendEmail{emailSend(bodyParams:"{}",customSubject:"test",recipients:["vmartinez¨%#%#"], sent:1, sendFrom:"$$#¨&*(", templateId:(¨&%#)) {id,sent}}';

let token = "";

test('Send Email', async ({ request, baseURL }) => {
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
            query: sendEmail
        }
    })

    expect(response.ok()).toBeTruthy();
    expect(response.body()).not.toBeNull();
})

test('Send an Invalid Email', async ({ request, baseURL }) => {
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
            query: sendInvalidEmail
        }
    })

    expect(response.status()).toBe(400);
    expect(response.body()).not.toBeNull();
})
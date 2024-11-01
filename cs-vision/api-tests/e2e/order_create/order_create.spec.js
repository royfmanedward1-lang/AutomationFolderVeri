const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');
const CreateJob = require('../../CreateJob');


//variables
let token = "";
let jobId = "";
let orderType = ["OTHER", "VIDEO"];

test.beforeAll('Get token and Create a Job', async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const createJob = new CreateJob(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);
    jobId = await createJob.create_a_job(request, token);
})

test('Create an Order with type OTHER', async ({ request, baseURL }) => {
    const order_create = 'mutation orderCreate {' +
        'orderCreate(order: { ' +
          'jobId:' + jobId + ',' +
          'clientId: 67376, ' +
          'attorneyContactId: 1019677, ' +
          'orderSource: PRE_ORDER, ' +
          'addressId: 7405, ' +
          'isVideoOrder: false, ' +
             'orderType: ' + orderType[0] +
        '}) { ' +
          'id ' +
          'job { ' +
            'id ' +
          '} ' +
        '} ' +
      '}';

    const response = await request.post(baseURL + '/graphql', {
        headers:{
            'Content-Type': 'application/json',
            'apollographql-client-name': 'gds-graphiql',
            'apollographql-client-version': 'buildkitsandbox:1.35.2',
            'Authorization': 'Bearer ' + token,
        },

        data: {
            query: order_create
        }
    })

    var result = await response.json();
    // console.log(result);
    expect(response.status()).toBe(200);
    expect(response.body()).not.toBeNull();
})

test('Create an Order with type VIDEO', async ({ request, baseURL }) => {
    const order_create = 'mutation orderCreate {' +
        'orderCreate(order: { ' +
          'jobId:' + jobId + ',' +
          'clientId: 67376, ' +
          'attorneyContactId: 1019677, ' +
          'orderSource: PRE_ORDER, ' +
          'addressId: 7405, ' +
          'isVideoOrder: false, ' +
             'orderType: ' + orderType[1] +
        '}) { ' +
          'id ' +
          'job { ' +
            'id ' +
          '} ' +
        '} ' +
      '}';

    const response = await request.post(baseURL + '/graphql', {
        headers:{
            'Content-Type': 'application/json',
            'apollographql-client-name': 'gds-graphiql',
            'apollographql-client-version': 'buildkitsandbox:1.35.2',
            'Authorization': 'Bearer ' + token,
        },

        data: {
            query: order_create
        }
    })

    var result = await response.json();
    // console.log(result);
    expect(response.status()).toBe(200);
    expect(response.body()).not.toBeNull();
})
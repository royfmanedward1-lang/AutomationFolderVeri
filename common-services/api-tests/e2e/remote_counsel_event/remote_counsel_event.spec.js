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

test('Create Remote Counsel Event', async ({ request, baseURL }) => {
    const remote_counsel_event = 'query createOrUpdateRemoteCouselEvent{' +
      'remoteCounselEvent(jobId:"'+ jobId + '", saveData: true) {' +
        'message ' +
        'eventData' +
      '}' +
    '}';

    const response = await request.post(baseURL + '/graphql', {
        headers:{
            'Content-Type': 'application/json',
            'apollographql-client-name': 'gds-graphiql',
            'apollographql-client-version': 'buildkitsandbox:1.35.2',
            'Authorization': 'Bearer ' + token,
        },

        data: {
            query: remote_counsel_event
        }
    })

    var result = await response.json();
    // console.log(result);
    expect(response.status()).toBe(200);
    expect(response.body()).not.toBeNull();
})

test('Update Remote Counsel Event', async ({ request, baseURL }) => {
  const remote_counsel_event = 'query createOrUpdateRemoteCouselEvent{' +
    'remoteCounselEvent(jobId:"6780430", saveData: true) {' +
      'message ' +
      'eventData' +
    '}' +
  '}';

  const response = await request.post(baseURL + '/graphql', {
      headers:{
          'Content-Type': 'application/json',
          'apollographql-client-name': 'gds-graphiql',
          'apollographql-client-version': 'buildkitsandbox:1.35.2',
          'Authorization': 'Bearer ' + token,
      },

      data: {
          query: remote_counsel_event
      }
  })

  var result = await response.json();
  // console.log(result);
  expect(response.status()).toBe(200);
  expect(response.body()).not.toBeNull();
})

test('Update Remote Counsel Event with an invalid job', async ({ request, baseURL }) => {
  const remote_counsel_event = 'query createOrUpdateRemoteCouselEvent{' +
    'remoteCounselEvent(jobId:"6780417", saveData: true) {' +
      'message ' +
      'eventData' +
    '}' +
  '}';

  const response = await request.post(baseURL + '/graphql', {
      headers:{
          'Content-Type': 'application/json',
          'apollographql-client-name': 'gds-graphiql',
          'apollographql-client-version': 'buildkitsandbox:1.35.2',
          'Authorization': 'Bearer ' + token,
      },

      data: {
          query: remote_counsel_event
      }
  })

  var result = await response.json();
  // console.log(result);
  expect(response.status()).toBe(200);
  expect(result['errors'][0]['message']).toBe("This job does not include a defendant or plaintiff.");
  expect(response.body()).not.toBeNull();
})
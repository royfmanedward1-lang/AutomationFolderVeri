const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');
const CreateJob = require('../../CreateJob');

//variables
let token = "";
let jobId = "";
let roomId = "";

test.beforeAll('Get token and Create a Job', async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const createJob = new CreateJob(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);
    jobId = await createJob.create_a_job(request, token);
})

test('Cancel a zoom room booking', async ({ request, baseURL }) => {
    const createZoomRoomBooking = 'mutation roomBookingZoomCreate($zoomMeetingSettings:ZoomMeetingSettingsCreateInput){' +
    'roomBookingZoomCreate(jobId:' + jobId + ', roomId: 1, zoomMeetingSettings: $zoomMeetingSettings){' +
     ' id ' +
      'job {' +
       ' id ' +
      '}' +
      'dateCreated ' +
      'room {' +
        'id ' +
       ' name ' +
      '}' +
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
            query: createZoomRoomBooking
        }
    })

    var result = await response.json();
    roomId = result['data']['roomBookingZoomCreate']['id'];

    const cancelZoomRoomBooking = 'mutation roomBookingZoomCancel{ ' +
        'roomBookingZoomCancel(roomBookingId:"' + roomId + '")}'

        const responseCancel = await request.post(baseURL + '/graphql', {
            headers:{
                'Content-Type': 'application/json',
                'apollographql-client-name': 'gds-graphiql',
                'apollographql-client-version': 'buildkitsandbox:1.35.2',
                'Authorization': 'Bearer ' + token,
            },
    
            data: {
                query: cancelZoomRoomBooking
            }
        })

        var resultCancel = await responseCancel.json();
        // console.log(resultCancel);
        expect(response.status()).toBe(200);
        expect(response.body()).not.toBeNull();
})
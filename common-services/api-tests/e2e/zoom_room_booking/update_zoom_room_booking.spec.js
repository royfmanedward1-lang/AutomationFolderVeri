const { test, expect } = require('@playwright/test');
const Auth = require('../../Auth');

//variables
let token = "";
let jobId = "6771707";

test('Update a zoom room booking', async ({ request, baseURL }) => {
    const auth = new Auth(baseURL);
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    token = await auth.login(request, username, password);
    
    const updateZoomRoomBooking = 'mutation roomBookingZoomUpdate($zoomMeetingSettings:ZoomMeetingSettingsCreateInput){' +
    'roomBookingZoomUpdate(jobId:' + jobId + ', roomId: 1, zoomMeetingSettings: $zoomMeetingSettings){' +
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
            query: updateZoomRoomBooking
        }
    })

    var result = await response.json();
    // console.log(result);
    expect(response.status()).toBe(200);
    expect(response.body()).not.toBeNull();
})
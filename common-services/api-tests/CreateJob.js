class CreateJob {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async create_a_job(request, token) {
        const response = await request.post(`${this.baseURL}/graphql`, {
            headers:{
                'Content-Type': 'application/json',
                'apollographql-client-name': 'gds-graphiql',
                'apollographql-client-version': 'buildkitsandbox:1.35.2',
                'Authorization': 'Bearer ' + token,
            },
    
            data: {
                query:  'mutation createSchedule{' +
                        'jobCreate(job:{' +
                        'callerContactId:1,' +
                        'clientAddressId: 1,' +
                        'clientId: 1,' +
                        'depositionDate: "2025-05-05", ' +
                        'hasCourtReporter: false, ' +
                        'hasDigitalReporter: true, ' +
                        'hasInterpreter:false, ' +
                        'hasTranscriber: true, ' +
                        'hasVideographer: false, ' +
                        'locationAddress1: "Fake Street 1" ' +
                        'locationAddress2: "Fake Street 2" ' +
                        'locationCity: "Fake City", ' +
                        'locationContact: "Fake Person", ' +
                        'locationContactPhone: "(000)111-2222", ' +
                        'locationName: "Fa & Ke Corp", ' +
                        'locationNotes: "It`s Fake", ' +
                        'locationState: "FA" ' +
                        'locationTypeId: 1,' +
                        'locationZip: "fake.zip",' +
                        'timeZoneId: 1,' +
                        'defendant: "test",' +
                        'plaintiff: "test"' +
                        '}){' +
                        ' id' +
                        '}' +
                        '}'
                }
        })


        if (!response.ok()) {
            throw new Error(`Job creation failed: ${response.status()}`);
        }

        let jobId = "";
        jobId = await response.json();
        return jobId['data']['jobCreate']['id'];
    }
}

module.exports = CreateJob;

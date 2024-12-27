import { request } from "@playwright/test";
export class JobService {
    async createNewJob(accessToken, job) {
        let url;
        const env = process.env.TEST_ENV || 'STAGING';
        if (env.toUpperCase() === 'QA') {
            url = process.env.QA_GDS_URL;
        } else {
            url = process.env.STAGING_GDS_URL;
        };
        const api = await request.newContext();
        const query = job;
        const data = ({
            query: query
        });
        console.log(`${url}/graphql`, 'graphql url')
        const response = await api.post(`${url}/graphql`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'apollographql-client-name': 'gds-graphiql',
                    'apollographql-client-version': 'WSAMZN-V3QJ4C7C:1.17.0'
                },
                data
            }
        );
        const status = response.status();
        console.log('create job status is', status);
        console.log('body is', response);
        const testRes = JSON.parse(await response.text());
        console.log('create job resposne body is', testRes);
        console.log('job id is', testRes.data.jobCreate.id);
        return testRes.data.jobCreate.id;

    };
}
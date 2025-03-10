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
        console.log('create job response body is', testRes);
        console.log('job id is', testRes.data.jobCreate.id);
        return testRes.data.jobCreate.id;

    };

    async getJob(accessToken, jobId) {
        let url;
        const env = process.env.TEST_ENV || 'STAGING';
    
        if (env.toUpperCase() === 'QA') {
            url = process.env.QA_GDS_URL;
        } else {
            url = process.env.STAGING_GDS_URL;
        }
    
        const api = await request.newContext();
    
        const query = `
        query getJob($id: Int!) {
          job(id: $id) {
            ...Job
            __typename
          }
        }
    
        fragment Job on Job {
          id
          attorney {
            name
            __typename
          }
          caller {
            id
            name
            __typename
          }
          case {
            name
            __typename
          }
          client {
            id
            name
            priority
            addresses {
              id
              __typename
            }
            __typename
          }
          childDivision {
            id
            name
            __typename
          }
          depositionDate
          depositionEnd
          defendant
          deliveryDays
          deliveryMethod
          division {
            id
            calendarEmail
            name
            __typename
          }
          hasCourtReporter
          hasDigitalReporter
          hasInterpreter
          hasTranscriber
          hasVideographer
          language
          litigationType {
            id
            name
            __typename
          }
          location {
            name
            __typename
          }
          locationNotes
          locationContactPhone
          locationAddress1
          locationAddress2
          locationCity
          locationName
          locationState
          locationType {
            id
            name
            __typename
          }
          locationZip
          plaintiff
          proceedingType {
            name
            __typename
          }
          services {
            name
            __typename
          }
          status
          thirdParty {
            name
            __typename
          }
          timezone {
            ...Timezone
            __typename
          }
          vendors {
            ...JobVendor
            __typename
          }
          vpz {
            id
            __typename
          }
          witnesses {
            id
            name
            witnessType {
              id
              name
              __typename
            }
            __typename
          }
          __typename
        }
    
        fragment JobVendor on JobVendor {
          id
          status
          type
          vendor {
            id
            contactInformation(enabledOnly: true, primaryOnly: true) {
              cellphone
              city
              email {
                address
                __typename
              }
              fax
              phone1
              phone2
              state {
                initials
                name
                __typename
              }
              zip
              __typename
            }
            firstName
            lastName
            name
            type
            us
            __typename
          }
          __typename
        }
    
        fragment Timezone on Timezone {
          displayName
          stdName
          stdShortName
          timezone
          __typename
        }
        `;
    
        const data = {
            query,
            variables: { id: jobId }
        };
    
        console.log(`Sending request to: ${url}/graphql`);
    
        const response = await api.post(`${url}/graphql`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'apollographql-client-name': 'gds-graphiql',
                'apollographql-client-version': 'WSAMZN-V3QJ4C7C:1.17.0'
            },
            data
        });
    
        const status = response.status();
        console.log('getJob status:', status);
    
        const responseBody = JSON.parse(await response.text());
        console.log('getJob response:', JSON.stringify(responseBody, null, 2));
        return responseBody;
    }
}
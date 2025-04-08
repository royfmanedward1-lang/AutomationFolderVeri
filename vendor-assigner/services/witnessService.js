import { request } from "@playwright/test";
export const createWitness = async (accessToken, lastName, jobId, witnessTypeId) => {
    let url;
    const env = process.env.TEST_ENV || 'STAGING';
    if (env.toUpperCase() === 'QA') {
        url = process.env.QA_GDS_URL;
    } else {
        url = process.env.STAGING_GDS_URL;
    };
    const mutation = `
        mutation witnessCreate($witness: CreateWitnessInput!) {
            witnessCreate(witness: $witness) {
                id
                name
                firstName
                email
                expertise {
                    id
                    enabled
                    name
                    __typename
                }
                lastName
                middleName
                salutation
                startTime
                suffix
                appearanceOnly
                startPage
                endPage
                witnessType {
                    name
                }
                __typename
            }
        }
    `;

    const variables = {
        witness: {
            expertiseId: 0,
            firstName: "",
            lastName: lastName,
            middleName: "",
            salutation: "",
            email: "",
            startTime: "",
            suffix: "",
            appearanceOnly: false,
            jobId: jobId,
            witnessTypeId: witnessTypeId
        }
    };
    const api = await request.newContext();
    const response = await api.post(`${url}/graphql`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'apollographql-client-name': 'gds-graphiql',
            'apollographql-client-version': 'WSAMZN-V3QJ4C7C:1.17.0'
        },
        data: JSON.stringify({ query: mutation, variables })
    });

    const responseBody = await response.json();
    console.log('Witness creation response:', responseBody);
    return responseBody;
}
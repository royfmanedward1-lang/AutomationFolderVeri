import { request } from "@playwright/test";

export const loginService = async () => {
    let username;
    let password;
    let url;
    const env = process.env.TEST_ENV || 'STAGING';
    if (env.toUpperCase() === 'QA') {
        username = process.env.QA_USERNAME;
        password = process.env.QA_PASSWORD;
        url = process.env.QA_GDS_URL;
    } else {
        username = process.env.STAGING_USERNAME;
        password = process.env.STAGING_PASSWORD;
        url = process.env.STAGING_GDS_URL;
    };
    const api = await request.newContext();
    console.log(`${url}/login`, 'login url')
    const response = await api.post(`${url}/login`, {
        data: {
            "application": "GDS GraphiQL",
            "username": username,
            "password": password,
            "device":
            {
                "id": "f8683f979474ef684f8f380bd5f9b7c2",
                "description": "Windows NT 10.0; Win64; x64",
                "type": "Win32"
            },
            "forGraphiql": true
        }
    });
    const body = await response.json();
    const respJson = await response.json();
    console.log('response is', body);
    const testRes = JSON.parse(await response.text());
    console.log('session is ', testRes.session)
    return testRes.session;
}
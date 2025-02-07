import { request } from "@playwright/test";
export class VendorService {
    async getVPZByVendorsId(accessToken, vendorId) {
        let url;
        const env = process.env.TEST_ENV || 'STAGING';
    
        if (env.toUpperCase() === 'QA') {
            url = process.env.QA_GDS_URL;
        } else {
            url = process.env.STAGING_GDS_URL;
        }
    
        const api = await request.newContext();
        const query = `query vendor($id: Int!) {
                        vendor(id: $id) {
                          name
                          vpzs {
                            id
                          }
                        }
                      }
                    `;
    
        const data = {
            variables: {
                id: vendorId
            },
            query
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
        console.log('getVendors status:', status);
    
        const responseBody = JSON.parse(await response.text());
    
        return responseBody;
    }
}
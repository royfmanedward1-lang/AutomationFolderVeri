class Auth {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async login(request, username, password, application = "GDS GraphiQL") {
        const response = await request.post(`${this.baseURL}/login`, {
            data: {
                application: application,
                username: username,
                password: password,
                device: {
                    id: "c149ac02a263afc633a989c62c8d9c7f",
                    description: "Win32",
                    type: "Win32"
                },
                forGraphiql: true
            }
        });

        if (!response.ok()) {
            throw new Error(`Login failed with status ${response.status()}`);
        }

        const responseBody = await response.json();
        return responseBody.session;
    }
}

module.exports = Auth;

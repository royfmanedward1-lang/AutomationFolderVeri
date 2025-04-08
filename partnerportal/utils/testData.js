class TestData {
    static credentials = {
        validUser: {
            username: 'vendor_AndreQ',
            password: '1234'
        },
        invalidPassword: {
            username: 'vendor_AndreQ',
            password: '123456'
        },
        invalidUser: {
            username: 'vendor_Unknown',
            password: '1234'
        }
    };

    static urls = {
        baseUrl: 'https://partner-portal-qa.108.veritext.com/',
        dashboardUrl: 'https://partner-portal-qa.108.veritext.com/#/app/dashboard'
    };

    static messages = {
        invalidCredentials: 'Incorrect Username or Password Please Try Again',
        unknownUser: 'User Account is Unknown Please Contact Support'
    };
}

module.exports = TestData;
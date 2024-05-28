exports.LoginPage = class LoginPage {
    constructor(page){
        this.page= page;
    }

    async login() {
        let url;
        let username;
        let password;
        const env = process.env.TEST_ENV || 'STAGING';
        if (env.toUpperCase() === 'QA') {
            url = process.env.QA_URL;
            username = process.env.QA_USERNAME;
            password = process.env.QA_PASSWORD;
        } else {
            url = process.env.STAGING_URL;
            username = process.env.STAGING_USERNAME;
            password = process.env.STAGING_PASSWORD;
        }

        await this.page.goto(url);
        await this.page.getByPlaceholder('username').waitFor();
        await this.page.getByPlaceholder('username').fill(username);
        await this.page.getByPlaceholder('password').fill(password);

        await this.page.getByRole('button', { name: 'LOGIN' }).waitFor();
        await this.page.getByRole('button', { name: 'LOGIN' }).click();
    }
}
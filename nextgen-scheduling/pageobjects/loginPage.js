import { expect} from "@playwright/test";
import nextgenConfig from "../nextgen.config";

export class LoginPage { 
    constructor(page){
        this.page = page      
    }

    async goToLogin(){
        //const url = decodeURI('https://wftm-qa.veritext.com/login')  
        const url = decodeURI(nextgenConfig.url);
        
        await this.page.goto(url)
    }

    
    async submitCredentials(username, password) {
        await this.page.getByRole('textbox', {name: 'username'}).fill(username) 
        await this.page.getByRole('textbox', {name: 'password'}).fill(password) 
        await this.page.getByRole('button', {name: 'LOGIN'}).click()
        
    } 
    
    async verifyLoginPageIsDisplayed() {
        return expect(await this.page).toHaveURL("https://scheduling-qa.vis.veritext.com/scheduling/newjob");
         //await expect(this.page).toHaveURL("https://scheduling-qa.vis.veritext.com/scheduling/newjob");
    }

   

    async goToJob(job) {
        //const job = 5112439
        const urlJob = decodeURI('https://scheduling-qa.vis.veritext.com/scheduling/' + job)
        //const urlJob = 'https://scheduling-qa.vis.veritext.com/scheduling/5112439'
        await this.page.goto(urlJob)  
        await expect(this.page.getByRole('heading', {name: "Vision"})).toBeVisible()
        //return expect(await this.page.getByRole('heading', {name: "Vision"})).toBeVisible()
       // await this.page.locator('input').first().click()
    }

    async verifyWFPageIsDisplayed() {
        return expect(this.page).toHaveURL("https://wftm-qa.veritext.com/mytasks/activetasks");
        
    }
   

}
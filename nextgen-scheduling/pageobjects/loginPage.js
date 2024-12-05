import { expect} from "@playwright/test";
import nextgenConfig from "../nextgen.config";

export class LoginPage { 
    constructor(page){
        this.page = page      
    }

    async goToLogin(){
        const url = decodeURI(nextgenConfig.url);
        
        await this.page.goto(url)
    }

    
    async submitCredentials(username, password) {
        await this.page.getByRole('textbox', {name: 'username'}).fill(username) 
        await this.page.getByRole('textbox', {name: 'password'}).fill(password) 
       
        await expect(async() =>{
            const urlNewjob = decodeURI(nextgenConfig.urlNewjob);
            await this.page.getByRole('button', {name: 'LOGIN'}).click()
            await expect(this.page).toHaveURL(nextgenConfig.urlNewjob)
        }).toPass()
        
        
    } 
    
    async goToJob(job) {
        const urlJob = decodeURI( nextgenConfig.urlExt + job)  
        await this.page.goto(urlJob) 
        await expect(this.page.getByRole('heading', {name: "Vision"})).toBeVisible()
    }
   

}
//import { type Page} from "@playwright/test";
import { LoginPage } from "./loginPage";
import { Client } from "./searchClientFields";
import { Case } from "./searchCasefields"
import { Job } from "./searchJobFields";


export class PageManager{

    constructor(page){
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.client = new Client(this.page)
        this.case = new Case(this.page)
        this.job = new Job(this.page)
    }

    get LoginPage(){
        return this.loginPage
        
    }

    get Client(){
        return this.client
    }

    get Case(){
        return this.case
    }

    get Job(){
        return this.job    
    }
}

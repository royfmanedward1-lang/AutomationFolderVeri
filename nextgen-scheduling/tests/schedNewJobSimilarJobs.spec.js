import { test, chromium } from "@playwright/test";
import { PageManager } from "../pageobjects/pageManager";
import clientData  from '../testdata/clientData.json'
const nextGenConfig = require('../nextgen.config');

test.beforeEach('Login to nextgen and go to job with extractions', async ({page}) => {
    const poManager = new PageManager(page)
    const browser = await chromium.launch()
    const context = await browser.newContext()
    await context.clearCookies()
    await test.step('Login to nextgen page', async() => {
        await poManager.LoginPage.goToLogin()
        await poManager.LoginPage.submitCredentials(nextGenConfig.user_name,nextGenConfig.password)
    })
    
})

test.describe('Similar job search when scheduling a new a job', () => {
    test('Find similar jobs when scheduling a new a job: Client, Division, Caller and Proceeding date', async({page}) => {
                const newTab = new PageManager(page)
                const clientPage = newTab.Client
                const jobPage = newTab.Job
                const i = 4 

                await test.step('Search and select Client Name', async() =>{
                    await clientPage.searchField('clientName', clientData[i].clientName);
                })
                await test.step('Search and select Client Office', async() =>{
                    await clientPage.searchField('clientOffice', clientData[i].clientAddress);
                })
                await test.step('Search and select Division', async() =>{
                    await clientPage.searchField('division', clientData[i].division);
                })
                await test.step('Search and select a Caller', async() =>{
                    await clientPage.searchField('caller', clientData[i].caller);
                })
                await test.step('Select Proceeding date', async() =>{
                    await jobPage.selectDate('Proceeding Date *', clientData[i].proceedingDate);
                    
                })
                await test.step('Search similar jobs with Division, Caller and Proceeding date', async() => {
                    await jobPage.searchSimilarJobs();
                    await jobPage.reviewSimilarJobsHeader(clientData[i].clientName);
                    await jobPage.reviewSimilarJobsHeader(clientData[i].division);
                    await jobPage.reviewSimilarJobsHeader(clientData[i].caller);
                    await jobPage.reviewSimilarJobsHeader(clientData[i].proceedingDate);
                    await jobPage.verifyColumnsSimilarJobSearch();
             
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].jobID);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].status);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].attorney);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].locationType);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].locationState);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].locationCity);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].childDivision);                     
                })
                
    })

    test('Find Simmilar jobs when scheduling a new a job: Client, Attorney, Witness', async({page}) =>{
                const newTab = new PageManager(page)
                const clientPage = newTab.Client
                const jobPage = newTab.Job
                const i = 5 

                await test.step('Search and select Client Name', async() =>{
                    await clientPage.searchField('clientName', clientData[i].clientName);
                })
                await test.step('Search and select Client Office', async() =>{
                    await clientPage.searchField('clientOffice', clientData[i].clientAddress);
                })
                await test.step('Search and select Attorney', async() =>{
                    await clientPage.searchField('attorney', clientData[i].attorney);
                })
                await test.step('Select Proceeding date', async() =>{
                    await jobPage.selectDate('Proceeding Date *', clientData[i].proceedingDate);
                    
                })
                await test.step('Enter Witnesses', async() =>{
                    for(const witness in clientData[i].witness){
                        const lastname = clientData[i].witness[witness].lastname
                        const firstname = clientData[i].witness[witness].firstname
                        const middlename = clientData[i].witness[witness].middlename
                        const email = clientData[i].witness[witness].email
                        const typeWit = clientData[i].witness[witness].type
                        const expertise = clientData[i].witness[witness].expertise
                        
                        await jobPage.openWitnessPopup()
                        await jobPage.enterTextValues('lastName',lastname)
                        
                        if(firstname != ''){
                            await jobPage.enterTextValues('firstName', firstname)
                        } 
                        
                        if(middlename != ''){
                            await jobPage.enterTextValues('middleName', middlename)
                        } 
                        
                        if(email != ''){
                            await jobPage.enterTextValues('email', email)
                        }
                        if(typeWit != ''){
                            await jobPage.selectWitnessType(typeWit, expertise)

                        }
                        
                        await jobPage.closeWitnessPopup(lastname)
                    }
                    
                })
                await test.step('Search similar jobs with Attorney and Witness', async() => {
                    await jobPage.searchSimilarJobs();
                    await jobPage.reviewSimilarJobsHeader(clientData[i].clientName);
                    await jobPage.reviewSimilarJobsHeader(clientData[i].attorney);
                    await jobPage.reviewSimilarJobsHeader(clientData[i].proceedingDate);
                    await jobPage.verifyColumnsSimilarJobSearch();
             
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].jobID);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].status);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].attorney);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].locationType);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].locationState);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].locationCity);
                    await jobPage.verifySimilarJobResults(clientData[i].similarJob[0].division);                     
                })

    })
})
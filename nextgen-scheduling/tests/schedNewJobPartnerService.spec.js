import { test, chromium } from "@playwright/test";
import { PageManager } from "../pageobjects/pageManager";
import clientData  from '../testdata/clientData.json'
const nextGenConfig = require('../nextgen.config');

test.beforeEach('Login to nextgen and go to job with extractions', async ({page}) => {
    const poManager = new PageManager(page)
    const browser = await chromium.launch()
    const context = await browser.newContext()
    await context.clearCookies();
    await test.step('Login to nextgen page', async() => {
        await poManager.LoginPage.goToLogin();
        await poManager.LoginPage.submitCredentials(nextGenConfig.user_name,nextGenConfig.password);
    })
    
})

test.describe('Schedule a new job selecting Partner Services', () => {
   
    for (const partService of nextGenConfig.partnerServices){
        test('Schedule a new job selecting '+ partService + ' as an additional Partner Service', async({page}) => {
            const newTab = new PageManager(page)
            const clientPage = newTab.Client
            const jobPage = newTab.Job
            const i = 2 
    
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
            await test.step('Search and select an Attorney', async() =>{
                await clientPage.searchField('attorney', clientData[i].attorney);
            })
            await test.step('Search and select a Litigation type', async() =>{
                await clientPage.selectComboboxValue('litigationType', clientData[i].litigationType)
            })
            await test.step('Verify default value for Proceeding type', async() => {
                await clientPage.verifyDefaultvalues('proceedingType', nextGenConfig.proceedinfTypeDefault)
            })
            await test.step('Select Location type', async() => {
                await jobPage.selectLocationType(nextGenConfig.locationTypes[0], 'locationClientName');
            }) 
            await test.step('Search and select Timezone', async() =>{
                await jobPage.selectTimezone(clientData[i].timezone);
            })
            await test.step('Select Proceeding date', async() =>{
                await jobPage.selectDate('Proceeding Date *', clientData[i].proceedingDate);
                
            })
            await test.step('Select proceeding Start time', async() =>{
                await jobPage.selectProceedingTime('Start time *', false, clientData[i].startProceedingTime);
                await jobPage.endTimeCheck.check();
            })
            await test.step('Enter number of Attendees', async() =>{
                await jobPage.enterNumberAttendeesParties('numberOfAttendees',clientData[i].numberOfAtendees);
            })
            await test.step('Verify Steno Reporting is default value for Partner Services', async() =>{
                await jobPage.verifyDefaultValuePartnerService();
            })
            await test.step('Select '+ partService+' in Partner Services', async() =>{
                if(partService == 'Interpreting'){
                    await jobPage.selectPartnerServices(partService, clientData[i].languaje); 
                } else {
                    await jobPage.selectPartnerServices(partService); 
                }   
            })
            await test.step('Publish job', async() => {
                await jobPage.publishJob()
            })
        })
       
    }
 
})
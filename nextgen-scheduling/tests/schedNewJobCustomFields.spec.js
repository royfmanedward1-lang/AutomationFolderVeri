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

test.describe('Schedule new a job with Custom Fields', () => {
    test('Schedule a new job for a Client with Custom Fields', async({page}) => {
        const newTab = new PageManager(page)
                const clientPage = newTab.Client
                const jobPage = newTab.Job
                const i = 3 //Client selected should have custom fields

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
                await test.step('Enter custom field values for Client', async() =>{
                    for(const customF in clientData[i].customFields){
                        await clientPage.enterCustomFields('client',customF, clientData[i].customFields[customF].name ,clientData[i].customFields[customF].value);
                    }
                })
                await test.step('Search and select a Litigation type', async() =>{
                    await clientPage.selectComboboxValue('litigationType', clientData[i].litigationType);
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
                await test.step('Select Proceeding Start and End time', async() =>{
                    await jobPage.selectProceedingTime('Start time *', false, clientData[i].startProceedingTime);
                    await jobPage.selectProceedingTime('End Time', true, clientData[i].endProceedingTime);
                })
                await test.step('Enter number of Attendees', async() =>{
                    await jobPage.enterNumberAttendeesParties('numberOfAttendees',clientData[i].numberOfAtendees);
                })
                await test.step('Publish job', async() => {
                    await jobPage.publishJob()
                })
              
    })
    test('Schedule a new job for a Third party with Custom Fields', async({page}) => {
        const newTab = new PageManager(page)
                const clientPage = newTab.Client
                const jobPage = newTab.Job
                const i = 3 //Third party for the client selected should have custom fields

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
                await test.step('Search and select Third party', async() =>{
                    await clientPage.searchField('thirdPartyAssociation', clientData[i].thirdParty);
                })
                await test.step('Enter custom field values for Third party', async() =>{
                    for(const customF in clientData[i].thirdPartyCustomFields){
                        await clientPage.enterCustomFields('thirdParty',customF, clientData[i].thirdPartyCustomFields[customF].name 
                        ,clientData[i].thirdPartyCustomFields[customF].value);
                    }
                })
                await test.step('Search and select a Litigation type', async() =>{
                    await clientPage.selectComboboxValue('litigationType', clientData[i].litigationType);
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
                await test.step('Select Proceeding Start and End time', async() =>{
                    await jobPage.selectProceedingTime('Start time *', false, clientData[i].startProceedingTime);
                    await jobPage.selectProceedingTime('End Time', true, clientData[i].endProceedingTime);
                })
                await test.step('Enter number of Attendees', async() =>{
                    await jobPage.enterNumberAttendeesParties('numberOfAttendees',clientData[i].numberOfAtendees);
                })
                await test.step('Publish job', async() => {
                    await jobPage.publishJob()
                })
    })
})
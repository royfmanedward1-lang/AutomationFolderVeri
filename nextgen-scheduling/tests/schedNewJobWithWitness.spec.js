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

test.describe('Schedule new a job adding witnesses and attending parties', () => {
    test('Schedule a new job adding attending parties', async({page}) => {
        const newTab = new PageManager(page)
                const clientPage = newTab.Client
                const jobPage = newTab.Job
                const i = 0

                await test.step('Search and select Client Name', async() =>{
                    await clientPage.searchField('clientName', clientData[i].clientName)
                })
                await test.step('Search and select Client Office', async() =>{
                    await clientPage.searchField('clientOffice', clientData[i].clientAddress)
                })
                await test.step('Search and select Division', async() =>{
                    await clientPage.searchField('division', clientData[i].division)
                })
                await test.step('Search and select a Caller', async() =>{
                    await clientPage.searchField('caller', clientData[i].caller)
                })
                await test.step('Search and select an Attorney', async() =>{
                    await clientPage.searchField('attorney', clientData[i].attorney)
                })
                await test.step('Search and select a Litigation type', async() =>{
                    await clientPage.selectComboboxValue('litigationType', clientData[i].litigationType)
                })
                await test.step('Select Location type', async() => {
                    await jobPage.selectLocationType(nextGenConfig.locationTypes[0], 'locationClientName')
                }) 
                await test.step('Search and select Timezone', async() =>{
                    await jobPage.selectTimezone(clientData[i].timezone)
                })
                await test.step('Select Proceeding date', async() =>{
                    await jobPage.selectDate('Proceeding Date *', clientData[i].proceedingDate)
                    
                })
                await test.step('Select Proceeding Start and End time', async() =>{
                    await jobPage.selectProceedingTime('Start time *', false, clientData[i].startProceedingTime)
                    await jobPage.selectProceedingTime('End Time', true, clientData[i].endProceedingTime)
                })
                await test.step('Enter number of Attendees', async() =>{
                    await jobPage.enterNumberAttendeesParties('numberOfAttendees',clientData[i].numberOfAtendees)
                })
                await test.step('Enter number of Witnesses', async() =>{
                    await jobPage.enterNumberAttendeesParties('numberOfWitnesses',clientData[i].numberOfWitness)
                })
                await test.step('Enter number of Attorneys', async() =>{
                    await jobPage.enterNumberAttendeesParties('numberOfAttorneys',clientData[i].numberOfAttorneys)
                })
                await test.step('Publish job', async() => {
                    await jobPage.publishJob()
                })

    })

    test('Schedule a new job adding Witnesses', async({page}) => {
        const newTab = new PageManager(page)
                const clientPage = newTab.Client
                const jobPage = newTab.Job
                const i = 2

                await test.step('Search and select Client Name', async() =>{
                    await clientPage.searchField('clientName', clientData[i].clientName)
                })
                await test.step('Search and select Client Office', async() =>{
                    await clientPage.searchField('clientOffice', clientData[i].clientAddress)
                })
                await test.step('Search and select Division', async() =>{
                    await clientPage.searchField('division', clientData[i].division)
                })
                await test.step('Search and select a Caller', async() =>{
                    await clientPage.searchField('caller', clientData[i].caller)
                })
                await test.step('Search and select a Litigation type', async() =>{
                    await clientPage.selectComboboxValue('litigationType', clientData[i].litigationType)
                })
                await test.step('Select Location type', async() => {
                    await jobPage.selectLocationType(nextGenConfig.locationTypes[0], 'locationClientName')
                }) 
                await test.step('Search and select Timezone', async() =>{
                    await jobPage.selectTimezone(clientData[i].timezone)
                })
                await test.step('Select Proceeding date', async() =>{
                    await jobPage.selectDate('Proceeding Date *', clientData[i].proceedingDate)
                    
                })
                await test.step('Select Proceeding Start time', async() =>{
                    await jobPage.selectProceedingTime('Start time *', false, clientData[i].startProceedingTime)
                    await jobPage.endTimeCheck.check()
                })
                await test.step('Enter number of Attendees', async() =>{
                    await jobPage.enterNumberAttendeesParties('numberOfAttendees',clientData[i].numberOfAtendees)
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
                await test.step('Publish job', async() => {
                    await jobPage.publishJob()
                })
                

    })

})
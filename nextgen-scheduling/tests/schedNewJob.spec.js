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

test.describe('Search and select required fields to schedule a new job by different Methods', () =>{
    for (const method of nextGenConfig.methods){
        

        for (const locType of nextGenConfig.locationTypes){
          //  const method = 'Email'
            test('Search and select required fields to schedule a new job for method ' + method +' and location type '+ locType, async({page}) => {
                const newTab = new PageManager(page)
                const clientPage = newTab.Client
                const jobPage = newTab.Job
                const i = 0
                
                await test.step('Select Method', async() =>{
                    await jobPage.selectMethod(method)
                })   
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
                await test.step('Verify default value for Proceeding type', async() => {
                    await clientPage.verifyDefaultvalues('proceedingType', nextGenConfig.proceedinfTypeDefault)
                })
                await test.step('Select Location type', async() => {
                    await jobPage.selectLocationType(locType, 'locationClientName')
                }) 
                await test.step('Search and select Timezone', async() =>{
                    await jobPage.selectTimezone(clientData[i].timezone)
                })
                await test.step('Select Proceeding date', async() =>{
                    await jobPage.selectDate('Proceeding Date *', clientData[i].proceedingDate)
                    
                })
                await test.step('Select proceeding Start time', async() =>{
                    await jobPage.selectProceedingTime('Start time *', clientData[i].startProceedingTime)
                    await jobPage.endTimeCheck.check()
                })
                await test.step('Enter number of atendees', async() =>{
                    await jobPage.enterNumberAttendees(clientData[i].numberOfAtendees)
                })
                await test.step('Verify default value for Partner Services', async() =>{
                    await jobPage.verifyDefaultValuePartnerService()
                })
                await test.step('Verify defaul value for Delivery type and Delivery Days', async() =>{
                    await jobPage.verifyDefaultvalues('deliveryType', nextGenConfig.deliveryTypeDefaulValue)
                    await jobPage.verifydefaultValueDeliveyDays()
                })
                await test.step('Verify Due date value', async()=>{
                    await jobPage.selectDate('Due Date *', clientData[i].dueDate)
                })
                await test.step('Publish job', async() => {
                    await jobPage.publishJob()
                })
            })
          }
    }
})


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
    await test.step('Go to extractions page with job number', async() => {
        await poManager.loginPage.goToJob(nextGenConfig.job)
    })
    
})

test.describe('Search and select fields related to Client and Cases', () =>{

    test('Search and select valid Client Name, Office and Division', async({page}) => {
        const newTab = new PageManager(page)
        const clientPage = newTab.Client
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
    })


    test('Select  Caller and Attorney when Caller does not have the role of attorney', async({page}) => {
        const newTab = new PageManager(page)
        const clientPage = newTab.Client
        const i = 0

        await test.step('Search and select Client Name', async() =>{
            await clientPage.searchField('clientName', clientData[i].clientName)
        })
        await test.step('Search and select Client Office', async() =>{
            await clientPage.searchField('clientOffice', clientData[i].clientAddress)
        })
        await test.step('Search and select a Caller', async() =>{
            await clientPage.searchField('caller', clientData[i].caller)
        })
        await test.step('Search and select an Attorney', async() =>{
            await clientPage.searchField('attorney', clientData[i].attorney)
        }) 
        
    })

    test('Select  Plaintiff and Defendant', async({page}) => {
    
        const newTab = new PageManager(page)
        const clientPage = newTab.Client
        const casePage = newTab.Case
        const i = 1

        await test.step('Search and select Client Name', async() =>{
            await clientPage.searchField('clientName', clientData[i].clientName)
        })
        await test.step('Search and select Client Office', async() =>{
            await clientPage.searchField('clientOffice', clientData[i].clientAddress)
        })
        await test.step('Search ans select Plaintiff', async() =>{
            await clientPage.searchField('plaintiff', clientData[i].plaintiff)
        })
        await test.step('Search ans select Defendant', async() =>{
            await clientPage.searchField('defendant', clientData[i].defendant)
        })
    })

    test.skip('Select  Case number and case name', async({page}) => {
        const poManager = new PageManager(page)
        const newTab = await poManager.LoginPage.goToJobTask(nextGenConfig.job)
        const newTabjob = new PageManager(newTab)
        const clientPage = newTabjob.Client
        const casePage = newTabjob.Case
  
        await clientPage.searchClientName(nextGenConfig.clientName)
        await clientPage.searchClientOffice(nextGenConfig.clientAddress)
        await casePage.searchCaseNbr(nextGenConfig.caseNbr)
        await casePage.searchCaseName(nextGenConfig.caseName)
        await casePage.searchPlaintiff()
        await casePage.searchDefendant()
    })
})


import { test } from '@playwright/test';
import { loginService } from '../services/loginService';
import { JobService } from '../services/jobService';
import { PartnerInfoService } from '../services/partnerInfoService';
import { LoginPage } from '../pages/LoginPage.js';
import { AssignPartnerPage } from '../pages/assignement/AssignPartnerPage.js';
import JobClass from '../utility/jobClass'
import PartnerInfoClass from '../utility/partnerInfoClass.js'
import * as utils from '../utility/utils.js';

let accessToken;
let jobService;
let partnerInfoService;
let jobId;

test('Create job using GDS', async ({ page }) => {
    jobService = new JobService();
    accessToken = await loginService();
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const formattedDate = today.toISOString().split('T')[0];
    console.log(formattedDate)
    const job = new JobClass({
        caseId: 301515,
        defendant: "",
        plaintiff: "",
        proceedingTypeId: 5,
        thirdPartyId: 123914,
        divisionId: 50,
        deliveryDays: 0,
        timeZoneId: 7,
        deliveryMethod: "Daily",
        depositionDate: formattedDate + "T07:00:00.000-04:00",
        depositionEnd: formattedDate + "T16:00:00.000-04:00",
        locationId: null,
        locationTypeId: 1,
        locationNotes: "",
        locationAddress1: "1000 Virginia Center Pkwy",
        locationAddress2: "",
        locationCity: "New York",
        locationName: "The Virginia Crossing Hotel and Conference Center",
        locationState: "VA",
        locationZip: "23059",
        locationContactPhone: "",
        locationContact: "",
        hasDigitalReporter: false,
        hasTranscriber: false,
        hasCourtReporter: false,
        hasInterpreter: true,
        hasVideographer: true,
        notes: "",
        numberOfAttorneys: "2",
        numberOfWitnesses: "1",
        attorneyContactId: 1079987,
        callerContactId: 1080009,
        clientAddressId: 427947,
        clientId: 268252,
    });
    jobId = await jobService.createNewJob(accessToken, job.generateQuery());
});

test('Get Partner Information In GDS', async ({ page }) => {
    partnerInfoService = new PartnerInfoService();
    
    let allJobs
    await test.step('Get job`s list', async() => {
        const loginPage = new LoginPage(page);
        await loginPage.login();
        
        await utils.waitGridToLoad(page);
        const assignPartnerPage = new AssignPartnerPage(page);
        allJobs = await assignPartnerPage.jobNumber.allInnerTexts();
    })
    
    await test.step('Logging into GDS', async() => {
        accessToken = await loginService();
    })

    await test.step('Getting the info', async() => {
        const partner = new PartnerInfoClass({
            jobId: allJobs[1],
            serviceTypeIds: 1,
            VPZIds: 936
        });
    
        const partnerInfo = await partnerInfoService.getPartnerAvailability(accessToken, partner.generateQuery());
        console.log(partnerInfo);
    })
});
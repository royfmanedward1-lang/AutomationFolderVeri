const { env } = process;

module.exports = {
    url: env.url || decodeURI('https://scheduling-qa.vis.veritext.com/login'),
    urlNewjob: decodeURI('https://scheduling-qa.vis.veritext.com/scheduling/newjob'),
    urlExt: decodeURI('https://scheduling-qa.vis.veritext.com/scheduling/'),
    user_name: env.user_name || '18C160060BFB28B5336D7424AB1A4BE11822B572F6BF59641F',
    password: env.password || '630B04070B4FA62CC7A42699C5DE226FA958A2709A53284F3C',
    job: '6782748',   // A new job should be created to be used after is published  
    proceedinfTypeDefault: 'Deposition',
    deliveryTypeDefaulValue: 'Normal',
    deliveryDaysDefaulValue: '10',
    deliveryDaysExpedited: '5',
    deliveryDaysDaily: '1',
    defaultValuePartnerService: 'Steno Reporting',
    partnerServices: ['Digital Reporting', 'Videography', 'Transcript', 'Interpreting'],
    methods: ['Phone','Email','MyVeritext','MyVeritext Snap','Mobile'],
    deliveryTypes:['Normal','Expedited','Daily','No Transcript Required','Appearance Only','Tracking Not Required','None'],
    locationTypes: ['Veritext','Client','Remote','Other','TBD'],
    similarJobColumnsSet1: ['Job ID', 'Scheduled Date', 'Proceeding Date', 'Proceeding Time', 'Job Status', 'Caller',
    'Division', 'Child Division', 'Witness(es)', 'Location Type', 'Location State', 'Location City'],
    similarJobColumnsSet2: ['Attorney/Lawyer', 'Case Name', 'Case Number', 'Plaintiff', 'Defendant'],
    publishSuccesfulText: 'Publishing has updated the job status to “Scheduled”. View the job by searching for the job ID',
    country:'US',
    state:'CH',
    runHeadless: false,
    browser: env.BROWSER || 'chrome', // chrome, firefox, webkit
};

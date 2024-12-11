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
    defaultValuePartnerService: 'Steno Reporting',
    locationTypes: ['Veritext','Client','Remote','Other','TBD'],
    publishSuccesfulText: 'Publishing has updated the job status to “Scheduled”. View the job by searching for the job ID',
    country:'US',
    state:'CH',
    runHeadless: false,
    browser: env.BROWSER || 'chrome', // chrome, firefox, webkit
};

# Test-automation-modules

Hey!

This is the first iteration to NextGen Automated Testing Project, welcome!
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`QA_USERNAME='YOUR USERNAME'`
`QA_PASSWORD='YOUR PASSWORD'`
`STAGING_USERNAME='YOUR USERNAME'`
`STAGING_PASSWORD='YOUR PASSWORD'`
`QA_URL='https://vendor-assigner-qa.vis.veritext.com/login'`
`STAGING_URL='https://vendor-assigner-staging.vis.veritext.com/login'`
`TEST_ENV='QA'`
`START_DATE='05/29/2024'`
`END_DATE='05/30/2024'`


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project/vendor-assigner
```

For Vendor Assigner, go to its folder
```bash
  cd vendor-assigner
```

Install dependencies

```bash
  npm install
```

If asked, install playwright

```bash
  npx playwright install
```
## Running Tests

To run tests, run the following command

Run on QA
```bash
  npm run test-qa
```

Run on Staging
```bash
  npm run test-stag
```
Run with --headed option (to see windows opening) [QA env]

```bash
  npm test
```

## Support

This test might fail if there isn't any job populated that contains a vendor assigned to it, so manually go to Nextgen and populate it if needed.

It also might fail for some other cases, it might rarely detect that an object is set when it isn't for example. That's being looked at.

Happy testing! 
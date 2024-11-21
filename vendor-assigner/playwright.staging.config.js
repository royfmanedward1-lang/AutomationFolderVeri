import defineConfig from "./playwright.config"

const stagConfig = {
    ...defineConfig,
}

if (stagConfig.use) {
    stagConfig.use.baseURL = "https://vendor-assigner-staging.vis.veritext.com/"
    process.env.TEST_ENV = 'STAGING'
}

export default stagConfig
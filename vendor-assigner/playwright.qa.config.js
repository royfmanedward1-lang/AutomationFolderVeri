import defineConfig from "./playwright.config"

const qaConfig = {
    ...defineConfig,
}

if (qaConfig.use) {
    qaConfig.use.baseURL = "https://vendor-assigner-qa.vis.veritext.com/"
    process.env.TEST_ENV = 'QA'
}

export default qaConfig
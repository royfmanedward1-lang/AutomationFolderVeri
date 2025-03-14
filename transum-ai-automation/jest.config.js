module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/testConfig.ts'],
  reporters: [
    'default',

    ['jest-html-reporter', {
      pageTitle: "Test Report",
      outputPath: "./reports/test-report.html",
      includeFailureMsg: true,
      includeSuiteFailure: true,
      includeConsoleLog: true
    }],
    ['<rootDir>/customReporter.js', {}]
    
  ]
};
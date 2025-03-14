# Document Analysis Automation

A TypeScript/Node.js project for analyzing and validating document metadata in DOCX and JSON files, with a focus on transcript processing and reporting. This automation suite was created for the Transum (Smart Summaries - AI) internal use, but could be useful for other projects inside Veritext.

## Overview

This project provides an automated testing framework for document validation, specifically designed for analyzing transcript files. It processes DOCX and JSON files, extracting and validating metadata, identifying document types, and generating comprehensive HTML reports with statistical analysis.

## Features

- **Transcript Type Detection**: Identifies and validates different transcript types (regular, ASR, rough draft)
- **Smart Summary Validation**: Ensures proper formatting and content in smart summaries
- **JSON Metadata Analysis**: Extracts and analyzes metadata from accompanying JSON files
- **Proceeding Type Classification**: Identifies and categorizes proceeding documents
- **Customized HTML Reporting**: Generates clean, well-formatted test reports with statistical breakdowns
- **Post-processing of Reports**: Enhances test reports with additional styling and organization

## Project Structure

```
.
├── customReporter.js             # Custom Jest reporter for formatting console output
├── jest-html-reporter.config.json # Configuration for HTML reporter
├── jest.config.js               # Jest configuration
├── package-lock.json
├── package.json                 # Project dependencies and scripts
├── post-process-html.js         # Script to enhance HTML reports after generation
├── reports/                     # Directory for generated reports
│   └── test-report.html
├── src/
│   ├── readDocx.ts              # Utility for reading DOCX files
│   ├── testConfig.ts            # Shared configuration for tests
│   └── __tests__/               # Test files
│       ├── invalidSmartSummary.test.ts  # Tests for validating smart summaries
│       ├── jsonMetadata.test.ts         # Tests for analyzing JSON metadata
│       ├── proceedings.test.ts          # Tests for identifying proceeding types
│       └── transcriptType.test.ts       # Tests for identifying transcript types
└── tsconfig.json                # TypeScript configuration
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Configuration

Update the `testConfig.ts` file to point to your document directory:

```typescript
export const testConfig = {
  directoryPath: 'path/to/your/documents'
};
```

## Usage

### Running Tests

Run all tests:

```bash
npm test
```

Run tests with HTML report generation:

```bash
npm run test:report
```

### Test Reports

After running the tests with report generation, the HTML report will be available at:

```
./reports/test-report.html
```

This report contains:
- Test results for each test file
- Statistical breakdowns of document analysis
- Formatted console output showing document statistics
- Clean visualization of metadata counts

## Test Categories

### Invalid Smart Summary Detection

Scans DOCX files to verify they contain valid smart summary content. Reports on valid files, invalid files, and files with read errors.

### JSON Metadata Analysis

Analyzes metadata in JSON files, counting occurrences of different proceeding types, litigation types, and transcript types.

### Deposition Document Verification

Identifies deposition documents and provides statistics on document types found in the directory.

### Transcript Type Verification

Categorizes transcripts into regular, ASR (Automated Speech Recognition), or rough draft types based on content markers.

## Dependencies

- **TypeScript**: Programming language
- **Jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **jest-html-reporter**: HTML report generation for Jest
- **mammoth**: DOCX file parsing library
- **docx**: Library for working with DOCX documents
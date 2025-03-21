import { readdirSync } from 'fs';
import { readDocx } from '../readDocx';
import { join } from 'path';
import { testConfig } from '../testConfig';

// Use the shared configuration
const { directoryPath } = testConfig;

describe('Invalid Smart Summary Detection', () => {
  let totalFiles = 0;
  let validFiles = 0;
  let invalidFiles = 0;
  const errorFiles: string[] = [];
  
  beforeAll(async () => {
    // Filter out temporary files (starting with ~$)
    const files = readdirSync(directoryPath)
      .filter(file => file.endsWith('.docx') && !file.startsWith('~$'));
    
    // Log all files found for debugging
    console.log("All docx files found:", files);
    
    totalFiles = files.length;
    console.log(`Found ${totalFiles} .docx files`);
    
    for (const file of files) {
      const filePath = join(directoryPath, file);
      try {
        const content = await readDocx(filePath);
        
        // Check if file contains valid smart summary content
        if (content.some(line => 
            line.includes('SMART SUMMARY') || 
            line.includes('ASR SMART SUMMARY') || 
            line.includes('ROUGH DRAFT SMART SUMMARY'))) {
          validFiles++;
        } else {
          invalidFiles++;
          console.log(`Invalid file detected: ${file}`);
        }
      } catch (error) {
        console.error(`Error reading file ${file}: ${error}`);
        errorFiles.push(file);
      }
    }
  }, 60000);
  
  test('should find a reasonable number of files', () => {
    console.log(`Total files found: ${totalFiles}`);
    console.log(`Valid files: ${validFiles}`);
    console.log(`Invalid files: ${invalidFiles}`);
    console.log(`Files with read errors: ${errorFiles.length}`);
    
    expect(totalFiles).toBeGreaterThan(0);
  });
  
  test('should have few or no files with read errors', () => {
    if (errorFiles.length > 0) {
      console.log(`Files that couldn't be read:`);
      errorFiles.forEach(file => console.log(`- ${file}`));
    }
    
    const percentageInvalid = (invalidFiles / totalFiles) * 100;
    console.log(`Percentage of invalid files: ${percentageInvalid.toFixed(2)}%`);
    
    expect(errorFiles.length).toBeLessThan(Math.ceil(totalFiles * 0.1));
  });
  
  test('should report summary of processed files', () => {
    console.log(`Processed files breakdown:
      - Valid: ${validFiles}
      - Invalid: ${invalidFiles}
      - Errors: ${errorFiles.length}
      - Total processed: ${validFiles + invalidFiles + errorFiles.length}
      - Total files found: ${totalFiles}`);
    
    expect(validFiles + invalidFiles + errorFiles.length).toBe(totalFiles);
  });
});
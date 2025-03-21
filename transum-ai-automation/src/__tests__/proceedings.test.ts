import { readdirSync } from 'fs';
import { readDocx } from '../readDocx';
import { join } from 'path';
import { testConfig } from '../testConfig';

const { directoryPath } = testConfig;
const depositionIdentifier = 'DEPOSITION TRANSCRIPT SUMMARY';

describe('Deposition Document Verification', () => {
  let totalFiles = 0;
  let depositionFiles = 0;
  const nonDepositionFiles: string[] = [];
  const errorFiles: string[] = [];

  beforeAll(async () => {
    const files = readdirSync(directoryPath).filter(file => file.endsWith('.docx'));
    totalFiles = files.length;
    console.log(`Found ${totalFiles} .docx files`);

    for (const file of files) {
      const filePath = join(directoryPath, file);
      try {
        const content = await readDocx(filePath);
        if (content.some(line => line.includes(depositionIdentifier))) {
          depositionFiles++;
          console.log(`Deposition file found: ${file}`);
        } else {
          nonDepositionFiles.push(file);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        errorFiles.push(file);
      }
    }
  }, 120000);

  test('Verify presence of deposition files', () => {
    console.log(`\nDeposition files found: ${depositionFiles}`);
    expect(depositionFiles).toBeGreaterThan(0);
  });

  test('Verify all files processed', () => {
    const processedFiles = depositionFiles + nonDepositionFiles.length + errorFiles.length;
    console.log(`Total files processed: ${processedFiles}`);
    expect(processedFiles).toBe(totalFiles);
  });

  test('Report on non-deposition and error files', () => {
    console.log(`\nNon-deposition files: ${nonDepositionFiles.length}`);
    if (nonDepositionFiles.length > 0) {
      console.log("Files without deposition identifier:");
      nonDepositionFiles.forEach(file => console.log(`- ${file}`));
    }

    console.log(`\nError files: ${errorFiles.length}`);
    if (errorFiles.length > 0) {
      console.log("Files with errors:");
      errorFiles.forEach(file => console.log(`- ${file}`));
    }
    expect(errorFiles.length).toBe(0);
  });

  test('Provide summary of file processing', () => {
    console.log('\nSummary:');
    console.log(`Total files: ${totalFiles}`);
    console.log(`Deposition files: ${depositionFiles}`);
    console.log(`Non-deposition files: ${nonDepositionFiles.length}`);
    console.log(`Error files: ${errorFiles.length}`);
    
    const percentDeposition = (depositionFiles / totalFiles) * 100;
    console.log(`Percentage of deposition files: ${percentDeposition.toFixed(2)}%`);

    // This test will always pass, it's just for reporting purposes
    expect(true).toBe(true);
  });
});
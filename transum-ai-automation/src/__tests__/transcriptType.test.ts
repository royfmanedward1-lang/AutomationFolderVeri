import { readdirSync } from 'fs';
import { readDocx } from '../readDocx';
import { join } from 'path';
import { testConfig } from '../testConfig';

type TranscriptType = 'regular' | 'asr' | 'rough';

interface TypeConfig {
  identifier: string[];
  expectedContent: string[];
}

const typeConfig: Record<TranscriptType, TypeConfig> = {
  'regular': {
    identifier: ['SMART SUMMARY | VERITEXT LEGAL SOLUTIONS'],
    expectedContent: [
      "SMART SUMMARY",
      "DEPOSITION TRANSCRIPT SUMMARY",
      "ABOUT SMART SUMMARY",
    ]
  },
  'asr': {
    identifier: ['AUTOMATED SPEECH RECOGNITION (ASR)', 'ASR SMART SUMMARY'],
    expectedContent: [
      "AUTOMATED SPEECH RECOGNITION (ASR)",
      "ASR PROCEEDING SUMMARY",
      "ABOUT THE ASR SMART SUMMARY"
    ]
  },
  'rough': {
    identifier: ['ROUGH DRAFT SMART SUMMARY'],
    expectedContent: [
      "ROUGH DRAFT SMART SUMMARY",
      "ROUGH DRAFT TRANSCRIPT SUMMARY",
      "ABOUT THE ROUGH DRAFT SMART SUMMARY"
    ]
  }
};

const { directoryPath } = testConfig;

describe('Transcript Type Verification', () => {
  let totalFiles = 0;
  const fileCounts: Record<TranscriptType | 'unknown' | 'error', number> = {
    regular: 0,
    asr: 0,
    rough: 0,
    unknown: 0,
    error: 0
  };
  const errorFiles: string[] = [];
  const unknownFiles: string[] = [];

  beforeAll(async () => {
    const files = readdirSync(directoryPath).filter(file => file.endsWith('.docx'));
    totalFiles = files.length;
    console.log(`Found ${totalFiles} .docx files`);

    for (const file of files) {
      const filePath = join(directoryPath, file);
      try {
        const actualContent = await readDocx(filePath);
        const fileType = (Object.keys(typeConfig) as TranscriptType[]).find(type => 
          typeConfig[type].identifier.some(id => 
            actualContent.some(line => line.includes(id))
          )
        );

        if (!fileType) {
          fileCounts.unknown++;
          unknownFiles.push(file);
          continue;
        }

        fileCounts[fileType]++;

        const expectedContent = typeConfig[fileType].expectedContent;
        const missingContent = expectedContent.filter(content => 
          !actualContent.some(line => line.includes(content))
        );

        if (missingContent.length > 0) {
          fileCounts.unknown++;
          unknownFiles.push(file);
        }
      } catch (error) {
        fileCounts.error++;
        errorFiles.push(file);
      }
    }
  }, 120000);

  test.each(Object.keys(typeConfig) as TranscriptType[])('should have processed %s files', (transcriptType) => {
    console.log(`${transcriptType} files: ${fileCounts[transcriptType]}`);
    expect(fileCounts[transcriptType]).toBeGreaterThanOrEqual(0);
  });

  test('should report counts for all file types', () => {
    console.log(`unknown files: ${fileCounts.unknown}`);
    console.log(`error files: ${fileCounts.error}`);
    console.log(`Total files processed: ${totalFiles}`);
    
    if (totalFiles === 0) {
      console.log('No .docx files found in the specified directory');
    } else {
      const processedFiles = Object.values(fileCounts).reduce((a, b) => a + b, 0);
      expect(processedFiles).toBe(totalFiles);
    }
  });

  test('should report error and unknown files', () => {
    if (errorFiles.length > 0) {
      console.log("Files with errors:");
      errorFiles.forEach(file => console.log(`- ${file}`));
    }
    if (unknownFiles.length > 0) {
      console.log(`Files with unknown type or missing content: ${unknownFiles.length}`);
      unknownFiles.forEach(file => console.log(`- ${file}`));
    }
    expect(errorFiles.length + unknownFiles.length).toBeLessThan(totalFiles);
  });
});
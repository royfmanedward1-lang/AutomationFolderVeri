import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { testConfig } from '../testConfig';

interface MetadataCounts {
  ProceedingType: Record<string, number>;
  LitigationType: Record<string, number>;
  TranscriptType: Record<string, number>;
  MissingTranscriptType: number;
}

function readJsonMetadata(filePath: string): any {
  try {
    const jsonContent = readFileSync(filePath, 'utf8');
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

function updateCounts(counts: MetadataCounts, metadata: any) {
  const fieldsToCount: (keyof Omit<MetadataCounts, 'MissingTranscriptType'>)[] = ['ProceedingType', 'LitigationType', 'TranscriptType'];
  
  fieldsToCount.forEach(field => {
    if (metadata[field] && typeof metadata[field] === 'string') {
      const value = metadata[field] as string;
      counts[field] = counts[field] || {};
      (counts[field] as Record<string, number>)[value] = ((counts[field] as Record<string, number>)[value] || 0) + 1;
    } else if (field === 'TranscriptType') {
      counts.MissingTranscriptType++;
    }
  });
}

describe('JSON Metadata Analysis', () => {
  let totalFiles = 0;
  let validFiles = 0;
  let invalidFiles = 0;
  let errorFiles: string[] = [];
  let metadataCounts: MetadataCounts = {
    ProceedingType: {},
    LitigationType: {},
    TranscriptType: {},
    MissingTranscriptType: 0
  };

  beforeAll(() => {
    const files = readdirSync(testConfig.directoryPath).filter(file => file.endsWith('.json'));
    totalFiles = files.length;
    console.log(`Found ${totalFiles} .json files in ${testConfig.directoryPath}`);

    files.forEach(file => {
      const filePath = join(testConfig.directoryPath, file);
      const metadata = readJsonMetadata(filePath);
      
      if (metadata) {
        updateCounts(metadataCounts, metadata);
        if (metadata.ProceedingType && metadata.LitigationType) {
          validFiles++;
        } else {
          invalidFiles++;
        }
      } else {
        errorFiles.push(file);
      }
    });
  }, 120000);

  test('should report file processing breakdown', () => {
    console.log('Processed files breakdown:');
    console.log(`- Valid: ${validFiles}`);
    console.log(`- Invalid: ${invalidFiles}`);
    console.log(`- Errors: ${errorFiles.length}`);
    console.log(`- Total processed: ${validFiles + invalidFiles + errorFiles.length}`);
    console.log(`- Total files found: ${totalFiles}`);
    
    expect(validFiles + invalidFiles + errorFiles.length).toBe(totalFiles);
  });

  test('should report counts for specific metadata fields', () => {
    console.log('Metadata Counts:');
    Object.entries(metadataCounts).forEach(([field, counts]) => {
      if (field === 'MissingTranscriptType') {
        console.log(`\n${field}: ${counts}`);
      } else {
        console.log(`\n${field}:`);
        Object.entries(counts as Record<string, number>)
          .sort(([, a], [, b]) => b - a)
          .forEach(([value, count]) => {
            console.log(`  ${value}: ${count}`);
          });
      }
    });
    expect(Object.keys(metadataCounts)).toEqual(['ProceedingType', 'LitigationType', 'TranscriptType', 'MissingTranscriptType']);
  });

  test('should have no error files', () => {
    if (errorFiles.length > 0) {
      console.log("Files with errors:");
      errorFiles.forEach(file => console.log(`- ${file}`));
    }
    expect(errorFiles.length).toBe(0);
  });
});
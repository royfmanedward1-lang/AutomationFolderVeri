import * as mammoth from "mammoth";

export async function readDocx(filePath: string): Promise<string[]> {
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;
  return text.split('\n').filter(line => line.trim() !== '');
}
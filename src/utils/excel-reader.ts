import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export async function readExcelAsJson(filePath?: string){
  const fp = filePath || path.join(process.cwd(), 'src', 'data', 'api-test-data.xlsx');
  if(!fs.existsSync(fp)){
    throw new Error(`Excel file not found: ${fp}. Run scripts/generate-api-data.js to create a sample.`);
  }
  const workbook = xlsx.readFile(fp);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  return json as Array<Record<string, any>>;
}

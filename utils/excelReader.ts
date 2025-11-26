import * as XLSX from 'xlsx';
import * as path from 'path';

/**
 * Utility class to read test data from Excel files
 */
export class ExcelReader {
    private workbook: XLSX.WorkBook;
    private worksheet: XLSX.WorkSheet;

    /**
     * Load Excel file
     * @param filePath - Path to the Excel file
     * @param sheetName - Name of the sheet to read (default: first sheet)
     */
    constructor(filePath: string, sheetName?: string) {
        const fullPath = path.resolve(filePath);
        this.workbook = XLSX.readFile(fullPath);
        
        const sheet = sheetName || this.workbook.SheetNames[0];
        this.worksheet = this.workbook.Sheets[sheet];
    }

    /**
     * Get all data from the sheet as array of objects
     * @returns Array of objects where keys are column headers
     */
    getAllData(): any[] {
        return XLSX.utils.sheet_to_json(this.worksheet);
    }

    /**
     * Get data from a specific row
     * @param rowIndex - Row index (0-based, excluding header)
     * @returns Object with data from the row
     */
    getRowData(rowIndex: number): any {
        const data = this.getAllData();
        return data[rowIndex];
    }

    /**
     * Get credentials (username and password) from Excel
     * @param rowIndex - Row index to read from (default: 0)
     * @returns Object with username and password
     */
    getCredentials(rowIndex: number = 0): { username: string; password: string } {
        const data = this.getRowData(rowIndex);
        return {
            username: data.username || data.Username || '',
            password: data.password || data.Password || ''
        };
    }

    /**
     * Get base URL from Excel
     * @param rowIndex - Row index to read from (default: 0)
     * @returns Base URL string
     */
    getBaseUrl(rowIndex: number = 0): string {
        const data = this.getRowData(rowIndex);
        return data.baseUrl || data.BaseUrl || data.base_url || '';
    }
}

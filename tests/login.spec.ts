import { test, expect } from '../fixtures/pageFixtures';
import { ExcelReader } from '../utils/excelReader';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Excel reader
const excelReader = new ExcelReader('./testdata/credentials.xlsx', 'Credentials');

test.describe('Sauce Demo Login Tests', () => {

    test.beforeEach(async ({ page }) => {
        const baseUrl = excelReader.getBaseUrl(0);
        await page.goto(baseUrl || process.env.BASE_URL || 'https://www.saucedemo.com/');
    });

    test('should successfully login with valid credentials', async ({ page, loginPage }) => {
        // Get credentials from Excel
        const credentials = excelReader.getCredentials(0);
        
        // Enter username and password
        await loginPage.login(credentials.username, credentials.password);

        // Verify successful login by checking URL
        await expect(page).toHaveURL(/.*inventory.html/);
        
        // Verify we're on the products page
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBe(true);

        // Additional verification - check if products page elements are visible
        await expect(page.locator('.inventory_list')).toBeVisible();
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('should display error with invalid credentials', async ({ page, loginPage }) => {
        // Try to login with invalid credentials
        await loginPage.login('invalid_user', 'wrong_password');

        // Verify error message is displayed
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Epic sadface');
        expect(errorMessage).toContain('do not match');
    });

    test('should display error when username is empty', async ({ page, loginPage }) => {
        // Try to login without username
        const credentials = excelReader.getCredentials(0);
        await loginPage.login('', credentials.password);

        // Verify error message
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username is required');
    });

    test('should display error when password is empty', async ({ page, loginPage }) => {
        // Try to login without password
        const credentials = excelReader.getCredentials(0);
        await loginPage.login(credentials.username, '');

        // Verify error message
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Password is required');
    });
});

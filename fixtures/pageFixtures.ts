import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { ExcelReader } from '../utils/excelReader';
import * as dotenv from 'dotenv';

// Load environment variables as fallback
dotenv.config();

// Initialize Excel reader
const excelReader = new ExcelReader('./testdata/credentials.xlsx', 'Credentials');

/**
 * Custom fixtures for page objects
 * Provides pre-initialized page objects for tests
 */
type PageFixtures = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    shoppingCartPage: ShoppingCartPage;
    authenticatedPage: void;
};

/**
 * Extend base test with custom fixtures
 */
export const test = base.extend<PageFixtures>({
    /**
     * LoginPage fixture
     * Automatically creates a LoginPage instance for each test
     */
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    /**
     * ProductsPage fixture
     * Automatically creates a ProductsPage instance for each test
     */
    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },

    /**
     * ShoppingCartPage fixture
     * Automatically creates a ShoppingCartPage instance for each test
     */
    shoppingCartPage: async ({ page }, use) => {
        const shoppingCartPage = new ShoppingCartPage(page);
        await use(shoppingCartPage);
    },

    /**
     * authenticatedPage fixture
     * Automatically logs in before the test starts
     * Use this fixture when you need to start tests from an authenticated state
     */
    authenticatedPage: async ({ page, loginPage }, use) => {
        // Get credentials from Excel file
        const credentials = excelReader.getCredentials(0);
        const baseUrl = excelReader.getBaseUrl(0);
        
        // Navigate to login page
        await page.goto(baseUrl || process.env.BASE_URL || 'https://www.saucedemo.com/');
        
        // Perform login with credentials from Excel
        await loginPage.login(credentials.username, credentials.password);
        
        // Wait for navigation to complete
        await page.waitForURL('**/inventory.html');
        
        await use();
    },
});

export { expect } from '@playwright/test';

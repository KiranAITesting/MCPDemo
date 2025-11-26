import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Sauce Demo Login Page
 * URL: https://www.saucedemo.com/
 */
export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    /**
     * Navigate to the Sauce Demo login page
     */
    async gotoLogin() {
        await this.goto('https://www.saucedemo.com/');
    }

    /**
     * Perform login with provided credentials
     * @param username - User's username
     * @param password - User's password
     */
    async login(username: string, password: string) {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);
    }

    /**
     * Get the error message text if login fails
     * @returns Error message text
     */
    async getErrorMessage(): Promise<string> {
        return await this.getText(this.errorMessage);
    }

    /**
     * Check if user is successfully logged in
     * @returns true if logged in (inventory page is visible)
     */
    async isLoggedIn(): Promise<boolean> {
        await this.waitForNavigation('**/inventory.html');
        return this.urlContains('inventory.html');
    }
}

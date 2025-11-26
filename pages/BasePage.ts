import { Page, Locator } from '@playwright/test';

/**
 * Base Page class containing common methods and properties
 * All page objects should extend this class
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     * @param url - The URL to navigate to
     */
    async goto(url: string) {
        await this.page.goto(url);
    }

    /**
     * Wait for page to load completely
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Get the current page URL
     * @returns Current URL
     */
    getUrl(): string {
        return this.page.url();
    }

    /**
     * Get the page title
     * @returns Page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Wait for an element to be visible
     * @param locator - The locator to wait for
     * @param timeout - Optional timeout in milliseconds
     */
    async waitForElement(locator: Locator, timeout: number = 5000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Click on an element
     * @param locator - The locator to click
     */
    async click(locator: Locator) {
        await locator.click();
    }

    /**
     * Fill input field
     * @param locator - The input locator
     * @param text - Text to fill
     */
    async fill(locator: Locator, text: string) {
        await locator.fill(text);
    }

    /**
     * Get text content of an element
     * @param locator - The locator to get text from
     * @returns Text content
     */
    async getText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    /**
     * Check if element is visible
     * @param locator - The locator to check
     * @returns true if visible
     */
    async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    /**
     * Take a screenshot
     * @param name - Screenshot name
     */
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
    }

    /**
     * Wait for navigation to complete
     * @param urlPattern - URL pattern to wait for
     */
    async waitForNavigation(urlPattern: string | RegExp) {
        await this.page.waitForURL(urlPattern);
    }

    /**
     * Reload the current page
     */
    async reload() {
        await this.page.reload();
    }

    /**
     * Go back to previous page
     */
    async goBack() {
        await this.page.goBack();
    }

    /**
     * Check if URL contains specific text
     * @param text - Text to check in URL
     * @returns true if URL contains the text
     */
    urlContains(text: string): boolean {
        return this.page.url().includes(text);
    }
}

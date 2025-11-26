import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Sauce Demo Products Page
 * URL: https://www.saucedemo.com/inventory.html
 */
export class ProductsPage extends BasePage {
    readonly pageTitle: Locator;
    readonly inventoryList: Locator;
    readonly cartIcon: Locator;
    readonly menuButton: Locator;
    readonly productItems: Locator;
    readonly sortDropdown: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('.title');
        this.inventoryList = page.locator('.inventory_list');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.productItems = page.locator('.inventory_item');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
    }

    /**
     * Verify that the user is on the Products page
     * @returns true if on Products page
     */
    async isOnProductsPage(): Promise<boolean> {
        await this.waitForNavigation('**/inventory.html');
        return this.urlContains('inventory.html');
    }

    /**
     * Get the page title text
     * @returns The title text
     */
    async getPageTitle(): Promise<string> {
        return await this.getText(this.pageTitle);
    }

    /**
     * Verify the page heading is "Products"
     * @returns true if heading is "Products"
     */
    async hasProductsHeading(): Promise<boolean> {
        const title = await this.getPageTitle();
        return title === 'Products';
    }

    /**
     * Check if inventory list is visible
     * @returns true if inventory list is visible
     */
    async isInventoryVisible(): Promise<boolean> {
        return await this.isVisible(this.inventoryList);
    }

    /**
     * Get count of products displayed
     * @returns Number of products
     */
    async getProductCount(): Promise<number> {
        return await this.productItems.count();
    }

    /**
     * Add a product to cart by index
     * @param index - Product index (0-based)
     */
    async addProductToCart(index: number) {
        const addToCartButtons = this.page.locator('.btn_inventory');
        await addToCartButtons.nth(index).click();
    }

    /**
     * Add specific product to cart by name
     * @param productName - Name of the product (e.g., "backpack")
     */
    async addProductToCartByName(productName: string) {
        const buttonId = productName.toLowerCase().replace(/\s+/g, '-');
        const addButton = this.page.locator(`[data-test="add-to-cart-sauce-labs-${buttonId}"]`);
        await this.click(addButton);
    }

    /**
     * Click on shopping cart icon
     */
    async clickShoppingCart() {
        await this.click(this.cartIcon);
    }

    /**
     * Select sort option from dropdown
     * @param sortOption - Sort option value (az, za, lohi, hilo)
     */
    async selectSortOption(sortOption: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortDropdown.selectOption(sortOption);
        await this.page.waitForTimeout(500); // Wait for sort to complete
    }

    /**
     * Get all product names in current order
     * @returns Array of product names
     */
    async getProductNames(): Promise<string[]> {
        const names = await this.productNames.allTextContents();
        return names;
    }

    /**
     * Get all product prices in current order
     * @returns Array of product prices as numbers
     */
    async getProductPrices(): Promise<number[]> {
        const priceTexts = await this.productPrices.allTextContents();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    /**
     * Verify products are sorted alphabetically A-Z
     * @returns true if sorted correctly
     */
    async isProductsSortedAtoZ(): Promise<boolean> {
        const names = await this.getProductNames();
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        return JSON.stringify(names) === JSON.stringify(sorted);
    }

    /**
     * Verify products are sorted alphabetically Z-A
     * @returns true if sorted correctly
     */
    async isProductsSortedZtoA(): Promise<boolean> {
        const names = await this.getProductNames();
        const sorted = [...names].sort((a, b) => b.localeCompare(a));
        return JSON.stringify(names) === JSON.stringify(sorted);
    }

    /**
     * Verify products are sorted by price low to high
     * @returns true if sorted correctly
     */
    async isProductsSortedLowToHigh(): Promise<boolean> {
        const prices = await this.getProductPrices();
        const sorted = [...prices].sort((a, b) => a - b);
        return JSON.stringify(prices) === JSON.stringify(sorted);
    }

    /**
     * Verify products are sorted by price high to low
     * @returns true if sorted correctly
     */
    async isProductsSortedHighToLow(): Promise<boolean> {
        const prices = await this.getProductPrices();
        const sorted = [...prices].sort((a, b) => b - a);
        return JSON.stringify(prices) === JSON.stringify(sorted);
    }
}

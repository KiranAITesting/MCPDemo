import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for Sauce Demo Shopping Cart Page
 * URL: https://www.saucedemo.com/cart.html
 */
export class ShoppingCartPage extends BasePage {
    readonly pageTitle: Locator;
    readonly cartItems: Locator;
    readonly cartQuantity: Locator;
    readonly cartDescription: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly removeButtons: Locator;
    readonly cartIcon: Locator;
    readonly itemNames: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.locator('.title');
        this.cartItems = page.locator('.cart_item');
        this.cartQuantity = page.locator('.cart_quantity');
        this.cartDescription = page.locator('.cart_item_label');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.removeButtons = page.locator('[data-test^="remove-"]');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.itemNames = page.locator('.inventory_item_name');
    }

    /**
     * Navigate to shopping cart
     */
    async gotoCart() {
        await this.click(this.cartIcon);
    }

    /**
     * Verify user is on shopping cart page
     * @returns true if on cart page
     */
    async isOnCartPage(): Promise<boolean> {
        await this.waitForNavigation('**/cart.html');
        return this.urlContains('cart.html');
    }

    /**
     * Get the cart page title
     * @returns The page title text
     */
    async getCartPageTitle(): Promise<string> {
        return await this.getText(this.pageTitle);
    }

    /**
     * Verify cart page header is "Your Cart"
     * @returns true if header is "Your Cart"
     */
    async hasYourCartHeader(): Promise<boolean> {
        const title = await this.getCartPageTitle();
        return title === 'Your Cart';
    }

    /**
     * Check if quantity label is visible
     * @returns true if quantity is visible
     */
    async isQuantityVisible(): Promise<boolean> {
        return await this.isVisible(this.cartQuantity.first());
    }

    /**
     * Check if description is visible
     * @returns true if description is visible
     */
    async isDescriptionVisible(): Promise<boolean> {
        return await this.isVisible(this.cartDescription.first());
    }

    /**
     * Check if Continue Shopping button is visible
     * @returns true if button is visible
     */
    async isContinueShoppingVisible(): Promise<boolean> {
        return await this.isVisible(this.continueShoppingButton);
    }

    /**
     * Check if Checkout button is visible
     * @returns true if button is visible
     */
    async isCheckoutButtonVisible(): Promise<boolean> {
        return await this.isVisible(this.checkoutButton);
    }

    /**
     * Check if Remove button is visible
     * @returns true if remove button is visible
     */
    async isRemoveButtonVisible(): Promise<boolean> {
        const count = await this.removeButtons.count();
        return count > 0 && await this.removeButtons.first().isVisible();
    }

    /**
     * Click Continue Shopping button
     */
    async clickContinueShopping() {
        await this.click(this.continueShoppingButton);
    }

    /**
     * Click Checkout button
     */
    async clickCheckout() {
        await this.click(this.checkoutButton);
    }

    /**
     * Click Remove button for first item
     */
    async clickRemove() {
        await this.click(this.removeButtons.first());
    }

    /**
     * Get count of items in cart
     * @returns Number of items
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /**
     * Get names of all items in cart
     * @returns Array of item names
     */
    async getCartItemNames(): Promise<string[]> {
        return await this.itemNames.allTextContents();
    }

    /**
     * Check if specific item is in cart
     * @param itemName - Name of the item
     * @returns true if item is in cart
     */
    async isItemInCart(itemName: string): Promise<boolean> {
        const items = await this.getCartItemNames();
        return items.some(item => item.toLowerCase().includes(itemName.toLowerCase()));
    }
}

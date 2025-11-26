import { test, expect } from '../fixtures/pageFixtures';

test.describe('Shopping Cart Scenarios', () => {

    test('should add Sauce Labs Backpack to cart and navigate to cart page', async ({ page, productsPage, shoppingCartPage, authenticatedPage }) => {
        // Click on Sauce Labs Backpack Add to Cart button
        await productsPage.addProductToCartByName('backpack');

        // Click on cart/shopping icon
        await productsPage.clickShoppingCart();

        // Verify user is on cart page
        const isOnCartPage = await shoppingCartPage.isOnCartPage();
        expect(isOnCartPage).toBe(true);
    });

    test('should validate user is on page with header "Your Cart"', async ({ page, productsPage, shoppingCartPage, authenticatedPage }) => {
        // Add item to cart
        await productsPage.addProductToCartByName('backpack');
        
        // Navigate to cart
        await productsPage.clickShoppingCart();

        // Validate header is "Your Cart"
        const hasYourCartHeader = await shoppingCartPage.hasYourCartHeader();
        expect(hasYourCartHeader).toBe(true);

        // Additional verification
        const pageTitle = await shoppingCartPage.getCartPageTitle();
        expect(pageTitle).toBe('Your Cart');
        await expect(shoppingCartPage.pageTitle).toHaveText('Your Cart');
    });

    test('should validate QTY, Description, Continue Shopping, Checkout, and Remove buttons are visible', async ({ page, productsPage, shoppingCartPage, authenticatedPage }) => {
        // Add item to cart and navigate
        await productsPage.addProductToCartByName('backpack');
        await productsPage.clickShoppingCart();

        // Validate QTY is visible
        const isQtyVisible = await shoppingCartPage.isQuantityVisible();
        expect(isQtyVisible).toBe(true);

        // Validate Description is visible
        const isDescriptionVisible = await shoppingCartPage.isDescriptionVisible();
        expect(isDescriptionVisible).toBe(true);

        // Validate Continue Shopping button is visible
        await expect(shoppingCartPage.continueShoppingButton).toBeVisible();
        const isContinueShoppingVisible = await shoppingCartPage.isContinueShoppingVisible();
        expect(isContinueShoppingVisible).toBe(true);

        // Validate Checkout button is visible
        await expect(shoppingCartPage.checkoutButton).toBeVisible();
        const isCheckoutVisible = await shoppingCartPage.isCheckoutButtonVisible();
        expect(isCheckoutVisible).toBe(true);

        // Validate Remove button is visible
        const isRemoveVisible = await shoppingCartPage.isRemoveButtonVisible();
        expect(isRemoveVisible).toBe(true);
        await expect(shoppingCartPage.removeButtons.first()).toBeVisible();
    });

    test('should navigate back to products page when clicking "Continue Shopping"', async ({ page, productsPage, shoppingCartPage, authenticatedPage }) => {
        // Add item to cart and navigate to cart
        await productsPage.addProductToCartByName('backpack');
        await productsPage.clickShoppingCart();

        // Verify we're on cart page
        await expect(shoppingCartPage.pageTitle).toHaveText('Your Cart');

        // Click Continue Shopping button
        await shoppingCartPage.clickContinueShopping();

        // Verify user is back on products page
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(productsPage.pageTitle).toHaveText('Products');
        
        const isOnProductsPage = await productsPage.isOnProductsPage();
        expect(isOnProductsPage).toBe(true);
    });

    test('should remove item from cart when clicking "Remove" button', async ({ page, productsPage, shoppingCartPage, authenticatedPage }) => {
        // Add item to cart and navigate to cart
        await productsPage.addProductToCartByName('backpack');
        await productsPage.clickShoppingCart();

        // Verify item is in cart
        const itemCount = await shoppingCartPage.getCartItemCount();
        expect(itemCount).toBe(1);

        // Click Remove button
        await shoppingCartPage.clickRemove();

        // Verify item is removed
        const itemCountAfterRemove = await shoppingCartPage.getCartItemCount();
        expect(itemCountAfterRemove).toBe(0);

        // Verify cart is empty
        await expect(shoppingCartPage.cartItems).toHaveCount(0);
    });

    test('should navigate to "Checkout: Your Information" page when clicking "Checkout"', async ({ page, productsPage, shoppingCartPage, authenticatedPage }) => {
        // Add item to cart and navigate to cart
        await productsPage.addProductToCartByName('backpack');
        await productsPage.clickShoppingCart();

        // Verify we're on cart page with item
        const itemCount = await shoppingCartPage.getCartItemCount();
        expect(itemCount).toBeGreaterThan(0);

        // Click Checkout button
        await shoppingCartPage.clickCheckout();

        // Verify user is on Checkout: Your Information page
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
        
        // Verify page title
        const checkoutTitle = page.locator('.title');
        await expect(checkoutTitle).toHaveText('Checkout: Your Information');
    });
});

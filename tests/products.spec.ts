import { test, expect } from '../fixtures/pageFixtures';

test.describe('Products Page Validation Tests', () => {

    test('should validate user is on Products page with correct heading', async ({ page, productsPage, authenticatedPage }) => {
        // Validate user is on Products page
        const isOnProductsPage = await productsPage.isOnProductsPage();
        expect(isOnProductsPage).toBe(true);

        // Validate page heading is "Products"
        const pageTitle = await productsPage.getPageTitle();
        expect(pageTitle).toBe('Products');

        // Additional validation - verify heading has "Products" text
        const hasProductsHeading = await productsPage.hasProductsHeading();
        expect(hasProductsHeading).toBe(true);

        // Verify products are displayed
        await expect(productsPage.pageTitle).toBeVisible();
        await expect(productsPage.pageTitle).toHaveText('Products');
    });

    test('should verify inventory list is visible', async ({ page, productsPage, authenticatedPage }) => {
        // Verify inventory list is visible
        const isInventoryVisible = await productsPage.isInventoryVisible();
        expect(isInventoryVisible).toBe(true);

        // Verify products are loaded
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
    });

    test('should verify all Products page elements', async ({ page, productsPage, authenticatedPage }) => {
        // Verify all key elements are visible
        await expect(productsPage.pageTitle).toBeVisible();
        await expect(productsPage.inventoryList).toBeVisible();
        await expect(productsPage.cartIcon).toBeVisible();
        await expect(productsPage.menuButton).toBeVisible();

        // Verify URL is correct
        expect(page.url()).toContain('inventory.html');
    });
});

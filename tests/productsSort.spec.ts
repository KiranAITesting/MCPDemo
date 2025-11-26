import { test, expect } from '../fixtures/pageFixtures';

test.describe('Products Sort Validation Tests', () => {

    test('should sort products by Name (A-Z) alphabetically', async ({ page, productsPage, authenticatedPage }) => {
        // Select sort option Name (A-Z)
        await productsPage.selectSortOption('az');

        // Verify products are sorted alphabetically A-Z
        const isSorted = await productsPage.isProductsSortedAtoZ();
        expect(isSorted).toBe(true);

        // Additional verification - get product names and verify order
        const productNames = await productsPage.getProductNames();
        expect(productNames.length).toBeGreaterThan(0);
        
        // Verify first and last items are in correct alphabetical order
        const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
        expect(productNames[0]).toBe(sortedNames[0]);
        expect(productNames[productNames.length - 1]).toBe(sortedNames[sortedNames.length - 1]);
    });

    test('should sort products by Name (Z-A) alphabetically', async ({ page, productsPage, authenticatedPage }) => {
        // Select sort option Name (Z-A)
        await productsPage.selectSortOption('za');

        // Verify products are sorted alphabetically Z-A
        const isSorted = await productsPage.isProductsSortedZtoA();
        expect(isSorted).toBe(true);

        // Additional verification - get product names and verify reverse order
        const productNames = await productsPage.getProductNames();
        expect(productNames.length).toBeGreaterThan(0);
        
        // Verify first and last items are in correct reverse alphabetical order
        const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));
        expect(productNames[0]).toBe(sortedNames[0]);
        expect(productNames[productNames.length - 1]).toBe(sortedNames[sortedNames.length - 1]);
    });

    test('should sort products by Price (Low to High)', async ({ page, productsPage, authenticatedPage }) => {
        // Select sort option Price (Low to High)
        await productsPage.selectSortOption('lohi');

        // Verify products are sorted by price low to high
        const isSorted = await productsPage.isProductsSortedLowToHigh();
        expect(isSorted).toBe(true);

        // Additional verification - get prices and verify order
        const prices = await productsPage.getProductPrices();
        expect(prices.length).toBeGreaterThan(0);
        
        // Verify first price is less than or equal to last price
        expect(prices[0]).toBeLessThanOrEqual(prices[prices.length - 1]);
        
        // Verify each price is less than or equal to the next
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
    });

    test('should sort products by Price (High to Low)', async ({ page, productsPage, authenticatedPage }) => {
        // Select sort option Price (High to Low)
        await productsPage.selectSortOption('hilo');

        // Verify products are sorted by price high to low
        const isSorted = await productsPage.isProductsSortedHighToLow();
        expect(isSorted).toBe(true);

        // Additional verification - get prices and verify order
        const prices = await productsPage.getProductPrices();
        expect(prices.length).toBeGreaterThan(0);
        
        // Verify first price is greater than or equal to last price
        expect(prices[0]).toBeGreaterThanOrEqual(prices[prices.length - 1]);
        
        // Verify each price is greater than or equal to the next
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
        }
    });
});

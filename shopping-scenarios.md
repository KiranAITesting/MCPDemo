# Shopping Cart Test Scenarios

## Overview
This document describes the shopping cart test scenarios for the Sauce Demo application.

## Prerequisites
- User must be logged in with valid credentials
- User must be on the Products page

## Test Scenarios

### Scenario 1: Add Item to Cart and Navigate
**Steps:**
1. Click on "Sauce Labs Backpack" item "Add to Cart" button
2. Click on cart/shopping icon

**Expected Result:**
- User navigates to cart page
- URL contains "cart.html"

---

### Scenario 2: Validate Cart Page Header
**Steps:**
1. Add Sauce Labs Backpack to cart
2. Navigate to cart page

**Expected Result:**
- Page header displays "Your Cart"
- Page title element contains text "Your Cart"

---

### Scenario 3: Validate Cart Page Elements
**Steps:**
1. Add Sauce Labs Backpack to cart
2. Navigate to cart page

**Expected Result:**
All of the following elements are visible:
- QTY (Quantity) label
- Description section
- "Continue Shopping" button
- "Checkout" button
- "Remove" button

---

### Scenario 4: Continue Shopping Navigation
**Steps:**
1. Add Sauce Labs Backpack to cart
2. Navigate to cart page
3. Click "Continue Shopping" button

**Expected Result:**
- User navigates back to Products page
- URL contains "inventory.html"
- Page header displays "Products"

---

### Scenario 5: Remove Item from Cart
**Steps:**
1. Add Sauce Labs Backpack to cart
2. Navigate to cart page
3. Click "Remove" button

**Expected Result:**
- Item is removed from cart
- Cart item count is 0
- Cart displays as empty

---

### Scenario 6: Proceed to Checkout
**Steps:**
1. Add Sauce Labs Backpack to cart
2. Navigate to cart page
3. Click "Checkout" button

**Expected Result:**
- User navigates to checkout page
- URL contains "checkout-step-one.html"
- Page header displays "Checkout: Your Information"

---

## Page Objects Used
- **ProductsPage**: For adding items to cart and navigating
- **ShoppingCartPage**: For cart operations and validations

## Fixtures Used
- **authenticatedPage**: Automatically logs in user before each test

## Test File Location
`tests/shoppingCart.spec.ts`

---

**Last Updated**: November 26, 2025

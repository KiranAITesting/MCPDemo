# MCPServer - Playwright Test Automation Framework

## 📋 Overview
A comprehensive end-to-end test automation framework for the Sauce Demo e-commerce application using Playwright with TypeScript. The framework implements the Page Object Model (POM) design pattern with custom fixtures and reads test data from Excel files.

## 🚀 Features
- **Page Object Model (POM)** - Organized page classes with reusable methods
- **Base Page Class** - Common methods inherited by all page objects
- **Custom Fixtures** - Automatic page initialization and authentication
- **Excel-based Test Data** - Credentials and URLs stored in Excel files
- **Multiple Test Suites** - Login, Products, Sort, and Shopping Cart scenarios
- **Headed Mode by Default** - Visual test execution in Chromium
- **Environment Variables** - Fallback configuration via .env file

## 📁 Project Structure
```
MCPServer/
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Base class with common methods
│   ├── LoginPage.ts           # Login page object
│   ├── ProductsPage.ts        # Products page object
│   └── ShoppingCartPage.ts    # Shopping cart page object
├── tests/                      # Test specifications
│   ├── login.spec.ts          # Login test scenarios
│   ├── products.spec.ts       # Products page validation tests
│   ├── productsSort.spec.ts   # Product sorting tests
│   └── shoppingCart.spec.ts   # Shopping cart scenarios
├── fixtures/                   # Custom test fixtures
│   └── pageFixtures.ts        # Page object fixtures
├── utils/                      # Utility classes
│   └── excelReader.ts         # Excel file reader utility
├── testdata/                   # Test data files
│   └── credentials.xlsx       # User credentials and URLs
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── .env                       # Environment variables (fallback)
```

## 🛠️ Prerequisites
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

## 📦 Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/nk2/Desktop/MCPServer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

## 🔧 Configuration

### Excel Test Data
Credentials are stored in `testdata/credentials.xlsx`:
- **Sheet Name:** Credentials
- **Columns:** username, password, baseUrl

### Environment Variables (Fallback)
Create or update `.env` file:
```env
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
```

### Playwright Config
- **Default Browser:** Chromium (headed mode)
- **Base URL:** https://www.saucedemo.com/
- **Screenshots:** On failure
- **Videos:** Retained on failure

## 🧪 Running Tests

### Run all tests:
```bash
npm test
```

### Run specific test suite:
```bash
# Login tests
npx playwright test tests/login.spec.ts --project=chromium

# Products tests
npx playwright test tests/products.spec.ts --project=chromium

# Sort tests
npx playwright test tests/productsSort.spec.ts --project=chromium

# Shopping cart tests
npx playwright test tests/shoppingCart.spec.ts --project=chromium
```

### Run in headless mode:
```bash
npx playwright test --project=chromium --headed=false
```

### Run with UI mode:
```bash
npm run test:ui
```

### Debug mode:
```bash
npm run test:debug
```

### View test report:
```bash
npm run report
```

## 🔁 Integrate Playwright results with Slack via n8n

This project includes a small helper and an example n8n workflow to post Playwright JSON results to Slack.

1. Generate a JSON test report:

```bash
# run tests and write JSON output
npm run test:json
```

2. Send results to your n8n webhook (set `N8N_WEBHOOK_URL` or pass `--url`):

```bash
# using env var
N8N_WEBHOOK_URL="https://<your-n8n-host>/webhook/playwright-results" npm run send:results

# or pass as arg
npm run send:results -- --url https://<your-n8n-host>/webhook/playwright-results
```

3. Import the included n8n workflow: `.n8n/workflows/playwright-to-slack.json` into your n8n instance.

Workflow summary:
- `Webhook` node: receives the POST from the helper script
- `Format` function node: creates a short summary message
- `Slack` node: posts the summary to a Slack channel (configure credentials in n8n)

Notes:
- The helper script expects the JSON file at `playwright-report/results.json` by default.
- If your Playwright JSON layout differs, you can adjust `scripts/sendResultsToN8n.js`.


## 📊 Test Scenarios

### Login Tests (4 scenarios)
- ✅ Successful login with valid credentials
- ✅ Error message with invalid credentials
- ✅ Error message when username is empty
- ✅ Error message when password is empty

### Products Page Tests (3 scenarios)
- ✅ Validate user is on Products page
- ✅ Verify inventory list is visible
- ✅ Verify all page elements are displayed

### Product Sort Tests (4 scenarios)
- ✅ Sort by Name (A-Z)
- ✅ Sort by Name (Z-A)
- ✅ Sort by Price (Low to High)
- ✅ Sort by Price (High to Low)

### Shopping Cart Tests (6 scenarios)
- ✅ Add item to cart and navigate
- ✅ Validate "Your Cart" header
- ✅ Validate cart page elements (QTY, Description, buttons)
- ✅ Continue Shopping navigation
- ✅ Remove item from cart
- ✅ Proceed to checkout

## 🏗️ Architecture

### Base Page Pattern
All page classes extend `BasePage` which provides common methods:
- Navigation methods
- Element interaction (click, fill, getText)
- Wait utilities
- Screenshot capabilities

### Custom Fixtures
The framework uses custom Playwright fixtures:
- `loginPage` - Auto-initialized LoginPage instance
- `productsPage` - Auto-initialized ProductsPage instance
- `shoppingCartPage` - Auto-initialized ShoppingCartPage instance
- `authenticatedPage` - Automatically logs in before test execution

### Excel Data Management
The `ExcelReader` utility class provides:
- Read credentials from Excel by row index
- Support for multiple test users
- Base URL configuration
- Easy test data maintenance

## 📝 Writing New Tests

### Example: Create a new test
```typescript
import { test, expect } from '../fixtures/pageFixtures';

test.describe('My Test Suite', () => {
    
    test('my test scenario', async ({ page, productsPage, authenticatedPage }) => {
        // Test is already authenticated and on products page
        // Write your test logic here
    });
});
```

### Example: Create a new page object
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
    readonly myElement: Locator;

    constructor(page: Page) {
        super(page);
        this.myElement = page.locator('.my-selector');
    }

    async myMethod() {
        await this.click(this.myElement);
    }
}
```

## 🔍 Troubleshooting

### Issue: Tests fail to read Excel file
**Solution:** Ensure `testdata/credentials.xlsx` exists and has the correct format.

### Issue: Browser doesn't open
**Solution:** Run `npx playwright install chromium` to install browsers.

### Issue: Authentication fails
**Solution:** Check credentials in `testdata/credentials.xlsx` or `.env` file.

## 🤝 Contributing
1. Create a new branch for your feature
2. Follow the existing code structure and naming conventions
3. Write tests for new features
4. Ensure all tests pass before committing

## 📄 License
ISC

## 👤 Author
nk2

## 📚 Documentation
- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

**Last Updated:** November 26, 2025

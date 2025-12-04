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
 - **MCP Integration** - Configured to integrate with Model Context Protocol (Playwright MCP) for external tooling and assistants to interact with the test runtime

## 📁 Project Structure
```
MCPServer/
├── pages/                      # Page Object Models (UI)
│   ├── BasePage.ts            # Base class with common methods
│   ├── LoginPage.ts           # Login page object
│   ├── ProductsPage.ts        # Products page object
│   └── ShoppingCartPage.ts    # Shopping cart page object
├── src/                        # API & Utilities
│   ├── api/
│   │   ├── models/            # API DTOs/Interfaces
│   │   │   ├── auth.interface.ts
│   │   │   └── booking.interface.ts
│   │   └── services/          # API Service Classes
│   │       ├── BaseApiService.ts
│   │       ├── AuthService.ts
│   │       └── BookingService.ts
│   ├── data/
│   │   ├── api-test-data.xlsx       # Sample Excel test data for API
│   │   └── generate-api-test-data.ts # Excel generator (TypeScript)
│   └── utils/
│       └── excel-reader.ts   # Excel file reader utility
├── tests/                      # Test specifications
│   ├── login.spec.ts          # Login test scenarios (UI)
│   ├── products.spec.ts       # Products page validation (UI)
│   ├── productsSort.spec.ts   # Product sorting (UI)
│   ├── shoppingCart.spec.ts   # Shopping cart (UI)
│   └── api/
│       └── booking-e2e.spec.ts       # API data-driven tests (Restful Booker)
├── fixtures/                   # Custom test fixtures
│   └── pageFixtures.ts        # Page object fixtures
├── testdata/                   # Test data files
│   └── credentials.xlsx       # User credentials and URLs
├── reporters/                  # Custom reporters
│   └── slack-reporter.js      # Slack/Teams notification reporter
├── scripts/                    # Utility scripts
│   ├── sendResultsToN8n.js   # Send Playwright results to n8n
│   ├── generate-api-data.js  # Generate sample API Excel data
│   └── debug-auth.js          # Debug auth requests
├── .github/workflows/          # GitHub Actions CI/CD
│   ├── playwright-notify.yml  # UI tests + Slack notifications
│   └── api-tests.yml          # API tests (separate job)
├── .n8n/workflows/            # n8n workflow exports
│   └── playwright-to-slack.json
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables (local, ignored)
├── claude_desktop_mcp_config.json  # Claude Desktop MCP config
└── README.md                  # This file
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
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SLACK_BOT_TOKEN=xoxb-your-bot-token
TEAMS_WEBHOOK_URL=https://outlook.webhook.office.com/...
BOOKER_BASE_URL=https://restful-booker.herokuapp.com
BOOKER_USER=admin
BOOKER_PASS=password123
```

**Security note:** The repository no longer commits `.env`. Secrets should be stored in GitHub Actions Secrets (Settings → Secrets and variables → Actions) for CI runs. Rotate any secrets that were previously committed.

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

Note: `npm run send:results` expects `N8N_WEBHOOK_URL` (or `--url`) and will error if not provided.

Alternatively, a custom Playwright reporter (`reporters/slack-reporter.js`) posts a compact summary directly to Slack/Teams after each run:

- **Slack notification:** configured via `SLACK_WEBHOOK_URL` (incoming webhook). The reporter will post a compact summary of results.
- **Screenshot uploads:** optional and performed using `SLACK_BOT_TOKEN` (bot token). The bot must have the `files:write` OAuth scope to upload screenshots; without it uploads will fail with a `missing_scope` error.

Store `SLACK_WEBHOOK_URL` and `SLACK_BOT_TOKEN` as GitHub Secrets for CI (`SLACK_WEBHOOK_URL`, `SLACK_BOT_TOKEN`). The CI workflow included at `.github/workflows/playwright-notify.yml` reads these secrets and runs tests.


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

### Issue: Slack notifications not appearing
**Checks:**
- Confirm `SLACK_WEBHOOK_URL` is set for the environment where tests run (locally export or add to GitHub Secrets).
- Verify the incoming webhook posts to the Slack channel you're watching (incoming webhooks are tied to a specific channel/workspace).
- If you expect screenshots to be uploaded, ensure the Slack App bot token used for `SLACK_BOT_TOKEN` has the `files:write` OAuth scope and the app is reinstalled.

To get more visibility in CI logs, enable debug logging in the reporter or add a small console/log write — the reporter prints errors but not successful webhook responses by default.

## 🔌 API Testing (Restful Booker)

The framework includes a **Service Object Model** for data-driven API testing against the [Restful Booker API](https://restful-booker.herokuapp.com).

### Running API Tests

**Locally:**
```bash
# Generate sample Excel test data
node scripts/generate-api-data.js

# Run API tests
npx playwright test api/booking-e2e.spec.ts
```

**In CI/CD:**
```bash
# GitHub Actions will automatically run API tests via .github/workflows/api-tests.yml
# when you push to main or open a PR
```

### API Test Data

Sample test data is stored in `src/data/api-test-data.xlsx`:
- **Columns:** firstname, lastname, totalprice, depositpaid, checkin, checkout, additionalneeds
- **Rows:** 2 sample bookings (John Doe, Alice Smith)
- **Generated by:** `scripts/generate-api-data.js`

To add more test data, edit the Excel file or update the script and regenerate.

### API Architecture

**Service Object Model Pattern:**
- **BaseApiService** - Base class for all API services; wraps Playwright's `APIRequestContext`
- **AuthService** - Handles authentication (`/auth` endpoint); returns session token
- **BookingService** - CRUD operations for bookings (`/booking` endpoint)

**Usage in Tests:**
```typescript
// tests/api/booking-e2e.spec.ts reads Excel data at module load
// For each row, a dynamic test is created with steps:
// 1. Authenticate (get token)
// 2. Create booking
// 3. Get booking (verify creation)
// 4. Update booking (modify details)
// 5. Delete booking (cleanup)

test('Booking Flow - Row 1: John Doe', async ({ request }) => {
  const authService = new AuthService(request);
  const bookingService = new BookingService(request);
  
  const token = await authService.login({ username: '...', password: '...' });
  const bookingId = await bookingService.create({ firstname: 'John', ... });
  // ... continues with get, update, delete
});
```

### Environment Variables for API Tests

- `BOOKER_BASE_URL` - Restful Booker API base URL (default: `https://restful-booker.herokuapp.com`)
- `BOOKER_USER` - Authentication username (optional; currently not used for Restful Booker auth)
- `BOOKER_PASS` - Authentication password (optional; currently not used for Restful Booker auth)

Example `.env`:
```env
BOOKER_BASE_URL=https://restful-booker.herokuapp.com
```

### Test Results

All test runs generate Playwright reports in `playwright-report/`:
- HTML report (open with browser)
- JSON report (for CI integration)
- GitHub Actions report (embedded in PR/commit)

## 🧭 Import Claude Desktop MCP Config

This repository includes a ready-to-import Claude Desktop MCP configuration file: `claude_desktop_mcp_config.json`.

How to import into Claude Desktop:

- Open Claude Desktop and go to Settings → MCP / Integrations (or the equivalent MCP configuration UI).
- Choose the option to import or add a new MCP server and select `claude_desktop_mcp_config.json` from this repository.
- The entry `Playwright MCP (local)` points to `http://localhost:9333` by default — start the MCP server locally using:
```bash
npm run mcp:start
```
- If your MCP server listens on a different port, edit `claude_desktop_mcp_config.json` and update the `url` field before importing.

Verification:
- After importing, Claude Desktop should list the server and indicate it is online when MCP is running.
- Run a small MCP action from Claude (for example, ask it to run a Playwright command or list available capabilities) to confirm end-to-end connectivity.

Security:
- Only import local MCP configs that point to `localhost` unless you explicitly intend to expose the server.
- Do not commit production secrets to the repo. Use local environment variables or secure stores.

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

**Last Updated:** December 4, 2025
# PlaywrightMCPUi

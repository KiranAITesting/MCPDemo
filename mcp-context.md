# MCP Context & Instructions

## Project Context
This file provides context and instructions for MCP (Model Context Protocol) servers to execute tasks effectively.

---

## General Instructions

### Project Information
- **Project Name**: MCPServer - Playwright Test Automation Framework
- **Project Path**: `/Users/nk2/Desktop/MCPServer`
- **Primary User**: nk2
- **Environment**: macOS, VS Code
- **Technology Stack**: Playwright, TypeScript, Node.js, Excel (xlsx)
- **Design Pattern**: Page Object Model (POM) with Base Page and Custom Fixtures

### Project Structure
- `pages/` - Page Object Models (BasePage, LoginPage, ProductsPage, ShoppingCartPage)
- `tests/` - Test specifications (login, products, productsSort, shoppingCart)
- `fixtures/` - Custom Playwright fixtures for page initialization
- `utils/` - Utility classes (ExcelReader for test data)
- `testdata/` - Excel files with test credentials and URLs

### Default Behaviors
- Always ask for confirmation before making destructive changes
- Provide clear explanations for complex operations
- Save backups before major file modifications
- Use relative paths when working within project directory
- Follow Page Object Model design patterns
- Extend BasePage for all new page classes
- Use custom fixtures for page initialization

---

## MCP Server-Specific Instructions

### Filesystem Server
**Allowed Directories:**
- `/Users/nk2/Desktop`
- `/Users/nk2/Documents`
- `/Users/nk2/Desktop/MCPServer`

**Instructions:**
- Create organized folder structures
- Use descriptive file names
- Add comments in code files
- Format JSON files with proper indentation

### Git Server
**Instructions:**
- Use conventional commit messages (feat:, fix:, docs:, etc.)
- Always check status before committing
- Create feature branches for new work
- Include descriptive commit messages

**Commit Message Format:**
```
<type>: <description>

[optional body]
```

### Memory Server
**What to Remember:**
- User preferences and coding style
- Frequently used commands and patterns
- Project-specific configurations
- Important file locations and dependencies

### Fetch Server
**Instructions:**
- Verify URLs before fetching
- Handle errors gracefully
- Parse and summarize fetched content
- Cache frequently accessed resources

### SQLite Server
**Instructions:**
- Always backup database before modifications
- Use parameterized queries to prevent injection
- Provide clear schema documentation
- Explain query results in plain language

### Playwright Server
**Instructions:**
- Use Page Object Model design pattern
- Extend BasePage for all new page classes
- Use custom fixtures (loginPage, productsPage, shoppingCartPage, authenticatedPage)
- Store test data in Excel files under testdata/
- Run tests in headed mode by default (configured in playwright.config.ts)
- Create separate test files for different feature areas
- Use ExcelReader utility to read credentials from Excel
- Implement proper wait strategies using BasePage methods
- Take screenshots on failure automatically

**Test Organization:**
- `tests/login.spec.ts` - Login scenarios
- `tests/products.spec.ts` - Products page validation
- `tests/productsSort.spec.ts` - Sort functionality tests
- `tests/shoppingCart.spec.ts` - Shopping cart workflows

**Running Tests:**
```bash
npm test                    # Run all tests
npm run test:headed        # Headed mode
npm run test:ui            # UI mode
npm run test:debug         # Debug mode
npm run report             # View HTML report
```

---

## Task Templates

### Create New Page Object
```typescript
1. Create file in pages/ directory
2. Import BasePage and extend it
3. Define locators in constructor
4. Implement page-specific methods
5. Add to fixtures/pageFixtures.ts
6. Export fixture type
```

### Create New Test Suite
```typescript
1. Create file in tests/ directory
2. Import test and expect from fixtures
3. Use authenticatedPage fixture for logged-in tests
4. Group related tests in test.describe()
5. Write descriptive test names
6. Add proper assertions
```

### Add Test Data to Excel
```
1. Open testdata/credentials.xlsx
2. Add new row with username, password, baseUrl
3. Use ExcelReader.getCredentials(rowIndex) to access
4. Update tests to use new row index if needed
```

### File Operations
```
1. Verify file path exists
2. Check permissions
3. Create backup if modifying existing file
4. Perform operation
5. Verify success
6. Log action
```

### Web Scraping
```
1. Validate URL
2. Check robots.txt
3. Fetch content
4. Parse and extract data
5. Format output
6. Handle errors
```

---

## Coding Standards

### General
- Use meaningful variable and function names
- Add comments for complex logic
- Follow DRY (Don't Repeat Yourself) principle
- Handle errors appropriately

### JavaScript/TypeScript
- Use ES6+ features
- Prefer `const` over `let`
- Use async/await over promises
- Add JSDoc comments for functions
- Follow Playwright best practices
- Use Page Object Model pattern
- Extend BasePage for common functionality
- Use type annotations for better IntelliSense

### Playwright-Specific
- Use data-test attributes for stable locators
- Implement proper wait strategies
- Avoid hard-coded waits (page.waitForTimeout)
- Use custom fixtures for page initialization
- Store test data externally (Excel files)
- Separate test concerns (login, products, cart)
- Use descriptive test and method names

### Python
- Follow PEP 8 style guide
- Use type hints
- Add docstrings to functions and classes
- Use virtual environments

---

## Custom Commands & Shortcuts

### Frequently Used Patterns
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/login.spec.ts --project=chromium

# Run in UI mode
npm run test:ui

# View test report
npm run report

# Create new page object
# 1. Create pages/NewPage.ts extending BasePage
# 2. Add fixture in fixtures/pageFixtures.ts
# 3. Use in tests via fixture parameter

# Add test data
# 1. Open testdata/credentials.xlsx
# 2. Add row with username, password, baseUrl
# 3. Access via ExcelReader.getCredentials(rowIndex)

# Git workflow
git add .
git commit -m "feat: description"
git push origin main
```

### Project-Specific Commands
```bash
# Install new package
npm install -D package-name

# Update Playwright
npm install -D @playwright/test@latest

# Reinstall browsers
npx playwright install

# Check for vulnerabilities
npm audit
```

---

## Security Guidelines
- Never commit sensitive data (API keys, passwords)
- Use environment variables for secrets
- Validate all user inputs
- Keep dependencies updated
- Review code for security vulnerabilities

---

## Notes & Preferences
Add your personal preferences and frequently needed instructions here:

### Current Implementation
- ✅ Page Object Model with BasePage
- ✅ Custom fixtures for page initialization
- ✅ Excel-based test data management
- ✅ Headed mode by default in Chromium
- ✅ 17 test scenarios across 4 test suites
- ✅ Shopping cart, products, sort, and login tests
- ✅ Git repository initialized

### Test Data Location
- Excel file: `testdata/credentials.xlsx`
- Environment variables (fallback): `.env`
- Default user: Row 0 in Excel (standard_user)

### Key Files to Know
- `pages/BasePage.ts` - Common methods for all pages
- `fixtures/pageFixtures.ts` - Custom fixtures setup
- `utils/excelReader.ts` - Excel data reader
- `playwright.config.ts` - Test configuration
- `shopping-scenarios.md` - Shopping cart test documentation

### Testing Best Practices
- Use `authenticatedPage` fixture to skip login in tests
- Read credentials from Excel using ExcelReader
- Separate test concerns into different files
- Use BasePage methods for common operations
- Add descriptive test names and comments

---

**Last Updated**: November 26, 2025

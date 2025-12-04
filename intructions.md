Context: I have an existing Playwright UI Automation framework. I need to integrate an API testing suite for the Restful Booker API into this existing codebase without disrupting current UI tests.

Role: Senior QA Automation Engineer.

Task: Generate and inject the necessary files to add Data-Driven API testing capabilities using the Service Object Model pattern.

Technical Requirements:

Library Check: Check if xlsx (or exceljs) is installed in package.json. If not, run the command to install it.

Architecture:

Create a dedicated directory src/api to separate API logic from UI Page Objects.

POJO/DTOs: strict TypeScript interfaces for Request/Response payloads.

Services: Class-based wrappers around APIRequestContext.

Data: Read from an Excel file (src/data/api-test-data.xlsx).

Execution Steps (Create these specific files):

Create Models (DTOs):

src/api/models/auth.interface.ts: Interface for Auth payload and Token response.

src/api/models/booking.interface.ts: Interfaces for Booking objects (Create, Update, Response).

Create Services (API Controllers):

src/api/services/BaseApiService.ts: A wrapper to handle context initialization if needed.

src/api/services/AuthService.ts: Method login() returning the token.

src/api/services/BookingService.ts: Methods for create, get, update, delete. Ensure these methods accept the Token and Booking Models.

Create Utilities:

src/utils/excel-reader.ts: A robust helper function to read the Excel sheet and return a JSON object array.

Create Data:

Generate a dummy Excel file at src/data/api-test-data.xlsx with headers: firstname, lastname, totalprice, depositpaid, checkin, checkout, additionalneeds.

Create the Test Spec:

tests/api/booking-e2e.spec.ts (Ensure you create the api subdirectory inside tests).

Logic:

Import excel-reader.

Use test.describe to loop through the Excel data rows.

Inside the loop, run a chained sequence for that specific row of data:

Auth: Get Token.

Create: POST new booking (Capture bookingid).

Get: GET bookingid and assert data matches Excel row.

Update: PUT bookingid (change firstname to "Updated") and verify.

Delete: DELETE bookingid and verify 404 on subsequent GET.

Constraints:

Do NOT overwrite playwright.config.ts.

Do NOT overwrite tsconfig.json.

Use test.step annotations inside the spec for clear reporting.

Ensure all imports are relative and resolve correctly within the existing structure.




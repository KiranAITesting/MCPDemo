import { test, expect } from '@playwright/test';
import path from 'path';
import xlsx from 'xlsx';
import { AuthService } from '../../src/api/services/AuthService';
import { BookingService } from '../../src/api/services/BookingService';

test.describe('Booking API E2E (data-driven)', () => {

// Read Excel synchronously at module load so Playwright can discover tests.
const dataFile = path.join(process.cwd(), 'src', 'data', 'api-test-data.xlsx');
if (!require('fs').existsSync(dataFile)) {
  throw new Error(`Missing test data file: ${dataFile}. Run \`node scripts/generate-api-data.js\` to generate it.`);
}
const workbook = xlsx.readFile(dataFile);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data: Array<any> = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  for(const row of data){
    test(`booking flow for ${row.firstname} ${row.lastname}`, async ({ request: apiRequest }) => {
      const baseApiUrl = process.env.BOOKER_BASE_URL || 'https://restful-booker.herokuapp.com';
      const authService = new AuthService(apiRequest, baseApiUrl);
      const bookingService = new BookingService(apiRequest, baseApiUrl);

      let token: string | undefined;
      let bookingId: number | undefined;

      await test.step('Auth: get token', async () => {
        // Restful Booker has a default credential: admin / password123 (common example)
        token = await authService.login({ username: process.env.BOOKER_USER || 'admin', password: process.env.BOOKER_PASS || 'password123' });
        expect(token).toBeTruthy();
      });

      await test.step('Create booking', async () => {
        const bookingPayload = {
          firstname: row.firstname,
          lastname: row.lastname,
          totalprice: Number(row.totalprice || 0),
          depositpaid: (row.depositpaid === true || String(row.depositpaid).toLowerCase() === 'true'),
          bookingdates: { checkin: row.checkin, checkout: row.checkout },
          additionalneeds: row.additionalneeds || ''
        };
        const createRes = await bookingService.create(bookingPayload as any);
        expect(createRes).toHaveProperty('bookingid');
        bookingId = createRes.bookingid || createRes.booking?.bookingid;
        expect(bookingId).toBeTruthy();
      });

      await test.step('Get booking and verify', async () => {
        expect(bookingId).toBeTruthy();
        const getRes = await bookingService.get(bookingId as number);
        expect(getRes.status()).toBe(200);
        const got = await getRes.json();
        expect(got.firstname).toBe(row.firstname);
        expect(got.lastname).toBe(row.lastname);
      });

      await test.step('Update booking firstname to Updated', async () => {
        expect(bookingId).toBeTruthy();
        const updated = Object.assign({}, {
          firstname: 'Updated',
          lastname: row.lastname,
          totalprice: Number(row.totalprice || 0),
          depositpaid: (row.depositpaid === true || String(row.depositpaid).toLowerCase() === 'true'),
          bookingdates: { checkin: row.checkin, checkout: row.checkout },
          additionalneeds: row.additionalneeds || ''
        });
        const res = await bookingService.update(bookingId as number, updated as any, token);
        expect(res.status()).toBe(200);
        const getRes = await bookingService.get(bookingId as number);
        const got = await getRes.json();
        expect(got.firstname).toBe('Updated');
      });

      await test.step('Delete booking and verify 404', async () => {
        expect(bookingId).toBeTruthy();
        const delRes = await bookingService.delete(bookingId as number, token);
        expect(delRes.status()).toBe(201);
        const getAfter = await bookingService.get(bookingId as number);
        expect(getAfter.status()).toBe(404);
      });
    });
  }
});

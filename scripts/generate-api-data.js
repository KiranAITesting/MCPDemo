const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const outDir = path.join(process.cwd(), 'src', 'data');
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const data = [
  {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 123,
    depositpaid: true,
    checkin: '2025-01-01',
    checkout: '2025-01-10',
    additionalneeds: 'Breakfast'
  },
  {
    firstname: 'Alice',
    lastname: 'Smith',
    totalprice: 200,
    depositpaid: false,
    checkin: '2025-02-01',
    checkout: '2025-02-05',
    additionalneeds: 'Late checkout'
  }
];

const ws = xlsx.utils.json_to_sheet(data.map(d => ({
  firstname: d.firstname,
  lastname: d.lastname,
  totalprice: d.totalprice,
  depositpaid: d.depositpaid,
  checkin: d.checkin,
  checkout: d.checkout,
  additionalneeds: d.additionalneeds
})));
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
const outPath = path.join(outDir, 'api-test-data.xlsx');
xlsx.writeFile(wb, outPath);
console.log('Wrote sample API test data to', outPath);

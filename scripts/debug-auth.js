const { request } = require('@playwright/test');

(async ()=>{
  const req = await request.newContext();
  const url = 'https://restful-booker.herokuapp.com/auth';
  const res = await req.post(url, { data: JSON.stringify({ username: 'admin', password: 'password123' }), headers: { 'Content-Type': 'application/json', 'X-Debug': '1' } });
  console.log('status', res.status());
  console.log('headers', res.headers());
  const text = await res.text();
  console.log('body', text);
  await req.dispose();
})();

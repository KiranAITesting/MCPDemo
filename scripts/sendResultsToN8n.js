#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
function arg(name){
  const idx = argv.indexOf(name);
  return idx === -1 ? null : argv[idx+1];
}

const webhookUrl = process.env.N8N_WEBHOOK_URL || arg('--url');
const resultsFile = process.env.PLAYWRIGHT_RESULTS || arg('--file') || path.join('playwright-report','results.json');

if(!webhookUrl){
  console.error('Error: missing n8n webhook URL. Set N8N_WEBHOOK_URL or pass --url <webhook>');
  process.exit(1);
}

if(!fs.existsSync(resultsFile)){
  console.error('Error: results file not found:', resultsFile);
  console.error('Tip: run tests with `npx playwright test --reporter=json > playwright-report/results.json`');
  process.exit(1);
}

let data;
const raw = fs.readFileSync(resultsFile, 'utf8');
try {
  data = JSON.parse(raw);
} catch (e) {
  // Attempt to recover if the file contains leading/trailing log lines
  // Find first JSON opening char and last closing char and try to parse that substring.
  const firstBrace = raw.indexOf('{');
  const firstBracket = raw.indexOf('[');
  let start = -1;
  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  const lastBrace = raw.lastIndexOf('}');
  const lastBracket = raw.lastIndexOf(']');
  let end = Math.max(lastBrace, lastBracket);

  if (start !== -1 && end !== -1 && end > start) {
    const candidate = raw.slice(start, end + 1);
    try {
      data = JSON.parse(candidate);
      // save cleaned file for inspection
      const cleanedPath = resultsFile.replace(/\.json$/, '') + '.clean.json';
      try { fs.writeFileSync(cleanedPath, JSON.stringify(data, null, 2), 'utf8'); } catch (_) {}
      console.warn('Warning: original results file contained non-JSON leading/trailing data. A cleaned copy was written to', cleanedPath);
    } catch (e2) {
      console.error('Error: failed to parse JSON from', resultsFile);
      console.error('Original parse error:', e.message);
      console.error('Attempted to parse candidate JSON substring but failed:', e2.message);
      process.exit(1);
    }
  } else {
    console.error('Error: failed to parse JSON from', resultsFile);
    console.error('No JSON substring could be identified. Original parse error:', e.message);
    process.exit(1);
  }
}

function collectTestsFromSuite(suite){
  const tests = [];
  if(!suite) return tests;
  if(Array.isArray(suite.tests)) tests.push(...suite.tests);
  if(Array.isArray(suite.suites)){
    suite.suites.forEach(s=> tests.push(...collectTestsFromSuite(s)));
  }
  if(Array.isArray(suite.specs)){
    suite.specs.forEach(spec => {
      if(Array.isArray(spec.tests)) tests.push(...spec.tests);
    });
  }
  return tests;
}

let allTests = [];
if(Array.isArray(data.suites)){
  data.suites.forEach(s => allTests.push(...collectTestsFromSuite(s)));
} else if(Array.isArray(data.tests)){
  allTests = data.tests;
}

const summary = { total: allTests.length, passed:0, failed:0, skipped:0, duration: data.duration || 0 };
allTests.forEach(t => {
  if(t.ok === true) summary.passed++;
  else if(t.ok === false) summary.failed++;
  else summary.skipped++;
});

const payload = { summary, results: data };

(async ()=>{
  try{
    const res = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    if(!res.ok){
      console.error('n8n webhook returned', res.status, await res.text());
      process.exit(2);
    }
    console.log('Results sent to n8n successfully');
  }catch(err){
    console.error('Failed to send to n8n webhook:', err.message);
    process.exit(3);
  }
})();

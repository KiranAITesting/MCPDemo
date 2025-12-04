#!/usr/bin/env node
/**
 * Test script to verify Slack webhook connectivity
 * Usage: node scripts/test-slack-webhook.js [webhook-url]
 */

const https = require('https');
const { URL } = require('url');

const webhookUrl = process.argv[2] || process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('❌ Error: No Slack webhook URL provided');
  console.log('Usage: node scripts/test-slack-webhook.js <webhook-url>');
  console.log('   or: SLACK_WEBHOOK_URL=<url> node scripts/test-slack-webhook.js');
  process.exit(1);
}

const testMessage = {
  text: '🧪 Slack Webhook Test\n✅ Connection successful!\n⏱️ Test time: ' + new Date().toISOString()
};

console.log('Testing Slack webhook...');
console.log('URL:', webhookUrl.substring(0, 50) + '...');
console.log('Message:', JSON.stringify(testMessage, null, 2));

postToSlack(webhookUrl, testMessage)
  .then(response => {
    console.log('✅ Success! Response:', response);
    console.log('\n✅ Slack webhook is working correctly!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Failed to post to Slack:', error.message);
    process.exit(1);
  });

function postToSlack(url, body) {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.stringify(body);
      const u = new URL(url);
      const opts = {
        method: 'POST',
        hostname: u.hostname,
        path: u.pathname + (u.search || ''),
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(opts, res => {
        let buf = '';
        res.on('data', d => (buf += d.toString()));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(buf);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${buf}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

const fs = require('fs');
const path = require('path');
const https = require('https');

class SlackReporter {
  constructor(options = {}){
    this.options = options;
    this.summary = { total:0, passed:0, failed:0, skipped:0, flaky:0, duration:0 };
    this.failures = [];
  }

  onBegin(config, suite) {
    this.startTime = Date.now();
    console.log('SlackReporter started');
  }

  async onTestEnd(test, result) {
    this.summary.total += 1;
    if(result.status === 'passed') this.summary.passed += 1;
    else if(result.status === 'failed') this.summary.failed += 1;
    else if(result.status === 'skipped') this.summary.skipped += 1;
    else if(result.status === 'flaky') this.summary.flaky += 1;

    if(result.status === 'failed'){
      const failure = { title: test.title, file: test.location.file, errors: result.errors.map(e=>e.message || String(e)), attachments: [] };
      // collect screenshots & attachments
      if(Array.isArray(result.attachments)){
        for(const a of result.attachments){
          if(a.path && fs.existsSync(a.path)){
            failure.attachments.push({ name: a.name, path: a.path });
          }
        }
      }
      this.failures.push(failure);
    }
  }

  async onEnd(result) {
    this.summary.duration = Date.now() - this.startTime;
    // Build formatted message according to requested layout
    const durationSeconds = (this.summary.duration / 1000).toFixed(1);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`;

    // Compose Slack/Teams message lines
    let lines = [];
    lines.push('*Test Summary*');
    if(this.summary.failed === 0 && this.summary.total > 0){
      lines.push(':white_check_mark: All ' + this.summary.total + ' tests passed');
    } else if(this.summary.failed === 0 && this.summary.total === 0){
      lines.push(':warning: No tests were run');
    } else {
      lines.push(`:x: ${this.summary.failed} failed · ${this.summary.passed} passed · ${this.summary.skipped} skipped`);
    }
    lines.push(`:stopwatch: Duration: ${durationSeconds} seconds`);
    lines.push(`:date: Date: ${dateString}`);

    const formattedText = lines.join('\n');

    // If slack webhook provided, post to Slack
    if(this.options.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL){
      const url = this.options.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL;
      const body = { text: formattedText };
      // If failures exist, append short list as attachments to the message
      if(this.failures.length){
        // Only include concise failure title + filename (no detailed error or stack traces)
        const linesFail = this.failures.slice(0,5).map(f => `• *${f.title}* — ${path.basename(f.file)}`);
        body.text = formattedText + '\n\nTop failures:\n' + linesFail.join('\n');
      }
      await postJson(url, body).catch(e=> console.error('Failed to post to Slack webhook:', e.message));
      // If bot token provided, upload screenshots for failures
      const botToken = this.options.slackBotToken || process.env.SLACK_BOT_TOKEN;
      if(botToken && this.failures.length){
        for(const f of this.failures){
          for(const a of f.attachments){
            try{
              const uploadRes = await uploadFileToSlack(botToken, a.path, `screenshot - ${f.title}`);
              if(uploadRes && uploadRes.file && uploadRes.file.permalink){
                // send a follow-up message with link
                await postJson(url, { text: `Screenshot for *${f.title}*: ${uploadRes.file.permalink}` });
              }
            }catch(err){
              console.error('uploadFileToSlack failed:', err.message);
            }
          }
        }
      }
    }

    // If Teams webhook provided
    if(this.options.teamsWebhookUrl || process.env.TEAMS_WEBHOOK_URL){
      const turl = this.options.teamsWebhookUrl || process.env.TEAMS_WEBHOOK_URL;
      const card = {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        summary: text,
        title: 'Playwright Test Results',
        text: text
      };
      if(this.failures.length){
        card.sections = [ { facts: this.failures.slice(0,5).map(f => ({ name: f.title, value: f.errors[0].split('\n')[0] })) } ];
      }
      await postJson(turl, card).catch(e=> console.error('Failed to post to Teams webhook:', e.message));
    }
  }
}

function postJson(url, body){
  return new Promise((resolve, reject) => {
    try{
      const data = JSON.stringify(body);
      const u = new URL(url);
      const opts = { method: 'POST', hostname: u.hostname, path: u.pathname + (u.search||''), headers: { 'Content-Type':'application/json', 'Content-Length': Buffer.byteLength(data) } };
      const req = https.request(opts, res => {
        let buf = '';
        res.on('data', d=> buf += d.toString());
        res.on('end', ()=> {
          if(res.statusCode >= 200 && res.statusCode < 300) resolve(buf);
          else reject(new Error(`HTTP ${res.statusCode}: ${buf}`));
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    }catch(err){ reject(err); }
  });
}

function uploadFileToSlack(token, filePath, title){
  return new Promise((resolve, reject) => {
    const boundary = '----n8nSlackFormBoundary' + Date.now();
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);
    const url = new URL('https://slack.com/api/files.upload');
    const options = { method: 'POST', hostname: url.hostname, path: url.pathname, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data; boundary=' + boundary } };
    const req = https.request(options, res => {
      let buf = '';
      res.on('data', d=> buf += d.toString());
      res.on('end', ()=> {
        try{ const json = JSON.parse(buf); if(!json.ok) return reject(new Error(JSON.stringify(json))); resolve(json); }catch(e){ reject(e); }
      });
    });
    req.on('error', reject);

    const pre = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/octet-stream\r\n\r\n`;
    req.write(pre);
    const stream = fs.createReadStream(filePath);
    stream.pipe(req, { end: false });
    stream.on('end', () => {
      const meta = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${title}\r\n--${boundary}\r\nContent-Disposition: form-data; name="channels"\r\n\r\n#general\r\n--${boundary}--\r\n`;
      req.end(meta);
    });
  });
}

module.exports = SlackReporter;

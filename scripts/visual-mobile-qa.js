#!/usr/bin/env node
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const baseUrl = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const outDir = path.join(root, 'qa');
const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
];

function assert(label, ok, details) {
  if (!ok) throw new Error(details ? `${label}: ${details}` : label);
  console.log(`OK ${label}`);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findChrome() {
  const executable = chromeCandidates.find(file => fs.existsSync(file));
  if (!executable) throw new Error('Chrome or Brave was not found in /Applications');
  return executable;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function fetchJson(url, attempts = 40) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      lastError = new Error(`${res.status} ${res.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await wait(250);
  }
  throw lastError || new Error(`Unable to fetch ${url}`);
}

function createCdpClient(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const listeners = new Map();

    ws.addEventListener('open', () => {
      resolve({
        send(method, params = {}, sessionId) {
          const messageId = ++id;
          const payload = { id: messageId, method, params };
          if (sessionId) payload.sessionId = sessionId;
          ws.send(JSON.stringify(payload));
          return new Promise((res, rej) => pending.set(messageId, { res, rej, method }));
        },
        once(method) {
          return new Promise(res => listeners.set(method, res));
        },
        close() {
          ws.close();
        }
      });
    });

    ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const item = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) item.rej(new Error(`${item.method}: ${msg.error.message}`));
        else item.res(msg.result);
        return;
      }
      if (msg.method && listeners.has(msg.method)) {
        const res = listeners.get(msg.method);
        listeners.delete(msg.method);
        res(msg.params);
      }
    });
    ws.addEventListener('error', reject);
  });
}

async function evaluate(client, sessionId, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  }, sessionId);
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
  }
  return result.result.value;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const port = await getFreePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sem-mobile-qa-'));
  const chrome = spawn(findChrome(), [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-extensions',
    '--disable-sync',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    '--window-size=390,844',
    'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const chromeErrors = [];
  chrome.stderr.on('data', chunk => {
    const text = String(chunk).trim();
    if (text && !text.includes('DevTools listening')) chromeErrors.push(text);
  });

  let client;
  try {
    const version = await fetchJson(`http://127.0.0.1:${port}/json/version`);
    client = await createCdpClient(version.webSocketDebuggerUrl);
    const target = await client.send('Target.createTarget', { url: 'about:blank' });
    const attached = await client.send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await client.send('Page.enable', {}, sessionId);
    await client.send('Runtime.enable', {}, sessionId);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    }, sessionId);

    const load = client.once('Page.loadEventFired');
    await client.send('Page.navigate', { url: `${baseUrl}/products/` }, sessionId);
    await load;
    await wait(900);

    const productMetrics = await evaluate(client, sessionId, `(() => ({
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      productCards: document.querySelectorAll('.prod-card').length,
      stickyQuoteDisplay: getComputedStyle(document.querySelector('.mobile-quote-bar')).display
    }))()`);
    const productShot = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true }, sessionId);
    fs.writeFileSync(path.join(outDir, 'mobile-products.png'), Buffer.from(productShot.data, 'base64'));

    assert('products page renders catalogue cards', productMetrics.productCards > 0, JSON.stringify(productMetrics));
    assert('products page has no horizontal overflow', productMetrics.scrollWidth <= productMetrics.viewport && productMetrics.bodyScrollWidth <= productMetrics.viewport, JSON.stringify(productMetrics));

    await evaluate(client, sessionId, `(() => {
      const input = document.querySelector('#usage-search-input');
      input.value = 'SDB 133';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    await wait(250);
    const modelMetrics = await evaluate(client, sessionId, `(() => ({
      resultCount: document.querySelectorAll('.prod-card').length,
      firstCard: document.querySelector('.prod-card-name') && document.querySelector('.prod-card-name').textContent,
      status: document.querySelector('#usage-search-status') && document.querySelector('#usage-search-status').textContent,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert('combined finder returns model matches', modelMetrics.resultCount > 0 && /SDB 133|133 Series/i.test((modelMetrics.firstCard || '') + ' ' + (modelMetrics.status || '')) && !modelMetrics.overflow, JSON.stringify(modelMetrics));

    await evaluate(client, sessionId, `(() => {
      const buttons = document.querySelectorAll('[data-compare-id]');
      buttons[0].click();
      buttons[1].click();
      return true;
    })()`);
    await wait(250);
    const chipMetrics = await evaluate(client, sessionId, `(() => ({
      chipCount: document.querySelectorAll('.compare-chip').length,
      firstChip: document.querySelector('.compare-chip') && document.querySelector('.compare-chip').textContent,
      barDisplay: getComputedStyle(document.querySelector('#compare-bar')).display,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    }))()`);
    assert('compare bar shows selected product chips', chipMetrics.chipCount >= 2 && chipMetrics.barDisplay !== 'none' && !chipMetrics.overflow, JSON.stringify(chipMetrics));

    await evaluate(client, sessionId, `(() => {
      document.querySelector('#compare-open').click();
      return true;
    })()`);
    await wait(500);

    const compareMetrics = await evaluate(client, sessionId, `(() => {
      const table = document.querySelector('.compare-table');
      const cards = document.querySelector('.compare-card-list');
      const box = document.querySelector('.compare-box').getBoundingClientRect();
      return {
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        tableDisplay: table ? getComputedStyle(table).display : null,
        cardsDisplay: cards ? getComputedStyle(cards).display : null,
        cardCount: document.querySelectorAll('.compare-card').length,
        focusId: document.activeElement && document.activeElement.id,
        boxWidth: Math.round(box.width),
        boxHeight: Math.round(box.height)
      };
    })()`);
    const compareShot = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true }, sessionId);
    fs.writeFileSync(path.join(outDir, 'mobile-compare.png'), Buffer.from(compareShot.data, 'base64'));

    assert('mobile compare uses stacked cards', compareMetrics.tableDisplay === 'none' && compareMetrics.cardsDisplay === 'block', JSON.stringify(compareMetrics));
    assert('mobile compare renders selected products', compareMetrics.cardCount >= 2, JSON.stringify(compareMetrics));
    assert('compare close receives focus', compareMetrics.focusId === 'compare-close', JSON.stringify(compareMetrics));
    assert('compare modal fits phone viewport', compareMetrics.boxWidth <= compareMetrics.viewport && compareMetrics.scrollWidth <= compareMetrics.viewport, JSON.stringify(compareMetrics));

    console.log(`\nMobile visual QA passed. Screenshots saved in ${path.relative(root, outDir)}/`);
  } finally {
    if (client) client.close();
    chrome.kill('SIGTERM');
    try { fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch (error) {}
    if (chromeErrors.length) {
      const relevant = chromeErrors.filter(line => !/ERROR:.*(policy|variations|component)/i.test(line));
      if (relevant.length) console.log(`Chrome notes:\n${relevant.slice(0, 3).join('\n')}`);
    }
  }
})().catch(error => {
  console.error(`\nMobile visual QA failed: ${error.message}`);
  process.exit(1);
});

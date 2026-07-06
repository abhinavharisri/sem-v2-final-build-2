#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const routePairs = [
  ['about.html', 'about/index.html'],
  ['products.html', 'products/index.html'],
  ['applications.html', 'applications/index.html'],
  ['downloads.html', 'downloads/index.html'],
  ['distributors.html', 'distributors/index.html'],
  ['contact.html', 'contact/index.html']
];

function run(label, command, args) {
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }
}

function assert(label, ok) {
  if (!ok) throw new Error(label);
  console.log(`OK ${label}`);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function checkInlineScripts() {
  const pages = [
    'index.html',
    'products.html',
    'applications.html',
    'downloads.html',
    'distributors.html',
    'contact.html',
    '404.html'
  ];

  pages.forEach(page => {
    const html = read(page);
    const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
    scripts.forEach((match, index) => {
      const attrs = match[1];
      if (/\bsrc=/.test(attrs) || /type=["']application\/ld\+json["']/.test(attrs)) return;
      try {
        new Function(match[2]);
      } catch (error) {
        throw new Error(`${page} inline script ${index + 1}: ${error.message}`);
      }
    });
  });

  console.log('OK inline script parse');
}

function checkNoEmojiUi() {
  const files = [
    ...fs.readdirSync(root).filter(file => file.endsWith('.html')),
    'about/index.html',
    'products/index.html',
    'applications/index.html',
    'downloads/index.html',
    'distributors/index.html',
    'contact/index.html',
    'js/main.js',
    'js/nav.js',
    'css/style.css',
    'css/products.css'
  ];
  const symbols = ['🛒', '🗑', '⚙', '📞', '✉', '📄', '📍', '🌐', '💬', '✓', '✕'];
  const offenders = files.filter(file => {
    const contents = read(file);
    return symbols.some(symbol => contents.includes(symbol));
  });
  assert('no emoji UI tokens remain', offenders.length === 0);
}

function checkRouteCopies() {
  routePairs.forEach(([source, target]) => {
    assert(`${target} matches ${source}`, read(source) === read(target));
  });
}

try {
  run('sync clean URL routes', 'node', ['scripts/sync-routes.js']);
  run('check js/nav.js', 'node', ['--check', 'js/nav.js']);
  run('check js/main.js', 'node', ['--check', 'js/main.js']);
  run('check js/products.js', 'node', ['--check', 'js/products.js']);
  run('check scripts/sync-routes.js', 'node', ['--check', 'scripts/sync-routes.js']);
  run('check scripts/smoke-mobile.js', 'node', ['--check', 'scripts/smoke-mobile.js']);
  checkInlineScripts();
  checkNoEmojiUi();
  checkRouteCopies();
  run('mobile smoke test', 'node', ['scripts/smoke-mobile.js']);
  console.log('\nDeploy checklist passed.');
} catch (error) {
  console.error(`\nDeploy checklist failed: ${error.message}`);
  process.exit(1);
}

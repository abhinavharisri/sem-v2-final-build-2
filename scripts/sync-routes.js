#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const routes = [
  ['about.html', 'about/index.html'],
  ['products.html', 'products/index.html'],
  ['applications.html', 'applications/index.html'],
  ['downloads.html', 'downloads/index.html'],
  ['distributors.html', 'distributors/index.html'],
  ['contact.html', 'contact/index.html']
];

for (const [source, target] of routes) {
  const sourcePath = path.join(root, source);
  const targetPath = path.join(root, target);
  const html = fs.readFileSync(sourcePath, 'utf8');

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, html);
  console.log(`${source} -> ${target}`);
}

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,'..');
const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    if (entry.name === '.git' || entry.name === 'assets' || entry.name === 'images') continue;
    const full = path.join(directory,entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);
const failures = [];
const report = (file,message) => failures.push(`${path.relative(root,file)}: ${message}`);
for (const file of htmlFiles) {
  const rawHtml = fs.readFileSync(file,'utf8');
  const html = rawHtml.replace(/<!--[\s\S]*?-->/g,'');
  if (!/<title>[^<]+<\/title>/.test(html)) report(file,'missing title');
  if (!/<meta name="description"/.test(html) && !/404\.html$/.test(file)) report(file,'missing meta description');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id,index) => ids.indexOf(id) !== index);
  if (duplicates.length) report(file,`duplicate ids: ${[...new Set(duplicates)].join(', ')}`);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]*"/.test(match[0])) report(file,'image missing alt attribute');
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || target === '/' || /['"+]/.test(target)) continue;
    let local = path.join(root,target);
    if (target.endsWith('/')) local = path.join(local,'index.html');
    if (!fs.existsSync(local)) report(file,`missing local target ${target}`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\n${failures.length} site audit issue(s).`);
  process.exit(1);
}
console.log(`Site audit passed for ${htmlFiles.length} HTML files.`);

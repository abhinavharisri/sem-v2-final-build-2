#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/products.js'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\n;globalThis.__SEM_PRODUCTS__ = SEM_PRODUCTS;`, context);
const products = context.__SEM_PRODUCTS__;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const base = 'https://www.superiorelectric.in';

function specsTable(product) {
  if (!product.specs?.length) return '<p class="product-detail-empty">Detailed specifications are available from SEM engineering.</p>';
  const keys = Object.keys(product.specs[0]);
  const columns = product.spec_columns?.length === keys.length ? product.spec_columns : keys.map(key => key.replaceAll('_',' '));
  return `<div class="product-detail-table-wrap"><table class="product-detail-table"><thead><tr>${columns.map(column => `<th>${esc(column)}</th>`).join('')}</tr></thead><tbody>${product.specs.map(spec => `<tr>${keys.map(key => `<td>${esc(spec[key] ?? '—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function page(product) {
  const url = `${base}/products/${product.id}/`;
  const image = product.images?.[0] || '/images/sem-logo.png';
  const schema = {
    '@context':'https://schema.org','@type':'Product',name:product.name,description:product.description,
    category:product.category,image:product.images?.map(src => base + src) || [base + '/images/sem-logo.png'],
    brand:{'@type':'Brand',name:'SEM'},manufacturer:{'@type':'Organization',name:'Superior Electric Machines Private Limited'},url
  };
  const breadcrumbs = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Home',item:base+'/'},{'@type':'ListItem',position:2,name:'Products',item:base+'/products/'},{'@type':'ListItem',position:3,name:product.name,item:url}
  ]};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(product.name)} | SEM Industrial Air Moving Solutions</title><meta name="description" content="${esc(product.description)}"><link rel="canonical" href="${url}"><meta property="og:type" content="product"><meta property="og:title" content="${esc(product.name)} | SEM"><meta property="og:description" content="${esc(product.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}${esc(image)}"><link rel="stylesheet" href="/css/style.css?v=site-2026"><link rel="stylesheet" href="/css/products.css?v=product-pages-1"><link rel="icon" href="/images/sem-logo.png"><script type="application/ld+json">${JSON.stringify(schema)}</script><script type="application/ld+json">${JSON.stringify(breadcrumbs)}</script></head><body>
  <nav class="nav"><div class="nav-inner"><a href="/" class="nav-logo"><img src="/images/sem-logo-inverted.png?v=transparent-1" alt="SEM" class="nav-logo-img"><div class="nav-logo-text"><span class="nav-logo-name">Superior Electric Machines Private Limited</span><span class="nav-logo-sub">Air Moving Solutions</span></div></a><div class="nav-links"><a href="/">Home</a><a href="/about/">About</a><a href="/products/" class="active">Products</a><a href="/applications/">Applications</a><a href="/downloads/">Downloads</a><a href="/distributors/">Distributors</a><a href="/contact/">Contact</a></div><div class="nav-actions"><a href="/contact/?product=${encodeURIComponent(product.name)}" class="btn btn-primary btn-sm">Ask About This Product</a></div><button class="nav-hamburger" aria-label="Menu"><span></span><span></span><span></span></button></div></nav><div class="nav-mobile"><a href="/">Home</a><a href="/about/">About</a><a href="/products/" class="active">Products</a><a href="/applications/">Applications</a><a href="/downloads/">Downloads</a><a href="/contact/">Contact</a></div>
  <main class="page-body"><header class="product-detail-hero"><div class="container"><div class="breadcrumb"><a href="/">Home</a><span>/</span><a href="/products/">Products</a><span>/</span><span>${esc(product.name)}</span></div><div class="product-detail-grid"><div><div class="eyebrow">${esc(product.category)}</div><h1>${esc(product.name)}</h1><p>${esc(product.description)}</p><div class="product-detail-tags">${(product.applications||[]).map(app => `<span>${esc(app)}</span>`).join('')}</div><div class="product-detail-actions"><a class="btn btn-primary" href="/contact/?product=${encodeURIComponent(product.name)}&enquiry_type=Product%20Enquiry">Ask About This Product</a><a class="btn btn-outline" href="/products/?product=${encodeURIComponent(product.id)}">Interactive specifications</a></div></div><div class="product-detail-image"><img src="${esc(image)}" alt="${esc(product.name)}" onerror="this.src='/images/sem-logo.png'"></div></div></div></header>
  <section class="section bg-white"><div class="container"><div class="eyebrow-line"><span class="eyebrow">Catalogue Specifications</span></div><h2>Models and Technical Data</h2><p class="text-muted mt-8">Catalogue values are shown in their published units. Final selection and operating-point suitability should be confirmed with SEM engineering.</p>${specsTable(product)}${product.note ? `<p class="product-detail-note">${esc(product.note)}</p>` : ''}</div></section>
  <section class="cta-band"><div class="container"><div class="cta-inner"><div><h2>Need help selecting a model?</h2><p>Share your airflow, static pressure, supply and application requirements.</p></div><a class="btn btn-white btn-lg" href="/contact/?product=${encodeURIComponent(product.name)}&enquiry_type=Model%20Selection">Speak With Engineering</a></div></div></section></main>
  <footer class="footer"><div class="container"><div class="footer-bottom"><span>© 2026 Superior Electric Machines Private Limited. All rights reserved.</span><span>SEM® Air Moving Solutions</span></div></div></footer><script src="/js/nav.js?v=site-2026"></script><script src="/js/main.js?v=site-2026"></script></body></html>`;
}

for (const product of products) {
  const directory = path.join(root, 'products', product.id);
  fs.mkdirSync(directory, {recursive:true});
  fs.writeFileSync(path.join(directory, 'index.html'), page(product));
}
const coreRoutes = ['','about/','products/','applications/','downloads/','distributors/','contact/'];
const urls = coreRoutes.map(route => `${base}/${route}`).concat(products.map(product => `${base}/products/${product.id}/`));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url,index) => `  <url><loc>${url}</loc><lastmod>2026-07-12</lastmod><changefreq>${index === 0 ? 'weekly' : 'monthly'}</changefreq><priority>${index === 0 ? '1.0' : index === 2 ? '0.95' : '0.7'}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
console.log(`Generated ${products.length} product pages.`);

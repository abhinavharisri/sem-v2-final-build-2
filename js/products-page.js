(function() {
'use strict';

// ── CONFIG ────────────────────────────────────────────────────
var WA = '919448283843';
var CUSTOMER_KEY = 'sem-customer-details';
var PDF_MAP = {
  "roof-top-fans": "/assets/downloads/New Development Product.pdf",
  "plug-fans": "/assets/downloads/New Development Product.pdf",
  "belt-driven-blowers": "/assets/downloads/New Development Product.pdf",
  "single-inlet-forward-curved": "/assets/downloads/datasheets/single-inlet-forward-curved.pdf",
  "double-inlet-133": "/assets/downloads/datasheets/double-inlet-133.pdf",
  "double-inlet-140": "/assets/downloads/datasheets/double-inlet-140.pdf",
  "double-inlet-150": "/assets/downloads/datasheets/double-inlet-150.pdf",
  "double-inlet-180": "/assets/downloads/datasheets/double-inlet-180.pdf",
  "double-inlet-200-255": "/assets/downloads/datasheets/double-inlet-200-255.pdf",
  "double-inlet-backward-250": "/assets/downloads/datasheets/double-inlet-backward-250.pdf",
  "mini-blower": "/assets/downloads/datasheets/mini-blower.pdf",
  "conventional-single-inlet-blower": "/assets/downloads/datasheets/conventional-single-inlet-blower.pdf",
  "conventional-double-inlet-double-blower": "/assets/downloads/datasheets/conventional-double-inlet-double-blower.pdf",
  "conventional-single-inlet-double-blower": "/assets/downloads/datasheets/conventional-single-inlet-double-blower.pdf",
  "portable-blower-inflatables": "/assets/downloads/datasheets/portable-blower-inflatables.pdf",
  "blowers-for-inflatables": "/assets/downloads/datasheets/blowers-for-inflatables.pdf",
  "backward-curved-radial-fans": "/assets/downloads/datasheets/backward-curved-radial-fans.pdf",
  "single-inlet-backward-curved": "/assets/downloads/datasheets/single-inlet-backward-curved.pdf",
  "single-inlet-external-motor": "/assets/downloads/datasheets/single-inlet-external-motor.pdf",
  "heavy-duty-centrifugal-blower": "/assets/downloads/datasheets/heavy-duty-centrifugal-blower.pdf",
  "axial-fan-press-fit": "/assets/downloads/datasheets/axial-fan-press-fit.pdf",
  "axial-fan-riveted": "/assets/downloads/datasheets/axial-fan-riveted.pdf",
  "18af-3b4-bg": "/assets/downloads/datasheets/18af-3b4-bg.pdf",
  "20af-3b4": "/assets/downloads/datasheets/20af-3b4.pdf",
  "induction-motors": "/assets/downloads/datasheets/induction-motors.pdf",
  "pump-motors": "/assets/downloads/datasheets/pump-motors.pdf",
  "inline-duct-fan": "/assets/downloads/datasheets/inline-duct-fan.pdf",
  "cross-flow-fan": "/assets/downloads/datasheets/cross-flow-fan.pdf",
  "fume-extractor": "/assets/downloads/datasheets/fume-extractor.pdf",
  "forced-motor-cooling": "/assets/downloads/datasheets/forced-motor-cooling.pdf"
};


// ── STATE ─────────────────────────────────────────────────────
var currentProduct = null;
var carIdx = 0, carTotal = 1;
var checkoutStep = 1;
var cart = [];
var compareIds = [];
var compareVariants = {};
var lastModalTrigger = null;
var lastCartTrigger = null;
var lastCompareTrigger = null;
try { cart = JSON.parse(localStorage.getItem('sem-cart') || '[]'); } catch(e) { cart = []; }

// ── SCROLL STATE ──────────────────────────────────────────────
window.addEventListener('scroll', function() {
  var h = document.documentElement;
  var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  var bar = document.getElementById('page-progress');
  if (bar) bar.style.width = pct + '%';
}, {passive:true});

// ── BUILD GRID ────────────────────────────────────────────────
var ORIGINAL_IMAGE_PRODUCT_IDS = [
  'single-inlet-backward-curved',
  'portable-blower-inflatables',
  'single-inlet-external-motor',
  'heavy-duty-centrifugal-blower',
  'inline-duct-fan'
];

function shouldUseOriginalProductImage(productId) {
  return ORIGINAL_IMAGE_PRODUCT_IDS.indexOf(productId) >= 0;
}

function productCardImage(src, productId) {
  if (shouldUseOriginalProductImage(productId)) return src;
  var file = String(src || '').split('/').pop();
  if (!file) return src;
  return '/images/products/transparent/' + file.replace(/\.[^.]+$/, '.png') + '?v=cutout-3';
}

function productImageFallback(img, originalSrc) {
  img.onerror = null;
  img.src = originalSrc;
}

document.addEventListener('error', function(e) {
  var img = e.target;
  if (!img || img.tagName !== 'IMG' || !img.dataset.originalSrc) return;
  productImageFallback(img, img.dataset.originalSrc);
}, true);

function renderProductCards(list) {
  var grid = document.getElementById('prod-grid');
  if (!grid) return;
  grid.innerHTML = list.length ? list.map(function(p) {
    var cnt = p.specs ? p.specs.length : 0;
    var compareSelected = compareIds.indexOf(p.id) >= 0;
    var tags = (p.applications || []).slice(0, 3).map(function(app) {
      return '<span class="prod-card-tag">' + esc(app) + '</span>';
    }).join('');
    return '<div class="prod-card' + (compareSelected ? ' compare-selected' : '') + '" data-id="' + p.id + '" role="button" tabindex="0" aria-label="View ' + esc(p.name) + ' specifications">' +
      '<div class="prod-card-img">' +
        '<button class="prod-compare-btn' + (compareSelected ? ' selected' : '') + '" type="button" data-compare-id="' + p.id + '">' + (compareSelected ? '<span class="ui-icon ui-icon-check" aria-hidden="true"></span> Compare' : 'Compare') + '</button>' +
        (p.images && p.images.length > 0
          ? '<img src="' + esc(productCardImage(p.images[0], p.id)) + '" data-original-src="' + esc(p.images[0]) + '" data-image-index="0" alt="' + esc(p.name) + '" loading="lazy" decoding="async" width="320" height="220">' +
            (p.images.length > 1
              ? '<button class="prod-img-nav prod-img-prev" type="button" data-card-img-dir="-1" aria-label="Previous image for ' + esc(p.name) + '">‹</button>' +
                '<button class="prod-img-nav prod-img-next" type="button" data-card-img-dir="1" aria-label="Next image for ' + esc(p.name) + '">›</button>'
              : '')
          : productFallback(p.category)) +
      '</div>' +
      '<div class="prod-card-body">' +
        '<div class="prod-card-cat">' + p.category + '</div>' +
        '<div class="prod-card-name">' + p.name + '</div>' +
        '<div class="prod-card-models">' + p.models.join(' · ') + '</div>' +
        '<div class="prod-card-tags">' + tags + '</div>' +
        '<div class="prod-card-foot">' +
          '<span class="prod-card-count">' + (cnt > 0 ? cnt + ' model variants' : 'Custom specs') + '</span>' +
          '<a class="prod-card-page-link" data-product-page href="/products/' + p.id + '/" aria-label="Open the full page for ' + esc(p.name) + '">Full product page →</a>' +
        '</div>' +
      '</div></div>';
  }).join('') : '<div class="usage-no-results">No products matched this usage. Try one of these common applications:<div class="usage-no-results-actions"><button type="button" data-usage-suggest="HVAC">HVAC</button><button type="button" data-usage-suggest="fume extraction">Fume extraction</button><button type="button" data-usage-suggest="motor cooling">Motor cooling</button><button type="button" data-usage-suggest="industrial ventilation">Industrial ventilation</button></div></div>';
  grid.querySelectorAll('.prod-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('[data-product-page]')) return;
      var compareBtn = e.target.closest('[data-compare-id]');
      if (compareBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(compareBtn.dataset.compareId);
        return;
      }
      var imageBtn = e.target.closest('[data-card-img-dir]');
      if (imageBtn) {
        e.preventDefault();
        e.stopPropagation();
        cycleProductCardImage(card, Number(imageBtn.dataset.cardImgDir) || 1);
        return;
      }
      openModal(card.dataset.id);
    });
    card.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target.closest('[data-compare-id]')) return;
      e.preventDefault();
      openModal(card.dataset.id);
    });
  });
  grid.querySelectorAll('[data-usage-suggest]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (!usageInput) return;
      usageInput.value = btn.dataset.usageSuggest;
      runUsageSearch(usageInput.value);
      usageInput.focus();
    });
  });
  refreshCompareState();
}

function cycleProductCardImage(card, dir) {
  var product = getProductById(card.dataset.id);
  if (!product || !product.images || product.images.length < 2) return;
  var img = card.querySelector('.prod-card-img img');
  if (!img) return;
  var nextIndex = ((Number(img.dataset.imageIndex) || 0) + dir + product.images.length) % product.images.length;
  var nextSrc = product.images[nextIndex];
  img.dataset.imageIndex = String(nextIndex);
  img.dataset.originalSrc = nextSrc;
  img.src = productCardImage(nextSrc, product.id);
}

function buildGrid(filter) {
  var list = filter === 'all' ? SEM_PRODUCTS : SEM_PRODUCTS.filter(function(p) { return p.category === filter; });
  renderProductCards(list);
}

function toggleCompare(id) {
  var idx = compareIds.indexOf(id);
  if (idx >= 0) {
    compareIds.splice(idx, 1);
    delete compareVariants[id];
  }
  else {
    if (compareIds.length >= 3) {
      var removedId = compareIds.shift();
      delete compareVariants[removedId];
    }
    compareIds.push(id);
  }
  refreshCompareState();
}

function refreshCompareState() {
  document.querySelectorAll('.prod-card[data-id]').forEach(function(card) {
    var selected = compareIds.indexOf(card.dataset.id) >= 0;
    card.classList.toggle('compare-selected', selected);
    var btn = card.querySelector('[data-compare-id]');
    if (btn) {
      btn.classList.toggle('selected', selected);
      btn.innerHTML = selected ? '<span class="ui-icon ui-icon-check" aria-hidden="true"></span> Compare' : 'Compare';
    }
  });
  var bar = document.getElementById('compare-bar');
  var title = document.getElementById('compare-bar-title');
  var sub = document.getElementById('compare-bar-sub');
  var chipRow = document.getElementById('compare-chip-row');
  if (!bar) return;
  bar.classList.toggle('show', compareIds.length > 0);
  if (title) title.textContent = compareIds.length + ' product' + (compareIds.length === 1 ? '' : 's') + ' selected';
  if (sub) sub.textContent = compareIds.length < 2 ? 'Select at least 2 products to compare.' : 'Ready to compare key specifications.';
  if (chipRow) {
    chipRow.innerHTML = compareIds.map(function(id) {
      var product = getProductById(id);
      return product ? '<span class="compare-chip" title="' + esc(product.name) + '">' + esc(product.name) + '</span>' : '';
    }).join('');
  }
}

function openCompare() {
  if (compareIds.length < 2) return;
  var products = compareIds.map(getProductById).filter(Boolean);
  lastCompareTrigger = document.activeElement;
  renderCompareContent(products);
  document.getElementById('compare-print-date').textContent = new Intl.DateTimeFormat('en-IN', { day:'2-digit', month:'short', year:'numeric' }).format(new Date());
  document.getElementById('compare-modal').classList.add('show');
  document.getElementById('compare-close').focus();
  document.body.style.overflow = 'hidden';
  syncCompareUrl();
}

function comparisonUrl() {
  var url = new URL(window.location.href);
  url.searchParams.delete('product');
  url.searchParams.delete('model');
  url.searchParams.set('compare', compareIds.map(function(id) {
    var variant = compareVariants[id] === undefined ? 'overview' : compareVariants[id];
    return id + ':' + variant;
  }).join(','));
  return url;
}

function syncCompareUrl() {
  if (compareIds.length < 2) return;
  history.replaceState(null,'',comparisonUrl().pathname + comparisonUrl().search);
}

function loadSharedComparison() {
  var encoded = new URLSearchParams(window.location.search).get('compare');
  if (!encoded) return false;
  encoded.split(',').slice(0,3).forEach(function(entry) {
    var parts = entry.split(':');
    var product = getProductById(parts[0]);
    if (!product || compareIds.indexOf(product.id) >= 0) return;
    compareIds.push(product.id);
    var variant = parts[1] || 'overview';
    if (variant === 'overview' || (product.specs && product.specs[Number(variant)])) compareVariants[product.id] = variant;
  });
  return compareIds.length >= 2;
}

function clearComparisonUrl() {
  var url = new URL(window.location.href);
  url.searchParams.delete('compare');
  history.replaceState(null,'',url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
}

function renderCompareContent(products) {
  document.getElementById('compare-table-wrap').innerHTML =
    '<div class="compare-guidance"><strong>Choose how to compare:</strong> “All models” shows the complete catalogue range. Select a specific model under each product for exact, like-for-like specifications.</div>' +
    buildCompareTable(products) + buildCompareCards(products);
}

function selectedVariant(product) {
  var value = compareVariants[product.id];
  if (value === undefined || value === 'overview') return null;
  var index = Number(value);
  return product.specs && product.specs[index] ? product.specs[index] : null;
}

function variantSelector(product) {
  var current = compareVariants[product.id] === undefined ? 'overview' : String(compareVariants[product.id]);
  var options = ['<option value="overview"' + (current === 'overview' ? ' selected' : '') + '>All models (range)</option>'];
  (product.specs || []).forEach(function(spec, index) {
    var label = spec.type || ((product.models || [])[index]) || ('Model ' + (index + 1));
    options.push('<option value="' + index + '"' + (current === String(index) ? ' selected' : '') + '>' + esc(label) + '</option>');
  });
  return '<label class="compare-model-label">Model variant<select class="compare-model-select" data-compare-variant="' + product.id + '">' + options.join('') + '</select></label>';
}

function numericValues(value) {
  if (value === undefined || value === null || value === '' || value === '-' || value === '—') return [];
  var matches = String(value).match(/-?\d+(?:\.\d+)?/g);
  return matches ? matches.map(Number).filter(function(n) { return Number.isFinite(n); }) : [];
}

function compactNumber(value) {
  return Number(value.toFixed(1)).toLocaleString('en-IN');
}

function familyRange(product, key, unit, transform) {
  var values = [];
  (product.specs || []).forEach(function(spec) {
    numericValues(spec[key]).forEach(function(value) { values.push(transform ? transform(value) : value); });
  });
  if (!values.length) return 'Available on request';
  var min = Math.min.apply(null, values);
  var max = Math.max.apply(null, values);
  return compactNumber(min) + (min === max ? '' : '–' + compactNumber(max)) + ' ' + unit;
}

function exactValue(spec, key, unit, transform) {
  if (!spec || spec[key] === undefined || spec[key] === null || spec[key] === '-' || spec[key] === '—') return 'Available on request';
  var values = numericValues(spec[key]);
  if (transform && values.length) return values.map(function(value) { return compactNumber(transform(value)); }).join('/') + ' ' + unit;
  var raw = String(spec[key]).replace(/\s*(V|W|A|Hz|RPM|rpm|kg|°C|dBA|mm-wc|CMH)\s*/gi, '').trim();
  return esc(raw) + ' ' + unit;
}

function comparisonValue(product, key, unit, transform) {
  var variant = selectedVariant(product);
  return variant ? exactValue(variant, key, unit, transform) : familyRange(product, key, unit, transform);
}

function comparisonValueAny(product, keys, unit, transform) {
  var variant = selectedVariant(product);
  if (variant) {
    var exactKey = keys.find(function(key) { return variant[key] !== undefined && variant[key] !== null && variant[key] !== '-' && variant[key] !== '—'; });
    return exactKey ? exactValue(variant, exactKey, unit, transform) : 'Available on request';
  }
  var familyKey = keys.find(function(key) {
    return (product.specs || []).some(function(spec) { return numericValues(spec[key]).length > 0; });
  });
  return familyKey ? familyRange(product, familyKey, unit, transform) : 'Available on request';
}

function supplyValue(product) {
  var variant = selectedVariant(product);
  if (!variant) {
    var supplies = [];
    (product.specs || []).forEach(function(spec) {
      if (spec.supply && supplies.indexOf(spec.supply) < 0) supplies.push(spec.supply);
    });
    return supplies.length ? esc(supplies.slice(0, 3).join(' · ')) + (supplies.length > 3 ? ' · …' : '') : 'Available on request';
  }
  return esc(String(variant.supply || variant.voltage || 'Available on request')
    .replace(/(\d)\s*V/g, '$1 V').replace(/(\d)\s*Hz/g, '$1 Hz'));
}

function modelValue(product) {
  var variant = selectedVariant(product);
  if (variant) return esc(variant.type || 'Selected model');
  var count = (product.specs || []).length;
  return count ? count + ' model variant' + (count === 1 ? '' : 's') : 'Custom specification';
}

function closeCompare() {
  document.getElementById('compare-modal').classList.remove('show');
  document.body.style.overflow = '';
  if (lastCompareTrigger && typeof lastCompareTrigger.focus === 'function') lastCompareTrigger.focus();
}

function buildCompareTable(products) {
  var rows = [
    ['Product', function(p) { return '<div class="compare-product-name">' + esc(p.name) + '</div><div class="compare-product-cat">' + esc(p.category) + '</div>' + variantSelector(p); }],
    ['Selected scope', modelValue],
    ['Applications', function(p) { return esc((p.applications || []).slice(0, 5).join(' · ')); }],
    ['Airflow', function(p) { return comparisonValueAny(p, ['airflow_cmh','airflow'], 'CMH'); }],
    ['Static pressure', function(p) { return comparisonValue(p, 'static_pr', 'mm-wc'); }],
    ['Input power', function(p) { return comparisonValueAny(p, ['watts','watts_max'], 'W'); }],
    ['Speed', function(p) { return comparisonValue(p, 'rpm', 'RPM'); }],
    ['Electrical supply', supplyValue],
    ['Current', function(p) { return comparisonValueAny(p, ['amps','amps_max','current'], 'A'); }],
    ['Sound level', function(p) { return comparisonValue(p, 'dba', 'dBA'); }],
    ['Ambient temperature', function(p) { return comparisonValue(p, 'amb_temp', '°C'); }],
    ['Weight', function(p) { return comparisonValue(p, 'weight', 'Kg'); }],
    ['Datasheet', function(p) { return PDF_MAP[p.id] ? '<a href="' + PDF_MAP[p.id] + '" target="_blank">Download</a>' : '<a href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hello SEM, please share the datasheet for ' + p.name + '.') + '" target="_blank">Request</a>'; }]
  ];
  return '<table class="compare-table"><tbody>' + rows.map(function(row) {
    return '<tr><td>' + row[0] + '</td>' + products.map(function(p) { return '<td>' + row[1](p) + '</td>'; }).join('') + '</tr>';
  }).join('') + '</tbody></table>';
}

function buildCompareCards(products) {
  return '<div class="compare-card-list">' + products.map(function(p) {
    var datasheet = PDF_MAP[p.id]
      ? '<a href="' + PDF_MAP[p.id] + '" target="_blank">Download datasheet</a>'
      : '<a href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hello SEM, please share the datasheet for ' + p.name + '.') + '" target="_blank">Request datasheet</a>';
    var specs = [
      ['Selected scope', modelValue(p)],
      ['Applications', esc((p.applications || []).slice(0, 5).join(' · '))],
      ['Airflow', comparisonValueAny(p, ['airflow_cmh','airflow'], 'CMH')],
      ['Static pressure', comparisonValue(p, 'static_pr', 'mm-wc')],
      ['Input power', comparisonValueAny(p, ['watts','watts_max'], 'W')],
      ['Speed', comparisonValue(p, 'rpm', 'RPM')],
      ['Electrical supply', supplyValue(p)],
      ['Current', comparisonValueAny(p, ['amps','amps_max','current'], 'A')],
      ['Sound level', comparisonValue(p, 'dba', 'dBA')],
      ['Ambient temperature', comparisonValue(p, 'amb_temp', '°C')],
      ['Weight', comparisonValue(p, 'weight', 'Kg')],
      ['Datasheet', datasheet]
    ];
    return '<article class="compare-card">' +
      '<div class="compare-card-head"><div class="compare-product-name">' + esc(p.name) + '</div><div class="compare-product-cat">' + esc(p.category) + '</div>' + variantSelector(p) + '</div>' +
      specs.map(function(row) {
        return '<div class="compare-card-row"><div class="compare-card-label">' + row[0] + '</div><div class="compare-card-value">' + row[1] + '</div></div>';
      }).join('') +
    '</article>';
  }).join('') + '</div>';
}

function specRange(product, keys) {
  var values = [];
  (product.specs || []).forEach(function(spec) {
    keys.forEach(function(key) {
      if (spec[key] !== undefined && spec[key] !== null && spec[key] !== '-') values.push(String(spec[key]));
    });
  });
  values = values.filter(function(v, i) { return values.indexOf(v) === i; });
  if (!values.length) return 'On request';
  return values.slice(0, 4).join(' · ') + (values.length > 4 ? ' · ...' : '');
}

// Guided product selector
var guideForm = document.getElementById('guided-selector-form');
var guideAirflow = document.getElementById('guide-airflow');
var guidePressure = document.getElementById('guide-pressure');
var guideSupply = document.getElementById('guide-supply');
var guideResults = document.getElementById('guided-results');
var guidedSelector = document.getElementById('guided-selector');

function maxCatalogueValue(product, keys) {
  var values = [];
  (product.specs || []).forEach(function(spec) {
    keys.forEach(function(key) { numericValues(spec[key]).forEach(function(value) { values.push(value); }); });
  });
  return values.length ? Math.max.apply(null, values) : 0;
}

function guideMatches() {
  var purposeInput = guideForm.querySelector('[name="guide-purpose"]:checked');
  var purpose = purposeInput ? purposeInput.value : '';
  var purposes = {
    hvac:{ label:'space cooling or ventilation', terms:['hvac','air conditioning','ventilation','refrigeration'] },
    fume:{ label:'fume or contaminated-air removal', terms:['fume','extraction','welding','chemical','exhaust'] },
    equipment:{ label:'machinery or equipment cooling', terms:['motor cooling','electronic cooling','condenser cooling','forced cooling','control panel'] },
    duct:{ label:'ducted air movement', terms:['duct','inline','air handling'] },
    process:{ label:'industrial process support', terms:['plastic extrusion','process','burner','industrial cooling'] },
    railway:{ label:'railway applications', terms:['railway','indian railways'] }
  };
  var purposeInfo = purposes[purpose];
  var airflow = Number(guideAirflow.value) || 0;
  var pressure = Number(guidePressure.value) || 0;
  var supply = guideSupply.value;
  return SEM_PRODUCTS.map(function(product) {
    var appText = normalizeUsage((product.applications || []).join(' ') + ' ' + product.description + ' ' + product.category);
    var maxAirflow = maxCatalogueValue(product,['airflow_cmh','airflow']);
    var maxPressure = maxCatalogueValue(product,['static_pr']);
    var supplyMatch = !supply || (product.specs || []).some(function(spec) { return String(spec.supply || '').indexOf(supply) >= 0; });
    var reasons = [];
    var score = 0;
    var railwayModel = purpose === 'railway' && (product.id === 'induction-motors' || (product.models || []).some(function(model) { return /^IR\s/i.test(model); }));
    var purposeMatch = purposeInfo && (railwayModel || purposeInfo.terms.some(function(term) { return appText.indexOf(normalizeUsage(term)) >= 0; }));
    if (purposeMatch) { score += 45; reasons.push('suited to ' + purposeInfo.label); }
    else if (purposeInfo) score -= 30;
    if (airflow && maxAirflow >= airflow) { score += 25; reasons.push('up to ' + compactNumber(maxAirflow) + ' CMH'); }
    else if (airflow) score -= 35;
    if (pressure && maxPressure >= pressure) { score += 20; reasons.push('up to ' + compactNumber(maxPressure) + ' mm-wc'); }
    else if (pressure) score -= 30;
    if (supplyMatch && supply) { score += 10; reasons.push(supply === '1Ø' ? 'single-phase option' : 'three-phase option'); }
    else if (supply) score -= 20;
    return { product:product, score:score, reasons:reasons };
  }).filter(function(item) { return item.score > 0; }).sort(function(a,b) { return b.score-a.score; }).slice(0,3);
}

function renderGuideResults(matches) {
  if (!guideResults) return;
  if (!matches.length) {
    guideResults.innerHTML = '<div class="guided-empty"><strong>No confident catalogue match yet.</strong> Adjust one requirement or send the values to SEM engineering for a custom recommendation.</div>';
    return;
  }
  guideResults.innerHTML = matches.map(function(item,index) {
    var p = item.product;
    var query = new URLSearchParams({ product:p.name, enquiry_type:'Product Recommendation', requirements:'Please confirm suitability for: ' + item.reasons.join(', ') });
    return '<article class="guided-result"><div class="guided-result-rank">Match ' + (index+1) + '</div><h3>' + esc(p.name) + '</h3><p>' + esc(item.reasons.join(' · ')) + '</p><div class="guided-result-actions"><button type="button" data-guide-open="' + p.id + '">View models</button><a href="/contact/?' + query.toString() + '">Ask an engineer</a></div></article>';
  }).join('');
}

if (guideForm) {
  var guidedSummary = guidedSelector.querySelector(':scope > summary');
  var guidedBody = guidedSelector.querySelector('.guided-selector-body');
  var guidedAnimation = null;
  guidedSummary.addEventListener('click',function(event) {
    event.preventDefault();
    if (guidedAnimation) guidedAnimation.cancel();
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !guidedBody.animate) {
      guidedSelector.open = !guidedSelector.open;
      return;
    }
    var closing = guidedSelector.open;
    if (!closing) guidedSelector.open = true;
    guidedSelector.classList.toggle('closing',closing);
    guidedSelector.classList.toggle('opening',!closing);
    guidedBody.style.overflow = 'hidden';
    var fullHeight = guidedBody.scrollHeight;
    guidedAnimation = guidedBody.animate(closing ? [
      { height:fullHeight + 'px', opacity:1 },
      { height:'0px', opacity:0 }
    ] : [
      { height:'0px', opacity:0 },
      { height:fullHeight + 'px', opacity:1 }
    ], { duration:360, easing:'cubic-bezier(.22,.75,.2,1)' });
    guidedAnimation.onfinish = function() {
      if (closing) guidedSelector.open = false;
      guidedBody.style.height = '';
      guidedBody.style.opacity = '';
      guidedBody.style.overflow = '';
      guidedSelector.classList.remove('closing','opening');
      guidedAnimation = null;
    };
    guidedAnimation.oncancel = function() {
      guidedBody.style.height = '';
      guidedBody.style.opacity = '';
      guidedBody.style.overflow = '';
      guidedSelector.classList.remove('closing','opening');
      guidedAnimation = null;
    };
  });
  guidedSelector.addEventListener('toggle',function() {
    if (guidedSelector.open) clearUsageSearch(true);
  });
  guideForm.addEventListener('submit',function(event) {
    event.preventDefault();
    var matches = guideMatches();
    renderGuideResults(matches);
    document.dispatchEvent(new CustomEvent('sem:analytics',{detail:{event:'guided_selector_completed',matches:matches.length}}));
  });
  document.getElementById('guided-reset').addEventListener('click',function() { guideForm.reset(); guideResults.innerHTML = ''; });
  guideResults.addEventListener('click',function(event) {
    var button = event.target.closest('[data-guide-open]');
    if (button) openModal(button.dataset.guideOpen);
  });
}

// Category tabs
document.getElementById('cat-tabs').addEventListener('click', function(e) {
  var tab = e.target.closest('.cat-tab');
  if (!tab) return;
  clearUsageSearch(false);
  document.querySelectorAll('.cat-tab').forEach(function(t) { t.classList.remove('active'); });
  tab.classList.add('active');
  var grid = document.getElementById('prod-grid');
  grid.classList.remove('visible');
  buildGrid(tab.dataset.cat);
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { grid.classList.add('visible'); });
  });
});

// Usage/application search
var usageAliases = {
  ac: 'air conditioning',
  ahu: 'air handling units',
  hvac: 'hvac air conditioning ventilation',
  vfd: 'variable frequency drives',
  kitchen: 'kitchen ventilation exhaust',
  bathroom: 'bathroom exhaust inline ventilation',
  fumes: 'fume extraction welding fume removal chemical fume extraction',
  cooling: 'industrial cooling electronic cooling motor cooling condenser cooling forced cooling',
  duct: 'duct booster inline ventilation',
  railway: 'indian railways railway'
};
var popularUsage = ['HVAC','Air Conditioning','Fume Extraction','Motor Cooling','Inline Ventilation','1EC','SDB 133','20AF','MB 1BT'];
var usageInput = document.getElementById('usage-search-input');
var usageStatus = document.getElementById('usage-search-status');
var usageChips = document.getElementById('usage-search-chips');
var usageClear = document.getElementById('usage-search-clear');

if (usageChips) {
  usageChips.innerHTML = popularUsage.map(function(app) {
    return '<button class="usage-search-chip" type="button" data-usage="' + esc(app) + '">' + esc(app) + '</button>';
  }).join('');
  usageChips.addEventListener('click', function(e) {
    var chip = e.target.closest('[data-usage]');
    if (!chip) return;
    usageInput.value = chip.dataset.usage;
    runUsageSearch(usageInput.value);
    usageInput.focus();
  });
}

function renderProductSeoLinks() {
  var wrap = document.getElementById('product-seo-links');
  if (!wrap || typeof SEM_PRODUCTS === 'undefined') return;
  wrap.innerHTML = SEM_PRODUCTS.map(function(p) {
    return '<a href="/products/' + encodeURIComponent(p.id) + '/">' + esc(p.name) + '</a>';
  }).join('');
}

function injectProductItemListSchema() {
  if (typeof SEM_PRODUCTS === 'undefined' || document.getElementById('product-item-list-schema')) return;
  var schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'SEM Product Catalogue',
    itemListElement: SEM_PRODUCTS.map(function(p, i) {
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: 'https://www.superiorelectric.in/products/' + encodeURIComponent(p.id) + '/',
        name: p.name
      };
    })
  };
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'product-item-list-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function productFallback(category) {
  var label = esc(category || 'Product');
  var key = String(category || '').toLowerCase();
  var svg;
  if (key.indexOf('motor') >= 0) {
    svg = '<svg viewBox="0 0 80 80" fill="none"><rect x="18" y="27" width="38" height="26" rx="6" stroke="currentColor" stroke-width="2.4"/><path d="M56 34h8v12h-8M18 34h-6v12h6M25 22h24M25 58h24" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M27 32h20M27 38h20M27 44h20M27 50h20" stroke="currentColor" stroke-width="1.4" opacity=".55"/></svg>';
  } else if (key.indexOf('axial') >= 0) {
    svg = '<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="27" stroke="currentColor" stroke-width="2.4"/><circle cx="40" cy="40" r="8" stroke="currentColor" stroke-width="2.4"/><path d="M41 31c9-13 22-5 13 6-4 5-10 4-13 3M49 43c15 2 16 17 2 16-6 0-9-6-10-10M35 47c-7 13-21 7-14-6 3-5 9-6 13-4" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/><path d="M40 13v8M40 59v8M13 40h8M59 40h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" opacity=".65"/></svg>';
  } else if (key.indexOf('special') >= 0) {
    svg = '<svg viewBox="0 0 80 80" fill="none"><path d="M19 50h42M23 50V29h34v21M29 29v-7h22v7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 38h22M29 44h22M22 57h36" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".58"/><circle cx="29" cy="58" r="3" fill="currentColor" opacity=".35"/><circle cx="51" cy="58" r="3" fill="currentColor" opacity=".35"/></svg>';
  } else {
    svg = '<svg viewBox="0 0 80 80" fill="none"><path d="M21 45c0-13 9-24 23-24h10v38H44c-14 0-23-11-23-24Z" stroke="currentColor" stroke-width="2.4"/><path d="M54 29h8M54 51h8M25 35h20M25 41h20M25 47h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".62"/><circle cx="45" cy="40" r="7" stroke="currentColor" stroke-width="2"/></svg>';
  }
  return '<div class="prod-fallback">' + svg + '<span>' + label + '</span></div>';
}
if (usageInput) usageInput.addEventListener('input', function() { runUsageSearch(usageInput.value); });
if (usageClear) usageClear.addEventListener('click', function() {
  usageInput.value = '';
  clearUsageSearch(true);
  usageInput.focus();
});

function runUsageSearch(value) {
  var query = normalizeUsage(value);
  if (query && guidedSelector) {
    guidedSelector.open = false;
    if (guideResults) guideResults.innerHTML = '';
  }
  if (usageClear) usageClear.classList.toggle('show', !!query);
  document.querySelectorAll('.cat-tab').forEach(function(t) { t.classList.toggle('active', t.dataset.cat === 'all'); });

  if (!query) {
    renderProductCards(SEM_PRODUCTS);
    if (usageStatus) usageStatus.textContent = 'Start typing to filter the catalogue by usage or model number.';
    return;
  }

  var matches = scoreUsageProducts(query).slice(0, 24).map(function(item) { return item.product; });
  renderProductCards(matches);
  if (usageStatus) usageStatus.textContent = matches.length
    ? matches.length + ' product ' + (matches.length === 1 ? 'match' : 'matches') + ' for "' + value.trim() + '".'
    : 'No direct match found for "' + value.trim() + '".';
}

function scoreUsageProducts(query) {
  var expanded = expandUsageQuery(query);
  var words = expanded.split(' ').filter(Boolean);
  return SEM_PRODUCTS.map(function(product) {
    var apps = product.applications || [];
    var appText = normalizeUsage(apps.join(' '));
    var nameText = normalizeUsage(product.name);
    var categoryText = normalizeUsage(product.category);
    var modelText = normalizeUsage((product.models || []).join(' '));
    var descriptionText = normalizeUsage(product.description || '');
    var haystack = [appText, nameText, categoryText, modelText, descriptionText].join(' ');
    var score = 0;
    if (appText.indexOf(query) >= 0) score += 90;
    if (appText.indexOf(expanded) >= 0) score += 80;
    if (nameText.indexOf(query) >= 0) score += 45;
    if (categoryText.indexOf(query) >= 0) score += 30;
    if (modelText.indexOf(query) >= 0) score += 25;
    if (descriptionText.indexOf(query) >= 0) score += 18;
    words.forEach(function(word) {
      if (word.length < 2) return;
      if (appText.indexOf(word) >= 0) score += 12;
      else if (haystack.indexOf(word) >= 0) score += 4;
    });
    return { product: product, score: score };
  }).filter(function(item) {
    return item.score > 0;
  }).sort(function(a, b) {
    return b.score - a.score || a.product.name.localeCompare(b.product.name);
  });
}

function clearUsageSearch(renderAll) {
  if (usageInput) usageInput.value = '';
  if (usageClear) usageClear.classList.remove('show');
  if (usageStatus) usageStatus.textContent = 'Start typing to filter the catalogue by usage or model number.';
  if (renderAll) renderProductCards(SEM_PRODUCTS);
}

function expandUsageQuery(value) {
  var clean = normalizeUsage(value);
  var aliasText = clean.split(' ').map(function(word) { return usageAliases[word] || ''; }).filter(Boolean).join(' ');
  return normalizeUsage([clean, aliasText].filter(Boolean).join(' '));
}

function normalizeUsage(value) {
  return String(value || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
}

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, function(ch) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}

// ── MODAL ─────────────────────────────────────────────────────
function openModal(id) {
  var p = getProductById(id);
  if (!p) return;
  currentProduct = p;
  lastModalTrigger = document.activeElement;

  document.getElementById('pm-cat').textContent    = p.category;
  document.getElementById('pm-title').textContent  = p.name;
  document.getElementById('pm-models').textContent = 'Models: ' + p.models.join(' · ');
  document.getElementById('pm-desc').textContent   = p.description;
  document.getElementById('pm-tags').innerHTML     = p.applications.map(function(a) { return '<span class="pm-tag">' + a + '</span>'; }).join('');

  // Model selector
  var sel = document.getElementById('pm-sel');
  if (p.specs && p.specs.length > 0) {
    var keys = Object.keys(p.specs[0]);
    sel.innerHTML = p.specs.map(function(s) {
      var parts = [s[keys[0]], s.supply, s.watts ? s.watts + 'W' : '', s.rpm ? s.rpm + 'RPM' : ''].filter(Boolean);
      return '<option value="' + s[keys[0]] + '">' + parts.join(' — ') + '</option>';
    }).join('');
  } else {
    sel.innerHTML = '<option>Custom — contact for specs</option>';
  }
  var requestedModel = new URLSearchParams(window.location.search).get('product') === p.id
    ? new URLSearchParams(window.location.search).get('model') : '';
  if (requestedModel && Array.from(sel.options).some(function(option) { return option.value === requestedModel; })) sel.value = requestedModel;
  sel.onchange = function() { syncProductModelUrl(); };

  // Carousel
  var slot = document.getElementById('pm-carousel-slot');
  slot.innerHTML = '';
  var imgs = p.images || [];
  carTotal = Math.max(imgs.length, 1);
  carIdx = 0;
  var slides = Array.from({length: carTotal}, function(_, i) {
    return imgs[i]
      ? '<div class="car-slide"><img src="' + productCardImage(imgs[i], p.id) + '" alt="' + p.name + ' ' + (i+1) + '" loading="lazy" decoding="async" width="560" height="300" data-original-src="' + imgs[i] + '"></div>'
      : '<div class="car-slide"><svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#2A6496" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="32" cy="32" r="11" stroke="#2A6496" stroke-width="1.5"/><circle cx="32" cy="32" r="3.5" fill="#2A6496" opacity="0.35"/></svg><span>Image ' + (i+1) + ' — add to images/products/</span></div>';
  });
  var carHtml = '<div class="carousel"><div class="car-track" id="car-track">' + slides.join('') + '</div>';
  if (carTotal > 1) {
    carHtml += '<div class="car-btn car-prev" id="car-prev">‹</div><div class="car-btn car-next" id="car-next">›</div>';
    carHtml += '<div class="car-dots">' + slides.map(function(_,i) { return '<div class="car-dot' + (i===0?' active':'') + '" data-i="' + i + '"></div>'; }).join('') + '</div>';
  }
  carHtml += '</div>';
  slot.innerHTML = carHtml;
  if (carTotal > 1) {
    document.getElementById('car-prev').onclick = function() { goCar(carIdx - 1); };
    document.getElementById('car-next').onclick = function() { goCar(carIdx + 1); };
    slot.querySelectorAll('.car-dot').forEach(function(d) { d.onclick = function() { goCar(+d.dataset.i); }; });
  }
  // Spec table
  var wrap = document.getElementById('pm-table');
  if (p.specs && p.specs.length > 0) {
    var k = Object.keys(p.specs[0]);
    var cols = (p.spec_columns && p.spec_columns.length === k.length) ? p.spec_columns : k.map(function(x) { return x.replace(/_/g,' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); }); });
    wrap.innerHTML = '<table class="pm-table"><thead><tr>' + cols.map(function(c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
      p.specs.map(function(row) {
        return '<tr>' + k.map(function(key) {
          var v = row[key];
          return '<td>' + (v === null || v === undefined || v === '-' ? '—' : v) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  } else {
    wrap.innerHTML = '<p style="padding:18px;color:#718096;font-size:.85rem;">Specifications available on request — contact us.</p>';
  }

  // Note
  var noteEl = document.getElementById('pm-note');
  noteEl.textContent = p.note || '';
  noteEl.style.display = p.note ? 'block' : 'none';

  // Datasheet button
  var existingDs = document.getElementById('pm-datasheet');
  if (existingDs) existingDs.remove();
  if (PDF_MAP[p.id]) {
    var dsBtn = document.createElement('a');
    dsBtn.id = 'pm-datasheet';
    dsBtn.href = PDF_MAP[p.id];
    dsBtn.target = '_blank';
    dsBtn.className = 'datasheet-btn';
    dsBtn.innerHTML = '<span class="ui-icon ui-icon-file" aria-hidden="true"></span> Download Datasheet';
    document.getElementById('pm-body').appendChild(dsBtn);
  } else {
    var reqBtn = document.createElement('a');
    reqBtn.id = 'pm-datasheet';
    reqBtn.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Hello SEM, please share the datasheet for ' + p.name + '.');
    reqBtn.target = '_blank';
    reqBtn.className = 'datasheet-btn';
    reqBtn.innerHTML = '<span class="ui-icon ui-icon-file" aria-hidden="true"></span> Request Datasheet';
    document.getElementById('pm-body').appendChild(reqBtn);
  }

  document.getElementById('pm-body').scrollTop = 0;
  document.getElementById('pm-backdrop').classList.add('show');
  document.getElementById('pmodal').classList.add('show');
  document.body.style.overflow = 'hidden';
  document.getElementById('pm-x').focus();

  var addBtn = document.getElementById('pm-add-cart');
  addBtn.innerHTML = '<span class="ui-icon ui-icon-cart" aria-hidden="true"></span> Add to Cart';
  addBtn.classList.remove('added');
  syncProductModelUrl();
}

function syncProductModelUrl() {
  if (!currentProduct) return;
  var url = new URL(window.location.href);
  url.searchParams.delete('compare');
  url.searchParams.set('product',currentProduct.id);
  var model = document.getElementById('pm-sel').value;
  if (model) url.searchParams.set('model',model); else url.searchParams.delete('model');
  history.replaceState(null,'',url.pathname + '?' + url.searchParams.toString());
}

document.getElementById('pm-copy-model-link').onclick = function() {
  syncProductModelUrl();
  var button = this;
  var done = function() {
    button.textContent = 'Model link copied';
    window.setTimeout(function() { button.textContent = 'Copy link to this model'; },1600);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).then(done);
  else {
    var field = document.createElement('textarea'); field.value = window.location.href;
    document.body.appendChild(field); field.select(); document.execCommand('copy'); field.remove(); done();
  }
};

function goCar(n) {
  carIdx = ((n % carTotal) + carTotal) % carTotal;
  var track = document.getElementById('car-track');
  if (track) track.style.transform = 'translateX(-' + (carIdx * 100) + '%)';
  document.querySelectorAll('.car-dot').forEach(function(d, i) { d.classList.toggle('active', i === carIdx); });
}

function closeModal() {
  document.getElementById('pm-backdrop').classList.remove('show');
  document.getElementById('pmodal').classList.remove('show');
  document.body.style.overflow = '';
  var url = new URL(window.location.href);
  url.searchParams.delete('product');
  url.searchParams.delete('model');
  history.replaceState(null,'',url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
  if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') lastModalTrigger.focus();
}

document.getElementById('pm-x').onclick     = closeModal;
document.getElementById('pm-close2').onclick = closeModal;
document.getElementById('pm-backdrop').onclick = closeModal;

// Enquire
document.getElementById('pm-enquire').onclick = function() {
  var productName = currentProduct ? currentProduct.name : 'General Enquiry';
  var model = document.getElementById('pm-sel') ? document.getElementById('pm-sel').value : '';
  var msg = 'Hello SEM, I would like to enquire about ' + productName + (model ? ' / Model: ' + model : '') + '. Please share pricing, availability, and selection guidance.';
  document.getElementById('eq-name').textContent = productName;
  document.getElementById('eq-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  document.getElementById('eq-overlay').classList.add('open');
};
document.getElementById('eq-close').onclick = function() { document.getElementById('eq-overlay').classList.remove('open'); };
document.getElementById('eq-bg').onclick     = function() { document.getElementById('eq-overlay').classList.remove('open'); };

// Add to cart
document.getElementById('pm-add-cart').onclick = function() {
  if (!currentProduct) return;
  var sel = document.getElementById('pm-sel');
  var model = sel ? sel.value : (currentProduct.models[0] || 'Standard');
  var existing = null;
  cart.forEach(function(item) { if (item.productId === currentProduct.id && item.model === model) existing = item; });
  if (existing) { existing.qty++; } else {
    cart.push({ productId: currentProduct.id, name: currentProduct.name, category: currentProduct.category, model: model, qty: 1 });
  }
  saveCart();
  var btn = document.getElementById('pm-add-cart');
  btn.innerHTML = '<span class="ui-icon ui-icon-check" aria-hidden="true"></span> Added!';
  btn.classList.add('added');
  setTimeout(function() { btn.innerHTML = '<span class="ui-icon ui-icon-cart" aria-hidden="true"></span> Add to Cart'; btn.classList.remove('added'); }, 1800);
};

// ── CART ─────────────────────────────────────────────────────
function saveCart() {
  try { localStorage.setItem('sem-cart', JSON.stringify(cart)); } catch(e) {}
  updateBadge();
}

function readCustomerDetails() {
  try { return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || '{}'); }
  catch(e) { return {}; }
}

function saveCustomerDetails() {
  var details = {
    name: document.getElementById('cf-name').value.trim(),
    company: document.getElementById('cf-company').value.trim(),
    gst: document.getElementById('cf-gst').value.trim(),
    email: document.getElementById('cf-email').value.trim(),
    phone: document.getElementById('cf-phone').value.trim()
  };
  try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(details)); } catch(e) {}
}

function restoreCustomerDetails() {
  var details = readCustomerDetails();
  var values = {
    'cf-name': details.name,
    'cf-company': details.company,
    'cf-gst': details.gst,
    'cf-email': details.email,
    'cf-phone': details.phone
  };
  Object.keys(values).forEach(function(id) {
    var input = document.getElementById(id);
    if (input && values[id]) input.value = values[id];
  });
}

function updateBadge() {
  if (window.SEMNav && typeof window.SEMNav.updateCartBadges === 'function') {
    window.SEMNav.updateCartBadges(cart);
    return;
  }
  var total = cart.reduce(function(s,i) { return s + i.qty; }, 0);
  document.querySelectorAll('.cart-badge').forEach(function(badge) {
    badge.textContent = total;
    badge.classList.toggle('show', total > 0);
  });
}

document.querySelectorAll('.nav-cart-btn').forEach(function(btn) {
  btn.onclick = function(e) {
    e.preventDefault();
    openCart();
  };
});
document.getElementById('cart-close').onclick   = closeCart;
document.getElementById('cart-backdrop').onclick= closeCart;
document.getElementById('cart-back-btn').onclick = function() {
  setCheckoutStep(Math.max(1, checkoutStep - 1));
};
document.getElementById('cart-next-btn').onclick = function() {
  if (checkoutStep === 1) setCheckoutStep(2);
  else if (checkoutStep === 2 && detailsValid()) setCheckoutStep(3);
};
document.getElementById('order-summary-panel').addEventListener('click', function(e) {
  if (e.target.closest('[data-edit-details]')) setCheckoutStep(2);
});

function openCart() {
  lastCartTrigger = document.activeElement;
  if (window.SEMNav && typeof window.SEMNav.closeMobileNav === 'function') {
    window.SEMNav.closeMobileNav();
  }
  if (!cart.length) checkoutStep = 1;
  renderCart();
  document.getElementById('cart-backdrop').classList.add('show');
  document.getElementById('cart-drawer').classList.add('show');
  document.getElementById('cart-close').focus();
}

function closeCart() {
  document.getElementById('cart-backdrop').classList.remove('show');
  document.getElementById('cart-drawer').classList.remove('show');
  if (lastCartTrigger && typeof lastCartTrigger.focus === 'function') lastCartTrigger.focus();
}

function renderCart() {
  var itemsPanel   = document.getElementById('cart-items-panel');
  var summaryPanel = document.getElementById('order-summary-panel');
  var progress     = document.getElementById('checkout-progress');
  var clearBtn     = document.getElementById('clear-btn');

  if (cart.length === 0) {
    checkoutStep = 1;
    itemsPanel.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon"><span class="ui-icon ui-icon-cart" aria-hidden="true"></span></div><div>Your cart is empty</div><div class="cart-empty-copy">Add products from the catalogue to build your quote.</div><button class="cart-empty-btn" type="button" data-browse-products>Browse Products</button></div>';
    summaryPanel.innerHTML = '';
    progress.classList.remove('show');
    clearBtn.classList.remove('show');
    updateCheckoutStep();
    bindBrowseProductsAction(itemsPanel);
    return;
  }

  progress.classList.add('show');
  clearBtn.classList.add('show');

  itemsPanel.innerHTML = cart.map(function(item, idx) {
    return '<div class="cart-item">' +
      '<div class="cart-item-icon"><span class="ui-icon ui-icon-fan" aria-hidden="true"></span></div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-model">' + item.model + '</div>' +
        '<div class="cart-item-cat">' + item.category + '</div>' +
        '<div class="cart-qty-ctrl">' +
          '<div class="cart-qty-btn" onclick="changeQty(' + idx + ',-1)">−</div>' +
          '<div class="cart-qty-num">' + item.qty + '</div>' +
          '<div class="cart-qty-btn" onclick="changeQty(' + idx + ',1)">+</div>' +
        '</div>' +
        '<span class="cart-remove" onclick="removeItem(' + idx + ')"><span class="ui-icon ui-icon-close" aria-hidden="true"></span> Remove</span>' +
      '</div></div>';
  }).join('');

  summaryPanel.innerHTML = buildOrderSummary();
  updateCheckoutStep();
  bindBrowseProductsAction(itemsPanel);
}

function bindBrowseProductsAction(itemsPanel) {
  itemsPanel.querySelectorAll('[data-browse-products]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      closeCart();
      var grid = document.getElementById('prod-grid');
      if (grid) grid.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });
}

function setCheckoutStep(step) {
  checkoutStep = Math.max(1, Math.min(3, step));
  if (checkoutStep === 3 && !detailsValid()) checkoutStep = 2;
  updateCheckoutStep();
}

function updateCheckoutStep() {
  var hasItems = cart.length > 0;
  var totalItems = cart.reduce(function(s,i) { return s + i.qty; }, 0);
  var valid = detailsValid();
  var summary = document.getElementById('cart-summary');
  var actions = document.getElementById('cart-actions');
  var backBtn = document.getElementById('cart-back-btn');
  var nextBtn = document.getElementById('cart-next-btn');
  var waBtn = document.getElementById('wa-btn');
  var clearBtn = document.getElementById('clear-btn');
  var panels = [
    document.getElementById('cart-items-panel'),
    document.getElementById('cart-form'),
    document.getElementById('order-summary-panel')
  ];

  if (!hasItems) {
    panels.forEach(function(panel, i) { panel.classList.toggle('show', i === 0); });
    summary.textContent = '';
    actions.style.display = 'none';
    waBtn.disabled = true;
    return;
  }

  actions.style.display = 'grid';
  actions.classList.toggle('single', checkoutStep === 1);
  panels.forEach(function(panel, i) { panel.classList.toggle('show', i === checkoutStep - 1); });
  document.querySelectorAll('.checkout-step').forEach(function(stepEl) {
    var stepNo = Number(stepEl.dataset.step);
    stepEl.classList.toggle('active', stepNo === checkoutStep);
    stepEl.classList.toggle('done', stepNo < checkoutStep);
  });

  backBtn.style.display = checkoutStep === 1 ? 'none' : 'block';
  nextBtn.style.display = checkoutStep === 3 ? 'none' : 'block';
  waBtn.style.display = checkoutStep === 3 ? 'flex' : 'none';
  waBtn.disabled = !valid;
  nextBtn.disabled = checkoutStep === 2 && !valid;
  clearBtn.style.display = checkoutStep === 1 ? '' : 'none';

  if (checkoutStep === 1) {
    summary.innerHTML = '<strong>' + cart.length + ' product' + (cart.length>1?'s':'') + '</strong> · ' + totalItems + ' unit' + (totalItems>1?'s':'') + ' selected';
  } else if (checkoutStep === 2) {
    summary.textContent = valid ? 'Details verified. Continue to review your order.' : 'Enter valid customer details to continue.';
  } else {
    document.getElementById('order-summary-panel').innerHTML = buildOrderSummary();
    summary.innerHTML = '<strong>Review complete summary</strong> before sending the WhatsApp enquiry.';
  }
}

window.changeQty = function(idx, d) {
  cart[idx].qty = Math.max(1, cart[idx].qty + d);
  saveCart();
  renderCart();
};
window.removeItem = function(idx) {
  cart.splice(idx, 1);
  if (!cart.length) checkoutStep = 1;
  saveCart();
  renderCart();
};

document.getElementById('clear-btn').onclick = function() {
  if (!confirm('Clear all items from cart?')) return;
  cart = []; checkoutStep = 1; saveCart(); renderCart();
};

document.getElementById('compare-open').onclick = openCompare;
document.getElementById('compare-clear').onclick = function() {
  compareIds = [];
  compareVariants = {};
  refreshCompareState();
  clearComparisonUrl();
};
document.getElementById('compare-table-wrap').addEventListener('change', function(event) {
  var select = event.target.closest('[data-compare-variant]');
  if (!select) return;
  compareVariants[select.dataset.compareVariant] = select.value;
  renderCompareContent(compareIds.map(getProductById).filter(Boolean));
  syncCompareUrl();
});
document.getElementById('compare-share').onclick = function() {
  var button = this;
  var url = comparisonUrl().toString();
  var done = function() {
    var original = button.textContent;
    button.textContent = 'Link copied';
    window.setTimeout(function() { button.textContent = original; },1600);
    document.dispatchEvent(new CustomEvent('sem:analytics',{detail:{event:'comparison_shared',products:compareIds.length}}));
  };
  if (navigator.share) {
    navigator.share({ title:'SEM Product Comparison', text:'Compare these SEM product models and specifications.', url:url }).then(done).catch(function() {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(done);
  } else {
    var field = document.createElement('textarea');
    field.value = url; document.body.appendChild(field); field.select(); document.execCommand('copy'); field.remove(); done();
  }
};
document.getElementById('compare-print').onclick = function() {
  document.dispatchEvent(new CustomEvent('sem:analytics',{detail:{event:'comparison_printed',products:compareIds.length}}));
  window.print();
};
document.getElementById('compare-download').onclick = function() {
  var rows = Array.from(document.querySelectorAll('.compare-table tr')).map(function(row) {
    return Array.from(row.cells).map(function(cell) {
      return '"' + cell.innerText.replace(/\s+/g,' ').trim().replace(/"/g,'""') + '"';
    }).join(',');
  });
  var blob = new Blob(['\ufeff' + rows.join('\n')],{type:'text/csv;charset=utf-8'});
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'SEM-product-comparison.csv';
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href);
  document.dispatchEvent(new CustomEvent('sem:analytics',{detail:{event:'comparison_downloaded',products:compareIds.length}}));
};
document.getElementById('compare-close').onclick = closeCompare;
document.getElementById('compare-bg').onclick = closeCompare;

// ── GST VALIDATOR ─────────────────────────────────────────────
document.getElementById('cf-gst').addEventListener('input', function() {
  this.value = this.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
  var len = this.value.length;
  var hint = document.getElementById('gst-hint');
  var tick = document.getElementById('gst-tick');
  var ok = isGST(this.value);
  hint.textContent = ok ? 'GST number verified' : len + ' / 15 characters entered';
  hint.className = 'gst-hint' + (ok ? ' ok' : len > 0 ? ' bad' : '');
  this.classList.toggle('valid', ok);
  this.classList.toggle('error', len > 0 && !ok);
  tick.classList.toggle('show', ok);
  saveCustomerDetails();
  checkForm();
});

// ── FORM VALIDATION ───────────────────────────────────────────
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
function isGST(v) { return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v); }
function isPhone(v) {
  var digits = v.replace(/\D/g, '');
  return /^[6-9][0-9]{9}$/.test(digits) || /^91[6-9][0-9]{9}$/.test(digits);
}

function setFieldState(inputId, hintId, tickId, ok, message, touched) {
  var input = document.getElementById(inputId);
  var hint = document.getElementById(hintId);
  var tick = document.getElementById(tickId);
  hint.textContent = message;
  hint.className = 'field-hint' + (ok ? ' ok' : touched ? ' bad' : '');
  input.classList.toggle('valid', ok);
  input.classList.toggle('error', touched && !ok);
  tick.classList.toggle('show', ok);
}

function validateEmailField() {
  var input = document.getElementById('cf-email');
  var ok = isEmail(input.value.trim());
  setFieldState('cf-email', 'email-hint', 'email-tick', ok, ok ? 'Email address verified' : 'Use a valid email like name@company.com', input.value.trim().length > 0);
  saveCustomerDetails();
  checkForm();
}

function validatePhoneField() {
  var input = document.getElementById('cf-phone');
  var ok = isPhone(input.value);
  setFieldState('cf-phone', 'phone-hint', 'phone-tick', ok, ok ? 'Phone number verified' : 'Enter a valid 10 digit mobile number', input.value.trim().length > 0);
  saveCustomerDetails();
  checkForm();
}

function detailsValid() {
  var name    = document.getElementById('cf-name').value.trim();
  var company = document.getElementById('cf-company').value.trim();
  var gst     = document.getElementById('cf-gst').value.trim();
  var email   = document.getElementById('cf-email').value.trim();
  var phone   = document.getElementById('cf-phone').value.trim();
  return name.length > 1 && company.length > 1 && isGST(gst) && isEmail(email) && isPhone(phone);
}

function checkForm() {
  updateCheckoutStep();
}

['cf-name','cf-company'].forEach(function(id) {
  document.getElementById(id).addEventListener('input', function() {
    saveCustomerDetails();
    checkForm();
  });
});
document.getElementById('cf-email').addEventListener('input', validateEmailField);
document.getElementById('cf-phone').addEventListener('input', validatePhoneField);
restoreCustomerDetails();
document.getElementById('cf-gst').dispatchEvent(new Event('input'));
validateEmailField();
validatePhoneField();

function buildOrderSummary() {
  var name    = document.getElementById('cf-name').value.trim() || 'Not entered';
  var company = document.getElementById('cf-company').value.trim() || 'Not entered';
  var gst     = document.getElementById('cf-gst').value.trim() || 'Not entered';
  var email   = document.getElementById('cf-email').value.trim() || 'Not entered';
  var phone   = document.getElementById('cf-phone').value.trim() || 'Not entered';
  var itemRows = cart.map(function(item) {
    return '<div class="order-summary-row">' +
      '<div class="order-summary-main">' +
        '<div class="order-summary-name">' + item.name + '</div>' +
        '<div class="order-summary-meta">Model: ' + item.model + '<br>' + item.category + '</div>' +
      '</div>' +
      '<div class="order-summary-qty">Qty ' + item.qty + '</div>' +
    '</div>';
  }).join('');

  return '<div class="order-summary-block">' +
      '<div class="order-summary-head">Items</div>' +
      itemRows +
    '</div>' +
    '<div class="order-summary-block">' +
      '<div class="order-summary-head">Customer Details <button class="summary-edit" type="button" data-edit-details>Edit</button></div>' +
      '<div class="customer-summary-grid">' +
        '<div class="customer-summary-item"><div class="customer-summary-label">Name</div><div class="customer-summary-value">' + name + '</div></div>' +
        '<div class="customer-summary-item"><div class="customer-summary-label">Company</div><div class="customer-summary-value">' + company + '</div></div>' +
        '<div class="customer-summary-item"><div class="customer-summary-label">GST Number</div><div class="customer-summary-value">' + gst + '</div></div>' +
        '<div class="customer-summary-item"><div class="customer-summary-label">Email</div><div class="customer-summary-value">' + email + '</div></div>' +
        '<div class="customer-summary-item"><div class="customer-summary-label">Phone</div><div class="customer-summary-value">' + phone + '</div></div>' +
      '</div>' +
      '<div class="summary-note">Details are saved on this device for faster future enquiries.</div>' +
    '</div>';
}

// ── WHATSAPP ORDER ────────────────────────────────────────────
document.getElementById('wa-btn').onclick = function() {
  if (!cart.length) return;
  var name    = document.getElementById('cf-name').value.trim();
  var company = document.getElementById('cf-company').value.trim();
  var gst     = document.getElementById('cf-gst').value.trim();
  var email   = document.getElementById('cf-email').value.trim();
  var phone   = document.getElementById('cf-phone').value.trim();
  var lines = cart.map(function(item, i) {
    return (i+1) + '. ' + item.name + '\n   Model: ' + item.model + '\n   Quantity: ' + item.qty;
  }).join('\n\n');
  var msg = 'Hello SEM,\n\nI would like to place an enquiry for the following products:\n\n' + lines +
    '\n\n---\nCustomer Details:\nName: ' + name + '\nCompany: ' + company + '\nGST No: ' + gst + '\nEmail: ' + email + '\nPhone: ' + phone +
    '\n\nPlease contact me with pricing and availability.\n\nThank you.';
  window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank');
};

function trapFocus(e, container) {
  var focusable = Array.prototype.slice.call(container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter(function(el) { return el.offsetParent !== null; });
  if (!focusable.length) return;
  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// Keyboard escape
document.addEventListener('keydown', function(e) {
  var modalOpen = document.getElementById('pmodal').classList.contains('show');
  var cartOpen = document.getElementById('cart-drawer').classList.contains('show');
  var compareOpen = document.getElementById('compare-modal').classList.contains('show');
  if (e.key === 'Tab') {
    if (modalOpen) trapFocus(e, document.getElementById('pmodal'));
    else if (cartOpen) trapFocus(e, document.getElementById('cart-drawer'));
    else if (compareOpen) trapFocus(e, document.getElementById('compare-modal'));
    return;
  }
  if (e.key !== 'Escape') return;
  closeModal(); closeCart(); closeCompare();
  document.getElementById('eq-overlay').classList.remove('open');
});

// ── INIT ──────────────────────────────────────────────────────
var hasSharedComparison = loadSharedComparison();
buildGrid('all');
renderProductSeoLinks();
injectProductItemListSchema();
updateBadge();
openLinkedProduct();
if (hasSharedComparison) window.setTimeout(openCompare,120);

function openLinkedProduct() {
  var productId = new URLSearchParams(window.location.search).get('product');
  if (!productId || !getProductById(productId)) return;
  var card = Array.prototype.find.call(document.querySelectorAll('.prod-card[data-id]'), function(el) {
    return el.dataset.id === productId;
  });
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('linked-product');
    setTimeout(function() { card.classList.remove('linked-product'); }, 2200);
  }
  setTimeout(function() { openModal(productId); }, 450);
}

// ── SCROLL REVEAL (main.js not loaded on this page) ───────────
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

var staggerObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); staggerObs.unobserve(e.target); }
  });
}, { threshold: 0.05 });

document.querySelectorAll('[data-reveal]').forEach(function(el) { revealObs.observe(el); });
document.querySelectorAll('.stagger').forEach(function(el) { staggerObs.observe(el); });

})();

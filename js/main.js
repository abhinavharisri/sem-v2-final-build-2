/* ============================================================
   SEM® — main.js
   Nav scroll, hamburger, scroll reveal, counter animation,
   product modal, enquire modal, category filter, video reel,
   scroll progress bar, page fade
   ============================================================ */

// ── PAGE FADE ────────────────────────────────────────────────
document.body.classList.add('page-fade');

// ── SCROLL PROGRESS ──────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

const staggerObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); staggerObs.unobserve(e.target); }
  });
}, { threshold: 0.05 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));
document.querySelectorAll('.stagger').forEach(el => staggerObs.observe(el));

// ── COUNTER ANIMATION ────────────────────────────────────────
function animCount(el, target, suffix) {
  const dur = 1800, start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toLocaleString() + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(e.target, +e.target.dataset.count, e.target.dataset.suffix || '');
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// ── HERO VIDEO REEL ──────────────────────────────────────────
class VideoReel {
  constructor() {
    this.videos = [...document.querySelectorAll('.hero-visual .reel-video')];
    this.dots   = [...document.querySelectorAll('.hero-dot')];
    this.placeholder = document.getElementById('hero-placeholder');
    this.cur    = 0;
    this.timer  = null;
    this.hasLoaded = false;

    if (this.videos.length) {
      // Try to load first video, hide placeholder if it works
      const first = this.videos[0];
      first.addEventListener('canplay', () => {
        if (!this.hasLoaded) {
          this.hasLoaded = true;
          if (this.placeholder) this.placeholder.style.display = 'none';
          this.show(0);
          this.start();
        }
      }, { once: true });
      first.load();

      // If video fails, keep placeholder visible
      first.addEventListener('error', () => {
        if (this.placeholder) this.placeholder.style.display = 'flex';
      });
    }

    this.dots.forEach((d, i) => d.addEventListener('click', () => { this.show(i); this.start(); }));
  }
  show(i) {
    this.videos.forEach((v, j) => {
      v.style.opacity = j === i ? '1' : '0';
      if (j === i) { v.currentTime = 0; v.play().catch(() => {}); }
      else v.pause();
    });
    this.dots.forEach((d, j) => d.classList.toggle('active', j === i));
    this.cur = i;
  }
  start() {
    clearInterval(this.timer);
    if (this.videos.length < 2) return;
    this.timer = setInterval(() => this.show((this.cur + 1) % this.videos.length), 6000);
  }
}
new VideoReel();

// ── MODAL ────────────────────────────────────────────────────
const backdrop   = document.getElementById('modal-backdrop');
const modal      = document.getElementById('spec-modal');
const enquireOv  = document.getElementById('enquire-overlay');

let currentProductName = '';

function openModal(productId) {
  const p = (typeof getProductById === 'function') ? getProductById(productId) : null;
  if (!p || !modal) return;
  currentProductName = p.name;

  modal.querySelector('.modal-cat').textContent  = p.category;
  modal.querySelector('.modal-title').textContent = p.name;
  modal.querySelector('.modal-models').textContent = 'Models: ' + p.models.join(' · ');
  modal.querySelector('.modal-desc').textContent  = p.description;

  // Apps
  const appsEl = modal.querySelector('.modal-app-tags');
  appsEl.innerHTML = p.applications.map(a => `<span class="modal-app-tag">${a}</span>`).join('');

  // Spec table
  const wrap = modal.querySelector('.spec-wrap');
  if (p.specs && p.specs.length > 0) {
    const keys = Object.keys(p.specs[0]);
    const cols = p.spec_columns && p.spec_columns.length === keys.length
      ? p.spec_columns
      : keys.map(k => k.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase()));

    wrap.innerHTML = `<table class="spec-table">
      <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${p.specs.map(row =>
        `<tr>${keys.map(k => {
          const v = row[k];
          return `<td>${(v === null || v === undefined || v === '-') ? '—' : v}</td>`;
        }).join('')}</tr>`
      ).join('')}</tbody>
    </table>`;
  } else {
    wrap.innerHTML = '<p style="padding:20px;font-size:0.85rem;color:var(--text3);">Specifications available on request — contact us for detailed technical data.</p>';
  }

  // Note
  const noteEl = modal.querySelector('.modal-note');
  noteEl.textContent = p.note || '';
  noteEl.style.display = p.note ? 'block' : 'none';

  backdrop.classList.add('open');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  backdrop && backdrop.classList.remove('open');
  modal && modal.classList.remove('open');
  document.body.style.overflow = '';
}

function openEnquire(name) {
  if (!enquireOv) return;
  const n = name || currentProductName || 'General Enquiry';
  enquireOv.querySelector('.enquire-product-name').textContent = n;
  enquireOv.classList.add('open');
}

function closeEnquire() {
  enquireOv && enquireOv.classList.remove('open');
}

// Event listeners
backdrop && backdrop.addEventListener('click', closeModal);
document.querySelectorAll('.modal-close-btn').forEach(b => b.addEventListener('click', closeModal));
document.getElementById('enquire-btn') && document.getElementById('enquire-btn').addEventListener('click', () => openEnquire());
document.getElementById('enquire-close-btn') && document.getElementById('enquire-close-btn').addEventListener('click', closeEnquire);
document.querySelector('.enquire-bg') && document.querySelector('.enquire-bg').addEventListener('click', closeEnquire);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeEnquire(); }
});

// Product card click delegation
document.addEventListener('click', e => {
  const card = e.target.closest('[data-product-id]');
  if (card) openModal(card.dataset.productId);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('[data-product-id]');
  if (!card) return;
  e.preventDefault();
  openModal(card.dataset.productId);
});

// ── CATEGORY FILTER ──────────────────────────────────────────
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.product-card[data-cat]').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// ── CONTACT FORM ─────────────────────────────────────────────
const cf = document.getElementById('contact-form');
if (cf) {
  cf.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(cf).entries());
    const name = [d.first_name, d.last_name].filter(Boolean).join(' ');
    let msg = `*New Enquiry – SEM Air Moving Solutions*\n\n`;
    if (name)              msg += `*Name:* ${name}\n`;
    if (d.email)           msg += `*Email:* ${d.email}\n`;
    if (d.company)         msg += `*Company:* ${d.company}\n`;
    if (d.phone)           msg += `*Phone:* ${d.phone}\n`;
    if (d.enquiry_type)    msg += `*Enquiry Type:* ${d.enquiry_type}\n`;
    if (d.product)         msg += `*Product:* ${d.product}\n`;
    if (d.message)         msg += `\n*Requirements:*\n${d.message}`;
    window.open('https://wa.me/919448283843?text=' + encodeURIComponent(msg.trim()), '_blank');
  });
}

// ── SITE-WIDE CART DRAWER ────────────────────────────────────
(function initGlobalCart() {
  const cartBtns = Array.from(document.querySelectorAll('.nav-cart-btn'));
  if (!cartBtns.length || document.getElementById('cart-drawer')) return;

  const WA = '919448283843';
  let checkoutStep = 1;
  let cart = readCart();

  const drawerHtml = `
    <div class="global-cart-backdrop" id="global-cart-backdrop"></div>
    <div class="global-cart-drawer" id="global-cart-drawer">
      <div class="global-cart-head">
        <div>
          <div class="global-cart-title">Enquiry Cart</div>
          <div class="global-cart-sub">Complete your details to place order via WhatsApp</div>
        </div>
        <button class="global-cart-close" id="global-cart-close" aria-label="Close cart">✕</button>
      </div>
      <div class="global-checkout-progress" id="global-checkout-progress">
        <div class="global-checkout-step" data-step="1"><span class="global-checkout-dot">1</span><span class="global-checkout-label">Cart</span></div>
        <div class="global-checkout-step" data-step="2"><span class="global-checkout-dot">2</span><span class="global-checkout-label">Your Details</span></div>
        <div class="global-checkout-step" data-step="3"><span class="global-checkout-dot">3</span><span class="global-checkout-label">Summary</span></div>
      </div>
      <div class="global-cart-body">
        <div class="global-cart-panel show" id="global-cart-items"></div>
        <div class="global-cart-panel" id="global-cart-form">
          <div class="global-cart-form-title">Your Details — Required to Place Order</div>
          <div class="global-cf-row">
            <div class="global-cf-group">
              <label class="global-cf-label" for="global-cf-name">Full Name *</label>
              <input class="global-cf-input" id="global-cf-name" type="text" placeholder="Rajesh Kumar" autocomplete="name">
            </div>
            <div class="global-cf-group">
              <label class="global-cf-label" for="global-cf-company">Company *</label>
              <input class="global-cf-input" id="global-cf-company" type="text" placeholder="ABC Industries" autocomplete="organization">
            </div>
          </div>
          <div class="global-cf-group">
            <label class="global-cf-label" for="global-cf-gst">GST Number *</label>
            <div class="global-cf-wrap">
              <input class="global-cf-input" id="global-cf-gst" type="text" placeholder="22AAAAA0000A1Z5" maxlength="15" autocomplete="off" spellcheck="false">
              <div class="global-cf-tick" id="global-gst-tick">✓</div>
            </div>
            <div class="global-cf-hint" id="global-gst-hint">0 / 15 characters entered</div>
          </div>
          <div class="global-cf-row">
            <div class="global-cf-group">
              <label class="global-cf-label" for="global-cf-email">Email Address *</label>
              <div class="global-cf-wrap">
                <input class="global-cf-input" id="global-cf-email" type="email" placeholder="rajesh@company.com" autocomplete="email">
                <div class="global-cf-tick" id="global-email-tick">✓</div>
              </div>
              <div class="global-cf-hint" id="global-email-hint">Enter a valid email address</div>
            </div>
            <div class="global-cf-group">
              <label class="global-cf-label" for="global-cf-phone">Phone Number *</label>
              <div class="global-cf-wrap">
                <input class="global-cf-input" id="global-cf-phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel">
                <div class="global-cf-tick" id="global-phone-tick">✓</div>
              </div>
              <div class="global-cf-hint" id="global-phone-hint">Enter a 10 digit mobile number</div>
            </div>
          </div>
        </div>
        <div class="global-cart-panel" id="global-order-summary"></div>
      </div>
      <div class="global-cart-foot">
        <div class="global-cart-summary" id="global-cart-summary"></div>
        <div class="global-cart-actions" id="global-cart-actions">
          <button class="global-cart-back" id="global-cart-back">Back</button>
          <button class="global-cart-next" id="global-cart-next">Continue</button>
          <button class="global-wa-btn" id="global-wa-btn" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.121 1.528 5.855L.057 23.882l6.186-1.443A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.51-5.17-1.399l-.371-.218-3.844.896.934-3.739-.242-.386A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            Order on WhatsApp
          </button>
        </div>
        <button class="global-clear-btn" id="global-clear-btn">🗑 Clear Cart</button>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', drawerHtml);

  cartBtns.forEach(cartBtn => cartBtn.addEventListener('click', e => {
    e.preventDefault();
    openCart();
  }));

  document.getElementById('global-cart-close').addEventListener('click', closeCart);
  document.getElementById('global-cart-backdrop').addEventListener('click', closeCart);
  document.getElementById('global-cart-back').addEventListener('click', () => setCheckoutStep(checkoutStep - 1));
  document.getElementById('global-cart-next').addEventListener('click', () => {
    if (checkoutStep === 1) setCheckoutStep(2);
    else if (checkoutStep === 2 && detailsValid()) setCheckoutStep(3);
  });
  document.getElementById('global-clear-btn').addEventListener('click', () => {
    if (!confirm('Clear all items from cart?')) return;
    cart = [];
    checkoutStep = 1;
    saveCart();
    renderCart();
  });
  document.getElementById('global-wa-btn').addEventListener('click', openWhatsApp);
  document.getElementById('global-cf-gst').addEventListener('input', validateGST);
  document.getElementById('global-cf-email').addEventListener('input', validateEmailField);
  document.getElementById('global-cf-phone').addEventListener('input', validatePhoneField);
  ['global-cf-name', 'global-cf-company'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateCheckoutStep);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
  });

  updateBadge();

  function readCart() {
    try { return JSON.parse(localStorage.getItem('sem-cart') || '[]'); }
    catch(e) { return []; }
  }

  function saveCart() {
    try { localStorage.setItem('sem-cart', JSON.stringify(cart)); } catch(e) {}
    updateBadge();
  }

  function updateBadge() {
    if (window.SEMNav && typeof window.SEMNav.updateCartBadges === 'function') {
      window.SEMNav.updateCartBadges(cart);
      return;
    }
    const total = cart.reduce((s, i) => s + (Number(i.qty) || 0), 0);
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = total;
      badge.classList.toggle('show', total > 0);
    });
  }

  function openCart() {
    if (window.SEMNav && typeof window.SEMNav.closeMobileNav === 'function') {
      window.SEMNav.closeMobileNav();
    }
    cart = readCart();
    if (!cart.length) checkoutStep = 1;
    renderCart();
    document.getElementById('global-cart-backdrop').classList.add('show');
    document.getElementById('global-cart-drawer').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('global-cart-backdrop').classList.remove('show');
    document.getElementById('global-cart-drawer').classList.remove('show');
    document.body.style.overflow = '';
  }

  function renderCart() {
    const itemsPanel = document.getElementById('global-cart-items');
    const summaryPanel = document.getElementById('global-order-summary');
    const progress = document.getElementById('global-checkout-progress');
    const clearBtn = document.getElementById('global-clear-btn');

    if (!cart.length) {
      itemsPanel.innerHTML = '<div class="global-cart-empty"><div class="global-cart-empty-icon">🛒</div><div>Your cart is empty</div><div style="font-size:.75rem;color:#a0aec0;margin-top:4px;">Add products from the catalogue</div><a href="/products/" class="btn btn-primary btn-sm" style="margin-top:8px;">View Products</a></div>';
      summaryPanel.innerHTML = '';
      progress.classList.remove('show');
      clearBtn.classList.remove('show');
      updateCheckoutStep();
      return;
    }

    progress.classList.add('show');
    clearBtn.classList.add('show');
    itemsPanel.innerHTML = cart.map((item, idx) => `
      <div class="global-cart-item">
        <div class="global-cart-item-icon">⚙</div>
        <div style="flex:1;min-width:0;">
          <div class="global-cart-item-name">${esc(item.name)}</div>
          <div class="global-cart-item-model">${esc(item.model)}</div>
          <div class="global-cart-item-cat">${esc(item.category)}</div>
          <div class="global-cart-qty-ctrl">
            <button class="global-cart-qty-btn" data-cart-delta="-1" data-cart-index="${idx}">−</button>
            <div class="global-cart-qty-num">${Number(item.qty) || 1}</div>
            <button class="global-cart-qty-btn" data-cart-delta="1" data-cart-index="${idx}">+</button>
          </div>
          <button class="global-cart-remove" data-cart-remove="${idx}">✕ Remove</button>
        </div>
      </div>`).join('');

    itemsPanel.querySelectorAll('[data-cart-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.cartIndex);
        cart[idx].qty = Math.max(1, (Number(cart[idx].qty) || 1) + Number(btn.dataset.cartDelta));
        saveCart();
        renderCart();
      });
    });
    itemsPanel.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(Number(btn.dataset.cartRemove), 1);
        if (!cart.length) checkoutStep = 1;
        saveCart();
        renderCart();
      });
    });

    summaryPanel.innerHTML = buildOrderSummary();
    updateCheckoutStep();
  }

  function setCheckoutStep(step) {
    checkoutStep = Math.max(1, Math.min(3, step));
    if (checkoutStep === 3 && !detailsValid()) checkoutStep = 2;
    updateCheckoutStep();
  }

  function updateCheckoutStep() {
    const hasItems = cart.length > 0;
    const totalItems = cart.reduce((s, i) => s + (Number(i.qty) || 0), 0);
    const valid = detailsValid();
    const summary = document.getElementById('global-cart-summary');
    const actions = document.getElementById('global-cart-actions');
    const backBtn = document.getElementById('global-cart-back');
    const nextBtn = document.getElementById('global-cart-next');
    const waBtn = document.getElementById('global-wa-btn');
    const clearBtn = document.getElementById('global-clear-btn');
    const panels = [
      document.getElementById('global-cart-items'),
      document.getElementById('global-cart-form'),
      document.getElementById('global-order-summary')
    ];

    if (!hasItems) {
      panels.forEach((panel, i) => panel.classList.toggle('show', i === 0));
      summary.textContent = '';
      actions.style.display = 'none';
      waBtn.disabled = true;
      return;
    }

    actions.style.display = 'grid';
    actions.classList.toggle('single', checkoutStep === 1);
    panels.forEach((panel, i) => panel.classList.toggle('show', i === checkoutStep - 1));
    document.querySelectorAll('.global-checkout-step').forEach(stepEl => {
      const stepNo = Number(stepEl.dataset.step);
      stepEl.classList.toggle('active', stepNo === checkoutStep);
      stepEl.classList.toggle('done', stepNo < checkoutStep);
    });

    backBtn.style.display = checkoutStep === 1 ? 'none' : 'block';
    nextBtn.style.display = checkoutStep === 3 ? 'none' : 'block';
    waBtn.style.display = checkoutStep === 3 ? 'flex' : 'none';
    nextBtn.disabled = checkoutStep === 2 && !valid;
    waBtn.disabled = !valid;
    clearBtn.style.display = checkoutStep === 1 ? '' : 'none';

    if (checkoutStep === 1) {
      summary.innerHTML = '<strong>' + cart.length + ' product' + (cart.length > 1 ? 's' : '') + '</strong> · ' + totalItems + ' unit' + (totalItems > 1 ? 's' : '') + ' selected';
    } else if (checkoutStep === 2) {
      summary.textContent = valid ? 'Details verified. Continue to review your order.' : 'Enter valid customer details to continue.';
    } else {
      document.getElementById('global-order-summary').innerHTML = buildOrderSummary();
      summary.innerHTML = '<strong>Review complete summary</strong> before sending the WhatsApp enquiry.';
    }
  }

  function validateGST() {
    const input = document.getElementById('global-cf-gst');
    input.value = input.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
    const ok = isGST(input.value);
    setFieldState('global-cf-gst', 'global-gst-hint', 'global-gst-tick', ok, ok ? 'GST number verified' : input.value.length + ' / 15 characters entered', input.value.length > 0);
    updateCheckoutStep();
  }

  function validateEmailField() {
    const input = document.getElementById('global-cf-email');
    const ok = isEmail(input.value.trim());
    setFieldState('global-cf-email', 'global-email-hint', 'global-email-tick', ok, ok ? 'Email address verified' : 'Use a valid email like name@company.com', input.value.trim().length > 0);
    updateCheckoutStep();
  }

  function validatePhoneField() {
    const input = document.getElementById('global-cf-phone');
    const ok = isPhone(input.value);
    setFieldState('global-cf-phone', 'global-phone-hint', 'global-phone-tick', ok, ok ? 'Phone number verified' : 'Enter a valid 10 digit mobile number', input.value.trim().length > 0);
    updateCheckoutStep();
  }

  function setFieldState(inputId, hintId, tickId, ok, message, touched) {
    const input = document.getElementById(inputId);
    const hint = document.getElementById(hintId);
    const tick = document.getElementById(tickId);
    hint.textContent = message;
    hint.className = 'global-cf-hint' + (ok ? ' ok' : touched ? ' bad' : '');
    input.classList.toggle('valid', ok);
    input.classList.toggle('error', touched && !ok);
    tick.classList.toggle('show', ok);
  }

  function detailsValid() {
    return document.getElementById('global-cf-name').value.trim().length > 1 &&
      document.getElementById('global-cf-company').value.trim().length > 1 &&
      isGST(document.getElementById('global-cf-gst').value.trim()) &&
      isEmail(document.getElementById('global-cf-email').value.trim()) &&
      isPhone(document.getElementById('global-cf-phone').value.trim());
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function isGST(value) {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value);
  }

  function isPhone(value) {
    const digits = value.replace(/\D/g, '');
    return /^[6-9][0-9]{9}$/.test(digits) || /^91[6-9][0-9]{9}$/.test(digits);
  }

  function buildOrderSummary() {
    const name = document.getElementById('global-cf-name').value.trim() || 'Not entered';
    const company = document.getElementById('global-cf-company').value.trim() || 'Not entered';
    const gst = document.getElementById('global-cf-gst').value.trim() || 'Not entered';
    const email = document.getElementById('global-cf-email').value.trim() || 'Not entered';
    const phone = document.getElementById('global-cf-phone').value.trim() || 'Not entered';
    const itemRows = cart.map(item => `
      <div class="global-order-row">
        <div class="global-order-main">
          <div class="global-order-name">${esc(item.name)}</div>
          <div class="global-order-meta">Model: ${esc(item.model)}<br>${esc(item.category)}</div>
        </div>
        <div class="global-order-qty">Qty ${Number(item.qty) || 1}</div>
      </div>`).join('');

    return `
      <div class="global-order-block">
        <div class="global-order-head">Items</div>
        ${itemRows}
      </div>
      <div class="global-order-block">
        <div class="global-order-head">Customer Details</div>
        <div class="global-customer-grid">
          <div><div class="global-customer-label">Name</div><div class="global-customer-value">${esc(name)}</div></div>
          <div><div class="global-customer-label">Company</div><div class="global-customer-value">${esc(company)}</div></div>
          <div><div class="global-customer-label">GST Number</div><div class="global-customer-value">${esc(gst)}</div></div>
          <div><div class="global-customer-label">Email</div><div class="global-customer-value">${esc(email)}</div></div>
          <div><div class="global-customer-label">Phone</div><div class="global-customer-value">${esc(phone)}</div></div>
        </div>
      </div>`;
  }

  function openWhatsApp() {
    if (!cart.length || !detailsValid()) return;
    const name = document.getElementById('global-cf-name').value.trim();
    const company = document.getElementById('global-cf-company').value.trim();
    const gst = document.getElementById('global-cf-gst').value.trim();
    const email = document.getElementById('global-cf-email').value.trim();
    const phone = document.getElementById('global-cf-phone').value.trim();
    const lines = cart.map((item, i) => (i + 1) + '. ' + item.name + '\n   Model: ' + item.model + '\n   Quantity: ' + item.qty).join('\n\n');
    const msg = 'Hello SEM,\n\nI would like to place an enquiry for the following products:\n\n' + lines +
      '\n\n---\nCustomer Details:\nName: ' + name + '\nCompany: ' + company + '\nGST No: ' + gst + '\nEmail: ' + email + '\nPhone: ' + phone +
      '\n\nPlease contact me with pricing and availability.\n\nThank you.';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank');
  }

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
})();

// ── PRODUCT GRID BUILDER (/products/) ─────────────────────
function buildProductGrid() {
  const grid = document.getElementById('product-grid');
  if (!grid || typeof SEM_PRODUCTS === 'undefined') return;

  grid.innerHTML = SEM_PRODUCTS.map(p => {
    const cnt = p.specs ? p.specs.length : 0;
    return `
    <div class="product-card" data-product-id="${p.id}" data-cat="${p.category}">
      <div class="product-card-image">
        <svg class="product-card-image-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="20" stroke="#2A6496" stroke-width="2" stroke-dasharray="4 4"/>
          <circle cx="32" cy="32" r="10" stroke="#2A6496" stroke-width="2"/>
          <circle cx="32" cy="32" r="3" fill="#2A6496"/>
          <line x1="32" y1="4" x2="32" y2="14" stroke="#2A6496" stroke-width="2"/>
          <line x1="32" y1="50" x2="32" y2="60" stroke="#2A6496" stroke-width="2"/>
          <line x1="4" y1="32" x2="14" y2="32" stroke="#2A6496" stroke-width="2"/>
          <line x1="50" y1="32" x2="60" y2="32" stroke="#2A6496" stroke-width="2"/>
        </svg>
        <span class="product-card-image-label">Product Image Placeholder</span>
      </div>
      <div class="product-card-body">
        <div class="product-card-cat">${p.category}</div>
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-models">${p.models.join(' · ')}</div>
        <div class="product-card-footer">
          <span class="product-card-count">${cnt > 0 ? cnt + ' model variants' : 'Custom specs'}</span>
          <span class="product-card-arrow">→</span>
        </div>
      </div>
    </div>`;
  }).join('');

  // Re-observe new cards for stagger
  document.querySelectorAll('.product-card').forEach((c, i) => {
    c.style.transitionDelay = Math.min(i * 0.04, 0.4) + 's';
    revealObs.observe(c);
  });
}

if (document.getElementById('product-grid')) {
  document.addEventListener('DOMContentLoaded', buildProductGrid);
}

// ── POPULAR PRODUCTS CAROUSEL (/) ────────────────────
(function initPopularProducts() {
  const track = document.getElementById('popular-products-track');
  if (!track || typeof SEM_PRODUCTS === 'undefined') return;

  const popularIds = [
    'double-inlet-133',
    'single-inlet-forward-curved',
    'axial-fan-press-fit',
    'inline-duct-fan',
    'fume-extractor',
    'plug-fans'
  ];

  const products = popularIds.map(id => getProductById(id)).filter(Boolean);
  track.innerHTML = products.map(product => popularCard(product, false)).join('') +
    products.map(product => popularCard(product, true)).join('');

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rafId = null;
  let lastTs = 0;
  let paused = reducedMotion || isMobile;
  const speed = 34;

  if (!reducedMotion && !isMobile) rafId = window.requestAnimationFrame(tick);
  track.addEventListener('mouseenter', pause);
  track.addEventListener('mouseleave', resume);
  track.addEventListener('focusin', pause);
  track.addEventListener('focusout', resume);
  track.addEventListener('scroll', normalizeLoop, { passive: true });

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    const delta = ts - lastTs;
    lastTs = ts;

    if (!paused) {
      const loopStart = track.children[products.length] ? track.children[products.length].offsetLeft : track.scrollWidth / 2;
      track.scrollLeft += (speed * delta) / 1000;
      if (track.scrollLeft >= loopStart) track.scrollLeft -= loopStart;
    }
    rafId = window.requestAnimationFrame(tick);
  }

  function normalizeLoop() {
    const loopStart = track.children[products.length] ? track.children[products.length].offsetLeft : track.scrollWidth / 2;
    if (track.scrollLeft >= loopStart) track.scrollLeft -= loopStart;
  }

  function pause() {
    paused = true;
  }

  function resume() {
    if (reducedMotion || isMobile) return;
    paused = false;
    lastTs = 0;
    if (!rafId) rafId = window.requestAnimationFrame(tick);
  }

  function popularCard(product, duplicate) {
    const image = product.images && product.images[0]
      ? `<img src="${escHtml(product.images[0])}" alt="${escHtml(product.name)}" loading="lazy" decoding="async">`
      : `<svg class="usage-result-placeholder" width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/><circle cx="32" cy="32" r="10" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="32" r="3" fill="currentColor"/></svg>`;
    const tags = (product.applications || []).slice(0, 3).map(app => `<span class="usage-result-tag">${escHtml(app)}</span>`).join('');
    const models = (product.models || []).slice(0, 4).join(' · ') + ((product.models || []).length > 4 ? ' · ...' : '');
    return `
      <a class="usage-result-card popular-card" href="/products/?product=${encodeURIComponent(product.id)}"${duplicate ? ' aria-hidden="true" tabindex="-1"' : ''} aria-label="View ${escHtml(product.name)} on products page">
        <div class="usage-result-image">${image}</div>
        <div class="usage-result-body">
          <div class="usage-result-cat">${escHtml(product.category)}</div>
          <div class="usage-result-name">${escHtml(product.name)}</div>
          <div class="usage-result-models">${escHtml(models)}</div>
          <div class="usage-result-tags">${tags}</div>
        </div>
      </a>`;
  }

  function escHtml(value) {
    return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
})();

// ── VIDEO PERFORMANCE MODE ───────────────────────────────────
(function initVideoPerformanceMode() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobile) document.body.classList.add('mobile-performance');

  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const heroFallback = document.getElementById('hero-placeholder');
    if (heroFallback) heroFallback.style.display = 'none';
    heroVideo.addEventListener('loadeddata', () => {
      if (heroFallback) heroFallback.style.display = 'none';
    }, { once: true });
    heroVideo.addEventListener('error', () => {
      if (heroFallback) heroFallback.style.display = 'flex';
    }, { once: true });
    heroVideo.preload = isMobile || reducedMotion ? 'metadata' : 'auto';
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !reducedMotion) heroVideo.play().catch(() => {});
        else heroVideo.pause();
      });
    }, { threshold: 0.2 });
    heroObserver.observe(heroVideo);
  }

  const appVideos = [...document.querySelectorAll('.video-grid video')];
  appVideos.forEach(video => {
    video.removeAttribute('autoplay');
    video.preload = 'none';
    video.pause();
  });

  if (!appVideos.length) return;
  const loadVideo = video => {
    if (!video.dataset.src || video.src) return;
    video.src = video.dataset.src;
    video.load();
  };

  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        loadVideo(video);
        if (!reducedMotion) video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.3, rootMargin: '160px 0px' });

  appVideos.forEach(video => videoObserver.observe(video));
})();

// ── USAGE / APPLICATION SEARCH (/) ───────────────────
(function initUsageSearch() {
  const input = document.getElementById('usage-search-input');
  const results = document.getElementById('usage-results');
  const status = document.getElementById('usage-search-status');
  const chips = document.getElementById('usage-search-chips');
  const clearBtn = document.getElementById('usage-search-clear');
  if (!input || !results || typeof SEM_PRODUCTS === 'undefined') return;

  const aliases = {
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

  const popularApps = [
    'HVAC',
    'Air Conditioning',
    'Plastic Extrusion',
    'Forced Motor Cooling',
    'Fume Extraction',
    'Inline Ventilation',
    'Condenser Cooling',
    'Industrial Ventilation'
  ];

  if (chips) {
    chips.innerHTML = popularApps.map(app => `<button class="usage-search-chip" type="button" data-usage="${escHtml(app)}">${escHtml(app)}</button>`).join('');
    chips.addEventListener('click', e => {
      const chip = e.target.closest('[data-usage]');
      if (!chip) return;
      input.value = chip.dataset.usage;
      input.focus();
      render(input.value);
    });
  }

  input.addEventListener('input', () => render(input.value));
  results.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-product-id]');
    if (!card) return;
    e.preventDefault();
    openModal(card.dataset.productId);
  });
  clearBtn && clearBtn.addEventListener('click', () => {
    input.value = '';
    input.focus();
    render('');
  });

  render('');

  function render(value) {
    const query = normalize(value);
    if (clearBtn) clearBtn.classList.toggle('show', Boolean(query));

    if (!query) {
      const starters = scoreProducts('hvac').slice(0, 4);
      results.innerHTML = starters.map(item => resultCard(item.product, item.matches)).join('');
      if (status) status.textContent = 'Popular matches for common industrial applications.';
      return;
    }

    const matches = scoreProducts(query).slice(0, 8);
    if (status) status.textContent = matches.length
      ? matches.length + ' product ' + (matches.length === 1 ? 'match' : 'matches') + ' for "' + value.trim() + '".'
      : 'No direct match found for "' + value.trim() + '".';

    results.innerHTML = matches.length
      ? matches.map(item => resultCard(item.product, item.matches)).join('')
      : '<div class="usage-no-results">Try another application such as HVAC, air conditioning, motor cooling, fume extraction, plastic extrusion, or inline ventilation.</div>';
  }

  function scoreProducts(query) {
    const expanded = expandQuery(query);
    const words = expanded.split(' ').filter(Boolean);

    return SEM_PRODUCTS.map(product => {
      const apps = product.applications || [];
      const appText = normalize(apps.join(' '));
      const nameText = normalize(product.name);
      const categoryText = normalize(product.category);
      const modelText = normalize((product.models || []).join(' '));
      const descriptionText = normalize(product.description || '');
      const haystack = [appText, nameText, categoryText, modelText, descriptionText].join(' ');
      let score = 0;

      if (appText.includes(query)) score += 90;
      if (appText.includes(expanded)) score += 80;
      if (nameText.includes(query)) score += 45;
      if (categoryText.includes(query)) score += 30;
      if (modelText.includes(query)) score += 25;
      if (descriptionText.includes(query)) score += 18;

      words.forEach(word => {
        if (word.length < 2) return;
        if (appText.includes(word)) score += 12;
        else if (haystack.includes(word)) score += 4;
      });

      const matchingApps = apps.filter(app => {
        const n = normalize(app);
        return n.includes(query) || words.some(word => word.length > 2 && n.includes(word));
      });

      return { product, score, matches: matchingApps.length ? matchingApps : apps.slice(0, 3) };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
  }

  function resultCard(product, matches) {
    const image = product.images && product.images[0]
      ? `<img src="${escHtml(product.images[0])}" alt="${escHtml(product.name)}" loading="lazy" decoding="async">`
      : `<svg class="usage-result-placeholder" width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/><circle cx="32" cy="32" r="10" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="32" r="3" fill="currentColor"/></svg>`;
    const models = (product.models || []).slice(0, 4).join(' · ') + ((product.models || []).length > 4 ? ' · ...' : '');
    const tags = (matches || []).slice(0, 3).map(app => `<span class="usage-result-tag">${escHtml(app)}</span>`).join('');

    return `
      <article class="usage-result-card" data-product-id="${escHtml(product.id)}" tabindex="0" role="button" aria-label="View ${escHtml(product.name)} specifications">
        <div class="usage-result-image">${image}</div>
        <div class="usage-result-body">
          <div class="usage-result-cat">${escHtml(product.category)}</div>
          <div class="usage-result-name">${escHtml(product.name)}</div>
          <div class="usage-result-models">${escHtml(models)}</div>
          <div class="usage-result-tags">${tags}</div>
        </div>
      </article>`;
  }

  function expandQuery(value) {
    const clean = normalize(value);
    const aliasText = clean.split(' ').map(word => aliases[word] || '').filter(Boolean).join(' ');
    return normalize([clean, aliasText].filter(Boolean).join(' '));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function escHtml(value) {
    return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
})();

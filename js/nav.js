/* Shared SEM navigation behavior. */
(function initSharedNav() {
  var nav = document.querySelector('.nav');
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileNav = document.querySelector('.nav-mobile');

  function normalizePath(path) {
    if (!path || path === '/index.html') return '/';
    return path
      .replace(/\/index\.html$/, '/')
      .replace(/\/about\.html$/, '/about/')
      .replace(/\/products\.html$/, '/products/')
      .replace(/\/applications\.html$/, '/applications/')
      .replace(/\/downloads\.html$/, '/downloads/')
      .replace(/\/distributors\.html$/, '/distributors/')
      .replace(/\/contact\.html$/, '/contact/')
      .replace(/([^/])$/, '$1/');
  }

  function readCart() {
    try { return JSON.parse(localStorage.getItem('sem-cart') || '[]'); }
    catch(e) { return []; }
  }

  function getCartTotal(cart) {
    return (cart || readCart()).reduce(function(sum, item) {
      return sum + (Number(item.qty) || 0);
    }, 0);
  }

  function updateCartBadges(cart) {
    var total = getCartTotal(cart);
    document.querySelectorAll('.cart-badge').forEach(function(badge) {
      badge.textContent = total;
      badge.classList.toggle('show', total > 0);
    });
    updateQuoteBar(total);
  }

  function icon(name) {
    return '<span class="ui-icon ui-icon-' + name + '" aria-hidden="true"></span>';
  }

  function ensureMobileActions() {
    if (!mobileNav || mobileNav.querySelector('.nav-mobile-actions')) return;
    var actions = document.createElement('div');
    actions.className = 'nav-mobile-actions';
    actions.innerHTML = '<a href="/products/" class="nav-cart-btn">' + icon('cart') + ' Cart <span class="cart-badge">0</span></a><a href="/contact/" class="btn btn-primary btn-sm">Get a Quote</a>';
    mobileNav.appendChild(actions);
  }

  function ensureQuoteBar() {
    if (document.getElementById('mobile-quote-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'mobile-quote-bar';
    bar.id = 'mobile-quote-bar';
    bar.innerHTML = '<div class="mobile-quote-copy">' + icon('cart') + '<span><span id="mobile-quote-count">0 items selected</span><span class="mobile-quote-sub">Ready for enquiry</span></span></div><button class="mobile-quote-btn" id="mobile-quote-btn" type="button">View Quote</button>';
    document.body.appendChild(bar);
    document.getElementById('mobile-quote-btn').addEventListener('click', function() {
      var cartBtn = document.querySelector('.nav-actions .nav-cart-btn') || document.querySelector('.nav-cart-btn');
      if (cartBtn) cartBtn.click();
    });
  }

  function updateQuoteBar(total) {
    ensureQuoteBar();
    var bar = document.getElementById('mobile-quote-bar');
    var count = document.getElementById('mobile-quote-count');
    if (!bar || !count) return;
    count.textContent = total + ' item' + (total === 1 ? '' : 's') + ' selected';
    bar.classList.toggle('show', total > 0);
  }

  function closeMobileNav() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
  }

  ensureMobileActions();
  ensureQuoteBar();

  window.addEventListener('scroll', function() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (hamburger && mobileNav && !hamburger.dataset.semNavBound) {
    hamburger.dataset.semNavBound = 'true';
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if ((nav && nav.contains(e.target)) || mobileNav.contains(e.target)) return;
      closeMobileNav();
    });
  }

  var currentPath = normalizePath(location.pathname);
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function(link) {
    if (normalizePath(link.getAttribute('href') || '') === currentPath) {
      link.classList.add('active');
    }
  });

  window.addEventListener('storage', function(e) {
    if (e.key === 'sem-cart') updateCartBadges();
  });

  window.SEMNav = Object.assign(window.SEMNav || {}, {
    closeMobileNav: closeMobileNav,
    icon: icon,
    readCart: readCart,
    updateCartBadges: updateCartBadges
  });

  updateCartBadges();
})();

/* Shared SEM navigation behavior. */
(function initSharedNav() {
  // Privacy-conscious analytics hook. No data leaves the browser unless the
  // site owner explicitly configures window.SEM_ANALYTICS_ENDPOINT.
  document.addEventListener('sem:analytics', function(event) {
    if (navigator.doNotTrack === '1' || !event.detail) return;
    var payload = Object.assign({ path:location.pathname, time:new Date().toISOString() }, event.detail);
    try { sessionStorage.setItem('sem-last-event', JSON.stringify(payload)); } catch(e) {}
    if (window.SEM_ANALYTICS_ENDPOINT && navigator.sendBeacon) {
      navigator.sendBeacon(window.SEM_ANALYTICS_ENDPOINT, new Blob([JSON.stringify(payload)], {type:'application/json'}));
    }
  });

  document.addEventListener('click', function(event) {
    var link = event.target.closest('a[href],button');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (/wa\.me|contact|downloads/.test(href)) {
      document.dispatchEvent(new CustomEvent('sem:analytics', { detail:{ event:'conversion_action', target:href || link.textContent.trim().slice(0,60) } }));
    }
  });
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
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    if (mobileNav) mobileNav.classList.remove('open');
  }

  ensureMobileActions();
  ensureQuoteBar();

  var lastScrollY = window.scrollY || 0;
  var scrollTicking = false;

  function updateNavScrollState() {
    var currentY = window.scrollY || 0;
    var delta = currentY - lastScrollY;
    var mobileOpen = hamburger && hamburger.classList.contains('open');
    var shouldHide = nav && !mobileOpen && currentY > nav.offsetHeight && delta > 6;

    if (nav) {
      nav.classList.toggle('scrolled', currentY > 20);
      nav.classList.toggle('nav-hidden', shouldHide);
    }
    document.body.classList.toggle('nav-hidden', !!shouldHide);

    if (Math.abs(delta) > 6 || currentY < 2) lastScrollY = currentY;
    scrollTicking = false;
  }

  window.addEventListener('scroll', function() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateNavScrollState);
  }, { passive: true });

  if (hamburger && mobileNav && !hamburger.dataset.semNavBound) {
    hamburger.dataset.semNavBound = 'true';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'site-mobile-nav');
    if (!mobileNav.id) mobileNav.id = 'site-mobile-nav';
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = !hamburger.classList.contains('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileNav.classList.toggle('open', open);
    });
    document.addEventListener('click', function(e) {
      if ((nav && nav.contains(e.target)) || mobileNav.contains(e.target)) return;
      closeMobileNav();
    });
    mobileNav.addEventListener('click', function(e) {
      if (e.target.closest('a')) closeMobileNav();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        closeMobileNav();
        hamburger.focus();
      }
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

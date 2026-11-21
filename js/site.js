/* Nana House – site script: language switch, scroll reveal, photo slider, menu tabs */
(function () {
  'use strict';
  var root = document.getElementById('nh-root');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Language, remembered between pages ----
     vi / en: written in the page. ko zh fr ru de: hand translations in js/i18n/<code>.js, applied over the English text.
     Other languages: Google Translate's page proxy (translate.goog). */
  var LANGS = ['vi', 'en', 'ko', 'zh', 'fr', 'ru', 'de'];
  var SHORT = { vi: 'VI', en: 'EN', ko: '한', zh: '中', fr: 'FR', ru: 'RU', de: 'DE' };
  var REAL = 'https://nanahousetule.github.io/';
  var inProxy = /\.translate\.goog$/.test(location.hostname);
  var cur = 'vi';
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function dict(l) { return window.NH_I18N && window.NH_I18N[l]; }
  window.NH_LANG = function () { return cur; };
  window.NH_T = function (en) { var D = dict(cur); return (D && D[norm(en)]) || en; };
  var box = document.createElement('div');
  function trEl(el) {
    if (el.__nhEn === undefined) el.__nhEn = el.innerHTML;
    var D = dict(cur), out = el.__nhEn;
    if (D) { box.innerHTML = el.__nhEn; var v = D[norm(box.textContent)]; if (v != null) out = v; }
    if (el.innerHTML !== out) el.innerHTML = out;
  }
  function trAll(scope) {
    if (cur === 'vi') return;
    if (scope.nodeType !== 1) return;
    if (scope.classList.contains('en')) trEl(scope);
    var els = scope.querySelectorAll('.en');
    for (var i = 0; i < els.length; i++) trEl(els[i]);
  }
  var loading = {};
  function load(l, done) {
    if (dict(l)) { done(); return; }
    if (loading[l]) { loading[l].push(done); return; }
    loading[l] = [done];
    var sc = document.createElement('script');
    var me = document.querySelector('script[src$="js/site.js"]');
    sc.src = (me ? me.getAttribute('src').replace(/site\.js$/, '') : 'js/') + 'i18n/' + l + '.js';
    sc.onload = sc.onerror = function () { var q = loading[l]; loading[l] = null; q.forEach(function (f) { f(); }); };
    document.head.appendChild(sc);
  }
  function setLang(l) {
    if (LANGS.indexOf(l) < 0) l = 'vi';
    cur = l;
    var html = document.documentElement;
    LANGS.forEach(function (x) { if (root) root.classList.remove('lang-' + x); html.classList.remove('nh-l-' + x); });
    if (root) root.classList.add(l === 'vi' ? 'lang-vi' : 'lang-en');
    html.classList.add('nh-l-' + l);
    html.lang = l;
    var btns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === l ? 'true' : 'false');
    var curEls = document.querySelectorAll('.nh-lang-cur');
    for (var c = 0; c < curEls.length; c++) curEls[c].textContent = SHORT[l];
    try { localStorage.setItem('nh-lang', l); } catch (e) {}
    function apply() { if (cur !== l) return; if (root) trAll(root); document.dispatchEvent(new CustomEvent('nh-lang', { detail: l })); }
    if (l === 'vi' || l === 'en') apply(); else { if (root) trAll(root); load(l, apply); }
  }
  var saved = null;
  try { saved = localStorage.getItem('nh-lang'); } catch (e) {}
  var m = /[?&]lang=([a-z]{2})/.exec(location.search);
  if (m) saved = m[1];
  setLang(saved || 'vi');
  if (root && window.MutationObserver) {
    new MutationObserver(function (list) {
      if (cur === 'vi') return;
      list.forEach(function (r) { for (var i = 0; i < r.addedNodes.length; i++) trAll(r.addedNodes[i]); });
    }).observe(root, { childList: true, subtree: true });
  }

  /* language menu */
  var page = location.pathname.split('/').pop() || '';
  if (!/\.html$/.test(page)) page = '';
  var langBtns = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener('click', function () {
      var l = this.getAttribute('data-lang');
      if (inProxy) { location.href = REAL + page + '?lang=' + l + location.hash; return; }
      setLang(l); closeMenus();
    });
  }
  var gts = document.querySelectorAll('[data-gt]');
  for (var g = 0; g < gts.length; g++) {
    var code = gts[g].getAttribute('data-gt');
    gts[g].href = 'https://nanahousetule-github-io.translate.goog/' + page + '?lang=en&_x_tr_sl=en&_x_tr_tl=' + code + '&_x_tr_hl=' + code;
  }
  function closeMenus(except) {
    var ms = document.querySelectorAll('.nh-langs');
    for (var k = 0; k < ms.length; k++) {
      if (ms[k] === except) continue;
      ms[k].classList.remove('is-open');
      var b = ms[k].querySelector('.nh-lang-btn'); if (b) b.setAttribute('aria-expanded', 'false');
    }
  }
  var lbs = document.querySelectorAll('.nh-lang-btn');
  for (var j = 0; j < lbs.length; j++) {
    lbs[j].addEventListener('click', function (e) {
      e.stopPropagation();
      var w = this.closest('.nh-langs'), open = !w.classList.contains('is-open');
      closeMenus(w);
      w.classList.toggle('is-open', open);
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function (e) { if (!e.target.closest('.nh-langs')) closeMenus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenus(); });

  /* ---- Scroll reveal: items rise into place as you scroll ---- */
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('nh-js');
    var obs = new IntersectionObserver(function (entries, o) {
      var n = 0;
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = (Math.min(n, 6) * 0.15) + 's';
          n++;
          e.target.classList.add('is-in');
          o.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    var rv = document.querySelectorAll('.rv, .rv-l, .rv-r');
    for (var r = 0; r < rv.length; r++) obs.observe(rv[r]);
  }

  /* ---- Photo slider (Không gian) ---- */
  var track = document.getElementById('nhSpaceTrack');
  if (track) {
    var car = track.parentNode;
    var slides = track.querySelectorAll('.nh-slide');
    var dots = car.querySelectorAll('.nh-dot');
    var count = car.querySelector('.nh-count');
    var prev = car.querySelector('.nh-prev');
    var next = car.querySelector('.nh-next');
    var anim = 0;
    var idx = function () {
      var c = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      for (var k = 0; k < slides.length; k++) {
        var m = slides[k].offsetLeft + slides[k].offsetWidth / 2, d = Math.abs(m - c);
        if (d < bd) { bd = d; best = k; }
      }
      return best;
    };
    var sync = function () {
      var k = idx();
      for (var a = 0; a < slides.length; a++) slides[a].classList.toggle('nh-on', a === k);
      for (var b = 0; b < dots.length; b++) {
        dots[b].classList.toggle('nh-on', b === k);
        dots[b].setAttribute('aria-current', b === k ? 'true' : 'false');
      }
      if (count) count.textContent = (k + 1) + ' / ' + slides.length;
      if (prev) prev.disabled = k === 0;
      if (next) next.disabled = k === slides.length - 1;
    };
    var go = function (k) {
      k = Math.max(0, Math.min(slides.length - 1, k));
      var s = slides[k];
      var max = track.scrollWidth - track.clientWidth;
      var target = Math.max(0, Math.min(max, s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2));
      var start = track.scrollLeft, dist = target - start, dur = reduce ? 0 : 1100, t0 = null;
      if (anim) cancelAnimationFrame(anim);
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var p = dur ? Math.min(1, (ts - t0) / dur) : 1;
        var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        track.scrollLeft = start + dist * e;
        if (p < 1) { anim = requestAnimationFrame(step); }
        else { anim = 0; track.style.scrollSnapType = ''; track.style.scrollBehavior = ''; sync(); }
      };
      anim = requestAnimationFrame(step);
    };
    var raf = 0;
    track.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; sync(); });
    }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx() + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx() - 1); }
    });
    if (prev) prev.addEventListener('click', function () { go(idx() - 1); });
    if (next) next.addEventListener('click', function () { go(idx() + 1); });
    for (var d = 0; d < dots.length; d++) {
      (function (k) { dots[k].addEventListener('click', function () { go(k); }); })(d);
    }
    window.addEventListener('resize', sync);
    sync();
  }

  /* ---- Menu tabs (Thực đơn) ---- */
  var sideBtns = document.querySelectorAll('[data-side]');
  if (sideBtns.length) {
    var side = 'food', sub = 'goi';
    var subBar = document.querySelector('.nh-subtabs');
    var subBtns = document.querySelectorAll('[data-sub]');
    var panels = document.querySelectorAll('[data-panel]');
    var apply = function () {
      var show = side === 'drink' ? 'drink' : sub;
      for (var a = 0; a < sideBtns.length; a++) sideBtns[a].setAttribute('aria-pressed', sideBtns[a].getAttribute('data-side') === side ? 'true' : 'false');
      for (var b = 0; b < subBtns.length; b++) subBtns[b].setAttribute('aria-pressed', subBtns[b].getAttribute('data-sub') === sub ? 'true' : 'false');
      if (subBar) subBar.hidden = side !== 'food';
      for (var c = 0; c < panels.length; c++) panels[c].hidden = panels[c].getAttribute('data-panel') !== show;
    };
    for (var s1 = 0; s1 < sideBtns.length; s1++) sideBtns[s1].addEventListener('click', function () { side = this.getAttribute('data-side'); apply(); });
    for (var s2 = 0; s2 < subBtns.length; s2++) subBtns[s2].addEventListener('click', function () { sub = this.getAttribute('data-sub'); apply(); });
    apply();
  }
})();

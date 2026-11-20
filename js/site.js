/* Nana House – site script: language switch, scroll reveal, photo slider, menu tabs */
(function () {
  'use strict';
  var root = document.getElementById('nh-root');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Language (VI / EN), remembered between pages ---- */
  function setLang(l) {
    if (!root) return;
    root.classList.remove('lang-vi', 'lang-en');
    root.classList.add('lang-' + l);
    document.documentElement.lang = l;
    var btns = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-lang') === l ? 'true' : 'false');
    }
    try { localStorage.setItem('nh-lang', l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('nh-lang'); } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'vi');
  var langBtns = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener('click', function () { setLang(this.getAttribute('data-lang')); });
  }

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

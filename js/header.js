/* Nana House – thanh menu cố định: giữ khoảng trống bên dưới đúng bằng chiều cao thanh menu,
   và kéo mục đang chọn vào giữa hàng menu trên điện thoại. */
(function () {
  var head = document.querySelector('.nh-head');
  var space = document.getElementById('nh-head-space');
  if (!head || !space) return;
  function fit() { space.style.height = head.offsetHeight + 'px'; document.documentElement.style.setProperty('--nh-head-h', head.offsetHeight + 'px'); }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(head);

  function centerCurrent() {
    var nav = head.querySelector('.nh-nav');
    var cur = nav && nav.querySelector('[aria-current="page"]');
    if (!nav || !cur || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = cur.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2;
  }
  window.nhCenterNav = centerCurrent;
  window.addEventListener('load', centerCurrent);

  /* Nút Quay lại: về đúng trang trước nếu trang trước cũng thuộc website này (ví dụ trang Đặt phòng → Phòng đôi → Quay lại),
     không thì về trang chủ. Ghi nhớ trang trước trong phiên duyệt web, vì một số nơi không gửi "referrer". */
  var here = location.pathname + location.search;
  var prev = null;
  try {
    prev = sessionStorage.getItem('nh-cur');
    if (prev === here) prev = sessionStorage.getItem('nh-prev');
    else sessionStorage.setItem('nh-prev', prev || '');
    sessionStorage.setItem('nh-cur', here);
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      try { sessionStorage.setItem('nh-cur', here); } catch (x) {}
    });
  } catch (e) {}
  var back = document.querySelector('.nh-backbar:not([data-solo])');
  if (back) back.addEventListener('click', function (e) {
    var r = document.referrer;
    var fromSite = (prev && prev !== here) || (r && location.origin !== 'null' && r.indexOf(location.origin + '/') === 0);
    if (fromSite && history.length > 1) { e.preventDefault(); history.back(); }
  });
})();

/* Vuốt từ mép trái hoặc mép phải màn hình vào trong để quay lại trang trước
   (giống bấm nút "Quay lại"). Trên iPhone/iPad, mép trái để Safari tự xử lý. */
(function () {
  if (!('ontouchstart' in window)) return;
  var EDGE = 28, NEED = 80;
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var hint = document.createElement('div');
  hint.className = 'nh-swipe-hint';
  hint.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"></path><path d="M11 18l-6-6 6-6"></path></svg>';
  document.body.appendChild(hint);

  function shown(el) { return el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'; }
  function backTarget() {
    var cands = document.querySelectorAll('#nh-back, .nh-backbar');
    for (var i = 0; i < cands.length; i++) if (shown(cands[i])) return cands[i];
    return null;
  }
  function blocked(t) {
    if (document.documentElement.classList.contains('nh-os-open')) return true;
    return !!(t.closest && t.closest('.leaflet-container, iframe, #nhSpaceTrack, .nh-osheet, input, textarea, select, [data-noswipe]'));
  }
  var sx = 0, sy = 0, side = 0, active = false, target = null;
  document.addEventListener('touchstart', function (e) {
    active = false;
    if (e.touches.length !== 1) return;
    var t = e.touches[0], w = window.innerWidth;
    side = t.clientX <= EDGE ? 1 : (t.clientX >= w - EDGE ? -1 : 0);
    if (!side || (side === 1 && isIOS) || blocked(e.target)) return;
    target = backTarget();
    if (!target) return;
    sx = t.clientX; sy = t.clientY; active = true;
    hint.classList.toggle('is-right', side === -1);
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (!active) return;
    var t = e.touches[0], dx = (t.clientX - sx) * side, dy = Math.abs(t.clientY - sy);
    if (dy > 60 && dy > dx) { active = false; hint.style.opacity = 0; return; }
    var p = Math.max(0, Math.min(1, dx / NEED));
    hint.style.opacity = p;
    hint.style.transform = 'translate(' + (side === 1 ? 1 : -1) * Math.min(dx, NEED) * 0.6 + 'px,-50%) scale(' + (0.7 + 0.3 * p) + ')';
    hint.style.top = t.clientY + 'px';
    hint.classList.toggle('is-ready', p >= 1);
  }, { passive: true });
  function end(e) {
    if (!active) return;
    active = false;
    var t = e.changedTouches[0], dx = (t.clientX - sx) * side, dy = Math.abs(t.clientY - sy);
    hint.style.opacity = 0; hint.classList.remove('is-ready');
    if (dx >= NEED && dy < dx) target.click();
  }
  document.addEventListener('touchend', end, { passive: true });
  document.addEventListener('touchcancel', function () { active = false; hint.style.opacity = 0; }, { passive: true });
})();

/* Bấm một nút trên thanh menu (hoặc nút Đặt phòng): chữ của nút phóng to ra giữa màn hình rồi biến mất,
   sau đó trang cũ và trang tiếp theo hoà dần vào nhau. */
(function () {
  var busy = false, root = document.documentElement;
  /* trình duyệt có hỗ trợ hoà trộn khi chuyển trang (Chrome 126+, Safari 18.2+) */
  var BLEND = !!(window.CSS && CSS.supports && document.startViewTransition && ('PageRevealEvent' in window || 'onpagereveal' in window));
  function cleanup() {
    busy = false;
    root.classList.remove('nh-navfade');
    [].forEach.call(document.querySelectorAll('.nh-navzoom'), function (n) { n.parentNode && n.parentNode.removeChild(n); });
  }
  function samePage(a) {
    var h = a.getAttribute('href') || '';
    if (h.charAt(0) === '#') return true;
    return a.pathname === location.pathname && a.search === location.search && !a.hash;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('.nh-head .nh-nav a, .nh-head a.nh-book') : null;
    if (!a || a.__nhPass) return;
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.getAttribute('aria-current') === 'page') return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) !== '#' && samePage(a)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (busy) return; busy = true;

    var r = a.getBoundingClientRect(), cs = getComputedStyle(a);
    var c = a.cloneNode(true);
    c.removeAttribute('href'); c.removeAttribute('aria-current'); c.removeAttribute('class');
    c.setAttribute('aria-hidden', 'true');
    var oc = a.children, cc = c.children;
    for (var i = oc.length - 1; i >= 0; i--) if (getComputedStyle(oc[i]).display === 'none') c.removeChild(cc[i]);
    c.className = 'nh-navzoom';
    var st = c.style, fs = parseFloat(cs.fontSize) || 14;
    st.left = r.left + 'px'; st.top = r.top + 'px'; st.width = r.width + 'px'; st.height = r.height + 'px';
    st.fontFamily = cs.fontFamily; st.fontSize = fs + 'px'; st.fontWeight = cs.fontWeight; st.lineHeight = '1.2';
    st.color = a.classList.contains('nh-book') ? '#1B2A22' : cs.color;
    var w = window.innerWidth, h = window.innerHeight;
    var big = Math.min(80, Math.max(40, w * 0.11));
    var dx = w / 2 - (r.left + r.width / 2), dy = h / 2 - (r.top + r.height / 2);
    root.appendChild(c);                       /* nằm ngoài body */
    void c.offsetWidth;
    /* 1) chữ bay ra giữa, to dần và biến mất đúng lúc tới giữa màn hình */
    st.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + (big / fs) + ')';
    st.opacity = '0';
    /* 2) trang cũ và trang mới hoà dần vào nhau */
    setTimeout(function () {
      if (href.charAt(0) === '#') {
        var go = function () { a.__nhPass = true; a.click(); a.__nhPass = false; cleanup(); };
        if (document.startViewTransition) document.startViewTransition(go);
        else go();
      } else if (BLEND) {
        location.href = a.href;
      } else {
        /* trình duyệt cũ: mờ nhanh rồi trang mới hiện dần */
        root.classList.add('nh-navfade');
        try { sessionStorage.setItem('nh-nav-in', '1'); } catch (x) {}
        setTimeout(function () { location.href = a.href; }, 280);
      }
    }, 480);
  }, true);
  window.addEventListener('pageshow', function (e) { if (e.persisted) cleanup(); });
})();

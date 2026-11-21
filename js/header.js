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

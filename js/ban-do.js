/* Nana House – bản đồ du lịch Tú Lệ – Mù Cang Chải (ban-do.html)
   Dữ liệu điểm nằm trong js/ban-do-data.js. Thêm ?sua vào địa chỉ để bật chế độ chủ nhà. */
(function () {
  'use strict';
  var root = document.getElementById('nh-root');
  var mapEl = document.getElementById('nh-map');
  if (!window.L || !mapEl || !root) return;

  var PLACES = window.NH_PLACES || [];
  var byId = {};
  PLACES.forEach(function (p) { byId[p.id] = p; });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var deskMq = window.matchMedia('(min-width: 900px)');
  var owner = /[?&]sua\b/.test(location.search);
  var ZALO = 'https://zalo.me/0828206122';

  function isDesk() { return deskMq.matches; }
  function lang() { return root.classList.contains('lang-en') ? 'en' : 'vi'; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function bi(o) { return o ? '<span class="vi">' + esc(o.vi) + '</span><span class="en">' + esc(o.en) + '</span>' : ''; }
  function tx(o) { return o ? (o[lang()] || o.vi) : ''; }

  /* ---- Hand-drawn icons (24×24, stroke 1.6) ---- */
  var ICON = {
    house: '<path d="M2.4 11.3 L12 4.3 L21.6 11.1"/><path d="M5.2 10.7 L5.4 19.2 L18.7 19.1 L18.8 10.6"/><path d="M10.4 19.1 v-4.2 h3.1 v4.2"/>',
    terrace: '<path d="M2.5 8.2 c3.1-2.1 6.2-2 9.4-.1 s6.3 2.1 9.6-.1"/><path d="M2.5 13.1 c3.1-2.1 6.2-2 9.4-.1 s6.3 2.1 9.6-.1"/><path d="M2.5 18 c3.1-2.1 6.2-2 9.4-.1 s6.3 2.1 9.6-.1"/>',
    mountain: '<path d="M2.4 19.4 L8.6 9.2 L12.4 14.6 L15.4 10.7 L21.6 19.3 Z"/><path d="M7.1 11.8 L8.6 9.2 L10.2 11.6"/>',
    bowl: '<path d="M3.6 12.2 h16.8 c-.4 4.4-3.9 7.4-8.4 7.4 s-8-3-8.4-7.4 z"/><path d="M9 9.4 c-1-1.1.9-2.1 0-3.4"/><path d="M13.2 9.4 c-1-1.1.9-2.1 0-3.4"/>',
    route: '<path d="M6 19.5 c-2 0-3-1.3-3-2.7 s1.2-2.6 3-2.6 h11.6 c1.8 0 3-1.2 3-2.6 s-1.2-2.7-3-2.7 H9"/><circle cx="6" cy="6" r="2.4"/><path d="M18 21.4 v-3.6"/>',
    target: '<circle cx="12" cy="12" r="6.6"/><circle cx="12" cy="12" r="1.8"/><path d="M12 2.4 v3 M12 18.6 v3 M2.4 12 h3 M18.6 12 h3"/>',
    fit: '<path d="M4 9 V4.2 H8.8"/><path d="M15.2 4.2 H20 V9"/><path d="M20 15 v4.8 h-4.8"/><path d="M8.8 19.8 H4 V15"/>',
    layers: '<path d="M12 3.6 L21 8.4 L12 13.2 L3 8.4 Z"/><path d="M3.2 12.4 L12 17.1 L20.8 12.4"/><path d="M3.2 16.2 L12 20.8 L20.8 16.2"/>',
    close: '<path d="M6 6 L18 18 M18 6 L6 18"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    dot: '<circle cx="12" cy="12" r="3.4"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    right: '<path d="M9 18l6-6-6-6"/>',
    camera: '<path d="M3.4 8.2 h3.4 l1.6-2.4 h7.2 l1.6 2.4 h3.4 v10.6 H3.4 Z"/><circle cx="12" cy="13.2" r="3.4"/>'
  };
  function svg(name, size, sw) {
    size = size || 16;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.6) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }

  var CATS = {
    home: { color: '#F2B54A', ink: '#1B2A22', icon: 'house', label: { vi: 'Nana House', en: 'Nana House' } },
    terrace: { color: '#1E3A2F', ink: '#FFFFFF', icon: 'terrace', label: { vi: 'Ruộng bậc thang', en: 'Rice terraces' } },
    pass: { color: '#2B3A67', ink: '#FFFFFF', icon: 'mountain', label: { vi: 'Đèo & ngắm cảnh', en: 'Passes & views' } },
    town: { color: '#A8322D', ink: '#FFFFFF', icon: 'bowl', label: { vi: 'Ăn uống & tắm khoáng', en: 'Food & hot springs' } },
    access: { color: '#1E3A2F', ink: '#FFFFFF', icon: 'route', label: { vi: 'Lối vào Nana House', en: 'Way in to Nana House' } }
  };
  var FILTERS = ['all', 'terrace', 'pass', 'town'];

  /* ---- Map ---- */
  var map = L.map(mapEl, { zoomControl: false, minZoom: 8, maxZoom: 18, zoomSnap: 0.5, tap: true });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
  var osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
  var layers = {
    road: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, maxNativeZoom: 19, attribution: osmAttr }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 18, maxNativeZoom: 17, subdomains: 'abc', attribution: osmAttr + ', SRTM · <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (CC-BY-SA)' })
  };
  var layerName = 'road';
  layers.road.addTo(map);

  var zoomCtl = L.control.zoom({ position: 'topright' }).addTo(map);

  var Tools = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function () {
      var d = L.DomUtil.create('div', 'leaflet-bar nh-ctl');
      d.innerHTML =
        '<button type="button" data-act="layer" aria-pressed="false">' + svg('layers', 20) + '</button>' +
        '<button type="button" data-act="locate">' + svg('target', 20) + '</button>' +
        '<button type="button" data-act="fit">' + svg('fit', 20) + '</button>';
      L.DomEvent.disableClickPropagation(d);
      L.DomEvent.disableScrollPropagation(d);
      d.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        var act = b.getAttribute('data-act');
        if (act === 'layer') toggleLayer(b);
        else if (act === 'locate') locate();
        else if (act === 'fit') fitAll(true);
      });
      return d;
    }
  });
  var tools = new Tools().addTo(map);

  function toggleLayer(btn) {
    map.removeLayer(layers[layerName]);
    layerName = layerName === 'road' ? 'topo' : 'road';
    layers[layerName].addTo(map);
    btn.setAttribute('aria-pressed', layerName === 'topo' ? 'true' : 'false');
    labelControls();
  }

  function labelControls() {
    var en = lang() === 'en';
    var c = tools.getContainer();
    var set = function (act, vi, enTxt) {
      var b = c.querySelector('[data-act="' + act + '"]');
      if (b) { b.setAttribute('aria-label', en ? enTxt : vi); b.title = en ? enTxt : vi; }
    };
    set('layer', layerName === 'topo' ? 'Xem bản đồ đường' : 'Xem bản đồ địa hình', layerName === 'topo' ? 'Show road map' : 'Show terrain map');
    set('locate', 'Vị trí của tôi', 'My location');
    set('fit', 'Xem toàn tuyến', 'Show the whole route');
    var zc = zoomCtl.getContainer();
    var zi = zc.querySelector('.leaflet-control-zoom-in'), zo = zc.querySelector('.leaflet-control-zoom-out');
    if (zi) { zi.title = en ? 'Zoom in' : 'Phóng to'; zi.setAttribute('aria-label', zi.title); }
    if (zo) { zo.title = en ? 'Zoom out' : 'Thu nhỏ'; zo.setAttribute('aria-label', zo.title); }
    Object.keys(markers).forEach(function (id) {
      var el = markers[id].getElement();
      if (el) { el.setAttribute('aria-label', tx(byId[id].name)); el.title = tx(byId[id].name); }
    });
  }

  /* ---- Markers ---- */
  var markers = {};
  PLACES.forEach(function (p) {
    var c = CATS[p.cat] || CATS.terrace;
    var access = p.cat === 'access';
    var html = access
      ? '<span class="nh-dot"></span>'
      : '<span class="nh-pin" style="--c:' + c.color + ';--k:' + c.ink + '">' + svg(c.icon, p.cat === 'home' ? 20 : 16, 1.8) + '</span>' +
        '<span class="nh-pin-label' + (p.major ? ' is-major' : '') + (p.label === 'left' ? ' is-left' : p.label === 'below' ? ' is-below' : '') +
        (p.labelLow ? ' low-' + p.labelLow : '') + '">' +
        (p.short ? '<span class="nh-l-full">' + bi(p.name) + '</span><span class="nh-l-short">' + bi(p.short) + '</span>' : bi(p.name)) + '</span>';
    var icon = L.divIcon({
      className: 'nh-marker nh-marker--' + p.cat + (p.approx ? ' is-approx' : '') + (!p.major && !access && p.cat !== 'home' ? ' is-minor' : ''),
      html: html,
      iconSize: access ? [18, 18] : [36, 36],
      iconAnchor: access ? [9, 9] : [18, 41]
    });
    var m = L.marker([p.lat, p.lng], {
      icon: icon,
      keyboard: true,
      riseOnHover: true,
      zIndexOffset: p.cat === 'home' ? 1000 : (access ? -100 : 0)
    }).addTo(map);
    m.on('click', function () { select(p.id); });
    markers[p.id] = m;
  });

  function updZoomClass() {
    var z = map.getZoom();
    mapEl.classList.toggle('nh-zlow', z < 11.5);
    mapEl.classList.toggle('nh-noaccess', z < 14);
  }
  map.on('zoomend', updZoomClass);

  /* ---- Filter chips ---- */
  var chipsEl = document.querySelector('.nh-chips');
  var filter = 'all';
  chipsEl.innerHTML = FILTERS.map(function (f) {
    var label = f === 'all' ? { vi: 'Tất cả', en: 'All' } : CATS[f].label;
    var dot = f === 'all' ? '' : '<i style="--c:' + CATS[f].color + '"></i>';
    return '<button type="button" class="nh-chip" data-f="' + f + '" aria-pressed="' + (f === 'all') + '">' + dot + bi(label) + '</button>';
  }).join('');
  chipsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.nh-chip');
    if (!b) return;
    filter = b.getAttribute('data-f');
    var all = chipsEl.querySelectorAll('.nh-chip');
    for (var i = 0; i < all.length; i++) all[i].setAttribute('aria-pressed', all[i] === b ? 'true' : 'false');
    mapEl.classList.toggle('nh-filtered', filter !== 'all');
    applyFilter();
    listEl.scrollLeft = 0;
    listEl.scrollTop = 0;
    fitAll(true);
  });
  function shown(p) {
    if (p.cat === 'home' || p.cat === 'access') return true;
    return filter === 'all' || p.cat === filter;
  }
  function applyFilter() {
    PLACES.forEach(function (p) {
      var m = markers[p.id], on = shown(p);
      if (on && !map.hasLayer(m)) m.addTo(map);
      if (!on && map.hasLayer(m)) map.removeLayer(m);
      var li = listEl.querySelector('[data-li="' + p.id + '"]');
      if (li) li.hidden = !on;
    });
    labelControls();
    if (active) {
      var el = markers[active] && markers[active].getElement();
      if (el) el.classList.add('is-active');
    }
  }

  /* ---- List ---- */
  var listEl = document.querySelector('.nh-list');
  function thumb(p) {
    var c = CATS[p.cat] || CATS.terrace;
    if (p.photos && p.photos.length) return '<img class="nh-thumb" src="' + esc(p.photos[0]) + '" alt="" loading="lazy">';
    return '<span class="nh-thumb nh-thumb--empty" style="--c:' + c.color + '">' + svg(c.icon, 30, 1.5) + '</span>';
  }
  listEl.innerHTML = PLACES.filter(function (p) { return p.cat !== 'access'; }).map(function (p) {
    var c = CATS[p.cat] || CATS.terrace;
    return '<li data-li="' + p.id + '"><button type="button" class="nh-card" data-id="' + p.id + '">' + thumb(p) +
      '<span class="nh-card-body"><span class="nh-card-cat" style="color:' + c.color + (p.cat === 'home' ? ';color:#9A6A10' : '') + '">' + bi(c.label) + '</span>' +
      '<span class="nh-card-name">' + bi(p.name) + '</span>' +
      '<span class="nh-card-tag">' + bi(p.tag) + '</span></span></button></li>';
  }).join('');
  listEl.addEventListener('click', function (e) {
    var b = e.target.closest('.nh-card');
    if (b) select(b.getAttribute('data-id'));
  });

  /* ---- Detail sheet ---- */
  var sheet = document.getElementById('nhSheet');
  var active = null;

  function directions(p) {
    if (p.link) return p.link;
    if (p.go) return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.go);
    return 'https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng;
  }

  function renderSheet(p) {
    var c = CATS[p.cat] || CATS.terrace;
    var photos = p.photos || [];
    var gal;
    if (photos.length) {
      gal = '<div class="nh-gal"><div class="nh-gal-track" tabindex="0" aria-label="Ảnh / Photos">' +
        photos.map(function (src, i) {
          return '<img src="' + esc(src) + '" alt="' + esc(tx(p.name)) + ' ' + (i + 1) + '"' + (i ? ' loading="lazy"' : '') + '>';
        }).join('') + '</div>' +
        (photos.length > 1
          ? '<button type="button" class="nh-gal-nav nh-gal-prev" aria-label="Ảnh trước / Previous photo">' + svg('left', 20, 2) + '</button>' +
            '<button type="button" class="nh-gal-nav nh-gal-next" aria-label="Ảnh sau / Next photo">' + svg('right', 20, 2) + '</button>' +
            '<span class="nh-gal-count">1 / ' + photos.length + '</span>'
          : '') + '</div>';
    } else if (p.cat !== 'access') {
      gal = '<div class="nh-gal-empty">' + svg('camera', 26, 1.5) + '<span>' + bi({ vi: 'Nana House sẽ cập nhật ảnh sớm', en: 'Photos coming soon' }) + '</span></div>';
    } else {
      gal = '<div style="height:52px"></div>';
    }
    var tips = (p.tips || []).map(function (t) {
      return '<li>' + svg('dot', 16, 2) + '<span>' + bi(t) + '</span></li>';
    }).join('');
    var ownerBox = owner
      ? '<p class="nh-owner">' + (p.approx ? '<b>' + bi({ vi: 'Vị trí gần đúng – cần kiểm tra.', en: 'Approximate position – please check.' }) + '</b><br>' : '') +
        'id: <b>' + esc(p.id) + '</b> · ' + p.lat.toFixed(5) + ', ' + p.lng.toFixed(5) + '</p>'
      : '';
    sheet.innerHTML =
      '<div class="nh-grab" aria-hidden="true"></div>' +
      '<button type="button" class="nh-x" aria-label="' + (lang() === 'en' ? 'Close' : 'Đóng') + '">' + svg('close', 18, 2) + '</button>' +
      gal +
      '<div class="nh-sheet-body">' +
      '<p class="nh-sheet-cat" style="color:' + (p.cat === 'home' ? '#9A6A10' : c.color) + '">' + bi(c.label) + '</p>' +
      '<h2 id="nhSheetTitle">' + bi(p.name) + '</h2>' +
      (p.tag ? '<p class="nh-sheet-tag">' + bi(p.tag) + '</p>' : '') +
      '<p class="nh-sheet-desc">' + bi(p.desc) + '</p>' +
      (tips ? '<ul class="nh-tips">' + tips + '</ul>' : '') +
      '<div class="nh-actions">' +
      '<a class="nh-btn nh-btn--go" href="' + esc(directions(p)) + '" target="_blank" rel="noopener">' + svg('route', 18, 1.8) + bi({ vi: 'Chỉ đường', en: 'Directions' }) + '</a>' +
      '<a class="nh-btn" href="' + ZALO + '" target="_blank" rel="noopener">' + svg('chat', 18, 1.75) + bi({ vi: 'Hỏi Nana House', en: 'Ask Nana House' }) + '</a>' +
      '</div>' +
      (p.cat === 'home' ? '' : '<p class="nh-note">' + bi({ vi: 'Vị trí trên bản đồ để tham khảo. Bấm “Chỉ đường” để Google Maps dẫn tới nơi.', en: 'Map positions are a guide. Tap “Directions” and Google Maps will take you there.' }) + '</p>') +
      ownerBox +
      '</div>';
    sheet.scrollTop = 0;
    wireGallery();
  }

  function wireGallery() {
    var track = sheet.querySelector('.nh-gal-track');
    if (!track) return;
    var imgs = track.querySelectorAll('img');
    var count = sheet.querySelector('.nh-gal-count');
    var prev = sheet.querySelector('.nh-gal-prev');
    var next = sheet.querySelector('.nh-gal-next');
    var idx = function () { return Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); };
    var sync = function () {
      var k = idx();
      if (count) count.textContent = (k + 1) + ' / ' + imgs.length;
      if (prev) prev.disabled = k <= 0;
      if (next) next.disabled = k >= imgs.length - 1;
    };
    var go = function (k) {
      k = Math.max(0, Math.min(imgs.length - 1, k));
      track.scrollTo({ left: k * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    };
    track.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    if (prev) prev.addEventListener('click', function () { go(idx() - 1); });
    if (next) next.addEventListener('click', function () { go(idx() + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx() + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx() - 1); }
    });
    sync();
  }

  sheet.addEventListener('click', function (e) {
    if (e.target.closest('.nh-x')) closeSheet(true);
  });

  function setActiveMarker(id) {
    Object.keys(markers).forEach(function (k) {
      var el = markers[k].getElement();
      if (el) el.classList.toggle('is-active', k === id);
      markers[k].setZIndexOffset(k === id ? 3000 : (byId[k].cat === 'home' ? 1000 : (byId[k].cat === 'access' ? -100 : 0)));
    });
    var cards = listEl.querySelectorAll('.nh-card');
    for (var i = 0; i < cards.length; i++) cards[i].classList.toggle('is-active', cards[i].getAttribute('data-id') === id);
  }

  function select(id, opts) {
    var p = byId[id];
    if (!p) return;
    opts = opts || {};
    active = id;
    if (!shown(p)) {
      filter = 'all';
      var all = chipsEl.querySelectorAll('.nh-chip');
      for (var i = 0; i < all.length; i++) all[i].setAttribute('aria-pressed', all[i].getAttribute('data-f') === 'all' ? 'true' : 'false');
      mapEl.classList.remove('nh-filtered');
      applyFilter();
    }
    renderSheet(p);
    sheet.hidden = false;
    if (isDesk()) listEl.hidden = true;
    else listEl.style.visibility = 'hidden';
    setActiveMarker(id);
    focusPlace(p, opts.instant);
    try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (e) {}
    if (!opts.silent) {
      var x = sheet.querySelector('.nh-x');
      if (x && isDesk()) x.focus({ preventScroll: true });
    }
  }

  function closeSheet(returnFocus) {
    var was = active;
    sheet.hidden = true;
    sheet.innerHTML = '';
    listEl.hidden = false;
    listEl.style.visibility = '';
    active = null;
    setActiveMarker(null);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (was) {
      var card = listEl.querySelector('.nh-card[data-id="' + was + '"]');
      if (card) {
        if (!isDesk()) card.parentNode.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
        if (returnFocus) card.focus({ preventScroll: true });
      }
    }
  }

  function focusPlace(p, instant) {
    var z = Math.max(map.getZoom(), p.zoom || 13);
    var target = L.latLng(p.lat, p.lng);
    if (!isDesk()) {
      var h = sheet.offsetHeight || 0;
      var pt = map.project(target, z).add([0, h / 2]);
      target = map.unproject(pt, z);
    }
    if (reduce || instant) map.setView(target, z);
    else map.flyTo(target, z, { duration: 0.9 });
  }

  /* ---- Fit whole route ---- */
  function fitAll(animate) {
    var pts = PLACES.filter(function (p) { return p.cat !== 'access' && shown(p); }).map(function (p) { return [p.lat, p.lng]; });
    if (!pts.length) return;
    var b = L.latLngBounds(pts);
    var opts = isDesk()
      ? { paddingTopLeft: [60, 60], paddingBottomRight: [80, 40] }
      : { paddingTopLeft: [34, 80], paddingBottomRight: [96, 150] };
    opts.animate = !!animate && !reduce;
    opts.maxZoom = 14;
    if (active) closeSheet(false);
    map.fitBounds(b, opts);
  }

  /* ---- My location ---- */
  var me = null, meAcc = null, toastT = 0;
  function toast(o) {
    var t = document.querySelector('.nh-toast');
    if (!t) { t = document.createElement('div'); t.className = 'nh-toast'; t.setAttribute('role', 'status'); document.querySelector('.nh-main').appendChild(t); }
    t.innerHTML = bi(o);
    t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.hidden = true; }, 3500);
  }
  function locate() {
    if (!navigator.geolocation) { toast({ vi: 'Thiết bị không hỗ trợ định vị.', en: 'Location is not available on this device.' }); return; }
    toast({ vi: 'Đang tìm vị trí của bạn…', en: 'Finding your location…' });
    map.locate({ setView: false, enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  }
  map.on('locationfound', function (e) {
    var t = document.querySelector('.nh-toast'); if (t) t.hidden = true;
    if (!me) {
      meAcc = L.circle(e.latlng, { radius: e.accuracy, color: '#2F6FE4', weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
      me = L.circleMarker(e.latlng, { radius: 8, color: '#FFFFFF', weight: 3, fillColor: '#2F6FE4', fillOpacity: 1, interactive: false }).addTo(map);
    } else { me.setLatLng(e.latlng); meAcc.setLatLng(e.latlng).setRadius(e.accuracy); }
    if (active) closeSheet(false);
    map.flyTo(e.latlng, Math.max(map.getZoom(), 13), { duration: reduce ? 0 : 0.9 });
  });
  map.on('locationerror', function () {
    toast({ vi: 'Không lấy được vị trí. Hãy bật định vị và cho phép trình duyệt dùng vị trí.', en: 'Couldn’t get your location. Turn on location and allow the browser to use it.' });
  });

  /* ---- Map taps ---- */
  map.on('click', function (e) {
    if (owner) {
      var s = e.latlng.lat.toFixed(5) + ', ' + e.latlng.lng.toFixed(5);
      var box = document.createElement('div');
      box.className = 'nh-coord';
      box.innerHTML = '<span>' + s + '</span><button type="button">' + (lang() === 'en' ? 'Copy' : 'Sao chép') + '</button>';
      box.querySelector('button').addEventListener('click', function () {
        var btn = this;
        var done = function () { btn.textContent = lang() === 'en' ? 'Copied' : 'Đã chép'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(done, function () {});
      });
      L.popup({ closeButton: true }).setLatLng(e.latlng).setContent(box).openOn(map);
      return;
    }
    if (active && !isDesk()) closeSheet(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) closeSheet(true);
  });

  /* ---- Language switch: refresh labels that live in attributes ---- */
  var langBtns = document.querySelectorAll('[data-lang]');
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener('click', function () {
      setTimeout(function () {
        labelControls();
        var x = sheet.querySelector('.nh-x');
        if (x) x.setAttribute('aria-label', lang() === 'en' ? 'Close' : 'Đóng');
      }, 0);
    });
  }

  /* ---- Layout changes ---- */
  var resizeT = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () { map.invalidateSize(); }, 120);
  });
  var onMq = function () {
    listEl.hidden = isDesk() && !!active;
    listEl.style.visibility = !isDesk() && active ? 'hidden' : '';
    map.invalidateSize();
  };
  if (deskMq.addEventListener) deskMq.addEventListener('change', onMq); else if (deskMq.addListener) deskMq.addListener(onMq);

  /* ---- Owner mode ---- */
  if (owner) {
    mapEl.classList.add('nh-owner-on');
    var banner = document.querySelector('.nh-banner');
    if (banner) banner.hidden = false;
  }

  /* ---- Start ---- */
  fitAll(false);
  updZoomClass();
  labelControls();
  var start = (location.hash || '').replace('#', '');
  if (start && byId[start]) select(start, { instant: true, silent: true });
})();

/* Nana House – thời tiết Tú Lệ (dữ liệu Open-Meteo, miễn phí, không cần khóa).
   Dùng ở 2 chỗ:
   - [data-wx="full"]: mục Thời tiết trong Cẩm nang (hôm nay + 7 ngày + lời nhắc)
   - [data-wx="chip"]: ô nhỏ một dòng trên trang chủ */
(function () {
  var boxes = document.querySelectorAll('[data-wx]');
  if (!boxes.length) return;
  var root = document.getElementById('nh-root') || document.body;
  var PLACES = {
    tule: { lat: 21.769, lon: 104.266, name: 'Tú Lệ', zoom: 11 },
    mcc: { lat: 21.852, lon: 104.089, name: 'Mù Cang Chải', zoom: 11 }
  };
  function apiUrl(pl) { return 'https://api.open-meteo.com/v1/forecast?latitude=' + pl.lat + '&longitude=' + pl.lon +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&timezone=Asia%2FBangkok&forecast_days=7'; }
  function windyUrl(pl) {
    return 'https://embed.windy.com/embed2.html?lat=' + pl.lat + '&lon=' + pl.lon + '&detailLat=' + pl.lat + '&detailLon=' + pl.lon +
      '&width=650&height=450&zoom=' + pl.zoom + '&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=' +
      '&type=map&location=coordinates&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1';
  }
  var KEY = 'nh-wx';

  function code() { return window.NH_LANG ? window.NH_LANG() : (root.classList.contains('lang-en') ? 'en' : 'vi'); }
  function T(vi, en) { return code() === 'vi' ? vi : (window.NH_T ? window.NH_T(en) : en); }
  var LOC = { vi: 'vi-VN', en: 'en-GB', ko: 'ko-KR', zh: 'zh-CN', fr: 'fr-FR', ru: 'ru-RU', de: 'de-DE' };

  /* weather code → kind, Vietnamese, English */
  function kind(c) {
    if (c === 0) return ['sun', 'Nắng, trời quang', 'Sunny, clear sky'];
    if (c === 1) return ['sun', 'Nắng, ít mây', 'Mostly sunny'];
    if (c === 2) return ['part', 'Có mây, nắng nhẹ', 'Partly cloudy'];
    if (c === 3) return ['cloud', 'Nhiều mây', 'Cloudy'];
    if (c === 45 || c === 48) return ['fog', 'Sương mù', 'Fog'];
    if (c >= 51 && c <= 57) return ['drizzle', 'Mưa phùn', 'Drizzle'];
    if (c === 61 || c === 80) return ['rain', 'Mưa nhẹ', 'Light rain'];
    if (c === 63 || c === 81) return ['rain', 'Mưa', 'Rain'];
    if (c === 65 || c === 82 || c === 66 || c === 67) return ['rain', 'Mưa to', 'Heavy rain'];
    if (c >= 71 && c <= 77 || c === 85 || c === 86) return ['snow', 'Tuyết, mưa tuyết', 'Snow'];
    if (c >= 95) return ['storm', 'Mưa dông', 'Thunderstorm'];
    return ['cloud', 'Nhiều mây', 'Cloudy'];
  }
  var S = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  var SUN = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"></path>';
  var MOON = '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"></path>';
  var CLOUD = '<path d="M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 10.5a4 4 0 0 0 0 8z"></path>';
  function icon(k, day, size) {
    size = size || 28;
    var b;
    if (k === 'sun') b = day === false ? MOON : SUN;
    else if (k === 'part') b = '<g transform="translate(-2.5 -3) scale(.72)">' + (day === false ? MOON : SUN) + '</g><path d="M9 20h9a3.4 3.4 0 0 0 .5-6.75A4.6 4.6 0 0 0 9.6 13a3.5 3.5 0 0 0-.6 7z"></path>';
    else if (k === 'fog') b = '<path d="M4 9h16M3 13h18M5 17h14"></path>';
    else if (k === 'drizzle') b = '<path d="M7 15h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 7a4 4 0 0 0 0 8z"></path><path d="M9 18.5v.5M12.5 19.5v.5M16 18.5v.5"></path>';
    else if (k === 'rain') b = '<path d="M7 15h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 7a4 4 0 0 0 0 8z"></path><path d="M8.5 18l-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5"></path>';
    else if (k === 'storm') b = '<path d="M7 14h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 6a4 4 0 0 0 0 8z"></path><path d="M12.5 14.5l-2 3.5h3l-2 3.5"></path>';
    else if (k === 'snow') b = '<path d="M7 14h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 6a4 4 0 0 0 0 8z"></path><path d="M9 18h.01M12 20h.01M15 18h.01"></path>';
    else b = CLOUD;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" ' + S + ' aria-hidden="true">' + b + '</svg>';
  }
  function r(n) { return Math.round(n); }

  function tips(d) {
    var out = [], today = d.daily, min = Math.min.apply(null, today.temperature_2m_min.slice(0, 2));
    var rain = Math.max(today.precipitation_probability_max[0] || 0, today.precipitation_probability_max[1] || 0);
    var fog = today.weather_code.slice(0, 2).some(function (c) { return c === 45 || c === 48; }) || d.current.weather_code === 45 || d.current.weather_code === 48;
    if (min <= 6) out.push(T('Đêm và sáng sớm rất lạnh (khoảng {n}°C). Nhớ mang áo phao, khăn, tất dày.', 'Nights and early mornings are very cold (around {n}°C). Bring a down jacket, scarf and thick socks.').replace('{n}', r(min)));
    else if (min <= 14) out.push(T('Đêm và sáng sớm se lạnh (khoảng {n}°C). Nhớ mang áo ấm.', 'Nights and early mornings are chilly (around {n}°C). Bring a warm jacket.').replace('{n}', r(min)));
    if (rain >= 60) out.push(T('Khả năng mưa cao. Đường đất lên các điểm có thể trơn, nên mang áo mưa và hỏi Nana House trước khi đi.', 'Rain is likely. Dirt roads up to the viewpoints can be slippery, so bring a raincoat and ask Nana House before you go.'));
    else if (rain >= 30) out.push(T('Có thể có mưa rào, nên mang theo áo mưa mỏng.', 'Showers are possible, so pack a light raincoat.'));
    if (fog) out.push(T('Có sương mù, đi xe chậm và bật đèn. Sương thường tan dần vào cuối buổi sáng.', 'Expect fog: ride slowly with your lights on. It usually clears by late morning.'));
    if (!out.length) out.push(T('Thời tiết thuận lợi để đi ngắm cảnh và chụp ảnh.', 'Good weather for sightseeing and photos.'));
    return out;
  }

  function drawFull(el, d) {
    var c = d.current, k = kind(c.weather_code), l = LOC[code()] || 'vi-VN';
    var days = d.daily.time.map(function (t, i) {
      var dt = new Date(t + 'T12:00:00'), kk = kind(d.daily.weather_code[i]);
      var name = i === 0 ? T('Hôm nay', 'Today') : i === 1 ? T('Ngày mai', 'Tomorrow') : new Intl.DateTimeFormat(l, { weekday: 'short' }).format(dt).replace(/^./, function (m) { return m.toUpperCase(); });
      var date = new Intl.DateTimeFormat(l, { day: 'numeric', month: 'numeric' }).format(dt);
      var p = d.daily.precipitation_probability_max[i];
      return '<li><span class="nh-wx-dn">' + name + '</span><span class="nh-wx-dd">' + date + '</span>' + icon(kk[0], true, 30) +
        '<span class="nh-wx-dk">' + T(kk[1], kk[2]) + '</span>' +
        '<span class="nh-wx-dt"><b>' + r(d.daily.temperature_2m_max[i]) + '°</b> / ' + r(d.daily.temperature_2m_min[i]) + '°</span>' +
        '<span class="nh-wx-dp">' + (p == null ? '' : T('Mưa ', 'Rain ') + p + '%') + '</span></li>';
    }).join('');
    el.innerHTML =
      '<div class="nh-wx-now">' + icon(k[0], c.is_day !== 0, 64) +
      '<div><p class="nh-wx-place">' + T('{p} lúc này', '{p} right now').replace('{p}', cur.name) + '</p>' +
      '<p class="nh-wx-temp">' + r(c.temperature_2m) + '°C</p>' +
      '<p class="nh-wx-desc">' + T(k[1], k[2]) + '</p>' +
      '<p class="nh-wx-more">' + T('Cảm giác như', 'Feels like') + ' ' + r(c.apparent_temperature) + '°C · ' + T('Độ ẩm', 'Humidity') + ' ' + r(c.relative_humidity_2m) + '% · ' + T('Gió', 'Wind') + ' ' + r(c.wind_speed_10m) + ' km/h</p></div></div>' +
      '<ul class="nh-wx-tips">' + tips(d).map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>' +
      '<h3 class="nh-wx-h">' + T('7 ngày tới', 'Next 7 days') + '</h3><ul class="nh-wx-days">' + days + '</ul>' +
      '<p class="nh-wx-src">' + T('Dự báo tự động cho khu vực {p}, cập nhật mỗi lần mở trang. Các đèo cao thường lạnh hơn vài độ.', 'Automatic forecast for the {p} area, updated each time you open this page. The high passes are usually a few degrees colder.').replace('{p}', cur.name) +
      ' · <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></p>';
  }
  function drawChip(el, d) {
    var c = d.current, k = kind(c.weather_code);
    el.innerHTML = icon(k[0], c.is_day !== 0, 26) + '<span>' + T('{p} lúc này:', '{p} right now:').replace('{p}', PLACES.tule.name) + ' <b>' + r(c.temperature_2m) + '°C</b>, ' + T(k[1], k[2]).toLowerCase() +
      ' · ' + T('đêm nay', 'tonight') + ' ' + r(d.daily.temperature_2m_min[0]) + '°C</span><span class="nh-wx-chip-go">' + T('Xem 7 ngày', '7-day forecast') + ' ›</span>';
  }
  function fail(el) {
    if (el.getAttribute('data-wx') === 'chip') { el.hidden = true; return; }
    el.hidden = true; /* bảng Windy bên dưới vẫn hiện */
  }

  /* data per place; the chip on the home page always shows Tú Lệ */
  var DATA = {}, cur = PLACES.tule, curKey = 'tule';
  function draw() {
    [].forEach.call(boxes, function (el) {
      var isChip = el.getAttribute('data-wx') === 'chip', d = DATA[isChip ? 'tule' : curKey];
      if (!d) return;
      var keep = cur; if (isChip) cur = PLACES.tule;
      try { isChip ? drawChip(el, d) : drawFull(el, d); el.hidden = false; } catch (e) { fail(el); }
      cur = keep;
    });
  }
  function load(key, done) {
    if (DATA[key]) { done(); return; }
    try { var c = JSON.parse(sessionStorage.getItem(KEY + '-' + key) || 'null'); if (c && Date.now() - c.t < 30 * 60 * 1000) { DATA[key] = c.d; done(); return; } } catch (e) {}
    fetch(apiUrl(PLACES[key])).then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); }).then(function (d) {
      if (!d || !d.current || !d.daily) throw new Error('bad');
      DATA[key] = d;
      try { sessionStorage.setItem(KEY + '-' + key, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
      done();
    }).catch(function () {
      [].forEach.call(boxes, function (el) {
        var isChip = el.getAttribute('data-wx') === 'chip';
        if ((isChip && key === 'tule') || (!isChip && key === curKey)) fail(el);
      });
    });
  }
  /* buttons Tú Lệ / Mù Cang Chải */
  var frame = document.querySelector('.nh-windy iframe');
  function pick(key) {
    if (!PLACES[key]) return;
    curKey = key; cur = PLACES[key];
    [].forEach.call(document.querySelectorAll('[data-wx-place]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-wx-place') === key ? 'true' : 'false'); });
    [].forEach.call(document.querySelectorAll('.nh-wx-pname'), function (n) { n.textContent = cur.name; });
    if (frame) { var u = windyUrl(cur); if (frame.getAttribute('src') !== u) frame.setAttribute('src', u); }
    var op = document.querySelector('[data-wx-open]'); if (op) op.href = 'https://www.windy.com/' + cur.lat + '/' + cur.lon + '?' + cur.lat + ',' + cur.lon + ',11';
    var full = document.querySelector('[data-wx="full"]');
    if (full) { full.hidden = true; load(key, draw); }
  }
  [].forEach.call(document.querySelectorAll('[data-wx-place]'), function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-wx-place')); }); });
  var hasChip = !!document.querySelector('[data-wx="chip"]'), hasFull = !!document.querySelector('[data-wx="full"]');
  if (hasFull) pick('tule');
  else if (hasChip) load('tule', draw);
  document.addEventListener('nh-lang', draw);
})();

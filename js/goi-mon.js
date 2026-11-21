/* Nana House – đặt món trên trang Thực đơn.
   Khách bấm + ở từng món (hoặc chọn set lẩu / set mẹt), chọn ngày, bữa, giờ, số người,
   web soạn sẵn tin nhắn để gửi qua Zalo, Messenger hoặc WhatsApp. */
(function () {
  var root = document.getElementById('nh-root') || document.body;
  var APPS = { zalo: 'https://zalo.me/0828206122', mess: 'https://m.me/61577859788703', wa: 'https://wa.me/84828206122' };
  var KEY = 'nh-order';

  function lang() { var l = window.NH_LANG ? window.NH_LANG() : (root.classList.contains('lang-en') ? 'en' : 'vi'); return l || 'vi'; }
  function isVi() { return lang() === 'vi'; }
  function T(vi, en) { return isVi() ? vi : (window.NH_T ? window.NH_T(en) : en); }
  function bi(vi, en) { return '<span class="vi">' + vi + '</span><span class="en">' + en + '</span>'; }
  function money(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'; }
  function txt(el, cls) { var s = el && el.querySelector('.' + cls); return s ? s.textContent.trim() : ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var ITEMS = {}, order = {}, extra = { date: '', meal: '', time: '', people: '', name: '', note: '' };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) { order = saved.order || {}; extra = Object.assign(extra, saved.extra || {}); } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ order: order, extra: extra })); } catch (e) {} }

  var PLUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>';
  var MINUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"></path></svg>';

  /* ---- find the menu items ---- */
  var n = 0;
  function addItem(el, nameEl, priceText, unitVi, unitEn, kind, min) {
    var m = /(\d+(?:[.,]\d+)?)\s*k/i.exec(priceText);
    if (!m) return null;
    var id = 'm' + (n++);
    ITEMS[id] = { id: id, vi: txt(nameEl, 'vi'), en: txt(nameEl, 'en'), price: parseFloat(m[1].replace(',', '.')) * 1000, unitVi: unitVi, unitEn: unitEn, kind: kind, min: min || 1 };
    return id;
  }
  /* à la carte rows and drinks: name … dotted line … price */
  var rows = document.querySelectorAll('[data-panel] div.rv[style*="align-items: baseline"], [data-panel] li');
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i], kids = r.children;
    if (kids.length < 3) continue;
    var priceEl = kids[kids.length - 1], nameEl = null;
    for (var k = 0; k < kids.length; k++) if (kids[k].querySelector && kids[k].querySelector('.vi') && kids[k] !== priceEl) { nameEl = kids[k]; break; }
    if (!nameEl || !/\dk/i.test(priceEl.textContent)) continue;
    var suf = priceEl.querySelector('.vi'), sufEn = priceEl.querySelector('.en');
    var id = addItem(r, nameEl, priceEl.textContent, suf ? suf.textContent.replace('/', '').trim() : '', sufEn ? sufEn.textContent.replace('/', '').trim() : '', 'row');
    if (!id) continue;
    r.classList.add('nh-orow');
    var q = document.createElement('span'); q.className = 'nh-q'; q.setAttribute('data-id', id);
    r.appendChild(q);
  }
  /* set lẩu, set mẹt: a heading with a price "800k / nồi" or "300k / người" */
  var sets = document.querySelectorAll('[data-panel="lau"] article, [data-panel="met"] article');
  for (var s = 0; s < sets.length; s++) {
    var a = sets[s], h = a.querySelector('h2'), pp = h && h.nextElementSibling;
    if (!h || !pp || pp.tagName !== 'P' || !/\dk/.test(pp.textContent)) continue;
    var isMet = !!a.closest('[data-panel="met"]');
    var note = pp.nextElementSibling, min = 1;
    if (isMet && note) { var mm = /(\d+)/.exec(txt(note, 'vi')); if (mm) min = parseInt(mm[1], 10) + 1; }
    var sid = addItem(a, h, txt(pp, 'vi'), isMet ? 'người' : 'nồi', isMet ? 'person' : 'pot', isMet ? 'met' : 'lau', min);
    if (!sid) continue;
    var box = document.createElement('div'); box.className = 'nh-q nh-q-set'; box.setAttribute('data-id', sid);
    (note && note.tagName === 'P' ? note : pp).insertAdjacentElement('afterend', box);
  }
  Object.keys(order).forEach(function (id) { if (!ITEMS[id] || !(order[id] > 0)) delete order[id]; });

  function unitLabel(it) { return it.unitVi ? ' ' + T(it.unitVi, it.unitEn) : ''; }
  function itemName(it) { return isVi() ? it.vi : (window.NH_T ? window.NH_T(it.en) : it.en); }

  function drawQ(el) {
    var id = el.getAttribute('data-id'), it = ITEMS[id], q = order[id] || 0, set = el.classList.contains('nh-q-set');
    if (!q) {
      el.innerHTML = set
        ? '<button type="button" class="nh-q-pick" data-act="add">' + PLUS + bi('Chọn set này', 'Choose this set') + '</button>'
        : '<button type="button" class="nh-q-add" data-act="add" aria-label="' + esc(T('Thêm', 'Add') + ' ' + itemName(it)) + '">' + PLUS + '<span>' + esc(T('Chọn', 'Add')) + '</span></button>';
    } else {
      el.innerHTML = '<button type="button" class="nh-q-btn" data-act="dec" aria-label="' + esc(T('Bớt', 'Less')) + '">' + MINUS + '</button>' +
        '<span class="nh-q-n">' + q + (set ? '<small>' + unitLabel(it) + '</small>' : '') + '</span>' +
        '<button type="button" class="nh-q-btn" data-act="inc" aria-label="' + esc(T('Thêm', 'More')) + '">' + PLUS + '</button>';
    }
  }
  function change(id, act) {
    var it = ITEMS[id], q = order[id] || 0;
    if (act === 'add') q = it.kind === 'met' ? it.min : 1;
    else if (act === 'inc') q++;
    else if (act === 'dec') q = (it.kind === 'met' && q <= it.min) ? 0 : q - 1;
    if (q > 0) order[id] = q; else delete order[id];
    save(); refresh();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.nh-q button, .nh-os-q button');
    if (!b) return;
    var holder = b.closest('[data-id]');
    change(holder.getAttribute('data-id'), b.getAttribute('data-act'));
  });

  /* ---- cart bar ---- */
  var bar = document.createElement('div');
  bar.className = 'nh-obar'; bar.hidden = true;
  bar.innerHTML = '<div class="nh-obar-in"><span class="nh-obar-sum"></span><button type="button" class="nh-obar-go">' + bi('Xem & gửi đơn', 'Review & send') + ' ›</button></div>';

  /* ---- order sheet ---- */
  var sheet = document.createElement('div');
  sheet.className = 'nh-osheet'; sheet.hidden = true; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
  var ZI = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"></path></svg>';
  var MI = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5C6.6 2.5 2.5 6.4 2.5 11.4c0 2.7 1.2 5 3.1 6.7v3.4l3.1-1.7c1 .3 2.1.4 3.3.4 5.4 0 9.5-3.9 9.5-8.8S17.4 2.5 12 2.5zm1 11.9l-2.4-2.6-4.8 2.6 5.3-5.6 2.5 2.6 4.7-2.6-5.3 5.6z"></path></svg>';
  var WI = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 20.5l1.3-4.1A8.6 8.6 0 1 1 8 19.5z"></path><path d="M9 8.2c.2-.4.5-.5.8-.5h.5l.9 2-.6.8c.5 1 1.4 1.9 2.4 2.4l.8-.6 2 .9v.5c0 .3-.1.6-.5.8-.6.4-1.5.5-2.6 0-1.6-.7-3-2.1-3.7-3.7-.5-1.1-.4-2 0-2.6z" fill="currentColor" stroke="none"></path></svg>';
  sheet.innerHTML =
    '<div class="nh-os-panel">' +
    '<div class="nh-os-head"><h2>' + bi('Đơn đặt món', 'Your food order') + '</h2><button type="button" class="nh-os-x" aria-label="Đóng / Close">×</button></div>' +
    '<div class="nh-os-body">' +
    '<ul class="nh-os-list"></ul>' +
    '<p class="nh-os-total"></p>' +
    '<p class="nh-os-warnmin" hidden></p>' +
    '<div class="nh-os-f"><label>' + bi('Ngày ăn', 'Date') + '</label><input type="date" name="date"></div>' +
    '<div class="nh-os-f"><label>' + bi('Bữa', 'Meal') + '</label><div class="nh-os-meals">' +
    '<button type="button" data-meal="sang">' + bi('Sáng', 'Breakfast') + '</button>' +
    '<button type="button" data-meal="trua">' + bi('Trưa', 'Lunch') + '</button>' +
    '<button type="button" data-meal="toi">' + bi('Tối', 'Dinner') + '</button></div></div>' +
    '<div class="nh-os-row">' +
    '<div class="nh-os-f"><label>' + bi('Giờ ăn', 'Time') + '</label><select name="time"></select></div>' +
    '<div class="nh-os-f"><label>' + bi('Số người', 'People') + '</label><select name="people"></select></div></div>' +
    '<div class="nh-os-f"><label>' + bi('Tên của bạn', 'Your name') + '</label><input type="text" name="name" autocomplete="name"></div>' +
    '<div class="nh-os-f"><label>' + bi('Ghi chú', 'Notes') + '</label><textarea name="note" rows="2"></textarea></div>' +
    '<p class="nh-os-hint">' + bi('Giá là tạm tính. Nana House sẽ nhắn lại để xác nhận món và giờ ăn.', 'Prices are estimates. Nana House will reply to confirm your dishes and meal time.') + '</p>' +
    '<p class="nh-os-warn" role="alert" hidden></p>' +
    '<p class="nh-os-ml">' + bi('Tin nhắn sẽ gửi:', 'Message to send:') + '</p><pre class="nh-os-msg"></pre>' +
    '<a class="nh-os-go nh-os-main" data-app="zalo" href="' + APPS.zalo + '" target="_blank" rel="noopener">' + ZI + bi('Sao chép tin nhắn &amp; mở Zalo', 'Copy message &amp; open Zalo') + '</a>' +
    '<div class="nh-os-alt"><span>' + bi('Hoặc gửi qua', 'Or send via') + '</span>' +
    '<a class="nh-os-go" data-app="mess" href="' + APPS.mess + '" target="_blank" rel="noopener">' + MI + 'Messenger</a>' +
    '<a class="nh-os-go" data-app="wa" href="' + APPS.wa + '" target="_blank" rel="noopener">' + WI + 'WhatsApp</a></div>' +
    '<p class="nh-os-done" hidden></p>' +
    '<button type="button" class="nh-os-clear">' + bi('Xóa hết món đã chọn', 'Clear all dishes') + '</button>' +
    '</div></div>';
  root.appendChild(sheet);
  bar.querySelector('.nh-obar-go').addEventListener('click', function () { openSheet(); });
  root.appendChild(bar);

  var f = {
    date: sheet.querySelector('[name=date]'), time: sheet.querySelector('[name=time]'), people: sheet.querySelector('[name=people]'),
    name: sheet.querySelector('[name=name]'), note: sheet.querySelector('[name=note]')
  };
  var today = new Date(); today.setHours(0, 0, 0, 0);
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  f.date.min = iso(today);
  for (var p = 1; p <= 40; p++) { var o = document.createElement('option'); o.value = p; o.textContent = p; f.people.appendChild(o); }
  var TIMES = { sang: ['7:00', '7:30', '8:00', '8:30', '9:00', '9:30'], trua: ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30'], toi: ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'] };
  function fillTimes() {
    var list = TIMES[extra.meal] || [];
    f.time.innerHTML = '';
    var o0 = document.createElement('option'); o0.value = ''; o0.textContent = extra.meal ? T('Chọn giờ', 'Choose time') : T('Chọn bữa trước', 'Choose meal first'); f.time.appendChild(o0);
    list.forEach(function (t) { var o = document.createElement('option'); o.value = t; o.textContent = t; f.time.appendChild(o); });
    f.time.value = list.indexOf(extra.time) >= 0 ? extra.time : '';
  }
  f.date.value = extra.date && extra.date >= f.date.min ? extra.date : '';
  f.people.value = extra.people || '2';
  f.name.value = extra.name || ''; f.note.value = extra.note || '';
  fillTimes();

  var MEALVI = { sang: 'bữa sáng', trua: 'bữa trưa', toi: 'bữa tối' }, MEALEN = { sang: 'breakfast', trua: 'lunch', toi: 'dinner' };
  [].forEach.call(sheet.querySelectorAll('[data-meal]'), function (b) {
    b.addEventListener('click', function () { extra.meal = b.getAttribute('data-meal'); fillTimes(); save(); refresh(); });
  });
  ['date', 'time', 'people', 'name', 'note'].forEach(function (k) {
    f[k].addEventListener(k === 'name' || k === 'note' ? 'input' : 'change', function () { extra[k] = f[k].value; save(); refresh(); });
  });

  function dateText(v, vi) {
    if (!v) return '';
    var d = new Date(v + 'T00:00:00');
    var dd = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    if (vi) return ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][d.getDay()] + ', ' + dd;
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] + ' ' + dd;
  }

  var msg = '', total = 0, count = 0;
  function compose() {
    var vi = isVi(), L = [];
    total = 0; count = 0;
    var ids = Object.keys(order);
    L.push(vi ? 'Chào Nana House, mình muốn đặt món:' : 'Hello Nana House, I would like to order food:');
    var when = [];
    if (extra.date) when.push(dateText(extra.date, vi));
    if (extra.meal) when.push(vi ? MEALVI[extra.meal] : MEALEN[extra.meal]);
    if (extra.time) when.push((vi ? 'khoảng ' : 'around ') + extra.time);
    L.push((vi ? '- Ngày: ' : '- When: ') + (when.length ? when.join(', ') : (vi ? '(chưa chọn)' : '(not chosen)')));
    L.push((vi ? '- Số người: ' : '- People: ') + (extra.people || f.people.value));
    L.push(vi ? '- Món:' : '- Dishes:');
    ids.forEach(function (id) {
      var it = ITEMS[id], q = order[id], line = it.price * q;
      total += line; count += q;
      var unit = it.unitVi ? (vi ? ' ' + it.unitVi : ' ' + it.unitEn + (q > 1 && it.unitEn === 'pot' ? 's' : (q > 1 && it.unitEn === 'person' ? 's' : ''))) : '';
      if (unit.trim() === 'persons') unit = ' people';
      L.push('  • ' + (vi ? it.vi : it.en) + ' × ' + q + unit + ' (' + money(line) + ')');
    });
    L.push((vi ? '- Tạm tính: ' : '- Estimated total: ') + money(total));
    if (extra.name) L.push((vi ? '- Tên: ' : '- Name: ') + extra.name);
    if (extra.note) L.push((vi ? '- Ghi chú: ' : '- Notes: ') + extra.note);
    L.push(vi ? 'Nana House xác nhận giúp mình nhé. Cảm ơn!' : 'Please confirm. Thank you!');
    msg = L.join('\n');
  }

  function refresh() {
    [].forEach.call(document.querySelectorAll('.nh-q[data-id]'), drawQ);
    compose();
    var ids = Object.keys(order);
    bar.hidden = !ids.length;
    document.body.classList.toggle('nh-has-obar', !!ids.length);
    var dishes = ids.length;
    bar.querySelector('.nh-obar-sum').innerHTML = '<b>' + dishes + '</b> ' + bi('món', dishes > 1 ? 'items' : 'item') + ' · ' + money(total);
    /* sheet */
    var ul = sheet.querySelector('.nh-os-list');
    ul.innerHTML = ids.map(function (id) {
      var it = ITEMS[id], q = order[id];
      return '<li><span class="nh-os-name">' + esc(itemName(it)) + (it.unitVi ? ' <small>(' + money(it.price) + ' / ' + esc(T(it.unitVi, it.unitEn)) + ')</small>' : '') + '</span>' +
        '<span class="nh-os-q" data-id="' + id + '"><button type="button" class="nh-q-btn" data-act="dec" aria-label="' + esc(T('Bớt', 'Less')) + '">' + MINUS + '</button><span class="nh-q-n">' + q + '</span><button type="button" class="nh-q-btn" data-act="inc" aria-label="' + esc(T('Thêm', 'More')) + '">' + PLUS + '</button></span>' +
        '<span class="nh-os-line">' + money(it.price * q) + '</span></li>';
    }).join('') || '<li class="nh-os-empty">' + bi('Bạn chưa chọn món nào. Bấm + bên cạnh món ăn để thêm.', 'No dishes yet. Tap + next to a dish to add it.') + '</li>';
    sheet.querySelector('.nh-os-total').innerHTML = bi('Tạm tính:', 'Estimated total:') + ' <b>' + money(total) + '</b>';
    var wm = sheet.querySelector('.nh-os-warnmin'), w = [];
    ids.forEach(function (id) { var it = ITEMS[id]; if (it.kind === 'met' && order[id] < it.min) w.push(itemName(it) + ': ' + T('tối thiểu ' + it.min + ' người', 'minimum ' + it.min + ' people')); });
    wm.hidden = !w.length; wm.textContent = w.join(' · ');
    [].forEach.call(sheet.querySelectorAll('[data-meal]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-meal') === extra.meal ? 'true' : 'false'); });
    sheet.querySelector('.nh-os-msg').textContent = msg;
    [].forEach.call(sheet.querySelectorAll('.nh-os-go'), function (a) {
      var app = a.getAttribute('data-app'), url = APPS[app];
      if (app !== 'zalo') url += '?text=' + encodeURIComponent(msg);
      a.href = url;
    });
    if (!ids.length && !sheet.hidden) closeSheet();
  }

  function missing() {
    if (!Object.keys(order).length) return T('Bạn chưa chọn món nào.', 'Please choose at least one dish.');
    if (!extra.date) return T('Bạn chọn ngày ăn giúp mình nhé.', 'Please choose a date.');
    if (!extra.meal) return T('Bạn chọn bữa sáng, trưa hay tối nhé.', 'Please choose breakfast, lunch or dinner.');
    return '';
  }
  function copy(s) {
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(s).catch(fallback); } else fallback();
    function fallback() {
      var t = document.createElement('textarea'); t.value = s; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(t);
    }
  }
  [].forEach.call(sheet.querySelectorAll('.nh-os-go'), function (a) {
    a.addEventListener('click', function (e) {
      var warn = sheet.querySelector('.nh-os-warn'), m = missing(), done = sheet.querySelector('.nh-os-done');
      if (m) { e.preventDefault(); warn.textContent = m; warn.hidden = false; done.hidden = true; warn.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      warn.hidden = true;
      compose(); refresh(); copy(msg);
      var app = a.getAttribute('data-app');
      done.textContent = app === 'zalo'
        ? T('Đã sao chép! Trong Zalo, giữ tay vào ô chat, chọn Dán rồi bấm Gửi.', 'Copied! In Zalo, press and hold the message box, tap Paste, then Send.')
        : T('Tin nhắn đã điền sẵn, bạn chỉ cần bấm Gửi. Nếu ô chat trống, giữ tay vào ô chat và chọn Dán.', 'The message is filled in, just tap Send. If the box is empty, press and hold it and tap Paste.');
      done.hidden = false;
    });
  });
  sheet.querySelector('.nh-os-clear').addEventListener('click', function () { order = {}; save(); refresh(); });

  var lastFocus = null;
  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false; document.documentElement.classList.add('nh-os-open');
    sheet.querySelector('.nh-os-warn').hidden = true; sheet.querySelector('.nh-os-done').hidden = true;
    refresh();
    sheet.querySelector('.nh-os-x').focus();
  }
  function closeSheet() {
    sheet.hidden = true; document.documentElement.classList.remove('nh-os-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  sheet.querySelector('.nh-os-x').addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });
  document.addEventListener('nh-lang', function () { fillTimes(); refresh(); });

  refresh();
})();

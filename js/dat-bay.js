/* Nana House – đặt bay dù lượn Khau Phạ: tính giá tạm và soạn tin nhắn gửi qua Zalo 0964 073 555. */
(function () {
  var box = document.getElementById('dat-bay');
  if (!box) return;
  var root = document.getElementById('nh-root') || document.body;
  function isVi() { return (window.NH_LANG ? window.NH_LANG() : (root.classList.contains('lang-en') ? 'en' : 'vi')) === 'vi'; }
  function T(vi, en) { return isVi() ? vi : (window.NH_T ? window.NH_T(en) : en); }
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'; }

  var KIND = {
    nui: { vi: 'Bay dù núi', en: 'Mountain paragliding' },
    dongco: { vi: 'Bay động cơ', en: 'Paramotor flight' }
  };
  var EXTRA = {
    none: { vi: 'Không', en: 'None', price: 0 },
    fly: { vi: 'Quay flycam', en: 'Drone (flycam) video', price: 400000 },
    '360': { vi: 'Quay camera 360', en: '360° camera video', price: 400000 },
    combo: { vi: 'Combo flycam + 360', en: 'Combo drone + 360°', price: 700000 }
  };
  /* giá mỗi người theo loại bay, tháng và ngày trong tuần (thứ 7, chủ nhật là cuối tuần) */
  function base(kind, d) {
    var wk = d.getDay() === 0 || d.getDay() === 6, m = d.getMonth() + 1;
    if (kind === 'dongco') return wk ? 2590000 : 2390000;
    if (m >= 8 && m <= 10) return wk ? 2590000 : 2190000;
    return wk ? 2390000 : 2190000;
  }

  var kind = 'nui';
  var f = { date: box.querySelector('[name=date]'), people: box.querySelector('[name=people]'), extra: box.querySelector('[name=extra]'), name: box.querySelector('[name=name]'), note: box.querySelector('[name=note]') };
  var today = new Date(); today.setHours(0, 0, 0, 0);
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  f.date.min = iso(today);
  var o0 = document.createElement('option'); o0.value = ''; o0.className = 'nh-ph'; f.people.appendChild(o0);
  for (var p = 1; p <= 10; p++) { var o = document.createElement('option'); o.value = p; o.textContent = p; f.people.appendChild(o); }
  f.people.value = '';
  function fillExtras() {
    var v = f.extra.value || 'none';
    [].forEach.call(f.extra.options, function (o) { var e = EXTRA[o.value]; o.textContent = T(e.vi, e.en) + (e.price ? ' (+' + money(e.price) + ')' : ''); });
    f.extra.value = v;
  }
  function dateText(d, vi) {
    var dd = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    return vi ? ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][d.getDay()] + ', ' + dd
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] + ' ' + dd;
  }

  var msg = '', ready = false;
  function update() {
    fillExtras();
    var vi = isVi(), d = f.date.value ? new Date(f.date.value + 'T00:00:00') : null;
    var o0 = f.people.querySelector('.nh-ph'); if (o0) o0.textContent = T('Chọn', 'Choose');
    var n = +f.people.value || 1, ex = EXTRA[f.extra.value] || EXTRA.none;
    var calc = box.querySelector('.nh-fly-calc'), sum = box.querySelector('.nh-quick-sum');
    ready = !!d && !!f.people.value && !!f.name.value.trim();
    var each = d ? base(kind, d) : 0, total = (each + ex.price) * n;
    if (d && f.people.value) {
      var wk = d.getDay() === 0 || d.getDay() === 6;
      calc.textContent = T(KIND[kind].vi, KIND[kind].en) + ', ' + T(wk ? 'cuối tuần' : 'trong tuần', wk ? 'weekend' : 'weekday') + ': ' + (ex.price ? '(' + money(each) + ' + ' + money(ex.price) + ')' : money(each)) + ' × ' + n + ' ' + T('người', n > 1 ? 'people' : 'person');
      sum.textContent = money(total);
    } else {
      calc.textContent = T('Chọn ngày bay và số người để xem giá', 'Choose a date and group size to see the price');
      sum.textContent = '';
    }
    var L = [];
    L.push(vi ? 'Chào anh/chị, mình muốn đặt bay dù lượn ở đèo Khau Phạ (xem trên web Nana House):' : 'Hello, I would like to book a paragliding flight at Khau Phạ Pass (from the Nana House website):');
    L.push((vi ? '- Loại bay: ' : '- Flight: ') + (vi ? KIND[kind].vi : KIND[kind].en));
    L.push((vi ? '- Ngày bay: ' : '- Date: ') + (d ? dateText(d, vi) : (vi ? '(chưa chọn)' : '(not chosen)')));
    L.push((vi ? '- Số người: ' : '- People: ') + (f.people.value ? n : (vi ? '(chưa chọn)' : '(not chosen)')));
    L.push((vi ? '- Dịch vụ thêm: ' : '- Extras: ') + (vi ? ex.vi : ex.en));
    if (d && f.people.value) L.push((vi ? '- Tạm tính: ' : '- Estimated total: ') + money(total));
    L.push((vi ? '- Tên: ' : '- Name: ') + (f.name.value.trim() || (vi ? '(chưa điền)' : '(not filled in)')));
    if (f.note.value.trim()) L.push((vi ? '- Ghi chú: ' : '- Notes: ') + f.note.value.trim());
    L.push(vi ? 'Anh/chị xác nhận giúp mình nhé. Cảm ơn!' : 'Please confirm. Thank you!');
    msg = L.join('\n');
    box.querySelector('.nh-quick-msg').textContent = msg;
    box.querySelector('.nh-quick-done').hidden = true;
    ['date', 'people', 'name'].forEach(function (k) { if (f[k].value.trim()) mark(k, false); });
    if (ready) box.querySelector('.nh-quick-warn').hidden = true;
  }
  [].forEach.call(box.querySelectorAll('[data-kind]'), function (b) {
    b.addEventListener('click', function () {
      kind = b.getAttribute('data-kind');
      [].forEach.call(box.querySelectorAll('[data-kind]'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      update();
    });
  });
  ['date', 'people', 'extra'].forEach(function (k) { f[k].addEventListener('change', update); });
  ['name', 'note'].forEach(function (k) { f[k].addEventListener('input', update); });

  function copy(s) {
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(s).catch(fallback); } else fallback();
    function fallback() {
      var t = document.createElement('textarea'); t.value = s; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(t);
    }
  }
  function mark(k, bad) {
    var lab = f[k].closest('.nh-q');
    f[k].classList.toggle('nh-invalid', bad); f[k].setAttribute('aria-invalid', bad ? 'true' : 'false');
    if (lab) lab.classList.toggle('is-bad', bad);
  }
  box.querySelector('.nh-go-main').addEventListener('click', function (e) {
    var warn = box.querySelector('.nh-quick-warn'), miss = [];
    if (!f.date.value) miss.push(['date', T('ngày bay', 'flight date')]);
    if (!f.people.value) miss.push(['people', T('số người bay', 'number of people')]);
    if (!f.name.value.trim()) miss.push(['name', T('tên của bạn', 'your name')]);
    ['date', 'people', 'name'].forEach(function (k) { mark(k, miss.some(function (m) { return m[0] === k; })); });
    if (miss.length) {
      e.preventDefault();
      warn.textContent = T('Bạn điền giúp mình: ', 'Please fill in: ') + miss.map(function (m) { return m[1]; }).join(', ') + '.';
      warn.hidden = false;
      f[miss[0][0]].focus();
      return;
    }
    warn.hidden = true;
    copy(msg);
    box.querySelector('.nh-quick-done').hidden = false;
  });
  document.addEventListener('nh-lang', update);
  update();
})();

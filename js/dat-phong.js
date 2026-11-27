/* Nana House – ô Đặt phòng nhanh (trang Phòng đơn / Phòng đôi / Đặt phòng).
   Lịch ghi số phòng còn trống mỗi đêm. Khách chọn số lượng phòng, bấm ngày nhận phòng rồi bấm ngày trả phòng.
   Web chỉ soạn tin nhắn, sao chép và mở Zalo; khách tự dán và gửi. */
(function () {
  var box = document.getElementById('dat-nhanh');
  if (!box) return;
  var root = document.getElementById('nh-root');
  var APPS = { zalo: 'https://zalo.me/0828206122', mess: 'https://m.me/61577859788703', wa: 'https://wa.me/84828206122' };
  var ROOMS = {
    don: { vi: 'Phòng đơn', en: 'Single room', price: 800000, count: 3, adults: 2, kids: 1 },
    doi: { vi: 'Phòng đôi', en: 'Double room', price: 1000000, count: 2, adults: 4, kids: 2 }
  };
  var room = ROOMS[box.getAttribute('data-room')] || ROOMS.don;
  var form = box.querySelector('.nh-quick-form');
  var cal = box.querySelector('.nh-cal');
  var MONTHS = { vi: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
                 en: ['January','February','March','April','May','June','July','August','September','October','November','December'] };
  var DAYS = { vi: ['T2','T3','T4','T5','T6','T7','CN'], en: ['Mo','Tu','We','Th','Fr','Sa','Su'] };

  /* Other languages: words for the calendar and the estimate. The Zalo message itself stays in English for them. */
  function ruPl(n, a, b, c) { var m = n % 10, h = n % 100; return n + ' ' + (m === 1 && h !== 11 ? a : (m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c)); }
  var X = {
    ko: { loc: 'ko-KR', room: { don: '싱글룸', doi: '더블룸' }, prev: '이전 달', next: '다음 달', ci: '체크인', co: '체크아웃',
      nights: function (n) { return n + '박'; }, rooms: function (k, r, n) { return r + ' ' + k + '개 × ' + n + '박'; },
      picked: function (a, b) { return '도착 ' + a + ' · 체크아웃 ' + b; }, tap: '달력에서 체크인 날짜, 이어서 체크아웃 날짜를 누르세요', first: '먼저 달력에서 도착 날짜를 눌러 주세요.',
      pickEnd: function (a) { return '체크인 ' + a + ' · 이제 체크아웃 날짜를 누르세요'; }, call: '전화로 확인 · +84 828 206 122', per: '1박', roomsL: '객실 수',
      short: '객실 부족', full: '만실', few: function (n) { return n + '개 남음'; },
      night: function (d, n, r) { return (n ? d + ' 밤에는 ' + r + '이 ' + n + '개만 남아 있습니다. ' : d + ' 밤은 ' + r + '이 만실입니다. ') + '다른 날짜를 고르거나 Zalo로 문의해 주세요.'; } },
    zh: { loc: 'zh-CN', room: { don: '大床房', doi: '双床房' }, prev: '上个月', next: '下个月', ci: '入住', co: '退房',
      rooms: function (k, r, n) { return k + ' 间' + r + ' × ' + n + ' 晚'; },
      picked: function (a, b) { return a + ' 入住 · ' + b + ' 退房'; }, tap: '在日历上先点入住日期，再点退房日期', first: '请先在日历上点选到达日期。',
      pickEnd: function (a) { return a + ' 入住 · 请再点选退房日期'; }, call: '打电话确认 · +84 828 206 122', per: '晚', roomsL: '房间数量',
      short: '房间不足', full: '满房', few: function (n) { return '剩' + n + '间'; },
      night: function (d, n, r) { return (n ? d + ' 当晚' + r + '只剩 ' + n + ' 间。' : d + ' 当晚' + r + '已满。') + '请换个日期，或在 Zalo 上问我们。'; } },
    fr: { loc: 'fr-FR', room: { don: 'Chambre simple', doi: 'Chambre double' }, prev: 'Mois précédent', next: 'Mois suivant', ci: 'Arrivée', co: 'Départ',
      rooms: function (k, r, n) { return k + ' × ' + r.toLowerCase() + ' × ' + n + (n > 1 ? ' nuits' : ' nuit'); },
      picked: function (a, b) { return 'Arrivée ' + a + ' · départ ' + b; }, tap: 'Touchez votre jour d’arrivée, puis votre jour de départ', first: 'Touchez d’abord votre date d’arrivée sur le calendrier.',
      pickEnd: function (a) { return 'Arrivée ' + a + ' · touchez maintenant votre jour de départ'; }, call: 'Appeler pour confirmer · +84 828 206 122', per: 'nuit', roomsL: 'Nombre de chambres',
      short: 'Pas assez', full: 'Complet', few: function (n) { return 'Reste ' + n; },
      night: function (d, n, r) { return (n ? 'La nuit du ' + d + ', il ne reste que ' + n + ' ' + r.toLowerCase() + (n > 1 ? 's' : '') + '. ' : 'La nuit du ' + d + ', les ' + r.toLowerCase().replace('chambre', 'chambres') + ' sont complètes. ') + 'Choisissez d’autres dates ou écrivez-nous sur Zalo.'; } },
    ru: { loc: 'ru-RU', room: { don: 'Одноместный номер', doi: 'Двухместный номер' }, prev: 'Предыдущий месяц', next: 'Следующий месяц', ci: 'Заезд', co: 'Выезд',
      rooms: function (k, r, n) { return k + ' × ' + r.toLowerCase() + ' × ' + ruPl(n, 'ночь', 'ночи', 'ночей'); },
      picked: function (a, b) { return 'Заезд ' + a + ' · выезд ' + b; }, tap: 'Нажмите дату заезда, затем дату выезда', first: 'Сначала выберите дату заезда в календаре.',
      pickEnd: function (a) { return 'Заезд ' + a + ' · теперь выберите дату выезда'; }, call: 'Позвонить для подтверждения · +84 828 206 122', per: 'ночь', roomsL: 'Кол-во номеров',
      short: 'Мало мест', full: 'Занято', few: function (n) { return 'Ост. ' + n; },
      night: function (d, n, r) { return (n ? 'На ночь ' + d + ' осталось номеров этого типа: ' + n + '. ' : 'На ночь ' + d + ' все номера этого типа заняты. ') + 'Выберите другие даты или напишите нам в Zalo.'; } },
    de: { loc: 'de-DE', room: { don: 'Einzelzimmer', doi: 'Doppelzimmer' }, prev: 'Vorheriger Monat', next: 'Nächster Monat', ci: 'Check-in', co: 'Check-out',
      rooms: function (k, r, n) { return k + ' × ' + r + ' × ' + n + (n > 1 ? ' Nächte' : ' Nacht'); },
      picked: function (a, b) { return 'Anreise ' + a + ' · Abreise ' + b; }, tap: 'Tippen Sie auf Ihren Anreisetag, dann auf den Abreisetag', first: 'Bitte tippen Sie zuerst im Kalender auf Ihr Anreisedatum.',
      pickEnd: function (a) { return 'Anreise ' + a + ' · tippen Sie jetzt auf Ihren Abreisetag'; }, call: 'Anrufen zum Bestätigen · +84 828 206 122', per: 'Nacht', roomsL: 'Anzahl Zimmer',
      short: 'Zu wenig', full: 'Voll', few: function (n) { return 'Noch ' + n; },
      night: function (d, n, r) { return (n ? 'In der Nacht vom ' + d + ' ist nur noch ' + n + ' ' + r + ' frei. ' : 'In der Nacht vom ' + d + ' sind alle Zimmer dieser Art belegt. ') + 'Bitte wählen Sie andere Daten oder fragen Sie uns auf Zalo.'; } }
  };
  var roomKey = box.getAttribute('data-room') === 'doi' ? 'doi' : 'don';
  function full() { var l = window.NH_LANG ? window.NH_LANG() : ''; return X[l] ? l : (root && root.classList.contains('lang-en') ? 'en' : 'vi'); }
  function lang() { return full() === 'vi' ? 'vi' : 'en'; }
  function fmt(loc, opt, d) { try { return new Intl.DateTimeFormat(loc, opt).format(d); } catch (e) { return ''; } }
  function money(n) { return n.toLocaleString('vi-VN').replace(/,/g, '.') + '₫'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dmy(d) { return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function fill(sel, from, to, v) {
    sel.innerHTML = '';
    for (var i = from; i <= to; i++) { var o = document.createElement('option'); o.value = o.textContent = i; sel.appendChild(o); }
    sel.value = v;
  }
  /* Số phòng: khách đoàn có thể đặt nhiều phòng cùng loại. */
  var roomsLab = document.createElement('label'); roomsLab.className = 'nh-q';
  roomsLab.innerHTML = '<span class="nh-q-l nh-q-rooms-l">Số lượng phòng</span><select name="rooms"></select>';
  form.appendChild(roomsLab);
  var roomsSel = roomsLab.querySelector('select');
  /* Nút chọn loại phòng nằm ngay trong ô đặt phòng, để khách luôn thấy mình đang đặt phòng đơn hay phòng đôi. */
  var sw = document.createElement('div');
  sw.className = 'nh-room-sw';
  var CK = '<span class="nh-rs-ck" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg></span>';
  sw.innerHTML = '<button type="button" data-k="don">' + CK + '<b></b><small></small></button><button type="button" data-k="doi">' + CK + '<b></b><small></small></button>';
  var head = box.querySelector('.nh-quick-head');
  if (head) head.insertAdjacentElement('afterend', sw); else box.insertBefore(sw, box.firstChild);
  sw.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var k = b.getAttribute('data-k'); if (k === roomKey) return;
    var card = document.querySelector('[data-pick-btn="' + k + '"]');
    if (card) card.click();                                   /* trang Đặt phòng: đổi phòng ngay tại chỗ */
    else location.href = (k === 'doi' ? 'phong-doi.html' : 'phong-don.html') + '#dat-nhanh';   /* trang chi tiết phòng: sang trang phòng kia */
  });
  function drawSwitch() {
    var x = X[full()], l = lang();
    [].forEach.call(sw.querySelectorAll('button'), function (b) {
      var k = b.getAttribute('data-k'), r = ROOMS[k];
      b.setAttribute('aria-pressed', k === roomKey ? 'true' : 'false');
      b.querySelector('b').textContent = x ? x.room[k] : l === 'en' ? r.en : r.vi;
      b.querySelector('small').textContent = money(r.price) + ' / ' + (x ? x.per : l === 'en' ? 'night' : 'đêm');
    });
  }
  function fillRooms() { fill(roomsSel, 1, room.count, Math.min(room.count, +roomsSel.value || 1)); }
  fillRooms();

  /* Lịch phòng trống: số phòng đã đặt từng đêm, ghi ở trang quản lý nội bộ (/quanly → Lịch đặt phòng). */
  var BOOKED = { don: {}, doi: {} };
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function left(d) { var b = +((BOOKED[roomKey] || {})[iso(d)] || 0); return Math.max(0, room.count - b); }
  function needRooms() { return Math.max(1, Math.min(room.count, +roomsSel.value || 1)); }
  function notEnough() {
    var x = X[full()];
    return x ? x.short : lang() === 'en' ? 'Not enough' : 'Không đủ phòng';
  }
  function fullTxt(n) {
    var x = X[full()], l = lang();
    if (!n) return x ? x.full : l === 'en' ? 'Full' : 'Hết';
    return x ? x.few(n) : l === 'en' ? n + ' left' : 'Còn ' + n;
  }

  var now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  /* Bấm lần 1: ngày nhận phòng (tạm 1 đêm). Bấm lần 2 vào ngày sau đó: ngày trả phòng. Bấm tiếp: chọn lại từ đầu. */
  var arrival = null, checkout = null, picking = false, msg = '';
  function stayEnd() { return arrival ? (checkout || addDays(arrival, 1)) : null; }
  function stayNights() { return arrival ? Math.round((stayEnd() - arrival) / 864e5) : 1; }
  /* ngày trả phòng xa nhất chọn được: dừng ở đêm đầu tiên không đủ phòng */
  function lastCheckout() {
    for (var i = 1; i <= 60; i++) { var d = addDays(arrival, i); if (left(d) < needRooms()) return d; }
    return addDays(arrival, 60);
  }

  function drawCal() {
    var l = lang(), y = view.getFullYear(), m = view.getMonth();
    var first = new Date(y, m, 1), startDow = (first.getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate();
    var end = stayEnd(), limit = arrival && picking ? lastCheckout() : null;
    var canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
    var x = X[full()];
    var title = x ? fmt(x.loc, { month: 'long', year: 'numeric' }, first) : MONTHS[l][m] + ' ' + y;
    if (x) title = title.charAt(0).toUpperCase() + title.slice(1);
    var h = '<div class="nh-cal-top">' +
      '<button type="button" class="nh-cal-nav" data-step="-1"' + (canPrev ? '' : ' disabled') + ' aria-label="' + (x ? x.prev : l === 'en' ? 'Previous month' : 'Tháng trước') + '">‹</button>' +
      '<span class="nh-cal-title">' + title + '</span>' +
      '<button type="button" class="nh-cal-nav" data-step="1" aria-label="' + (x ? x.next : l === 'en' ? 'Next month' : 'Tháng sau') + '">›</button></div>' +
      '<div class="nh-cal-grid" role="grid">';
    for (var k = 0; k < 7; k++) h += '<span class="nh-cal-dow">' + (x ? fmt(x.loc, { weekday: 'short' }, new Date(2024, 0, 1 + k)).replace(/\.$/, '') : DAYS[l][k]) + '</span>';
    for (var e = 0; e < startDow; e++) h += '<span></span>';
    for (var d = 1; d <= dim; d++) {
      var day = new Date(y, m, d), cls = 'nh-cal-day', past = day < today;
      var isEnd = end && sameDay(day, end), chosen = arrival && sameDay(day, arrival);
      var canEnd = limit && day > arrival && day <= limit;
      /* ngày trả phòng không phải một đêm ở lại, nên không tính thiếu phòng */
      var lf = past ? room.count : left(day), lack = !isEnd && lf < needRooms();
      if (lack) cls += ' is-full';
      if (sameDay(day, today)) cls += ' is-today';
      if (chosen) cls += ' is-start';
      else if (arrival && day > arrival && day < end) cls += ' is-in';
      else if (isEnd) cls += ' is-end';
      var stay = cls.indexOf('is-start') >= 0 || cls.indexOf('is-in') >= 0;
      var lb = '';
      if (lack && stay) lb = '<span class="nh-cal-lb">' + notEnough() + '</span>';
      else if (cls.indexOf('is-start') >= 0) lb = '<span class="nh-cal-lb">' + (x ? x.ci : l === 'en' ? 'Check-in' : 'Nhận phòng') + '</span>';
      else if (isEnd) lb = '<span class="nh-cal-lb">' + (x ? x.co : l === 'en' ? 'Check-out' : 'Trả phòng') + '</span>';
      else if (!past) lb = '<span class="nh-cal-lb' + (lack ? '' : ' nh-left') + '">' + fullTxt(lf) + '</span>';
      h += '<button type="button" class="' + cls + '" data-d="' + d + '"' + (past || (lack && !chosen && !canEnd) ? ' disabled' : '') + ' aria-label="' + dmy(day) + (past ? '' : ' – ' + fullTxt(lf)) + '"><span class="nh-cal-n">' + d + '</span>' + lb + '</button>';
    }
    h += '</div>';
    cal.innerHTML = h;
  }
  cal.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.hasAttribute('data-step')) { view = new Date(view.getFullYear(), view.getMonth() + (+b.getAttribute('data-step')), 1); drawCal(); return; }
    var day = new Date(view.getFullYear(), view.getMonth(), +b.getAttribute('data-d'));
    if (arrival && picking && day > arrival && day <= lastCheckout()) { checkout = day; picking = false; }
    else { arrival = day; checkout = null; picking = true; }
    update();
  });

  function update() {
    var l = lang(), nights = stayNights(), need = needRooms();
    var x0 = X[full()];
    roomsLab.querySelector('.nh-q-rooms-l').textContent = x0 ? x0.roomsL + ' · ' + x0.room[roomKey] : l === 'en' ? 'Number of ' + room.en.toLowerCase() + 's' : 'Số lượng ' + room.vi.toLowerCase();
    drawSwitch();
    box.querySelector('.nh-quick-sum').textContent = money(room.price * need * nights);
    var x = X[full()], rn = x && x.room[roomKey];
    box.querySelector('.nh-quick-rooms').textContent = x ? x.rooms(need, rn, nights) : l === 'en'
      ? need + ' × ' + room.en.toLowerCase() + ' × ' + nights + (nights > 1 ? ' nights' : ' night')
      : need + ' ' + room.vi.toLowerCase() + ' × ' + nights + ' đêm';
    var warn = box.querySelector('.nh-quick-warn'), bad = null;
    if (arrival) for (var i = 0; i < nights; i++) { var nd = addDays(arrival, i), nl = left(nd); if (nl < need) { bad = { d: dmy(nd), n: nl }; break; } }
    warn.textContent = bad ? (x ? x.night(bad.d, bad.n, rn) : l === 'en'
        ? (bad.n ? 'Only ' + bad.n + ' ' + room.en.toLowerCase() + (bad.n > 1 ? 's' : '') + ' left on the night of ' + bad.d + '. ' : 'Our ' + room.en.toLowerCase() + 's are fully booked on the night of ' + bad.d + '. ') + 'Please pick other dates or ask us on Zalo.'
        : (bad.n ? 'Đêm ' + bad.d + ' chỉ còn ' + bad.n + ' ' + room.vi.toLowerCase() + '. ' : 'Đêm ' + bad.d + ' đã hết ' + room.vi.toLowerCase() + '. ') + 'Bạn chọn ngày khác hoặc hỏi Nana House qua Zalo nhé.') : '';
    warn.hidden = !bad;
    var picked = box.querySelector('.nh-cal-picked');
    if (arrival && picking) {
      picked.textContent = x ? x.pickEnd(dmy(arrival)) : l === 'en' ? 'Check-in ' + dmy(arrival) + ' · now tap your check-out day' : 'Nhận phòng ' + dmy(arrival) + ' · bấm tiếp ngày trả phòng';
      picked.classList.add('is-set');
    } else if (arrival) {
      var out = stayEnd();
      picked.textContent = x ? x.picked(dmy(arrival), dmy(out)) : l === 'en' ? 'Arrive ' + dmy(arrival) + ' · check out ' + dmy(out) : 'Ngày đến ' + dmy(arrival) + ' · trả phòng ' + dmy(out);
      picked.classList.add('is-set');
    } else {
      picked.textContent = x ? x.tap : l === 'en' ? 'Tap your check-in day, then your check-out day' : 'Bấm ngày nhận phòng, rồi bấm ngày trả phòng trên lịch';
      picked.classList.remove('is-set');
    }
    if (l === 'en') {
      msg = 'Hello Nana House, I would like to book ' + (need > 1 ? need + ' ' + room.en.toLowerCase() + 's' : 'a ' + room.en.toLowerCase()) + ':\n' +
        '- Arrival: ' + (arrival ? dmy(arrival) + ', check-out ' + dmy(stayEnd()) + ' (' + nights + (nights > 1 ? ' nights' : ' night') + ')' : '(not chosen yet)') + '\n' +
        'Please confirm my booking. Thank you!';
    } else {
      msg = 'Chào Nana House, mình muốn đặt ' + need + ' ' + room.vi.toLowerCase() + ':\n' +
        '- Ngày đến: ' + (arrival ? dmy(arrival) + ', trả phòng ' + dmy(stayEnd()) + ' (' + nights + ' đêm)' : '(chưa chọn ngày)') + '\n' +
        'Nhờ Nana House xác nhận đặt phòng giúp mình nhé. Cảm ơn!';
    }
    box.querySelector('.nh-quick-msg').textContent = msg;
    drawCall();
    if (typeof setLinks === 'function') setLinks();
    [].forEach.call(box.querySelectorAll('.nh-quick-done'), function (d) { d.hidden = true; });
    drawCal();
  }

  function copy(text) {
    try { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).catch(fallback); return; } } catch (e) {}
    fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.top = '-1000px'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
  }
  /* Các nút gửi là đường link thật: điện thoại mở thẳng ứng dụng khi khách chạm vào.
     WhatsApp và Messenger nhận sẵn nội dung tin nhắn; Zalo không cho, nên web sao chép tin để khách dán. */
  function setLinks() {
    [].forEach.call(box.querySelectorAll('.nh-quick-go'), function (a) {
      var app = a.getAttribute('data-app') || 'zalo', url = APPS[app] || APPS.zalo;
      if ((app === 'wa' || app === 'mess') && arrival) url += '?text=' + encodeURIComponent(msg);
      a.href = url;
    });
  }
  [].forEach.call(box.querySelectorAll('.nh-quick-go'), function (btn) {
    btn.addEventListener('click', function (e) {
      var app = btn.getAttribute('data-app') || 'zalo';
      if (!arrival) {
        e.preventDefault();
        var warn = box.querySelector('.nh-quick-warn');
        var x = X[full()];
        warn.textContent = x ? x.first : lang() === 'en' ? 'Please tap your arrival date on the calendar first.' : 'Bạn bấm chọn ngày đến trên lịch trước nhé.';
        warn.hidden = false;
        cal.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
      setLinks();
      copy(msg);
      [].forEach.call(box.querySelectorAll('.nh-quick-done'), function (d) { d.hidden = d.getAttribute('data-app') !== app; });
    });
  });
  roomsSel.addEventListener('change', update);

  /* Nút gọi điện: tin Zalo từ số lạ hay bị ẩn, khách gọi thẳng để xác nhận cho chắc. */
  var callBtn = document.createElement('a');
  callBtn.className = 'nh-quick-call'; callBtn.href = 'tel:+84828206122';
  callBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3.5l2 5-2.5 1.6a11 11 0 0 0 5.4 5.4L15 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"></path></svg><span class="nh-call-t"></span>';
  var mainGo = box.querySelector('.nh-go-main');
  if (mainGo) mainGo.insertAdjacentElement('afterend', callBtn); else box.appendChild(callBtn);
  function drawCall() {
    var x = X[full()];
    callBtn.querySelector('.nh-call-t').textContent = x ? x.call : lang() === 'en' ? 'Call to confirm · +84 828 206 122' : 'Gọi điện xác nhận · 0828 206 122';
  }

  var css = document.createElement('style');
  css.textContent = '.nh-quick .nh-quick-form{grid-template-columns:minmax(0,260px) !important}' +
    '.nh-quick-call{display:flex;align-items:center;justify-content:center;gap:10px;min-height:52px;border-radius:999px;border:1.5px solid #1E3A2F;background:#FFFFFF;color:#1E3A2F;text-decoration:none;font:700 16px/1.2 \'Be Vietnam Pro\',system-ui,sans-serif;padding:0 18px;text-align:center}' +
    '.nh-quick-call:hover{background:#EEF2EA}' +
    '.nh-bk-chosen{display:none !important}' +
    '.nh-room-sw{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.nh-room-sw button{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:14px 16px;border-radius:16px;border:2px solid #C9BFAC;background:#FFFFFF;color:#1E1B18;font-family:inherit;text-align:left;cursor:pointer}' +
    '.nh-room-sw b{font-size:19px;font-weight:800;line-height:1.2;padding-right:30px}' +
    '.nh-room-sw small{font-size:14px;font-weight:600;color:#5B6B60}' +
    '.nh-room-sw button[aria-pressed="true"]{background:#1E3A2F;border-color:#1E3A2F;color:#FFFFFF;box-shadow:0 4px 14px rgba(30,58,47,.28)}' +
    '.nh-room-sw button[aria-pressed="true"] small{color:#CFE0D4}' +
    '.nh-rs-ck{position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;border:2px solid #C9BFAC;display:flex;align-items:center;justify-content:center;color:transparent}' +
    '.nh-room-sw button[aria-pressed="true"] .nh-rs-ck{background:#F2B54A;border-color:#F2B54A;color:#1B2A22}' +
    '@media (max-width:420px){.nh-room-sw button{padding:12px}.nh-room-sw b{font-size:17px;padding-right:26px}.nh-room-sw small{font-size:13px;white-space:nowrap}.nh-rs-ck{top:10px;right:8px}}' +
    '.nh-cal-lb.nh-left{color:#4A6B57;font-weight:600}' +
    '.nh-cal-day.is-full{background:transparent}.nh-cal-day.is-full .nh-cal-n{text-decoration:line-through;color:#B9B2A2}.nh-cal-day.is-full .nh-cal-lb{color:#A8322D}' +
    '.nh-cal-day.is-full.is-start,.nh-cal-day.is-full.is-in{background:#FFF1EE !important;box-shadow:inset 0 0 0 1.5px #A8322D;color:#8E2420}' +
    '.nh-cal-day.is-full.is-start .nh-cal-n,.nh-cal-day.is-full.is-in .nh-cal-n{color:#8E2420}';
  document.head.appendChild(css);

  update();
  /* Lịch lấy từ trang quản lý nội bộ (/quanly → Lịch đặt phòng), lưu trên Firebase. Không đọc được thì dùng file cũ. */
  var CAL_URL = 'https://firestore.googleapis.com/v1/projects/nana-house-b029d/databases/(default)/documents/public/lich-phong?key=AIzaSyAe0BrpPm8wfnBmcr-9TnOTyVjVoMhu0Yg';
  function calMap(f) {
    var o = {}, m = (f && f.mapValue && f.mapValue.fields) || {};
    Object.keys(m).forEach(function (k) { var n = parseInt(m[k].integerValue || m[k].doubleValue || 0, 10); if (n > 0) o[k] = n; });
    return o;
  }
  function calFile() {
    fetch('data/lich-phong.json?t=' + Date.now()).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (j) { BOOKED = { don: j.don || {}, doi: j.doi || {} }; update(); }
    }).catch(function () {});
  }
  try {
    fetch(CAL_URL, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
      var f = d.fields || {};
      BOOKED = { don: calMap(f.don), doi: calMap(f.doi) }; update();
    }).catch(calFile);
  } catch (e) { calFile(); }
  /* Trang Đặt phòng: đổi giữa phòng đơn và phòng đôi */
  window.NH_BOOK_ROOM = function (k) {
    if (!ROOMS[k]) return;
    roomKey = k; room = ROOMS[k]; box.setAttribute('data-room', k);
    fillRooms(); update();
  };
  document.addEventListener('nh-lang', update);
  if (root && window.MutationObserver) new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['class'] });
})();

/* Nana House – ô Đặt phòng nhanh (trang Phòng đơn / Phòng đôi).
   Khách bấm chọn ngày đến trên lịch, chọn số đêm, người lớn, trẻ em.
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
  var nightsSel = box.querySelector('[name=nights]'), adultsSel = box.querySelector('[name=adults]'), kidsSel = box.querySelector('[name=kids]');
  var cal = box.querySelector('.nh-cal');
  var MONTHS = { vi: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
                 en: ['January','February','March','April','May','June','July','August','September','October','November','December'] };
  var DAYS = { vi: ['T2','T3','T4','T5','T6','T7','CN'], en: ['Mo','Tu','We','Th','Fr','Sa','Su'] };

  /* Other languages: words for the calendar and the estimate. The Zalo message itself stays in English for them. */
  function ruPl(n, a, b, c) { var m = n % 10, h = n % 100; return n + ' ' + (m === 1 && h !== 11 ? a : (m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c)); }
  var X = {
    ko: { loc: 'ko-KR', room: { don: '싱글룸', doi: '더블룸' }, prev: '이전 달', next: '다음 달', ci: '체크인', co: '체크아웃',
      nights: function (n) { return n + '박'; }, rooms: function (k, r, n) { return r + ' ' + k + '개 × ' + n + '박'; },
      guests: function (a, c) { return '성인 ' + a + '명' + (c ? ', 어린이 ' + c + '명' : ''); },
      too: function (r) { return '인원이 ' + r + ' 수용 인원보다 많습니다. Zalo로 문의해 주세요.'; },
      picked: function (a, b) { return '도착 ' + a + ' · 체크아웃 ' + b; }, tap: '달력에서 도착 날짜를 누르세요', first: '먼저 달력에서 도착 날짜를 눌러 주세요.' },
    zh: { loc: 'zh-CN', room: { don: '大床房', doi: '双床房' }, prev: '上个月', next: '下个月', ci: '入住', co: '退房',
      rooms: function (k, r, n) { return k + ' 间' + r + ' × ' + n + ' 晚'; },
      guests: function (a, c) { return a + ' 位成人' + (c ? '，' + c + ' 名儿童' : ''); },
      too: function (r) { return '人数超过了' + r + '的容纳量，请在 Zalo 上问我们。'; },
      picked: function (a, b) { return a + ' 入住 · ' + b + ' 退房'; }, tap: '在日历上点选到达日期', first: '请先在日历上点选到达日期。' },
    fr: { loc: 'fr-FR', room: { don: 'Chambre simple', doi: 'Chambre double' }, prev: 'Mois précédent', next: 'Mois suivant', ci: 'Arrivée', co: 'Départ',
      rooms: function (k, r, n) { return k + ' × ' + r.toLowerCase() + ' × ' + n + (n > 1 ? ' nuits' : ' nuit'); },
      guests: function (a, c) { return a + (a > 1 ? ' adultes' : ' adulte') + (c ? ', ' + c + (c > 1 ? ' enfants' : ' enfant') : ''); },
      too: function (r) { return 'C’est plus de personnes que nos ' + r.toLowerCase().replace('chambre', 'chambres') + ' peuvent accueillir. Écrivez-nous sur Zalo.'; },
      picked: function (a, b) { return 'Arrivée ' + a + ' · départ ' + b; }, tap: 'Touchez un jour pour choisir votre date d’arrivée', first: 'Touchez d’abord votre date d’arrivée sur le calendrier.' },
    ru: { loc: 'ru-RU', room: { don: 'Одноместный номер', doi: 'Двухместный номер' }, prev: 'Предыдущий месяц', next: 'Следующий месяц', ci: 'Заезд', co: 'Выезд',
      rooms: function (k, r, n) { return k + ' × ' + r.toLowerCase() + ' × ' + ruPl(n, 'ночь', 'ночи', 'ночей'); },
      guests: function (a, c) { return ruPl(a, 'взрослый', 'взрослых', 'взрослых') + (c ? ', ' + ruPl(c, 'ребёнок', 'ребёнка', 'детей') : ''); },
      too: function (r) { return 'Гостей больше, чем вмещают наши номера этого типа. Напишите нам в Zalo.'; },
      picked: function (a, b) { return 'Заезд ' + a + ' · выезд ' + b; }, tap: 'Нажмите на день, чтобы выбрать дату заезда', first: 'Сначала выберите дату заезда в календаре.' },
    de: { loc: 'de-DE', room: { don: 'Einzelzimmer', doi: 'Doppelzimmer' }, prev: 'Vorheriger Monat', next: 'Nächster Monat', ci: 'Check-in', co: 'Check-out',
      rooms: function (k, r, n) { return k + ' × ' + r + ' × ' + n + (n > 1 ? ' Nächte' : ' Nacht'); },
      guests: function (a, c) { return a + ' Erwachsene' + (c ? ', ' + c + (c > 1 ? ' Kinder' : ' Kind') : ''); },
      too: function (r) { return 'Das sind mehr Gäste, als unsere Zimmer dieser Art aufnehmen können. Bitte fragen Sie uns auf Zalo.'; },
      picked: function (a, b) { return 'Anreise ' + a + ' · Abreise ' + b; }, tap: 'Tippen Sie auf einen Tag, um Ihr Anreisedatum zu wählen', first: 'Bitte tippen Sie zuerst im Kalender auf Ihr Anreisedatum.' }
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
  function fillGuests() {
    var ad = +adultsSel.value || 2, kd = +kidsSel.value || 0;
    fill(adultsSel, 1, room.adults * room.count, Math.min(ad, room.adults * room.count));
    fill(kidsSel, 0, Math.max(room.kids * room.count, 4), kd);
  }
  fill(nightsSel, 1, 10, 1);
  fillGuests();

  var now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var arrival = null, msg = '';

  function drawCal() {
    var l = lang(), y = view.getFullYear(), m = view.getMonth();
    var first = new Date(y, m, 1), startDow = (first.getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate();
    var nights = +nightsSel.value, checkout = arrival ? addDays(arrival, nights) : null;
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
      if (sameDay(day, today)) cls += ' is-today';
      if (arrival && sameDay(day, arrival)) cls += ' is-start';
      else if (arrival && day > arrival && day < checkout) cls += ' is-in';
      else if (checkout && sameDay(day, checkout)) cls += ' is-end';
      var lb = '';
      if (cls.indexOf('is-start') >= 0) lb = '<span class="nh-cal-lb">' + (x ? x.ci : l === 'en' ? 'Check-in' : 'Nhận phòng') + '</span>';
      else if (cls.indexOf('is-end') >= 0) lb = '<span class="nh-cal-lb">' + (x ? x.co : l === 'en' ? 'Check-out' : 'Trả phòng') + '</span>';
      h += '<button type="button" class="' + cls + '" data-d="' + d + '"' + (past ? ' disabled' : '') + ' aria-label="' + dmy(day) + '"><span class="nh-cal-n">' + d + '</span>' + lb + '</button>';
    }
    h += '</div>';
    cal.innerHTML = h;
  }
  cal.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.hasAttribute('data-step')) { view = new Date(view.getFullYear(), view.getMonth() + (+b.getAttribute('data-step')), 1); drawCal(); return; }
    arrival = new Date(view.getFullYear(), view.getMonth(), +b.getAttribute('data-d'));
    update();
  });

  function update() {
    var l = lang(), nights = +nightsSel.value, ad = +adultsSel.value, kids = +kidsSel.value;
    var need = Math.max(1, Math.ceil(ad / room.adults), Math.ceil(kids / room.kids));
    var tooMany = need > room.count;
    if (tooMany) need = room.count;
    box.querySelector('.nh-quick-sum').textContent = money(room.price * need * nights);
    var x = X[full()], rn = x && x.room[roomKey];
    box.querySelector('.nh-quick-rooms').textContent = x ? x.rooms(need, rn, nights) : l === 'en'
      ? need + ' × ' + room.en.toLowerCase() + ' × ' + nights + (nights > 1 ? ' nights' : ' night')
      : need + ' ' + room.vi.toLowerCase() + ' × ' + nights + ' đêm';
    var warn = box.querySelector('.nh-quick-warn');
    warn.textContent = tooMany ? (x ? x.too(rn) : l === 'en' ? 'That is more guests than our ' + room.en.toLowerCase() + 's can take. Please ask us on Zalo.' : 'Số khách nhiều hơn sức chứa các ' + room.vi.toLowerCase() + '. Bạn hỏi Nana House qua Zalo nhé.') : '';
    warn.hidden = !tooMany;
    var picked = box.querySelector('.nh-cal-picked');
    if (arrival) {
      var out = addDays(arrival, nights);
      picked.textContent = x ? x.picked(dmy(arrival), dmy(out)) : l === 'en' ? 'Arrive ' + dmy(arrival) + ' · check out ' + dmy(out) : 'Ngày đến ' + dmy(arrival) + ' · trả phòng ' + dmy(out);
      picked.classList.add('is-set');
    } else {
      picked.textContent = x ? x.tap : l === 'en' ? 'Tap a day to choose your arrival date' : 'Bấm vào lịch để chọn ngày đến';
      picked.classList.remove('is-set');
    }
    var guests = l === 'en' ? ad + (ad > 1 ? ' adults' : ' adult') + (kids ? ', ' + kids + (kids > 1 ? ' children' : ' child') : '')
                            : ad + ' người lớn' + (kids ? ', ' + kids + ' trẻ em' : '');
    if (l === 'en') {
      msg = 'Hello Nana House, I would like to book a ' + room.en.toLowerCase() + ':\n' +
        '- Arrival: ' + (arrival ? dmy(arrival) + ', check-out ' + dmy(addDays(arrival, nights)) : '(not chosen yet)') + ' (' + nights + (nights > 1 ? ' nights' : ' night') + ')\n' +
        '- Guests: ' + guests + (need > 1 ? ' (about ' + need + ' rooms)' : '') + '\n' +
        'Is this available? Thank you!';
    } else {
      msg = 'Chào Nana House, mình muốn đặt ' + room.vi.toLowerCase() + ':\n' +
        '- Ngày đến: ' + (arrival ? dmy(arrival) + ', trả phòng ' + dmy(addDays(arrival, nights)) : '(chưa chọn ngày)') + ' (' + nights + ' đêm)\n' +
        '- Số người: ' + guests + (need > 1 ? ' (khoảng ' + need + ' phòng)' : '') + '\n' +
        'Nana House còn phòng không ạ? Cảm ơn!';
    }
    box.querySelector('.nh-quick-msg').textContent = msg;
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
  [nightsSel, adultsSel, kidsSel].forEach(function (s) { s.addEventListener('change', update); });
  update();
  /* Trang Đặt phòng: đổi giữa phòng đơn và phòng đôi */
  window.NH_BOOK_ROOM = function (k) {
    if (!ROOMS[k]) return;
    roomKey = k; room = ROOMS[k]; box.setAttribute('data-room', k);
    fillGuests(); update();
  };
  document.addEventListener('nh-lang', update);
  if (root && window.MutationObserver) new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['class'] });
})();

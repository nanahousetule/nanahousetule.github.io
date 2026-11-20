/* Nana House – bản đồ vệ tinh các điểm du lịch Mù Cang Chải (mu-cang-chai.html)
   Thêm điểm mới: chép một khối { ... } trong PLACES rồi sửa (desc và tip có thể bỏ trống).
   Nút "Điểm du lịch" mở bản đồ này; nút "Ăn uống & nhà hàng" mở Google Maps; nút "Tư vấn lịch trình" mời nhắn Zalo (cả hai nằm trong mu-cang-chai.html).
   cat: home | pass | view | terrace | water | bamboo | flower | tree | village | zip | spring | town
   go: chữ để Google Maps tìm đường; bỏ trống thì chỉ đường theo tọa độ.
   approx: true = ghim mới ở vị trí gần đúng, cần chủ nhà gửi vị trí chính xác.
   major: true = vẫn hiện tên ngắn (short) khi bản đồ thu nhỏ; labelLow = chỗ đặt tên ngắn.
   label: right (mặc định) | left | top | bottom = chỗ đặt tên cạnh ghim. */
(function () {
  'use strict';

  /* Hoa đào rừng: chỉ nở tháng 12 và tháng 1 (chủ nhà dặn). */
  var PEACH_TAG = { vi: 'Hoa đào rừng · tháng 12 – tháng 1', en: 'Wild peach blossom · Dec – Jan' };
  var PEACH_TIP = { vi: 'Hoa chỉ nở vào tháng 12 và tháng 1.', en: 'The trees only bloom in December and January.' };

  var PLACES = [
    {
      id: 'nana-house', cat: 'home', lat: 21.76900, lng: 104.26577, major: true, label: 'bottom', labelLow: 'bottom',
      short: { vi: 'Nana House', en: 'Nana House' },
      name: { vi: 'Nana House', en: 'Nana House' },
      tag: { vi: 'Điểm xuất phát', en: 'Start here' },
      desc: { vi: 'Homestay ở bản Ít Thái, xã Tú Lệ. Từ đây lên trung tâm Mù Cang Chải khoảng 45 km, đi qua đèo Khau Phạ.', en: 'Our homestay in Ít Thái village, Tú Lệ. About 45 km to Mù Cang Chải town, over Khau Phạ Pass.' }
    },

    /* ---- Tú Lệ ---- */
    { id: 'zipline-tu-le', cat: 'zip', lat: 21.7848646, lng: 104.3122831, label: 'bottom',
      name: { vi: 'Điểm vui chơi trượt zipline', en: 'Zipline park' },
      tag: { vi: 'Vui chơi · Tú Lệ', en: 'Adventure · Tú Lệ' },
      desc: { vi: 'Khu vui chơi ở Tú Lệ có đường trượt zipline ngắm thung lũng.', en: 'An adventure park in Tú Lệ with a zipline over the valley.' } },
    { id: 'khoang-nong-tu-le', cat: 'spring', lat: 21.7896809, lng: 104.3114006, label: 'top',
      name: { vi: 'Tắm khoáng nóng Tú Lệ', en: 'Tú Lệ hot spring' },
      tag: { vi: 'Tắm khoáng nóng · Tú Lệ', en: 'Hot spring · Tú Lệ' },
      desc: { vi: 'Bể khoáng nóng tự nhiên ở trung tâm xã Tú Lệ.', en: 'A natural hot spring in the centre of Tú Lệ.' },
      tip: { vi: 'Hãy giữ ý khi chụp ảnh người đang tắm ở bể khoáng.', en: 'Please be respectful when photographing people bathing.' } },

    /* ---- Quanh đèo Khau Phạ ---- */
    {
      id: 'khau-pha', cat: 'pass', lat: 21.7750, lng: 104.2717, major: true, label: 'right', labelLow: 'top', go: 'Đèo Khau Phạ',
      short: { vi: 'Khau Phạ', en: 'Khau Phạ' },
      name: { vi: 'Đèo Khau Phạ', en: 'Khau Phạ Pass' },
      tag: { vi: 'Đèo · bay dù lượn', en: 'Pass · paragliding' },
      desc: { vi: 'Một trong “tứ đại đỉnh đèo” Tây Bắc, nhiều khúc cua tay áo. Đây là điểm bay dù lượn nổi tiếng nhất vùng.', en: 'One of the Northwest’s “four great passes”, with many hairpin bends. The area’s best-known paragliding spot.' },
      tip: { vi: 'Đèo dốc, hay có sương. Đi chậm, bật đèn và tránh chạy ban đêm.', en: 'Steep and often foggy. Ride slowly, keep your lights on and avoid night driving.' }
    },
    { id: 'thao-nguyen-khau-pha', cat: 'view', lat: 21.7811049, lng: 104.2732754, label: 'right',
      name: { vi: 'Thảo nguyên Khau Phạ', en: 'Khau Phạ grassland' },
      tag: { vi: 'Ngắm cảnh · đèo Khau Phạ', en: 'Viewpoint · Khau Phạ Pass' } },
    { id: 'goc-nhin-di-san', cat: 'view', lat: 21.7678823, lng: 104.2592719, label: 'left',
      name: { vi: 'Góc nhìn di sản', en: 'Góc nhìn di sản (heritage viewpoint)' },
      tag: { vi: 'Ngắm cảnh', en: 'Viewpoint' } },
    { id: 'ba-cay-gao', cat: 'tree', lat: 21.7755166, lng: 104.2569987, label: 'left',
      name: { vi: '3 cây gạo', en: 'Three kapok trees' },
      tag: { vi: 'Ngắm cảnh · chụp ảnh', en: 'Viewpoint · photos' } },
    { id: 'diem-ngam-du-luon', cat: 'view', lat: 21.7549512, lng: 104.2656458, label: 'right',
      name: { vi: 'Điểm ngắm dù lượn', en: 'Paragliding viewpoint' },
      tag: { vi: 'Ngắm bay dù lượn', en: 'Watch the paragliders' } },

    /* ---- Púng Luông ---- */
    { id: 'rung-truc-pung-luong', cat: 'bamboo', lat: 21.7414086, lng: 104.1672842, label: 'right',
      name: { vi: 'Rừng trúc Púng Luông', en: 'Púng Luông bamboo forest' },
      tag: { vi: 'Rừng trúc', en: 'Bamboo forest' } },
    { id: 'thac-7-tang', cat: 'water', lat: 21.7306630, lng: 104.1677878, label: 'right',
      name: { vi: 'Thác 7 tầng', en: 'Seven-tier waterfall' },
      tag: { vi: 'Thác nước', en: 'Waterfall' } },

    /* ---- La Pán Tẩn và quanh đó ---- */
    { id: 'hoa-dao-1', cat: 'flower', lat: 21.7931763, lng: 104.1837305, label: 'right',
      name: { vi: 'Điểm ngắm hoa đào rừng', en: 'Wild peach blossom viewpoint' },
      tag: PEACH_TAG, tip: PEACH_TIP },
    {
      id: 'mam-xoi-lon', cat: 'terrace', lat: 21.7928859, lng: 104.1519540, major: true, label: 'bottom', labelLow: 'bottom',
      short: { vi: 'Mâm Xôi', en: 'Mâm Xôi' },
      name: { vi: 'Đồi Mâm Xôi lớn', en: 'Mâm Xôi Hill (big)' },
      tag: { vi: 'Ruộng bậc thang · La Pán Tẩn', en: 'Terraces · La Pán Tẩn' },
      desc: { vi: 'Biểu tượng của Mù Cang Chải, ở bản Hán Xúng, xã La Pán Tẩn. Ruộng bậc thang quấn quanh ngọn đồi như một mâm xôi.', en: 'Mù Cang Chải’s signature view, in Hán Xúng village, La Pán Tẩn. The terraces wrap around the hill like a tray of sticky rice.' },
      tip: { vi: 'Đường lên dốc, nên đi bộ hoặc thuê xe ôm địa phương. Có thu vé tham quan.', en: 'The way up is steep, so walk or hire a local motorbike taxi. There is an entrance fee.' }
    },
    { id: 'mam-xoi-be', cat: 'terrace', lat: 21.8079250, lng: 104.1555877, label: 'right',
      name: { vi: 'Đồi Mâm Xôi bé', en: 'Mâm Xôi Hill (small)' },
      tag: { vi: 'Ruộng bậc thang', en: 'Terraces' } },
    {
      id: 'che-cu-nha', cat: 'terrace', lat: 21.8139, lng: 104.1465, approx: true, label: 'left', go: 'Chế Cu Nha, Mù Cang Chải',
      name: { vi: 'Ruộng bậc thang Chế Cu Nha', en: 'Chế Cu Nha terraces' },
      tag: { vi: 'Ruộng bậc thang · ít khách', en: 'Terraces · fewer visitors' },
      desc: { vi: 'Ruộng cao, dốc và uốn lượn mềm mại, ít khách hơn các điểm nổi tiếng.', en: 'High, steep terraces with soft curves, and far fewer visitors than the famous spots.' },
      tip: { vi: 'Đường vào dốc, nhiều người chọn ngắm cảnh từ ven đường.', en: 'The road in is steep, so many people enjoy the view from the roadside.' }
    },
    { id: 'song-lung-khung-long', cat: 'view', lat: 21.8011560, lng: 104.1292313, label: 'bottom',
      name: { vi: 'Sống Lưng Khủng Long', en: 'Sống Lưng Khủng Long (ridge)' },
      tag: { vi: 'Ngắm bình minh', en: 'Sunrise' },
      desc: { vi: 'Dải núi dài và hẹp, hai bên là ruộng bậc thang. Điểm ngắm bình minh được nhiều khách yêu thích.', en: 'A long, narrow ridge with terraces on both sides. A favourite sunrise spot.' } },

    /* ---- Quanh trung tâm Mù Cang Chải ---- */
    { id: 'nha-ngo', cat: 'village', lat: 21.8376089, lng: 104.1251054, label: 'right',
      name: { vi: 'Nhà Ngô', en: 'Corn House' },
      tag: { vi: 'Chụp ảnh · văn hóa', en: 'Photos · culture' } },
    { id: 'rung-truc-mcc', cat: 'bamboo', lat: 21.8446709, lng: 104.1166407, label: 'right',
      name: { vi: 'Rừng trúc Mù Cang Chải', en: 'Mù Cang Chải bamboo forest' },
      tag: { vi: 'Rừng trúc', en: 'Bamboo forest' } },
    {
      id: 'mong-ngua', cat: 'terrace', lat: 21.8502285, lng: 104.1032337, label: 'top',
      name: { vi: 'Đồi Móng Ngựa', en: 'Horseshoe Hill' },
      tag: { vi: 'Ruộng bậc thang · gần trung tâm', en: 'Terraces · near the town' },
      desc: { vi: 'Ngọn đồi ở bản Sáng Nhù, cách trung tâm Mù Cang Chải khoảng 2 km. Ruộng bậc thang uốn cong như móng ngựa.', en: 'A hill in Sáng Nhù village, about 2 km from Mù Cang Chải town. The terraces curve like a horseshoe.' },
      tip: { vi: 'Đường đất lên đồi dốc và hẹp, nên thuê xe ôm địa phương.', en: 'The dirt track up is steep and narrow, so hire a local motorbike taxi.' }
    },
    { id: 'hang-dang-de', cat: 'view', lat: 21.8375053, lng: 104.1015111, label: 'bottom',
      name: { vi: 'Háng Đăng Dê', en: 'Háng Đăng Dê' },
      tag: { vi: 'Ngắm cảnh', en: 'Viewpoint' } },
    { id: 'kim-noi', cat: 'terrace', lat: 21.8364203, lng: 104.0933353, label: 'left',
      name: { vi: 'Ruộng bậc thang Kim Nọi', en: 'Kim Nọi terraces' },
      tag: { vi: 'Ruộng bậc thang', en: 'Terraces' } },
    {
      id: 'mu-cang-chai', cat: 'town', lat: 21.8469, lng: 104.0917, major: true, label: 'left', labelLow: 'bottom', go: 'Mù Cang Chải, Lào Cai',
      short: { vi: 'Mù Cang Chải', en: 'Mù Cang Chải' },
      name: { vi: 'Trung tâm Mù Cang Chải', en: 'Mù Cang Chải town' },
      tag: { vi: 'Ăn uống · chợ · đổ xăng', en: 'Food · market · fuel' },
      desc: { vi: 'Trung tâm của vùng, có chợ, quán ăn, cây xăng và nhiều homestay. Cách Nana House khoảng 45 km.', en: 'The hub of the area, with a market, places to eat, petrol stations and plenty of homestays. About 45 km from Nana House.' }
    },
    {
      id: 'thac-mo', cat: 'water', lat: 21.8585016, lng: 104.0950939, label: 'left',
      name: { vi: 'Thác Mơ', en: 'Mơ Waterfall' },
      tag: { vi: 'Thác nước · Mồ Dề', en: 'Waterfall · Mồ Dề' },
      desc: { vi: 'Thác nước ở xã Mồ Dề, đổ xuống giữa hai đỉnh núi Nả Háng A và Nả Háng B.', en: 'A waterfall in Mồ Dề commune, tumbling down between the Nả Háng A and Nả Háng B peaks.' }
    },
    { id: 'hoa-dao-mo-de', cat: 'flower', lat: 21.8627477, lng: 104.1048471, label: 'right',
      name: { vi: 'Điểm ngắm hoa đào rừng Mồ Dề', en: 'Mồ Dề wild peach blossom viewpoint' },
      tag: PEACH_TAG, tip: PEACH_TIP },
    { id: 'hang-phu-loa', cat: 'view', lat: 21.8738070, lng: 104.0614137, label: 'right',
      name: { vi: 'Háng Phừ Loa', en: 'Háng Phừ Loa' },
      tag: { vi: 'Ngắm cảnh', en: 'Viewpoint' } },

    /* ---- Lao Chải và phía tây ---- */
    { id: 'mong-ngua-lao-chai', cat: 'terrace', lat: 21.8534440, lng: 104.0300681, label: 'right',
      name: { vi: 'Móng Ngựa Lao Chải', en: 'Lao Chải Horseshoe' },
      tag: { vi: 'Ruộng bậc thang · Lao Chải', en: 'Terraces · Lao Chải' } },
    { id: 'nam-linh-chi', cat: 'terrace', lat: 21.8558121, lng: 104.0261162, label: 'left',
      name: { vi: 'Ruộng bậc thang Nấm Linh Chi', en: 'Nấm Linh Chi terraces' },
      tag: { vi: 'Ruộng bậc thang · Lao Chải', en: 'Terraces · Lao Chải' } },
    {
      id: 'lao-chai', cat: 'terrace', lat: 21.8650, lng: 104.0100, major: true, approx: true, label: 'top', labelLow: 'top', go: 'Lao Chải, Mù Cang Chải',
      short: { vi: 'Lao Chải', en: 'Lao Chải' },
      name: { vi: 'Ruộng bậc thang Lao Chải', en: 'Lao Chải terraces' },
      tag: { vi: 'Ruộng bậc thang · cuối tuyến', en: 'Terraces · end of the route' },
      desc: { vi: 'Xã vùng cao phía tây trung tâm Mù Cang Chải, chủ yếu là người Mông. Ruộng bậc thang trải rộng, ít khách; trong xã có bãi đá cổ với những hình khắc.', en: 'A highland commune west of Mù Cang Chải town, home mostly to Hmong families. Wide terraces with few visitors, and an ancient stone field with carvings.' },
      tip: { vi: 'Sau mưa lớn, một số đường vào bản có thể sạt lở. Hỏi Nana House trước khi đi.', en: 'After heavy rain some village roads may be damaged. Ask us before you go.' }
    },
    { id: 'mam-xoi-hu-tru-linh', cat: 'terrace', lat: 21.8078936, lng: 104.0061250, label: 'right',
      name: { vi: 'Mâm Xôi Hú Trù Lình', en: 'Hú Trù Lình terraces' },
      tag: { vi: 'Ruộng bậc thang', en: 'Terraces' } },
    { id: 'hoa-dao-2', cat: 'flower', lat: 21.7871071, lng: 104.0501642, label: 'right',
      name: { vi: 'Điểm ngắm hoa đào rừng', en: 'Wild peach blossom viewpoint' },
      tag: PEACH_TAG, tip: PEACH_TIP }
  ];


  /* Hand-drawn icons, 24×24, stroke 1.6 */
  var ICON = {
    home: '<path d="M2.4 11.3 L12 4.3 L21.6 11.1"/><path d="M5.2 10.7 L5.4 19.2 L18.7 19.1 L18.8 10.6"/><path d="M10.4 19.1 v-4.2 h3.1 v4.2"/>',
    terrace: '<path d="M2.5 8.2 c3.1-2.1 6.2-2 9.4-.1 s6.3 2.1 9.6-.1"/><path d="M2.5 13.1 c3.1-2.1 6.2-2 9.4-.1 s6.3 2.1 9.6-.1"/><path d="M2.5 18 c3.1-2.1 6.2-2 9.4-.1 s6.3 2.1 9.6-.1"/>',
    pass: '<path d="M2.4 19.4 L8.6 9.2 L12.4 14.6 L15.4 10.7 L21.6 19.3 Z"/><path d="M7.1 11.8 L8.6 9.2 L10.2 11.6"/>',
    water: '<path d="M4 4.5 c2.4 0 3.6 1.4 3.6 3.6 v11.4"/><path d="M11.2 4.5 c1.8.4 2.4 1.8 2.4 3.6 v11.4"/><path d="M17.2 4.5 c1.6.5 2.4 1.7 2.4 3.4 v11.6"/><path d="M2.6 20.2 c3 1 15.8 1 18.8 0"/>',
    view: '<path d="M3.4 8.2 h3.4 l1.6-2.4 h7.2 l1.6 2.4 h3.4 v10.6 H3.4 Z"/><circle cx="12" cy="13.2" r="3.4"/>',
    bamboo: '<path d="M8.5 21.5 V2.5"/><path d="M7 8 h3 M7 14 h3"/><path d="M15.5 21.5 V5"/><path d="M14 11 h3 M14 17 h3"/><path d="M8.5 8 c2-.4 3.6-1.8 4.4-3.8"/><path d="M15.5 11 c1.8-.2 3.4-1.3 4.2-3"/>',
    flower: '<circle cx="12" cy="7.4" r="2.6"/><circle cx="16.4" cy="10.6" r="2.6"/><circle cx="14.7" cy="15.8" r="2.6"/><circle cx="9.3" cy="15.8" r="2.6"/><circle cx="7.6" cy="10.6" r="2.6"/><circle cx="12" cy="12" r="1"/>',
    tree: '<path d="M12 21.5 V12.5"/><path d="M12 16 L9 13.4 M12 14.6 l2.6-2.2"/><path d="M5 10.6 c0-3.9 3.1-7.2 7-7.2 s7 3.3 7 7.2 c0 1.7-1.3 2.8-3 2.8 H8 c-1.7 0-3-1.1-3-2.8 z"/>',
    village: '<path d="M3 11 L12 4 L21 11"/><path d="M5.2 9.6 v10.4 h13.6 V9.6"/><path d="M9.6 20 v-5 h4.8 v5"/>',
    zip: '<path d="M2.5 5 L21.5 11"/><path d="M12 8 v4"/><circle cx="12" cy="14.2" r="2.2"/><path d="M10.6 16.2 l-1.6 4 M13.4 16.2 l1.6 4"/>',
    spring: '<path d="M3.5 15.5 c0 3.4 3.8 5.5 8.5 5.5 s8.5-2.1 8.5-5.5 Z"/><path d="M8.5 12 c-1.3-1.4 1.3-2.6 0-4.2"/><path d="M12 12 c-1.3-1.4 1.3-2.6 0-4.2"/><path d="M15.5 12 c-1.3-1.4 1.3-2.6 0-4.2"/>',
    town: '<path d="M2.8 20.4 h18.4"/><path d="M4.4 20.4 v-8.2 l4.2-3.6 4.2 3.6 v8.2"/><path d="M12.8 20.4 v-6.4 l3.6-3 3.6 3 v6.4"/><path d="M7.4 20.4 v-3 h2.4 v3"/>',
    route: '<path d="M6 19.5 c-2 0-3-1.3-3-2.7 s1.2-2.6 3-2.6 h11.6 c1.8 0 3-1.2 3-2.6 s-1.2-2.7-3-2.7 H9"/><circle cx="6" cy="6" r="2.4"/><path d="M18 21.4 v-3.6"/>'
  };
  function svg(name, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function bi(o) { return '<span class="vi">' + esc(o.vi) + '</span><span class="en">' + esc(o.en) + '</span>'; }

  function directions(p) {
    var dest = p.go ? encodeURIComponent(p.go) : (p.lat + ',' + p.lng);
    return 'https://www.google.com/maps/dir/?api=1&destination=' + dest;
  }

  function popupHtml(p) {
    return '<div class="nh-pop">' +
      '<span class="nh-pop-tag">' + bi(p.tag) + '</span>' +
      '<h2>' + bi(p.name) + '</h2>' +
      (p.desc ? '<p>' + bi(p.desc) + '</p>' : '') +
      (p.tip ? '<p class="nh-pop-tip">' + bi({ vi: 'Lưu ý: ' + p.tip.vi, en: 'Note: ' + p.tip.en }) + '</p>' : '') +
      '<a class="nh-go" href="' + esc(directions(p)) + '" target="_blank" rel="noopener">' + svg('route', 18) +
      bi({ vi: 'Chỉ đường', en: 'Directions' }) + '</a>' +
      '</div>';
  }

  var screen = document.getElementById('nh-screen');
  var mapEl = document.getElementById('nh-map');
  var note = document.getElementById('nh-map-note');
  if (!mapEl || !screen) return;

  var HASH = { sight: 'diem-du-lich', food: 'an-uong', plan: 'lich-trinh' };
  var map = null, bounds = [], current = null, openers = {}, pending = null;

  function addPlace(p) {
    var cls = 'nh-mk nh-mk-' + p.cat + (p.major ? ' nh-mk-major' : '');
    var html = '<span class="nh-dot">' + svg(p.cat, p.cat === 'home' ? 18 : 16) + '</span>' +
      '<span class="nh-lbl nh-lbl-full nh-lbl-' + (p.label || 'right') + '">' + bi(p.name) + '</span>' +
      (p.short ? '<span class="nh-lbl nh-lbl-short nh-lbl-' + (p.labelLow || p.label || 'right') + '">' + bi(p.short) + '</span>' : '');
    var size = p.cat === 'home' ? 34 : 30;
    var icon = L.divIcon({ className: cls, html: html, iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2] });
    var m = L.marker([p.lat, p.lng], { icon: icon, title: p.name.vi, riseOnHover: true, zIndexOffset: p.cat === 'home' ? 500 : 0 });
    var pop = L.popup({ maxWidth: 290, minWidth: 220, autoPanPadding: [16, 16], className: 'nh-popup', offset: [0, 7 - size / 2] }).setContent(popupHtml(p));
    function open() { pop.setLatLng(m.getLatLng()).openOn(map); }
    /* Zoomed out, pins sit close together: a tap first zooms in on that place, then opens its box. */
    m.on('click', function () {
      if (map.getZoom() < 12) {
        map.once('moveend', open);
        map.setView(m.getLatLng(), 13.5);
      } else open();
    });
    m.addTo(map);
    bounds.push([p.lat, p.lng]);
    openers[p.id] = function () { map.once('moveend', open); map.setView(m.getLatLng(), 14); };
  }

  /* The map is built the first time a button is pressed, once its box is visible. */
  function ensureMap() {
    if (map) return true;
    if (!window.L) {
      if (note) { note.hidden = false; note.setAttribute('data-kind', 'nolib'); }
      return false;
    }
    map = L.map(mapEl, { zoomSnap: 0.5, minZoom: 8, maxZoom: 18, scrollWheelZoom: true });
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>');
    var loaded = 0, failed = 0;
    var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18, maxNativeZoom: 17,
      attribution: 'Ảnh vệ tinh / Imagery &copy; Esri, Maxar, Earthstar Geographics'
    });
    sat.on('tileload', function () { loaded++; if (note && note.getAttribute('data-kind') === 'tiles') note.hidden = true; });
    sat.on('tileerror', function () {
      failed++;
      if (!loaded && failed >= 3 && note) { note.hidden = false; note.setAttribute('data-kind', 'tiles'); }
    });
    sat.addTo(map);
    PLACES.forEach(addPlace);
    map.on('zoomend', function () { mapEl.classList.toggle('nh-z-low', map.getZoom() < 13); });
    window.addEventListener('resize', function () { map.invalidateSize(); });
    return true;
  }

  function fitAll() {
    if (!map) return;
    map.fitBounds(bounds, { padding: [44, 44] });
    mapEl.classList.toggle('nh-z-low', map.getZoom() < 13);
  }

  function setPressed(g) {
    var tabs = document.querySelectorAll('[data-group]');
    for (var i = 0; i < tabs.length; i++) tabs[i].setAttribute('aria-pressed', tabs[i].getAttribute('data-group') === g ? 'true' : 'false');
  }

  function showChooser() {
    current = null;
    if (map) map.closePopup();
    screen.classList.add('is-choose');
    screen.classList.remove('is-food', 'is-plan');
    setPressed(null);
  }

  function showGroup(g) {
    current = g;
    screen.classList.remove('is-choose');
    screen.classList.toggle('is-food', g === 'food');
    screen.classList.toggle('is-plan', g === 'plan');
    setPressed(g);
    if (g !== 'sight') { if (map) map.closePopup(); return; }
    if (!ensureMap()) return;
    map.closePopup();
    map.invalidateSize();
    fitAll();
    if (pending && openers[pending]) { var id = pending; pending = null; openers[id](); }
    pending = null;
  }

  /* In-page history: each view opened from this page is one step, so "Quay lại" goes back one step
     (map → list of buttons → home), the same as the phone's back button. */
  var steps = [];
  function go(hash) {
    steps.push(location.hash);
    location.hash = hash;
  }

  function route() {
    if (steps.length && steps[steps.length - 1] === location.hash) steps.pop();
    var h = location.hash.replace('#', '');
    if (h === HASH.sight) showGroup('sight');
    else if (h === HASH.food) showGroup('food');
    else if (h === HASH.plan) showGroup('plan');
    else showChooser();
  }

  var tabBtns = document.querySelectorAll('[data-group]');
  for (var t = 0; t < tabBtns.length; t++) {
    tabBtns[t].addEventListener('click', function () {
      var g = this.getAttribute('data-group');
      if (location.hash.replace('#', '') === HASH[g]) showGroup(g);
      else go(HASH[g]);
    });
  }
  window.addEventListener('hashchange', route);

  var backLink = document.getElementById('nh-back');
  if (backLink) backLink.addEventListener('click', function (e) {
    if (current === null) return;            /* on the button list: go to the home page */
    e.preventDefault();
    if (steps.length) { history.back(); return; }
    /* opened straight from a shared link: step up to the button list */
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    route();
  });

  /* Trip plans: switch between the two plans; a place name opens it on the map. */
  var planTabs = document.querySelectorAll('[data-plan]');
  for (var q = 0; q < planTabs.length; q++) {
    planTabs[q].addEventListener('click', function () {
      var k = this.getAttribute('data-plan');
      for (var i = 0; i < planTabs.length; i++) planTabs[i].setAttribute('aria-pressed', planTabs[i] === this ? 'true' : 'false');
      var bodies = document.querySelectorAll('[data-plan-body]');
      for (var b2 = 0; b2 < bodies.length; b2++) bodies[b2].hidden = bodies[b2].getAttribute('data-plan-body') !== k;
    });
  }
  var stopBtns = document.querySelectorAll('[data-place]');
  for (var sb = 0; sb < stopBtns.length; sb++) {
    stopBtns[sb].addEventListener('click', function () {
      pending = this.getAttribute('data-place');
      if (location.hash.replace('#', '') === HASH.sight) showGroup('sight');
      else go(HASH.sight);
    });
  }

  var fitBtn = document.getElementById('nh-fit');
  if (fitBtn) fitBtn.addEventListener('click', function () { if (map) map.closePopup(); fitAll(); });

  route();
})();

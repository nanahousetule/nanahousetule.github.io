/* Nana House – điểm trên bản đồ du lịch (ban-do.html)
   Thêm điểm mới: chép một khối { ... } rồi sửa.
   cat: home | terrace (ruộng bậc thang) | pass (đèo, ngắm cảnh) | town (ăn uống, khoáng nóng) | access (lối rẽ)
   label: right (mặc định) | left | below = chỗ đặt tên cạnh ghim; labelLow = chỗ đặt tên khi thu nhỏ bản đồ.
   major: true = vẫn hiện khi thu nhỏ bản đồ; short = tên ngắn khi thu nhỏ.
   approx: true = vị trí gần đúng, chủ nhà cần kiểm tra lại (xem ban-do.html?sua).
   go: chữ để Google Maps tìm đường; nếu bỏ trống thì chỉ đường theo tọa độ.
   Thứ tự trong danh sách = thứ tự dưới đây (đi từ Tú Lệ về phía Lao Chải). */
window.NH_PLACES = [
  {
    id: 'nana-house', cat: 'home', lat: 21.76900, lng: 104.26577, zoom: 15, major: true, label: 'below',
    name: { vi: 'Nana House', en: 'Nana House' },
    tag: { vi: 'Điểm xuất phát', en: 'Start here' },
    desc: {
      vi: 'Homestay do hai anh em tự tay dựng ở bản Ít Thái, xã Tú Lệ. Từ đây đến trung tâm Tú Lệ khoảng 5 km, lên trung tâm Mù Cang Chải khoảng 45 km.',
      en: 'A homestay built by two siblings with their own hands in Ít Thái village, Tú Lệ. About 5 km to Tú Lệ centre and about 45 km to Mù Cang Chải town.'
    },
    tips: [
      { vi: 'Ô tô và xe máy vào bằng lối rẽ chính; lối tắt phía trên chỉ đi được xe máy.', en: 'Cars and motorbikes use the main turn-off; the upper shortcut is for motorbikes only.' },
      { vi: 'Đồ ăn cần đặt trước qua Zalo.', en: 'Please order meals in advance on Zalo.' }
    ],
    photos: ['img/sp-may-nui.jpg', 'img/sp-view.jpg', 'img/sp-san-vuon.jpg'],
    link: 'https://maps.app.goo.gl/Ee3kjyeRzW47iBqr8'
  },
  {
    id: 'loi-re-chinh', cat: 'access', lat: 21.76922, lng: 104.27200, zoom: 16,
    name: { vi: 'Lối rẽ vào Nana House (ô tô & xe máy)', en: 'Turn-off to Nana House (cars & motorbikes)' },
    tag: { vi: 'Lối vào', en: 'Access' },
    desc: { vi: 'Lối rẽ chính vào homestay, ô tô và xe máy đều đi được.', en: 'The main turn-off to the homestay, fine for cars and motorbikes.' }
  },
  {
    id: 'loi-tat-xe-may', cat: 'access', lat: 21.77703, lng: 104.26486, zoom: 16,
    name: { vi: 'Lối tắt vào Nana House (chỉ xe máy)', en: 'Shortcut to Nana House (motorbikes only)' },
    tag: { vi: 'Lối vào', en: 'Access' },
    desc: { vi: 'Đường tắt hẹp, chỉ đi được xe máy.', en: 'A narrow shortcut, passable by motorbike only.' }
  },
  {
    id: 'tu-le', cat: 'town', lat: 21.8000, lng: 104.2980, zoom: 14, major: true, approx: true,
    short: { vi: 'Tú Lệ', en: 'Tú Lệ' },
    name: { vi: 'Trung tâm Tú Lệ', en: 'Tú Lệ village centre' },
    tag: { vi: 'Khoáng nóng · cốm · xôi nếp', en: 'Hot spring · cốm · sticky rice' },
    desc: {
      vi: 'Thung lũng lúa nếp Tan nổi tiếng của người Thái. Ngay trung tâm xã có bể khoáng nóng tự nhiên; mùa cốm rộ vào tháng 9–10, còn xôi nếp Tú Lệ có quanh năm. Cách Nana House khoảng 5 km.',
      en: 'A valley famous for the Thai people’s Tan sticky rice. A natural hot spring sits right in the village centre; cốm (green rice flakes) is best in Sep–Oct and Tú Lệ sticky rice is served all year. About 5 km from Nana House.'
    },
    tips: [
      { vi: 'Hãy giữ ý khi chụp ảnh người đang tắm ở bể khoáng.', en: 'Please be respectful when photographing people bathing.' }
    ],
    photos: ['img/explore-hotspring.jpg', 'img/explore-com.jpg', 'img/explore-xoi.jpg'],
    go: 'Tú Lệ, Lào Cai'
  },
  {
    id: 'khau-pha', cat: 'pass', lat: 21.7750, lng: 104.2717, zoom: 14,
    name: { vi: 'Đèo Khau Phạ', en: 'Khau Phạ Pass' },
    tag: { vi: 'Bay dù lượn · giữa tháng 8 – giữa tháng 9', en: 'Paragliding · mid-Aug – mid-Sep' },
    desc: {
      vi: 'Một trong “tứ đại đỉnh đèo” Tây Bắc, dài khoảng 30 km với nhiều khúc cua tay áo. Đây là điểm bay dù lượn nổi tiếng nhất vùng, ngắm trọn thung lũng Tú Lệ và ruộng bậc thang bên dưới. Bên kia đèo là bản Lìm Mông của người Mông.',
      en: 'One of the “four great passes” of the Northwest: about 30 km of hairpin bends. It is the area’s best-known paragliding spot, looking over the Tú Lệ valley and the terraces below. Over the top lies Lìm Mông, a Hmong village.'
    },
    tips: [
      { vi: 'Đèo dốc, hay có sương mù: đi chậm, bật đèn và tránh chạy đêm.', en: 'Steep and often foggy: ride slowly, keep your lights on and avoid driving at night.' }
    ],
    photos: ['img/explore-paragliding.jpg', 'img/explore-terraces-2.jpg'],
    go: 'Đèo Khau Phạ'
  },
  {
    id: 'mam-xoi', cat: 'terrace', lat: 21.7950, lng: 104.1500, zoom: 14, major: true, approx: true,
    short: { vi: 'Mâm Xôi', en: 'Mâm Xôi' },
    name: { vi: 'Đồi Mâm Xôi', en: 'Mâm Xôi Hill' },
    tag: { vi: 'La Pán Tẩn', en: 'La Pán Tẩn' },
    desc: {
      vi: 'Biểu tượng của Mù Cang Chải, ở bản Hán Xúng, La Pán Tẩn. Nhìn từ trên cao, ruộng bậc thang quấn quanh ngọn đồi như một mâm xôi. Ruộng bậc thang La Pán Tẩn được xếp hạng danh thắng quốc gia từ năm 2007.',
      en: 'Mù Cang Chải’s signature view, in Hán Xúng village, La Pán Tẩn. From above, the terraces wrap around the hill like a tray of sticky rice. La Pán Tẩn’s terraces have been a national scenic site since 2007.'
    },
    tips: [
      { vi: 'Đường lên dốc: đi bộ hoặc thuê xe ôm địa phương. Có thu vé tham quan.', en: 'Steep way up: walk or hire a local motorbike taxi. There is an entrance fee.' }
    ],
    photos: [],
    go: 'Đồi Mâm Xôi La Pán Tẩn'
  },
  {
    id: 'che-cu-nha', cat: 'terrace', lat: 21.8139, lng: 104.1465, zoom: 14, approx: true,
    name: { vi: 'Ruộng bậc thang Chế Cu Nha', en: 'Chế Cu Nha terraces' },
    tag: { vi: 'Vắng khách, hoang sơ', en: 'Quiet and unspoilt' },
    desc: {
      vi: 'Cùng La Pán Tẩn và Dế Xu Phình, ruộng bậc thang Chế Cu Nha được xếp hạng danh thắng quốc gia năm 2007. Ruộng cao, dốc và uốn lượn mềm mại, ít khách hơn các điểm nổi tiếng.',
      en: 'Along with La Pán Tẩn and Dế Xu Phình, Chế Cu Nha’s terraces became a national scenic site in 2007. High, steep and gently curving, with far fewer visitors than the famous viewpoints.'
    },
    tips: [
      { vi: 'Đường vào dốc; nhiều người chọn ngắm từ xa hoặc từ ven đường.', en: 'The road in is steep; many people enjoy the view from the roadside.' }
    ],
    photos: [],
    go: 'Chế Cu Nha, Mù Cang Chải'
  },
  {
    id: 'mong-ngua', cat: 'terrace', lat: 21.8500, lng: 104.1050, zoom: 14, approx: true,
    name: { vi: 'Đồi Móng Ngựa', en: 'Horseshoe Hill' },
    tag: { vi: 'Gần trung tâm Mù Cang Chải', en: 'Near Mù Cang Chải town' },
    desc: {
      vi: 'Ngọn đồi ở bản Sáng Nhù, cách trung tâm Mù Cang Chải khoảng 2 km, nơi ruộng bậc thang uốn cong như móng ngựa. Một trong những góc chụp ảnh đẹp nhất vùng.',
      en: 'A hill in Sáng Nhù village, about 2 km from Mù Cang Chải town, where the terraces curve like a horseshoe. One of the best photo spots in the area.'
    },
    tips: [
      { vi: 'Đường đất lên đồi rất dốc và hẹp: nên thuê xe ôm địa phương thay vì tự chạy xe.', en: 'The dirt track up is very steep and narrow: hire a local motorbike taxi rather than riding yourself.' }
    ],
    photos: [],
    go: 'Đồi Móng Ngựa Mù Cang Chải'
  },
  {
    id: 'mu-cang-chai', cat: 'town', lat: 21.8469, lng: 104.0917, zoom: 14, major: true, label: 'left', labelLow: 'right',
    short: { vi: 'Mù Cang Chải', en: 'Mù Cang Chải' },
    name: { vi: 'Trung tâm Mù Cang Chải', en: 'Mù Cang Chải town' },
    tag: { vi: 'Ăn uống · đổ xăng', en: 'Food · fuel' },
    desc: {
      vi: 'Trung tâm của vùng, có chợ, quán ăn, cây xăng và nhiều homestay. Cách Nana House khoảng 45 km theo Quốc lộ 32, qua đèo Khau Phạ.',
      en: 'The hub of the area, with a market, places to eat, fuel and plenty of homestays. About 45 km from Nana House along Highway 32, over Khau Phạ Pass.'
    },
    tips: [],
    photos: [],
    go: 'Mù Cang Chải, Lào Cai'
  },
  {
    id: 'lao-chai', cat: 'terrace', lat: 21.8650, lng: 104.0100, zoom: 13, major: true, approx: true, labelLow: 'below',
    short: { vi: 'Lao Chải', en: 'Lao Chải' },
    name: { vi: 'Ruộng bậc thang Lao Chải', en: 'Lao Chải terraces' },
    tag: { vi: 'Cuối tuyến', en: 'End of the route' },
    desc: {
      vi: 'Xã vùng cao phía tây trung tâm Mù Cang Chải, hầu hết là người Mông. Ruộng bậc thang trải rộng và còn vắng khách; trong xã có bãi đá cổ với những hình khắc.',
      en: 'A highland commune west of Mù Cang Chải town, home mostly to Hmong families. Wide terraces with few visitors, plus a field of ancient carved stones.'
    },
    tips: [
      { vi: 'Sau mưa lũ, một số đường vào bản có thể bị sạt lở: hỏi Nana House về tình trạng đường trước khi đi.', en: 'After heavy rain some village roads can be damaged: ask us about road conditions before you go.' }
    ],
    photos: [],
    go: 'Lao Chải, Mù Cang Chải'
  }
];

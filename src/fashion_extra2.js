/* ===================== FASHION BATCH 2: more tops, skirts, hats, glasses, back items, props, auras and pets ===================== */
FASHION.push(
  // tops
  {id:'top_striped', slot:'top', en:'striped shirt', vi:'Áo kẻ ngang', price:70, rar:0},
  {id:'top_polo', slot:'top', en:'polo shirt', vi:'Áo polo', price:90, rar:0},
  {id:'top_school', slot:'top', en:'school uniform', vi:'Đồng phục học sinh', price:120, rar:0, hot:1},
  {id:'top_cardigan', slot:'top', en:'cardigan', vi:'Áo cardigan', price:150, rar:1, lvl:3, hot:1},
  {id:'top_denim', slot:'top', en:'denim jacket', vi:'Áo khoác jean', price:170, rar:1, lvl:4},
  {id:'top_chef', slot:'top', en:'chef jacket', vi:'Áo đầu bếp', price:160, rar:1, lvl:4},
  {id:'top_maid', slot:'top', en:'maid dress', vi:'Váy hầu gái', price:14, cur:'gem', rar:2, lvl:6},
  {id:'top_hero', slot:'top', en:'superhero suit', vi:'Đồ siêu anh hùng', price:16, cur:'gem', rar:2, lvl:7, hot:1},
  {id:'top_astro', slot:'top', en:'space suit', vi:'Đồ phi hành gia', price:20, cur:'gem', rar:2, lvl:8},
  {id:'top_princess', slot:'top', en:'princess dress', vi:'Váy công chúa', price:40, cur:'gem', rar:3, lvl:12, hot:1},
  {id:'top_armor', slot:'top', en:'knight armour', vi:'Giáp hiệp sĩ', price:45, cur:'gem', rar:3, lvl:13},
  {id:'top_dragonrobe', slot:'top', en:'dragon robe', vi:'Long bào hoàng kim', price:260, cur:'gem', rar:4, lvl:22},
  // bottoms
  {id:'bot_joggers', slot:'bottom', en:'joggers', vi:'Quần jogger', price:80, rar:0},
  {id:'bot_mini', slot:'bottom', en:'mini skirt', vi:'Váy ngắn', price:90, rar:0},
  {id:'bot_plaid', slot:'bottom', en:'plaid skirt', vi:'Váy caro', price:120, rar:1, lvl:3, hot:1},
  {id:'bot_leather', slot:'bottom', en:'leather trousers', vi:'Quần da', price:12, cur:'gem', rar:2, lvl:6},
  {id:'bot_rainbow', slot:'bottom', en:'rainbow skirt', vi:'Váy cầu vồng', price:35, cur:'gem', rar:3, lvl:12},
  // hats
  {id:'hat_ribbon', slot:'hat', en:'big bow', vi:'Nơ to', price:70, rar:0, col:'#FF6FB5', hot:1},
  {id:'hat_sunhat', slot:'hat', en:'sun hat', vi:'Mũ rộng vành', price:100, rar:0, col:'#F2D58A'},
  {id:'hat_chef', slot:'hat', en:'chef hat', vi:'Mũ đầu bếp', price:90, rar:0, col:'#FFFFFF'},
  {id:'hat_frog', slot:'hat', en:'frog hat', vi:'Mũ ếch', price:140, rar:1, lvl:3, col:'#3DDC84', hot:1},
  {id:'hat_mushroom', slot:'hat', en:'mushroom hat', vi:'Mũ nấm', price:150, rar:1, lvl:4, col:'#FF3552'},
  {id:'hat_cowboy', slot:'hat', en:'cowboy hat', vi:'Mũ cao bồi', price:170, rar:1, lvl:4, col:'#B9774A'},
  {id:'hat_pirate', slot:'hat', en:'pirate hat', vi:'Mũ cướp biển', price:16, cur:'gem', rar:2, lvl:6, col:'#1F1B24'},
  {id:'hat_unicorn', slot:'hat', en:'unicorn horn', vi:'Sừng kỳ lân', price:28, cur:'gem', rar:3, lvl:10, col:'#FFFFFF', hot:1},
  {id:'hat_phoenix', slot:'hat', en:'phoenix crown', vi:'Mũ phượng hoàng', price:0, rar:4, chest:1, col:'#FF5A2E'},
  // face
  {id:'face_mustache', slot:'face', en:'fake moustache', vi:'Ria mép giả', price:50, rar:0, col:'#1F1B24'},
  {id:'face_eyepatch', slot:'face', en:'eye patch', vi:'Bịt mắt cướp biển', price:80, rar:0, col:'#1F1B24'},
  {id:'face_goggles', slot:'face', en:'swimming goggles', vi:'Kính bơi', price:110, rar:1, lvl:3, col:'#2DD4BF'},
  {id:'face_butterfly', slot:'face', en:'butterfly mask', vi:'Mặt nạ bướm', price:16, cur:'gem', rar:2, lvl:6, col:'#B05CFF', hot:1},
  {id:'face_cyber', slot:'face', en:'cyber visor', vi:'Kính cyber', price:30, cur:'gem', rar:3, lvl:11, col:'#FF2EB5'},
  // back
  {id:'back_teddy', slot:'back', en:'teddy backpack', vi:'Ba lô gấu', price:150, rar:1, lvl:3, col:'#C98B5A', hot:1},
  {id:'back_quiver', slot:'back', en:'quiver', vi:'Bao tên', price:160, rar:1, lvl:4, col:'#8B5A3C'},
  {id:'back_bat', slot:'back', en:'bat wings', vi:'Cánh dơi', price:22, cur:'gem', rar:2, lvl:6, col:'#3B2E5A'},
  {id:'back_crystal', slot:'back', en:'crystal wings', vi:'Cánh pha lê', price:55, cur:'gem', rar:3, lvl:13, col:'#8EE7FF', hot:1},
  {id:'back_ninetails', slot:'back', en:'nine tails', vi:'Cửu vĩ hồ', price:0, rar:4, chest:1, col:'#FFFFFF'},
  // hand
  {id:'hand_book', slot:'hand', en:'book', vi:'Cuốn sách', price:50, rar:0, col:'#4D8BFF'},
  {id:'hand_bouquet', slot:'hand', en:'bouquet', vi:'Bó hoa', price:90, rar:0, col:'#FF6FB5', hot:1},
  {id:'hand_cotton', slot:'hand', en:'candy floss', vi:'Kẹo bông', price:70, rar:0, col:'#FFB3D1'},
  {id:'hand_mic', slot:'hand', en:'microphone', vi:'Micro', price:130, rar:1, lvl:3, col:'#1F1B24'},
  {id:'hand_lantern', slot:'hand', en:'lantern', vi:'Đèn lồng', price:150, rar:1, lvl:4, col:'#FF3552'},
  {id:'hand_teddy', slot:'hand', en:'teddy bear', vi:'Gấu bông', price:160, rar:1, lvl:4, col:'#C98B5A'},
  {id:'hand_starstaff', slot:'hand', en:'star staff', vi:'Gậy ngôi sao', price:22, cur:'gem', rar:2, lvl:7, col:'#FFC83D'},
  {id:'hand_trident', slot:'hand', en:'trident', vi:'Đinh ba thủy thần', price:50, cur:'gem', rar:3, lvl:14, col:'#2DD4BF'},
  // auras
  {id:'aura_bubbles', slot:'aura', en:'bubble aura', vi:'Hào quang bong bóng', price:14, cur:'gem', rar:2, lvl:5, col:'#8EC9FF'},
  {id:'aura_butterfly', slot:'aura', en:'butterfly aura', vi:'Hào quang bướm', price:20, cur:'gem', rar:2, lvl:7, col:'#B05CFF', hot:1},
  {id:'aura_rainbow', slot:'aura', en:'rainbow aura', vi:'Hào quang cầu vồng', price:60, cur:'gem', rar:3, lvl:14, col:'#FF6FB5'},
  {id:'aura_dragon', slot:'aura', en:'dragon fire aura', vi:'Hào quang rồng lửa', price:0, rar:4, chest:1, col:'#FF5A2E'},
  // pets
  {id:'pet_hamster', slot:'pet', en:'hamster', vi:'Chuột hamster', price:140, rar:1, lvl:3, col:'#F2B27A', hot:1},
  {id:'pet_corgi', slot:'pet', en:'corgi', vi:'Chó corgi', price:22, cur:'gem', rar:2, lvl:5, col:'#FF9F4A'},
  {id:'pet_penguin', slot:'pet', en:'penguin', vi:'Chim cánh cụt', price:24, cur:'gem', rar:2, lvl:6, col:'#2B2A40'},
  {id:'pet_frog', slot:'pet', en:'frog', vi:'Ếch xanh', price:18, cur:'gem', rar:2, lvl:5, col:'#3DDC84'},
  {id:'pet_owl', slot:'pet', en:'owl', vi:'Cú mèo', price:35, cur:'gem', rar:3, lvl:10, col:'#9A6A44'},
  {id:'pet_kirin', slot:'pet', en:'baby kirin', vi:'Kỳ lân lửa', price:0, rar:4, chest:1, col:'#FFC83D'}
);
SKIRTS.push('bot_mini', 'bot_plaid', 'bot_rainbow');
DRESSES.push('top_maid', 'top_princess', 'top_dragonrobe');
LONG_SLEEVES.push('top_cardigan', 'top_denim', 'top_chef', 'top_hero', 'top_astro', 'top_armor', 'top_dragonrobe');

function extraTop2(s, c, b, d, tee, waist) {
  switch (s) {
    case 'top_striped': return `${tee}${waist(b)}<path d="M55 117H90M55 121.5H90M55 126H90" stroke="${shade(c, -0.35)}" stroke-width="2"/>`;
    case 'top_polo': return `${tee}${waist(b)}<path d="M64 113L72.5 120L81 113Z" fill="#FFFFFF"/><path d="M72.5 120V126" stroke="${d}" stroke-width="1.5"/><circle cx="72.5" cy="123" r="1" fill="${d}"/>`;
    case 'top_school': return `<rect x="55" y="113" width="35" height="14" fill="#FFFFFF"/>${waist(b)}<path d="M62 113L72.5 119L83 113" stroke="#E2E6EF" stroke-width="2" fill="none"/><path d="M71 117H74L75 126L72.5 128L70 126Z" fill="${c}"/>`;
    case 'top_cardigan': return `<rect x="55" y="113" width="35" height="14" fill="#FFFFFF"/>${waist(b)}<path d="M55 113H67L68 130H55Z M90 113H78L77 130H90Z" fill="${c}"/>${[118, 123, 128].map(y => `<circle cx="66" cy="${y}" r="1.2" fill="${d}"/>`).join('')}`;
    case 'top_denim': return `<rect x="55" y="113" width="35" height="16" fill="${c}"/>${waist(b)}<path d="M57 119H67V125H57Z M78 119H88V125H78Z" fill="none" stroke="#FFC83D" stroke-width="1" stroke-dasharray="2 1.5"/><path d="M72.5 113V129" stroke="${d}" stroke-width="1.5"/>`;
    case 'top_chef': return `<rect x="55" y="113" width="35" height="17" fill="#FFFFFF"/>${waist(b)}${[[66, 117], [66, 122], [79, 117], [79, 122]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${c}"/>`).join('')}<path d="M62 113L72.5 118L83 113" stroke="#E2E6EF" stroke-width="2" fill="none"/>`;
    case 'top_maid': return `<path d="M57 113H88L92.3 134.4C92.7 136.3 91.2 138 89.3 138H55.7C53.8 138 52.3 136.3 52.7 134.4Z" fill="${c}"/><path d="M62 118H83L86 137H59Z" fill="#FFFFFF"/><path d="M59 137Q62 141 65 137Q68 141 71 137Q74 141 77 137Q80 141 83 137Q86 141 86 137" stroke="#FFFFFF" stroke-width="2" fill="none"/>`;
    case 'top_hero': return `<rect x="55" y="113" width="35" height="16" fill="${c}"/>${waist('#FFC83D')}<path d="M72.5 115L76 120L72.5 125L69 120Z" fill="#FFC83D"/><path d="M55 113L60 113L57 120Z M90 113L85 113L88 120Z" fill="${d}"/>`;
    case 'top_astro': return `<rect x="54" y="112" width="37" height="22" rx="6" fill="#F4F6FB"/><rect x="62" y="117" width="21" height="10" rx="3" fill="${c}"/><circle cx="66" cy="122" r="1.6" fill="#FF3552"/><circle cx="72" cy="122" r="1.6" fill="#3DDC84"/><circle cx="78" cy="122" r="1.6" fill="#FFC83D"/>`;
    case 'top_princess': return `<path d="M58 113H87L89 125Q108 140 112 160H33Q37 140 56 125Z" fill="${c}"/><path d="M40 150Q56 140 72.5 150Q89 140 105 150" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity=".8"/><rect x="56" y="123" width="33" height="4" rx="2" fill="#FFC83D"/>${starDots([[52, 146, 2.2], [92, 142, 2.2], [72.5, 136, 2.6]], '#FFFFFF')}`;
    case 'top_armor': return `<rect x="54" y="112" width="37" height="22" rx="5" fill="#C9D3E6"/><path d="M54 120H91M72.5 112V134" stroke="#8E9AB8" stroke-width="2"/><path d="M72.5 116L77 122L72.5 128L68 122Z" fill="${c}"/><rect x="54" y="130" width="37" height="5" fill="#8E9AB8"/>`;
    case 'top_dragonrobe': return `<path d="M57 113H88L92 132L99 160H46L53 132Z" fill="url(#hg_gold)"/><path d="M57 113H88L86 121H59Z" fill="#FF3552"/><path d="M60 140Q66 130 72 138T86 136" stroke="#FF3552" stroke-width="3" fill="none"/><circle cx="62" cy="139" r="2.5" fill="#FF3552"/>${starDots([[80, 150, 2.4], [56, 152, 2]], '#FFFFFF')}`;
  }
  return '';
}
function extraHat2(id, c, lv, t, d) {
  const g = lv ? t : null;
  switch (id) {
    case 'hat_ribbon': return `<path d="M72.5 24L44 8Q36 24 44 40Z M72.5 24L101 8Q109 24 101 40Z" fill="${g || c}"/><circle cx="72.5" cy="24" r="8" fill="${shade(c, -0.2)}"/>`;
    case 'hat_sunhat': return `<ellipse cx="72.5" cy="50" rx="74" ry="14" fill="${c}"/><path d="M36 50Q36 14 72.5 12Q109 14 109 50Z" fill="${shade(c, 0.1)}"/><path d="M36 44Q72.5 36 109 44" stroke="${g || '#FF6FB5'}" stroke-width="7" fill="none"/>`;
    case 'hat_chef': return `<rect x="38" y="30" width="69" height="24" rx="4" fill="#FFFFFF" stroke="#E2E6EF" stroke-width="2"/>${[[44, 18, 16], [72.5, 8, 20], [101, 18, 16]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF"/>`).join('')}<rect x="38" y="44" width="69" height="6" fill="${g || '#E2E6EF'}"/>`;
    case 'hat_frog': return `<path d="M24 58Q24 16 72.5 14Q121 16 121 58Z" fill="${c}"/><circle cx="46" cy="16" r="14" fill="${c}"/><circle cx="99" cy="16" r="14" fill="${c}"/><circle cx="46" cy="16" r="8" fill="#FFFFFF"/><circle cx="99" cy="16" r="8" fill="#FFFFFF"/><circle cx="46" cy="17" r="4" fill="#1F1B24"/><circle cx="99" cy="17" r="4" fill="#1F1B24"/><path d="M50 46Q72.5 56 95 46" stroke="${g || shade(c, -0.3)}" stroke-width="3" fill="none"/>`;
    case 'hat_mushroom': return `<path d="M14 54Q14 0 72.5 0Q131 0 131 54Z" fill="${c}"/>${[[44, 20, 9], [80, 12, 8], [106, 32, 8], [64, 38, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${g || '#FFFFFF'}"/>`).join('')}`;
    case 'hat_cowboy': return `<path d="M4 46Q20 60 72.5 56Q125 60 141 46Q130 52 112 46Z" fill="${d}"/><path d="M38 50Q32 10 56 14Q72.5 22 89 14Q113 10 107 50Z" fill="${c}"/><path d="M38 42Q72.5 34 107 42" stroke="${g || '#1F1B24'}" stroke-width="5" fill="none"/>`;
    case 'hat_pirate': return `<path d="M10 48Q72.5 -10 135 48Q72.5 30 10 48Z" fill="${c}"/><path d="M14 46Q72.5 28 131 46" stroke="${g || '#FFC83D'}" stroke-width="4" fill="none"/><circle cx="72.5" cy="26" r="7" fill="#FFFFFF"/><path d="M66 36L79 36M68 34L77 40M77 34L68 40" stroke="#FFFFFF" stroke-width="2"/>`;
    case 'hat_unicorn': return `<path d="M60 34L72.5 -14L85 34Z" fill="${g || 'url(#hg_gold)'}"/><path d="M63 24L82 20M65 12L80 8" stroke="#FFFFFF" stroke-width="2.5" opacity=".7"/><path d="M40 40Q50 26 62 34Q52 34 40 40Z M105 40Q95 26 83 34Q93 34 105 40Z" fill="#FF8FC7"/>`;
    case 'hat_phoenix': return `<path d="M30 48Q40 10 58 22Q60 0 72.5 -12Q85 0 87 22Q105 10 115 48Z" fill="url(#hg_fire)"/><path d="M50 48L58 30L66 46L72.5 24L79 46L87 30L95 48Z" fill="#FFE48A"/><circle cx="72.5" cy="40" r="6" fill="#FF3552"/>`;
  }
  return '';
}
function extraFace2(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'face_mustache': return `<path d="M50 100Q60 92 72.5 98Q85 92 95 100Q86 106 72.5 101Q59 106 50 100Z" fill="${t}"/>`;
    case 'face_eyepatch': return `<path d="M28 68L118 90" stroke="${t}" stroke-width="3"/><ellipse cx="87" cy="82" rx="12" ry="11" fill="${t}"/>`;
    case 'face_goggles': return `<path d="M24 82H121" stroke="${shade(c, -0.3)}" stroke-width="5"/><rect x="44.5" y="70.5" width="27" height="23" rx="11" fill="${t}" opacity=".85" stroke="#1F1B24" stroke-width="2.5"/><rect x="73.5" y="70.5" width="27" height="23" rx="11" fill="${t}" opacity=".85" stroke="#1F1B24" stroke-width="2.5"/><path d="M50 76L56 74.5M79 76L85 74.5" stroke="#FFFFFF" stroke-width="2.5" opacity=".7"/>`;
    case 'face_butterfly': return `<path d="M72.5 82Q60 60 34 66Q26 84 40 94Q58 98 72.5 86Q87 98 105 94Q119 84 111 66Q85 60 72.5 82Z" fill="${t}"/><ellipse cx="58" cy="81" rx="8" ry="6.5" fill="#1F1B24" opacity=".75"/><ellipse cx="87" cy="81" rx="8" ry="6.5" fill="#1F1B24" opacity=".75"/>${starDots([[36, 70, 3], [109, 70, 3]], '#FFC83D')}`;
    case 'face_cyber': return `<path d="M26 72H119L113 92H32Z" fill="${t}" opacity=".8"/><path d="M32 80H113" stroke="#FFFFFF" stroke-width="2" opacity=".8"/><path d="M26 72H119" stroke="#1F1B24" stroke-width="3"/>`;
  }
  return extraFace3(id, c, lv);
}
function extraBack2(id, c, lv, front, pair) {
  const t = tierFill(lv, c), d = shade(c, -0.2);
  switch (id) {
    case 'back_teddy': return front ? `<circle cx="72.5" cy="128" r="20" fill="${lv ? t : c}"/><circle cx="56" cy="110" r="7" fill="${lv ? t : c}"/><circle cx="89" cy="110" r="7" fill="${lv ? t : c}"/><circle cx="66" cy="124" r="2.5" fill="#1F1B24"/><circle cx="79" cy="124" r="2.5" fill="#1F1B24"/><ellipse cx="72.5" cy="132" rx="6" ry="4" fill="#F2D7B6"/>` : `<rect x="44" y="110" width="57" height="38" rx="16" fill="${lv ? t : c}"/>`;
    case 'back_quiver': return `<rect x="96" y="96" width="14" height="44" rx="5" fill="${lv ? t : c}" transform="rotate(18 103 118)"/><path d="M98 98L104 80M104 98L112 82M108 100L118 86" stroke="#8E8AA8" stroke-width="2"/><path d="M102 78l4 -4 2 6z M110 80l4 -4 2 6z M116 84l4 -4 2 6z" fill="#FF3552"/>`;
    case 'back_bat': return pair(`<path d="M0 0L30 -40Q34 -20 46 -24Q48 -10 62 -12Q58 2 72 6Q50 8 40 18Q30 6 0 0Z" fill="${lv ? t : c}"/><path d="M6 -2L30 -40M30 -40L40 16M46 -24L46 12M62 -12L52 10" stroke="${d}" stroke-width="2" fill="none"/>`, 80, 122);
    case 'back_crystal': return pair(`<path d="M0 0L24 -56L44 -30L70 -46L64 -12L88 -8L58 14L34 20Z" fill="${lv ? t : c}" opacity=".8"/><path d="M0 0L24 -56L34 -16Z M44 -30L70 -46L54 -14Z" fill="#FFFFFF" opacity=".5"/>`, 80, 122);
    case 'back_ninetails': return [-60, -42, -24, -8, 8, 24, 42, 60, 0].map(a => `<g transform="rotate(${a} 72.5 140)"><path d="M72.5 140Q60 96 72.5 56Q85 96 72.5 140Z" fill="#FFFFFF" stroke="#F2E6FF" stroke-width="2"/><path d="M72.5 60Q68 70 72.5 78Q77 70 72.5 60Z" fill="#FF8FC7"/></g>`).join('');
  }
  return '';
}
function extraHand2(id, c, lv) {
  const t = tierFill(lv, c);
  switch (id) {
    case 'hand_book': return `<rect x="-6" y="8" width="26" height="30" rx="3" fill="${lv ? t : c}"/><rect x="-3" y="11" width="20" height="24" fill="#FFFFFF" opacity=".9"/><path d="M0 18H14M0 23H14M0 28H10" stroke="#C9D3E6" stroke-width="1.5"/>`;
    case 'hand_bouquet': return `<path d="M2 36L8 6L14 36Z" fill="#F2E6CC"/>${[[2, -2], [10, -8], [18, -2], [6, 6], [14, 4]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${i % 2 ? (lv ? t : c) : '#FFFFFF'}"/><circle cx="${x}" cy="${y}" r="2.5" fill="#FFC83D"/>`).join('')}<path d="M4 22H12" stroke="#FF3552" stroke-width="3"/>`;
    case 'hand_cotton': return `<path d="M6 30L12 0" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>${[[12, -10, 12], [2, -16, 9], [22, -16, 9], [12, -24, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${lv ? t : c}"/>`).join('')}`;
    case 'hand_mic': return `<rect x="2" y="6" width="9" height="28" rx="3" fill="${lv ? t : c}"/><circle cx="6.5" cy="0" r="9" fill="#C9D3E6"/><path d="M0 -3H13M0 2H13" stroke="#8E9AB8" stroke-width="1.2"/>`;
    case 'hand_lantern': return `<path d="M6 26L10 -4" stroke="#5B3423" stroke-width="2"/><ellipse cx="10" cy="-20" rx="14" ry="16" fill="${lv ? t : c}"/><path d="M10 -36V-4M0 -20H20" stroke="#FFC83D" stroke-width="1.5" opacity=".7"/><rect x="5" y="-38" width="10" height="4" fill="#FFC83D"/><rect x="5" y="-6" width="10" height="4" fill="#FFC83D"/><circle cx="10" cy="-20" r="5" fill="#FFE48A" opacity=".8"/>`;
    case 'hand_teddy': return `<circle cx="10" cy="6" r="13" fill="${lv ? t : c}"/><circle cx="10" cy="-12" r="10" fill="${lv ? t : c}"/><circle cx="2" cy="-20" r="4" fill="${lv ? t : c}"/><circle cx="18" cy="-20" r="4" fill="${lv ? t : c}"/><circle cx="6" cy="-13" r="1.6" fill="#1F1B24"/><circle cx="14" cy="-13" r="1.6" fill="#1F1B24"/><ellipse cx="10" cy="-8" rx="4" ry="3" fill="#F2D7B6"/><path d="M4 0L10 4L16 0" stroke="#FF6FB5" stroke-width="3" fill="none"/>`;
    case 'hand_starstaff': return `<path d="M6 30L18 -40" stroke="#B9BFCC" stroke-width="4" stroke-linecap="round"/>${starDots([[19, -50, 13]], lv ? t : c)}<circle cx="19" cy="-50" r="4" fill="#FFFFFF"/>`;
    case 'hand_trident': return `<path d="M6 32L20 -50" stroke="${lv ? t : c}" stroke-width="4" stroke-linecap="round"/><path d="M8 -56L20 -50L30 -42M14 -66L20 -50M20 -50L34 -58" stroke="${lv ? t : c}" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M6 -60l2-6 2 6zM12 -70l2-6 2 6zM32 -62l2-6 2 6z" fill="${lv ? t : c}"/>`;
  }
  return extraHand3(id, c, lv);
}
// pets with their own body shapes (called from petSVG for ids it does not draw itself)
function petBody2(id, c, hop, eyes) {
  switch (id) {
    case 'pet_hamster': return `<ellipse cx="30" cy="${40 + hop}" rx="20" ry="17" fill="${c}"/><ellipse cx="30" cy="${46 + hop}" rx="12" ry="9" fill="#FFF3E2"/><circle cx="16" cy="${26 + hop}" r="5" fill="${c}"/><circle cx="44" cy="${26 + hop}" r="5" fill="${c}"/><circle cx="16" cy="${26 + hop}" r="2.5" fill="#FFB3D1"/><circle cx="44" cy="${26 + hop}" r="2.5" fill="#FFB3D1"/>${eyes(23, 37, 36 + hop)}<ellipse cx="30" cy="${41 + hop}" rx="2" ry="1.5" fill="#FF8FA3"/>`;
    case 'pet_corgi': return `<ellipse cx="30" cy="51" rx="14" ry="8" fill="${shade(c, -0.05)}"/><path d="M12 ${22 + hop}L14 ${2 + hop}L28 ${16 + hop}Z M48 ${22 + hop}L46 ${2 + hop}L32 ${16 + hop}Z" fill="${c}"/><rect x="11" y="${14 + hop}" width="38" height="32" rx="15" fill="${c}"/><path d="M18 ${34 + hop}Q30 ${48 + hop} 42 ${34 + hop}Q30 ${40 + hop} 18 ${34 + hop}Z" fill="#FFFFFF"/><path d="M30 ${14 + hop}V${28 + hop}" stroke="#FFFFFF" stroke-width="4"/>${eyes(22, 38, 28 + hop)}<ellipse cx="30" cy="${36 + hop}" rx="3" ry="2" fill="#1F1B24"/>`;
    case 'pet_penguin': return `<ellipse cx="30" cy="${38 + hop}" rx="18" ry="20" fill="${c}"/><ellipse cx="30" cy="${42 + hop}" rx="12" ry="15" fill="#FFFFFF"/>${eyes(24, 36, 30 + hop)}<path d="M27 ${35 + hop}h6l-3 4z" fill="#FFB020"/><path d="M12 ${38 + hop}Q6 ${46 + hop} 12 ${52 + hop}M48 ${38 + hop}Q54 ${46 + hop} 48 ${52 + hop}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M22 58h6M32 58h6" stroke="#FFB020" stroke-width="3" stroke-linecap="round"/>`;
    case 'pet_frog': return `<ellipse cx="30" cy="${44 + hop}" rx="22" ry="14" fill="${c}"/><circle cx="18" cy="${30 + hop}" r="9" fill="${c}"/><circle cx="42" cy="${30 + hop}" r="9" fill="${c}"/><circle cx="18" cy="${30 + hop}" r="5" fill="#FFFFFF"/><circle cx="42" cy="${30 + hop}" r="5" fill="#FFFFFF"/><circle cx="18" cy="${31 + hop}" r="2.6" fill="#1F1B24"/><circle cx="42" cy="${31 + hop}" r="2.6" fill="#1F1B24"/><path d="M20 ${46 + hop}Q30 ${54 + hop} 40 ${46 + hop}" stroke="#1F7A44" stroke-width="2.5" fill="none"/><circle cx="14" cy="${46 + hop}" r="3" fill="#FF8FA3" opacity=".6"/><circle cx="46" cy="${46 + hop}" r="3" fill="#FF8FA3" opacity=".6"/>`;
    case 'pet_owl': return `<ellipse cx="30" cy="${40 + hop}" rx="19" ry="19" fill="${c}"/><path d="M13 ${26 + hop}L16 ${12 + hop}L24 ${22 + hop}Z M47 ${26 + hop}L44 ${12 + hop}L36 ${22 + hop}Z" fill="${shade(c, -0.2)}"/><circle cx="22" cy="${34 + hop}" r="8" fill="#FFF3E2"/><circle cx="38" cy="${34 + hop}" r="8" fill="#FFF3E2"/><circle cx="22" cy="${34 + hop}" r="4" fill="#1F1B24"/><circle cx="38" cy="${34 + hop}" r="4" fill="#1F1B24"/><path d="M27 ${40 + hop}h6l-3 5z" fill="#FFB020"/><path d="M22 ${48 + hop}Q30 ${52 + hop} 38 ${48 + hop}M24 ${53 + hop}Q30 ${56 + hop} 36 ${53 + hop}" stroke="${shade(c, 0.3)}" stroke-width="2" fill="none"/>`;
    case 'pet_kirin': return `<path d="M8 ${44 + hop}Q-4 30 6 18Q12 30 20 34Z" fill="#FF5A2E"/><ellipse cx="30" cy="${40 + hop}" rx="18" ry="16" fill="url(#hg_gold)"/><path d="M26 ${24 + hop}L30 ${2 + hop}L34 ${24 + hop}Z" fill="#FF3552"/><path d="M40 ${26 + hop}Q54 ${30 + hop} 50 ${46 + hop}Q46 ${36 + hop} 38 ${32 + hop}Z" fill="#FF5A2E"/>${eyes(23, 35, 37 + hop)}<circle cx="18" cy="${44 + hop}" r="3" fill="#FF8FA3" opacity=".6"/>`;
  }
  return '';
}

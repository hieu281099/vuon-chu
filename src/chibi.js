/* ===================== CHIBI CHARACTERS (SVG paper doll, nemo CC0 style) ===================== */
// Units follow the nemo pack: head space 145 x 143, shoulders at y 113, feet at y 159, centre x 72.5.
const SKIN_TONES = [
  {id:'s1', b:'#FFC2A3', d:'#FFA679', c:'#FFAB91'}, {id:'s2', b:'#F4B48E', d:'#E8956A', c:'#F29A80'},
  {id:'s3', b:'#D99A78', d:'#C47D5C', c:'#D7836B'}, {id:'s4', b:'#D08269', d:'#BE7159', c:'#C66A57'},
  {id:'s5', b:'#A86B4F', d:'#8E5A42', c:'#9A5743'}, {id:'s6', b:'#673A34', d:'#572D28', c:'#5C302B'}
];
const HAIR_COLS = ['#1F1B24','#5B3423','#9A5B34','#FFE994','#FF6B35','#FF3552','#FF8FC7','#9B5CFF','#4D8BFF','#3DDC84','#F4F1EA','#B9BFCC'];
const CLOTH_COLS = ['#FFFFFF','#1F1B24','#8E8AA8','#FF3552','#FF6B35','#FFC83D','#3DDC84','#2DD4BF','#4D8BFF','#545AF2','#9B5CFF','#FF6FB5','#8B5A3C','#F2D58A'];
const HAIR_F = ['regular','straight','chupchik','elegant','curly','none'];
const HAIR_F_VI = {regular:'Tóc mái', straight:'Tóc thẳng', chupchik:'Tóc chỏm', elegant:'Tóc rẽ ngôi', curly:'Tóc xoăn', none:'Đầu trọc'};
const HAIR_B = [null, 'short', 'long', 'curly'];
const HAIR_B_VI = {null:'Không', short:'Ngắn', long:'Dài', curly:'Xoăn bồng'};
const FACES = ['smile','cute','laughs','love','willing','gloating','sleepy','melancholic'];
const FACE_VI = {smile:'Mỉm cười', cute:'Dễ thương', laughs:'Cười tươi', love:'Mắt tim', willing:'Hớn hở', gloating:'Tinh nghịch', sleepy:'Buồn ngủ', melancholic:'Trầm tư'};

// ---- tiers for upgraded items (+0..+6) ----
const TIER = [null, '#DDE6F5', '#3DDC84', '#4D8BFF', '#B05CFF', '#FFB020', 'rainbow'];
const TIER_VI = ['Thường', 'Bạc', 'Lục bảo', 'Lam ngọc', 'Tím huyền', 'Hoàng kim', 'Cầu vồng'];
function tierFill(lv, base) { if (!lv) return base; return TIER[lv] === 'rainbow' ? 'url(#rb)' : TIER[lv]; }
const shade = (hex, f) => { if (!hex || hex[0] !== '#') return hex; const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const t = f < 0 ? 0 : 255, p = Math.abs(f); r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b); return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); };

// ---- fashion catalogue: slot, names, price (coin or diamond), level, rarity, default colour ----
const FASHION = [
  // tops (style) — colour chosen freely
  {id:'top_tee', slot:'top', en:'T-shirt', vi:'Áo phông', price:0, rar:0},
  {id:'top_long', slot:'top', en:'long-sleeved shirt', vi:'Áo dài tay', price:40, rar:0},
  {id:'top_hoodie', slot:'top', en:'hoodie', vi:'Áo hoodie', price:90, rar:1, lvl:2},
  {id:'top_jacket', slot:'top', en:'jacket', vi:'Áo khoác', price:120, rar:1, lvl:3},
  {id:'top_sailor', slot:'top', en:'sailor shirt', vi:'Áo thủy thủ', price:110, rar:1, lvl:4},
  {id:'top_overalls', slot:'top', en:'overalls', vi:'Quần yếm', price:100, rar:1, lvl:2},
  {id:'top_dress', slot:'top', en:'dress', vi:'Váy liền', price:80, rar:0},
  {id:'top_aodai', slot:'top', en:'ao dai', vi:'Áo dài', price:12, cur:'gem', rar:2, lvl:5},
  // bottoms
  {id:'bot_pants', slot:'bottom', en:'trousers', vi:'Quần dài', price:0, rar:0},
  {id:'bot_shorts', slot:'bottom', en:'shorts', vi:'Quần đùi', price:30, rar:0},
  {id:'bot_skirt', slot:'bottom', en:'skirt', vi:'Chân váy', price:50, rar:0},
  // hats
  {id:'hat_cap', slot:'hat', en:'baseball cap', vi:'Mũ lưỡi trai', price:60, rar:0, col:'#FF3552'},
  {id:'hat_beanie', slot:'hat', en:'beanie', vi:'Mũ len', price:70, rar:0, col:'#4D8BFF'},
  {id:'hat_nonla', slot:'hat', en:'conical hat', vi:'Nón lá', price:80, rar:1, col:'#FF3552'},
  {id:'hat_cat', slot:'hat', en:'cat ears', vi:'Tai mèo', price:120, rar:1, lvl:3, col:'#1F1B24'},
  {id:'hat_bunny', slot:'hat', en:'bunny ears', vi:'Tai thỏ', price:150, rar:1, lvl:4, col:'#FFFFFF'},
  {id:'hat_flower', slot:'hat', en:'flower crown', vi:'Vòng hoa', price:160, rar:2, lvl:5, col:'#FF8FC7'},
  {id:'hat_witch', slot:'hat', en:'witch hat', vi:'Mũ phù thủy', price:15, cur:'gem', rar:2, lvl:6, col:'#9B5CFF'},
  {id:'hat_headphones', slot:'hat', en:'headphones', vi:'Tai nghe', price:180, rar:2, lvl:6, col:'#2DD4BF'},
  {id:'hat_grad', slot:'hat', en:'graduation cap', vi:'Mũ tốt nghiệp', price:0, rar:3, col:'#1E1B3A'},
  {id:'hat_crown', slot:'hat', en:'crown', vi:'Vương miện', price:30, cur:'gem', rar:3, lvl:10, col:'#FFC83D'},
  // face
  {id:'face_round', slot:'face', en:'round glasses', vi:'Kính tròn', price:45, rar:0, col:'#1F1B24'},
  {id:'face_square', slot:'face', en:'square glasses', vi:'Kính vuông', price:45, rar:0, col:'#1F1B24'},
  {id:'face_heart', slot:'face', en:'heart sunglasses', vi:'Kính trái tim', price:140, rar:2, lvl:4, col:'#FF3552'},
  // back
  {id:'back_bag', slot:'back', en:'backpack', vi:'Ba lô', price:90, rar:0, col:'#FFC83D'},
  {id:'back_cape', slot:'back', en:'cape', vi:'Áo choàng', price:150, rar:1, lvl:3, col:'#FF3552'},
  {id:'back_angel', slot:'back', en:'angel wings', vi:'Cánh thiên thần', price:20, cur:'gem', rar:2, lvl:4, col:'#FFFFFF'},
  {id:'back_devil', slot:'back', en:'devil wings', vi:'Cánh ác quỷ', price:20, cur:'gem', rar:2, lvl:5, col:'#5B2A86'},
  {id:'back_butterfly', slot:'back', en:'butterfly wings', vi:'Cánh bướm', price:25, cur:'gem', rar:3, lvl:7, col:'#FF8FC7'},
  {id:'back_fairy', slot:'back', en:'fairy wings', vi:'Cánh tiên', price:30, cur:'gem', rar:3, lvl:9, col:'#8EE7FF'},
  // hand
  {id:'hand_balloon', slot:'hand', en:'balloon', vi:'Bóng bay', price:50, rar:0, col:'#FF3552'},
  {id:'hand_lollipop', slot:'hand', en:'lollipop', vi:'Kẹo mút', price:60, rar:0, col:'#FF6FB5'},
  {id:'hand_sunflower', slot:'hand', en:'sunflower', vi:'Hoa hướng dương', price:80, rar:1, col:'#FFC83D'},
  {id:'hand_umbrella', slot:'hand', en:'umbrella', vi:'Ô che mưa', price:120, rar:1, lvl:4, col:'#4D8BFF'},
  {id:'hand_wand', slot:'hand', en:'magic wand', vi:'Đũa phép', price:18, cur:'gem', rar:2, lvl:6, col:'#FFC83D'},
  // aura (under the feet)
  {id:'aura_sparkle', slot:'aura', en:'sparkle aura', vi:'Hào quang lấp lánh', price:15, cur:'gem', rar:2, lvl:5, col:'#FFE48A'},
  {id:'aura_hearts', slot:'aura', en:'heart aura', vi:'Hào quang trái tim', price:18, cur:'gem', rar:2, lvl:6, col:'#FF6FB5'},
  {id:'aura_flame', slot:'aura', en:'flame aura', vi:'Hào quang lửa', price:25, cur:'gem', rar:3, lvl:8, col:'#FF6B35'},
  {id:'aura_leaves', slot:'aura', en:'leaf aura', vi:'Hào quang lá xanh', price:15, cur:'gem', rar:2, lvl:5, col:'#3DDC84'},
  // pets
  {id:'pet_chick', slot:'pet', en:'chick', vi:'Gà con', price:150, rar:1, lvl:2, col:'#FFD43B'},
  {id:'pet_kitty', slot:'pet', en:'kitten', vi:'Mèo con', price:20, cur:'gem', rar:2, lvl:4, col:'#FFB35C'},
  {id:'pet_puppy', slot:'pet', en:'puppy', vi:'Cún con', price:20, cur:'gem', rar:2, lvl:4, col:'#C98B5A'},
  {id:'pet_bunny', slot:'pet', en:'bunny', vi:'Thỏ con', price:22, cur:'gem', rar:2, lvl:6, col:'#FFFFFF'},
  {id:'pet_dragon', slot:'pet', en:'baby dragon', vi:'Rồng con', price:40, cur:'gem', rar:3, lvl:12, col:'#3DDC84'}
];
const FASH = Object.fromEntries(FASHION.map(f => [f.id, f]));
const RARITY = [{vi:'Thường', c:'#8E8AA8'}, {vi:'Hiếm', c:'#4D8BFF'}, {vi:'Sử thi', c:'#B05CFF'}, {vi:'Huyền thoại', c:'#FFB020'}, {vi:'Thần thoại', c:'#FF3552'}];
const SLOTS = [['top','Áo'], ['bottom','Quần váy'], ['hat','Mũ'], ['face','Kính'], ['back','Lưng'], ['hand','Cầm tay'], ['aura','Hào quang'], ['pet','Thú cưng']];
const UPGRADABLE = s => ['hat','face','back','hand','aura','pet'].includes(s);
const DEFAULT_LOOK = {skin:0, hairF:'regular', hairB:null, hairC:'#1F1B24', face:'smile', beard:null,
  top:'top_tee', topC:'#FF3552', bottom:'bot_pants', bottomC:'#545AF2', shoeC:'#1F1B24',
  hat:null, face2:null, back:null, hand:null, aura:null, pet:null, lv:{}};

/* ---------- SVG parts ---------- */
const tpl = (s, c) => s.split('{C}').join(c);
function hatSVG(id, c, lv) {
  const t = tierFill(lv, c), d = shade(c, -0.25), gem = lv ? tierFill(lv, '#fff') : '#FFFFFF';
  switch (id) {
    case 'hat_cap': return `<path d="M27 56 Q29 20 72.5 18 Q116 20 118 56 Z" fill="${c}"/><path d="M72.5 18 Q60 30 58 56 M72.5 18 Q85 30 87 56" stroke="${shade(c, .25)}" stroke-width="3" fill="none"/><path d="M72 52 Q104 44 134 54 Q104 62 72 58Z" fill="${d}"/><circle cx="72.5" cy="19" r="5" fill="${lv ? t : d}"/>`;
    case 'hat_beanie': return `<path d="M26 62 Q26 16 72.5 14 Q119 16 119 62Z" fill="${c}"/><rect x="23" y="52" width="99" height="15" rx="7.5" fill="${d}"/>${[35,47,59,71,83,95,107].map(x => `<rect x="${x}" y="54" width="3" height="11" rx="1.5" fill="${shade(c, -0.4)}" opacity=".5"/>`).join('')}<circle cx="72.5" cy="13" r="11" fill="${lv ? t : '#FFFFFF'}"/>`;
    case 'hat_nonla': return `<path d="M30 58 Q50 112 72.5 116 Q95 112 115 58" stroke="${t}" stroke-width="3" fill="none"/><path d="M-2 58 L72.5 2 L147 58 Q72.5 70 -2 58Z" fill="#F2D58A"/><path d="M72.5 2 L20 56 M72.5 2 L46 61 M72.5 2 L72.5 63 M72.5 2 L99 61 M72.5 2 L125 56" stroke="#D9B260" stroke-width="2"/><path d="M-2 58 Q72.5 70 147 58" stroke="#C99A45" stroke-width="3" fill="none"/>`;
    case 'hat_cat': return `<path d="M30 52 L34 6 L64 34Z" fill="${c}"/><path d="M115 52 L111 6 L81 34Z" fill="${c}"/><path d="M37 42 L39 18 L55 34Z" fill="${lv ? t : '#FF8FC7'}"/><path d="M108 42 L106 18 L90 34Z" fill="${lv ? t : '#FF8FC7'}"/>`;
    case 'hat_bunny': return `<path d="M30 46 Q72.5 24 115 46" stroke="${shade(c, -0.15)}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="52" cy="2" rx="12" ry="34" fill="${c}" transform="rotate(-12 52 2)"/><ellipse cx="93" cy="2" rx="12" ry="34" fill="${c}" transform="rotate(12 93 2)"/><ellipse cx="52" cy="4" rx="6" ry="24" fill="${lv ? t : '#FFB3D1'}" transform="rotate(-12 52 4)"/><ellipse cx="93" cy="4" rx="6" ry="24" fill="${lv ? t : '#FFB3D1'}" transform="rotate(12 93 4)"/>`;
    case 'hat_flower': { const fl = (x, y, col) => `<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 6}" cy="${Math.sin(a * Math.PI / 180) * 6}" r="5.5" fill="${col}"/>`).join('')}<circle r="4" fill="#FFC83D"/></g>`;
      return `<path d="M24 50 Q72.5 18 121 50" stroke="#3DBE6C" stroke-width="5" fill="none"/>${fl(30, 44, c)}${fl(52, 32, lv ? t : '#FFFFFF')}${fl(72.5, 27, c)}${fl(93, 32, lv ? t : '#FFFFFF')}${fl(115, 44, c)}`; }
    case 'hat_witch': return `<ellipse cx="72.5" cy="44" rx="62" ry="12" fill="${d}"/><path d="M38 44 Q52 -6 110 -24 Q90 6 107 44Z" fill="${c}"/><path d="M41 34 Q72.5 40 104 34 L106 42 Q72.5 48 39 42Z" fill="${lv ? t : '#FFC83D'}"/><circle cx="110" cy="-22" r="5" fill="${lv ? t : '#FFC83D'}"/>`;
    case 'hat_headphones': return `<path d="M17 86 Q17 14 72.5 12 Q128 14 128 86" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="2" y="66" width="22" height="40" rx="10" fill="${d}"/><rect x="121" y="66" width="22" height="40" rx="10" fill="${d}"/><circle cx="13" cy="86" r="6" fill="${lv ? t : '#FFFFFF'}"/><circle cx="132" cy="86" r="6" fill="${lv ? t : '#FFFFFF'}"/>`;
    case 'hat_grad': return `<path d="M40 40 Q72.5 30 105 40 L105 56 Q72.5 48 40 56Z" fill="${shade(c, -0.1)}"/><path d="M10 34 L72.5 12 L135 34 L72.5 56Z" fill="${c}"/><path d="M72.5 34 L120 40 L120 66" stroke="${lv ? t : '#FFC83D'}" stroke-width="3" fill="none"/><circle cx="120" cy="70" r="6" fill="${lv ? t : '#FFC83D'}"/><circle cx="72.5" cy="34" r="4" fill="${lv ? t : '#FFC83D'}"/>`;
    case 'hat_crown': return `<path d="M34 46 L30 10 L52 28 L72.5 2 L93 28 L115 10 L111 46Z" fill="${lv ? t : c}"/><rect x="32" y="38" width="81" height="10" rx="4" fill="${shade(c, -0.2)}"/><circle cx="72.5" cy="30" r="6" fill="#FF3552"/><circle cx="50" cy="40" r="4" fill="#4D8BFF"/><circle cx="95" cy="40" r="4" fill="#3DDC84"/><circle cx="72.5" cy="2" r="4" fill="${gem}"/>`;
  }
  return extraHat(id, c, lv, t, d);
}
function faceItemSVG(id, c, lv) {
  if (id === 'face_round') return tpl(NEMO.glasses.round, lv ? tierFill(lv, c) : c);
  if (id === 'face_square') return tpl(NEMO.glasses.square, lv ? tierFill(lv, c) : c);
  if (id === 'face_heart') { const t = lv ? tierFill(lv, c) : c; const h = x => `<path transform="translate(${x} 70)" d="M0 6 C0 -2 10 -4 14 3 C18 -4 28 -2 28 6 C28 14 18 20 14 24 C10 20 0 14 0 6Z" fill="${t}"/>`; return `${h(36)}${h(81)}<path d="M64 78 H81" stroke="${shade(c, -0.3)}" stroke-width="3"/><path d="M40 75 Q44 71 48 74 M85 75 Q89 71 93 74" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity=".7" fill="none"/>`; }
  return extraFace(id, c, lv);
}
// wing / back item, drawn once for the right side then mirrored. flap in degrees.
function backSVG(id, c, lv, flap, front) {
  const t = tierFill(lv, c), l2 = lv ? t : shade(c, 0.35), d = shade(c, -0.2);
  const pair = (inner, ax, ay) => `<g transform="translate(${ax + 6} ${ay - 6}) rotate(${-flap}) scale(1.3)">${inner}</g><g transform="translate(${145 - ax - 6} ${ay - 6}) scale(-1 1) rotate(${-flap}) scale(1.3)">${inner}</g>`;
  switch (id) {
    case 'back_angel': return pair(`<path d="M0 0 C18 -40 70 -58 86 -26 C76 -22 74 -14 80 -8 C66 -8 62 2 68 8 C54 8 50 18 54 24 C36 20 14 14 0 0Z" fill="${lv ? t : c}"/><path d="M8 -2 C24 -30 60 -42 72 -24 C58 -18 52 -8 56 0 C40 2 26 6 8 -2Z" fill="${lv ? shade(TIER[lv] === 'rainbow' ? '#FFFFFF' : TIER[lv], 0.45) : '#EEF2FF'}"/>`, 80, 122);
    case 'back_devil': return pair(`<path d="M0 0 L36 -44 L44 -22 L60 -36 L60 -12 L80 -18 L66 6 Q44 0 34 14 Q20 4 0 0Z" fill="${lv ? t : c}"/><path d="M8 -2 L36 -36 M36 -36 L40 6 M60 -12 L46 6" stroke="${d}" stroke-width="3" fill="none"/>`, 80, 122);
    case 'back_butterfly': return pair(`<ellipse cx="36" cy="-24" rx="34" ry="26" fill="${c}" transform="rotate(-25 36 -24)"/><ellipse cx="30" cy="16" rx="22" ry="17" fill="${l2}" transform="rotate(20 30 16)"/><circle cx="40" cy="-28" r="9" fill="${lv ? t : '#FFFFFF'}" opacity=".9"/><circle cx="30" cy="16" r="6" fill="#FFFFFF" opacity=".8"/>`, 82, 124);
    case 'back_fairy': return pair(`<ellipse cx="34" cy="-30" rx="14" ry="40" fill="${c}" opacity=".55" transform="rotate(48 34 -30)"/><ellipse cx="26" cy="14" rx="10" ry="26" fill="${l2}" opacity=".55" transform="rotate(-50 26 14)"/><ellipse cx="34" cy="-30" rx="14" ry="40" fill="none" stroke="#FFFFFF" stroke-width="2" transform="rotate(48 34 -30)"/>`, 82, 124);
    case 'back_cape': return front ? `<path d="M48 112 L97 112 L118 158 Q72.5 170 27 158Z" fill="${lv ? t : c}"/><path d="M48 112 L97 112 L94 120 Q72.5 126 51 120Z" fill="${d}"/>` : `<path d="M50 112 L95 112 L116 160 Q72.5 168 29 160Z" fill="${lv ? t : c}"/>`;
    case 'back_bag': return front ? `<rect x="42" y="108" width="61" height="44" rx="14" fill="${c}"/><rect x="50" y="128" width="45" height="18" rx="7" fill="${lv ? t : d}"/>` : `<rect x="40" y="110" width="65" height="36" rx="12" fill="${c}"/>`;
  }
  return extraBack(id, c, lv, front, pair);
}
function backStraps(id, c) { return id === 'back_bag' ? `<rect x="58" y="113" width="5" height="15" rx="2" fill="${shade(c, -0.25)}"/><rect x="82" y="113" width="5" height="15" rx="2" fill="${shade(c, -0.25)}"/>` : ''; }
// held in the right hand; coordinates relative to the hand at (6, 26) inside the arm group
function handSVG(id, c, lv) {
  const t = tierFill(lv, c);
  switch (id) {
    case 'hand_balloon': return `<path d="M6 26 Q20 -20 26 -78" stroke="#8E8AA8" stroke-width="1.5" fill="none"/><ellipse cx="27" cy="-96" rx="17" ry="20" fill="${lv ? t : c}"/><path d="M24 -77 L30 -77 L27 -73Z" fill="${shade(c, -0.25)}"/><ellipse cx="21" cy="-103" rx="4" ry="7" fill="#FFFFFF" opacity=".55"/>`;
    case 'hand_lollipop': return `<path d="M6 28 L16 -6" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/><circle cx="18" cy="-16" r="13" fill="${lv ? t : c}"/><path d="M18 -16 m-8 0 a8 8 0 1 1 8 8 a5 5 0 1 1 -5 -5" stroke="#FFFFFF" stroke-width="3" fill="none"/>`;
    case 'hand_sunflower': return `<path d="M6 28 L14 -20" stroke="#3DBE6C" stroke-width="3.5"/><path d="M10 0 Q20 -6 24 2 Q16 6 10 0Z" fill="#3DBE6C"/>${Array.from({length: 10}, (_, i) => { const a = i * 36 * Math.PI / 180; return `<ellipse cx="${15 + Math.cos(a) * 10}" cy="${-30 + Math.sin(a) * 10}" rx="6" ry="3.5" fill="${c}" transform="rotate(${i * 36} ${15 + Math.cos(a) * 10} ${-30 + Math.sin(a) * 10})"/>`; }).join('')}<circle cx="15" cy="-30" r="7" fill="${lv ? t : '#8B5A3C'}"/>`;
    case 'hand_umbrella': return `<path d="M6 28 L16 -70" stroke="#5B3423" stroke-width="3"/><path d="M-40 -66 Q16 -126 72 -66 Q58 -74 44 -66 Q30 -74 16 -66 Q2 -74 -12 -66 Q-26 -74 -40 -66Z" fill="${lv ? t : c}"/><path d="M16 -110 L16 -66" stroke="${shade(c, 0.4)}" stroke-width="2"/>`;
    case 'hand_wand': return `<path d="M6 28 L20 -14" stroke="#5B3423" stroke-width="3.5" stroke-linecap="round"/><path d="M22 -38 L26 -26 L39 -26 L29 -18 L33 -6 L22 -13 L11 -6 L15 -18 L5 -26 L18 -26Z" fill="${lv ? t : c}"/>`;
    case 'tool_can': return `<rect x="-4" y="16" width="26" height="18" rx="5" fill="#4D8BFF"/><path d="M20 20 L36 8" stroke="#4D8BFF" stroke-width="5" stroke-linecap="round"/><path d="M2 16 Q10 4 18 16" stroke="#3567CC" stroke-width="3" fill="none"/>`;
    case 'tool_hoe': return `<path d="M6 30 L30 -26" stroke="#8B5A3C" stroke-width="4" stroke-linecap="round"/><path d="M26 -30 L44 -24 L40 -16 Z" fill="#8E8AA8"/>`;
    case 'tool_rod': return `<path d="M6 30 L60 -50" stroke="#8B5A3C" stroke-width="3" stroke-linecap="round"/>`;
  }
  return extraHand(id, c, lv);
}
function topSVG(L, frame) {
  const s = L.top, c = L.topC, b = L.bottomC, d = shade(c, -0.18);
  const tee = `<rect x="55" y="113" width="35" height="14" fill="${c}"/>`;
  const waist = (col) => `<path d="M55 127H90V132C90 135.3 87.3 138 84 138H61C57.7 138 55 135.3 55 132V127Z" fill="${col}"/>`;
  switch (s) {
    case 'top_dress': return `<path d="M57 113H88L92.3 134.4C92.7 136.3 91.2 138 89.3 138H55.7C53.8 138 52.3 136.3 52.7 134.4L57 113Z" fill="${c}"/>`;
    case 'top_aodai': return `<path d="M57 113H88L90 132 L96 158 L72.5 160 L49 158 L55 132Z" fill="${c}"/><path d="M66 113 Q72.5 120 79 113" stroke="${d}" stroke-width="2.5" fill="none"/><path d="M72.5 132 L72.5 159" stroke="${d}" stroke-width="1.5"/>`;
    case 'top_hoodie': return `${tee}${waist(b)}<rect x="62" y="119" width="21" height="7" rx="3" fill="${d}"/><path d="M68 113 L67 120 M77 113 L78 120" stroke="#FFFFFF" stroke-width="1.5"/>`;
    case 'top_jacket': return `<rect x="55" y="113" width="35" height="14" fill="#FFFFFF"/>${waist(b)}<path d="M55 113 H68 L66 128 H55Z" fill="${c}"/><path d="M90 113 H77 L79 128 H90Z" fill="${c}"/><path d="M62 113 L68 121 L66 113Z M83 113 L77 121 L79 113Z" fill="${d}"/>`;
    case 'top_sailor': return `<rect x="55" y="113" width="35" height="14" fill="#FFFFFF"/>${waist(b)}<path d="M55 113 H90 L72.5 125Z" fill="${c}"/><path d="M68 121 L72.5 126 L77 121 L72.5 124Z" fill="#FF3552"/>`;
    case 'top_overalls': return `${tee}<path d="M60 118 H85 V127 H90 V132 C90 135.3 87.3 138 84 138 H61 C57.7 138 55 135.3 55 132 V127 H60Z" fill="${b}"/><rect x="60" y="113" width="3" height="6" fill="${b}"/><rect x="82" y="113" width="3" height="6" fill="${b}"/><circle cx="62" cy="120" r="1.6" fill="#FFC83D"/><circle cx="83" cy="120" r="1.6" fill="#FFC83D"/>`;
    default: return extraTop(s, c, b, d, tee, waist) || tee + waist(b);
  }
}
function legSVG(L, x, dy, skin) {
  const pants = DRESSES.includes(L.top) ? (L.top === 'top_aodai' ? 'aodai' : 'bare') : (L.bottom === 'bot_shorts' ? 'shorts' : SKIRTS.includes(L.bottom) ? 'bare' : 'pants');
  const y = 131 + dy, sh = L.shoeC || '#1F1B24';
  let s = `<rect x="${x}" y="${y}" width="13" height="28" rx="6.5" fill="${skin.b}"/>`;
  if (pants === 'pants') s += `<path d="M${x} ${y + 6.5}C${x} ${y + 2.9} ${x + 2.9} ${y} ${x + 6.5} ${y}S${x + 13} ${y + 2.9} ${x + 13} ${y + 6.5}V${y + 15}H${x}Z" fill="${L.bottomC}"/>`;
  if (pants === 'pants' && L.bottom === 'bot_jeans') s += `<rect x="${x + 3}" y="${y + 7}" width="7" height="2.5" rx="1.2" fill="${skin.b}"/><path d="M${x + 6.5} ${y}V${y + 15}" stroke="${shade(L.bottomC, -0.25)}" stroke-width="1"/>`;
  if (pants === 'pants' && L.bottom === 'bot_cargo') s += `<rect x="${x + 2}" y="${y + 5}" width="9" height="7" rx="1.5" fill="${shade(L.bottomC, -0.18)}"/>`;
  if (pants === 'aodai') s += `<rect x="${x}" y="${y}" width="13" height="15" fill="#FFFFFF"/>`;
  if (pants === 'shorts') s += `<path d="M${x} ${y + 6.5}C${x} ${y + 2.9} ${x + 2.9} ${y} ${x + 6.5} ${y}S${x + 13} ${y + 2.9} ${x + 13} ${y + 6.5}V${y + 11}H${x}Z" fill="${L.bottomC}"/>`;
  s += `<rect x="${x}" y="${y + 15}" width="13" height="3" fill="#FFFFFF"/><path d="M${x} ${y + 18}H${x + 13}V${y + 21.5}C${x + 13} ${y + 25.1} ${x + 10.1} ${y + 28} ${x + 6.5} ${y + 28}S${x} ${y + 25.1} ${x} ${y + 21.5}Z" fill="${sh}"/>`;
  return s;
}
function skirtSVG(L) { if (DRESSES.includes(L.top)) return ''; const k = L.bottomC;
  if (L.bottom === 'bot_pleated') return `<path d="M55 126H90L96 143H49Z" fill="${k}"/><path d="M60 127L57 143M66 127L65 143M72.5 127V143M79 127L80 143M85 127L88 143" stroke="${shade(k, -0.25)}" stroke-width="1.3"/>`;
  if (L.bottom === 'bot_tutu') return `<path d="M55 126H90Q108 134 100 140Q96 146 88 141Q80 147 72.5 142Q65 147 57 141Q49 146 45 140Q37 134 55 126Z" fill="${k}"/><path d="M52 132Q72.5 138 93 132" stroke="#FFFFFF" stroke-width="2" opacity=".6" fill="none"/>`;
  return L.bottom === 'bot_skirt' ? `<path d="M55 126H90L95 141C95.5 142.6 94.3 144 92.6 144H52.4C50.7 144 49.5 142.6 50 141Z" fill="${L.bottomC}"/>` : ''; }
function armSVG(L, x, rot, skin, hand) {
  const long = LONG_SLEEVES.includes(L.top);
  const sc = L.top === 'top_jacket' || L.top === 'top_hoodie' || L.top === 'top_long' || L.top === 'top_aodai' || L.top === 'top_sailor' ? L.topC : L.topC;
  const sl = long ? 21 : 13;
  return `<g transform="rotate(${rot} ${x + 6} 116)"><rect x="${x}" y="113" width="12" height="28" rx="6" fill="${skin.b}"/><path d="M${x} 119C${x} 115.7 ${x + 2.7} 113 ${x + 6} 113S${x + 12} 115.7 ${x + 12} 119V${113 + sl}H${x}Z" fill="${sc}"/>${hand ? `<g transform="translate(${x} 113)">${hand}</g>` : ''}</g>`;
}
function headSVG(L, skin, back) {
  const head = `<rect x="11" y="76" width="123" height="29" rx="14.5" fill="${skin.b}"/><rect x="19" y="83" width="107" height="15" rx="7.5" fill="${skin.d}"/><rect x="25" y="34" width="95" height="83" rx="30" fill="${skin.b}"/>`;
  if (back) return head + (L.hairF !== 'none' ? `<rect x="23" y="32" width="99" height="87" rx="31" fill="${L.hairC}"/>` : '');
  return head + `<circle cx="45" cy="99" r="10" fill="${skin.c}"/><circle cx="100" cy="99" r="10" fill="${skin.c}"/>`;
}
const RB_DEF = `<defs><linearGradient id="rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF3552"/><stop offset=".25" stop-color="#FFC83D"/><stop offset=".5" stop-color="#3DDC84"/><stop offset=".75" stop-color="#4D8BFF"/><stop offset="1" stop-color="#B05CFF"/></linearGradient><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="hg_pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8FC7"/><stop offset="1" stop-color="#9B5CFF"/></linearGradient><linearGradient id="hg_ocean" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4D8BFF"/><stop offset="1" stop-color="#7EF0C4"/></linearGradient><linearGradient id="hg_fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF3552"/><stop offset=".55" stop-color="#FF8A3D"/><stop offset="1" stop-color="#FFE48A"/></linearGradient><linearGradient id="hg_silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#D9DDF0"/><stop offset="1" stop-color="#B8B4E0"/></linearGradient><linearGradient id="hg_gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset=".45" stop-color="#FFC83D"/><stop offset="1" stop-color="#C98A1A"/></linearGradient><linearGradient id="hg_galaxy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E1B4B"/><stop offset=".5" stop-color="#6D3FD8"/><stop offset="1" stop-color="#FF6FB5"/></linearGradient><linearGradient id="hg_aurora" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3DDC84"/><stop offset=".5" stop-color="#2DD4BF"/><stop offset="1" stop-color="#9B5CFF"/></linearGradient></defs>`;
const glowWrap = (lv, s) => s && lv >= 4 ? `<g filter="url(#gl)">${s}</g>` : s;
// how each held item sits in the hand: [scale, lean in degrees away from the head]. Long items lean out so they clear the face.
const HAND_FIT = {
  _: [1.35, 28],
  hand_balloon: [1.15, 22], hand_umbrella: [1.1, 26], hand_wand: [1.45, 34], hand_sunflower: [1.4, 32], hand_lollipop: [1.5, 30],
  hand_saber: [1.15, 36], hand_scepter: [1.3, 32], hand_starstaff: [1.25, 32], hand_trident: [1.15, 34], hand_lantern: [1.35, 26], hand_cotton: [1.45, 28],
  hand_boba: [1.7, 8], hand_icecream: [1.7, 14], hand_phone: [1.7, 6], hand_book: [1.6, 6], hand_bouquet: [1.6, 16], hand_teddy: [1.55, 10], hand_fan: [1.5, 18], hand_mic: [1.7, 16]
};
// frame: {legs:[dl,dr], bob, arms:[rl,rr], face, tool, flap}
function chibiInner(L, f, dir) {
  const skin = SKIN_TONES[L.skin] || SKIN_TONES[0], lv = L.lv || {}, back = dir === 'u';
  const bob = f.bob || 0, face = f.face || L.face || 'smile';
  const backItem = L.back ? glowWrap(lv[L.back], backSVG(L.back, FASH[L.back].col, lv[L.back] || 0, f.flap || 0, back)) : '';
  const handItem = f.tool ? handSVG(f.tool, '#fff', 0) : (L.hand ? glowWrap(lv[L.hand], handSVG(L.hand, FASH[L.hand].col, lv[L.hand] || 0)) : '');
  let s = '';
  if (!back) s += backItem;
  if (L.hairB && !back) s += `<g transform="translate(0 ${bob})">${tpl(NEMO.hairB[L.hairB], L.hairC)}</g>`;
  s += legSVG(L, 59, f.legs ? f.legs[0] : 0, skin) + legSVG(L, 73, f.legs ? f.legs[1] : 0, skin);
  s += `<g transform="translate(0 ${bob})">`;
  // farm tools stay in the arm layer; fashion items held in the hand are drawn last (see below) so the big head never hides them
  const tool = f.tool ? handItem : '';
  s += armSVG(L, 44, f.arms ? f.arms[0] : 0, skin, back ? tool : '');
  s += `<path d="M55 113H90V132C90 135.3 87.3 138 84 138H61C57.7 138 55 135.3 55 132V113Z" fill="${skin.b}"/>` + topSVG(L, f) + skirtSVG(L);
  if (L.back && !back) s += backStraps(L.back, FASH[L.back].col);
  s += armSVG(L, 89, f.arms ? f.arms[1] : 0, skin, back ? '' : tool);
  s += headSVG(L, skin, back);
  if (!back) {
    s += NEMO.faces[face] || NEMO.faces.smile;
    if (L.beard) s += tpl(NEMO.beards[L.beard], L.hairC);
    if (L.face2) s += glowWrap(lv[L.face2], faceItemSVG(L.face2, FASH[L.face2].col, lv[L.face2] || 0));
  }
  if (L.hairF && L.hairF !== 'none') s += tpl(NEMO.hairF[L.hairF], L.hairC);
  if (L.hairB && back) s += tpl(NEMO.hairB[L.hairB], L.hairC);
  if (L.hat) s += glowWrap(lv[L.hat], hatSVG(L.hat, FASH[L.hat].col, lv[L.hat] || 0));
  // held item on top of everything, following the arm's swing and leaning away from the head
  if (handItem && !f.tool) {
    const fit = HAND_FIT[L.hand] || HAND_FIT._, ax = back ? 44 : 89, rot = f.arms ? f.arms[back ? 0 : 1] : 0, lean = (back ? -1 : 1) * fit[1];
    s += `<g transform="rotate(${rot} ${ax + 6} 116)"><g transform="translate(${ax} 113)"><g transform="rotate(${lean} 6 26) translate(6 26) scale(${fit[0]}) translate(-6 -26)">${handItem}</g><rect x="0" y="20" width="12" height="9" rx="4.5" fill="${skin.b}"/></g></g>`;
  }
  s += `</g>`;
  if (back) s += backItem;
  return s;
}
// viewBox spans wings, tall hats and balloons. Anchor (feet centre) = (72.5, 159).
const VB = {x: -80, y: -130, w: 305, h: 300};
function chibiSVG(L, f = {}, dir = 'd') {
  const flip = dir === 'l';
  const inner = chibiInner(L, f, dir);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" width="${VB.w}" height="${VB.h}">${RB_DEF}<g ${flip ? 'transform="translate(145 0) scale(-1 1)"' : ''}>${inner}</g></svg>`;
}
const svgURL = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
function portraitSVG(L, opts = {}) {
  const inner = chibiInner(Object.assign({}, L, {hand: opts.hand ? L.hand : null}), {face: opts.face}, 'd');
  const vb = opts.full ? `${VB.x + 40} ${-60} ${VB.w - 80} 230` : `-6 -10 157 160`;
  return svgURL(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${RB_DEF}${inner}</svg>`);
}

/* ---------- animation frames ---------- */
const FRAMES = {
  idle0: {}, idle1: {bob: 1, flap: 6}, blink: {face: 'sleepy'},
  walk0: {legs: [-4, 0], bob: -2, arms: [14, -14], flap: 12}, walk1: {legs: [0, 0], bob: 0, arms: [0, 0], flap: 0},
  walk2: {legs: [0, -4], bob: -2, arms: [-14, 14], flap: -10}, walk3: {legs: [0, 0], bob: 0, arms: [0, 0], flap: 4},
  water: {arms: [0, -55], tool: 'tool_can', bob: 0}, water2: {arms: [0, -75], tool: 'tool_can', bob: 1},
  hoe: {arms: [0, -120], tool: 'tool_hoe', bob: -1}, hoe2: {arms: [0, -30], tool: 'tool_hoe', bob: 2},
  fish: {arms: [0, -40], tool: 'tool_rod'},
  cheer: {arms: [150, -150], legs: [-2, -2], bob: -6, face: 'laughs', flap: 16}, wave: {arms: [0, -150], face: 'willing'}
};
const CHIBI_K = 0.36;           // native world px per chibi unit (character ~57 px tall)
const CHIBI_CACHE = new Map();
function chibiImage(L, frame, dir, px) {
  const key = JSON.stringify(L) + '|' + frame + '|' + dir + '|' + px;
  let e = CHIBI_CACHE.get(key);
  if (!e) {
    const im = new Image(); e = {im, ok: false}; CHIBI_CACHE.set(key, e);
    im.onload = () => { e.ok = true; }; im.src = svgURL(chibiSVG(L, FRAMES[frame] || {}, dir).replace(`width="${VB.w}" height="${VB.h}"`, `width="${px}" height="${Math.round(px * VB.h / VB.w)}"`));
    if (CHIBI_CACHE.size > 900) { const first = CHIBI_CACHE.keys().next().value; CHIBI_CACHE.delete(first); }
  }
  return e.ok ? e.im : null;
}
// draw with feet at (x, y) in the current world transform; pxScale = device px per world px
const LAST_OK = new Map();
function drawChibi(g, L, frame, dir, x, y, pxScale, id) {
  const w = VB.w * CHIBI_K, h = VB.h * CHIBI_K, px = Math.max(60, Math.round(w * pxScale));
  let im = chibiImage(L, frame, dir === 'u' ? 'u' : dir === 'l' ? 'l' : 'd', px);
  if (!im && id) im = LAST_OK.get(id); else if (im && id) LAST_OK.set(id, im);
  if (!im) return false;
  const smooth = g.imageSmoothingEnabled; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  g.drawImage(im, x - (72.5 - VB.x) * CHIBI_K, y - (159 - VB.y) * CHIBI_K, w, h);
  g.imageSmoothingEnabled = smooth; return true;
}

/* ---------- pets ---------- */
function petSVG(id, lv, frame) {
  const P = FASH[id], c = P.col, t = lv ? tierFill(lv, '#FF6FB5') : '#FF6FB5', hop = frame % 2 ? -3 : 0;
  const eyes = (x1, x2, y) => `<circle cx="${x1}" cy="${y}" r="3" fill="#1F1B24"/><circle cx="${x2}" cy="${y}" r="3" fill="#1F1B24"/><circle cx="${x1 + 1}" cy="${y - 1}" r="1" fill="#fff"/><circle cx="${x2 + 1}" cy="${y - 1}" r="1" fill="#fff"/>`;
  const bow = `<path d="M30 ${44 + hop} l-7 -5 v10z M30 ${44 + hop} l7 -5 v10z" fill="${t}"/><circle cx="30" cy="${44 + hop}" r="2.5" fill="${shade(t === 'url(#rb)' ? '#FFC83D' : t, -0.2)}"/>`;
  const crown = lv >= 6 ? `<path d="M20 ${8 + hop} l3 -9 l7 6 l7 -6 l3 9z" fill="url(#rb)"/>` : '';
  let body = '';
  switch (id) {
    case 'pet_chick': case 'pet_phoenix': body = (id === 'pet_phoenix' ? `<path d="M14 ${44 + hop}Q-4 34 4 14Q10 30 20 34Z" fill="#FFC83D"/><path d="M46 ${44 + hop}Q64 34 56 14Q50 30 40 34Z" fill="#FFC83D"/><path d="M24 ${28 + hop}Q20 6 30 0Q34 12 37 28Z" fill="#FFC83D"/>` : '') + `<ellipse cx="30" cy="${40 + hop}" rx="18" ry="16" fill="${c}"/><ellipse cx="30" cy="${46 + hop}" rx="11" ry="8" fill="${shade(c, 0.45)}"/><path d="M27 ${36 + hop} l6 0 l-3 5z" fill="#FF6B35"/>${eyes(24, 36, 31 + hop)}<path d="M28 ${24 + hop} q2 -6 5 -2" stroke="${c}" stroke-width="3" fill="none"/><path d="M24 56 v3 M36 56 v3" stroke="#FF6B35" stroke-width="2"/>`; break;
    case 'pet_kitty': case 'pet_puppy': case 'pet_bunny': case 'pet_fox': case 'pet_panda': case 'pet_unicorn': {
      const ears = id === 'pet_fox' ? `<path d="M12 ${24 + hop}L14 ${2 + hop}L30 ${16 + hop}Z M48 ${24 + hop}L46 ${2 + hop}L30 ${16 + hop}Z" fill="${c}"/><path d="M16 ${18 + hop}L17 ${8 + hop}L24 ${15 + hop}Z M44 ${18 + hop}L43 ${8 + hop}L36 ${15 + hop}Z" fill="#1F1B24"/>` : id === 'pet_panda' ? `<circle cx="15" cy="${16 + hop}" r="7" fill="#1F1B24"/><circle cx="45" cy="${16 + hop}" r="7" fill="#1F1B24"/>` : id === 'pet_unicorn' ? `<path d="M16 ${20 + hop}L18 ${8 + hop}L26 ${16 + hop}Z M44 ${20 + hop}L42 ${8 + hop}L34 ${16 + hop}Z" fill="${c}"/><path d="M26 ${16 + hop}L30 ${-10 + hop}L34 ${16 + hop}Z" fill="url(#rb)"/>` : id === 'pet_kitty' ? `<path d="M14 ${22 + hop} L16 ${4 + hop} L28 ${16 + hop}Z M46 ${22 + hop} L44 ${4 + hop} L32 ${16 + hop}Z" fill="${c}"/>` : id === 'pet_puppy' ? `<ellipse cx="13" cy="${26 + hop}" rx="6" ry="11" fill="${shade(c, -0.3)}"/><ellipse cx="47" cy="${26 + hop}" rx="6" ry="11" fill="${shade(c, -0.3)}"/>` : `<ellipse cx="22" cy="${4 + hop}" rx="5" ry="15" fill="${c}"/><ellipse cx="38" cy="${4 + hop}" rx="5" ry="15" fill="${c}"/><ellipse cx="22" cy="${6 + hop}" rx="2.5" ry="10" fill="#FFB3D1"/><ellipse cx="38" cy="${6 + hop}" rx="2.5" ry="10" fill="#FFB3D1"/>`;
      body = `<ellipse cx="30" cy="51" rx="13" ry="8" fill="${shade(c, -0.08)}"/>${ears}<rect x="11" y="${14 + hop}" width="38" height="32" rx="15" fill="${c}"/>${id === 'pet_panda' ? `<ellipse cx="22" cy="${29 + hop}" rx="6" ry="7" fill="#1F1B24"/><ellipse cx="38" cy="${29 + hop}" rx="6" ry="7" fill="#1F1B24"/>` : id === 'pet_fox' ? `<path d="M14 ${34 + hop}Q30 ${50 + hop} 46 ${34 + hop}Q30 ${42 + hop} 14 ${34 + hop}Z" fill="#FFFFFF"/>` : id === 'pet_unicorn' ? `<path d="M40 ${14 + hop}Q54 ${22 + hop} 50 ${40 + hop}Q46 ${28 + hop} 38 ${22 + hop}Z" fill="#FF8FC7"/><path d="M44 ${16 + hop}Q56 ${26 + hop} 52 ${36 + hop}" stroke="#8EE7FF" stroke-width="3" fill="none"/>` : ''}${id === 'pet_panda' ? `<circle cx="23" cy="${29 + hop}" r="2.6" fill="#FFFFFF"/><circle cx="37" cy="${29 + hop}" r="2.6" fill="#FFFFFF"/>` : ''}${eyes(23, 37, 29 + hop)}<ellipse cx="30" cy="${35 + hop}" rx="3" ry="2" fill="#1F1B24"/><circle cx="17" cy="${36 + hop}" r="3.5" fill="#FF8FA3" opacity=".6"/><circle cx="43" cy="${36 + hop}" r="3.5" fill="#FF8FA3" opacity=".6"/>${id === 'pet_kitty' || id === 'pet_fox' ? `<path d="M43 52 q12 -2 10 -14" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>` : ''}`; break; }
    default: body = petBody2(id, c, hop, eyes); break;
    case 'pet_dragon': body = `<path d="M8 ${30 + hop} q-8 -14 6 -18 q0 8 8 10z M52 ${30 + hop} q8 -14 -6 -18 q0 8 -8 10z" fill="${shade(c, -0.25)}"/><ellipse cx="30" cy="${38 + hop}" rx="18" ry="17" fill="${c}"/><ellipse cx="30" cy="${45 + hop}" rx="10" ry="8" fill="#FFF3B0"/><path d="M22 ${22 + hop} l-3 -8 l6 5z M38 ${22 + hop} l3 -8 l-6 5z" fill="#FFC83D"/>${eyes(23, 37, 33 + hop)}<path d="M46 50 q10 4 8 -6" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`; break;
  }
  const glow = lv >= 4 ? `<ellipse cx="30" cy="34" rx="28" ry="26" fill="${TIER[lv] === 'rainbow' ? '#FFE48A' : TIER[lv]}" opacity=".28"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -12 60 72" width="120" height="144">${RB_DEF}${glow}${body}${lv ? bow : ''}${crown}</svg>`;
}
const PET_CACHE = new Map();
function petImage(id, lv, frame) {
  const k = id + lv + '|' + frame; let e = PET_CACHE.get(k);
  if (!e) { const im = new Image(); e = {im, ok: false}; PET_CACHE.set(k, e); im.onload = () => { e.ok = true; }; im.src = svgURL(petSVG(id, lv, frame)); }
  return e.ok ? e.im : null;
}

/* ---------- auras (canvas particles) ---------- */
function drawAura(g, id, lv, x, y, t) {
  const base = FASH[id].col, col = id === 'aura_dragon' ? `hsl(${10 + (t / 20) % 40} 100% 60%)` : id === 'aura_galaxy' || id === 'aura_rainbow' ? `hsl(${(t / 6) % 360} 90% 70%)` : lv ? (TIER[lv] === 'rainbow' ? `hsl(${(t / 8) % 360} 90% 65%)` : TIER[lv]) : base;
  const n = 5 + lv * 2, r = 18 + lv;
  g.save(); g.globalAlpha = 0.35 + lv * 0.05; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, r, r * 0.38, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + t / 900, k = ((t / 1400 + i / n) % 1);
    const px = x + Math.cos(a) * r * 0.9, py = y + Math.sin(a) * r * 0.3 - k * (26 + lv * 4);
    g.globalAlpha = 1 - k; g.fillStyle = ['aura_sparkle', 'aura_leaves', 'aura_galaxy', 'aura_rainbow', 'aura_dragon'].includes(id) ? col : base;
    const s = 2.2 + (i % 3) * 0.6;
    if (id === 'aura_hearts') { g.beginPath(); g.moveTo(px, py + s); g.bezierCurveTo(px - 2 * s, py - s * 0.6, px - s * 0.6, py - 2 * s, px, py - s * 0.6); g.bezierCurveTo(px + s * 0.6, py - 2 * s, px + 2 * s, py - s * 0.6, px, py + s); g.fill(); }
    else if (id === 'aura_flame' || id === 'aura_dragon') { g.beginPath(); g.ellipse(px, py, s * 0.9, s * 1.6, 0, 0, Math.PI * 2); g.fill(); }
    else if (id === 'aura_bubbles') { g.strokeStyle = base; g.lineWidth = 1.2; g.beginPath(); g.arc(px, py, s * 1.4, 0, Math.PI * 2); g.stroke(); }
    else if (id === 'aura_snow') { g.beginPath(); g.arc(px, py, s * 1.1, 0, Math.PI * 2); g.fill(); }
    else if (id === 'aura_leaves' || id === 'aura_sakura' || id === 'aura_butterfly') { g.beginPath(); g.ellipse(px, py, s * 1.5, s * 0.7, a, 0, Math.PI * 2); g.fill(); }
    else { g.fillRect(px - s / 2, py - s * 1.5, s, s * 3); g.fillRect(px - s * 1.5, py - s / 2, s * 3, s); }
  }
  g.restore();
}

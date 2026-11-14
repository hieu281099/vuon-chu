/* ===================== EXTRA FASHION: hot items, new hairstyles, mythic rarity (merged into chibi.js before FASH is built) ===================== */
// rar 4 = Thần thoại (mythic). chest:true = only from the lucky chest. Huge-price mythics need a high level.
FASHION.push(
  // tops
  {id:'top_crop', slot:'top', en:'crop top', vi:'Áo croptop', price:140, rar:1, lvl:3, hot:1},
  {id:'top_tracksuit', slot:'top', en:'tracksuit jacket', vi:'Áo khoác thể thao', price:150, rar:1, lvl:3},
  {id:'top_puffer', slot:'top', en:'puffer jacket', vi:'Áo phao', price:180, rar:1, lvl:4},
  {id:'top_varsity', slot:'top', en:'varsity jacket', vi:'Áo bomber bóng chày', price:10, cur:'gem', rar:2, lvl:5, hot:1},
  {id:'top_suit', slot:'top', en:'suit', vi:'Bộ vest', price:260, rar:2, lvl:7},
  {id:'top_idol', slot:'top', en:'stage outfit', vi:'Đồ diễn idol', price:30, cur:'gem', rar:3, lvl:10, hot:1},
  {id:'top_gown', slot:'top', en:'ball gown', vi:'Váy dạ hội', price:35, cur:'gem', rar:3, lvl:12, hot:1},
  {id:'top_galaxy', slot:'top', en:'galaxy robe', vi:'Áo choàng ngân hà', price:0, rar:4, chest:1},
  // bottoms
  {id:'bot_jeans', slot:'bottom', en:'ripped jeans', vi:'Quần jean rách', price:120, rar:1, lvl:3, hot:1},
  {id:'bot_cargo', slot:'bottom', en:'cargo pants', vi:'Quần túi hộp', price:130, rar:1, lvl:4},
  {id:'bot_pleated', slot:'bottom', en:'pleated skirt', vi:'Chân váy xếp ly', price:110, rar:1, lvl:3, hot:1},
  {id:'bot_tutu', slot:'bottom', en:'tutu', vi:'Váy xòe ba lê', price:8, cur:'gem', rar:2, lvl:5},
  // hats
  {id:'hat_bucket', slot:'hat', en:'bucket hat', vi:'Mũ bucket', price:90, rar:0, col:'#F2D58A', hot:1},
  {id:'hat_beret', slot:'hat', en:'beret', vi:'Mũ nồi', price:110, rar:1, lvl:2, col:'#FF3552'},
  {id:'hat_bear', slot:'hat', en:'bear ears', vi:'Tai gấu', price:130, rar:1, lvl:3, col:'#8B5A3C'},
  {id:'hat_santa', slot:'hat', en:'Santa hat', vi:'Mũ Noel', price:150, rar:1, lvl:3, col:'#FF3552'},
  {id:'hat_halo', slot:'hat', en:'halo', vi:'Vòng hào quang', price:15, cur:'gem', rar:2, lvl:5, col:'#FFE48A', hot:1},
  {id:'hat_horns', slot:'hat', en:'devil horns', vi:'Sừng ác quỷ', price:15, cur:'gem', rar:2, lvl:5, col:'#FF3552'},
  {id:'hat_tiara', slot:'hat', en:'tiara', vi:'Vương miện công chúa', price:18, cur:'gem', rar:2, lvl:6, col:'#B9E6FF'},
  {id:'hat_dragon', slot:'hat', en:'dragon helmet', vi:'Mũ rồng', price:60, cur:'gem', rar:3, lvl:15, col:'#3DDC84'},
  {id:'hat_starcrown', slot:'hat', en:'star crown', vi:'Vương miện sao băng', price:0, rar:4, chest:1, col:'#FFC83D'},
  // face
  {id:'face_mask', slot:'face', en:'face mask', vi:'Khẩu trang', price:60, rar:0, col:'#FFFFFF'},
  {id:'face_star', slot:'face', en:'star glasses', vi:'Kính ngôi sao', price:120, rar:1, lvl:3, col:'#FFC83D', hot:1},
  {id:'face_aviator', slot:'face', en:'aviator sunglasses', vi:'Kính phi công', price:140, rar:1, lvl:4, col:'#1F1B24'},
  {id:'face_visor', slot:'face', en:'VR visor', vi:'Kính thực tế ảo', price:12, cur:'gem', rar:2, lvl:6, col:'#2DD4BF'},
  {id:'face_monocle', slot:'face', en:'monocle', vi:'Kính một mắt', price:10, cur:'gem', rar:2, lvl:6, col:'#FFC83D'},
  // back
  {id:'back_guitar', slot:'back', en:'guitar', vi:'Đàn guitar', price:180, rar:1, lvl:4, col:'#FF6B35', hot:1},
  {id:'back_jetpack', slot:'back', en:'jetpack', vi:'Ba lô phản lực', price:22, cur:'gem', rar:2, lvl:7, col:'#8E8AA8'},
  {id:'back_dragon', slot:'back', en:'dragon wings', vi:'Cánh rồng', price:80, cur:'gem', rar:3, lvl:15, col:'#3DDC84', hot:1},
  {id:'back_light', slot:'back', en:'wings of light', vi:'Cánh ánh sáng', price:300, cur:'gem', rar:4, lvl:25, col:'#FFFFFF'},
  {id:'back_phoenix', slot:'back', en:'phoenix wings', vi:'Cánh phượng hoàng', price:0, rar:4, chest:1, col:'#FF6B35'},
  // hand
  {id:'hand_boba', slot:'hand', en:'bubble tea', vi:'Trà sữa trân châu', price:70, rar:0, col:'#E8C39E', hot:1},
  {id:'hand_icecream', slot:'hand', en:'ice cream', vi:'Kem ốc quế', price:60, rar:0, col:'#FF8FC7'},
  {id:'hand_phone', slot:'hand', en:'smartphone', vi:'Điện thoại', price:80, rar:0, col:'#545AF2'},
  {id:'hand_fan', slot:'hand', en:'paper fan', vi:'Quạt giấy', price:100, rar:1, lvl:3, col:'#FF3552'},
  {id:'hand_saber', slot:'hand', en:'energy sword', vi:'Kiếm năng lượng', price:20, cur:'gem', rar:2, lvl:7, col:'#4D8BFF', hot:1},
  {id:'hand_scepter', slot:'hand', en:'royal scepter', vi:'Quyền trượng hoàng gia', price:0, rar:4, chest:1, col:'#FFC83D'},
  // aura
  {id:'aura_snow', slot:'aura', en:'snow aura', vi:'Hào quang tuyết', price:15, cur:'gem', rar:2, lvl:5, col:'#DDF1FF'},
  {id:'aura_stars', slot:'aura', en:'star aura', vi:'Hào quang sao', price:18, cur:'gem', rar:2, lvl:6, col:'#FFC83D'},
  {id:'aura_sakura', slot:'aura', en:'cherry blossom aura', vi:'Hào quang hoa anh đào', price:40, cur:'gem', rar:3, lvl:10, col:'#FF9EC8', hot:1},
  {id:'aura_galaxy', slot:'aura', en:'galaxy aura', vi:'Hào quang ngân hà', price:0, rar:4, chest:1, col:'#9B5CFF'},
  // pets
  {id:'pet_fox', slot:'pet', en:'fox cub', vi:'Cáo con', price:25, cur:'gem', rar:2, lvl:5, col:'#FF8A3D', hot:1},
  {id:'pet_panda', slot:'pet', en:'panda cub', vi:'Gấu trúc con', price:30, cur:'gem', rar:3, lvl:8, col:'#FFFFFF'},
  {id:'pet_unicorn', slot:'pet', en:'unicorn', vi:'Kỳ lân', price:250, cur:'gem', rar:4, lvl:20, col:'#FFFFFF'},
  {id:'pet_phoenix', slot:'pet', en:'baby phoenix', vi:'Phượng hoàng con', price:0, rar:4, chest:1, col:'#FF5A2E'}
);

// new hairstyles (front {C} templates sit on the head: x 25..120, y 34..76; back ones sit behind the head)
Object.assign(NEMO.hairF, {
  curtain: '<path d="M25 64C25 45 40 32 60 32H85C105 32 120 45 120 64V82C110 80 98 68 94 54C88 64 80 69 74 70L72.5 50L71 70C65 69 57 64 51 54C47 68 35 80 25 82Z" fill="{C}"/>',
  spiky: '<path d="M25 74L20 46L36 48L34 24L52 38L58 12L72 32L86 12L92 38L110 24L109 48L125 46L120 74C108 70 98 62 94 52C86 62 60 64 51 52C46 62 36 70 25 74Z" fill="{C}"/>',
  buns: '<circle cx="33" cy="36" r="16" fill="{C}"/><circle cx="112" cy="36" r="16" fill="{C}"/><path d="M25 62C25 45 40 34 58 34H87C105 34 120 45 120 62V74C110 74 104 64 102 58H43C41 64 35 74 25 74Z" fill="{C}"/>',
  quiff: '<path d="M25 72V62C25 44 40 30 60 28C80 16 114 22 120 44V72C116 70 112 62 110 54C96 58 70 56 56 46C46 56 36 66 25 72Z" fill="{C}"/>',
  mohawk: '<path d="M58 38Q72.5 -4 87 38Z" fill="{C}"/><path d="M25 62C25 46 38 36 56 36H89C107 36 120 46 120 62V66C100 56 45 56 25 66Z" fill="{C}"/>'
});
Object.assign(NEMO.hairB, {
  twin: '<path d="M19 70C19 50 36 33 56 33H89C109 33 126 50 126 70V112H19Z" fill="{C}"/><path d="M24 62C0 72 -6 124 12 152C16 130 24 112 32 98Z" fill="{C}"/><path d="M121 62C145 72 151 124 133 152C129 130 121 112 113 98Z" fill="{C}"/>',
  pony: '<path d="M19 70C19 50 36 33 56 33H89C109 33 126 50 126 70V112H19Z" fill="{C}"/><path d="M98 38C140 18 154 72 142 122C134 98 124 72 102 54Z" fill="{C}"/>',
  bob: '<path d="M17 70C17 48 35 30 58 30H87C110 30 128 48 128 70V112C128 118 122 120 116 116L100 108H45L29 116C23 120 17 118 17 112Z" fill="{C}"/>',
  wavy: '<path d="M19 70C19 50 36 33 56 33H89C109 33 126 50 126 70V110C134 118 128 128 136 136C126 146 112 140 104 146C96 140 84 146 72.5 142C61 146 49 140 41 146C33 140 19 146 9 136C17 128 11 118 19 110Z" fill="{C}"/>',
  wolf: '<path d="M17 70C17 48 35 30 58 30H87C110 30 128 48 128 70L132 100L122 96L126 120L112 110L108 128L98 112H47L37 128L33 110L19 120L23 96L13 100Z" fill="{C}"/>'
});
HAIR_F.splice(HAIR_F.indexOf('none'), 0, 'curtain', 'spiky', 'buns', 'quiff', 'mohawk');
Object.assign(HAIR_F_VI, {curtain: 'Mái bay Hàn Quốc', spiky: 'Tóc dựng anime', buns: 'Búi hai bên', quiff: 'Tóc vuốt ngược', mohawk: 'Tóc mohican'});
HAIR_B.push('twin', 'pony', 'bob', 'wavy', 'wolf');
Object.assign(HAIR_B_VI, {twin: 'Tóc hai bím', pony: 'Đuôi ngựa cao', bob: 'Tóc bob', wavy: 'Dài gợn sóng', wolf: 'Tóc wolf cut'});

const SKIRTS = ['bot_skirt', 'bot_pleated', 'bot_tutu'];
const DRESSES = ['top_dress', 'top_aodai', 'top_gown', 'top_galaxy'];
const LONG_SLEEVES = ['top_long', 'top_hoodie', 'top_jacket', 'top_aodai', 'top_sailor', 'top_tracksuit', 'top_puffer', 'top_varsity', 'top_suit', 'top_galaxy'];
const starDots = (pts, col) => pts.map(([x, y, r]) => `<path d="M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z" fill="${col}"/>`).join('');

function extraTop(s, c, b, d, tee, waist) {
  switch (s) {
    case 'top_crop': return `<rect x="55" y="113" width="35" height="11" rx="2" fill="${c}"/>${waist(b)}`;
    case 'top_tracksuit': return `<rect x="55" y="113" width="35" height="16" fill="${c}"/>${waist(b)}<path d="M57 113V129M88 113V129" stroke="#FFFFFF" stroke-width="2.5"/><path d="M72.5 113V129" stroke="${d}" stroke-width="1.5"/>`;
    case 'top_puffer': return `${waist(b)}<rect x="53" y="111" width="39" height="22" rx="7" fill="${c}"/><path d="M54 118H91M54 125H91" stroke="${d}" stroke-width="2"/><path d="M72.5 111V133" stroke="${shade(c, -0.35)}" stroke-width="1.5"/>`;
    case 'top_varsity': return `<rect x="55" y="113" width="35" height="16" fill="${c}"/>${waist(b)}<path d="M55 128H90" stroke="#FFFFFF" stroke-width="3"/><path d="M60 113L72.5 120L85 113" stroke="#FFFFFF" stroke-width="2.5" fill="none"/><path d="M72.5 120V129" stroke="${d}" stroke-width="1.5"/><text x="59" y="127" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="#FFFFFF">V</text>`;
    case 'top_suit': return `<rect x="55" y="113" width="35" height="14" fill="#FFFFFF"/>${waist(b)}<path d="M55 113H67L72.5 129L66 130H55Z" fill="${c}"/><path d="M90 113H78L72.5 129L79 130H90Z" fill="${c}"/><path d="M71 115H74L75.5 125L72.5 128L69.5 125Z" fill="#FF3552"/>`;
    case 'top_idol': return `<rect x="55" y="113" width="35" height="16" fill="${c}"/>${waist(b)}<path d="M55 113L90 129" stroke="#FFC83D" stroke-width="4"/>${starDots([[62, 124, 3], [82, 117, 3], [76, 125, 2]], '#FFFFFF')}`;
    case 'top_gown': return `<path d="M58 113H87L89 127Q104 148 108 160H37Q41 148 56 127Z" fill="${c}"/><rect x="56" y="125" width="33" height="4" rx="2" fill="${shade(c, 0.4)}"/><path d="M48 150Q72.5 140 97 150" stroke="${shade(c, 0.3)}" stroke-width="2" fill="none"/>${starDots([[60, 140, 2.5], [86, 145, 2.5], [72, 152, 2]], '#FFFFFF')}`;
    case 'top_galaxy': return `<path d="M57 113H88L92 132L98 160H47L53 132Z" fill="#1E1B4B"/><path d="M57 113H88L86 120H59Z" fill="url(#rb)"/><path d="M47 160L53 132M98 160L92 132" stroke="url(#rb)" stroke-width="3"/>${starDots([[64, 128, 3], [80, 140, 3.5], [68, 150, 2.5], [84, 124, 2]], '#FFFFFF')}`;
  }
  return extraTop2(s, c, b, d, tee, waist);
}
function extraHat(id, c, lv, t, d) {
  const g = lv ? t : null;
  switch (id) {
    case 'hat_bucket': return `<path d="M32 52Q34 18 72.5 16Q111 18 113 52Z" fill="${c}"/><path d="M14 56Q72.5 40 131 56Q126 66 72.5 62Q19 66 14 56Z" fill="${d}"/><path d="M32 46Q72.5 38 113 46" stroke="${g || shade(c, -0.15)}" stroke-width="4" fill="none"/>`;
    case 'hat_beret': return `<ellipse cx="62" cy="38" rx="50" ry="18" fill="${c}" transform="rotate(-10 62 38)"/><path d="M28 52Q72.5 44 116 52" stroke="${d}" stroke-width="5" fill="none"/><path d="M64 20L66 10" stroke="${g || d}" stroke-width="4" stroke-linecap="round"/>`;
    case 'hat_bear': return `<circle cx="34" cy="38" r="15" fill="${c}"/><circle cx="111" cy="38" r="15" fill="${c}"/><circle cx="34" cy="38" r="8" fill="${g || '#F2C9A8'}"/><circle cx="111" cy="38" r="8" fill="${g || '#F2C9A8'}"/>`;
    case 'hat_santa': return `<path d="M28 54Q34 14 76 12Q112 14 124 40Q118 30 108 30Q114 44 116 54Z" fill="${c}"/><circle cx="126" cy="44" r="9" fill="${g || '#FFFFFF'}"/><rect x="22" y="48" width="101" height="14" rx="7" fill="#FFFFFF"/>`;
    case 'hat_halo': return `<ellipse cx="72.5" cy="6" rx="34" ry="9" fill="none" stroke="${g || c}" stroke-width="6"/><ellipse cx="72.5" cy="6" rx="34" ry="9" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".7"/>`;
    case 'hat_horns': return `<path d="M36 46Q22 26 30 4Q36 22 52 36Z" fill="${g || c}"/><path d="M109 46Q123 26 115 4Q109 22 93 36Z" fill="${g || c}"/>`;
    case 'hat_tiara': return `<path d="M38 46L44 28L56 38L72.5 14L89 38L101 28L107 46Z" fill="${g || '#E6EEF8'}"/><path d="M38 46Q72.5 38 107 46" stroke="#C9D6E8" stroke-width="4" fill="none"/><circle cx="72.5" cy="28" r="6" fill="${c}"/><circle cx="50" cy="40" r="3" fill="${c}"/><circle cx="95" cy="40" r="3" fill="${c}"/>`;
    case 'hat_dragon': return `<path d="M24 60Q24 14 72.5 12Q121 14 121 60Q100 48 72.5 48Q45 48 24 60Z" fill="${c}"/><path d="M34 30Q10 10 18 -12Q30 10 48 20Z M111 30Q135 10 127 -12Q115 10 97 20Z" fill="${g || '#FFC83D'}"/><path d="M56 16L62 4L68 14L72.5 0L77 14L83 4L89 16" fill="${shade(c, -0.3)}"/><circle cx="72.5" cy="34" r="6" fill="#FF3552"/>`;
    case 'hat_starcrown': return `<path d="M30 48L26 12L50 30L72.5 -2L95 30L119 12L115 48Z" fill="url(#rb)"/><rect x="28" y="40" width="89" height="10" rx="5" fill="#FFC83D"/>${starDots([[72.5, -14, 9], [26, 2, 6], [119, 2, 6]], '#FFF3B0')}<circle cx="72.5" cy="30" r="7" fill="#FFFFFF"/>`;
  }
  return extraHat2(id, c, lv, t, d);
}
function extraFace(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'face_mask': return `<path d="M44 92Q72.5 84 101 92V104Q72.5 118 44 104Z" fill="${t}"/><path d="M50 98H95M52 104H93" stroke="#E2E6EF" stroke-width="1.5"/><path d="M44 94L30 88M101 94L115 88" stroke="#E2E6EF" stroke-width="2"/>`;
    case 'face_star': { const st = x => `<path transform="translate(${x} 82)" d="M0 -14L4 -4L15 -4L6 3L9 14L0 7L-9 14L-6 3L-15 -4L-4 -4Z" fill="${t}"/>`; return `${st(50)}${st(95)}<path d="M64 80H81" stroke="${shade(c, -0.3)}" stroke-width="3"/>`; }
    case 'face_aviator': return `<path d="M34 74H66Q66 94 52 94Q36 94 34 74Z" fill="${t}" opacity=".9"/><path d="M79 74H111Q109 94 93 94Q79 94 79 74Z" fill="${t}" opacity=".9"/><path d="M30 74H115" stroke="#C9A24A" stroke-width="3"/><path d="M40 80L50 78" stroke="#FFFFFF" stroke-width="2.5" opacity=".6"/>`;
    case 'face_visor': return `<rect x="28" y="70" width="89" height="24" rx="12" fill="${t}" opacity=".85"/><rect x="34" y="74" width="40" height="5" rx="2.5" fill="#FFFFFF" opacity=".5"/>`;
    case 'face_monocle': return `<circle cx="95" cy="82" r="13" fill="#FFFFFF" fill-opacity=".25" stroke="${t}" stroke-width="3.5"/><path d="M106 90Q114 110 104 124" stroke="${t}" stroke-width="1.5" fill="none"/>`;
  }
  return extraFace2(id, c, lv);
}
function extraBack(id, c, lv, front, pair) {
  const t = tierFill(lv, c), d = shade(c, -0.2);
  switch (id) {
    case 'back_guitar': return front ? `<path d="M40 150Q30 140 42 130Q38 118 52 118Q62 120 60 130Q70 140 58 150Q50 156 40 150Z" fill="${lv ? t : c}"/><circle cx="50" cy="138" r="4" fill="#1F1B24"/><path d="M54 128L96 96" stroke="#5B3423" stroke-width="5"/>` : `<path d="M96 160Q86 150 98 140Q94 128 108 128Q118 130 116 140Q126 150 114 160Z" fill="${lv ? t : c}"/><path d="M60 120L104 140" stroke="#5B3423" stroke-width="5"/>`;
    case 'back_jetpack': return `<rect x="38" y="108" width="22" height="40" rx="9" fill="${lv ? t : c}"/><rect x="85" y="108" width="22" height="40" rx="9" fill="${lv ? t : c}"/><path d="M42 150Q49 172 56 150Z M89 150Q96 172 103 150Z" fill="#FF6B35"/><path d="M45 150Q49 162 53 150Z M92 150Q96 162 100 150Z" fill="#FFE48A"/>`;
    case 'back_dragon': return pair(`<path d="M0 0L20 -50L34 -30L50 -58L58 -28L80 -40L72 -8L90 -4Q60 4 40 16Q20 6 0 0Z" fill="${lv ? t : c}"/><path d="M4 -2L20 -50M20 -50L40 14M50 -58L46 10M80 -40L56 8" stroke="${d}" stroke-width="2.5" fill="none"/>`, 80, 122);
    case 'back_light': return pair(`<path d="M0 0C10 -60 70 -80 96 -40C80 -36 76 -26 84 -18C66 -16 62 -4 70 4C54 6 48 16 52 24C30 20 10 12 0 0Z" fill="url(#rb)" opacity=".75"/><path d="M6 -4C20 -44 62 -60 82 -36" stroke="#FFFFFF" stroke-width="4" fill="none"/>`, 80, 122);
    case 'back_phoenix': return pair(`<path d="M0 0C14 -50 60 -70 92 -50C78 -44 80 -34 90 -28C72 -26 70 -14 80 -6C62 -4 58 8 64 16C44 16 28 22 22 30C14 18 6 10 0 0Z" fill="#FF5A2E"/><path d="M8 -4C22 -38 56 -52 78 -42C62 -34 60 -22 66 -14C50 -12 44 0 46 10C30 8 18 6 8 -4Z" fill="#FFC83D"/><path d="M16 -8C28 -28 46 -34 58 -30C48 -22 46 -12 48 -4C36 -4 26 -4 16 -8Z" fill="#FFF3B0"/>`, 80, 122);
  }
  return extraBack2(id, c, lv, front, pair);
}
function extraHand(id, c, lv) {
  const t = tierFill(lv, c);
  switch (id) {
    case 'hand_boba': return `<path d="M-4 6L22 6L18 36H0Z" fill="${lv ? t : c}" fill-opacity=".9"/><rect x="-6" y="2" width="30" height="6" rx="3" fill="#FFFFFF"/><path d="M12 2L18 -18" stroke="#FF6FB5" stroke-width="3.5" stroke-linecap="round"/><g fill="#3B2418"><circle cx="4" cy="31" r="2.6"/><circle cx="10" cy="32" r="2.6"/><circle cx="16" cy="31" r="2.6"/><circle cx="7" cy="26" r="2.6"/><circle cx="13" cy="26" r="2.6"/></g>`;
    case 'hand_icecream': return `<path d="M0 0L20 0L10 32Z" fill="#E3B37A"/><path d="M3 4L17 4M5 10L15 10" stroke="#C9925A" stroke-width="1.5"/><circle cx="10" cy="-6" r="10" fill="${lv ? t : c}"/><circle cx="10" cy="-18" r="7" fill="#FFF3DC"/><circle cx="10" cy="-27" r="3" fill="#FF3552"/>`;
    case 'hand_phone': return `<rect x="-2" y="2" width="18" height="30" rx="4" fill="#1F1B24"/><rect x="0" y="5" width="14" height="22" rx="2" fill="${lv ? t : c}"/><circle cx="7" cy="29.5" r="1.2" fill="#8E8AA8"/>`;
    case 'hand_fan': return `<path d="M6 28L-24 -14Q6 -34 36 -14Z" fill="${lv ? t : c}"/>${[-18, -8, 2, 12, 22, 30].map(x => `<path d="M6 28L${x} -18" stroke="${shade(c, -0.25)}" stroke-width="1.2"/>`).join('')}<circle cx="6" cy="28" r="3" fill="#5B3423"/>`;
    case 'hand_saber': return `<rect x="1" y="16" width="9" height="16" rx="3" fill="#8E8AA8"/><rect x="1" y="16" width="9" height="3" fill="#1F1B24"/><rect x="2.5" y="-64" width="6" height="82" rx="3" fill="${lv ? t : c}"/><rect x="4.2" y="-62" width="2.6" height="78" rx="1.3" fill="#FFFFFF" opacity=".85"/>`;
    case 'hand_scepter': return `<path d="M6 30L18 -40" stroke="#FFC83D" stroke-width="5" stroke-linecap="round"/><circle cx="19" cy="-48" r="11" fill="url(#rb)"/>${starDots([[19, -48, 6]], '#FFFFFF')}<path d="M8 -36Q19 -30 30 -36" stroke="#FFC83D" stroke-width="3" fill="none"/>`;
  }
  return extraHand2(id, c, lv);
}

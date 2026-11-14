/* ===================== FASHION BATCH 4: legendary and mythic pieces so every slot has the full rarity ladder ===================== */
FASHION.push(
  {id:'bot_starlight', slot:'bottom', en:'starlight skirt', vi:'Váy dạ quang sao', price:40, cur:'gem', rar:3, lvl:12, hot:1},
  {id:'bot_mermaid', slot:'bottom', en:'mermaid tail skirt', vi:'Váy đuôi tiên cá', price:200, cur:'gem', rar:4, lvl:20},
  {id:'bot_phoenix', slot:'bottom', en:'phoenix feather skirt', vi:'Váy lông vũ phượng hoàng', price:0, rar:4, chest:1},
  {id:'face_starshades', slot:'face', en:'shooting-star shades', vi:'Kính sao băng', price:35, cur:'gem', rar:3, lvl:11, col:'#FFC83D'},
  {id:'face_rainbowshades', slot:'face', en:'rainbow shades', vi:'Kính cầu vồng', price:180, cur:'gem', rar:4, lvl:20, col:'#FF6FB5'},
  {id:'face_dragoneye', slot:'face', en:'dragon eye monocle', vi:'Kính mắt rồng', price:0, rar:4, chest:1, col:'#3DDC84'},
  {id:'hand_magicbook', slot:'hand', en:'glowing spellbook', vi:'Sách phép phát sáng', price:45, cur:'gem', rar:3, lvl:12, col:'#9B5CFF', hot:1},
  {id:'hand_moonstaff', slot:'hand', en:'crescent moon staff', vi:'Trượng trăng khuyết', price:240, cur:'gem', rar:4, lvl:22, col:'#B9E6FF'},
  {id:'mouth_rainbowgum', slot:'mouth', en:'rainbow bubble gum', vi:'Kẹo cao su cầu vồng', price:30, cur:'gem', rar:3, lvl:10, col:'#FF6FB5', hot:1},
  {id:'mouth_starpop', slot:'mouth', en:'galaxy lollipop', vi:'Kẹo mút ngân hà', price:35, cur:'gem', rar:3, lvl:12, col:'#6D3FD8'},
  {id:'mouth_frost', slot:'mouth', en:'frost breath', vi:'Hơi thở băng giá', price:200, cur:'gem', rar:4, lvl:20, col:'#8EE7FF'},
  {id:'deco_heartglitter', slot:'deco', en:'heart glitter', vi:'Kim tuyến trái tim', price:30, cur:'gem', rar:3, lvl:10, col:'#FF6FB5'},
  {id:'deco_phoenix', slot:'deco', en:'phoenix mark', vi:'Ấn phượng hoàng', price:180, cur:'gem', rar:4, lvl:20, col:'#FF5A2E'},
  {id:'ear_butterfly', slot:'ear', en:'butterfly earrings', vi:'Hoa tai bướm', price:35, cur:'gem', rar:3, lvl:12, col:'#B05CFF', hot:1},
  {id:'ear_galaxy', slot:'ear', en:'galaxy earrings', vi:'Hoa tai ngân hà', price:200, cur:'gem', rar:4, lvl:20, col:'#6D3FD8'},
  {id:'neck_ruby', slot:'neck', en:'ruby heart necklace', vi:'Trái tim hồng ngọc', price:40, cur:'gem', rar:3, lvl:12, col:'#FF3552', hot:1},
  {id:'neck_galaxy', slot:'neck', en:'galaxy collar', vi:'Vòng cổ thiên hà', price:220, cur:'gem', rar:4, lvl:22, col:'#6D3FD8'},
  {id:'shoes_flame', slot:'shoes', en:'flame sneakers', vi:'Giày lửa', price:40, cur:'gem', rar:3, lvl:12, col:'#FF5A2E', hot:1},
  {id:'shoes_rainbow', slot:'shoes', en:'rainbow sky shoes', vi:'Giày cầu vồng bay', price:220, cur:'gem', rar:4, lvl:22, col:'#FFFFFF'},
  {id:'bag_crystal', slot:'bag', en:'crystal handbag', vi:'Túi xách pha lê', price:40, cur:'gem', rar:3, lvl:12, col:'#B9E6FF', hot:1}
);
SKIRTS.push('bot_starlight', 'bot_mermaid', 'bot_phoenix');
HANDBAGS.push('bag_crystal');

// skirts drawn by id (called from skirtSVG)
const BOTTOM_ART = {
  bot_starlight: L => `<path d="M55 126H90L97 145H48Z" fill="#1E1B4B"/><path d="M48 145H97" stroke="#FFC83D" stroke-width="2"/>${starDots([[58, 134, 2.4], [74, 138, 2.8], [88, 132, 2], [64, 142, 1.8], [84, 142, 2]], '#FFE48A')}`,
  bot_mermaid: L => `<path d="M56 126H89Q92 146 84 156Q96 160 102 166H43Q49 160 61 156Q53 146 56 126Z" fill="url(#hg_ocean)"/>${[[64, 134], [76, 136], [70, 144], [80, 146], [66, 152]].map(([x, y]) => `<path d="M${x - 3} ${y}Q${x} ${y + 3} ${x + 3} ${y}" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity=".7"/>`).join('')}`,
  bot_phoenix: L => `${[-2, -1, 0, 1, 2].map(i => `<path d="M${72.5 + i * 7} 128Q${72.5 + i * 12} 146 ${72.5 + i * 15} 160Q${72.5 + i * 10} 150 ${72.5 + i * 6} 128Z" fill="${['#FF3552', '#FF8A3D', '#FFC83D', '#FF8A3D', '#FF3552'][i + 2]}"/>`).join('')}<rect x="55" y="125" width="35" height="6" rx="3" fill="#FFC83D"/>`
};
function extraFace3(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'face_starshades': return `${starDots([[50, 82, 13], [95, 82, 13]], t)}<path d="M62 80H83" stroke="${shade(c, -0.3)}" stroke-width="3"/><circle cx="50" cy="82" r="4" fill="#1F1B24" opacity=".6"/><circle cx="95" cy="82" r="4" fill="#1F1B24" opacity=".6"/><path d="M108 70l12 -8M112 76l14 -4" stroke="#FFE48A" stroke-width="2" stroke-linecap="round"/>`;
    case 'face_rainbowshades': return `<rect x="34" y="72" width="32" height="20" rx="10" fill="url(#rb)" opacity=".9"/><rect x="79" y="72" width="32" height="20" rx="10" fill="url(#rb)" opacity=".9"/><path d="M66 80H79" stroke="#FFFFFF" stroke-width="3"/><path d="M40 78L50 75M85 78L95 75" stroke="#FFFFFF" stroke-width="2.5" opacity=".8"/>`;
    case 'face_dragoneye': return `<circle cx="87" cy="82" r="13" fill="#FFC83D" stroke="${t}" stroke-width="4"/><ellipse cx="87" cy="82" rx="2.4" ry="8" fill="#1F1B24"/><path d="M98 72Q110 60 120 66Q108 70 104 78Z" fill="${t}"/><path d="M98 94Q104 110 96 122" stroke="${t}" stroke-width="2" fill="none"/>`;
  }
  return '';
}
function extraHand3(id, c, lv) {
  const t = tierFill(lv, c);
  switch (id) {
    case 'hand_magicbook': return `<rect x="-8" y="6" width="30" height="24" rx="3" fill="${lv ? t : c}"/><rect x="-5" y="8" width="24" height="20" fill="#FFF3DC"/><path d="M7 8V28" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>${starDots([[7, -6, 7]], '#FFE48A')}<circle cx="7" cy="-6" r="10" fill="#FFE48A" opacity=".25"/><path d="M-2 14H4M10 14H16M-2 19H4M10 19H16" stroke="#C9B4F5" stroke-width="1.2"/>`;
    case 'hand_moonstaff': return `<path d="M6 32L18 -46" stroke="#E6EEF8" stroke-width="4" stroke-linecap="round"/><path d="M28 -70A16 16 0 1 0 28 -38A11 11 0 1 1 28 -70Z" fill="${lv ? t : 'url(#hg_silver)'}" stroke="#FFFFFF" stroke-width="1.2"/>${starDots([[30, -54, 5]], '#FFE48A')}<circle cx="20" cy="-54" r="20" fill="#B9E6FF" opacity=".2"/>`;
  }
  return '';
}
function mouth3(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'mouth_rainbowgum': return `<circle cx="72.5" cy="104" r="15" fill="url(#rb)" opacity=".92"/><ellipse cx="66" cy="98" rx="4.5" ry="3" fill="#FFFFFF" opacity=".7"/>`;
    case 'mouth_starpop': return `<path d="M76 94L96 106" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><circle cx="101" cy="110" r="10" fill="url(#hg_galaxy)"/>${starDots([[101, 110, 4]], '#FFE48A')}<circle cx="97" cy="106" r="1" fill="#FFFFFF"/>`;
    case 'mouth_frost': return `<path d="M78 94Q96 84 116 90Q128 82 138 92Q130 96 138 104Q122 100 116 106Q98 104 78 96Z" fill="${t}" opacity=".75"/>${[[104, 92], [122, 96], [114, 101]].map(([x, y]) => `<path d="M${x - 3} ${y}H${x + 3}M${x} ${y - 3}V${y + 3}M${x - 2} ${y - 2}L${x + 2} ${y + 2}M${x + 2} ${y - 2}L${x - 2} ${y + 2}" stroke="#FFFFFF" stroke-width="1"/>`).join('')}`;
  }
  return '';
}
function deco3(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'deco_heartglitter': return [[45, 97], [100, 97]].map(([x, y]) => `<path transform="translate(${x - 5} ${y - 4})" d="M5 9C2 7 0 5 0 3C0 1 2 0 5 2C8 0 10 1 10 3C10 5 8 7 5 9Z" fill="${t}"/><circle cx="${x + 6}" cy="${y - 4}" r="1" fill="#FFE48A"/><circle cx="${x - 6}" cy="${y + 4}" r="1" fill="#FFFFFF"/>`).join('');
    case 'deco_phoenix': return `<path d="M72.5 62Q66 70 72.5 78Q79 70 72.5 62Z" fill="url(#hg_fire)"/><path d="M64 70Q68 72 70 76M81 70Q77 72 75 76" stroke="#FF8A3D" stroke-width="1.5" fill="none"/>${[[45, 99], [100, 99]].map(([x, y]) => `<path d="M${x - 6} ${y + 2}Q${x} ${y - 6} ${x + 6} ${y + 2}" stroke="${t}" stroke-width="2" fill="none"/>`).join('')}`;
  }
  return '';
}
function ear3(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  const both = f => f(17) + f(128);
  switch (id) {
    case 'ear_butterfly': return both(x => `<path d="M${x} 102V106" stroke="#FFC83D" stroke-width="1.4"/><path d="M${x} 110L${x - 7} 104Q${x - 9} 112 ${x - 3} 114Z M${x} 110L${x + 7} 104Q${x + 9} 112 ${x + 3} 114Z" fill="${t}"/><path d="M${x} 108V118" stroke="#1F1B24" stroke-width="1.2"/>`);
    case 'ear_galaxy': return both(x => `<path d="M${x} 102V107" stroke="#E6EEF8" stroke-width="1.4"/><circle cx="${x}" cy="113" r="6" fill="url(#hg_galaxy)" stroke="#FFFFFF" stroke-width="1"/><circle cx="${x - 2}" cy="111" r="1" fill="#FFFFFF"/><path d="M${x} 119V124" stroke="#E6EEF8" stroke-width="1.2"/>${starDots([[x, 127, 3]], '#FFE48A')}`);
  }
  return '';
}
function neck3(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'neck_ruby': return `<path d="M58 113Q72.5 126 87 113" stroke="#FFC83D" stroke-width="1.6" fill="none"/><path transform="translate(65 119)" d="M7.5 12C3 8.6 0 6 0 3.3C0 .7 3.4 -.7 7.5 2.7C11.6 -.7 15 .7 15 3.3C15 6 12 8.6 7.5 12Z" fill="${t}" stroke="#FFC83D" stroke-width="1.2"/><circle cx="69" cy="122" r="1.4" fill="#FFFFFF" opacity=".8"/>`;
    case 'neck_galaxy': return `<path d="M56 114Q72.5 124 89 114V119Q72.5 129 56 119Z" fill="url(#hg_galaxy)"/>${starDots([[64, 119, 2], [72.5, 122, 3], [81, 119, 2]], '#FFE48A')}<path d="M72.5 124V128" stroke="#FFE48A" stroke-width="1.2"/>${starDots([[72.5, 131, 4]], '#FFFFFF')}`;
  }
  return '';
}
function shoe3(id, c, lv, x, y) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'shoes_flame': return `<path d="M${x - 1} ${y + 17}H${x + 14}V${y + 27}H${x - 1}Z" fill="#1F1B24"/><path d="M${x - 1} ${y + 27}Q${x + 2} ${y + 18} ${x + 5} ${y + 23}Q${x + 7} ${y + 16} ${x + 9} ${y + 23}Q${x + 12} ${y + 18} ${x + 14} ${y + 27}Z" fill="url(#hg_fire)"/><rect x="${x - 1}" y="${y + 27}" width="15" height="3" rx="1.5" fill="#FFFFFF"/>`;
    case 'shoes_rainbow': return `<path d="M${x - 1} ${y + 17}H${x + 14}V${y + 28}H${x - 1}Z" fill="url(#rb)"/><rect x="${x - 1}" y="${y + 27}" width="15" height="3" rx="1.5" fill="#FFFFFF"/>${[[x - 4, y + 32], [x + 6.5, y + 34], [x + 17, y + 32]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#FFFFFF" opacity=".9"/>`).join('')}`;
  }
  return '';
}
function bag3(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'bag_crystal': return `<path d="M44 138Q50 128 56 138" stroke="#E6EEF8" stroke-width="2" fill="none"/><path d="M40 140H60L56 158H44Z" fill="${t}" opacity=".85" stroke="#FFFFFF" stroke-width="1.2"/><path d="M40 140L50 150L60 140M44 158L50 150L56 158" stroke="#FFFFFF" stroke-width="1" opacity=".7" fill="none"/>`;
  }
  return '';
}

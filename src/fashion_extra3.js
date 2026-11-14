/* ===================== FASHION BATCH 3: six new slots (mouth, face stickers, earrings, necklaces, shoes, bags) ===================== */
FASHION.push(
  // mouth
  {id:'mouth_lollipop', slot:'mouth', en:'lollipop', vi:'Kẹo mút ngậm', price:50, rar:0, col:'#FF6FB5', hot:1},
  {id:'mouth_pocky', slot:'mouth', en:'chocolate stick', vi:'Bánh que sô-cô-la', price:60, rar:0, col:'#7A4A2A'},
  {id:'mouth_pacifier', slot:'mouth', en:'pacifier', vi:'Núm vú giả', price:80, rar:1, lvl:2, col:'#8EC9FF'},
  {id:'mouth_gum', slot:'mouth', en:'bubble gum', vi:'Kẹo cao su đang thổi', price:90, rar:1, lvl:3, col:'#FF8FC7', hot:1},
  {id:'mouth_toast', slot:'mouth', en:'slice of toast', vi:'Bánh mì ngậm vội', price:110, rar:1, lvl:4, col:'#F2C27A'},
  {id:'mouth_fangs', slot:'mouth', en:'vampire fangs', vi:'Răng nanh ma cà rồng', price:8, cur:'gem', rar:2, lvl:5, col:'#FFFFFF'},
  {id:'mouth_rose', slot:'mouth', en:'rose', vi:'Hoa hồng ngậm', price:12, cur:'gem', rar:2, lvl:6, col:'#FF3552', hot:1},
  {id:'mouth_fire', slot:'mouth', en:'dragon breath', vi:'Hơi thở rồng lửa', price:0, rar:4, chest:1, col:'#FF5A2E'},
  // face stickers
  {id:'deco_freckles', slot:'deco', en:'freckles', vi:'Tàn nhang', price:30, rar:0, col:'#C47D5C'},
  {id:'deco_blush', slot:'deco', en:'heart blush', vi:'Má hồng trái tim', price:40, rar:0, col:'#FF6F9A', hot:1},
  {id:'deco_bandage', slot:'deco', en:'plaster', vi:'Băng cá nhân', price:40, rar:0, col:'#F2C9A8'},
  {id:'deco_star', slot:'deco', en:'star stickers', vi:'Sao lấp lánh dưới mắt', price:80, rar:1, lvl:3, col:'#FFC83D'},
  {id:'deco_whiskers', slot:'deco', en:'cat whiskers', vi:'Râu mèo vẽ', price:90, rar:1, lvl:3, col:'#1F1B24'},
  {id:'deco_tear', slot:'deco', en:'crystal tear', vi:'Giọt lệ pha lê', price:10, cur:'gem', rar:2, lvl:5, col:'#8EE7FF'},
  {id:'deco_paint', slot:'deco', en:'face paint', vi:'Vẽ mặt cổ vũ', price:12, cur:'gem', rar:2, lvl:6, col:'#FF3552'},
  {id:'deco_rune', slot:'deco', en:'glowing marks', vi:'Ấn ký phát sáng', price:40, cur:'gem', rar:3, lvl:12, col:'#2DD4BF', hot:1},
  {id:'deco_galaxy', slot:'deco', en:'galaxy freckles', vi:'Tàn nhang ngân hà', price:0, rar:4, chest:1, col:'#B05CFF'},
  // earrings
  {id:'ear_stud', slot:'ear', en:'stud earrings', vi:'Khuyên tai tròn', price:40, rar:0, col:'#FFC83D'},
  {id:'ear_hoop', slot:'ear', en:'hoop earrings', vi:'Khuyên tai vòng', price:60, rar:0, col:'#FFC83D', hot:1},
  {id:'ear_pearl', slot:'ear', en:'pearl earrings', vi:'Hoa tai ngọc trai', price:100, rar:1, lvl:3, col:'#FFFFFF'},
  {id:'ear_cherry', slot:'ear', en:'cherry earrings', vi:'Hoa tai anh đào', price:110, rar:1, lvl:3, col:'#FF3552', hot:1},
  {id:'ear_star', slot:'ear', en:'star earrings', vi:'Hoa tai ngôi sao', price:120, rar:1, lvl:4, col:'#FFC83D'},
  {id:'ear_feather', slot:'ear', en:'feather earrings', vi:'Hoa tai lông vũ', price:8, cur:'gem', rar:2, lvl:5, col:'#2DD4BF'},
  {id:'ear_crystal', slot:'ear', en:'crystal drops', vi:'Hoa tai pha lê dài', price:12, cur:'gem', rar:2, lvl:6, col:'#B9E6FF'},
  {id:'ear_moon', slot:'ear', en:'moon and star earrings', vi:'Hoa tai trăng sao', price:30, cur:'gem', rar:3, lvl:10, col:'#FFE48A'},
  {id:'ear_dragon', slot:'ear', en:'dragon earrings', vi:'Hoa tai rồng', price:0, rar:4, chest:1, col:'#3DDC84'},
  // necklaces
  {id:'neck_bowtie', slot:'neck', en:'bow tie', vi:'Nơ cổ', price:50, rar:0, col:'#FF3552'},
  {id:'neck_choker', slot:'neck', en:'choker', vi:'Vòng cổ choker', price:60, rar:0, col:'#1F1B24'},
  {id:'neck_scarf', slot:'neck', en:'scarf', vi:'Khăn quàng cổ', price:80, rar:0, col:'#FF6B35', hot:1},
  {id:'neck_pearl', slot:'neck', en:'pearl necklace', vi:'Chuỗi ngọc trai', price:120, rar:1, lvl:3, col:'#FFFFFF'},
  {id:'neck_heart', slot:'neck', en:'heart pendant', vi:'Mặt dây trái tim', price:130, rar:1, lvl:3, col:'#FF6FB5', hot:1},
  {id:'neck_gold', slot:'neck', en:'gold chain', vi:'Dây chuyền vàng', price:150, rar:1, lvl:4, col:'#FFC83D'},
  {id:'neck_medal', slot:'neck', en:'gold medal', vi:'Huy chương vàng', price:10, cur:'gem', rar:2, lvl:5, col:'#FFC83D'},
  {id:'neck_lei', slot:'neck', en:'flower garland', vi:'Vòng hoa Hawaii', price:12, cur:'gem', rar:2, lvl:6, col:'#FF8FC7'},
  {id:'neck_diamond', slot:'neck', en:'blue diamond necklace', vi:'Dây chuyền kim cương xanh', price:45, cur:'gem', rar:3, lvl:12, col:'#4D8BFF', hot:1},
  {id:'neck_amulet', slot:'neck', en:'dragon amulet', vi:'Bùa hộ mệnh rồng', price:0, rar:4, chest:1, col:'#FF3552'},
  // shoes
  {id:'shoes_sandals', slot:'shoes', en:'sandals', vi:'Dép quai hậu', price:40, rar:0, col:'#8B5A3C'},
  {id:'shoes_sneaker', slot:'shoes', en:'trainers', vi:'Giày thể thao', price:60, rar:0, col:'#FF3552', hot:1},
  {id:'shoes_boots', slot:'shoes', en:'boots', vi:'Bốt cao cổ', price:90, rar:0, col:'#8B5A3C'},
  {id:'shoes_rain', slot:'shoes', en:'rain boots', vi:'Ủng đi mưa', price:100, rar:1, lvl:3, col:'#FFC83D'},
  {id:'shoes_bunny', slot:'shoes', en:'bunny slippers', vi:'Dép thỏ bông', price:130, rar:1, lvl:4, col:'#FFFFFF', hot:1},
  {id:'shoes_skates', slot:'shoes', en:'roller skates', vi:'Giày patin', price:10, cur:'gem', rar:2, lvl:5, col:'#2DD4BF'},
  {id:'shoes_glass', slot:'shoes', en:'glass slippers', vi:'Giày pha lê', price:14, cur:'gem', rar:2, lvl:7, col:'#B9E6FF'},
  {id:'shoes_winged', slot:'shoes', en:'winged shoes', vi:'Giày có cánh', price:40, cur:'gem', rar:3, lvl:12, col:'#FFFFFF', hot:1},
  {id:'shoes_cloud', slot:'shoes', en:'cloud shoes', vi:'Giày mây bay', price:0, rar:4, chest:1, col:'#FFFFFF'},
  // bags
  {id:'bag_cross', slot:'bag', en:'crossbody bag', vi:'Túi đeo chéo', price:70, rar:0, col:'#8B5A3C'},
  {id:'bag_belt', slot:'bag', en:'belt bag', vi:'Túi bao tử', price:70, rar:0, col:'#1F1B24'},
  {id:'bag_tote', slot:'bag', en:'tote bag', vi:'Túi tote', price:80, rar:0, col:'#F2D58A', hot:1},
  {id:'bag_heart', slot:'bag', en:'heart bag', vi:'Túi trái tim', price:120, rar:1, lvl:3, col:'#FF6FB5'},
  {id:'bag_strawberry', slot:'bag', en:'strawberry bag', vi:'Túi dâu tây', price:140, rar:1, lvl:4, col:'#FF3552', hot:1},
  {id:'bag_bear', slot:'bag', en:'teddy bag', vi:'Túi gấu bông', price:12, cur:'gem', rar:2, lvl:5, col:'#C98B5A'},
  {id:'bag_luxury', slot:'bag', en:'designer handbag', vi:'Túi xách hàng hiệu', price:15, cur:'gem', rar:2, lvl:7, col:'#1F1B24'},
  {id:'bag_star', slot:'bag', en:'sparkly star purse', vi:'Ví ngôi sao lấp lánh', price:35, cur:'gem', rar:3, lvl:10, col:'#B05CFF'},
  {id:'bag_galaxy', slot:'bag', en:'galaxy handbag', vi:'Túi xách ngân hà', price:220, cur:'gem', rar:4, lvl:22, col:'#6D3FD8'},
  {id:'bag_treasure', slot:'bag', en:'dragon treasure bag', vi:'Túi kho báu rồng', price:0, rar:4, chest:1, col:'#FFC83D'}
);
const STARP = (x, y, r, col) => starDots([[x, y, r]], col);

// mouth: drawn over the face (mouth centre about 72.5, 93)
function mouthSVG(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'mouth_lollipop': return `<path d="M76 94L96 106" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="109" r="9" fill="${t}"/><path d="M100 109m-5 0a5 5 0 1 1 5 5a3 3 0 1 1 -3 -3" stroke="#FFFFFF" stroke-width="2" fill="none"/>`;
    case 'mouth_pocky': return `<path d="M74 94L104 100" stroke="#F2D7A0" stroke-width="3.5" stroke-linecap="round"/><path d="M84 96L104 100" stroke="${t}" stroke-width="4.5" stroke-linecap="round"/>`;
    case 'mouth_pacifier': return `<ellipse cx="72.5" cy="96" rx="12" ry="7" fill="${t}"/><circle cx="72.5" cy="96" r="4" fill="#FFFFFF"/><circle cx="72.5" cy="106" r="6" fill="none" stroke="${t}" stroke-width="2.5"/>`;
    case 'mouth_gum': return `<circle cx="72.5" cy="104" r="14" fill="${t}" opacity=".95"/><ellipse cx="67" cy="99" rx="4" ry="3" fill="#FFFFFF" opacity=".7"/>`;
    case 'mouth_toast': return `<path d="M60 92H86V110Q73 114 60 110Z" fill="${t}"/><path d="M58 92Q58 84 66 86Q73 80 80 86Q88 84 88 92Z" fill="${t}"/><rect x="63" y="92" width="20" height="15" rx="3" fill="#FFF1D6"/><path d="M58 92H88" stroke="${shade(c, -0.3)}" stroke-width="2"/>`;
    case 'mouth_fangs': return `<path d="M66 93L68 99L70 93Z M75 93L77 99L79 93Z" fill="${t}" stroke="#E2E6EF" stroke-width=".8"/>`;
    case 'mouth_rose': return `<path d="M48 97H92" stroke="#3DBE6C" stroke-width="3" stroke-linecap="round"/><path d="M56 97q4 -6 8 0" fill="#3DBE6C"/><circle cx="96" cy="95" r="8" fill="${t}"/><path d="M96 95m-4 0a4 4 0 1 1 4 4" stroke="${shade(c, -0.3)}" stroke-width="1.6" fill="none"/>`;
    case 'mouth_fire': return `<path d="M78 94Q96 82 118 90Q132 80 140 92Q132 96 140 104Q124 100 118 106Q98 104 78 96Z" fill="url(#hg_fire)"/><path d="M84 95Q100 90 116 94Q104 98 84 96Z" fill="#FFF3B0"/>`;
  }
  return '';
}
// stickers on the cheeks (45,99) and (100,99) and under the eyes
function decoSVG(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  const both = f => f(45) + f(100);
  switch (id) {
    case 'deco_freckles': return both(x => [[-5, -2], [0, 2], [5, -1], [-2, 5]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${97 + dy}" r="1.3" fill="${t}"/>`).join(''));
    case 'deco_blush': return both(x => `<path transform="translate(${x - 6} 93)" d="M6 12C2 9 0 6 0 4C0 1 3 0 6 3C9 0 12 1 12 4C12 6 10 9 6 12Z" fill="${t}" opacity=".85"/>`);
    case 'deco_bandage': return `<g transform="rotate(-25 102 96)"><rect x="92" y="92" width="20" height="8" rx="4" fill="${t}"/><rect x="99" y="92" width="6" height="8" fill="${shade(c, -0.1)}"/><circle cx="101" cy="95" r=".8" fill="#B9774A"/><circle cx="103" cy="97" r=".8" fill="#B9774A"/></g>`;
    case 'deco_star': return STARP(50, 94, 4, t) + STARP(95, 94, 4, t);
    case 'deco_whiskers': return both(x => { const d = x < 72 ? -1 : 1; return `<path d="M${x - 6 * d} 94L${x + 10 * d} 92M${x - 6 * d} 98H${x + 11 * d}M${x - 6 * d} 102L${x + 10 * d} 104" stroke="${t}" stroke-width="1.6" stroke-linecap="round"/>`; });
    case 'deco_tear': return `<path d="M90 90Q93 96 90 100Q87 96 90 90Z" fill="${t}" stroke="#FFFFFF" stroke-width="1"/>`;
    case 'deco_paint': return both(x => `<rect x="${x - 7}" y="94" width="14" height="3" fill="${t}"/><rect x="${x - 7}" y="97" width="14" height="3" fill="#FFFFFF"/><rect x="${x - 7}" y="100" width="14" height="3" fill="#4D8BFF"/>`);
    case 'deco_rune': return `<g opacity=".9"><path d="M46 92L50 98L46 104M99 92L95 98L99 104" stroke="${t}" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="72.5" cy="70" r="3.5" fill="${t}"/></g>`;
    case 'deco_galaxy': return both(x => `<ellipse cx="${x}" cy="98" rx="9" ry="6" fill="url(#hg_galaxy)" opacity=".75"/>${STARP(x - 3, 97, 2.2, '#FFFFFF')}<circle cx="${x + 4}" cy="100" r="1" fill="#FFFFFF"/>`);
  }
  return '';
}
// earrings hang from the lobes at (17,101) and (128,101)
function earSVG(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  const both = f => f(17) + f(128);
  switch (id) {
    case 'ear_stud': return both(x => `<circle cx="${x}" cy="103" r="3.2" fill="${t}"/><circle cx="${x - 1}" cy="102" r="1" fill="#FFFFFF"/>`);
    case 'ear_hoop': return both(x => `<circle cx="${x}" cy="108" r="6" fill="none" stroke="${t}" stroke-width="2.4"/>`);
    case 'ear_pearl': return both(x => `<path d="M${x} 102V106" stroke="#FFC83D" stroke-width="1.4"/><circle cx="${x}" cy="109" r="4" fill="${t}" stroke="#E2E6EF" stroke-width="1"/><circle cx="${x - 1.4}" cy="107.6" r="1.2" fill="#FFFFFF"/>`);
    case 'ear_cherry': return both(x => `<path d="M${x} 102Q${x + 2} 106 ${x - 3} 112M${x} 102Q${x + 3} 107 ${x + 4} 112" stroke="#3DBE6C" stroke-width="1.4" fill="none"/><circle cx="${x - 3}" cy="114" r="3.4" fill="${t}"/><circle cx="${x + 4}" cy="114" r="3.4" fill="${t}"/>`);
    case 'ear_star': return both(x => `<path d="M${x} 102V106" stroke="${t}" stroke-width="1.4"/>${STARP(x, 111, 5, t)}`);
    case 'ear_feather': return both(x => `<path d="M${x} 102V106" stroke="#FFC83D" stroke-width="1.4"/><path d="M${x} 106Q${x + 6} 116 ${x} 126Q${x - 6} 116 ${x} 106Z" fill="${t}"/><path d="M${x} 108V124" stroke="${shade(c, -0.3)}" stroke-width="1"/>`);
    case 'ear_crystal': return both(x => `<path d="M${x} 102V107" stroke="#C9D3E6" stroke-width="1.4"/><path d="M${x} 107L${x + 4} 113L${x} 124L${x - 4} 113Z" fill="${t}" stroke="#FFFFFF" stroke-width=".8"/>`);
    case 'ear_moon': return `<path d="M17 102V106" stroke="${t}" stroke-width="1.4"/><path d="M21 108A7 7 0 1 1 21 120A5 5 0 1 0 21 108Z" fill="${t}"/><path d="M128 102V106" stroke="${t}" stroke-width="1.4"/>${STARP(128, 112, 6, t)}`;
    case 'ear_dragon': return both(x => `<path d="M${x} 102C${x + 8} 106 ${x - 8} 112 ${x} 116C${x + 8} 120 ${x - 6} 126 ${x} 128" stroke="${t}" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="102" r="2.4" fill="#FFC83D"/><circle cx="${x}" cy="129" r="2.4" fill="#FF3552"/>`);
  }
  return '';
}
// necklaces sit just under the head (y 115..128) on the chest (x 55..90)
function neckSVG(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c;
  switch (id) {
    case 'neck_bowtie': return `<path d="M72.5 117L62 112V123Z M72.5 117L83 112V123Z" fill="${t}"/><circle cx="72.5" cy="117" r="2.6" fill="${shade(c, -0.25)}"/>`;
    case 'neck_choker': return `<path d="M60 114Q72.5 119 85 114" stroke="${t}" stroke-width="3.5" fill="none"/><circle cx="72.5" cy="119" r="2.4" fill="#FFC83D"/>`;
    case 'neck_scarf': return `<path d="M56 112Q72.5 122 89 112V118Q72.5 128 56 118Z" fill="${t}"/><path d="M80 118L84 134L90 132L86 117Z" fill="${shade(c, -0.12)}"/><path d="M56 115H89" stroke="#FFFFFF" stroke-width="1.5" opacity=".6"/>`;
    case 'neck_pearl': return Array.from({length: 9}, (_, i) => { const a = Math.PI * (0.15 + i * 0.0875); return `<circle cx="${72.5 - Math.cos(a) * 14}" cy="${113 + Math.sin(a) * 10}" r="2.1" fill="${t}" stroke="#E2E6EF" stroke-width=".6"/>`; }).join('');
    case 'neck_heart': return `<path d="M60 114Q72.5 124 85 114" stroke="#C9D3E6" stroke-width="1.2" fill="none"/><path transform="translate(67 119)" d="M5.5 9C2 6.5 0 4.5 0 2.5C0 .5 2.5 -.5 5.5 2C8.5 -.5 11 .5 11 2.5C11 4.5 9 6.5 5.5 9Z" fill="${t}"/>`;
    case 'neck_gold': return `<path d="M58 113Q72.5 128 87 113" stroke="${t}" stroke-width="2" fill="none" stroke-dasharray="2.5 1.2"/><circle cx="72.5" cy="122" r="3.4" fill="${t}"/>`;
    case 'neck_medal': return `<path d="M64 112L70 124M81 112L75 124" stroke="#4D8BFF" stroke-width="4"/><circle cx="72.5" cy="128" r="6.5" fill="${t}" stroke="${shade(c, -0.25)}" stroke-width="1.5"/>${STARP(72.5, 128, 3.5, '#FFFFFF')}`;
    case 'neck_lei': return Array.from({length: 7}, (_, i) => { const a = Math.PI * (0.1 + i * 0.133); const x = 72.5 - Math.cos(a) * 16, y = 114 + Math.sin(a) * 9; return `<circle cx="${x}" cy="${y}" r="3.6" fill="${i % 2 ? '#FFC83D' : t}"/><circle cx="${x}" cy="${y}" r="1.2" fill="#FFFFFF"/>`; }).join('');
    case 'neck_diamond': return `<path d="M58 113Q72.5 126 87 113" stroke="#E6EEF8" stroke-width="1.6" fill="none"/><path d="M72.5 119L78 124L72.5 132L67 124Z" fill="${t}" stroke="#FFFFFF" stroke-width="1"/><path d="M67 124H78" stroke="#FFFFFF" stroke-width=".8" opacity=".7"/>`;
    case 'neck_amulet': return `<path d="M58 113Q72.5 126 87 113" stroke="#FFC83D" stroke-width="2" fill="none"/><circle cx="72.5" cy="126" r="7" fill="url(#hg_gold)"/><circle cx="72.5" cy="126" r="4" fill="${t}"/><path d="M68 126Q72.5 120 77 126Q72.5 132 68 126" stroke="#FFF3B0" stroke-width="1" fill="none"/>`;
  }
  return '';
}
// shoes replace the default shoe at the bottom of each leg (leg x .. x+13, foot y+18 .. y+28)
function shoeSVG(id, c, lv, x, y) {
  const t = lv ? tierFill(lv, c) : c, sole = `<path d="M${x - 1} ${y + 25}H${x + 14}V${y + 27}C${x + 14} ${y + 28.6} ${x + 12.6} ${y + 30} ${x + 11} ${y + 30}H${x + 2}C${x + 0.4} ${y + 30} ${x - 1} ${y + 28.6} ${x - 1} ${y + 27}Z" fill="#FFFFFF"/>`;
  const foot = (top = 18) => `<path d="M${x - 1} ${y + top}H${x + 14}V${y + 25}H${x - 1}Z" fill="${t}"/>`;
  switch (id) {
    case 'shoes_sandals': return `<path d="M${x} ${y + 21}H${x + 13}M${x} ${y + 25}H${x + 13}" stroke="${t}" stroke-width="2.4"/><rect x="${x - 1}" y="${y + 27}" width="15" height="3" rx="1.5" fill="${t}"/>`;
    case 'shoes_sneaker': return foot(17) + sole + `<path d="M${x + 3} ${y + 20}H${x + 10}M${x + 3} ${y + 22.5}H${x + 10}" stroke="#FFFFFF" stroke-width="1.2"/>`;
    case 'shoes_boots': return `<rect x="${x - 1}" y="${y + 8}" width="15" height="21" rx="4" fill="${t}"/><rect x="${x - 1}" y="${y + 8}" width="15" height="3" fill="${shade(c, -0.25)}"/><rect x="${x - 1}" y="${y + 27}" width="15" height="3" rx="1.5" fill="${shade(c, -0.35)}"/>`;
    case 'shoes_rain': return `<rect x="${x - 1}" y="${y + 10}" width="15" height="20" rx="5" fill="${t}"/><path d="M${x + 2} ${y + 13}V${y + 22}" stroke="#FFFFFF" stroke-width="2" opacity=".55"/>`;
    case 'shoes_bunny': return `<ellipse cx="${x + 6.5}" cy="${y + 25}" rx="9" ry="6" fill="${t}"/><ellipse cx="${x + 3}" cy="${y + 16}" rx="2.4" ry="6" fill="${t}"/><ellipse cx="${x + 10}" cy="${y + 16}" rx="2.4" ry="6" fill="${t}"/><ellipse cx="${x + 3}" cy="${y + 16}" rx="1.1" ry="4" fill="#FFB3D1"/><ellipse cx="${x + 10}" cy="${y + 16}" rx="1.1" ry="4" fill="#FFB3D1"/><circle cx="${x + 4.5}" cy="${y + 24}" r="1" fill="#1F1B24"/><circle cx="${x + 8.5}" cy="${y + 24}" r="1" fill="#1F1B24"/>`;
    case 'shoes_skates': return foot(14) + `<rect x="${x - 1}" y="${y + 25}" width="15" height="3" fill="#FFFFFF"/><circle cx="${x + 1.5}" cy="${y + 31}" r="2.6" fill="#FFC83D"/><circle cx="${x + 6.5}" cy="${y + 31}" r="2.6" fill="#FFC83D"/><circle cx="${x + 11.5}" cy="${y + 31}" r="2.6" fill="#FFC83D"/>`;
    case 'shoes_glass': return `<path d="M${x - 1} ${y + 20}Q${x + 6.5} ${y + 16} ${x + 14} ${y + 20}V${y + 27}Q${x + 6.5} ${y + 31} ${x - 1} ${y + 27}Z" fill="${t}" opacity=".8" stroke="#FFFFFF" stroke-width="1.2"/>${STARP(x + 9, y + 22, 2.4, '#FFFFFF')}`;
    case 'shoes_winged': return foot(17) + sole + `<path d="M${x + 13} ${y + 21}Q${x + 22} ${y + 12} ${x + 24} ${y + 20}Q${x + 20} ${y + 21} ${x + 22} ${y + 25}Q${x + 17} ${y + 23} ${x + 13} ${y + 25}Z" fill="#FFFFFF" stroke="#D9DDF0" stroke-width=".8"/>`;
    case 'shoes_cloud': return [[0, 26, 5], [6.5, 24, 6], [13, 26, 5], [3, 21, 4], [10, 21, 4]].map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="${t}" stroke="#E2E6EF" stroke-width=".8"/>`).join('') + STARP(x + 6.5, y + 31, 2.4, '#FFE48A');
  }
  return '';
}
// bags: across the body, at the waist, or hanging from the left hand (around 50, 141; it swings with that arm)
const HANDBAGS = ['bag_tote', 'bag_luxury', 'bag_galaxy', 'bag_strawberry'];
function bagSVG(id, c, lv) {
  const t = lv ? tierFill(lv, c) : c, d = shade(c, -0.25);
  const strap = `<path d="M60 112L88 130" stroke="${d}" stroke-width="2.6"/>`;
  switch (id) {
    case 'bag_cross': return strap + `<rect x="80" y="126" width="18" height="14" rx="3" fill="${t}"/><path d="M80 130H98" stroke="${d}" stroke-width="2"/><circle cx="89" cy="133" r="1.6" fill="#FFC83D"/>`;
    case 'bag_belt': return `<rect x="58" y="126" width="29" height="10" rx="5" fill="${t}"/><path d="M62 129H83" stroke="#FFC83D" stroke-width="1.2"/><rect x="69" y="126" width="7" height="3" rx="1" fill="${d}"/>`;
    case 'bag_heart': return strap + `<path transform="translate(80 124)" d="M10 18C3 13 0 9 0 5C0 1 5 -1 10 4C15 -1 20 1 20 5C20 9 17 13 10 18Z" fill="${t}"/><circle cx="90" cy="129" r="1.6" fill="#FFFFFF"/>`;
    case 'bag_bear': return strap + `<circle cx="90" cy="133" r="9" fill="${t}"/><circle cx="83" cy="125" r="3.4" fill="${t}"/><circle cx="97" cy="125" r="3.4" fill="${t}"/><circle cx="87" cy="131" r="1.2" fill="#1F1B24"/><circle cx="93" cy="131" r="1.2" fill="#1F1B24"/><ellipse cx="90" cy="135" rx="3" ry="2" fill="#F2D7B6"/>`;
    case 'bag_star': return strap + STARP(90, 133, 10, t) + STARP(90, 133, 4, '#FFFFFF');
    case 'bag_treasure': return strap + `<path d="M80 128H100L98 142H82Z" fill="url(#hg_gold)"/><path d="M80 128Q90 120 100 128" fill="${shade('#FFC83D', -0.2)}"/><circle cx="85" cy="135" r="2" fill="#FF3552"/><circle cx="90" cy="137" r="2" fill="#3DDC84"/><circle cx="95" cy="135" r="2" fill="#4D8BFF"/>`;
    // handbags (drawn in the left-arm group, coordinates around the hand at 50,141)
    case 'bag_tote': return `<path d="M43 138Q50 128 57 138" stroke="${d}" stroke-width="2" fill="none"/><path d="M40 138H60L58 158H42Z" fill="${t}"/><path d="M44 146H56" stroke="#FFFFFF" stroke-width="1.6" opacity=".7"/>`;
    case 'bag_strawberry': return `<path d="M44 138Q50 130 56 138" stroke="#3DBE6C" stroke-width="2" fill="none"/><path d="M40 140Q50 136 60 140Q60 152 50 158Q40 152 40 140Z" fill="${t}"/><path d="M42 140L46 136L50 140L54 136L58 140Z" fill="#3DBE6C"/>${[[46, 146], [54, 146], [50, 151]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="1" fill="#FFE48A"/>`).join('')}`;
    case 'bag_luxury': return `<path d="M44 138Q50 128 56 138" stroke="#FFC83D" stroke-width="2" fill="none"/><rect x="39" y="138" width="22" height="17" rx="4" fill="${t}"/><path d="M39 144H61M39 149H61M45 138V155M51 138V155M57 138V155" stroke="${shade(c, 0.15)}" stroke-width=".8" opacity=".6"/><rect x="47" y="141" width="6" height="4" rx="1" fill="#FFC83D"/>`;
    case 'bag_galaxy': return `<path d="M44 138Q50 126 56 138" stroke="#FFE48A" stroke-width="2" fill="none"/><rect x="38" y="138" width="24" height="18" rx="5" fill="url(#hg_galaxy)"/>${STARP(45, 145, 2.2, '#FFFFFF')}${STARP(56, 150, 1.8, '#FFFFFF')}<rect x="47" y="139" width="6" height="4" rx="1" fill="#FFE48A"/>`;
  }
  return '';
}

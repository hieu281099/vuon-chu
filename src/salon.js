/* ===================== HAIR SALON: hairstyles and dyes are bought here, not at the clothes shop ===================== */
// Shapes use the nemo head space (head x 25..120, y 34..117). {C} is the hair colour.
const CAP = 'M25 66C25 46 40 34 58 34H87C105 34 120 46 120 66V74C110 72 100 64 96 54C88 62 62 64 52 54C46 64 36 72 25 74Z';
const BASE_B = 'M19 70C19 50 36 33 56 33H89C109 33 126 50 126 70V112H19Z';
const HP = d => `<path d="${d}" fill="{C}"/>`;
Object.assign(NEMO.hairF, {
  hime: HP('M25 66C25 46 40 32 60 32H85C105 32 120 46 120 66V104H110V70H35V104H25Z'),
  sidesweep: HP('M25 70C25 46 40 32 60 32H85C105 32 120 46 120 62V70C104 66 90 56 84 44C74 60 46 72 25 78Z'),
  messy: HP('M23 72L28 50L22 44L36 40L34 30L48 34L54 24L64 32L74 22L82 32L94 24L98 36L112 32L110 44L124 46L118 56L122 72C110 66 100 60 96 52C88 62 66 66 52 56C44 66 34 70 23 72Z'),
  pompadour: HP('M25 70V58C25 40 36 22 58 16C84 8 116 18 120 46V70C116 64 112 56 108 50C92 52 66 50 50 42C40 52 32 62 25 70Z'),
  centerpart: HP('M25 76V62C25 44 40 32 58 32H87C105 32 120 44 120 62V76C108 74 96 64 90 50L72.5 34L55 50C49 64 37 74 25 76Z'),
  bowl: HP('M23 72C23 44 40 30 72.5 30C105 30 122 44 122 72Z'),
  wolff: HP('M25 76L30 66L25 60C25 44 40 32 58 32H87C105 32 120 44 120 60L115 66L120 76L106 68L100 76L94 60C84 66 62 66 51 60L45 76L39 68Z'),
  ahoge: HP(CAP) + HP('M70 36C64 18 74 4 88 8C78 12 76 22 80 36Z'),
  halfup: '<circle cx="72.5" cy="22" r="13" fill="{C}"/>' + HP(CAP),
  starclip: HP(CAP) + '<path d="M38 52l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFC83D"/><path d="M104 52l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFC83D"/>',
  cathair: HP('M25 66C25 46 34 36 44 33L38 8L62 30H83L107 8L101 33C111 36 120 46 120 66V76C108 72 98 64 94 54C86 62 60 64 51 54C47 64 37 72 25 76Z'),
  afro: HP('M14 70C8 50 14 26 34 16C50 4 96 4 112 16C132 26 138 50 132 70C120 64 110 58 104 50C90 58 56 58 42 50C34 58 24 64 14 70Z'),
  flame: HP('M25 74C20 56 18 40 30 30C30 40 36 42 40 36C38 22 46 10 58 4C54 18 60 24 66 20C68 10 76 2 88 0C82 12 86 20 94 22C98 14 106 12 114 14C108 22 110 30 118 36C124 46 124 60 120 74C108 70 98 62 94 52C86 62 60 64 51 52C46 62 36 70 25 74Z'),
  crystal: HP('M24 74L18 50L30 44L26 24L44 32L48 10L62 26L72.5 2L83 26L97 10L101 32L119 24L115 44L127 50L121 74L104 60L94 70L84 54L72.5 66L61 54L51 70L41 60Z') + '<path d="M72.5 2L83 26L72.5 30L62 26Z M48 10L62 26L52 30Z M97 10L83 26L93 30Z" fill="#FFFFFF" opacity=".45"/>'
});
Object.assign(NEMO.hairB, {
  himeb: HP('M19 70C19 50 36 33 56 33H89C109 33 126 50 126 70V150H19Z'),
  drill: HP(BASE_B) + [[14, 82, 12], [12, 102, 11], [14, 120, 10], [18, 136, 8], [131, 82, 12], [133, 102, 11], [131, 120, 10], [127, 136, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="{C}"/>`).join(''),
  braid: HP(BASE_B) + [[118, 96], [121, 110], [123, 124], [124, 138]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="8" fill="{C}"/>`).join('') + '<rect x="117" y="145" width="14" height="5" rx="2" fill="#FF6FB5"/><path d="M118 150Q124 166 130 150Z" fill="{C}"/>',
  mermaid: HP('M19 70C19 50 36 33 56 33H89C109 33 126 50 126 70V120C138 134 126 146 136 166H9C19 146 7 134 19 120Z'),
  fluffy: HP(BASE_B) + [[14, 70, 16], [10, 96, 16], [18, 118, 14], [131, 70, 16], [135, 96, 16], [127, 118, 14], [40, 120, 14], [105, 120, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="{C}"/>`).join(''),
  afrob: '<circle cx="72.5" cy="68" r="64" fill="{C}"/>',
  topbun: '<circle cx="72.5" cy="16" r="20" fill="{C}"/>' + HP(BASE_B),
  longtwin: HP(BASE_B) + HP('M24 62C-2 74 -8 136 8 172C14 140 24 116 32 100Z') + HP('M121 62C147 74 153 136 137 172C131 140 121 116 113 100Z'),
  lowpony: HP(BASE_B) + HP('M108 96C136 104 142 136 128 162C122 140 114 122 100 110Z'),
  shag: HP('M17 70C17 48 35 30 58 30H87C110 30 128 48 128 70L130 96L120 92L122 116L110 106L104 120L96 108H49L41 120L35 106L23 116L25 92L15 96Z'),
  galaxyflow: HP('M19 70C19 50 36 33 56 33H89C109 33 126 50 126 70C140 96 160 120 150 162C136 140 120 132 110 124H40C28 132 14 146 6 162C-2 128 10 96 19 70Z') + '<circle cx="30" cy="140" r="2.5" fill="#FFFFFF"/><circle cx="140" cy="146" r="2" fill="#FFFFFF"/><circle cx="20" cy="110" r="1.6" fill="#FFFFFF"/>'
});
// hair dye gradients (hg_*) are defined in RB_DEF in chibi.js

// salon catalogue. f / b: front / back style it sets; c: dye colour. rar 0..4, cur 'gem' = diamonds, chest = only from the lucky chest.
const HAIR_ITEMS = [
  {id:'h_curtain', f:'curtain', en:'curtain bangs', vi:'Mái bay Hàn Quốc', price:120, rar:0, hot:1},
  {id:'h_bowl', f:'bowl', en:'bowl cut', vi:'Tóc nấm', price:90, rar:0},
  {id:'h_sidesweep', f:'sidesweep', en:'side-swept bangs', vi:'Mái lệch', price:110, rar:0},
  {id:'h_centerpart', f:'centerpart', en:'middle part', vi:'Rẽ ngôi giữa idol', price:140, rar:0, hot:1},
  {id:'h_bob', b:'bob', en:'bob', vi:'Tóc bob', price:120, rar:0},
  {id:'h_pony', b:'pony', en:'high ponytail', vi:'Đuôi ngựa cao', price:130, rar:0},
  {id:'h_lowpony', b:'lowpony', en:'low ponytail', vi:'Đuôi ngựa thấp', price:120, rar:0},
  {id:'h_spiky', f:'spiky', en:'spiky hair', vi:'Tóc dựng anime', price:220, rar:1, lvl:3, hot:1},
  {id:'h_quiff', f:'quiff', en:'quiff', vi:'Tóc vuốt ngược', price:200, rar:1, lvl:3},
  {id:'h_messy', f:'messy', en:'messy hair', vi:'Tóc rối nghệ sĩ', price:240, rar:1, lvl:4},
  {id:'h_buns', f:'buns', en:'space buns', vi:'Búi hai bên', price:260, rar:1, lvl:4, hot:1},
  {id:'h_ahoge', f:'ahoge', en:'cowlick', vi:'Tóc ăng-ten', price:180, rar:1, lvl:3},
  {id:'h_halfup', f:'halfup', en:'half-up bun', vi:'Búi nửa đầu', price:230, rar:1, lvl:4},
  {id:'h_wavy', b:'wavy', en:'long wavy hair', vi:'Dài gợn sóng', price:250, rar:1, lvl:4},
  {id:'h_twin', b:'twin', en:'twin tails', vi:'Tóc hai bím', price:260, rar:1, lvl:4, hot:1},
  {id:'h_wolf', b:'wolf', en:'wolf cut', vi:'Tóc wolf cut', price:280, rar:1, lvl:5},
  {id:'h_shag', b:'shag', en:'shag cut', vi:'Tóc shag tỉa tầng', price:280, rar:1, lvl:5},
  {id:'h_topbun', b:'topbun', en:'top bun', vi:'Búi củ tỏi', price:240, rar:1, lvl:4},
  {id:'h_mohawk', f:'mohawk', en:'mohawk', vi:'Tóc mohican', price:12, cur:'gem', rar:2, lvl:6},
  {id:'h_pompadour', f:'pompadour', en:'pompadour', vi:'Tóc pompadour', price:12, cur:'gem', rar:2, lvl:6},
  {id:'h_wolff', f:'wolff', en:'layered fringe', vi:'Mái wolf tỉa tầng', price:10, cur:'gem', rar:2, lvl:6, hot:1},
  {id:'h_hime', f:'hime', b:'himeb', en:'hime cut', vi:'Tóc công chúa Nhật', price:18, cur:'gem', rar:2, lvl:8, hot:1},
  {id:'h_braid', b:'braid', en:'side braid', vi:'Bím lệch một bên', price:14, cur:'gem', rar:2, lvl:7},
  {id:'h_longtwin', b:'longtwin', en:'long twin tails', vi:'Hai bím dài ngang lưng', price:16, cur:'gem', rar:2, lvl:8},
  {id:'h_starclip', f:'starclip', en:'star hair clips', vi:'Mái kẹp sao', price:15, cur:'gem', rar:2, lvl:7},
  {id:'h_drill', b:'drill', en:'ringlet curls', vi:'Tóc xoắn tiểu thư', price:30, cur:'gem', rar:3, lvl:12, hot:1},
  {id:'h_fluffy', b:'fluffy', en:'fluffy curls', vi:'Tóc mây bồng bềnh', price:28, cur:'gem', rar:3, lvl:10},
  {id:'h_afro', f:'afro', b:'afrob', en:'afro', vi:'Tóc xù afro', price:32, cur:'gem', rar:3, lvl:12},
  {id:'h_cathair', f:'cathair', en:'cat-ear hair', vi:'Tóc tai mèo', price:35, cur:'gem', rar:3, lvl:12, hot:1},
  {id:'h_mermaid', b:'mermaid', en:'mermaid hair', vi:'Tóc tiên cá chấm đất', price:45, cur:'gem', rar:3, lvl:14},
  {id:'h_flame', f:'flame', en:'flame hair', vi:'Tóc lửa', price:90, cur:'gem', rar:4, lvl:18, hot:1},
  {id:'h_crystal', f:'crystal', en:'crystal hair', vi:'Tóc pha lê', price:0, rar:4, chest:1},
  {id:'h_galaxyflow', b:'galaxyflow', en:'flowing galaxy hair', vi:'Tóc ngân hà bay', price:0, rar:4, chest:1},
  // dyes
  {id:'hc_lilac', c:'#C8A2FF', en:'lilac dye', vi:'Nhuộm tím oải hương', price:80, rar:0},
  {id:'hc_mint', c:'#7EF0C4', en:'mint dye', vi:'Nhuộm xanh bạc hà', price:80, rar:0},
  {id:'hc_peach', c:'#FFB38A', en:'peach dye', vi:'Nhuộm cam đào', price:80, rar:0},
  {id:'hc_sky', c:'#8EC9FF', en:'sky blue dye', vi:'Nhuộm xanh da trời', price:80, rar:0},
  {id:'hc_ash', c:'#9AA0B5', en:'ash grey dye', vi:'Nhuộm xám khói', price:120, rar:1, lvl:3, hot:1},
  {id:'hc_pink', c:'url(#hg_pink)', en:'pink ombre', vi:'Ombre hồng tím', price:260, rar:1, lvl:4, hot:1},
  {id:'hc_ocean', c:'url(#hg_ocean)', en:'ocean ombre', vi:'Ombre đại dương', price:260, rar:1, lvl:4},
  {id:'hc_silver', c:'url(#hg_silver)', en:'silver frost', vi:'Bạc sương', price:10, cur:'gem', rar:2, lvl:7},
  {id:'hc_fire', c:'url(#hg_fire)', en:'fire ombre', vi:'Ombre lửa', price:12, cur:'gem', rar:2, lvl:8},
  {id:'hc_gold', c:'url(#hg_gold)', en:'liquid gold', vi:'Vàng ánh kim', price:30, cur:'gem', rar:3, lvl:12},
  {id:'hc_galaxy', c:'url(#hg_galaxy)', en:'galaxy dye', vi:'Ngân hà', price:40, cur:'gem', rar:3, lvl:14, hot:1},
  {id:'hc_rainbow', c:'url(#rb)', en:'rainbow dye', vi:'Cầu vồng', price:150, cur:'gem', rar:4, lvl:20},
  {id:'hc_aurora', c:'url(#hg_aurora)', en:'aurora dye', vi:'Cực quang', price:0, rar:4, chest:1}
];
const HAIR = Object.fromEntries(HAIR_ITEMS.map(h => [h.id, h]));
const FREE_HF = ['regular', 'straight', 'chupchik', 'elegant', 'curly', 'none'], FREE_HB = [null, 'short', 'long', 'curly'];
const hairKind = h => h.c ? 'dye' : 'style';
const ownsHairF = v => FREE_HF.includes(v) || HAIR_ITEMS.some(h => h.f === v && (S.hair || []).includes(h.id));
const ownsHairB = v => FREE_HB.includes(v) || HAIR_ITEMS.some(h => h.b === v && (S.hair || []).includes(h.id));
const ownedDyes = () => HAIR_ITEMS.filter(h => h.c && (S.hair || []).includes(h.id)).map(h => h.c);
function hairPatch(h) { const p = {}; if (h.f) p.hairF = h.f; if (h.b !== undefined) p.hairB = h.b; if (h.c) p.hairC = h.c; return p; }
function hairPreview(h, L) { return portraitSVG(Object.assign({}, L || fullLook(S.look), hairPatch(h), {hat: null})); }

let SAL = {tab: 'style', buy: null};
const salPrice = h => h.chest ? 'Chỉ có trong rương' : (h.cur === 'gem' ? gemIcon('di') : coinIcon) + h.price;
const salAfford = h => !h.chest && (h.cur === 'gem' ? S.di >= h.price : S.coins >= h.price);
function salonHTML() {
  if (SAL.buy) return salonBuyHTML();
  const L = fullLook(S.look), list = HAIR_ITEMS.filter(h => hairKind(h) === SAL.tab), own = S.hair || [];
  const card = h => { const has = own.includes(h.id), lock = (h.lvl || 1) > S.lvl, worn = (h.f && L.hairF === h.f) || (h.b && L.hairB === h.b && !h.f) || (h.c && L.hairC === h.c);
    return `<button class="card r${h.rar}" data-act="${has ? 'hair-wear' : 'hair-pick'}" data-id="${h.id}" ${!has && (lock || !salAfford(h)) ? 'disabled' : ''}><span class="rar">${RARITY[h.rar].vi}</span>${h.hot ? '<span class="hot">HOT</span>' : ''}<img class="pv" src="${hairPreview(h, L)}" alt=""><b>${has ? esc(h.en) : '???'}</b><small>${esc(h.vi)}</small><span class="price">${has ? (worn ? 'Đang dùng' : 'Đã có · bấm để dùng') : lock ? needTag(h.lvl) : salPrice(h)}</span></button>`; };
  return `<p class="note">Kiểu tóc và màu nhuộm đẹp chỉ có ở tiệm tóc. Chị Ngân sẽ hỏi tên kiểu tóc bằng tiếng Anh, trả lời đúng mới làm được. Tóc <b>Thần thoại</b> có món giá hàng trăm kim cương, có món chỉ rơi ra từ Rương may mắn.</p>
    <div class="seg"><button class="segb" data-act="sal-tab" data-t="style" aria-pressed="${SAL.tab === 'style'}">Kiểu tóc</button><button class="segb" data-act="sal-tab" data-t="dye" aria-pressed="${SAL.tab === 'dye'}">Nhuộm màu</button></div>
    <div class="cards">${list.map(card).join('')}</div>`;
}
function salonBuyHTML() {
  const h = HAIR[SAL.buy.id], B = SAL.buy;
  return `<div class="buyq"><img class="pv big" src="${hairPreview(h)}" alt=""><div><p class="q-ask">Chị Ngân hỏi: “What is this called in English?” ${sayBtn('What is this called in English?')}</p><div class="q-word vi">${esc(h.vi)}</div><span class="price">${salPrice(h)}</span></div></div>
    <div class="opts">${B.opts.map((o, i) => `<button class="opt ${B.done ? (o === h.en ? 'right' : i === B.pick ? 'wrong' : '') : ''}" data-act="hair-ans" data-i="${i}" ${B.done ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div>
    ${B.done ? `<div class="fb ${B.ok ? 'good' : 'miss'}"><strong>${B.ok ? 'Đúng rồi!' : 'Chưa đúng'}</strong> ${B.ok ? `Tóc đã làm xong: <b>${esc(h.en)}</b>.` : `Đây là “${esc(h.en)}”. Thử lại sau nhé.`}</div><div class="row-btns"><button class="btn ghost sm" data-act="sal-back">Xem kiểu khác</button>${sayBtn(h.en)}</div>` : ''}`;
}
function salonRefresh() { if (CURNPC && CURNPC.def.role === 'salon' && $('#npc-body')) refreshNpc(); else openSalon(); }
function openSalon() {
  const n = NPCS.find(q => q.def.role === 'salon');
  if (n && S.map === 'village') return talk(n);
  openModal(`<h2 class="ptitle">Tiệm tóc Ngân</h2><div id="npc-body">${salonHTML()}</div>`, {label: 'Tiệm tóc', wide: true});
}
function hairPick(id) {
  const h = HAIR[id]; if (!h || (S.hair || []).includes(id) || (h.lvl || 1) > S.lvl || !salAfford(h)) return;
  const same = HAIR_ITEMS.filter(x => x.id !== id && hairKind(x) === hairKind(h) && x.en !== h.en);
  SAL.buy = {id, opts: shuffle([h.en, ...shuffle(same).slice(0, 3).map(x => x.en)]), done: false}; salonRefresh(); speak('What is this called in English?', true);
}
function hairAnswer(i) {
  const B = SAL.buy; if (!B || B.done) return; const h = HAIR[B.id];
  B.done = true; B.pick = i; B.ok = B.opts[i] === h.en; S.stats.all++; lvNoteAnswer();
  if (B.ok) { S.stats.ok++; if (h.cur === 'gem') S.di -= h.price; else S.coins -= h.price; S.hair = S.hair || []; S.hair.push(h.id); Object.assign(S.look, hairPatch(h)); sfx('coin'); speak(h.en, true); queueFx({kind: 'spark', who: 'player'}); }
  else sfx('bad');
  salonRefresh(); renderHUD(); markDirty();
}
function hairWear(id) { const h = HAIR[id]; if (!h || !(S.hair || []).includes(id)) return; Object.assign(S.look, hairPatch(h)); markDirty(); renderHUD(); salonRefresh(); toast(`Đã đổi sang <b>${esc(h.vi)}</b>.`); }

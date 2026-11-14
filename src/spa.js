/* ===================== BEAUTY SPA: face shapes, eyes, facial features and special skins ===================== */
// k: which part it changes. shape -> L.shape, eyes -> L.eyes, feat -> toggles one entry of L.feats, skin -> L.skin (index of SPA_SKINS)
const SPA_ITEMS = [
  // face shapes
  {id:'sp_square', k:'shape', v:'square', en:'strong jaw', vi:'Hàm vuông nam tính', price:100, rar:0},
  {id:'sp_oval', k:'shape', v:'oval', en:'oval face', vi:'Mặt trái xoan', price:120, rar:0},
  {id:'sp_mochi', k:'shape', v:'mochi', en:'chubby cheeks', vi:'Má bánh bao', price:140, rar:1, lvl:2, hot:1},
  {id:'sp_vline', k:'shape', v:'vline', en:'V-line jaw', vi:'Cằm V-line', price:180, rar:1, lvl:3, hot:1},
  {id:'sp_heart', k:'shape', v:'heart', en:'heart-shaped face', vi:'Mặt trái tim', price:200, rar:1, lvl:4},
  {id:'sp_slim', k:'shape', v:'slim', en:'slim face', vi:'Mặt thon dài', price:10, cur:'gem', rar:2, lvl:5},
  {id:'sp_idol', k:'shape', v:'idol', en:'idol face', vi:'Mặt idol cằm nhọn', price:30, cur:'gem', rar:3, lvl:10, hot:1},
  // eyes
  {id:'se_ordinary', k:'eyes', v:'ordinary', en:'calm eyes', vi:'Mắt hiền', price:60, rar:0},
  {id:'se_cute', k:'eyes', v:'cute', en:'big round eyes', vi:'Mắt to tròn long lanh', price:100, rar:0, hot:1},
  {id:'se_sparkle', k:'eyes', v:'sparkle', en:'sparkling eyes', vi:'Mắt lấp lánh anime', price:160, rar:1, lvl:3, hot:1},
  {id:'se_cat', k:'eyes', v:'cat', en:'cat eyes', vi:'Mắt mèo sắc sảo', price:150, rar:1, lvl:3},
  {id:'se_love', k:'eyes', v:'love', en:'heart eyes', vi:'Mắt trái tim', price:12, cur:'gem', rar:2, lvl:5},
  {id:'se_doe', k:'eyes', v:'doe', en:'doe eyes', vi:'Mắt nai mi cong', price:14, cur:'gem', rar:2, lvl:6, hot:1},
  {id:'se_odd', k:'eyes', v:'odd', en:'two-coloured eyes', vi:'Mắt hai màu', price:35, cur:'gem', rar:3, lvl:12},
  {id:'se_galaxy', k:'eyes', v:'galaxy', en:'galaxy eyes', vi:'Mắt ngân hà', price:0, rar:4, chest:1},
  // facial features (several can be on at once)
  {id:'sf_mole', k:'feat', v:'mole', en:'beauty mark', vi:'Nốt ruồi duyên', price:50, rar:0},
  {id:'sf_brows', k:'feat', v:'brows', en:'bold eyebrows', vi:'Lông mày đậm', price:80, rar:0},
  {id:'sf_dimples', k:'feat', v:'dimples', en:'dimples', vi:'Lúm đồng tiền', price:90, rar:1, lvl:2, hot:1},
  {id:'sf_lashes', k:'feat', v:'lashes', en:'long eyelashes', vi:'Mi dài cong vút', price:110, rar:1, lvl:3},
  {id:'sf_nose', k:'feat', v:'nose', en:'high nose bridge', vi:'Sống mũi cao', price:12, cur:'gem', rar:2, lvl:6},
  {id:'sf_glow', k:'feat', v:'glow', en:'glass skin', vi:'Da căng bóng', price:20, cur:'gem', rar:2, lvl:7, hot:1},
  // special skins
  {id:'sk_porcelain', k:'skin', v:'porcelain', en:'porcelain skin', vi:'Da trắng sứ', price:120, rar:1, lvl:2},
  {id:'sk_peach', k:'skin', v:'peach', en:'peachy skin', vi:'Da hồng đào', price:120, rar:1, lvl:2},
  {id:'sk_bronze', k:'skin', v:'bronze', en:'bronze tan', vi:'Da nâu bánh mật', price:120, rar:1, lvl:2},
  {id:'sk_elf', k:'skin', v:'elf', en:'elf skin', vi:'Da tiên tộc bạc hà', price:30, cur:'gem', rar:3, lvl:10},
  {id:'sk_lilac', k:'skin', v:'lilac', en:'fairy skin', vi:'Da tiên tím oải hương', price:35, cur:'gem', rar:3, lvl:12},
  {id:'sk_starlight', k:'skin', v:'starlight', en:'starlight skin', vi:'Da ánh sao', price:0, rar:4, chest:1}
];
const SPA = Object.fromEntries(SPA_ITEMS.map(x => [x.id, x]));
const SPA_TABS = [['shape', 'Dáng mặt'], ['eyes', 'Đôi mắt'], ['feat', 'Nét duyên'], ['skin', 'Màu da']];
const spaOwned = id => (S.spa || []).includes(id);
function spaPatch(x, L) {
  if (x.k === 'shape') return {shape: x.v};
  if (x.k === 'eyes') return {eyes: x.v};
  if (x.k === 'skin') return {skin: skinIndex(x.v)};
  const fs = (L.feats || []).filter(v => v !== x.v); return {feats: [...fs, x.v]};
}
const spaActive = (x, L) => x.k === 'shape' ? L.shape === x.v : x.k === 'eyes' ? L.eyes === x.v : x.k === 'skin' ? L.skin === skinIndex(x.v) : (L.feats || []).includes(x.v);
// face-shape previews use short hair so the jawline shows
function spaPreview(x) { const L = fullLook(S.look); return portraitSVG(Object.assign({}, L, spaPatch(x, L), {hat: null, back: null, hand: null, face2: null, mouth: null, ear: null, neck: null}, x.k === 'shape' ? {hairB: null, hairF: 'regular'} : {})); }

let SPAS = {tab: 'shape', buy: null};
function spaHTML() {
  if (SPAS.buy) return spaBuyHTML();
  const L = fullLook(S.look), list = SPA_ITEMS.filter(x => x.k === SPAS.tab);
  const card = x => { const has = spaOwned(x.id), lock = (x.lvl || 1) > S.lvl, on = spaActive(x, L);
    return `<button class="card r${x.rar}" data-act="${has ? 'spa-use' : 'spa-pick'}" data-id="${x.id}" ${!has && (lock || !salAfford(x)) ? 'disabled' : ''}><span class="rar">${RARITY[x.rar].vi}</span>${x.hot ? '<span class="hot">HOT</span>' : ''}<img class="pv" src="${spaPreview(x)}" alt=""><b>${has ? esc(x.en) : '???'}</b><small>${esc(x.vi)}</small><span class="price">${has ? (on ? (x.k === 'feat' ? 'Đang dùng · bấm để bỏ' : 'Đang dùng') : 'Đã có · bấm để dùng') : lock ? needTag(x.lvl) : salPrice(x)}</span></button>`; };
  const reset = SPAS.tab === 'feat' ? '' : `<button class="card" data-act="spa-reset" data-k="${SPAS.tab}"><span class="pv none">Gốc</span><b>Trở lại mặc định</b><small>miễn phí</small></button>`;
  return `<p class="note">Spa làm đẹp: đổi dáng mặt, đôi mắt, thêm nét duyên và màu da đặc biệt. Chị Thu hỏi tên dịch vụ bằng tiếng Anh, trả lời đúng mới làm được. Nét duyên có thể bật nhiều cái cùng lúc.</p>
    <div class="seg">${SPA_TABS.map(([k, l]) => `<button class="segb" data-act="spa-tab" data-t="${k}" aria-pressed="${SPAS.tab === k}">${l}</button>`).join('')}</div>
    <div class="cards">${reset}${list.map(card).join('')}</div>`;
}
function spaBuyHTML() {
  const x = SPA[SPAS.buy.id], B = SPAS.buy;
  return `<div class="buyq"><img class="pv big" src="${spaPreview(x)}" alt=""><div><p class="q-ask">Chị Thu hỏi: “What is this called in English?” ${sayBtn('What is this called in English?')}</p><div class="q-word vi">${esc(x.vi)}</div><span class="price">${salPrice(x)}</span></div></div>
    <div class="opts">${B.opts.map((o, i) => `<button class="opt ${B.done ? (o === x.en ? 'right' : i === B.pick ? 'wrong' : '') : ''}" data-act="spa-ans" data-i="${i}" ${B.done ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div>
    ${B.done ? `<div class="fb ${B.ok ? 'good' : 'miss'}"><strong>${B.ok ? 'Đúng rồi!' : 'Chưa đúng'}</strong> ${B.ok ? `Đã làm xong: <b>${esc(x.en)}</b>.` : `Đây là “${esc(x.en)}”. Thử lại sau nhé.`}</div><div class="row-btns"><button class="btn ghost sm" data-act="spa-back">Xem dịch vụ khác</button>${sayBtn(x.en)}</div>` : ''}`;
}
function spaRefresh() { if (CURNPC && CURNPC.def.role === 'spa' && $('#npc-body')) refreshNpc(); else openSpa(); }
function openSpa() {
  const n = NPCS.find(q => q.def.role === 'spa');
  if (n && S.map === 'park') return talk(n);
  openModal(`<h2 class="ptitle">Spa Thu</h2><div id="npc-body">${spaHTML()}</div>`, {label: 'Spa', wide: true});
}
function spaPick(id) {
  const x = SPA[id]; if (!x || spaOwned(id) || (x.lvl || 1) > S.lvl || !salAfford(x)) return;
  const same = SPA_ITEMS.filter(y => y.id !== id && y.en !== x.en && (y.k === x.k || Math.random() < 0.3));
  SPAS.buy = {id, opts: shuffle([x.en, ...shuffle(same).slice(0, 3).map(y => y.en)]), done: false}; spaRefresh(); speak('What is this called in English?', true);
}
function spaAnswer(i) {
  const B = SPAS.buy; if (!B || B.done) return; const x = SPA[B.id];
  B.done = true; B.pick = i; B.ok = B.opts[i] === x.en; S.stats.all++; lvNoteAnswer();
  if (B.ok) { S.stats.ok++; if (x.cur === 'gem') S.di -= x.price; else S.coins -= x.price; S.spa = S.spa || []; S.spa.push(x.id); Object.assign(S.look, spaPatch(x, S.look)); sfx('coin'); speak(x.en, true); queueFx({kind: 'spark', who: 'player'}); }
  else sfx('bad');
  spaRefresh(); renderHUD(); markDirty();
}
function spaUse(id) {
  const x = SPA[id]; if (!x || !spaOwned(id)) return;
  if (x.k === 'feat' && spaActive(x, S.look)) S.look.feats = (S.look.feats || []).filter(v => v !== x.v);
  else Object.assign(S.look, spaPatch(x, S.look));
  markDirty(); renderHUD(); spaRefresh();
}
function spaReset(k) {
  if (k === 'shape') S.look.shape = null; if (k === 'eyes') S.look.eyes = null;
  if (k === 'skin' && S.look.skin >= BASE_SKINS) S.look.skin = 0;
  markDirty(); renderHUD(); spaRefresh();
}

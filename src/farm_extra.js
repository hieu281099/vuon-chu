/* ===================== FARM SHOP, BARN UPGRADES, LUCKY CHEST ===================== */
// Barn: start with 3 animal slots, upgrade step by step up to 18 (Avatar-style pen expansion).
const BARN_CAP = [3, 6, 9, 12, 15, 18];
const BARN_UP = [null, {coins: 300, lvl: 3}, {coins: 800, em: 3, lvl: 6}, {coins: 1500, em: 8, lvl: 9}, {coins: 3000, em: 15, di: 2, lvl: 13}, {coins: 6000, em: 25, di: 5, lvl: 18}];
const barnCap = () => BARN_CAP[S.barnLv || 0];
const barnCount = () => S.animals.slice(0, barnCap()).filter(Boolean).length;
const freeSlot = () => S.animals.slice(0, barnCap()).findIndex(a => !a);
const costHTML = c => [c.coins ? `${coinIcon}${c.coins}` : '', c.em ? `${gemIcon('em')}${c.em}` : '', c.di ? `${gemIcon('di')}${c.di}` : ''].filter(Boolean).join(' ');
const canPay = c => S.coins >= (c.coins || 0) && S.em >= (c.em || 0) && S.di >= (c.di || 0);
function upgradeBarn() {
  const nx = (S.barnLv || 0) + 1, c = BARN_UP[nx]; if (!c || S.lvl < c.lvl || !canPay(c)) return;
  S.coins -= c.coins || 0; S.em -= c.em || 0; S.di -= c.di || 0; S.barnLv = nx;
  sfx('level'); speak('The barn is bigger now!', true); toast(`Chuồng đã nâng lên <b>${BARN_CAP[nx]} chỗ</b>!`); renderHUD(); markDirty(); saveNow(true);
}
function barnHTML() {
  const lv = S.barnLv || 0, nx = BARN_UP[lv + 1];
  return `<div class="barnbar"><div><b>Chuồng cấp ${lv + 1}</b><small>Đang nuôi ${barnCount()}/${barnCap()} con · tối đa ${BARN_CAP[BARN_CAP.length - 1]} con</small></div><div class="slots">${Array.from({length: 18}, (_, i) => `<i class="${i < barnCap() ? (S.animals[i] ? 'full' : 'open') : 'lock'}"></i>`).join('')}</div></div>
    ${nx ? `<div class="row-btns"><button class="btn gold" data-act="fs-barn" ${S.lvl < nx.lvl || !canPay(nx) ? 'disabled' : ''}>Nâng lên ${BARN_CAP[lv + 1]} chỗ · ${costHTML(nx)}</button>${S.lvl < nx.lvl ? `<span class="note">${needTag(nx.lvl)}</span>` : ''}</div>` : '<p class="note">Chuồng đã ở cấp tối đa.</p>'}`;
}

let FSTAB = 'seeds';
function openFarmShop(tab) {
  if (tab) FSTAB = tab;
  const tabs = [['seeds', 'Hạt giống'], ['animals', 'Vật nuôi'], ['barn', 'Nâng chuồng'], ['chest', 'Rương may mắn']];
  let body = '';
  if (FSTAB === 'seeds') body = `<p class="note">Mua hạt giống ngay tại nông trại. Gói 5 hạt hoặc gói lớn 20 hạt (giảm 10%).</p><div class="list">${CROPS.filter(c => !c.rare).map(c => { const lock = c.lvl > S.lvl, p5 = c.cost * 5, p20 = Math.round(c.cost * 20 * 0.9);
      return `<div class="row-item static ${lock ? 'locked' : ''}">${itemImg(c.id)}<span class="ri-main"><b>${c.en} ${sayBtn(c.en)}</b><small>${c.vi} · chín sau ${fmt(c.time)} · bán ${c.sell} xu · đang có ${S.seeds[c.id] || 0}</small></span>${lock ? `<span class="ri-side">${needTag(c.lvl)}</span>` : `<button class="btn ghost sm" data-act="fs-seed" data-crop="${c.id}" data-n="5" ${S.coins < p5 ? 'disabled' : ''}>5 hạt · ${coinIcon}${p5}</button><button class="btn sm" data-act="fs-seed" data-crop="${c.id}" data-n="20" ${S.coins < p20 ? 'disabled' : ''}>20 hạt · ${coinIcon}${p20}</button>`}</div>`; }).join('')}</div>`;
  if (FSTAB === 'animals') { const free = freeSlot();
    body = `${barnHTML()}${free < 0 ? `<p class="fb miss"><strong>Chuồng đầy.</strong> Nâng cấp chuồng để nuôi thêm.</p>` : ''}<div class="list">${ANIMALS.map(A => { const lock = A.lvl > S.lvl, P2 = PRODUCTS[A.product];
      return `<button class="row-item ${lock ? 'locked' : ''}" data-act="fs-animal" data-a="${A.id}" ${lock || free < 0 || S.coins < A.cost ? 'disabled' : ''}><img class="ii" src="${svgURL(animalDef(A.id, 0).svg)}" alt=""><span class="ri-main"><b>${A.en}</b><small>${A.vi} · cho ${P2.en} mỗi ${fmt(A.time)}</small></span><span class="ri-side">${lock ? needTag(A.lvl) : `${coinIcon}${A.cost}`}</span></button>`; }).join('')}</div>`; }
  if (FSTAB === 'barn') body = `<p class="note">Giống Avatar: ban đầu chuồng chỉ nuôi được 3 con. Nâng cấp dần để nuôi tới 18 con.</p>${barnHTML()}<ol class="barnsteps">${BARN_UP.slice(1).map((c, i) => `<li class="${(S.barnLv || 0) > i ? 'ok' : ''}"><b>${BARN_CAP[i + 1]} chỗ</b><span>${needTag(c.lvl)}</span><span>${costHTML(c)}</span></li>`).join('')}</ol>`;
  if (FSTAB === 'chest') body = chestHTML();
  openModal(`<h2 class="ptitle">Cửa hàng nông trại</h2><div class="seg">${tabs.map(([k, l]) => `<button class="segb" data-act="fs-tab" data-t="${k}" aria-pressed="${FSTAB === k}">${l}</button>`).join('')}</div>${body}`, {label: 'Cửa hàng nông trại', wide: true});
}
function buySeedPack(id, n) {
  const c = CROP[id]; if (!c || c.rare || c.lvl > S.lvl) return;
  const price = n >= 20 ? Math.round(c.cost * 20 * 0.9) : c.cost * 5; if (S.coins < price) return;
  S.coins -= price; S.seeds[id] = (S.seeds[id] || 0) + (n >= 20 ? 20 : 5); sfx('coin'); speak(`${c.en} seeds`, true); toast(`Đã mua ${n >= 20 ? 20 : 5} hạt <b>${c.en}</b>.`); renderHUD(); markDirty(); openFarmShop();
}
function farmBuyAnimal(id) { const i = freeSlot(); if (i < 0) return; buyAnimal(i, id); openFarmShop(); }

/* ---------- lucky chest: keys come from weekly tests, roadmap stages, rare fish and every 5 levels ---------- */
const CHEST_PRICE = 5, PITY = 40; let LASTCHEST = 'key';
function chestHTML() {
  const myth = FASHION.filter(f => f.chest), have = myth.filter(f => S.owned.includes(f.id)).length + HAIR_ITEMS.filter(h => h.chest && (S.hair || []).includes(h.id)).length, total = myth.length + HAIR_ITEMS.filter(h => h.chest).length;
  return `<div class="chest"><div class="chestbox" aria-hidden="true"><i></i></div><div><p>Mở rương có thể nhận: xu, ngọc lục bảo, kim cương, <b>hạt nhân sâm</b> (bán 1200 xu), đồ Sử thi, Huyền thoại và cực hiếm là <b class="myth">đồ Thần thoại</b> chỉ có trong rương (tỉ lệ 1,5%).</p>
    <p class="note">Bảo hiểm: mở đủ ${PITY} lần chưa ra đồ Thần thoại thì lần tiếp theo chắc chắn ra. Đã mở ${S.pity || 0}/${PITY}. Bộ sưu tập Thần thoại: ${have}/${total} (gồm cả kiểu tóc).</p>
    <div class="row-btns"><button class="btn gold" data-act="chest-open" data-k="key" ${(S.keys || 0) < 1 ? 'disabled' : ''}>Dùng 1 chìa khoá (có ${S.keys || 0})</button><button class="btn" data-act="chest-open" data-k="di" ${S.di < CHEST_PRICE ? 'disabled' : ''}>Mở bằng ${gemIcon('di')}${CHEST_PRICE}</button></div>
    <p class="note">Kiếm chìa khoá: bài kiểm tra tuần chính thức, hoàn thành chặng lộ trình IELTS, câu được cá ngừ quý, mỗi 5 cấp.</p></div></div>
    <div class="mythrow">${myth.map(f => `<span class="${S.owned.includes(f.id) ? 'got' : ''}" title="${esc(f.vi)}">${f.slot === 'pet' ? `<img src="${svgURL(petSVG(f.id, 0, 0))}" alt="">` : `<img src="${portraitSVG(Object.assign({}, fullLook(S.look), slotPatch(f)), {full: ['back', 'hand', 'shoes', 'bag', 'neck'].includes(f.slot), hand: true})}" alt="">`}<small>${esc(f.vi)}</small></span>`).join('')}</div>`;
}
function rollChest() {
  const notOwned = l => l.filter(f => !S.owned.includes(f.id));
  const myth = [...notOwned(FASHION.filter(f => f.chest)).map(item => ({item})), ...HAIR_ITEMS.filter(h => h.chest && !(S.hair || []).includes(h.id)).map(hairItem => ({hairItem}))];
  const rare = [...notOwned(FASHION.filter(f => f.rar >= 2 && f.rar <= 3 && f.price > 0)).map(item => ({item})), ...HAIR_ITEMS.filter(h => h.rar >= 2 && h.rar <= 3 && !(S.hair || []).includes(h.id)).map(hairItem => ({hairItem}))];
  S.pity = (S.pity || 0) + 1;
  const r = Math.random();
  if (myth.length && (r < 0.015 || S.pity >= PITY)) { S.pity = 0; return rand(myth); }
  if (rare.length && r < 0.095) return rand(rare);
  if (r < 0.155) return {seed: 'ginseng'};
  if (r < 0.255) return {di: 2 + Math.floor(Math.random() * 3)};
  if (r < 0.505) return {em: 3 + Math.floor(Math.random() * 6)};
  return {coins: 100 + Math.floor(Math.random() * 7) * 50};
}
function openChest(kind) {
  if (kind === 'key') { if ((S.keys || 0) < 1) return; S.keys--; } else { if (S.di < CHEST_PRICE) return; S.di -= CHEST_PRICE; }
  const g = rollChest(); let title, img = '', cls = 'r0';
  if (g.hairItem) { const h = g.hairItem; S.hair = S.hair || []; S.hair.push(h.id); cls = 'r' + h.rar; title = `<b>${esc(h.vi)}</b> (${esc(h.en)}) · ${RARITY[h.rar].vi} · tóc`; img = hairPreview(h); if (h.rar >= 4) sfx('level'); }
  else if (g.item) { const f = g.item; S.owned.push(f.id); cls = 'r' + f.rar; title = `<b>${esc(f.vi)}</b> (${esc(f.en)}) · ${RARITY[f.rar].vi}`; img = f.slot === 'pet' ? svgURL(petSVG(f.id, 0, 0)) : portraitSVG(Object.assign({}, fullLook(S.look), slotPatch(f)), {full: true, hand: true}); if (f.rar >= 4) sfx('level'); }
  else if (g.seed) { S.seeds.ginseng = (S.seeds.ginseng || 0) + 1; cls = 'r3'; title = '<b>1 hạt nhân sâm</b> (ginseng) · chín sau 48 giờ, bán 1200 xu'; img = produceSVG('ginseng'); }
  else if (g.di) { S.di += g.di; cls = 'r2'; title = `<b>${g.di} kim cương</b>`; }
  else if (g.em) { S.em += g.em; cls = 'r1'; title = `<b>${g.em} ngọc lục bảo</b>`; }
  else { S.coins += g.coins; title = `<b>${g.coins} xu</b>`; }
  sfx('coin'); renderHUD(); markDirty(); saveNow(true);
  openModal(`<div class="loot ${cls}"><h2 class="ptitle">${(g.item || g.hairItem) && (g.item || g.hairItem).rar >= 4 ? 'THẦN THOẠI!' : 'Mở rương!'}</h2>${img ? `<img class="pv big" src="${img}" alt="">` : `<div class="lootico">${g.di ? gemIcon('di') : g.em ? gemIcon('em') : coinIcon}</div>`}<p>Bạn nhận được ${title}</p>
    ${g.item ? '<p class="note">Đồ đã vào Tủ đồ. Có thể nâng cấp ở lò rèn.</p>' : g.hairItem ? '<p class="note">Kiểu tóc đã vào bộ sưu tập, đổi ở Tủ đồ → Sửa ngoại hình hoặc Tiệm tóc.</p>' : ''}<div class="row-btns"><button class="btn gold" data-act="chest-again">Mở tiếp</button>${g.item ? `<button class="btn" data-act="wear-now" data-id="${g.item.id}">Mặc luôn</button>` : ''}${g.hairItem ? `<button class="btn" data-act="hair-now" data-id="${g.hairItem.id}">Dùng luôn</button>` : ''}<button class="btn ghost" data-act="close">Đóng</button></div></div>`, {label: 'Mở rương'});
}
function giveKey(n, why) { S.keys = (S.keys || 0) + n; setTimeout(() => toast(`<b>+${n} chìa khoá rương</b>${why ? ' · ' + why : ''}`), 600); markDirty(); }

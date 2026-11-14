let SHOPTAB = 'top';
const priceTag = f => f.price === 0 ? 'Miễn phí' : (f.cur === 'gem' ? gemIcon('di') + f.price : coinIcon + f.price);
const canAfford = f => f.cur === 'gem' ? S.di >= f.price : S.coins >= f.price;
function slotPatch(f) { return f.slot === 'face' ? {face2: f.id} : {[f.slot]: f.id}; }
function itemCard(f, L, act, extra = '') {
  const own = S.owned.includes(f.id), lock = (f.lvl || 1) > S.lvl, lv = (S.look.lv || {})[f.id] || 0;
  const tryL = Object.assign({}, L, slotPatch(f)); if (lv) tryL.lv = Object.assign({}, L.lv, {[f.id]: lv});
  const img = f.slot === 'pet' ? `<img class="pv pet" src="${svgURL(petSVG(f.id, lv, 0))}" alt="">` : f.slot === 'aura' ? `<span class="pv aura" style="--c:${f.col}"></span>` : `<img class="pv" src="${portraitSVG(tryL, {full: ['back', 'hand'].includes(f.slot), hand: true})}" alt="">`;
  return `<button class="card r${f.rar || 0}" data-act="${act}" data-id="${f.id}" ${extra}><span class="rar">${RARITY[f.rar || 0].vi}</span>${lv ? `<span class="plus t${lv}">+${lv}</span>` : ''}${img}<b>${act === 'shop-pick' && !own ? '???' : esc(f.en)}</b><small>${esc(f.vi)}</small>${act === 'shop-pick' ? `<span class="price">${own ? 'Đã có' : lock ? `Cấp ${f.lvl}` : priceTag(f)}</span>` : ''}</button>`;
}
function shopHTML() {
  const L = fullLook(S.look), list = FASHION.filter(f => f.slot === SHOPTAB && f.price > 0);
  return `<p class="note">Chọn món muốn mua. Cô Mai sẽ hỏi tên món đó bằng tiếng Anh, trả lời đúng mới mua được. Đồ có biểu tượng kim cương thì trả bằng kim cương.</p>
    <div class="seg">${SLOTS.map(([k, l]) => `<button class="segb" data-act="shop-tab" data-t="${k}" aria-pressed="${SHOPTAB === k}">${l}</button>`).join('')}</div>
    <div class="cards">${list.map(f => itemCard(f, L, 'shop-pick', S.owned.includes(f.id) || (f.lvl || 1) > S.lvl || !canAfford(f) ? 'disabled' : '')).join('')}</div>`;
}
function buyHTML() {
  const f = FASH[BUY.id], L = fullLook(S.look), tryL = Object.assign({}, L, slotPatch(f));
  const img = f.slot === 'pet' ? svgURL(petSVG(f.id, 0, 0)) : portraitSVG(tryL, {full: true, hand: true});
  return `<div class="buyq"><img class="pv big" src="${img}" alt=""><div><p class="q-ask">Cô Mai hỏi: “What is this in English?” ${sayBtn('What is this in English?')}</p><div class="q-word vi">${esc(f.vi)}</div><span class="price">${priceTag(f)}</span></div></div>
    <div class="opts">${BUY.opts.map((o, i) => `<button class="opt ${BUY.done ? (o === f.en ? 'right' : i === BUY.pick ? 'wrong' : '') : ''}" data-buy="${i}" ${BUY.done ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div>
    ${BUY.done ? `<div class="fb ${BUY.ok ? 'good' : 'miss'}"><strong>${BUY.ok ? 'Đúng rồi!' : 'Chưa đúng'}</strong> ${BUY.ok ? `Bạn đã mua <b>${esc(f.en)}</b> và mặc luôn.` : `Đây là “${esc(f.en)}”. Thử lại sau nhé.`}</div><div class="row-btns"><button class="btn ghost sm" data-act="shop-back">Xem món khác</button>${sayBtn(f.en)}</div>` : ''}`;
}
function shopPick(id) {
  const f = FASH[id]; if (!f || S.owned.includes(id) || (f.lvl || 1) > S.lvl || !canAfford(f)) return;
  BUY = {id, opts: shuffle([f.en, ...shuffle(FASHION.filter(x => x.id !== id && x.en !== f.en)).slice(0, 3).map(x => x.en)]), done: false}; refreshNpc(); speak('What is this in English?', true);
}
function shopAnswer(i) {
  if (!BUY || BUY.done) return; const f = FASH[BUY.id];
  BUY.done = true; BUY.pick = i; BUY.ok = BUY.opts[i] === f.en; S.stats.all++;
  if (BUY.ok) { S.stats.ok++; if (f.cur === 'gem') S.di -= f.price; else S.coins -= f.price; S.owned.push(f.id); Object.assign(S.look, slotPatch(f)); addXP(4); sfx('coin'); speak(f.en, true); queueFx({kind: 'spark', who: 'player'}); } else sfx('bad');
  refreshNpc(); renderHUD(); markDirty();
}

/* ---------- forge: upgrade items +1..+6 with emeralds and diamonds ---------- */
const UP_COST = [null, {em: 2, di: 0, ch: 100}, {em: 4, di: 0, ch: 90}, {em: 6, di: 0, ch: 75}, {em: 8, di: 1, ch: 60}, {em: 10, di: 2, ch: 45}, {em: 12, di: 3, ch: 30}];
let FORGE = null;
function forgeHTML() {
  if (FORGE && FORGE.ex) return exchangeHTML();
  const L = fullLook(S.look), mine = FASHION.filter(f => UPGRADABLE(f.slot) && S.owned.includes(f.id));
  if (!mine.length) return `<p class="empty">Bạn chưa có món đồ nào nâng cấp được. Mua mũ, kính, cánh, đồ cầm tay, hào quang hoặc thú cưng ở cửa hàng của Cô Mai trước nhé.</p><div class="row-btns"><button class="btn ghost sm" data-act="exchange">Đổi xu lấy ngọc</button></div>`;
  if (!FORGE || !S.owned.includes(FORGE.id)) FORGE = {id: mine[0].id, quiz: null, res: null};
  const f = FASH[FORGE.id], lv = (S.look.lv || {})[f.id] || 0, nx = lv + 1, cost = UP_COST[nx];
  const withLv = l => Object.assign({}, L, slotPatch(f), {lv: Object.assign({}, L.lv, {[f.id]: l})});
  const pic = l => f.slot === 'pet' ? `<img class="pv big" src="${svgURL(petSVG(f.id, l, 0))}" alt="">` : f.slot === 'aura' ? `<span class="pv aura big" style="--c:${l ? (TIER[l] === 'rainbow' ? '#FFB020' : TIER[l]) : f.col}"></span>` : `<img class="pv big" src="${portraitSVG(withLv(l), {full: true, hand: true})}" alt="">`;
  const bonus = FORGE.quiz === true ? 15 : 0, chance = cost ? Math.min(100, cost.ch + bonus) : 0, enough = cost && S.em >= cost.em && S.di >= cost.di;
  return `<div class="forge">
    <div class="chips">${mine.map(m => { const l = (S.look.lv || {})[m.id] || 0; return `<button class="chip" data-act="forge-pick" data-id="${m.id}" aria-pressed="${m.id === f.id}">${esc(m.vi)}${l ? ` <b>+${l}</b>` : ''}</button>`; }).join('')}</div>
    <div class="forge-stage"><div class="fs-item"><span class="tier t${lv}">${lv ? '+' + lv + ' ' + TIER_VI[lv] : 'Chưa nâng'}</span>${pic(lv)}</div>
      ${nx <= 6 ? `<div class="fs-arrow" aria-hidden="true">→</div><div class="fs-item next"><span class="tier t${nx}">+${nx} ${TIER_VI[nx]}</span>${pic(nx)}</div>` : ''}</div>
    ${nx <= 6 ? `<div class="forge-info"><span>Cần ${gemIcon('em')}<b>${cost.em}</b>${cost.di ? ` ${gemIcon('di')}<b>${cost.di}</b>` : ''}</span><span>Tỉ lệ thành công <b class="${chance >= 70 ? 'ok' : chance >= 45 ? 'mid' : 'low'}">${chance}%</b>${bonus ? ' (đã cộng 15%)' : ''}</span><span class="${nx >= 4 ? 'warn' : ''}">${nx >= 4 ? 'Thất bại từ +4 trở lên sẽ tụt 1 cấp.' : 'Thất bại chỉ mất ngọc, đồ giữ nguyên.'}</span></div>
      <div class="row-btns">${FORGE.quiz === null ? `<button class="btn ghost" data-act="forge-quiz">Trả lời 1 câu khó để +15%</button>` : ''}<button class="btn gold" data-act="forge-go" ${enough ? '' : 'disabled'}>Nâng lên +${nx}</button><button class="btn ghost sm" data-act="exchange">Đổi xu lấy ngọc</button></div>
      ${enough ? '' : `<p class="note">Chưa đủ ngọc. Ngọc lục bảo có được khi trả lời đúng 5 câu liên tiếp, lên cấp, giao đơn, học bài. Kim cương có được khi thi đậu, mỗi 5 cấp và khi câu được cá ngừ.</p>`}` : `<div class="fb good"><strong>Tối đa!</strong> Món này đã đạt +6 Cầu vồng.</div>`}
    ${FORGE.res ? `<div class="fb ${FORGE.res.ok ? 'good' : 'miss'}"><strong>${FORGE.res.ok ? 'Thành công!' : 'Thất bại'}</strong> ${FORGE.res.msg}</div>` : ''}
  </div>`;
}
function forgeGo() {
  const f = FASH[FORGE.id]; if (!f) return; S.look.lv = S.look.lv || {};
  const lv = S.look.lv[f.id] || 0, nx = lv + 1, cost = UP_COST[nx]; if (!cost || S.em < cost.em || S.di < cost.di) return;
  S.em -= cost.em; S.di -= cost.di;
  const chance = Math.min(100, cost.ch + (FORGE.quiz === true ? 15 : 0)), ok = Math.random() * 100 < chance;
  if (ok) { S.look.lv[f.id] = nx; FORGE.res = {ok: true, msg: `${esc(f.vi)} đã lên <b>+${nx} ${TIER_VI[nx]}</b>.`}; sfx('level'); queueFx({kind: 'spark', who: 'player'}); speak('Success!', true); if (nx === 6) { S.di += 2; FORGE.res.msg += ' Thưởng thêm 2 kim cương!'; } }
  else { const drop = nx >= 4 && lv > 0; if (drop) S.look.lv[f.id] = lv - 1; FORGE.res = {ok: false, msg: drop ? `Món đồ bị tụt xuống +${lv - 1}. Lần sau may mắn hơn nhé!` : 'Ngọc đã tan, món đồ vẫn giữ nguyên cấp.'}; sfx('bad'); }
  FORGE.quiz = null; refreshNpc(); renderHUD(); markDirty(); saveNow(true);
}
function forgeQuiz() {
  const keepId = FORGE.id, npc = CURNPC;
  startQuiz({tag: 'Câu hỏi may mắn', onResult: ok => { FORGE = {id: keepId, quiz: ok, res: null}; return ok ? 'Tỉ lệ nâng cấp được cộng 15%.' : 'Không được cộng tỉ lệ lần này.'; }, onClose: () => { setTimeout(() => { if (npc) talk(npc); }, 30); }});
}
function exchangeHTML() {
  return `<h3 class="ph3">Đổi xu lấy ngọc lục bảo</h3><p class="note">100 xu đổi 1 ngọc lục bảo. Kim cương không đổi được, chỉ kiếm bằng học tập và câu cá.</p><div class="row-btns"><button class="btn" data-act="ex" data-n="1" ${S.coins < 100 ? 'disabled' : ''}>Đổi 1 ${gemIcon('em')} (100 xu)</button><button class="btn" data-act="ex" data-n="5" ${S.coins < 500 ? 'disabled' : ''}>Đổi 5 ${gemIcon('em')} (500 xu)</button><button class="btn ghost" data-act="forge-back">Quay lại</button></div>`;
}
function giveGems(em, di, why) {
  S.em += em || 0; S.di += di || 0;
  const parts = []; if (em) parts.push(`${em} ngọc lục bảo`); if (di) parts.push(`${di} kim cương`);
  if (parts.length) setTimeout(() => toast(`${gemIcon(di ? 'di' : 'em')} <b>+${parts.join(', +')}</b>${why ? ' · ' + why : ''}`), 300);
  renderHUD();
}

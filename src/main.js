/* ===================== HUD, INPUT, BOOT ===================== */
function renderHUD() {
  if (!S) return;
  $('#hud-name').textContent = S.name || 'Bạn';
  $('#hud-lvl').textContent = S.cefr || 'A1';
  const rd = readiness(), pct = Math.round(rd.pct * 100); $('#hud-ring').classList.toggle('ready', !rd.max && rd.pct >= 1); $('#hud-xp').style.width = pct + '%'; $('#hud-ring').style.setProperty('--p', pct);
  $('#hud-em').textContent = S.em; $('#hud-di').textContent = S.di;
  $('#hud-coins').textContent = S.coins;
  $('#hud-study').textContent = `${TRACKS[S.study.track].vi} · ${S.study.track === 'ielts' ? IELTS_BAND[S.study.level] : S.study.level}`;
  $('#hud-streak').textContent = S.streak;
  const au = autoActive(); $('#hud-auto').hidden = !au; if (au) $('#hud-auto-t').textContent = 'AUTO ' + Math.ceil((S.auto.until - Date.now()) / 3600e3) + 'h';
  const face = portraitSVG(fullLook(S.look)); if ($('#hud-face').getAttribute('src') !== face) $('#hud-face').src = face;
  const M = MAPNOW(); $('#maplabel').innerHTML = `<b>${M.en}</b> ${M.vi}`;
  const ready = S.orders.filter(o => o.items.every(it => (S.inv[it.id] || 0) >= it.n)).length;
  $('#bb-bag .dot').hidden = !ready;
  renderHint();
}
let hintKey = '';
let hintTimer = 0;
function renderHint() {
  const now = Date.now(); let h;
  if (S.map === 'farm') {
    const sts = S.plots.map(p => plotState(p, now)), nm = st => { const p = S.plots[sts.indexOf(st)]; return p && p.c ? CROP[p.c].en : ''; };
    if (sts.includes('R')) h = `<b>${nm('R')}</b> đã chín (ngôi sao vàng). Chạm vào để thu hoạch.`;
    else if (sts.includes('W')) h = `Cỏ dại mọc ở ruộng <b>${nm('W')}</b>. Chạm để nhổ.`;
    else if (sts.includes('D')) h = `Ruộng <b>${nm('D')}</b> đang khô (giọt nước). Chạm để tưới.`;
    else if (S.animals.some(a => a && a.st === 'ready')) h = 'Chuồng có sản phẩm mới. Chạm vào con vật để lấy.';
    else if (S.animals.some(a => a && a.st === 'hungry')) h = 'Vật nuôi đang đói. Vào chuồng, chạm vào con vật để cho ăn.';
    else if (sts.includes('E')) h = Object.values(S.seeds).some(n => n > 0) ? 'Còn ô đất trống. Chạm vào để gieo hạt.' : 'Hết hạt giống. Sang <b>Làng</b> mua ở cửa hàng SEEDS.';
    else h = 'Cây đang lớn, vài giờ nữa mới chín. Chạm vào ô ruộng để bón phân, hoặc mở <b>Bản đồ</b> đi dạo.';
  } else if (S.map === 'village') h = 'Chú Ba (MARKET) nhận đơn hàng, Cô Mai (CLOTHES SHOP) bán quần áo, Ông Tư (SEEDS) bán hạt, Cô Lan (SCHOOL) dạy học, Chị Ngân (HAIR SALON) làm tóc, Cô Tám bán vé số trước POST. Bảng tin ở quảng trường.';
  else if (S.map === 'park') h = 'Gặp Chị Hà ở bảng IELTS CHALLENGE để làm thử thách IELTS hằng ngày. Chị Thu ở BEAUTY SPA đổi dáng mặt, đôi mắt, nét duyên.';
  else h = 'Chạm vào mặt nước để thả câu. Ông Sáu ở cầu tàu cũng thích nói chuyện.';
  if (h !== hintKey) { hintKey = h; const el = $('#hint'); el.innerHTML = h; el.classList.remove('gone'); clearTimeout(hintTimer); hintTimer = setTimeout(() => el.classList.add('gone'), 5000); }
}
function showBanner(en, vi) { const b = $('#banner'); b.innerHTML = `<b>${esc(en)}</b><span>${esc(vi)}</span>`; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); }

/* ---------- world input ---------- */
cv.addEventListener('pointerdown', e => {
  if (modalOpen() || !S || !P) return;
  const r = cv.getBoundingClientRect(), m = MAPNOW();
  const wx = view.camX + (e.clientX - r.left) / view.s, wy = view.camY + (e.clientY - r.top) / view.s, [tx, ty] = tileOf(wx, wy);
  tapMark = {x: wx, y: wy, t: performance.now()};
  try { AC && AC.state === 'suspended' && AC.resume(); } catch (er) {}
  for (const n of NPCS) if (Math.abs(wx - n.x) < 14 && wy > n.y - 56 && wy < n.y + 6) { const [nx, ny] = tileOf(n.x, n.y); return approach(nx, ny, 1.6, () => talk(n), true); }
  if (m.id === 'farm') {
    for (let i = 0; i < ANIMS.length; i++) { const a = ANIMS[i]; if (!a) continue; const [aw, ah] = ANI_SIZE[a.t]; if (Math.abs(wx - a.x) < aw / 2 && wy > a.y - ah && wy < a.y + 6) { const [ax, ay] = tileOf(a.x, a.y); return approach(ax, ay, 99, () => onAnimal(i)); } }
    const pi = m.plots.findIndex(([px, py]) => px === tx && (py === ty || (py === ty + 1 && wy > py * TS - 16)));
    if (pi >= 0 && (S.plots[pi].u || nextLocked() === pi)) { const [px, py] = m.plots[pi]; return approach(px, py, 3.2, () => onPlot(pi)); }
  }
  for (const o of m.objs) {
    if (o.t === 'house' && tx >= o.x && tx < o.x + o.tw && ty >= o.y && ty < o.y + o.th) {
      if (o.role === 'home') return approach(o.door[0], o.door[1], 1.6, () => { speak('home', true); openWardrobe(); });
      const n = o.role && NPCS.find(q => q.def.role === o.role);
      if (n) { const [nx, ny] = tileOf(n.x, n.y); return approach(nx, ny, 1.6, () => talk(n), true); }
      if (o.sign) { speak(o.sign.toLowerCase(), true); toast(`<b>${esc(o.sign)}</b>`); }
      return approach(o.door[0], o.door[1], 99, null);
    }
    if ((o.role === 'farmshop' || o.kind === 'stall_farm') && Math.abs(tx - o.x) <= 1 && Math.abs(ty - o.y) <= 1) { const st = m.objs.find(q => q.kind === 'stall_farm'); return approach(st.x, st.y + 1, 1.6, () => { speak('farm shop', true); openFarmShop(); }); }
    if ((o.t === 'sign' || (o.t === 'prop' && /^stall/.test(o.kind))) && Math.abs(tx - o.x) <= 1 && Math.abs(ty - o.y) <= 1) { const n = NPCS.find(q => q.def.role === 'market'); if (n) { const [nx, ny] = tileOf(n.x, n.y); return approach(nx, ny, 1.6, () => talk(n), true); } }
    if (o.t === 'prop' && o.kind === 'board' && Math.abs(tx - o.x) <= 1 && ty >= o.y - 1 && ty <= o.y) {
      if (m.id === 'park') { const n = NPCS.find(q => q.def.role === 'ielts'); if (n) { const [nx, ny] = tileOf(n.x, n.y); return approach(nx, ny, 1.6, () => talk(n), true); } }
      return approach(o.x, o.y + 1, 1.6, () => openBoard());
    }
  }
  if (T_(m, tx, ty) === 'w') return approach(tx, ty, 99, () => {
    const [px, py] = tileOf(P.x, P.y); let best = null, bd = 1e9;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { if (T_(m, px + dx, py + dy) !== 'w' || Math.hypot(dx, dy) > 2.3) continue; const d = Math.hypot(px + dx - tx, py + dy - ty); if (d < bd) { bd = d; best = [px + dx, py + dy]; } }
    if (best) startFishing(best[0], best[1]); else toast('Đứng sát mép nước rồi chạm vào mặt nước để câu.');
  });
  const tr = m.objs.find(o => o.t === 'tree' && Math.abs(o.x - tx) <= 1 && ty >= o.y - 3 && ty <= o.y);
  if (tr) { speak('tree', true); toast('<b>tree</b> · cái cây'); }
  approach(tx, ty, 99, null);
});

/* ---------- clicks in UI ---------- */
let resetArmed = 0;
document.addEventListener('click', e => {
  const t = e.target.closest('[data-say],[data-act],[data-opt],[data-tile],[data-ph],[data-buy]'); if (!t) return;
  const d = t.dataset;
  if (d.say != null) return speak(d.say);
  if (d.opt != null) return choose(+d.opt);
  if (d.tile != null) return tapTile(+d.tile);
  if (d.ph != null) return choosePhrase(+d.ph);
  if (d.buy != null) return shopAnswer(+d.buy);
  switch (d.act) {
    case 'close-bg': if (e.target === t && !CC) closeModal(); return;
    case 'close': LESSON = null; return closeModal();
    case 'q-next': if (LESSON) { LESSON.advancing = true; closeModal(); LESSON.advancing = false; lessonNext(); } else if (Q && Q.opt.onNext) { const nx = Q.opt.onNext; closeModal(); nx(); } else closeModal(); return;
    case 'fert-q': closeModal(); return fertilize(+d.p, false);
    case 'fert-m': return fertilize(+d.p, true);
    case 'forge-shoe': FORGE.shoe = !FORGE.shoe; return refreshNpc();
    case 'ielts-band': S.ieltsBand = d.t; markDirty(); return refreshNpc();
    case 'ielts-go': return startIelts();
    case 'map': return openMap();
    case 'travel': return travel(d.t);
    case 'plant': return plant(+d.p, d.crop);
    case 'unlock': return unlock(+d.p);
    case 'buyanimal': return buyAnimal(+d.s, d.a);
    case 'farmshop': return openFarmShop(d.t);
    case 'minimap': return openMinimap();
    case 'lotto-buy': return lottoBuy();
    case 'lotto-scratch': return lottoScratch(+d.i);
    case 'lotto-all': return lottoAll();
    case 'mm-go': return mmGo(d.id);
    case 'login': return openAuthInGame('login');
    case 'register': return openAuthInGame('register');
    case 'logout': if (t.dataset.armed) { saveNow(true).finally(() => sbLogout().then(() => location.reload())); } else { t.dataset.armed = 1; t.textContent = 'Bấm lần nữa để đăng xuất'; } return;
    case 'sync': saveNow(true).then(() => sbPull(false)); return;
    case 'fs-tab': return openFarmShop(d.t);
    case 'fs-seed': return buySeedPack(d.crop, +d.n);
    case 'fs-animal': return farmBuyAnimal(d.a);
    case 'fs-barn': upgradeBarn(); return openFarmShop();
    case 'chest-open': LASTCHEST = d.k; return openChest(d.k);
    case 'chest-again': if (LASTCHEST === 'key' ? (S.keys || 0) > 0 : S.di >= CHEST_PRICE) return openChest(LASTCHEST); return openFarmShop('chest');
    case 'wear-now': { const f = FASH[d.id]; if (f && S.owned.includes(f.id)) { Object.assign(S.look, slotPatch(f)); markDirty(); renderHUD(); toast(`Đã mặc <b>${esc(f.vi)}</b>.`); } return closeModal(); }
    case 'buyseed': return buySeed(d.crop);
    case 'deliver': return deliver(+d.k);
    case 'swap': S.orders[+d.k] = genOrder(); refreshNpc(); markDirty(); return;
    case 'sell': return sell(d.id, false);
    case 'sellall': return sell(d.id, true);
    case 'mk': MK = d.t; return refreshNpc();
    case 'show-vi': { const v = $('#npc-vi'); if (v) v.hidden = false; t.remove(); return; }
    case 'chat': if (CURNPC) { newPhrase(); refreshNpc(); } return;
    case 'lesson': return startLesson(false);
    case 'leveltest': return startLesson(true);
    case 'shop-pick': return shopPick(d.id);
    case 'shop-back': BUY = null; return refreshNpc();
    case 'sp-del': return spellDel();
    case 'track': S.study.track = d.t; markDirty(); renderHUD(); return openStudy();
    case 'level': S.study.level = d.t; if (!S.study.unlocked.includes(d.t)) S.study.unlocked.push(d.t); markDirty(); renderHUD(); return openStudy();
    case 'ward-slot': WARD = d.t; return openWardrobe();
    case 'wear': { const key = WARD === 'face' ? 'face2' : WARD; S.look[key] = d.id || (['top', 'bottom'].includes(WARD) ? S.look[key] : null); markDirty(); renderHUD(); return openWardrobe(); }
    case 'dye-shoe': S.look.shoeC = d.c; markDirty(); renderHUD(); return openWardrobe();
    case 'shop-tab': SHOPTAB = d.t; BUY = null; return refreshNpc();
    case 'forge-pick': FORGE = {id: d.id, tab: FASH[d.id].slot, quiz: null, res: null}; refreshNpc(); { const s = document.querySelector('#modal .tierstrip'); if (s) s.scrollIntoView({block: 'nearest', behavior: 'smooth'}); } return;
    case 'forge-tab': { const list = FASHION.filter(f => f.slot === d.t && CAN_UPGRADE(f) && (f.price > 0 || f.chest || S.owned.includes(f.id))); const pick = list.find(f => S.owned.includes(f.id)) || list[0]; FORGE = {id: pick.id, tab: d.t, quiz: null, res: null}; return refreshNpc(); }
    case 'forge-quiz': return forgeQuiz();
    case 'forge-go': return forgeGo();
    case 'exchange': FORGE = Object.assign(FORGE || {}, {ex: true}); return refreshNpc();
    case 'forge-back': if (FORGE) FORGE.ex = false; return refreshNpc();
    case 'ex': { const n = +d.n; if (S.coins >= n * 100) { S.coins -= n * 100; S.em += n; sfx('coin'); renderHUD(); markDirty(); } return refreshNpc(); }
    case 'cc-tab': CC.name = $('#cc-name').value; CC.tab = d.t; return renderCreator();
    case 'dye': { const k = {top: 'topC', bottom: 'bottomC'}[WARD]; if (k) { S.look[k] = d.c; markDirty(); renderHUD(); openWardrobe(); } return; }
    case 'creator': return openCreator(false);
    case 'cc': CC.name = $('#cc-name') ? $('#cc-name').value : CC.name; CC.look[d.k] = d.k === 'skin' ? +d.v : (d.v === 'null' ? null : d.v); return renderCreator();
    case 'cc-lv': CC.name = $('#cc-name').value; CC.level = d.v; return renderCreator();
    case 'cc-tr': CC.name = $('#cc-name').value; CC.track = d.v; return renderCreator();
    case 'cc-done': return ccDone();
    case 'bag': return openBag();
    case 'study': return openStudy();
    case 'lvinfo': return openLevel();
    case 'lv-test': return startLevelUp();
    case 'salon': return openSalon();
    case 'spa': return openSpa();
    case 'spa-tab': SPAS.tab = d.t; SPAS.buy = null; return spaRefresh();
    case 'spa-back': SPAS.buy = null; return spaRefresh();
    case 'spa-pick': return spaPick(d.id);
    case 'spa-use': return spaUse(d.id);
    case 'spa-ans': return spaAnswer(+d.i);
    case 'spa-reset': return spaReset(d.k);
    case 'spa-now': { const x = SPA[d.id]; if (x && spaOwned(x.id)) { Object.assign(S.look, spaPatch(x, S.look)); markDirty(); renderHUD(); } return closeModal(); }
    case 'sal-tab': SAL.tab = d.t; SAL.buy = null; return salonRefresh();
    case 'sal-back': SAL.buy = null; return salonRefresh();
    case 'hair-pick': return hairPick(d.id);
    case 'hair-wear': return hairWear(d.id);
    case 'hair-ans': return hairAnswer(+d.i);
    case 'hair-now': { const h = HAIR[d.id]; if (h && (S.hair || []).includes(h.id)) { Object.assign(S.look, hairPatch(h)); markDirty(); renderHUD(); } return closeModal(); }
    case 'tests': return openTests();
    case 'roadmap': return openRoadmap();
    case 'road-claim': return claimRoad(+d.v);
    case 't-place': return openExam(buildPlacement());
    case 't-auto': return openExam(buildAutoTest());
    case 't-ielts': return openExam(buildMock(IELTS_MOCK, d.v.split(',')));
    case 't-toeic': return openExam(buildMock(TOEIC_MOCK, d.v.split(',')));
    case 't-ai': return aiTest(d.v);
    case 'wardrobe': return openWardrobe();
    case 'board': return openBoard();
    case 'settings': return openSettings();
    case 'credits': return openCredits();
    case 'help': return openHelp();
    case 'emote': P.emote = performance.now(); P.say = {text: rand(['Hello!', 'Yay!', 'Hi there!']), t: performance.now()}; return;
    case 'sound': S.sound = !S.sound; markDirty(); return openSettings();
    case 'reset':
      if (Date.now() - resetArmed < 4000) { resetArmed = 0; S = newGame(); startWorld(); saveNow(true); openCreator(true); }
      else { resetArmed = Date.now(); t.textContent = 'Bấm lần nữa để xoá toàn bộ tiến độ'; setTimeout(() => { const b = $('#reset-btn'); if (b) b.textContent = 'Chơi lại từ đầu'; }, 4000); }
      return;
  }
});
$('#chatform').addEventListener('submit', e => {
  e.preventDefault(); const inp = $('#chatinput'), text = inp.value.trim().slice(0, 60); if (!text || !P) return;
  P.say = {text, t: performance.now()}; inp.value = '';
  const near = NPCS.filter(n => Math.hypot(n.x - P.x, n.y - P.y) < 5 * TS);
  if (near.length && /\b(hi|hello|hey|good (morning|afternoon|evening))\b/i.test(text)) { const n = near[0]; setTimeout(() => { n.bubble = {text: `Hello, ${S.name}!`, t: performance.now()}; speak(`Hello, ${S.name}!`, true); }, 600); }
  else if (near.length && /\b(thank|thanks)\b/i.test(text)) { const n = near[0]; setTimeout(() => { n.bubble = {text: 'You are welcome!', t: performance.now()}; }, 600); }
  else if (near.length && /\bhow are you\b/i.test(text)) { const n = near[0]; setTimeout(() => { n.bubble = {text: 'I am fine, thank you!', t: performance.now()}; }, 600); }
});
document.addEventListener('keydown', e => {
  if (!modalOpen()) return;
  if (e.target && e.target.tagName === 'INPUT') { if (e.key === 'Enter' && CC) ccDone(); return; }
  if (e.key === 'Escape') { if (!$('#modal .pclose')) return; LESSON = null; return closeModal(); }
  if (PH && !PH.done && /^[1-4]$/.test(e.key)) return choosePhrase(+e.key - 1);
  if (BUY && !BUY.done && /^[1-4]$/.test(e.key)) return shopAnswer(+e.key - 1);
  if (!Q) return;
  if (Q.done) { if (e.key === 'Enter') { e.preventDefault(); $('#q-next') && $('#q-next').click(); } return; }
  if (Q.type === 'spell') { if (e.key === 'Backspace') { e.preventDefault(); return spellDel(); } if (/^[a-z]$/i.test(e.key)) { const i = Q.tiles.findIndex(t => !t.used && t.ch === e.key.toLowerCase()); if (i >= 0) tapTile(i); } }
  else if (/^[1-4]$/.test(e.key)) choose(+e.key - 1);
});
document.addEventListener('visibilitychange', () => { if (document.hidden && S) saveNow(); });

/* ---------- game tick (growth, animals) ---------- */
function tick() {
  if (!S) return;
  const now = Date.now(); if (autoTick(now)) { renderHUD(); markDirty(); }
  const dt = now - S.last;
  for (const p of S.plots) { if (!p.u || !p.c || p.weed || p.p >= 1) continue; const c = CROP[p.c], grow = Math.max(0, Math.min(now, p.w) - S.last);
    if (grow > 0) { p.p = Math.min(1, p.p + grow / (c.time * 1000)); if (dt < 5000 && !p.hw && p.p > 0.15 && p.p < 0.85 && Math.random() < (dt / 1000) / 80) { p.weed = true; p.hw = true; } } }
  for (const a of S.animals) if (a && a.st === 'producing' && now >= a.r) a.st = 'ready';
  S.last = now; renderHint();
}

/* ---------- boot ---------- */
function normalize(d) {
  const base = newGame();
  const s = Object.assign(base, d || {});
  if (!s.look || s.look.body || typeof s.look.skin !== 'number') { s.look = fullLook(DEFAULT_LOOK); s.owned = [...FREE_ITEMS]; }
  s.look = fullLook(s.look); s.owned = (s.owned || []).filter(id => FASH[id]); for (const id of FREE_ITEMS) if (!s.owned.includes(id)) s.owned.push(id);
  if (typeof s.em !== 'number') s.em = 4; if (typeof s.di !== 'number') s.di = 1; s.v = 4; s.study = Object.assign({track: 'general', level: 'A1', unlocked: ['A1']}, s.study || {});
  s.stats = Object.assign({ok: 0, all: 0, talks: 0, fish: 0}, s.stats || {}); s.seeds = s.seeds || {}; s.inv = s.inv || {}; s.m = s.m || {};
  while (s.plots.length < 24) s.plots.push({u: false, c: null, p: 0, w: 0, weed: false, hw: false});
  if (typeof s.barnLv !== 'number') { const last = s.animals.reduce((m, a, i) => a ? i + 1 : m, 0); s.barnLv = Math.max(BARN_CAP.findIndex(c => c >= last), d && d.created ? 2 : 0); }
  while (s.animals.length < 18) s.animals.push(null);
  if (typeof s.keys !== 'number') s.keys = 1; s.pity = s.pity || 0;
  for (const a of s.animals) if (a && !ANIMAL[a.t]) a.t = 'chicken';
  if (!MAPS[s.map]) s.map = 'farm';
  if (!Array.isArray(s.orders) || !s.orders.length) s.orders = [genOrder(['carrot']), genOrder(['radish']), genOrder(['egg'])];
  if (typeof s.last !== 'number') s.last = Date.now();
  // English level replaces the XP level; hairstyles become salon items (keep whatever the player already wears)
  if (!s.cefr) { const t = s.created ? tierOf(s.lvl || 1) : 0, st = Math.max(0, LEVELS.indexOf(s.study.level)); s.cefr = LEVELS[Math.min(t, st)]; }
  s.hair = Array.isArray(s.hair) ? s.hair : []; s.spa = Array.isArray(s.spa) ? s.spa : [];
  for (const h of HAIR_ITEMS) if (((h.f && s.look.hairF === h.f) || (h.b && s.look.hairB === h.b) || (h.c && s.look.hairC === h.c)) && !s.hair.includes(h.id)) s.hair.push(h.id);
  s.lvl = TIER_MAX[Math.max(0, LEVELS.indexOf(s.cefr))];
  s.tests = Array.isArray(s.tests) ? s.tests : []; s.bestBand = s.bestBand || {}; s.road = s.road || {claimed: []}; s.ieltsCount = s.ieltsCount || 0;
  if (s.auto && !s.auto.log) s.auto.log = {};
  return s;
}
function startWorld() {
  const m = MAPS[S.map]; let [tx, ty] = tileOf(S.px || 0, S.py || 0);
  if (!walkable(m, tx, ty)) { [tx, ty] = m.spawn; const c = center(tx, ty); S.px = c.x; S.py = c.y; }
  P = {x: S.px, y: S.py, dir: 'd', path: [], moving: false, phase: 0, act: null, onArrive: null, emote: 0, say: null};
  spawnNPCs(); spawnAnimals(); FX = []; PENDINGFX = []; hintKey = ''; renderHUD();
}
let started = false;
async function boot(hotData) {
  const bar = $('#loadbar i');
  try {
    await loadWorld(p => { bar.style.width = Math.round(p * 70) + '%'; });
    MAPS = buildMaps();
    const saved = hotData && hotData.S ? hotData.S : await initStore();
    bar.style.width = '85%';
    S = normalize(saved);
    const today = new Date().toISOString().slice(0, 10);
    bar.style.width = '100%';
    startWorld(); resize();
    $('#loading').hidden = true; $('#app').hidden = false; resize();
    setSaveBadge('ok');
    if (!started) {
      started = true; requestAnimationFrame(frame); setInterval(tick, 500);
      setInterval(() => saveNow(), 8000);
      try { new ResizeObserver(resize).observe($('#stage')); } catch (e) { window.addEventListener('resize', resize); }
    }
    initCaps().then(() => {});
    const autoWas = S.auto && S.auto.until > S.last; tick(); if (autoWas && autoSummary()) setTimeout(() => toast(`Auto Farm vẫn chạy khi bạn vắng mặt. Lượt này đã làm: ${autoSummary()}.`, 7000), 1500);
    if (!S.created) openCreator(true);
    else { if (S.daily !== today) { S.daily = today; giveGems(2, 0, 'quà đăng nhập hôm nay'); markDirty(); } showBanner(MAPNOW().en, MAPNOW().vi); toast(Store.mode === 'cloud' ? `Chào mừng trở lại, <b>${esc(S.name)}</b>! Tiến độ đã tải từ tài khoản.` : `Chào mừng trở lại, <b>${esc(S.name)}</b>!`); }
  } catch (e) {
    console.error(e); $('#loadmsg').textContent = 'Không tải được game: ' + (e.message || e);
  }
}
if (location.hostname === '127.0.0.1') window.__vc = () => ({S, P, ANIMS, NPCS, MAPS, view, approach, changeMap, talk, spawnAnimals, onPlot, ex: () => EX, autoSimulate, TW: TRACK_WORDS, NPC_DEFS, readiness, renderHUD, FASHION, HAIR_ITEMS, SPA_ITEMS, spaPreview, chibiSVG, petSVG, hairPreview, fullLook, step: (sec) => { let t = performance.now(); for (let i = 0; i < sec * 20; i++) { t += 50; update(0.05, t); } draw(t); }});
try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => { if (P && S) { S.px = P.x; S.py = P.y; } return {S}; }); } catch (e) {}
const HOT = window.claude && window.claude.hot;
if (HOT && HOT.ready) HOT.ready(boot); else boot((HOT && HOT.data) || {});

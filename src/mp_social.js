/* ===================== SOCIAL ACTIONS between players: hug, high-five, kiss, pillow fight, gifts ===================== */
// Every action needs the other player to accept (an invite card pops up on their screen, 15 s).
// Kiss is only offered between a boy and a girl, as the player asked; everything else works for anyone.
const SOCIAL = {
  hug:     {vi: 'Ôm', en: 'a hug', ask: 'muốn ôm bạn', dur: 2600},
  high5:   {vi: 'Đập tay', en: 'a high five', ask: 'muốn đập tay với bạn', dur: 1800},
  kiss:    {vi: 'Hôn má', en: 'a kiss', ask: 'muốn hôn má bạn', dur: 2800},
  fight:   {vi: 'Đánh gối', en: 'a pillow fight', ask: 'rủ bạn đánh gối', dur: 3200}
};
const GENDER_VI = {m: 'Nam', f: 'Nữ'};
const SOC = {pending: {}, invite: null, lastReq: 0, gifts: {}};
const canKiss = o => S.gender && o.gender && S.gender !== o.gender;

// ---- the player card gets the action buttons
function socialButtons(o) {
  const b = (k, extra = '') => `<button class="btn ${k === 'fight' ? 'ghost' : ''}" data-act="soc-req" data-k="${k}" data-id="${o.uid}" ${extra}>${SOCIAL[k].vi}</button>`;
  const kiss = !S.gender ? `<button class="btn ghost" data-act="soc-gender">Hôn má (chọn giới tính trước)</button>`
    : canKiss(o) ? b('kiss') : '';
  return `<h3 class="ph3">Tương tác</h3><div class="row-btns">${b('hug')}${b('high5')}${kiss}${b('fight')}<button class="btn gold" data-act="soc-gift" data-id="${o.uid}">Tặng quà</button></div>
    <p class="note">Người kia cần bấm đồng ý thì mới diễn ra.${o.gender ? ` ${esc(o.name)} là ${GENDER_VI[o.gender]}.` : ''}</p>`;
}
function socRequest(kind, uid) {
  const o = MP.others[uid]; if (!o || !SOCIAL[kind]) return;
  if (kind === 'kiss' && !canKiss(o)) return;
  if (Date.now() - SOC.lastReq < 4000) { toast('Đợi một chút rồi mời tiếp nhé.'); return; }
  SOC.lastReq = Date.now();
  const rid = Math.random().toString(36).slice(2, 9); SOC.pending[rid] = {kind, uid, t: Date.now()};
  mpCast('req', {to: uid, rid, kind, name: S.name, gender: S.gender || null});
  closeModal(); toast(`Đã gửi lời mời <b>${SOCIAL[kind].vi.toLowerCase()}</b> tới ${esc(o.name)}. Chờ người ấy đồng ý…`);
  setTimeout(() => { if (SOC.pending[rid]) { delete SOC.pending[rid]; toast(`${esc(o.name)} chưa trả lời lời mời.`); } }, 16000);
}
// ---- invite card on the receiver's screen
function showInvite(d) {
  const o = MP.others[d.uid]; if (!o) return;
  if (d.kind === 'kiss' && !canKiss(o)) return mpCast('res', {to: d.uid, rid: d.rid, ok: false});
  SOC.invite = d; clearTimeout(SOC.inviteT);
  let el = $('#invite'); if (!el) { el = document.createElement('div'); el.id = 'invite'; el.className = 'invite'; document.body.appendChild(el); }
  el.hidden = false;
  el.innerHTML = `<img src="${portraitSVG(o.look)}" alt=""><div><b>${esc(o.name)}</b> ${SOCIAL[d.kind].ask}.<div class="row-btns"><button class="btn sm" data-act="soc-yes">Đồng ý</button><button class="btn ghost sm" data-act="soc-no">Từ chối</button></div></div>`;
  sfx('pop');
  SOC.inviteT = setTimeout(() => socAnswer(false), 15000);
}
function socAnswer(ok) {
  const d = SOC.invite; SOC.invite = null; clearTimeout(SOC.inviteT); const el = $('#invite'); if (el) el.hidden = true;
  if (!d) return;
  mpCast('res', {to: d.uid, rid: d.rid, ok});
  if (ok) { const winner = d.kind === 'fight' ? (Math.random() < 0.5 ? d.uid : Store.uid) : null; mpCast('act', {a: d.uid, b: Store.uid, kind: d.kind, winner}); startPair(d.uid, Store.uid, d.kind, winner); }
}
// ---- both players (and everyone nearby) play the animation
function pairEnt(uid) { return uid === Store.uid ? P : MP.others[uid]; }
function startPair(a, b, kind, winner) {
  const A = pairEnt(a), B = pairEnt(b); if (!A || !B) return;
  const t0 = performance.now();
  A.pair = {kind, t0, other: b, winner}; B.pair = {kind, t0, other: a, winner};
  // the one who asked steps up next to the other and they face each other
  if (a === Store.uid) { const side = P.x < B.x ? -1 : 1; P.path = []; P.x = B.x + side * 30; P.y = B.y; }
  if (A !== P) { /* remote: its own client moves it */ }
  const faceEach = (X, Y) => { X.dir = X.x <= Y.x ? 'r' : 'l'; };
  setTimeout(() => { faceEach(A, B); faceEach(B, A); }, 60);
  if (a === Store.uid || b === Store.uid) {
    const other = a === Store.uid ? B : A, nm = other.name || S.name;
    const line = {hug: 'Big hug!', high5: 'High five!', kiss: 'Mwah!', fight: 'Pillow fight!'}[kind];
    P.say = {text: line, t: t0}; speak(line, true);
    setTimeout(() => {
      if (kind === 'fight') { const won = winner === Store.uid; if (won) { S.fightWins = (S.fightWins || 0) + 1; markDirty(); } toast(won ? `Bạn thắng trận đánh gối với <b>${esc(nm)}</b>!` : `<b>${esc(nm)}</b> thắng trận đánh gối này!`); sfx(won ? 'level' : 'pop'); }
      else { S.social = S.social || {}; S.social[kind] = (S.social[kind] || 0) + 1; markDirty(); }
    }, SOCIAL[kind].dur - 300);
  }
}
// frame for a character that is in an interaction
function pairFrame(ent, tnow) {
  const p = ent && ent.pair; if (!p) return null;
  const k = tnow - p.t0, D = SOCIAL[p.kind].dur; if (k > D) { ent.pair = null; return null; }
  if (p.kind === 'hug') return 'hug';
  if (p.kind === 'kiss') return 'kiss';
  if (p.kind === 'high5') return k % 600 < 300 ? 'wave' : 'cheer';
  if (p.kind === 'fight') { if (k > D - 700) return p.winner === (ent === P ? Store.uid : ent.uid) ? 'cheer' : 'dizzy'; return Math.floor(k / 180) % 2 ? 'punch1' : 'punch2'; }
  return null;
}
// effects between the pair (screen space)
function drawPairFx(sx, sy, s, tnow) {
  const seen = new Set();
  for (const e of [P, ...Object.values(MP.others)]) {
    const p = e && e.pair; if (!p) continue;
    const other = p.other === Store.uid ? P : MP.others[p.other]; if (!other) continue;
    const key = [e === P ? Store.uid : e.uid, p.other].sort().join('|'); if (seen.has(key)) continue; seen.add(key);
    const k = (tnow - p.t0) / SOCIAL[p.kind].dur; if (k > 1) continue;
    const mx = sx((e.x + other.x) / 2), my = sy((e.y + other.y) / 2 - 40);
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (p.kind === 'kiss' || p.kind === 'hug') {
      for (let i = 0; i < 6; i++) { const t = (k * 2 + i / 6) % 1, x = mx + Math.sin(i * 2.1 + t * 6) * 14 * s, y = my - t * 40 * s, r = (3 + (i % 3)) * s;
        ctx.globalAlpha = 1 - t; ctx.fillStyle = i % 2 ? '#FF3D8E' : '#FF8FC7'; ctx.beginPath(); ctx.moveTo(x, y + r); ctx.bezierCurveTo(x - 2 * r, y - r * .6, x - r * .6, y - 2 * r, x, y - r * .6); ctx.bezierCurveTo(x + r * .6, y - 2 * r, x + 2 * r, y - r * .6, x, y + r); ctx.fill(); }
    }
    if (p.kind === 'high5') { ctx.globalAlpha = 1 - k; ctx.fillStyle = '#FFE48A'; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ctx.beginPath(); ctx.arc(mx + Math.cos(a) * (6 + k * 26) * s, my - 8 * s + Math.sin(a) * (6 + k * 26) * s, 2.2 * s, 0, Math.PI * 2); ctx.fill(); } }
    if (p.kind === 'fight' && k < 0.8) {
      const words = ['BỤP!', 'POW!', 'BỐP!'], w = words[Math.floor(k * 9) % 3];
      ctx.globalAlpha = 0.9; ctx.font = `900 ${Math.round(11 * s)}px Baloo 2, Nunito, sans-serif`; ctx.lineWidth = 4; ctx.strokeStyle = '#1E1B3A'; ctx.strokeText(w, mx + Math.sin(k * 40) * 8 * s, my - 6 * s); ctx.fillStyle = '#FFE48A'; ctx.fillText(w, mx + Math.sin(k * 40) * 8 * s, my - 6 * s);
      ctx.fillStyle = '#FFFFFF'; for (let i = 0; i < 5; i++) { const a = k * 30 + i; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.ellipse(mx + Math.cos(a) * 16 * s, my + 8 * s + Math.sin(a) * 8 * s, 3 * s, 2 * s, a, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }
}
// ---- gifts: the receiver adds the item and confirms; the sender only pays once the gift has arrived
const GIFT_COINS = [20, 50, 100], GIFT_DAY_CAP = 300;
let GIFT_TO = null;
function openGift(uid) {
  const o = MP.others[uid]; if (!o) return; GIFT_TO = uid;
  const day = new Date().toISOString().slice(0, 10); if (!S.giftDay || S.giftDay.d !== day) S.giftDay = {d: day, coins: 0};
  const items = Object.keys(S.inv).filter(id => S.inv[id] > 0 && ITEM(id)).slice(0, 18);
  openModal(`<h2 class="ptitle">Tặng quà cho ${esc(o.name)}</h2><p class="psub">Chọn món trong túi hoặc tặng xu. Hôm nay bạn còn tặng được ${GIFT_DAY_CAP - S.giftDay.coins} xu.</p>
    <h3 class="ph3">Nông sản và đồ trong túi</h3>${items.length ? `<div class="gifts">${items.map(id => `<button class="row-item" data-act="soc-give" data-k="item" data-v="${id}">${itemImg(id)}<span class="ri-main"><b>${esc(ITEM(id).en)}</b><small>${esc(ITEM(id).vi)} · có ${S.inv[id]}</small></span></button>`).join('')}</div>` : '<p class="empty">Túi đang trống.</p>'}
    <h3 class="ph3">Xu</h3><div class="row-btns">${GIFT_COINS.map(n => `<button class="btn ghost" data-act="soc-give" data-k="coins" data-v="${n}" ${S.coins < n || S.giftDay.coins + n > GIFT_DAY_CAP ? 'disabled' : ''}>${coinIcon}${n}</button>`).join('')}</div>`, {label: 'Tặng quà', wide: true});
}
function sendGift(kind, v) {
  const o = MP.others[GIFT_TO]; if (!o) return closeModal();
  if (kind === 'item' && !(S.inv[v] > 0)) return;
  if (kind === 'coins' && (S.coins < +v || S.giftDay.coins + +v > GIFT_DAY_CAP)) return;
  const gid = Math.random().toString(36).slice(2, 9); SOC.gifts[gid] = {kind, v, to: o.uid, name: o.name};
  mpCast('gift', {to: o.uid, gid, kind, v, name: S.name});
  closeModal(); toast(`Đang gửi quà tới ${esc(o.name)}…`);
  setTimeout(() => { if (SOC.gifts[gid]) { delete SOC.gifts[gid]; toast(`Chưa gửi được quà tới ${esc(o.name)}. Bạn chưa bị trừ gì.`); } }, 8000);
}
function giftLabel(kind, v) { return kind === 'coins' ? `${v} xu` : `1 ${ITEM(v) ? ITEM(v).en : v}`; }
// broadcast events for social actions (called from mpOnMsg)
function mpSocial(ev, d, o) {
  if (d.to !== Store.uid && ev !== 'act') return;
  if (ev === 'req') { if (o) o.gender = d.gender || o.gender; showInvite({uid: d.uid, rid: d.rid, kind: d.kind}); }
  if (ev === 'res') { const p = SOC.pending[d.rid]; if (!p) return; delete SOC.pending[d.rid]; if (!d.ok) toast(`${esc(o ? o.name : 'Người ấy')} đã từ chối lời mời.`); }
  if (ev === 'act') { if (d.a !== Store.uid && d.b !== Store.uid && !MP.others[d.a] && !MP.others[d.b]) return; startPair(d.a, d.b, d.kind, d.winner); }
  if (ev === 'gift') {
    if (d.kind === 'coins') { const n = Math.max(0, Math.min(100, +d.v || 0)); S.coins += n; }
    else if (ITEM(d.v)) S.inv[d.v] = (S.inv[d.v] || 0) + 1; else return;
    mpCast('gift_ok', {to: d.uid, gid: d.gid}); renderHUD(); markDirty(); saveNow();
    sfx('coin'); toast(`🎁 <b>${esc(o ? o.name : d.name)}</b> tặng bạn <b>${esc(giftLabel(d.kind, d.v))}</b>!`, 5000);
    if (o) o.say = {text: 'A gift for you!', t: performance.now()};
  }
  if (ev === 'gift_ok') {
    const g = SOC.gifts[d.gid]; if (!g) return; delete SOC.gifts[d.gid];
    if (g.kind === 'coins') { S.coins -= +g.v; S.giftDay.coins += +g.v; } else S.inv[g.v] = Math.max(0, (S.inv[g.v] || 0) - 1);
    P.say = {text: 'This is for you!', t: performance.now()}; P.emote = performance.now();
    renderHUD(); markDirty(); saveNow(); toast(`Đã tặng <b>${esc(giftLabel(g.kind, g.v))}</b> cho ${esc(g.name)}.`);
  }
}
function askGender(then) {
  openModal(`<h2 class="ptitle">Bạn là nam hay nữ?</h2><p class="psub">Dùng cho tương tác giữa người chơi. Bạn đổi lại được trong Cài đặt.</p><div class="row-btns"><button class="btn" data-act="soc-setg" data-v="m">Nam</button><button class="btn" data-act="soc-setg" data-v="f">Nữ</button></div>`, {label: 'Giới tính'});
}

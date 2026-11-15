/* ===================== MULTIPLAYER: meet other players in public areas (Supabase Realtime: presence + broadcast) ===================== */
// One channel per public map. The farm stays private. Only logged-in Vườn Chữ accounts appear to each other.
const MP_MAPS = ['village', 'park', 'river'];
const MP = {ws: null, ref: 0, topic: null, joinRef: null, joined: false, others: {}, hb: null, retry: 0, sent: {x: 0, y: 0, dir: '', t: 0}, lookKey: '', lastStep: performance.now()};
const BAD_WORDS = /\b(đm|dm|vcl|vkl|địt|dit me|lồn|cặc|đéo|fuck|shit|bitch|dick|cunt)\b/gi;
const cleanText = t => String(t || '').slice(0, 60).replace(BAD_WORDS, m => '*'.repeat(m.length));
const mpOn = () => Store.mode === 'supa' && !!SB.sess && !!Store.uid;
function mpSend(topic, event, payload) { if (MP.ws && MP.ws.readyState === 1) { const ref = String(++MP.ref); MP.ws.send(JSON.stringify({topic, event, payload, ref})); return ref; } return null; }
function mpConnect() {
  if (MP.ws || !mpOn() || typeof WebSocket === 'undefined') return;
  let ws; try { ws = new WebSocket(`${SB.url.replace(/^http/, 'ws')}/realtime/v1/websocket?apikey=${encodeURIComponent(SB.key)}&vsn=1.0.0`); } catch (e) { return; }
  MP.ws = ws;
  ws.onopen = () => { MP.retry = 0; clearInterval(MP.hb); MP.hb = setInterval(() => mpSend('phoenix', 'heartbeat', {}), 25000); MP.topic = null; mpJoin(); };
  ws.onmessage = e => { try { mpOnMsg(JSON.parse(e.data)); } catch (er) {} };
  ws.onclose = () => { clearInterval(MP.hb); MP.ws = null; MP.topic = null; MP.joined = false; MP.others = {}; if (mpOn()) setTimeout(mpConnect, Math.min(30000, 2000 * (++MP.retry))); };
  ws.onerror = () => {};
}
function mpMe() {
  return {uid: Store.uid, name: (S.name || SB.sess.username).slice(0, 16), user: SB.sess.username, look: S.look, cefr: S.cefr || 'A1', track: S.study.track, gender: S.gender || null, x: Math.round(P.x), y: Math.round(P.y), dir: P.dir};
}
// join the channel of the current map (leaving the previous one)
function mpJoin() {
  if (!MP.ws) { mpConnect(); return; }
  const want = mpOn() && MP_MAPS.includes(S.map) ? `realtime:vc-${S.map}` : null;
  if (MP.topic === want) return;
  if (MP.topic) mpSend(MP.topic, 'phx_leave', {});
  MP.topic = want; MP.joined = false; MP.others = {};
  if (want) MP.joinRef = mpSend(want, 'phx_join', {config: {broadcast: {self: false, ack: false}, presence: {key: Store.uid}, private: false}});
}
function mpTrack() { if (MP.joined) { MP.lookKey = JSON.stringify(S.look) + S.name + S.cefr + S.gender; mpSend(MP.topic, 'presence', {type: 'presence', event: 'track', payload: mpMe()}); } }
function mpCast(event, payload) { if (MP.joined) mpSend(MP.topic, 'broadcast', {type: 'broadcast', event, payload: Object.assign({uid: Store.uid}, payload)}); }
function mpUpsert(m) {
  if (!m || !m.uid || m.uid === Store.uid) return;
  const o = MP.others[m.uid] || (MP.others[m.uid] = {uid: m.uid, x: m.x, y: m.y, tx: m.x, ty: m.y, dir: m.dir || 'd', phase: 0, moving: false});
  Object.assign(o, {name: cleanText(m.name) || 'Người chơi', user: m.user, cefr: m.cefr || 'A1', track: m.track, gender: m.gender || null, look: fullLook(m.look || {}), seen: Date.now()});
  if (typeof m.x === 'number') { o.tx = m.x; o.ty = m.y; }
}
function mpOnMsg(msg) {
  const {topic, event, payload, ref} = msg;
  if (topic !== MP.topic) return;
  if (event === 'phx_reply' && ref === MP.joinRef) { if (payload && payload.status === 'ok') { MP.joined = true; mpTrack(); } return; }
  if (event === 'presence_state') { for (const [k, v] of Object.entries(payload || {})) if (v.metas && v.metas[0]) mpUpsert(v.metas[v.metas.length - 1]); return; }
  if (event === 'presence_diff') {
    for (const [k, v] of Object.entries(payload.joins || {})) if (v.metas && v.metas[0]) mpUpsert(v.metas[v.metas.length - 1]);
    for (const k of Object.keys(payload.leaves || {})) if (!(payload.joins || {})[k]) delete MP.others[k];
    return;
  }
  if (event !== 'broadcast' || !payload) return;
  const ev = payload.event, d = payload.payload || {}, o = MP.others[d.uid];
  if (ev === 'mv' && o) { o.tx = d.x; o.ty = d.y; o.dir = d.dir || o.dir; o.seen = Date.now(); }
  if (ev === 'say' && o) { o.say = {text: cleanText(d.text), t: performance.now()}; }
  if (ev === 'emote' && o) { o.emote = performance.now(); o.say = {text: cleanText(d.text || 'Hi!'), t: performance.now()}; }
  if (['req', 'res', 'act', 'gift', 'gift_ok'].includes(ev)) return mpSocial(ev, d, o);
  if ((ev === 'wave' || ev === 'like') && d.to === Store.uid) {
    const who = o ? o.name : cleanText(d.name);
    if (o) o.emote = performance.now();
    if (ev === 'wave') toast(`<b>${esc(who)}</b> vẫy tay chào bạn! 👋`, 4000);
    else { S.likes = (S.likes || 0) + 1; markDirty(); toast(`<b>${esc(who)}</b> khen bộ đồ của bạn đẹp quá!`, 4000); sfx('coin'); }
  }
}
// every 150 ms: send our position when it changed (and a keep-alive every 4 s), re-announce when our look changes
setInterval(() => {
  if (!S || !P) return;
  if (mpOn() && !MP.ws) mpConnect();
  if (!MP.joined) return;
  const now = Date.now(), moved = Math.hypot(P.x - MP.sent.x, P.y - MP.sent.y) > 2 || P.dir !== MP.sent.dir;
  if (moved || now - MP.sent.t > 4000) { mpCast('mv', {x: Math.round(P.x), y: Math.round(P.y), dir: P.dir}); MP.sent = {x: P.x, y: P.y, dir: P.dir, t: now}; }
  if (JSON.stringify(S.look) + S.name + S.cefr + S.gender !== MP.lookKey) mpTrack();
}, 150);
// other players in this area, smoothly following their latest position
function mpList() {
  const now = performance.now(), dt = Math.min(0.1, (now - MP.lastStep) / 1000); MP.lastStep = now;
  const list = [];
  for (const o of Object.values(MP.others)) {
    if (Date.now() - (o.seen || 0) > 45000) { delete MP.others[o.uid]; continue; }
    const dx = o.tx - o.x, dy = o.ty - o.y, d = Math.hypot(dx, dy);
    if (d > 260) { o.x = o.tx; o.y = o.ty; }
    else if (d > 0.5) { const step = Math.min(d, Math.max(70, d * 6) * dt); o.x += dx / d * step; o.y += dy / d * step; }
    o.moving = d > 1.5; if (o.moving) o.phase += dt * 10;
    list.push(o);
  }
  return list;
}
function mpAt(wx, wy) { return Object.values(MP.others).find(o => Math.abs(wx - o.x) < 14 && wy > o.y - 56 && wy < o.y + 6); }
function openPlayer(o) {
  const L = o.look;
  openModal(`<div class="pcard"><img class="pv big" src="${portraitSVG(L, {full: true, hand: true})}" alt=""><div>
    <h2 class="ptitle">${esc(o.name)}</h2><p class="psub">@${esc(o.user || '')} · Trình độ <b>${esc(o.cefr)}</b>${o.track && TRACKS[o.track] ? ' · ' + esc(TRACKS[o.track].vi) : ''}</p>
    <div class="row-btns"><button class="btn" data-act="mp-wave" data-id="${o.uid}">Vẫy tay chào</button><button class="btn gold" data-act="mp-like" data-id="${o.uid}">Khen bộ đồ</button><button class="btn ghost" data-act="mp-go" data-id="${o.uid}">Đi tới</button></div>
    ${socialButtons(o)}
    <p class="note">Nói chuyện bằng ô "Nói tiếng Anh…" ở góc dưới: mọi người trong khu đều thấy bong bóng chat của bạn.</p></div></div>`, {label: 'Người chơi', wide: true});
}
function mpWave(uid) { const o = MP.others[uid]; if (!o) return; P.emote = performance.now(); P.say = {text: `Hi, ${o.name}!`, t: performance.now()}; mpCast('wave', {to: uid, name: S.name}); mpCast('emote', {text: `Hi, ${o.name}!`}); closeModal(); }
function mpLike(uid) { const o = MP.others[uid]; if (!o) return; mpCast('like', {to: uid, name: S.name}); toast(`Đã khen bộ đồ của <b>${esc(o.name)}</b>.`); closeModal(); }
function mpGo(uid) { const o = MP.others[uid]; if (!o) return; closeModal(); const [tx, ty] = tileOf(o.x, o.y); approach(tx, ty, 1.4, null, true); }

/* ===================== GAME ===================== */
const $ = (s, r = document) => r.querySelector(s);
const rand = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = s => { s = Math.max(0, Math.ceil(s)); if (s < 60) return s + ' giây'; if (s < 3600) { const m = Math.floor(s / 60), r = s % 60; return r && m < 10 ? `${m} phút ${r} giây` : `${m} phút`; } const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return m ? `${h} giờ ${m} phút` : `${h} giờ`; };
const wordRe = en => new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
const need = l => 60 + (l - 1) * 45;

const L_ = o => Object.assign({}, DEFAULT_LOOK, o);
const NPC_DEFS = [
  {id:'mai', name:'Cô Mai', map:'village', home:[6, 8], role:'shop', look:L_({skin:0, hairF:'elegant', hairB:'long', hairC:'#1F1B24', top:'top_jacket', topC:'#FF6FB5', bottom:'bot_skirt', bottomC:'#545AF2', face2:'face_round', hand:'hand_sunflower'}),
    greet:['Welcome!','New fashion today!'], line:() => ({en:`Welcome, ${S.name}! What would you like to buy?`, vi:`Chào ${S.name}! Cháu muốn mua gì nào?`})},
  {id:'ba', name:'Chú Ba', map:'village', home:[17, 8], role:'market', look:L_({skin:4, hairF:'regular', hairC:'#1F1B24', beard:'short', top:'top_overalls', topC:'#3DDC84', bottomC:'#8B5A3C', hat:'hat_nonla'}),
    greet:['Fresh vegetables!','I need carrots!'], line:() => ({en:`Hello, ${S.name}! Do you have anything for me?`, vi:`Chào ${S.name}! Cháu có gì cho chú không?`})},
  {id:'tu', name:'Ông Tư', map:'village', home:[28, 8], role:'seeds', look:L_({skin:2, hairF:'elegant', hairC:'#B9BFCC', beard:'long', top:'top_long', topC:'#2DD4BF', bottomC:'#8B5A3C', hat:'hat_cap'}),
    greet:['Seeds for sale!','Plant and grow!'], line:() => ({en:`Good day, ${S.name}. Which seeds do you need?`, vi:`Chào cháu ${S.name}. Cháu cần hạt giống gì?`})},
  {id:'nam', name:'Cô Năm', map:'village', home:[33, 21], role:'forge', look:L_({skin:1, hairF:'chupchik', hairB:'short', hairC:'#9B5CFF', top:'top_sailor', topC:'#9B5CFF', bottom:'bot_skirt', bottomC:'#1F1B24', hat:'hat_witch', hand:'hand_wand', lv:{hand_wand:5, hat_witch:4}}),
    greet:['Upgrade your items!','Shiny gems!'], line:() => ({en:`Hi, ${S.name}! Want to make your items shine?`, vi:`Chào ${S.name}! Muốn nâng cấp đồ cho lấp lánh không?`})},
  {id:'lan', name:'Cô Lan', map:'village', home:[16, 25], role:'teacher', look:L_({skin:0, hairF:'straight', hairB:'long', hairC:'#5B3423', top:'top_aodai', topC:'#FFFFFF', face2:'face_square'}),
    greet:['Good morning!','Practice makes perfect.'], line:() => ({en:`Good morning, ${S.name}! Are you ready for a lesson?`, vi:`Chào buổi sáng ${S.name}! Em sẵn sàng học chưa?`})},
  {id:'na', name:'Bé Na', map:'village', home:[19, 14], role:'chat', wander:true, look:L_({skin:1, hairF:'chupchik', hairB:'curly', hairC:'#FF6B35', top:'top_dress', topC:'#FFC83D', hat:'hat_bunny', pet:'pet_chick', hand:'hand_balloon'}),
    greet:['Hi!',"Let's play!",'I like rabbits!'], line:() => ({en:`Hi, ${S.name}! Can we talk in English?`, vi:`Chào ${S.name}! Mình nói chuyện bằng tiếng Anh nhé?`})},
  {id:'tom', name:'Tom', map:'farm', home:[24, 9], role:'chat', wander:true, look:L_({skin:0, hairF:'straight', hairC:'#FFE994', top:'top_hoodie', topC:'#4D8BFF', bottomC:'#1F1B24', hat:'hat_headphones', back:'back_bag'}),
    greet:['Nice farm!','Hello, neighbor!'], line:() => ({en:`Hello, ${S.name}! I am Tom, your new neighbor.`, vi:`Chào ${S.name}! Mình là Tom, hàng xóm mới của bạn.`})},
  {id:'sau', name:'Ông Sáu', map:'river', home:[15, 19], role:'chat', look:L_({skin:4, hairF:'none', hairC:'#B9BFCC', beard:'middle', top:'top_long', topC:'#8B5A3C', bottomC:'#545AF2', hat:'hat_nonla'}),
    greet:['The fish are hungry today.','Look at the water!'], line:() => ({en:`Hello, young farmer! Tap the water to go fishing.`, vi:`Chào cháu! Chạm vào mặt nước để câu cá nhé.`})}
];
NPC_DEFS.push(
  {id:'ha', name:'Chị Hà', map:'park', home:[18, 16], role:'ielts', look:L_({skin:0, hairF:'elegant', hairB:'long', hairC:'#5B3423', top:'top_jacket', topC:'#545AF2', bottom:'bot_pants', bottomC:'#1F1B24', face2:'face_round', hand:'hand_lollipop'}),
    greet:['IELTS challenge today!','Band 7, here we come!'], line:() => ({en:`Hi ${S.name}! Ready for today's IELTS challenge?`, vi:`Chào ${S.name}! Sẵn sàng làm thử thách IELTS hôm nay chưa?`})},
  {id:'bao', name:'Anh Bảo', map:'park', home:[10, 11], role:'chat', wander:true, look:L_({skin:3, hairF:'straight', hairC:'#1F1B24', top:'top_hoodie', topC:'#FF6B35', bottom:'bot_shorts', bottomC:'#1F1B24', hat:'hat_cap', pet:'pet_puppy'}),
    greet:['Morning run!','Nice weather today.'], line:() => ({en:`Hey ${S.name}! Do you jog in the park too?`, vi:`Chào ${S.name}! Bạn cũng chạy bộ trong công viên à?`})},
  {id:'ngan', name:'Chị Ngân', map:'village', home:[8, 23], role:'salon', look:L_({skin:1, hairF:'elegant', hairB:'long', hairC:'#FF8FC7', top:'top_cardigan', topC:'#B05CFF', bottom:'bot_pleated', bottomC:'#1F1B24', face2:'face_star', hand:'hand_fan'}),
    greet:['New hairstyles!','Try a new look!'], line:() => ({en:`Hi ${S.name}! Which hairstyle would you like today?`, vi:`Chào ${S.name}! Hôm nay em muốn làm kiểu tóc nào?`})}
);
const fullLook = L => Object.assign({}, DEFAULT_LOOK, L || {}, {lv: Object.assign({}, (L && L.lv) || {})});

/* ===================== STATE & ACCOUNT ===================== */
let S = null, MAPS = null, TERRAIN = {};
const LOCAL_KEY = 'vuon-chu-save-v3';
const Store = {db: null, user: null, uid: null, mode: 'local', saving: false, dirty: false, lastPublic: 0};
function newGame() {
  const now = Date.now();
  const plots = Array.from({length: 24}, (_, i) => ({u: i < 8, c: null, p: 0, w: 0, weed: false, hw: false}));
  Object.assign(plots[0], {c: 'carrot', p: 1}); Object.assign(plots[1], {c: 'radish', p: 0.4, w: now + 20000}); Object.assign(plots[2], {c: 'carrot', p: 0.25});
  return {v: 4, created: false, name: '', look: fullLook(DEFAULT_LOOK), owned: [...FREE_ITEMS], map: 'farm', px: 0, py: 0,
    coins: 80, em: 4, di: 1, daily: '', xp: 0, lvl: 3, plots, animals: [{t: 'chicken', st: 'hungry', r: 0}, ...Array(17).fill(null)], barnLv: 0, keys: 1, pity: 0,
    cefr: 'A1', hair: [], lvAns: 0, seeds: {carrot: 6, radish: 4}, inv: {}, m: {}, orders: [], streak: 0, best: 0, stats: {ok: 0, all: 0, talks: 0, fish: 0},
    study: {track: 'general', level: 'A1', unlocked: ['A1']}, sound: true, last: now, caught: false};
}
async function initStore() {
  sbInit();
  // 1. a Vườn Chữ account session (web, app, or the Claude page after logging in)
  if (SB.sess) { try { return await sbLoadState(); } catch (e) { console.warn(e); sbSetSess(null); Store.mode = 'local'; } }
  // 2. on the web / in the app: ask to log in or create an account first
  if (!inClaude()) {
    if ((await authGate()) === 'supa') { try { const st = await sbLoadState(); if (st) return st; Store.dirty = true; } catch (e) { console.warn(e); Store.mode = 'local'; } }
    try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  try {
    const c = window.claude;
    if (c && c.use) {
      const [db, user] = await Promise.all([c.use('db'), c.use('user')]);
      Store.db = db; Store.user = user;
      if (user) Store.uid = await user.id();
    }
  } catch (e) { console.warn(e); }
  if (Store.db && Store.uid) {
    try {
      const snap = await Store.db.doc(`data/users/${Store.uid}/save`).get();
      Store.mode = 'cloud';
      if (snap.exists) return JSON.parse(JSON.stringify(snap.data().state || null));
      return null;
    } catch (e) { console.warn(e); Store.mode = 'local'; }
  }
  try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}
function markDirty() { Store.dirty = true; }
async function saveNow(force) {
  if (!S || (!Store.dirty && !force)) return;
  if (P) { S.px = P.x; S.py = P.y; }
  Store.dirty = false;
  if (Store.mode === 'supa') {
    if (Store.saving) { Store.dirty = true; return; }
    Store.saving = true;
    try { await sbSave(force); setSaveBadge('ok'); } catch (e) { console.warn(e); Store.offline = true; Store.dirty = true; setSaveBadge('err'); if (e && e.status === 401) { sbSetSess(null); Store.mode = 'local'; toast('Phiên đăng nhập đã hết, hãy đăng nhập lại trong Cài đặt.'); } }
    finally { Store.saving = false; }
    return;
  }
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(S)); } catch (e) {}
  if (Store.mode !== 'cloud' || Store.saving) { if (Store.saving) Store.dirty = true; return; }
  Store.saving = true;
  try {
    await Store.db.doc(`data/users/${Store.uid}/save`).set({state: S, savedAt: Date.now()});
    if (Date.now() - Store.lastPublic > 60000 || force) await publishProfile();
    setSaveBadge('ok');
  } catch (e) {
    console.warn(e); setSaveBadge(e && e.code === 'invalid_argument' ? 'denied' : 'err');
    if (e && e.code === 'invalid_argument') Store.mode = 'local';
  } finally { Store.saving = false; }
}
async function publishProfile() {
  if (Store.mode !== 'cloud' || !S.created) return;
  Store.lastPublic = Date.now();
  try {
    await Store.db.doc(`players/${Store.uid}`).set({name: S.name.slice(0, 16), lvl: lvIdx() + 1, xp: S.xp, words: Object.values(S.m).filter(r => r.m >= 4).length, look: S.look, track: S.study.track, level: S.study.level, updated: Date.now()});
  } catch (e) { console.warn('profile', e); }
}
function setSaveBadge(s) {
  const b = $('#savebadge'); if (!b) return;
  b.dataset.state = s;
  b.textContent = Store.mode === 'supa' ? (s === 'err' ? 'Chưa gửi được lên máy chủ, sẽ tự thử lại' : 'Đã đồng bộ với tài khoản') : Store.mode === 'cloud' ? (s === 'err' ? 'Chưa lưu được, sẽ thử lại' : 'Đã lưu vào tài khoản') : (s === 'denied' ? 'Chỉ lưu trên máy này' : 'Lưu trên máy này');
}

/* ===================== SOUND & SPEECH ===================== */
let AC = null;
function sfx(kind) {
  if (!S || !S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = {ok:[[660,0],[880,.09]], bad:[[260,0],[196,.12]], coin:[[988,0],[1319,.06]], pop:[[520,0],[700,.05]], water:[[540,0],[640,.05],[760,.1]], level:[[523,0],[659,.1],[784,.2],[1047,.3]], bite:[[880,0],[880,.12]], step:[[200,0]]}[kind] || [[440,0]];
    const t = AC.currentTime;
    for (const [f, d] of seq) { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.07, t + d + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.16); o.connect(g).connect(AC.destination); o.start(t + d); o.stop(t + d + 0.18); }
  } catch (e) {}
}
const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let enVoice = null;
function pickVoice() { if (!canSpeak) return; try { const vs = speechSynthesis.getVoices(); enVoice = vs.find(v => /^en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; } catch (e) {} }
if (canSpeak) { pickVoice(); try { speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) {} }
const voiceOK = () => canSpeak && !!enVoice;
function speak(text, quiet) {
  if (!canSpeak) { if (!quiet) toast('Trình duyệt này chưa đọc được tiếng Anh.'); return; }
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.88; if (enVoice) u.voice = enVoice; speechSynthesis.speak(u); } catch (e) {}
}

/* ===================== UI PRIMITIVES ===================== */
function toast(html, ms = 2800) {
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = html;
  const box = $('#toasts'); box.appendChild(el); while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => el.remove(), ms);
}
let modalClose = null;
const modalOpen = () => !!$('#modal').firstChild;
function openModal(html, opts = {}) {
  if (modalClose) { const f = modalClose; modalClose = null; try { f(); } catch (e) {} }
  stopTimer(); Q = null; PH = null; BUY = null;
  $('#modal').innerHTML = `<div class="overlay" ${opts.noClose ? '' : 'data-act="close-bg"'}><div class="panel ${opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(opts.label || 'Hộp thoại')}">${opts.noClose ? '' : '<button class="pclose" data-act="close" aria-label="Đóng">×</button>'}${html}</div></div>`;
  modalClose = opts.onClose || null;
  hydratePortraits($('#modal'));
  const f = $('#modal .panel button:not(.pclose):not(:disabled), #modal .panel input'); if (f) f.focus({preventScroll: true});
}
function closeModal() {
  const f = modalClose; modalClose = null; stopTimer(); Q = null; PH = null; BUY = null; CURNPC = null;
  $('#modal').innerHTML = ''; if (f) try { f(); } catch (e) {}
  flushFx(); renderHUD(); markDirty();
}
const sayBtn = (t, label) => `<button class="say" data-say="${esc(t)}" aria-label="Nghe: ${esc(t)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z" fill="currentColor"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.6a6 6 0 0 1 0 8.8" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>${label ? `<span>${label}</span>` : ''}</button>`;
const coinIcon = '<i class="ico coin" aria-hidden="true"></i>';
const gemIcon = k => `<i class="ico ${k}" aria-hidden="true"></i>`;

/* item icons (flat vector) */
function iconURL(id) { return produceSVG(id); }
const itemImg = (id, cls = 'ii') => `<img class="${cls}" src="${iconURL(id)}" alt="">`;

/* ===================== LEARNING ENGINE ===================== */
function studyPool() {
  const {track, level} = S.study, li = LEVELS.indexOf(level);
  const cur = [], low = [];
  const add = (arr, list) => { if (list) arr.push(...list); };
  add(cur, TRACK_WORDS.general[level]);
  if (track !== 'general') add(cur, TRACK_WORDS[track][level]);
  for (let i = 0; i < li; i++) { add(low, TRACK_WORDS.general[LEVELS[i]]); if (track !== 'general') add(low, TRACK_WORDS[track][LEVELS[i]]); }
  if (track !== 'general' && !TRACK_WORDS[track][level] && li < 2) add(low, (TRACK_WORDS[track].A2 || TRACK_WORDS[track].B1).slice(0, 5));
  return {cur, low};
}
let Q = null, lastWord = '', qTimer = null;
function stopTimer() { if (qTimer) { clearInterval(qTimer); qTimer = null; } }
function pickWord() {
  const {cur, low} = studyPool();
  const pool = (low.length && Math.random() < 0.25) ? low : cur;
  let tot = 0;
  const ws = pool.map(w => { const r = S.m[w.key]; let x = 6 - (r ? r.m : 0); if (!r) x += 2; if (r && r.w) x *= 2.5; if (w.key === lastWord) x = 0.01; tot += x; return x; });
  let r = Math.random() * tot;
  for (let i = 0; i < pool.length; i++) { r -= ws[i]; if (r <= 0) return pool[i]; }
  return pool[pool.length - 1];
}
function distractors(w, n) {
  const same = [...(TRACK_WORDS[w.track][w.level] || [])].filter(x => x.en !== w.en && x.vi !== w.vi);
  const more = studyPool().cur.filter(x => x.en !== w.en && x.vi !== w.vi && !same.includes(x));
  return shuffle(same).concat(shuffle(more)).slice(0, n);
}
function pickType(w, forced) {
  if (forced) return forced;
  const m = S.m[w.key] ? S.m[w.key].m : 0, t = ['en2vi', 'vi2en'];
  if (m >= 1) { t.push('fill'); if (voiceOK()) t.push('listen'); }
  if (m >= 2) { t.push('spell', 'fill'); if (voiceOK()) t.push('listen'); }
  if (w.syn) t.push('syn', 'syn');
  return rand(t);
}
function startQuiz(opt) {
  const w = opt.word || pickWord(); lastWord = w.key;
  let type = pickType(w, opt.type);
  if (opt.timer && type === 'spell') type = 'vi2en';
  if (type === 'spell' && !/^[a-z]+$/.test(w.en)) type = 'vi2en';
  if (type === 'fill' && !wordRe(w.en).test(w.ex)) type = 'vi2en';
  const q = {w, type, opt, done: false};
  if (type === 'spell') {
    const m = S.m[w.key] ? S.m[w.key].m : 0; let letters = w.en.split('');
    if (m >= 3) letters = letters.concat(shuffle('aeioustrnl'.split('').filter(ch => !w.en.includes(ch))).slice(0, 2));
    q.tiles = shuffle(letters).map(ch => ({ch, used: false})); q.ans = [];
  } else {
    if (type === 'syn') { const others = shuffle(Object.values(WORDS).filter(x => x.syn && x.syn !== w.syn && x.en !== w.syn)).slice(0, 3).map(x => x.syn); q.options = shuffle([w.syn, ...others]); q.correct = w.syn; }
    else { const key = type === 'en2vi' ? 'vi' : 'en'; q.options = shuffle([w, ...distractors(w, 3)]).map(x => x[key]); q.correct = w[key]; }
  }
  openModal(quizHTML(q), {label: opt.tag, onClose: opt.onClose});
  Q = q;
  if (type === 'spell') renderSpell();
  if (type === 'listen') setTimeout(() => speak(w.en, true), 220);
  if (opt.timer) {
    const end = Date.now() + opt.timer * 1000;
    qTimer = setInterval(() => {
      const left = end - Date.now(), bar = $('#q-timer i'); if (bar) bar.style.width = clamp(left / (opt.timer * 1000) * 100, 0, 100) + '%';
      if (left <= 0 && Q && !Q.done) { stopTimer(); document.querySelectorAll('#modal .opt').forEach((b, k) => { b.disabled = true; if (Q.options[k] === Q.correct) b.classList.add('right'); }); finish(false, true); }
    }, 100);
  }
}
function quizHTML(q) {
  const {w, type, opt} = q; let p = '';
  if (type === 'syn') p = `<p class="q-ask">Paraphrase: chọn từ đồng nghĩa gần nhất (dạng hay gặp trong IELTS)</p><div class="q-word">${esc(w.en)} ${sayBtn(w.en)}</div><div class="q-sent">${esc(w.ex)}</div>`;
  if (type === 'en2vi') p = `<p class="q-ask">Từ này nghĩa là gì?</p><div class="q-word">${esc(w.en)} ${sayBtn(w.en)}</div>`;
  if (type === 'vi2en') p = `<p class="q-ask">Chọn từ tiếng Anh có nghĩa là</p><div class="q-word vi">${esc(w.vi)}</div>`;
  if (type === 'listen') p = `<p class="q-ask">Nghe và chọn từ bạn vừa nghe</p><div class="q-word">${sayBtn(w.en, 'Nghe lại')}</div>`;
  if (type === 'fill') p = `<p class="q-ask">Điền từ còn thiếu <span class="hint">(gợi ý: ${esc(w.vi)})</span></p><div class="q-sent">${esc(w.ex.replace(wordRe(w.en), '_____'))}</div>`;
  if (type === 'spell') p = `<p class="q-ask">Xếp chữ thành từ tiếng Anh có nghĩa là</p><div class="q-word vi">${esc(w.vi)}</div><div class="spell-slots" id="q-slots"></div><div class="tiles" id="q-tiles"></div><div class="row-btns"><button class="btn ghost sm" data-act="sp-del">Xoá chữ cuối</button>${sayBtn(w.en, 'Gợi ý: nghe từ')}</div>`;
  const opts = type === 'spell' ? '' : `<div class="opts">${q.options.map((o, i) => `<button class="opt" data-opt="${i}"><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div>`;
  const tr = TRACKS[w.track];
  return `<div class="q-head"><span class="q-tag">${esc(opt.tag)}</span><span class="q-meta">${esc(tr.vi)} · ${w.level}</span></div>${opt.timer ? '<div class="q-timer" id="q-timer"><i></i></div>' : ''}${p}${opts}<div id="q-fb" class="q-fb" aria-live="polite"></div>`;
}
function renderSpell() {
  const n = Q.w.en.length;
  $('#q-slots').innerHTML = Array.from({length: n}, (_, i) => { const t = Q.ans[i]; return `<span class="${t != null ? 'f' : ''}" ${t != null && !Q.done ? 'data-act="sp-del"' : ''}>${t != null ? esc(Q.tiles[t].ch) : ''}</span>`; }).join('');
  $('#q-tiles').innerHTML = Q.tiles.map((t, i) => `<button class="tile" data-tile="${i}" ${t.used || Q.done ? 'disabled' : ''} aria-label="Chữ ${esc(t.ch)}">${esc(t.ch)}</button>`).join('');
}
function tapTile(i) {
  if (!Q || Q.done || Q.type !== 'spell') return; const t = Q.tiles[i]; if (!t || t.used) return;
  t.used = true; Q.ans.push(i); sfx('pop'); renderSpell();
  if (Q.ans.length === Q.w.en.length) { const ok = Q.ans.map(k => Q.tiles[k].ch).join('') === Q.w.en; $('#q-slots').classList.add(ok ? 'right' : 'wrong'); finish(ok); }
}
function spellDel() { if (!Q || Q.done || Q.type !== 'spell' || !Q.ans.length) return; Q.tiles[Q.ans.pop()].used = false; renderSpell(); }
function choose(i) {
  if (!Q || Q.done || Q.type === 'spell' || i >= Q.options.length) return;
  const ok = Q.options[i] === Q.correct;
  document.querySelectorAll('#modal .opt').forEach((b, k) => { b.disabled = true; if (Q.options[k] === Q.correct) b.classList.add('right'); else if (k === i) b.classList.add('wrong'); });
  finish(ok);
}
function record(w, ok) {
  const r = S.m[w.key] || (S.m[w.key] = {m: 0, s: 0, w: 0}); r.s++; S.stats.all++;
  if (ok) { r.m = Math.min(5, r.m + 1); r.w = 0; S.stats.ok++; S.streak++; S.best = Math.max(S.best, S.streak); addXP(5); if (S.streak % 5 === 0) { S.coins += 10; giveGems(1, S.streak % 20 === 0 ? 1 : 0, `chuỗi ${S.streak} câu đúng`); } }
  else { r.m = Math.max(0, r.m - 1); r.w = 1; S.streak = 0; }
  lvNoteAnswer();
}
function finish(ok, timeout) {
  stopTimer(); Q.done = true; const w = Q.w;
  record(w, ok); sfx(ok ? 'ok' : 'bad');
  const msg = Q.opt.onResult ? (Q.opt.onResult(ok) || '') : '';
  if (Q.type === 'spell') renderSpell();
  const ex = esc(w.ex).replace(wordRe(w.en), m => `<mark>${m}</mark>`);
  $('#q-fb').innerHTML = `<div class="fb ${ok ? 'good' : 'miss'}"><strong>${ok ? rand(['Chính xác!','Giỏi lắm!','Đúng rồi!','Tuyệt!']) : timeout ? 'Hết giờ!' : 'Chưa đúng'}</strong> ${ok ? '' : `Đáp án là <b>${esc(w.en)}</b>. `}${msg}</div>
    <div class="card-word"><div class="cw-top"><span class="cw-en">${esc(w.en)}</span>${sayBtn(w.en)}<span class="cw-vi">${esc(w.vi)}</span></div><p class="cw-ex">${ex} ${sayBtn(w.ex)}</p></div>
    <div class="row-btns"><button class="btn" data-act="${Q.opt.next ? 'q-next' : 'close'}" id="q-next">${Q.opt.next ? 'Câu tiếp theo' : 'Tiếp tục'}</button></div>`;
  $('#q-next').focus({preventScroll: true}); renderHUD(); markDirty();
}

/* ===================== PROGRESSION ===================== */
function addXP(n) {
  S.xp += n;
  // the character has no XP level any more: the English level (S.cefr) is its level
}
const unlockedCrops = () => CROPS.filter(c => c.lvl <= S.lvl && !c.rare);
const unlockCost = () => 40 * (S.plots.filter(p => p.u).length - 7);
function availItems() {
  const items = unlockedCrops().map(c => c.id);
  for (const a of S.animals) if (a) items.push(ANIMAL[a.t].product);
  if (S.caught) items.push('fish');
  return [...new Set(items)];
}
function genOrder(pool) {
  const av = shuffle(pool || availItems()), k = av.length > 2 && Math.random() < 0.5 ? 2 : 1;
  const items = av.slice(0, k).map(id => ({id, n: 1 + Math.floor(Math.random() * (ITEM(id).sell > 50 ? 2 : 3))}));
  const val = items.reduce((s, it) => s + ITEM(it.id).sell * it.n, 0);
  return {id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), who: rand(NAMES), items, coins: Math.round(val * 1.5), xp: 6 + items.reduce((s, it) => s + it.n * 3, 0)};
}
const phrase = it => it.n === 1 ? ITEM(it.id).one : `${it.n} ${ITEM(it.id).pl}`;
const orderLine = o => `Hi! Can I have ${o.items.map(phrase).join(' and ')}, please?`;

/* ===================== WORLD RUNTIME ===================== */
let P = null, NPCS = [], ANIMS = [], FX = [], PENDINGFX = [], tapMark = null;
const cv = document.getElementById('world'), ctx = cv.getContext('2d');
let view = {cssW: 800, cssH: 500, s: 2, dpr: 1, camX: 0, camY: 0};
const MAPNOW = () => MAPS[S.map];
const walkable = (m, x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && !m.block[y * m.w + x];
const tileOf = (x, y) => [Math.floor(x / TS), Math.floor(y / TS)];
const center = (tx, ty) => ({x: tx * TS + 16, y: ty * TS + 24});
const dirTo = (x1, y1, x2, y2) => Math.abs(x2 - x1) > Math.abs(y2 - y1) ? (x2 > x1 ? 'r' : 'l') : (y2 > y1 ? 'd' : 'u');
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
function bfs(m, sx, sy) {
  const N = m.w * m.h, dist = new Int16Array(N).fill(-1), prev = new Int32Array(N).fill(-1);
  if (!walkable(m, sx, sy)) return {dist, prev};
  const q = [sy * m.w + sx]; dist[q[0]] = 0;
  for (let h = 0; h < q.length; h++) { const c = q[h], x = c % m.w, y = (c / m.w) | 0;
    for (const [dx, dy] of DIRS4) { const nx = x + dx, ny = y + dy; if (!walkable(m, nx, ny)) continue; const n = ny * m.w + nx; if (dist[n] >= 0) continue; dist[n] = dist[c] + 1; prev[n] = c; q.push(n); } }
  return {dist, prev};
}
function pathTo(m, prev, goal) { const out = []; let c = goal; while (c >= 0 && prev[c] >= 0) { out.unshift(center(c % m.w, (c / m.w) | 0)); c = prev[c]; } return out; }
function approach(tx, ty, range, cb, avoid) {
  if (modalOpen()) return;
  if (P.act && P.act.kind === 'fish') P.act = null;
  const m = MAPNOW(); let [sx, sy] = tileOf(P.x, P.y);
  if (!walkable(m, sx, sy)) [sx, sy] = m.spawn;
  const {dist, prev} = bfs(m, sx, sy);
  let best = -1, bd = 1e9, bl = 1e9;
  for (let i = 0; i < dist.length; i++) { if (dist[i] < 0) continue; const d = Math.hypot(i % m.w - tx, ((i / m.w) | 0) - ty); if (avoid && d < 0.5) continue; if (d < bd - 1e-6 || (Math.abs(d - bd) < 1e-6 && dist[i] < bl)) { best = i; bd = d; bl = dist[i]; } }
  if (best < 0) return;
  if (cb && bd > range) { toast('Không đến gần chỗ đó được.'); cb = null; }
  P.path = pathTo(m, prev, best);
  P.onArrive = cb ? () => { P.dir = dirTo(P.x, P.y, tx * TS + 16, ty * TS + 16); cb(); } : null;
  if (!P.path.length) arrive();
}
function arrive() {
  const m = MAPNOW(), [tx, ty] = tileOf(P.x, P.y);
  const ex = m.exits.find(e => tx >= e.x && tx < e.x + e.w && ty >= e.y && ty < e.y + e.h);
  const cb = P.onArrive; P.onArrive = null;
  if (ex) return changeMap(ex.to, ex.tx, ex.ty);
  if (cb) cb();
}
function changeMap(to, tx, ty) {
  S.map = to; const c = center(tx, ty); P.x = c.x; P.y = c.y; P.path = []; P.act = null; P.dir = tx < 3 ? 'r' : 'l';
  spawnNPCs(); FX = []; renderHUD(); markDirty();
  const M = MAPS[to]; showBanner(M.en, M.vi); speak(M.en, true);
}
function spawnNPCs() {
  NPCS = NPC_DEFS.filter(d => d.map === S.map).map(d => { const c = center(d.home[0], Math.min(d.home[1], MAPS[d.map].h - 2)); const look = fullLook(d.look); return {def: d, look, x: c.x, y: c.y, dir: 'd', path: [], wait: 1 + Math.random() * 3, phase: 0, talking: false, bubble: null}; });
}
function spawnAnimals() {
  const pen = MAPS.farm.pen;
  ANIMS = S.animals.map((a, i) => a ? (ANIMS[i] && ANIMS[i].t === a.t ? ANIMS[i] : {t: a.t, x: pen.x0 + 30 + (i % 6) * 78, y: pen.y0 + 20 + Math.floor(i / 6) * 66, tx: 0, ty: 0, wait: Math.random() * 3, dir: i % 2 ? 'l' : 'r', phase: 0}) : null);
}
function queueFx(f) { if (modalOpen()) PENDINGFX.push(f); else startFx(f); }
function startFx(f) { if (f.act) { P.act = {kind: f.act, t0: performance.now(), dur: 900}; return; } f.t0 = performance.now(); FX.push(f); }
function flushFx() { const l = PENDINGFX; PENDINGFX = []; l.forEach(startFx); }

/* ===================== FARM ACTIONS ===================== */
function plotState(p, now) { if (!p.u) return 'L'; if (!p.c) return 'E'; if (p.weed) return 'W'; if (p.p >= 1) return 'R'; return now < p.w ? 'G' : 'D'; }
const plotCenter = i => { const [x, y] = MAPS.farm.plots[i]; return {x: x * TS + 16, y: y * TS + 8}; };
function onPlot(i) {
  const p = S.plots[i], now = Date.now(), st = plotState(p, now), pc = plotCenter(i);
  if (st === 'L') return openUnlock(i);
  if (st === 'E') return openPlant(i);
  const c = CROP[p.c];
  if (st === 'W') return startQuiz({tag: 'Nhổ cỏ dại', onResult: ok => {
    if (!ok) return 'Cỏ vẫn còn. Chạm vào ô đất để thử câu khác.';
    p.weed = false; queueFx({act: 'hoe'}); queueFx({kind: 'text', ...pc, text: 'Clean!', color: '#ffffff'}); return 'Đã nhổ sạch cỏ, cây lớn tiếp.';
  }});
  if (st === 'R') return startQuiz({tag: `Thu hoạch ${c.en}`, type: 'spell', word: harvestWord(), onResult: ok => {
    const n = ok ? 2 : 1; S.inv[c.id] = (S.inv[c.id] || 0) + n; addXP(ok ? c.xp : Math.ceil(c.xp / 2));
    Object.assign(p, {c: null, p: 0, w: 0, weed: false, hw: false, f: 0});
    queueFx({act: 'harvest'}); queueFx({kind: 'text', ...pc, text: `+${n} ${n > 1 ? c.pl : c.en}`, color: '#ffe38a'}); sfx('coin');
    return ok ? `Thu hoạch được ${n} ${c.pl}, gấp đôi nhờ đánh vần đúng.` : `Bạn vẫn thu được 1 ${c.en}. Đánh vần đúng sẽ được gấp đôi.`;
  }});
  if (st === 'D') return startQuiz({tag: `Tưới nước cho ${c.en}`, onResult: ok => {
    if (!ok) return 'Cây chưa được tưới. Chạm vào ô đất để thử câu khác.';
    p.w = Date.now() + c.time * 550; sfx('water'); queueFx({act: 'water'}); queueFx({kind: 'drops', ...pc}); return 'Đã tưới nước, cây đang lớn.';
  }});
  speak(c.en, true); return openPlotMenu(i);
  const growLeft = (1 - p.p) * c.time, wetLeft = (p.w - now) / 1000;
  toast(growLeft <= wetLeft ? `<b>${c.en}</b> (${c.vi}) sẽ chín sau ${fmt(growLeft)}.` : `<b>${c.en}</b> (${c.vi}) đang lớn, sẽ khát nước sau ${fmt(wetLeft)}.`);
}
function harvestWord() { // a short word that can be spelled
  for (let k = 0; k < 12; k++) { const w = pickWord(); if (/^[a-z]+$/.test(w.en) && w.en.length <= 11) return w; }
  return pickWord();
}
function openPlotMenu(i) {
  const p = S.plots[i], c = CROP[p.c], now = Date.now(), left = (1 - p.p) * c.time, wet = Math.max(0, (p.w - now) / 1000);
  const fert = p.f || 0, man = S.inv.manure || 0;
  openModal(`<div class="plotcard"><img class="pv" src="${produceSVG(c.id)}" alt=""><div><h2 class="ptitle">${esc(c.en)} <small>${esc(c.vi)}</small></h2>
    <div class="growbar"><i style="width:${Math.round(p.p * 100)}%"></i></div><p class="note">Còn khoảng <b>${fmt(left)}</b> nữa là chín. ${wet > 0 ? `Đất còn ẩm ${fmt(wet)}.` : '<b>Đất đang khô</b>, cây ngừng lớn.'}</p></div></div>
    <div class="row-btns"><button class="btn" data-act="fert-q" data-p="${i}" ${fert >= 3 ? 'disabled' : ''}>Bón phân bằng 1 câu hỏi (-25% thời gian) · còn ${3 - fert} lượt</button>
    <button class="btn gold" data-act="fert-m" data-p="${i}" ${man ? '' : 'disabled'}>Dùng phân trâu (-50%) · có ${man}</button></div>
    <p class="note">Phân trâu lấy từ con trâu trong chuồng. Cây trồng lâu như ngoài đời, quay lại sau vài giờ là có thu hoạch.</p>`, {label: 'Ô ruộng'});
}
function fertilize(i, useManure) {
  const p = S.plots[i]; if (!p || !p.c || p.p >= 1) return;
  if (useManure) { if (!(S.inv.manure > 0)) return; S.inv.manure--; p.p = Math.min(1, p.p + (1 - p.p) * 0.5); closeModal(); sfx('water'); queueFx({kind: 'spark', ...plotCenter(i)}); toast('Đã bón phân trâu, cây lớn nhanh gấp đôi.'); markDirty(); return; }
  if ((p.f || 0) >= 3) return;
  startQuiz({tag: 'Bón phân', onResult: ok => { if (!ok) return 'Chưa bón được. Thử câu khác nhé.'; p.f = (p.f || 0) + 1; p.p = Math.min(1, p.p + (1 - p.p) * 0.25); queueFx({act: 'hoe'}); queueFx({kind: 'spark', ...plotCenter(i)}); return 'Đã bón phân, thời gian chờ giảm 25%.'; }});
}
function openPlant(i) {
  const have = CROPS.filter(c => (S.seeds[c.id] || 0) > 0);
  if (!have.length) return openFarmShop('seeds');
  const rows = `<button class="row-item" data-act="farmshop" data-t="seeds"><span class="ii plus">+</span><span class="ri-main"><b>Mua thêm hạt giống</b><small>Mở cửa hàng nông trại</small></span></button>` + have.map(c => `<button class="row-item" data-act="plant" data-p="${i}" data-crop="${c.id}">${itemImg(c.id)}<span class="ri-main"><b>${c.en}</b><small>${c.vi} · chín sau ${fmt(c.time)}</small></span><span class="ri-side">còn ${S.seeds[c.id]} hạt</span></button>`).join('');
  openModal(`<h2 class="ptitle">Gieo hạt</h2><p class="psub">Chọn hạt giống trong túi để gieo vào ô đất này.</p><div class="list">${rows}</div>`, {label: 'Gieo hạt'});
}
function plant(i, id) {
  const p = S.plots[i], c = CROP[id]; if (!p || p.c || !c || !(S.seeds[id] > 0)) return;
  S.seeds[id]--; Object.assign(p, {c: id, p: 0, w: 0, weed: false, hw: false});
  closeModal(); sfx('pop'); speak(c.en, true); queueFx({act: 'hoe'}); queueFx({kind: 'text', ...plotCenter(i), text: c.en, color: '#ffffff'});
  toast(`Đã gieo <b>${c.en}</b>. Chạm vào ô đất để tưới nước.`); renderHUD(); markDirty();
}
function openUnlock(i) {
  const cost = unlockCost();
  openModal(`<h2 class="ptitle">Mở rộng ruộng</h2><p class="psub">Thêm một ô đất để trồng nhiều cây hơn cùng lúc.</p><div class="row-btns"><button class="btn" data-act="unlock" data-p="${i}" ${S.coins < cost ? 'disabled' : ''}>Mở ô đất (${cost} xu)</button><button class="btn ghost" data-act="close">Để sau</button></div>${S.coins < cost ? `<p class="note">Bạn cần thêm ${cost - S.coins} xu. Giao đơn hàng cho Chú Ba ở chợ để kiếm xu.</p>` : ''}`, {label: 'Mở rộng ruộng'});
}
function unlock(i) { const cost = unlockCost(), p = S.plots[i]; if (!p || p.u || S.coins < cost) return; S.coins -= cost; p.u = true; closeModal(); sfx('coin'); toast('Đã mở thêm một ô đất.'); }
function onAnimal(i) {
  const a = S.animals[i], now = Date.now(); if (!a) return;
  const A = ANIMAL[a.t], P2 = PRODUCTS[A.product], ent = ANIMS[i];
  if (a.st === 'hungry') return startQuiz({tag: `Cho ${A.en} ăn`, onResult: ok => {
    if (!ok) return `${A.en} vẫn còn đói. Chạm vào con vật để thử câu khác.`;
    a.st = 'producing'; a.r = Date.now() + A.time * 1000; if (ent) { ent.eat = performance.now(); queueFx({kind: 'text', x: ent.x, y: ent.y - 30, text: 'Yum!', color: '#ffffff'}); }
    return `${A.en} đã no, sẽ cho ${P2.one} sau ${fmt(A.time)}.`;
  }});
  if (a.st === 'producing') { speak(A.en, true); return toast(`<b>${A.en}</b> (${A.vi}) sẽ cho ${P2.one} sau ${fmt((a.r - now) / 1000)}.`); }
  if (a.st === 'ready') { S.inv[P2.id] = (S.inv[P2.id] || 0) + 1; a.st = 'hungry'; a.r = 0; addXP(3); sfx('coin'); speak(P2.one, true); if (ent) queueFx({kind: 'text', x: ent.x, y: ent.y - 30, text: `+1 ${P2.en}`, color: '#ffe38a'}); toast(`Nhận được <b>${P2.one}</b> (${P2.vi}).`); renderHUD(); markDirty(); }
}

/* ---- fishing ---- */
function startFishing(wx, wy) {
  P.act = {kind: 'fish', bx: wx * TS + 16, by: wy * TS + 16, biteAt: performance.now() + 1800 + Math.random() * 3000, bit: false};
  P.dir = dirTo(P.x, P.y, P.act.bx, P.act.by); toast('Đã thả câu. Chờ cá cắn nhé.');
}
function onBite() {
  sfx('bite');
  setTimeout(() => {
    if (!P.act || P.act.kind !== 'fish') return; if (modalOpen()) { P.act = null; return; }
    startQuiz({tag: 'Cá cắn câu! Trả lời nhanh', timer: 10, onClose: () => { P.act = null; }, onResult: ok => {
      if (!ok) return 'Cá chạy mất rồi. Chạm mặt nước để câu lại.';
      const id = Math.random() < 0.8 ? 'fish' : 'bigfish', I = PRODUCTS[id]; S.inv[id] = (S.inv[id] || 0) + 1; S.caught = true; S.stats.fish++; addXP(4); if (id === 'bigfish') { giveGems(0, 1, 'cá ngừ quý'); if (Math.random() < 0.25) giveKey(1, 'cá ngừ quý'); }
      queueFx({kind: 'text', x: P.x, y: P.y - 56, text: `+1 ${I.en}`, color: '#ffe38a'}); return `Bạn câu được ${I.one} (${I.vi}).`;
    }});
  }, 450);
}

/* ===================== NPC DIALOGS ===================== */
let CURNPC = null, MK = 'orders', PH = null, BUY = null;
function talk(n) {
  const D = n.def; n.talking = true; n.path = []; n.dir = dirTo(n.x, n.y, P.x, P.y); P.dir = dirTo(P.x, P.y, n.x, n.y);
  const line = D.line(); MK = D.role === 'market' ? 'orders' : MK;
  openModal(`<div class="npc-head"><img class="portrait" ${pimg(n.look)} alt=""><div><b class="npc-name">${esc(D.name)}</b><p class="npc-line">“${esc(line.en)}” ${sayBtn(line.en)}</p><p class="npc-vi" id="npc-vi" hidden>${esc(line.vi)}</p><button class="btn ghost sm" data-act="show-vi">Xem nghĩa</button></div></div><div id="npc-body"></div>`, {label: D.name, wide: D.role === 'shop' || D.role === 'forge', onClose: () => { n.talking = false; n.wait = 1.5; }});
  CURNPC = n; S.stats.talks++; refreshNpc(); speak(line.en, true);
}
function refreshNpc() { const b = $('#npc-body'); if (CURNPC && b) { b.innerHTML = npcBody(CURNPC); hydratePortraits(b); } }
function npcBody(n) {
  const role = n.def.role;
  if (PH) return phraseHTML();
  if (role === 'market') {
    const tabs = [['orders', 'Giao đơn hàng'], ['sell', 'Bán đồ'], ['animals', 'Mua vật nuôi']];
    let body = MK === 'orders' ? S.orders.map((o, k) => orderHTML(o, k, true)).join('') : MK === 'sell' ? invHTML(true) : animalsHTML();
    return `<div class="subtabs">${tabs.map(([id, l]) => `<button class="chip" data-act="mk" data-t="${id}" aria-pressed="${MK === id}">${l}</button>`).join('')}</div>${body}`;
  }
  if (role === 'seeds') return seedsHTML();
  if (role === 'forge') return forgeHTML();
  if (role === 'shop') return BUY ? buyHTML() : shopHTML();
  if (role === 'teacher') return teacherHTML();
  if (role === 'ielts') return ieltsHTML();
  if (role === 'salon') return salonHTML();
  return `<div class="row-btns"><button class="btn" data-act="chat">Nói chuyện</button><button class="btn ghost" data-act="close">Tạm biệt</button></div>`;
}
function orderHTML(o, k, canGive) {
  const can = o.items.every(it => (S.inv[it.id] || 0) >= it.n), line = orderLine(o);
  return `<article class="order"><header><b>${esc(o.who)}</b>${sayBtn(line)}</header><p class="o-say">“${esc(line)}”</p><ul>${o.items.map(it => { const have = S.inv[it.id] || 0, I = ITEM(it.id); return `<li>${itemImg(it.id)}<span>${it.n} × <b>${I.en}</b> <small>(${I.vi})</small></span><span class="have ${have >= it.n ? 'ok' : ''}">${have}/${it.n}</span></li>`; }).join('')}</ul>
    <footer><span class="reward">${coinIcon}${o.coins} · ${o.xp} XP</span>${canGive ? `<button class="btn sm" data-act="deliver" data-k="${k}" ${can ? '' : 'disabled'}>Giao hàng</button><button class="btn ghost sm" data-act="swap" data-k="${k}">Đổi đơn</button>` : ''}</footer></article>`;
}
function invHTML(canSell) {
  const ids = Object.keys(S.inv).filter(id => S.inv[id] > 0 && ITEM(id));
  if (!ids.length) return `<p class="empty">Túi đang trống. Thu hoạch rau, lấy trứng hoặc câu cá, đồ sẽ hiện ở đây.</p>`;
  return `<div class="list">${ids.map(id => { const I = ITEM(id); return `<div class="row-item static">${itemImg(id)}<span class="ri-main"><b>${I.en}</b><small>${I.vi} · ${I.sell} xu/cái</small></span>${sayBtn(I.en)}<span class="qty">${S.inv[id]}</span>${canSell ? `<button class="btn ghost sm" data-act="sell" data-id="${id}">Bán 1</button><button class="btn ghost sm" data-act="sellall" data-id="${id}">Bán hết</button>` : ''}</div>`; }).join('')}</div>`;
}
function animalsHTML() {
  const free = freeSlot();
  if (free < 0) return `<p class="note">Chuồng đã đầy (${barnCount()}/${barnCap()} con). Nâng cấp chuồng ở cửa hàng nông trại để nuôi thêm.</p><div class="row-btns"><button class="btn" data-act="farmshop" data-t="barn">Nâng cấp chuồng</button></div>`;
  return `<p class="note">Vật nuôi sẽ về chuồng ở nông trại. Cho ăn bằng một câu hỏi tiếng Anh.</p><div class="list">${ANIMALS.map(A => { const lock = A.lvl > S.lvl, poor = S.coins < A.cost, P2 = PRODUCTS[A.product];
    return `<button class="row-item ${lock ? 'locked' : ''}" data-act="buyanimal" data-s="${free}" data-a="${A.id}" ${lock || poor ? 'disabled' : ''}><img class="ii" src="${svgURL(animalDef(A.id, 0).svg)}" alt=""><span class="ri-main"><b>${A.en}</b><small>${A.vi} · cho ${P2.en} mỗi ${fmt(A.time)}</small></span><span class="ri-side">${lock ? needTag(A.lvl) : `${coinIcon}${A.cost}`}</span></button>`; }).join('')}</div>`;
}
function seedsHTML() {
  return `<p class="note">Mỗi gói 5 hạt. Hạt giống sẽ vào túi, ra ruộng chạm ô đất trống để gieo.</p><div class="list">${CROPS.filter(c => !c.rare).map(c => { const lock = c.lvl > S.lvl, price = c.cost * 5, poor = S.coins < price;
    return `<button class="row-item ${lock ? 'locked' : ''}" data-act="buyseed" data-crop="${c.id}" ${lock || poor ? 'disabled' : ''}>${itemImg(c.id)}<span class="ri-main"><b>${c.en} seeds</b><small>${c.vi} · chín sau ${fmt(c.time)} · bán ${c.sell} xu · đang có ${S.seeds[c.id] || 0}</small></span><span class="ri-side">${lock ? needTag(c.lvl) : `${coinIcon}${price}`}</span></button>`; }).join('')}</div>`;
}
function buySeed(id) { const c = CROP[id], price = c.cost * 5; if (!c || c.lvl > S.lvl || S.coins < price) return; S.coins -= price; S.seeds[id] = (S.seeds[id] || 0) + 5; sfx('coin'); speak(`${c.en} seeds`, true); toast(`Đã mua 5 hạt <b>${c.en}</b>.`); refreshNpc(); renderHUD(); markDirty(); }
let SHOPTAB = 'top';
const priceTag = f => f.chest ? 'Chỉ có trong rương' : f.price === 0 ? 'Miễn phí' : (f.cur === 'gem' ? gemIcon('di') + f.price : coinIcon + f.price);
const canAfford = f => f.chest ? false : f.cur === 'gem' ? S.di >= f.price : S.coins >= f.price;
function slotPatch(f) { return f.slot === 'face' ? {face2: f.id} : {[f.slot]: f.id}; }
function itemCard(f, L, act, extra = '') {
  const own = S.owned.includes(f.id), lock = (f.lvl || 1) > S.lvl, lv = (S.look.lv || {})[f.id] || 0;
  const tryL = Object.assign({}, L, slotPatch(f)); if (lv) tryL.lv = Object.assign({}, L.lv, {[f.id]: lv});
  const img = f.slot === 'pet' ? `<img class="pv pet" src="${svgURL(petSVG(f.id, lv, 0))}" alt="">` : f.slot === 'aura' ? `<span class="pv aura" style="--c:${f.col}"></span>` : `<img class="pv" src="${portraitSVG(tryL, {full: ['back', 'hand'].includes(f.slot), hand: true})}" alt="">`;
  return `<button class="card r${f.rar || 0}" data-act="${act}" data-id="${f.id}" ${extra}><span class="rar">${RARITY[f.rar || 0].vi}</span>${lv ? `<span class="plus t${lv}">+${lv}</span>` : ''}${img}<b>${act === 'shop-pick' && !own ? '???' : esc(f.en)}</b><small>${esc(f.vi)}</small>${act === 'shop-pick' ? `<span class="price">${own ? 'Đã có' : lock ? needTag(f.lvl) : priceTag(f)}</span>` : ''}</button>`;
}
function shopHTML() {
  const L = fullLook(S.look), list = FASHION.filter(f => f.slot === SHOPTAB && (f.price > 0 || f.chest));
  return `<p class="note">Chọn món muốn mua. Cô Mai sẽ hỏi tên món đó bằng tiếng Anh, trả lời đúng mới mua được. Đồ có biểu tượng kim cương thì trả bằng kim cương. Đồ <b>Thần thoại</b> cực hiếm: có món giá hàng trăm kim cương, có món chỉ rơi ra từ Rương may mắn.</p><div class="row-btns"><button class="btn gold sm" data-act="farmshop" data-t="chest">Rương may mắn</button></div>
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
  BUY.done = true; BUY.pick = i; BUY.ok = BUY.opts[i] === f.en; S.stats.all++; lvNoteAnswer();
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
  const bonus = (FORGE.quiz === true ? 15 : 0) + (FORGE.shoe ? 10 : 0), chance = cost ? Math.min(100, cost.ch + bonus) : 0, enough = cost && S.em >= cost.em && S.di >= cost.di;
  return `<div class="forge">
    <div class="chips">${mine.map(m => { const l = (S.look.lv || {})[m.id] || 0; return `<button class="chip" data-act="forge-pick" data-id="${m.id}" aria-pressed="${m.id === f.id}">${esc(m.vi)}${l ? ` <b>+${l}</b>` : ''}</button>`; }).join('')}</div>
    <div class="forge-stage"><div class="fs-item"><span class="tier t${lv}">${lv ? '+' + lv + ' ' + TIER_VI[lv] : 'Chưa nâng'}</span>${pic(lv)}</div>
      ${nx <= 6 ? `<div class="fs-arrow" aria-hidden="true">→</div><div class="fs-item next"><span class="tier t${nx}">+${nx} ${TIER_VI[nx]}</span>${pic(nx)}</div>` : ''}</div>
    ${nx <= 6 ? `<div class="forge-info"><span>Cần ${gemIcon('em')}<b>${cost.em}</b>${cost.di ? ` ${gemIcon('di')}<b>${cost.di}</b>` : ''}</span><span>Tỉ lệ thành công <b class="${chance >= 70 ? 'ok' : chance >= 45 ? 'mid' : 'low'}">${chance}%</b>${bonus ? ' (đã cộng 15%)' : ''}</span><span class="${nx >= 4 ? 'warn' : ''}">${nx >= 4 ? 'Thất bại từ +4 trở lên sẽ tụt 1 cấp.' : 'Thất bại chỉ mất ngọc, đồ giữ nguyên.'}</span></div>
      <div class="row-btns">${FORGE.quiz === null ? `<button class="btn ghost" data-act="forge-quiz">Trả lời 1 câu khó để +15%</button>` : ''}${S.inv.horseshoe > 0 ? `<button class="btn ghost" data-act="forge-shoe" aria-pressed="${!!FORGE.shoe}">${FORGE.shoe ? 'Đã dùng' : 'Dùng'} móng ngựa may mắn (+10%) · có ${S.inv.horseshoe}</button>` : ''}<button class="btn gold" data-act="forge-go" ${enough ? '' : 'disabled'}>Nâng lên +${nx}</button><button class="btn ghost sm" data-act="exchange">Đổi xu lấy ngọc</button></div>
      ${enough ? '' : `<p class="note">Chưa đủ ngọc. Ngọc lục bảo có được khi trả lời đúng 5 câu liên tiếp, lên cấp, giao đơn, học bài. Kim cương có được khi thi đậu, mỗi 5 cấp và khi câu được cá ngừ.</p>`}` : `<div class="fb good"><strong>Tối đa!</strong> Món này đã đạt +6 Cầu vồng.</div>`}
    ${FORGE.res ? `<div class="fb ${FORGE.res.ok ? 'good' : 'miss'}"><strong>${FORGE.res.ok ? 'Thành công!' : 'Thất bại'}</strong> ${FORGE.res.msg}</div>` : ''}
  </div>`;
}
function forgeGo() {
  const f = FASH[FORGE.id]; if (!f) return; S.look.lv = S.look.lv || {};
  const lv = S.look.lv[f.id] || 0, nx = lv + 1, cost = UP_COST[nx]; if (!cost || S.em < cost.em || S.di < cost.di) return;
  S.em -= cost.em; S.di -= cost.di;
  const shoe = FORGE.shoe && S.inv.horseshoe > 0; if (shoe) S.inv.horseshoe--; const chance = Math.min(100, cost.ch + (FORGE.quiz === true ? 15 : 0) + (shoe ? 10 : 0)), ok = Math.random() * 100 < chance;
  if (ok) { S.look.lv[f.id] = nx; FORGE.res = {ok: true, msg: `${esc(f.vi)} đã lên <b>+${nx} ${TIER_VI[nx]}</b>.`}; sfx('level'); queueFx({kind: 'spark', who: 'player'}); speak('Success!', true); if (nx === 6) { S.di += 2; FORGE.res.msg += ' Thưởng thêm 2 kim cương!'; } }
  else { const drop = nx >= 4 && lv > 0; if (drop) S.look.lv[f.id] = lv - 1; FORGE.res = {ok: false, msg: drop ? `Món đồ bị tụt xuống +${lv - 1}. Lần sau may mắn hơn nhé!` : 'Ngọc đã tan, món đồ vẫn giữ nguyên cấp.'}; sfx('bad'); }
  FORGE.quiz = null; FORGE.shoe = false; refreshNpc(); renderHUD(); markDirty(); saveNow(true);
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
function ieltsHTML() {
  const today = new Date().toISOString().slice(0, 10), done = S.ieltsDay === today;
  return `<p class="note">Thử thách IELTS hằng ngày: 5 câu từ vựng học thuật và paraphrase theo band bạn chọn. Đúng từ 4 câu được <b>1 kim cương</b> và <b>3 ngọc lục bảo</b> (mỗi ngày một lần).</p>
    <div class="chips">${['B1', 'B2', 'C1'].map(lv => `<button class="chip" data-act="ielts-band" data-t="${lv}" aria-pressed="${(S.ieltsBand || 'B1') === lv}">${IELTS_BAND[lv]}</button>`).join('')}</div>
    <div class="row-btns"><button class="btn gold" data-act="ielts-go">${done ? 'Luyện thêm (không thưởng)' : 'Bắt đầu thử thách hôm nay'}</button><button class="btn ghost" data-act="chat">Nói chuyện</button></div>`;
}
function startIelts() {
  const band = S.ieltsBand || 'B1', words = shuffle(TRACK_WORDS.ielts[band]).slice(0, 5), today = new Date().toISOString().slice(0, 10), rewarded = S.ieltsDay === today;
  let n = 0, ok = 0;
  const next = () => {
    if (n >= words.length) {
      if (ok >= 4) S.ieltsCount = (S.ieltsCount || 0) + 1;
      if (!rewarded && ok >= 4) { S.ieltsDay = today; giveGems(3, 1, 'thử thách IELTS'); }
      openModal(`<h2 class="ptitle">${ok >= 4 ? 'Xuất sắc!' : 'Cố lên!'}</h2><p class="psub">Bạn đúng ${ok}/5 câu ${IELTS_BAND[band]}.${!rewarded && ok >= 4 ? ' Đã nhận thưởng hôm nay.' : rewarded ? ' Hôm nay bạn đã nhận thưởng rồi.' : ' Cần 4 câu để nhận thưởng.'}</p><div class="row-btns"><button class="btn" data-act="close">Xong</button></div>`, {label: 'Kết quả IELTS'}); markDirty(); return;
    }
    const w = words[n++];
    startQuiz({tag: `IELTS ${IELTS_BAND[band]} · câu ${n}/5`, word: w, type: rand(['syn', 'syn', 'fill', 'en2vi']), next: true, onResult: r => { if (r) ok++; return ''; }, onNext: next});
  };
  next();
}
function teacherHTML() {
  const {track, level} = S.study, nextLv = LEVELS[LEVELS.indexOf(level) + 1];
  const canTest = nextLv && !S.study.unlocked.includes(nextLv);
  return `<p class="note">Đang học: <b>${esc(TRACKS[track].vi)}</b>, trình độ <b>${level} (${LEVEL_VI[level]})</b>. Đổi trong mục Học tập.</p>
    <div class="row-btns"><button class="btn" data-act="lesson">Học bài 5 câu (+3 xu/câu đúng)</button><button class="btn ghost" data-act="chat">Tập hội thoại</button></div>
    ${canTest ? `<div class="test-box"><b>Thi lên ${nextLv} (${LEVEL_VI[nextLv]})</b><p class="note">10 câu ở trình độ ${level}, đúng từ 8 câu trở lên là mở khoá ${nextLv}.</p><button class="btn gold" data-act="leveltest">Làm bài thi</button></div>` : ''}`;
}
let LESSON = null;
function startLesson(test) {
  LESSON = {n: 0, ok: 0, total: test ? 10 : 5, test};
  lessonNext();
}
function lessonNext() {
  if (!LESSON) return;
  if (LESSON.n >= LESSON.total) {
    const L = LESSON; LESSON = null;
    if (L.test) {
      const lv = LEVELS[LEVELS.indexOf(S.study.level) + 1], pass = L.ok >= 8;
      if (pass && !S.study.unlocked.includes(lv)) S.study.unlocked.push(lv);
      if (pass) { S.study.level = lv; S.coins += 50; addXP(40); sfx('level'); giveGems(5, 1, 'thi đậu ' + lv); }
      openModal(`<h2 class="ptitle">${pass ? 'Đậu rồi!' : 'Chưa đậu'}</h2><p class="psub">Bạn đúng ${L.ok}/10 câu. ${pass ? `Đã mở khoá trình độ <b>${lv}</b> và chuyển sang học ${lv}. Thưởng 50 xu.` : 'Cần 8 câu. Ôn thêm rồi thi lại nhé.'}</p><div class="row-btns"><button class="btn" data-act="close">Tiếp tục</button></div>`, {label: 'Kết quả'});
    } else { if (L.ok >= 4) giveGems(2, 0, 'học tốt'); } if (!L.test) openModal(`<h2 class="ptitle">Xong bài học</h2><p class="psub">Bạn đúng ${L.ok}/${L.total} câu, nhận ${L.ok * 3} xu.</p><div class="row-btns"><button class="btn" data-act="lesson">Học bài nữa</button><button class="btn ghost" data-act="close">Nghỉ</button></div>`, {label: 'Kết quả'});
    markDirty(); return;
  }
  LESSON.n++;
  startQuiz({tag: `${LESSON.test ? 'Bài thi' : 'Bài học'} · câu ${LESSON.n}/${LESSON.total}`, next: true, onResult: ok => { if (ok) { LESSON.ok++; if (!LESSON.test) { S.coins += 3; return 'Thưởng 3 xu.'; } } return ''; }, onClose: () => { if (LESSON && !LESSON.advancing) LESSON = null; }});
}
const fillName = s => s.replace('{name}', S.name || 'Hieu');
function newPhrase() {
  const li = LEVELS.indexOf(S.study.level), pool = PHRASES.filter(p => LEVELS.indexOf(p.lv) <= Math.max(1, li));
  const ph = rand(pool.filter(p => !PH || p !== PH.ph)), ans = fillName(ph.a);
  const opts = shuffle([ans, ...shuffle(PHRASES.filter(p => p !== ph)).slice(0, 3).map(p => fillName(p.a))]);
  PH = {ph, ans, opts, done: false}; setTimeout(() => speak(ph.q, true), 200);
}
function phraseHTML() {
  const {ph, opts, done} = PH;
  return `<p class="q-ask">${esc(CURNPC.def.name)} hỏi bạn:</p><div class="q-sent">${esc(ph.q)} ${sayBtn(ph.q)}</div><p class="q-ask">Bạn trả lời thế nào?</p>
    <div class="opts one">${opts.map((o, i) => `<button class="opt ${done ? (o === PH.ans ? 'right' : i === PH.pick ? 'wrong' : '') : ''}" data-ph="${i}" ${done ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`).join('')}</div>
    ${done ? `<div class="fb ${PH.ok ? 'good' : 'miss'}"><strong>${PH.ok ? 'Hay lắm!' : 'Chưa đúng'}</strong> ${PH.ok ? 'Thưởng 2 xu.' : `Câu đúng là “${esc(PH.ans)}”.`}</div><div class="card-word"><p class="cw-ex"><b>${esc(ph.q)}</b> = ${esc(ph.qv)}</p><p class="cw-ex"><b>${esc(PH.ans)}</b> = ${esc(fillName(ph.av))} ${sayBtn(PH.ans)}</p></div><div class="row-btns"><button class="btn sm" data-act="chat" id="ph-next">Hỏi tiếp</button><button class="btn ghost sm" data-act="close">Tạm biệt</button></div>` : ''}`;
}
function choosePhrase(i) {
  if (!PH || PH.done || i >= PH.opts.length) return;
  PH.done = true; PH.pick = i; PH.ok = PH.opts[i] === PH.ans; S.stats.all++;
  if (PH.ok) { S.stats.ok++; S.coins += 2; S.streak++; S.best = Math.max(S.best, S.streak); addXP(3); speak(PH.ans, true); } else S.streak = 0;
  sfx(PH.ok ? 'ok' : 'bad'); if (CURNPC) CURNPC.bubble = {text: PH.ok ? rand(['Great!','Good job!','Nice!']) : 'Hmm...', t: performance.now()};
  refreshNpc(); renderHUD(); const nb = $('#ph-next'); if (nb) nb.focus({preventScroll: true}); markDirty();
}
function deliver(k) {
  const o = S.orders[k]; if (!o || !o.items.every(it => (S.inv[it.id] || 0) >= it.n)) return;
  for (const it of o.items) S.inv[it.id] -= it.n;
  S.coins += o.coins; addXP(o.xp); sfx('coin'); if (Math.random() < 0.35) giveGems(1, 0, 'quà của khách'); toast(`${esc(o.who)}: “Thank you so much!” <b>+${o.coins} xu</b>`);
  S.orders[k] = genOrder(); renderHUD(); refreshNpc(); markDirty();
}
function sell(id, all) { const n = all ? (S.inv[id] || 0) : Math.min(1, S.inv[id] || 0); if (!n) return; S.inv[id] -= n; S.coins += n * ITEM(id).sell; sfx('coin'); renderHUD(); refreshNpc(); markDirty(); }
function buyAnimal(i, id) { const A = ANIMAL[id]; if (!A || S.animals[i] || A.lvl > S.lvl || S.coins < A.cost) return; S.coins -= A.cost; S.animals[i] = {t: id, st: 'hungry', r: 0}; spawnAnimals(); sfx('pop'); speak(A.en, true); toast(`Đã mua <b>${A.en}</b>. Nó đang chờ ở chuồng nông trại.`); renderHUD(); refreshNpc(); markDirty(); }

/* ===================== PANELS (bottom bar) ===================== */
function openBag() {
  const seeds = CROPS.filter(c => S.seeds[c.id] > 0);
  openModal(`<h2 class="ptitle">Túi đồ</h2><h3 class="ph3">Nông sản</h3>${invHTML(false)}<h3 class="ph3">Hạt giống</h3>${seeds.length ? `<div class="list">${seeds.map(c => `<div class="row-item static">${itemImg(c.id)}<span class="ri-main"><b>${c.en} seeds</b><small>${c.vi}</small></span><span class="qty">${S.seeds[c.id]}</span></div>`).join('')}</div>` : '<p class="empty">Chưa có hạt giống. Mua ở cửa hàng SEEDS trong Làng.</p>'}<h3 class="ph3">Đơn hàng đang chờ</h3>${S.orders.map((o, k) => orderHTML(o, k, false)).join('')}<p class="note">Giao đơn và bán đồ ở chợ (MARKET), gặp Chú Ba.</p><div class="row-btns"><button class="btn" data-act="farmshop" data-t="seeds">Cửa hàng nông trại</button><button class="btn gold" data-act="farmshop" data-t="chest">Rương may mắn (${S.keys || 0} chìa)</button></div>`, {label: 'Túi đồ', wide: true});
}
function openStudy() {
  const {track, level, unlocked} = S.study;
  const seenAll = Object.keys(S.m).length, known = Object.values(S.m).filter(r => r.m >= 4).length, acc = S.stats.all ? Math.round(S.stats.ok / S.stats.all * 100) : 0;
  const words = [...(TRACK_WORDS.general[level] || []), ...(track !== 'general' ? (TRACK_WORDS[track][level] || []) : [])];
  openModal(`<h2 class="ptitle">Học tập</h2>
    <div class="stats3"><div><b>${seenAll}</b><small>từ đã gặp</small></div><div><b>${known}</b><small>từ đã thuộc</small></div><div><b>${acc}%</b><small>trả lời đúng</small></div></div>
    <h3 class="ph3">Chuyên ngành</h3><div class="chips">${Object.entries(TRACKS).map(([id, t]) => `<button class="chip" data-act="track" data-t="${id}" aria-pressed="${track === id}">${esc(t.vi)}</button>`).join('')}</div>
    <div class="lvline" data-act="lvinfo" role="button"><span class="lvbig sm">${S.cefr}</span><span>Trình độ được công nhận (cấp độ nhân vật). Muốn lên cấp phải qua bài test. <b>Xem tiến độ</b></span></div><h3 class="ph3">Trình độ đang học (chọn tự do để luyện)</h3><div class="chips">${LEVELS.map(lv => { return `<button class="chip" data-act="level" data-t="${lv}" aria-pressed="${level === lv}">${lv} · ${track === 'ielts' ? IELTS_BAND[lv] : LEVEL_VI[lv]}</button>`; }).join('')}</div>
    ${track !== 'general' && !TRACK_WORDS[track][level] ? `<p class="note">Từ vựng chuyên ngành bắt đầu từ A2. Ở ${level}, câu hỏi chủ yếu là giao tiếp chung, có xen vài từ chuyên ngành dễ.</p>` : ''}
    <div class="row-btns"><button class="btn sm" data-act="tests">Trung tâm thi</button><button class="btn ghost sm" data-act="t-place">Kiểm tra trình độ</button>${track === 'ielts' ? '<button class="btn ghost sm" data-act="roadmap">Lộ trình IELTS</button>' : ''}</div><p class="note">Câu hỏi khi tưới cây, cho ăn, câu cá đều lấy từ chuyên ngành và trình độ bạn chọn. Bạn đổi trình độ bất cứ lúc nào. Bài kiểm tra tổng thể mỗi tuần sẽ tự nâng trình độ khi bạn tiến bộ. Thi ở trường (SCHOOL) với Cô Lan để nhận thưởng ngọc và kim cương.</p>
    <h3 class="ph3">Từ vựng ${level}</h3><ul class="words">${words.map(w => { const r = S.m[w.key], m = r ? r.m : 0; return `<li class="${r && r.w ? 'weak' : ''}">${sayBtn(w.en)}<span class="en">${esc(w.en)}</span><span class="vi">${r ? esc(w.vi) : '<i>chưa gặp</i>'}</span><span class="stars">${[1,2,3,4,5].map(k => `<i class="${k <= m ? 'on' : ''}"></i>`).join('')}</span></li>`; }).join('')}</ul>`, {label: 'Học tập', wide: true});
}
let WARD = null;
function openWardrobe() {
  WARD = WARD || 'top';
  const L = fullLook(S.look);
  const items = FASHION.filter(f => f.slot === WARD && S.owned.includes(f.id));
  const colorKey = {top: 'topC', bottom: 'bottomC'}[WARD];
  const optional = !['top', 'bottom'].includes(WARD), cur = WARD === 'face' ? L.face2 : L[WARD];
  openModal(`<h2 class="ptitle">Tủ đồ</h2><div class="ward"><div class="ward-prev"><div class="stagebox"><img class="pv hero" src="${portraitSVG(L, {full: true, hand: true})}" alt="Nhân vật của bạn">${L.pet ? `<img class="petmini" src="${svgURL(petSVG(L.pet, (L.lv || {})[L.pet] || 0, 0))}" alt="">` : ''}</div><button class="btn ghost sm" data-act="creator">Sửa ngoại hình</button><button class="btn sm" data-act="salon">Tiệm tóc</button></div><div class="ward-main">
    <div class="seg">${SLOTS.map(([k, l]) => `<button class="segb" data-act="ward-slot" data-t="${k}" aria-pressed="${WARD === k}">${l}</button>`).join('')}</div>
    <div class="cards">${optional ? `<button class="card ${!cur ? 'on' : ''}" data-act="wear" data-id=""><span class="pv none">Trống</span><b>Bỏ ra</b><small>không dùng</small></button>` : ''}${items.map(f => itemCard(f, L, 'wear', cur === f.id ? 'aria-pressed="true"' : '')).join('') || '<p class="empty">Chưa có món nào. Mua ở CLOTHES SHOP trong Làng.</p>'}</div>
    ${colorKey ? `<h3 class="ph3">Đổi màu</h3><div class="swatches">${CLOTH_COLS.map(c => `<button class="sw" style="background:${c}" data-act="dye" data-c="${c}" aria-pressed="${L[colorKey] === c}" aria-label="${c}"></button>`).join('')}</div>` : ''}
    ${WARD === 'bottom' ? `<h3 class="ph3">Màu giày</h3><div class="swatches">${CLOTH_COLS.map(c => `<button class="sw" style="background:${c}" data-act="dye-shoe" data-c="${c}" aria-pressed="${L.shoeC === c}" aria-label="${c}"></button>`).join('')}</div>` : ''}
  </div></div>`, {label: 'Tủ đồ', wide: true});
}
async function openBoard() {
  let rows = [];
  if (Store.mode === 'supa' || !inClaude()) { try { rows = await sbBoard(); } catch (e) { console.warn(e); } }
  else if (Store.mode === 'cloud') {
    try { const snap = await Store.db.collection('players').orderBy('lvl', 'desc').limit(20).get(); rows = snap.docs.map(d => Object.assign({id: d.id}, d.data())); } catch (e) { console.warn(e); }
  }
  openModal(`<h2 class="ptitle">Bảng tin làng</h2><p class="psub">Những người chơi chăm chỉ nhất. Bảng xếp hạng chung của mọi người chơi trên web và app.</p>
    ${rows.length ? `<ol class="board">${rows.map((r, i) => `<li class="${r.id === Store.uid ? 'me' : ''}"><span class="rank">${i + 1}</span><img class="portrait xs" ${pimg(fullLook(r.look))} alt=""><span class="ri-main"><b class="pname"></b><small>${esc((TRACKS[r.track] || TRACKS.general).vi)} · ${esc(r.level || 'A1')} · thuộc ${r.words || 0} từ</small></span><span class="lv">${LEVELS[Math.min(4, Math.max(0, (r.lvl || 1) - 1))]}</span></li>`).join('')}</ol>` : `<p class="empty">${Store.mode === 'cloud' ? 'Chưa có ai trên bảng. Chơi thêm một lúc rồi quay lại nhé.' : 'Bảng xếp hạng cần đăng nhập Claude. Bạn đang chơi chế độ lưu trên máy.'}</p>`}`, {label: 'Bảng tin'});
  document.querySelectorAll('.board .pname').forEach((el, i) => { el.textContent = rows[i].name || 'Người chơi'; });
}
function openSettings() {
  openModal(`<h2 class="ptitle">Cài đặt</h2>
    ${acctHTML()}
    <div class="row-btns"><button class="btn ghost" data-act="sound">${S.sound ? 'Tắt âm thanh' : 'Bật âm thanh'}</button><button class="btn ghost" data-act="credits">Ghi công hình ảnh</button><button class="btn ghost" data-act="help">Cách chơi</button></div>
    <div class="row-btns"><button class="btn ghost danger" data-act="reset" id="reset-btn">Chơi lại từ đầu</button></div>`, {label: 'Cài đặt'});
  setSaveBadge('ok');
}
function openCredits() {
  openModal(`<h2 class="ptitle">Ghi công hình ảnh</h2><p class="psub">Nhân vật chibi dựa trên bộ hình CC0 của nemo. Đồ thời trang, cảnh vật, cây trồng, con vật và biểu tượng được vẽ riêng cho Vườn Chữ theo cùng phong cách.</p>
    <ul class="credits"><li><b>Character Creation Asset Pack</b><br>nemo (nonemo.itch.io)<br><small>CC0 · <a href="https://nonemo.itch.io/character-creation-asset-pack" target="_blank" rel="noopener">nonemo.itch.io/character-creation-asset-pack</a></small></li>
    <li><b>Phông chữ</b><br>Nunito, Baloo 2 (Google Fonts)<br><small>SIL Open Font License</small></li></ul>`, {label: 'Ghi công', wide: true});
}
/* ---------- world map travel ---------- */
const ZONES = [
  {id:'farm', vi:'Nông trại', desc:'Ruộng, chuồng trại, ao cá nhỏ', at:[10, 10], grad:'linear-gradient(135deg,#8ED66B,#3FAE5A)'},
  {id:'village', vi:'Làng', desc:'Chợ, cửa hàng, trường học, lò nâng cấp', at:[17, 13], grad:'linear-gradient(135deg,#FFB547,#FF7AB6)'},
  {id:'park', vi:'Công viên', desc:'Đài phun nước, thử thách IELTS', at:[15, 18], grad:'linear-gradient(135deg,#F7A8CB,#9B6CFF)'},
  {id:'river', vi:'Bờ sông', desc:'Câu cá, cầu tàu, bãi cát', at:[14, 11], grad:'linear-gradient(135deg,#6CC8F4,#5B8DEF)'}
];
function openMap() {
  openModal(`<h2 class="ptitle">Bản đồ</h2><p class="psub">Chọn nơi muốn đến. Bạn cũng có thể đi bộ qua các biển chỉ đường ở mép bản đồ.</p>
    <div class="zones">${ZONES.map(z => `<button class="zone ${S.map === z.id ? 'here' : ''}" data-act="travel" data-t="${z.id}" style="background:${z.grad}"><b>${MAPS[z.id].en}</b><span>${z.vi}</span><small>${z.desc}</small>${S.map === z.id ? '<i>Bạn đang ở đây</i>' : ''}</button>`).join('')}</div>`, {label: 'Bản đồ', wide: true});
}
function travel(id) {
  const z = ZONES.find(q => q.id === id); if (!z) return;
  closeModal(); const f = $('#fade'); f.innerHTML = `<b>${MAPS[id].en}</b><span>${z.vi}</span>`; f.classList.add('on');
  setTimeout(() => { changeMap(id, z.at[0], z.at[1]); setTimeout(() => f.classList.remove('on'), 120); }, 380);
}
function openHelp() {
  openModal(`<h2 class="ptitle">Cách chơi</h2><ol class="guide">
    <li><b>Đi lại:</b> chạm vào chỗ muốn đến. Đi qua mép bản đồ có biển chỉ đường để sang Làng hoặc Bờ sông.</li>
    <li><b>Làm ruộng:</b> mua hạt ở cửa hàng SEEDS (Ông Tư), gieo vào ô đất, tưới nước, nhổ cỏ, thu hoạch. Mỗi việc là một câu hỏi tiếng Anh. Thu hoạch phải đánh vần, đúng được gấp đôi.</li>
    <li><b>Chuồng:</b> chạm vào con vật để cho ăn, sau đó lấy trứng, sữa, len.</li>
    <li><b>Chợ (Chú Ba):</b> giao đơn hàng, bán nông sản, mua vật nuôi.</li>
    <li><b>Cửa hàng quần áo (Cô Mai):</b> nói đúng tên món đồ bằng tiếng Anh mới mua được.</li>
    <li><b>Trường học (Cô Lan):</b> học bài 5 câu, tập hội thoại, thi lên trình độ.</li>
    <li><b>Học tập:</b> chọn chuyên ngành (CNTT, Kinh doanh, Y tế, Du lịch, Kỹ thuật, Thiết kế & Kiến trúc) và trình độ A1 đến C1.</li>
    <li><b>Bờ sông:</b> chạm mặt nước để câu cá, có 10 giây để trả lời khi cá cắn.</li>
    <li><b>Bảng tin:</b> ở quảng trường Làng, xem bảng xếp hạng người chơi.</li></ol>`, {label: 'Cách chơi'});
}

/* ===================== CHARACTER CREATOR ===================== */
let CC = null;
function openCreator(first) {
  CC = {name: S.name || '', look: fullLook(S.look), level: S.study.level, track: S.study.track, first, tab: 'body'};
  renderCreator();
}
function renderCreator() {
  const L = CC.look, tabs = [['body', 'Dáng người'], ['hair', 'Tóc'], ['face', 'Khuôn mặt'], ['study', 'Học tập']].filter(t => CC.first || t[0] !== 'study');
  const sw = (k, list) => `<div class="swatches">${list.map(c => `<button class="sw" style="background:${c}" data-act="cc" data-k="${k}" data-v="${c}" aria-pressed="${L[k] === c}" aria-label="${c}"></button>`).join('')}</div>`;
  const chips = (k, list, vi) => `<div class="chips">${list.map(v => `<button class="chip" data-act="cc" data-k="${k}" data-v="${v}" aria-pressed="${String(L[k]) === String(v)}">${esc(vi(v))}</button>`).join('')}</div>`;
  let body = '';
  if (CC.tab === 'body') body = `<span class="lbl">Màu da</span><div class="swatches">${SKIN_TONES.map((t, i) => `<button class="sw" style="background:${t.b}" data-act="cc" data-k="skin" data-v="${i}" aria-pressed="${L.skin === i}" aria-label="Màu da ${i + 1}"></button>`).join('')}</div>
    <span class="lbl">Kiểu áo</span>${chips('top', ['top_tee', 'top_dress'], v => FASH[v].vi)}<span class="lbl">Màu áo</span>${sw('topC', CLOTH_COLS)}<span class="lbl">Màu quần</span>${sw('bottomC', CLOTH_COLS)}`;
  if (CC.tab === 'hair') body = `<span class="lbl">Tóc phía trước</span>${chips('hairF', Object.keys(NEMO.hairF).filter(v => v !== 'none').concat('none').filter(ownsHairF), v => HAIR_F_VI[v] || (HAIR_ITEMS.find(h => h.f === v) || {}).vi || v)}<span class="lbl">Tóc phía sau</span>${chips('hairB', [null, ...Object.keys(NEMO.hairB)].filter(ownsHairB), v => HAIR_B_VI[v] || (HAIR_ITEMS.find(h => h.b === v) || {}).vi || v)}<span class="lbl">Màu tóc</span>${sw('hairC', [...HAIR_COLS, ...ownedDyes()])}<p class="note">Kiểu tóc và màu nhuộm đẹp, hiếm có ở <b>Tiệm tóc</b> trong Làng. <button class="linkbtn" data-act="salon">Đến tiệm tóc</button></p>`;
  if (CC.tab === 'face') body = `<span class="lbl">Biểu cảm</span>${chips('face', FACES, v => FACE_VI[v])}<span class="lbl">Râu</span>${chips('beard', [null, 'short', 'middle', 'long'], v => ({null: 'Không', short: 'Ria mép', middle: 'Râu quai nón', long: 'Râu dài'})[v])}`;
  if (CC.tab === 'study') body = `<span class="lbl">Trình độ tiếng Anh hiện tại</span><div class="chips">${['A1','A2','B1','B2'].map(lv => `<button class="chip" data-act="cc-lv" data-v="${lv}" aria-pressed="${CC.level === lv}">${lv} · ${LEVEL_VI[lv]}</button>`).join('')}</div>
    <span class="lbl">Chuyên ngành muốn học</span><div class="chips">${Object.entries(TRACKS).map(([id, t]) => `<button class="chip" data-act="cc-tr" data-v="${id}" aria-pressed="${CC.track === id}">${esc(t.vi)}</button>`).join('')}</div>`;
  const html = `<h2 class="ptitle">${CC.first ? 'Tạo nhân vật' : 'Sửa ngoại hình'}</h2>${CC.first ? '<p class="psub">Chọn tên, ngoại hình và trình độ tiếng Anh trước khi vào làng.</p>' : ''}
    <div class="ward"><div class="ward-prev"><div class="stagebox"><img class="pv hero" id="cc-prev" src="${portraitSVG(L, {full: true})}" alt="Xem trước nhân vật"></div></div><div class="ward-main">
      <label class="lbl" for="cc-name">Tên nhân vật</label><input id="cc-name" class="field" maxlength="14" placeholder="Ví dụ: Hiếu" value="${esc(CC.name)}">
      <div class="seg">${tabs.map(([k, l]) => `<button class="segb" data-act="cc-tab" data-t="${k}" aria-pressed="${CC.tab === k}">${l}</button>`).join('')}</div>${body}
    </div></div><div class="row-btns end"><button class="btn big" data-act="cc-done">${CC.first ? 'Vào làng' : 'Lưu'}</button></div>`;
  const keep = $('#modal .panel') ? $('#modal .panel').scrollTop : 0;
  openModal(html, {label: 'Nhân vật', noClose: CC.first, wide: true});
  $('#modal .panel').scrollTop = keep;
}
function ccDone() {
  const nm = ($('#cc-name').value || '').trim().slice(0, 14);
  if (!nm) { toast('Hãy đặt tên cho nhân vật.'); $('#cc-name').focus(); return; }
  S.name = nm; S.look = Object.assign({}, CC.look, {lv: S.look.lv || {}});
  const first = CC.first; S.created = true;
  if (CC.look.top === 'top_dress' && !S.owned.includes('top_dress')) S.owned.push('top_dress');
  if (first) { S.study.level = CC.level; S.study.track = CC.track; S.study.unlocked = LEVELS.slice(0, LEVELS.indexOf(CC.level) + 1); S.orders = [genOrder(['carrot']), genOrder(['radish', 'carrot']), genOrder(['egg'])]; }
  const picked = CC.level; CC = null; closeModal(); saveNow(true);
  if (first && picked !== 'A1') setTimeout(() => openModal(`<h2 class="ptitle">Được công nhận ${picked}?</h2><p class="psub">Cấp độ của nhân vật chính là trình độ tiếng Anh. Bạn bắt đầu ở <b>A1</b>. Làm bài kiểm tra xếp lớp 24 câu để được công nhận ngay ${picked} và mở khoá đồ, cây trồng, vật nuôi theo trình độ.</p><div class="row-btns"><button class="btn gold" data-act="t-place">Làm bài xếp lớp</button><button class="btn ghost" data-act="close">Để sau</button></div>`, {label: 'Xếp lớp'}), 4800);
  if (first) { speak(`Hello, ${S.name}! Welcome to the farm.`, true); toast(`Chào <b>${esc(S.name)}</b>! Cây cà rốt có ngôi sao đã chín, chạm vào để thu hoạch.`, 4500); }
}

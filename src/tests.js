/* ===================== TEST CENTRE: exams, AI grading, weekly test, auto farm, IELTS roadmap ===================== */
const CAPS = {sample: null, dictation: null, tts: null};
async function initCaps() {
  try { const c = window.claude; if (!c || !c.use) return; [CAPS.sample, CAPS.dictation, CAPS.tts] = await Promise.all([c.use('sample'), c.use('dictation'), c.use('tts')]); } catch (e) { console.warn(e); }
}
const today = () => new Date().toISOString().slice(0, 10);
const daysSince = d => d ? (Date.now() - new Date(d).getTime()) / 864e5 : 1e9;
const roundBand = b => Math.floor(b * 2 + 0.5) / 2;  // IELTS: .25 rounds up to .5, .75 rounds up to next
const LISTEN_TABLE = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 2]];
const READ_TABLE = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 2]];
function bandFromRaw(raw, total, skill) { const s40 = Math.round(raw / total * 40); return ((skill === 'listening' ? LISTEN_TABLE : READ_TABLE).find(([m]) => s40 >= m) || [0, 2])[1]; }
const toeicScale = (raw, total) => Math.max(5, Math.min(495, Math.round((5 + raw / total * 490) / 5) * 5));
const bandToCEFR = b => b >= 7 ? 'C1' : b >= 5.5 ? 'B2' : b >= 4 ? 'B1' : 'A2';

/* ---------- builders ---------- */
const shuf = a => shuffle(a);
function mcqFrom(q, options, correctIdx, extra = {}) {
  const order = shuf(options.map((o, i) => i));
  return Object.assign({t: 'mcq', q, options: order.map(i => options[i]), answer: order.indexOf(correctIdx)}, extra);
}
function vocabQ(w, lv) {
  const pool = Object.values(WORDS).filter(x => x.level === w.level && x.en !== w.en && x.vi !== w.vi);
  const ds = shuf(pool).slice(0, 3);
  if (Math.random() < 0.5 && wordRe(w.en).test(w.ex)) return mcqFrom(`Choose the word that best completes the sentence: “${w.ex.replace(wordRe(w.en), '_____')}”`, [w.en, ...ds.map(d => d.en)], 0, {lv, word: w.key});
  return mcqFrom(`What does “${w.en}” mean?`, [w.vi, ...ds.map(d => d.vi)], 0, {lv, word: w.key});
}
function grammarQ(lv) { const [q, o, a] = rand(GRAMMAR[lv]); return mcqFrom(q, o, a, {lv}); }
function levelWords(lv, track) { return [...(TRACK_WORDS.general[lv] || []), ...(track && track !== 'general' ? (TRACK_WORDS[track][lv] || []) : [])]; }
function buildPlacement() {
  const qs = [];
  for (const lv of LEVELS) {
    const g = shuf(GRAMMAR[lv]).slice(0, 2).map(([q, o, a]) => mcqFrom(q, o, a, {lv}));
    const v = shuf(levelWords(lv, S.study.track)).slice(0, 2).map(w => vocabQ(w, lv));
    qs.push(...g, ...v);
  }
  const R = IELTS_MOCK.sections[1].parts[1];
  return {id: 'placement', kind: 'placement', title: 'Kiểm tra tổng thể · đánh giá trình độ', sections: [
    {id: 'V', skill: 'grammar', title: 'Từ vựng & Ngữ pháp', minutes: 15, note: '20 câu, 4 câu mỗi trình độ từ A1 đến C1. Đúng từ 3/4 câu ở một trình độ (và các trình độ thấp hơn) là đạt trình độ đó.', parts: [{title: 'Chọn đáp án đúng', questions: qs}]},
    {id: 'R', skill: 'reading', title: 'Đọc hiểu', minutes: 8, note: 'Đọc đoạn văn và trả lời 4 câu (tính vào trình độ B2).', parts: [{title: R.title, passage: R.passage, questions: R.questions.slice(2, 6).map(q => Object.assign({}, q, {lv: 'B2'}))}]}
  ]};
}
function buildAutoTest() {
  const lv = S.study.level, li = LEVELS.indexOf(lv), qs = [];
  shuf(levelWords(lv, S.study.track)).slice(0, 10).forEach(w => qs.push(vocabQ(w, lv)));
  const g0 = shuf(GRAMMAR[lv]), gram = [...g0.slice(0, 3), ...(li ? shuf(GRAMMAR[LEVELS[li - 1]]).slice(0, 2) : g0.slice(3, 5))];
  gram.forEach(([q, o, a]) => qs.push(mcqFrom(q, o, a, {lv})));
  return {id: 'auto', kind: 'auto', title: `Bài test Auto Farm · ${lv}`, sections: [{id: 'V', skill: 'grammar', title: 'Từ vựng & Ngữ pháp', minutes: 8, note: '15 câu ở trình độ bạn đang học. Đạt từ 70% (11/15) mở Auto Farm 24 giờ, từ 90% (14/15) mở 48 giờ.', parts: [{title: 'Chọn đáp án đúng', questions: shuf(qs)}]}]};
}
function buildMock(base, ids) { return Object.assign({}, base, {sections: base.sections.filter(s => !ids || ids.includes(s.id)), title: base.title + (ids && ids.length < base.sections.length ? ' · ' + ids.map(i => base.sections.find(s => s.id === i).title).join(', ') : '')}); }

/* ---------- exam runner ---------- */
let EX = null;
const qid = (si, pi, qi) => `${si}.${pi}.${qi}`;
function openExam(test, onFinish) {
  const minutes = test.sections.reduce((s, x) => s + (x.minutes || 10), 0);
  EX = {test, si: 0, ans: {}, plays: {}, end: Date.now() + minutes * 60000, onFinish, done: false, timer: null};
  renderExam();
  EX.timer = setInterval(() => { if (!EX || EX.done) return; const left = EX.end - Date.now(), el = $('#ex-time'); if (el) el.textContent = mmss(left); if (left <= 0) submitExam(true); }, 1000);
}
const mmss = ms => { ms = Math.max(0, ms); const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60; return `${m}:${String(s).padStart(2, '0')}`; };
function chartSVG(c) {
  const W = 520, H = 260, pad = 40, gw = (W - pad * 2) / c.groups.length, cols = ['#7C5CFF', '#FF6FB5', '#2DD4BF'], max = 100;
  let s = `<svg viewBox="0 0 ${W} ${H + 40}" class="chart" role="img" aria-label="${esc(c.title)}"><text x="${W / 2}" y="16" text-anchor="middle" class="ct">${esc(c.title)}</text>`;
  for (let v = 0; v <= max; v += 20) { const y = H - (v / max) * (H - 40); s += `<line x1="${pad}" x2="${W - 10}" y1="${y}" y2="${y}" class="cg"/><text x="${pad - 6}" y="${y + 4}" text-anchor="end" class="cl">${v}</text>`; }
  c.groups.forEach((g, gi) => { const bw = gw / (c.series.length + 1); c.series.forEach(([name, vals], si) => { const v = vals[gi], h = (v / max) * (H - 40), x = pad + gi * gw + bw * (si + 0.5); s += `<rect x="${x}" y="${H - h}" width="${bw - 4}" height="${h}" rx="3" fill="${cols[si]}"/><text x="${x + (bw - 4) / 2}" y="${H - h - 4}" text-anchor="middle" class="cv">${v}</text>`; }); s += `<text x="${pad + gi * gw + gw / 2}" y="${H + 16}" text-anchor="middle" class="cl">${esc(g)}</text>`; });
  c.series.forEach(([name], si) => { s += `<rect x="${pad + si * 120}" y="${H + 26}" width="12" height="12" rx="3" fill="${cols[si]}"/><text x="${pad + si * 120 + 18}" y="${H + 36}" class="cl">${esc(name)}</text>`; });
  return s + '</svg>';
}
function qHTML(q, id, review) {
  const a = EX.ans[id], r = review ? reviewMark(q, a) : '';
  const lock = review ? 'disabled' : '';
  switch (q.t) {
    case 'mcq': return `<div class="eq ${r}"><p class="eqq">${esc(q.q)}</p><div class="eopts">${q.options.map((o, i) => `<button class="eopt ${a === i ? 'sel' : ''} ${review && i === q.answer ? 'ok' : ''}" data-ex="pick" data-q="${id}" data-v="${i}" ${lock}><b>${String.fromCharCode(65 + i)}</b> ${esc(o)}</button>`).join('')}</div>${q.explain && review ? `<p class="note">${esc(q.explain)}</p>` : ''}</div>`;
    case 'tfng': return `<div class="eq ${r}"><p class="eqq">${esc(q.q)}</p><div class="eopts row">${['TRUE', 'FALSE', 'NOT GIVEN'].map(v => `<button class="eopt ${a === v ? 'sel' : ''} ${review && v === q.answer ? 'ok' : ''}" data-ex="pick" data-q="${id}" data-v="${v}" ${lock}>${v}</button>`).join('')}</div></div>`;
    case 'gap': return `<div class="eq ${r}"><label class="eqq" for="g-${id}">${esc(q.q)}</label><input id="g-${id}" class="field gap" data-qi="${id}" value="${esc(a || '')}" ${review ? 'readonly' : ''} autocomplete="off">${review ? `<p class="note">Đáp án: <b>${esc(q.answer[0])}</b></p>` : ''}</div>`;
    case 'write': { const wc = (a || '').trim().split(/\s+/).filter(Boolean).length; return `<div class="eq"><p class="eqq">${esc(q.q)}</p><textarea class="field essay" data-qi="${id}" rows="12" ${review ? 'readonly' : ''} placeholder="Viết bài bằng tiếng Anh tại đây…">${esc(a || '')}</textarea><p class="note wc" id="wc-${id.replace(/\./g, '-')}">${wc} từ · tối thiểu ${q.min}</p></div>`; }
    case 'speak': return `<div class="eq"><p class="eqq">${q.part === 2 ? '<span class="tag">Part 2</span> ' : ''}${esc(q.q)}</p><div class="row-btns">${review ? '' : `<button class="btn ghost sm" data-ex="ask" data-text="${esc(q.q)}">Nghe câu hỏi</button>${CAPS.dictation ? `<button class="btn sm mic" data-ex="mic" data-q="${id}">Nói</button>` : ''}`}</div><textarea class="field" data-qi="${id}" rows="${q.part === 2 ? 6 : 3}" ${review ? 'readonly' : ''} placeholder="${CAPS.dictation ? 'Bấm Nói rồi trả lời, lời nói sẽ hiện ở đây. Bạn cũng có thể gõ.' : 'Trình duyệt này chưa hỗ trợ nhận giọng nói, hãy gõ câu trả lời.'}">${esc(a || '')}</textarea></div>`;
  }
  return '';
}
function reviewMark(q, a) { if (q.t === 'write' || q.t === 'speak') return ''; return isCorrect(q, a) ? 'right' : 'wrong'; }
function isCorrect(q, a) {
  if (q.t === 'mcq') return a === q.answer;
  if (q.t === 'tfng') return a === q.answer;
  if (q.t === 'gap') { const v = String(a || '').trim().toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' '); return q.answer.some(x => x.toLowerCase() === v); }
  return false;
}
function renderExam(review) {
  const T = EX.test, sec = T.sections[EX.si];
  const tabs = T.sections.map((s, i) => `<button class="segb" data-ex="sec" data-v="${i}" aria-pressed="${i === EX.si}">${esc(s.title)}</button>`).join('');
  const body = sec.parts.map((p, pi) => {
    const left = p.passage ? `<div class="passage">${p.passage}</div>` : p.chart ? `<div class="passage">${chartSVG(p.chart)}</div>` : p.audio ? `<div class="audiobox"><button class="btn" data-ex="play" data-p="${EX.si}.${pi}" ${(EX.plays[`${EX.si}.${pi}`] || 0) >= 2 && !review ? 'disabled' : ''}>▶ Phát bài nghe</button><span class="note">Đã nghe ${EX.plays[`${EX.si}.${pi}`] || 0}/2 lần</span>${review ? `<details><summary>Xem lời thoại</summary>${p.audio.map(([s, t]) => `<p><b>${s}:</b> ${esc(t)}</p>`).join('')}</details>` : ''}</div>` : '';
    const qs = p.questions.map((q, qi) => qHTML(q, qid(EX.si, pi, qi), review)).join('');
    return `<section class="epart"><h3 class="ph3">${esc(p.title)}</h3><div class="egrid ${left ? 'two' : ''}">${left}<div class="eqs">${qs}</div></div></section>`;
  }).join('');
  const html = `<div class="exam-top"><div><h2 class="ptitle">${esc(T.title)}</h2><p class="note">${esc(sec.note || '')}</p></div>${review ? '' : `<div class="clock"><small>Thời gian</small><b id="ex-time">${mmss(EX.end - Date.now())}</b></div>`}</div>
    <div class="seg">${tabs}</div>${body}
    <div class="row-btns end exam-foot">${review ? `<button class="btn ghost" data-ex="report">Về bảng điểm</button><button class="btn" data-act="close">Đóng</button>` : `${EX.si > 0 ? `<button class="btn ghost" data-ex="sec" data-v="${EX.si - 1}">← Phần trước</button>` : ''}${EX.si < T.sections.length - 1 ? `<button class="btn ghost" data-ex="sec" data-v="${EX.si + 1}">Phần sau →</button>` : ''}<button class="btn ghost danger" data-ex="quit">Thoát</button><button class="btn gold" data-ex="submit">Nộp bài</button>`}</div>`;
  const keep = $('#modal .panel') ? $('#modal .panel').scrollTop : 0;
  openModal(html, {label: T.title, wide: true, noClose: true});
  $('#modal .panel').classList.add('exam');
  if (EX.keepScroll) $('#modal .panel').scrollTop = keep; EX.keepScroll = false;
}
function playPart(key) {
  const [si, pi] = key.split('.').map(Number), p = EX.test.sections[si].parts[pi];
  if ((EX.plays[key] || 0) >= 2) return;
  EX.plays[key] = (EX.plays[key] || 0) + 1; EX.keepScroll = true; renderExam();
  const voices = {A: 'rounded', B: 'airy', C: 'buttery'};
  if (CAPS.tts) { CAPS.tts.speak(p.audio.map(([s, t]) => ({text: t, voice: voices[s] || 'buttery', language: 'en'})), {rate: 0.95}).catch(e => { if (e && e.code !== 'stopped') fallbackRead(p.audio); }); }
  else fallbackRead(p.audio);
}
function fallbackRead(lines) {
  if (!canSpeak) { toast('Trình duyệt này không đọc được bài nghe.'); return; }
  speechSynthesis.cancel();
  const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
  lines.forEach(([s, t]) => { const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = 0.92; const v = vs[s === 'A' ? 0 : s === 'B' ? 1 : 2] || vs[0]; if (v) u.voice = v; speechSynthesis.speak(u); });
}
let MIC = null;
function toggleMic(id, btn) {
  const D = CAPS.dictation; if (!D) return;
  if (MIC && MIC.id === id) { D.stop().catch(() => {}); return; }
  if (MIC) { MIC.off.forEach(f => f()); D.stop().catch(() => {}); }
  const ta = document.querySelector(`[data-qi="${id}"]`);
  MIC = {id, off: [D.onFinal(({text}) => { ta.value = (ta.value + text).replace(/^\s+/, ''); EX.ans[id] = ta.value; }), D.onState(({state}) => { btn.textContent = state === 'idle' ? 'Nói' : 'Dừng'; btn.classList.toggle('rec', state !== 'idle'); if (state === 'idle' && MIC && MIC.id === id) { MIC.off.forEach(f => f()); MIC = null; } })]};
  D.start({language: 'en'}).catch(e => { toast(e && e.code === 'not_granted' ? 'Bạn chưa cho phép dùng micro, hãy gõ câu trả lời.' : 'Chưa bật được micro, hãy gõ câu trả lời.'); if (MIC) { MIC.off.forEach(f => f()); MIC = null; } btn.textContent = 'Nói'; });
}
document.addEventListener('input', e => {
  const t = e.target; if (!EX || !t.dataset || !t.dataset.qi) return;
  EX.ans[t.dataset.qi] = t.value;
  if (t.classList.contains('essay')) { const el = $('#wc-' + t.dataset.qi.replace(/\./g, '-')); if (el) { const n = t.value.trim().split(/\s+/).filter(Boolean).length; el.textContent = el.textContent.replace(/^\d+/, n); } }
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-ex]'); if (!t || !EX) return;
  const d = t.dataset;
  switch (d.ex) {
    case 'pick': { const [si, pi, qi] = d.q.split('.').map(Number), q = EX.test.sections[si].parts[pi].questions[qi]; EX.ans[d.q] = q.t === 'mcq' ? +d.v : d.v; t.parentElement.querySelectorAll('.eopt').forEach(b => b.classList.toggle('sel', b === t)); return; }
    case 'sec': EX.si = +d.v; return renderExam(EX.done);
    case 'play': return playPart(d.p);
    case 'ask': if (CAPS.tts) CAPS.tts.speak(d.text, {language: 'en'}).catch(() => speak(d.text, true)); else speak(d.text, true); return;
    case 'mic': return toggleMic(d.q, t);
    case 'quit': if (t.dataset.armed) { stopExam(); closeModal(); } else { t.dataset.armed = 1; t.textContent = 'Bấm lần nữa để thoát (mất bài làm)'; } return;
    case 'submit': if (t.dataset.armed) submitExam(false); else { const un = countUnanswered(); t.dataset.armed = 1; t.textContent = un ? `Còn ${un} câu trống, bấm lần nữa để nộp` : 'Bấm lần nữa để nộp'; } return;
    case 'report': return showReport();
    case 'review': EX.si = +d.v || 0; return renderExam(true);
    case 'ai-retry': return gradeAI();
  }
});
function countUnanswered() { let n = 0; EX.test.sections.forEach((s, si) => s.parts.forEach((p, pi) => p.questions.forEach((q, qi) => { const a = EX.ans[qid(si, pi, qi)]; if (a === undefined || a === '') n++; }))); return n; }
function stopExam() { if (EX && EX.timer) clearInterval(EX.timer); try { CAPS.tts && CAPS.tts.stop().catch(() => {}); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {} if (MIC) { CAPS.dictation.stop().catch(() => {}); MIC = null; } }

/* ---------- scoring ---------- */
function submitExam(timeout) {
  if (!EX || EX.done) return; stopExam(); EX.done = true;
  const T = EX.test, R = {sections: {}, kind: T.kind, title: T.title, date: today(), timeout};
  T.sections.forEach((s, si) => {
    let raw = 0, total = 0; const byLv = {};
    s.parts.forEach((p, pi) => p.questions.forEach((q, qi) => {
      if (q.t === 'write' || q.t === 'speak') return;
      total++; const ok = isCorrect(q, EX.ans[qid(si, pi, qi)]); if (ok) raw++;
      if (q.lv) { byLv[q.lv] = byLv[q.lv] || [0, 0]; byLv[q.lv][1]++; if (ok) byLv[q.lv][0]++; }
      if (q.word && S.m[q.word]) { const m = S.m[q.word]; m.m = ok ? Math.min(5, m.m + 1) : Math.max(0, m.m - 1); }
    }));
    const r = {skill: s.skill, raw, total, byLv};
    if (T.kind === 'ielts' && (s.skill === 'listening' || s.skill === 'reading')) r.band = bandFromRaw(raw, total, s.skill);
    if (T.kind === 'toeic') r.score = toeicScale(raw, total);
    if (s.skill === 'writing' || s.skill === 'speaking') r.pending = true;
    R.sections[s.id] = r;
  });
  EX.result = R; finalizeResult(); showReport();
  if (Object.values(R.sections).some(r => r.pending)) gradeAI();
}
function finalizeResult() {
  const R = EX.result, secs = Object.values(R.sections);
  if (R.kind === 'ielts') { const bands = secs.map(s => s.band).filter(b => typeof b === 'number'); R.overall = bands.length ? roundBand(bands.reduce((a, b) => a + b, 0) / bands.length) : null; R.complete = secs.length === 4 && bands.length === 4; }
  if (R.kind === 'toeic') R.overall = secs.reduce((a, s) => a + (s.score || 0), 0);
  if (R.kind === 'placement' || R.kind === 'auto') { const s = secs.reduce((a, x) => [a[0] + x.raw, a[1] + x.total], [0, 0]); R.raw = s[0]; R.total = s[1]; R.pct = Math.round(s[0] / s[1] * 100); }
  if (R.kind === 'placement') {
    const lv = {}; secs.forEach(x => Object.entries(x.byLv).forEach(([k, [a, b]]) => { lv[k] = lv[k] || [0, 0]; lv[k][0] += a; lv[k][1] += b; }));
    let got = null; for (const L of LEVELS) { const [a, b] = lv[L] || [0, 1]; if (a / b >= 0.75) got = L; else break; }
    R.byLevel = lv; R.level = got || 'A1';
  }
}
function recordResult() {
  const R = EX.result; if (R.recorded) return; R.recorded = true;
  S.tests = S.tests || []; S.tests.unshift({kind: R.kind, title: R.title, date: R.date, overall: R.overall, pct: R.pct, level: R.level, sections: Object.fromEntries(Object.entries(R.sections).map(([k, v]) => [k, {band: v.band, score: v.score, raw: v.raw, total: v.total, skill: v.skill}]))});
  S.tests = S.tests.slice(0, 40);
  if (R.kind === 'ielts') { S.bestBand = S.bestBand || {}; for (const v of Object.values(R.sections)) if (typeof v.band === 'number') S.bestBand[v.skill + (v.task ? v.task : '')] = Math.max(S.bestBand[v.skill + (v.task ? v.task : '')] || 0, v.band);
    for (const v of Object.values(R.sections)) if (v.tasks) for (const [k, b] of Object.entries(v.tasks)) S.bestBand['writing' + k] = Math.max(S.bestBand['writing' + k] || 0, b);
    if (R.complete) { S.bestBand.overall = Math.max(S.bestBand.overall || 0, R.overall); if (daysSince(S.monthTest) >= 30) { S.monthTest = today(); giveGems(5, 3, 'bài thi tháng'); const cefr = bandToCEFR(R.overall); if (LEVELS.indexOf(cefr) > LEVELS.indexOf(S.study.level)) { S.study.level = cefr; if (!S.study.unlocked.includes(cefr)) S.study.unlocked.push(cefr); R.promoted = cefr; } } } }
  if (R.kind === 'toeic' && daysSince(S.monthToeic) >= 30) { S.monthToeic = today(); giveGems(5, 2, 'bài thi TOEIC tháng'); }
  if (R.kind === 'placement') {
    const weekly = daysSince(S.weekTest) >= 7; R.official = weekly;
    if (weekly) { S.weekTest = today(); giveGems(3, 1, 'kiểm tra tuần'); giveKey(1, 'kiểm tra tuần'); if (LEVELS.indexOf(R.level) > LEVELS.indexOf(S.study.level)) { S.study.level = R.level; if (!S.study.unlocked.includes(R.level)) S.study.unlocked.push(R.level); R.promoted = R.level; } }
  }
  if (R.kind === 'auto' && R.pct >= 70) { const hours = R.pct >= 90 ? 48 : 24; S.auto = {until: Date.now() + hours * 3600e3, log: {}, hours}; R.autoHours = hours; }
  if (EX.onFinish) try { EX.onFinish(R); } catch (e) {}
  addXP(Math.round((R.pct || 60) / 5)); renderHUD(); markDirty(); saveNow(true);
}

/* ---------- AI grading (Writing & Speaking) ---------- */
async function gradeAI() {
  const R = EX.result, T = EX.test;
  if (!CAPS.sample) { for (const [id, r] of Object.entries(R.sections)) if (r.pending) { r.pending = false; r.band = heuristicBand(id); r.aiNote = 'Ước lượng sơ bộ theo độ dài và độ đa dạng từ vựng. Mở game trong Claude để được chấm chi tiết.'; } finalizeResult(); recordResult(); return showReport(); }
  for (const [sid, r] of Object.entries(R.sections)) {
    if (!r.pending) continue;
    const si = T.sections.findIndex(s => s.id === sid), sec = T.sections[si];
    const items = []; sec.parts.forEach((p, pi) => p.questions.forEach((q, qi) => items.push({q, a: (EX.ans[qid(si, pi, qi)] || '').trim(), p})));
    let prompt;
    if (sec.skill === 'writing') prompt = `You are a strict, experienced IELTS Academic examiner. Grade each task using the official public band descriptors (Task Achievement for Task 1 / Task Response for Task 2, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy). Penalise responses under the word limit. ${items.map((it, i) => `\n\nTASK ${it.q.task}:\n${it.q.q}${it.p.chart ? '\nChart data: ' + JSON.stringify(it.p.chart) : ''}\nCANDIDATE RESPONSE (${it.a.split(/\s+/).filter(Boolean).length} words):\n${it.a || '(no answer)'}`).join('')}\n\nReply with only JSON: {"tasks":[{"task":1,"band":6.0,"TA":6,"CC":6,"LR":6,"GRA":6,"feedback_vi":"2-3 câu nhận xét bằng tiếng Việt","fix":"one improved sentence from the response"}], "overall_vi":"1 câu tổng kết bằng tiếng Việt"}. Bands in 0.5 steps.`;
    else prompt = `You are a strict, experienced IELTS Speaking examiner. Below are transcripts of a candidate's spoken answers (speech-to-text, so ignore punctuation). Grade Fluency and Coherence, Lexical Resource and Grammatical Range and Accuracy from the transcript; pronunciation cannot be judged from text, so leave it out. Very short or empty answers must score low.${items.map(it => `\n\nPART ${it.q.part} QUESTION: ${it.q.q}\nANSWER: ${it.a || '(no answer)'}`).join('')}\n\nReply with only JSON: {"band":6.0,"FC":6,"LR":6,"GRA":6,"feedback_vi":"2-3 câu nhận xét bằng tiếng Việt","better_answer":"a model answer (3-4 sentences) for the Part 2 question"}. Bands in 0.5 steps.`;
    r.aiState = 'busy'; showReport();
    try {
      const j = await CAPS.sample.json(prompt, {cache: false});
      if (sec.skill === 'writing' && j && Array.isArray(j.tasks)) {
        r.ai = j; r.tasks = {}; const t1 = j.tasks.find(t => t.task === 1), t2 = j.tasks.find(t => t.task === 2);
        if (t1) r.tasks[1] = roundBand(+t1.band); if (t2) r.tasks[2] = roundBand(+t2.band);
        r.band = t1 && t2 ? roundBand((r.tasks[1] + 2 * r.tasks[2]) / 3) : roundBand(+(t2 || t1).band);
      } else if (j && typeof j.band === 'number') { r.ai = j; r.band = roundBand(j.band); }
      else throw {code: 'invalid_json'};
      r.pending = false; r.aiState = 'done';
    } catch (e) {
      r.aiState = 'err'; r.aiErr = e && e.code;
      if (e && ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled'].includes(e.code)) { r.pending = false; r.band = heuristicBand(sid); r.aiNote = 'Chưa được phép dùng Claude để chấm, đây là điểm ước lượng sơ bộ.'; }
    }
  }
  finalizeResult();
  if (!Object.values(R.sections).some(r => r.pending)) recordResult();
  showReport();
}
function heuristicBand(sid) {
  const T = EX.test, si = T.sections.findIndex(s => s.id === sid), texts = [];
  T.sections[si].parts.forEach((p, pi) => p.questions.forEach((q, qi) => texts.push([q, EX.ans[qid(si, pi, qi)] || ''])));
  let score = 0; for (const [q, a] of texts) { const w = a.trim().split(/\s+/).filter(Boolean), uniq = new Set(w.map(x => x.toLowerCase())).size, need = q.min || (q.part === 2 ? 120 : 30); score += Math.min(1, w.length / need) * 4 + Math.min(1, uniq / Math.max(1, w.length)) * 2.5; }
  return roundBand(Math.max(2, Math.min(7, score / texts.length)));
}

/* ---------- report ---------- */
function showReport() {
  const R = EX.result, T = EX.test, pend = Object.values(R.sections).some(r => r.pending);
  if (!pend) recordResult();
  let head = '';
  if (R.kind === 'ielts') head = `<div class="score big"><small>Band tổng (ước tính)</small><b>${R.overall != null ? R.overall.toFixed(1) : '…'}</b>${R.complete ? '' : '<span class="note">Chỉ tính các kỹ năng đã làm</span>'}</div>`;
  if (R.kind === 'toeic') head = `<div class="score big"><small>Điểm TOEIC (ước tính)</small><b>${R.overall}</b><span class="note">/ ${Object.keys(R.sections).length * 495}</span></div>`;
  if (R.kind === 'placement') head = `<div class="score big"><small>Trình độ đánh giá được</small><b>${R.level}</b><span class="note">${R.raw}/${R.total} câu đúng (${R.pct}%)</span></div>`;
  if (R.kind === 'auto') head = `<div class="score big ${R.pct >= 70 ? 'pass' : 'fail'}"><small>Điểm bài test Auto Farm</small><b>${R.raw}/${R.total}</b><span class="note">${R.pct}% · cần 70% để mở</span></div>`;
  const cards = Object.entries(R.sections).map(([id, r]) => {
    const sec = T.sections.find(s => s.id === id);
    const val = r.pending ? (r.aiState === 'busy' ? 'Claude đang chấm…' : r.aiState === 'err' ? 'Chưa chấm được' : 'Đang chấm…') : r.band != null ? `Band ${r.band.toFixed(1)}` : r.score != null ? `${r.score} điểm` : `${r.raw}/${r.total}`;
    let extra = r.total ? `<span class="note">${r.raw}/${r.total} câu đúng</span>` : '';
    if (r.ai && sec.skill === 'writing') extra = r.ai.tasks.map(t => `<div class="ai"><b>Task ${t.task}: Band ${(+t.band).toFixed(1)}</b> <small>TA ${t.TA} · CC ${t.CC} · LR ${t.LR} · GRA ${t.GRA}</small><p>${esc(t.feedback_vi || '')}</p>${t.fix ? `<p class="note">Câu gợi ý: <i>${esc(t.fix)}</i></p>` : ''}</div>`).join('') + (r.ai.overall_vi ? `<p class="note">${esc(r.ai.overall_vi)}</p>` : '');
    if (r.ai && sec.skill === 'speaking') extra = `<div class="ai"><small>FC ${r.ai.FC} · LR ${r.ai.LR} · GRA ${r.ai.GRA} (không chấm phát âm vì chỉ có bản ghi chữ)</small><p>${esc(r.ai.feedback_vi || '')}</p>${r.ai.better_answer ? `<p class="note">Câu trả lời mẫu: <i>${esc(r.ai.better_answer)}</i></p>` : ''}</div>`;
    if (r.aiNote) extra += `<p class="note">${esc(r.aiNote)}</p>`;
    if (r.aiState === 'err' && r.pending) extra += `<div class="row-btns"><button class="btn sm" data-ex="ai-retry">Chấm lại bằng Claude</button></div>`;
    return `<div class="rcard"><span>${esc(sec.title)}</span><b>${val}</b>${extra}${r.total ? `<button class="btn ghost sm" data-ex="review" data-v="${T.sections.indexOf(sec)}">Xem lại đáp án</button>` : ''}</div>`;
  }).join('');
  let tail = '';
  if (R.kind === 'placement') tail = `<div class="lvbars">${LEVELS.map(L => { const [a, b] = R.byLevel[L] || [0, 0]; return `<div><span>${L}</span><i style="--w:${b ? a / b * 100 : 0}%"></i><small>${a}/${b}</small></div>`; }).join('')}</div>` + (R.official === undefined ? '' : R.official ? (R.promoted ? `<div class="fb good"><strong>Lên trình độ!</strong> Hệ thống đã tự nâng bạn lên <b>${R.promoted}</b>. Thưởng 3 ngọc lục bảo và 1 kim cương.</div>` : `<div class="fb good"><strong>Đã ghi nhận bài kiểm tra tuần.</strong> Trình độ đánh giá: ${R.level}. ${LEVELS.indexOf(R.level) < LEVELS.indexOf(S.study.level) ? `Bạn đang học ${S.study.level}, có thể hạ xuống ${R.level} trong mục Học tập nếu thấy khó.` : 'Giữ trình độ hiện tại.'}</div>`) : `<div class="fb miss"><strong>Bài luyện tập.</strong> Bài kiểm tra tuần chính thức (tự nâng trình độ, có thưởng) mở lại sau ${Math.ceil(7 - daysSince(S.weekTest))} ngày.</div>`);
  if (R.kind === 'auto') tail = R.pct >= 70 ? `<div class="fb good"><strong>Đã mở Auto Farm ${R.autoHours || (R.pct >= 90 ? 48 : 24)} giờ!</strong> Nông trại sẽ tự tưới, nhổ cỏ, thu hoạch, gieo lại hạt và chăm vật nuôi, kể cả khi bạn tắt game.</div>` : `<div class="fb miss"><strong>Chưa đạt.</strong> Cần đúng ít nhất 11/15 câu. Ôn lại từ vựng trong mục Học tập rồi thử lại.</div>`;
  if (R.promoted && R.kind === 'ielts') tail += `<div class="fb good"><strong>Lên trình độ!</strong> Band ${R.overall} tương đương ${R.promoted}, hệ thống đã nâng trình độ học của bạn.</div>`;
  openModal(`<h2 class="ptitle">Kết quả${R.timeout ? ' (hết giờ)' : ''}</h2><p class="psub">${esc(T.title)}</p>${head}<div class="rcards">${cards}</div>${tail}<div class="row-btns end"><button class="btn ghost" data-act="tests">Trung tâm thi</button><button class="btn" data-act="close">Xong</button></div>`, {label: 'Kết quả', wide: true});
}

/* ---------- AI-generated fresh tests ---------- */
async function aiTest(kind) {
  if (!CAPS.sample) { toast('Cần mở game trong Claude để tạo đề mới bằng AI.'); return; }
  const lv = S.study.level, band = IELTS_BAND[lv] || 'Band 6.0';
  const specs = {
    ielts_r: `Write an ORIGINAL IELTS Academic Reading passage (about 450 words, 5 paragraphs labelled A-E, a current real-world topic) for a learner targeting ${band}, with 13 questions: 5 TRUE/FALSE/NOT GIVEN, 4 multiple choice (4 options), 4 sentence completion (answer of no more than two words copied from the passage). Reply with only JSON: {"title":"...","passage":"paragraphs separated by \\n\\n","questions":[{"t":"tfng","q":"...","answer":"TRUE|FALSE|NOT GIVEN"},{"t":"mcq","q":"...","options":["...","...","...","..."],"answer":0},{"t":"gap","q":"... ______ ...","answer":["word"]}]}`,
    ielts_l: `Write an ORIGINAL IELTS Listening Part 3 style conversation between two university students (speakers A and B, 14-18 turns, a realistic study task) for a learner targeting ${band}, with 10 questions: 5 multiple choice (3 options) and 5 note completion (one word or a number, said clearly in the conversation). Reply with only JSON: {"title":"...","script":[{"s":"A","text":"..."}],"questions":[{"t":"mcq","q":"...","options":["...","...","..."],"answer":0},{"t":"gap","q":"...","answer":["word"]}]}`,
    toeic_5: `Write 20 ORIGINAL TOEIC Part 5 (Incomplete Sentences) questions in a realistic business context, mixing grammar (tenses, word forms, prepositions, conjunctions, relative pronouns) and vocabulary, difficulty around TOEIC 600-850. Reply with only JSON: {"title":"TOEIC Part 5","questions":[{"t":"mcq","q":"sentence with ____","options":["...","...","...","..."],"answer":0,"explain":"giải thích ngắn bằng tiếng Việt"}]}`,
    toeic_7: `Write ORIGINAL TOEIC Part 7 material: one business email and one advertisement or notice (about 150 words each) and 8 multiple-choice questions (4 options) about them, including at least one inference question. Reply with only JSON: {"title":"TOEIC Part 7","passage":"text, sections separated by \\n\\n","questions":[{"t":"mcq","q":"...","options":["...","...","...","..."],"answer":0}]}`
  };
  openModal(`<h2 class="ptitle">Claude đang soạn đề mới…</h2><p class="psub">Thường mất 20–60 giây. Đề được viết mới, không lấy từ đề thi thật.</p><div class="loadbar"><i style="width:60%"></i></div>`, {label: 'Đang tạo đề', noClose: true});
  try {
    const j = await CAPS.sample.json(specs[kind], {cache: false});
    const qs = (j && Array.isArray(j.questions) ? j.questions : []).filter(q => q && q.q && ((q.t === 'mcq' && Array.isArray(q.options) && Number.isInteger(q.answer) && q.answer < q.options.length) || (q.t === 'tfng' && ['TRUE', 'FALSE', 'NOT GIVEN'].includes(q.answer)) || (q.t === 'gap' && Array.isArray(q.answer) && q.answer.length)));
    if (qs.length < 5) throw {code: 'invalid_json'};
    qs.forEach(q => { if (q.t === 'gap') q.answer = q.answer.map(a => String(a).toLowerCase()); });
    const isL = kind === 'ielts_l', isT = kind.startsWith('toeic');
    const part = {title: j.title || 'Đề mới', questions: qs};
    if (isL && Array.isArray(j.script)) part.audio = j.script.filter(x => x && x.text).map(x => [x.s === 'B' ? 'B' : 'A', String(x.text)]);
    if (j.passage) part.passage = String(j.passage).split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join('');
    const test = {id: 'ai-' + kind, kind: isT ? 'toeic' : 'ielts', title: `${isT ? 'TOEIC' : 'IELTS'} · ${j.title || 'Đề mới'} (Claude soạn)`, sections: [{id: isL ? 'L' : 'R', skill: isL ? 'listening' : 'reading', title: isL ? 'Listening' : 'Reading', minutes: isL ? 15 : 20, note: 'Đề do Claude soạn mới cho bạn.', parts: [part]}]};
    closeModal(); openExam(test);
  } catch (e) {
    openModal(`<h2 class="ptitle">Chưa tạo được đề</h2><p class="psub">${e && e.code === 'not_granted' ? 'Bạn chưa cho phép game dùng Claude.' : e && e.code === 'rate_limited' ? 'Bạn dùng Claude hơi nhiều, thử lại sau ít phút.' : 'Claude trả về đề chưa đúng định dạng. Thử lại nhé.'}</p><div class="row-btns"><button class="btn" data-act="tests">Quay lại</button></div>`, {label: 'Lỗi'});
  }
}

/* ---------- Test centre ---------- */
function openTests() {
  const wk = daysSince(S.weekTest), auto = autoActive();
  const hist = (S.tests || []).slice(0, 8);
  openModal(`<h2 class="ptitle">Trung tâm thi</h2><p class="psub">Đang học <b>${esc(TRACKS[S.study.track].vi)}</b>, trình độ <b>${S.study.level}</b>. <button class="linkbtn" data-act="study">Đổi trình độ / chuyên ngành</button></p>
    <div class="tcards">
      <div class="tcard"><b>Kiểm tra tổng thể hằng tuần</b><p>24 câu từ A1 đến C1. Hệ thống tự đánh giá và nâng trình độ cho bạn. Thưởng 3 ngọc lục bảo và 1 kim cương.</p><small>${wk >= 7 ? 'Bài chính thức tuần này đã mở.' : `Bài chính thức mở lại sau ${Math.ceil(7 - wk)} ngày, giờ chỉ làm luyện tập.`}</small><button class="btn" data-act="t-place">Làm bài</button></div>
      <div class="tcard"><b>Bài test mở Auto Farm</b><p>15 câu ở trình độ hiện tại, chấm điểm rõ ràng. Đạt 70% mở 24 giờ, đạt 90% mở 48 giờ tự chăm nông trại.</p><small>${auto ? `Đang chạy, còn ${fmt((S.auto.until - Date.now()) / 1000)}.` : 'Chưa bật.'}</small><button class="btn gold" data-act="t-auto">Làm bài test</button></div>
      <div class="tcard"><b>IELTS Academic (đề mẫu)</b><p>Listening 20 câu, Reading 16 câu, Writing 2 task, Speaking 3 phần. Writing và Speaking do Claude chấm theo 4 tiêu chí.</p><small>Làm đủ 4 kỹ năng mỗi tháng: thưởng 5 ngọc, 3 kim cương và có thể được nâng trình độ.</small><div class="row-btns"><button class="btn" data-act="t-ielts" data-v="L,R,W,S">Thi đủ 4 kỹ năng</button>${['L', 'R', 'W', 'S'].map(k => `<button class="btn ghost sm" data-act="t-ielts" data-v="${k}">${{L: 'Nghe', R: 'Đọc', W: 'Viết', S: 'Nói'}[k]}</button>`).join('')}</div></div>
      <div class="tcard"><b>TOEIC Listening & Reading (đề mẫu)</b><p>Part 2–4 (15 câu nghe), Part 5–7 (22 câu đọc), quy ra điểm 5–495 mỗi phần.</p><div class="row-btns"><button class="btn" data-act="t-toeic" data-v="L,R">Thi cả hai phần</button><button class="btn ghost sm" data-act="t-toeic" data-v="L">Nghe</button><button class="btn ghost sm" data-act="t-toeic" data-v="R">Đọc</button></div></div>
      <div class="tcard"><b>Đề mới do Claude soạn</b><p>Mỗi lần bấm là một đề hoàn toàn mới theo trình độ của bạn, làm bao nhiêu cũng được.</p>${CAPS.sample ? '' : '<small>Cần mở game trong Claude để dùng.</small>'}<div class="row-btns"><button class="btn ghost sm" data-act="t-ai" data-v="ielts_r" ${CAPS.sample ? '' : 'disabled'}>IELTS Reading</button><button class="btn ghost sm" data-act="t-ai" data-v="ielts_l" ${CAPS.sample ? '' : 'disabled'}>IELTS Listening</button><button class="btn ghost sm" data-act="t-ai" data-v="toeic_5" ${CAPS.sample ? '' : 'disabled'}>TOEIC Part 5</button><button class="btn ghost sm" data-act="t-ai" data-v="toeic_7" ${CAPS.sample ? '' : 'disabled'}>TOEIC Part 7</button></div></div>
      <div class="tcard road"><b>Lộ trình IELTS</b><p>5 chặng từ Band 4.0 đến 7.0+, tự theo dõi tiến độ từ vựng, thử thách và bài thi.</p><button class="btn" data-act="roadmap">Xem lộ trình</button></div>
    </div>
    <h3 class="ph3">Lịch sử điểm</h3>${hist.length ? `<ul class="hist">${hist.map(h => `<li><span>${h.date}</span><b>${esc(h.title)}</b><em>${h.kind === 'ielts' ? (h.overall != null ? 'Band ' + h.overall.toFixed(1) : '') : h.kind === 'toeic' ? h.overall + ' điểm' : h.kind === 'placement' ? h.level + ' · ' + h.pct + '%' : h.pct + '%'}</em></li>`).join('')}</ul>` : '<p class="empty">Chưa có bài thi nào.</p>'}`, {label: 'Trung tâm thi', wide: true});
}

/* ---------- IELTS roadmap ---------- */
const ROAD = [
  {name: 'Khởi động', band: 'Band 4.0–4.5', reward: {em: 5, di: 1}, tasks: [{k: 'words', lv: 'B1', n: 10, t: 'Thuộc 10 từ IELTS Band 5 (3 sao trở lên)'}, {k: 'placement', n: 1, t: 'Làm 1 bài kiểm tra tổng thể'}, {k: 'challenge', n: 2, t: 'Hoàn thành 2 thử thách IELTS ở Công viên'}]},
  {name: 'Nền tảng', band: 'Band 5.0', reward: {em: 8, di: 2}, tasks: [{k: 'words', lv: 'B1', n: 20, t: 'Thuộc cả 20 từ Band 5'}, {k: 'band', s: 'listening', min: 5, t: 'Listening đạt Band 5.0'}, {k: 'band', s: 'reading', min: 5, t: 'Reading đạt Band 5.0'}]},
  {name: 'Bứt phá', band: 'Band 5.5–6.0', reward: {em: 10, di: 3}, tasks: [{k: 'words', lv: 'B2', n: 15, t: 'Thuộc 15 từ Band 6'}, {k: 'band', s: 'writing1', min: 5.5, t: 'Writing Task 1 đạt Band 5.5'}, {k: 'band', s: 'reading', min: 6, t: 'Reading đạt Band 6.0'}, {k: 'challenge', n: 7, t: 'Hoàn thành 7 thử thách IELTS'}]},
  {name: 'Vững vàng', band: 'Band 6.5', reward: {em: 12, di: 4}, tasks: [{k: 'words', lv: 'B2', n: 30, t: 'Thuộc 30 từ Band 6'}, {k: 'band', s: 'writing2', min: 6, t: 'Writing Task 2 đạt Band 6.0'}, {k: 'band', s: 'speaking', min: 6, t: 'Speaking đạt Band 6.0'}, {k: 'band', s: 'listening', min: 6.5, t: 'Listening đạt Band 6.5'}]},
  {name: 'Về đích', band: 'Band 7.0+', reward: {em: 20, di: 8, item: 'hat_grad'}, tasks: [{k: 'words', lv: 'C1', n: 15, t: 'Thuộc 15 từ Band 7+'}, {k: 'band', s: 'overall', min: 7, t: 'Thi đủ 4 kỹ năng, Band tổng 7.0'}]}
];
function taskProgress(t) {
  if (t.k === 'words') { const ws = TRACK_WORDS.ielts[t.lv] || []; return [ws.filter(w => S.m[w.key] && S.m[w.key].m >= 3).length, t.n]; }
  if (t.k === 'placement') return [(S.tests || []).filter(x => x.kind === 'placement').length, t.n];
  if (t.k === 'challenge') return [S.ieltsCount || 0, t.n];
  if (t.k === 'band') return [(S.bestBand || {})[t.s] || 0, t.min];
  return [0, 1];
}
const taskDone = t => { const [a, b] = taskProgress(t); return a >= b; };
function openRoadmap() {
  S.road = S.road || {claimed: []};
  const cur = ROAD.findIndex((st, i) => !S.road.claimed.includes(i));
  openModal(`<h2 class="ptitle">Lộ trình IELTS</h2><p class="psub">Đi lần lượt từng chặng. Hoàn thành nhiệm vụ để nhận ngọc, kim cương và phần thưởng cuối là <b>Mũ tốt nghiệp</b>. Gợi ý mỗi tuần: học 10 từ, làm 3 thử thách IELTS và 1 bài thi đề mẫu.</p>
    <ol class="road">${ROAD.map((st, i) => { const done = S.road.claimed.includes(i), all = st.tasks.every(taskDone), active = i === cur;
      return `<li class="${done ? 'done' : active ? 'active' : 'lock'}"><div class="rhead"><span class="rnum">${i + 1}</span><div><b>${st.name}</b><small>${st.band}</small></div><span class="rrew">${gemIcon('em')}${st.reward.em} ${gemIcon('di')}${st.reward.di}${st.reward.item ? ' + Mũ tốt nghiệp' : ''}</span></div>
      ${active || done ? `<ul class="rtasks">${st.tasks.map(t => { const [a, b] = taskProgress(t), ok = a >= b; return `<li class="${ok ? 'ok' : ''}"><i></i><span>${esc(t.t)}</span><em>${t.k === 'band' ? (a ? a.toFixed(1) : '—') + ' / ' + b.toFixed(1) : Math.min(a, b) + '/' + b}</em></li>`; }).join('')}</ul>` : ''}
      ${active ? `<div class="row-btns"><button class="btn gold sm" data-act="road-claim" data-v="${i}" ${all ? '' : 'disabled'}>Nhận thưởng chặng ${i + 1}</button><button class="btn ghost sm" data-act="tests">Vào trung tâm thi</button></div>` : ''}</li>`; }).join('')}</ol>`, {label: 'Lộ trình IELTS', wide: true});
}
function claimRoad(i) {
  const st = ROAD[i]; S.road = S.road || {claimed: []};
  if (S.road.claimed.includes(i) || !st.tasks.every(taskDone)) return;
  S.road.claimed.push(i); giveGems(st.reward.em, st.reward.di, `hoàn thành chặng ${st.name}`); giveKey(1, 'lộ trình IELTS');
  if (st.reward.item && !S.owned.includes(st.reward.item)) { S.owned.push(st.reward.item); S.look.hat = st.reward.item; toast('Bạn nhận được <b>Mũ tốt nghiệp</b>! Đã đội lên đầu.'); }
  sfx('level'); markDirty(); saveNow(true); openRoadmap();
}

/* ---------- Auto farm ---------- */
const autoActive = () => S && S.auto && S.auto.until > Date.now();
function autoStep(t) {
  const L = S.auto.log;
  S.plots.forEach(p => {
    if (!p.u) return;
    if (p.weed) { p.weed = false; L.weed = (L.weed || 0) + 1; }
    if (p.c && p.p >= 1) { const c = CROP[p.c]; S.inv[c.id] = (S.inv[c.id] || 0) + 1; addXP(Math.ceil(c.xp / 2)); L.harvest = (L.harvest || 0) + 1;
      const id = p.c; Object.assign(p, {c: null, p: 0, w: 0, weed: false, hw: false, f: 0});
      if (S.seeds[id] > 0) { S.seeds[id]--; p.c = id; L.plant = (L.plant || 0) + 1; } }
    if (p.c && p.p < 1 && t >= p.w) { p.w = t + CROP[p.c].time * 550; L.water = (L.water || 0) + 1; }
  });
  S.animals.forEach(a => {
    if (!a) return; const A = ANIMAL[a.t];
    if (a.st === 'producing' && t >= a.r) a.st = 'ready';
    if (a.st === 'ready') { const P2 = PRODUCTS[A.product]; S.inv[P2.id] = (S.inv[P2.id] || 0) + 1; a.st = 'hungry'; L.collect = (L.collect || 0) + 1; }
    if (a.st === 'hungry') { a.st = 'producing'; a.r = t + A.time * 1000; L.feed = (L.feed || 0) + 1; }
  });
}
// simulate growth and auto care from `from` to `to` in 5-minute steps (works for offline time too)
function autoSimulate(from, to) {
  let t = from; const STEP = 300000;
  while (t < to) {
    autoStep(t);
    const nt = Math.min(to, t + STEP);
    for (const p of S.plots) { if (!p.u || !p.c || p.weed || p.p >= 1) continue; const grow = Math.max(0, Math.min(nt, p.w) - t); if (grow > 0) p.p = Math.min(1, p.p + grow / (CROP[p.c].time * 1000)); }
    t = nt;
  }
  autoStep(to);
}
// called from tick(): runs the automation between S.last and now (capped at the pass expiry)
function autoTick(now) {
  if (!S.auto || !S.auto.until || S.auto.until <= S.last) return false;
  const end = Math.min(now, S.auto.until); autoSimulate(S.last, end); S.last = end;
  if (end >= S.auto.until && !S.auto.ended) { S.auto.ended = true; const sm = autoSummary(); setTimeout(() => toast(`Auto Farm đã hết giờ. ${sm ? 'Đã làm: ' + sm + '.' : ''} Làm bài test để bật lại.`, 6000), 500); }
  return true;
}
function autoSummary() {
  const L = (S.auto && S.auto.log) || {}, parts = [['water', 'lần tưới'], ['weed', 'lần nhổ cỏ'], ['harvest', 'lần thu hoạch'], ['plant', 'lần gieo lại'], ['feed', 'lần cho ăn'], ['collect', 'sản phẩm thu từ chuồng']].filter(([k]) => L[k]);
  return parts.length ? parts.map(([k, v]) => `${L[k]} ${v}`).join(', ') : '';
}

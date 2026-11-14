/* ===================== ENGLISH LEVEL = THE CHARACTER'S LEVEL ===================== */
// The character has no XP level. Its level is the certified English level (S.cefr: A1..C1), which only goes up by passing a test.
// Unlocks keep their old numeric "lvl" requirement and map onto the five English levels:
//   lvl 1-3 -> A1, 4-7 -> A2, 8-12 -> B1, 13-18 -> B2, 19+ -> C1.   S.lvl is kept equal to the highest number the current level opens.
const TIER_MAX = [3, 7, 12, 18, 99];
const tierOf = n => (n || 1) <= 3 ? 0 : n <= 7 ? 1 : n <= 12 ? 2 : n <= 18 ? 3 : 4;
const needTag = n => `Cần ${LEVELS[tierOf(n)]}`;
const lvIdx = () => Math.max(0, LEVELS.indexOf((S && S.cefr) || 'A1'));
function syncLvl() { S.lvl = TIER_MAX[lvIdx()]; }

// how ready the player is for the next level: 70% from mastered words of the current level, 30% from recent practice
// rules for leaving each level (index = current level): share of its words at 3 stars, answers needed, test length, pass mark
const LV_RULES = [{words: 0.6, ans: 30, n: 15, pass: 11}, {words: 0.7, ans: 60, n: 18, pass: 13}, {words: 0.75, ans: 100, n: 20, pass: 15}, {words: 0.85, ans: 160, n: 22, pass: 17}];
const lvRule = () => LV_RULES[Math.min(LV_RULES.length - 1, lvIdx())];
const READY_ANS = 30;
function readiness() {
  const i = lvIdx(); if (i >= LEVELS.length - 1) return {pct: 1, max: true, known: 0, target: 0, ans: 0};
  const ws = levelWords(LEVELS[i], S.study.track), target = Math.max(4, Math.ceil(ws.length * lvRule().words)), need = lvRule().ans;
  const known = ws.filter(w => S.m[w.key] && S.m[w.key].m >= 3).length, ans = Math.min(need, S.lvAns || 0);
  const pct = Math.min(1, known / target) * 0.7 + (ans / need) * 0.3;
  return {pct: Math.min(1, pct), known: Math.min(known, target), target, ans, need, next: LEVELS[i + 1]};
}
const isReady = () => { const r = readiness(); return !r.max && r.pct >= 1; };
const LVUP_COOLDOWN = 20 * 60000;
function lvCooldown() { return Math.max(0, (S.lvFailAt || 0) + LVUP_COOLDOWN - Date.now()); }

// called after every answered question
function lvNoteAnswer() {
  S.lvAns = (S.lvAns || 0) + 1;
  if (isReady() && S.lvPrompted !== S.cefr) {
    S.lvPrompted = S.cefr;
    setTimeout(() => { sfx('level'); toast(`Bạn đã sẵn sàng thi lên <b>${readiness().next}</b>! Bấm vào huy hiệu trình độ ở góc trái để làm bài test.`, 6000); }, 900);
  }
}

function buildLevelUp() {
  const next = LEVELS[lvIdx() + 1], cur = S.cefr, qs = [];
  let pool = shuf(levelWords(next, S.study.track)); if (pool.length < 10) pool = pool.concat(shuf(TRACK_WORDS.general[next] || []).filter(w => !pool.includes(w)));
  const rule = lvRule(), nv = rule.n - 5, prev = shuf(levelWords(cur, S.study.track));
  pool.slice(0, nv).forEach(w => qs.push(vocabQ(w, next)));
  if (pool.length < nv) prev.slice(0, nv - pool.length).forEach(w => qs.push(vocabQ(w, next)));
  shuf(GRAMMAR[next]).slice(0, 5).forEach(([q, o, a]) => qs.push(mcqFrom(q, o, a, {lv: next})));
  return {id: 'levelup', kind: 'levelup', title: `Bài test lên trình độ ${next}`, target: next, pass: rule.pass, sections: [{id: 'V', skill: 'grammar', title: 'Từ vựng & Ngữ pháp', minutes: 10,
    note: `${qs.length} câu ở trình độ ${next}. Đúng từ ${rule.pass}/${qs.length} câu là lên ${next} và mở khoá đồ, cây trồng, vật nuôi của trình độ này. Bạn đang ở ${cur}.`, parts: [{title: 'Chọn đáp án đúng', questions: shuf(qs)}]}]};
}
function startLevelUp() {
  if (!isReady()) { openLevel(); return; }
  if (lvCooldown()) { toast(`Hãy ôn thêm ${Math.ceil(lvCooldown() / 60000)} phút nữa rồi thi lại.`); return; }
  openExam(buildLevelUp());
}
// raise the certified level (from a level-up test, the weekly test or a monthly IELTS mock)
function promoteTo(lv, why) {
  const to = LEVELS.indexOf(lv), from = lvIdx(); if (to <= from) return false;
  S.cefr = lv; syncLvl(); S.lvAns = 0; S.lvPrompted = null;
  if (LEVELS.indexOf(S.study.level) < to) S.study.level = lv;
  for (let i = 0; i <= to; i++) if (!S.study.unlocked.includes(LEVELS[i])) S.study.unlocked.push(LEVELS[i]);
  const opened = [...CROPS.filter(c => !c.rare && tierOf(c.lvl) > from && tierOf(c.lvl) <= to).map(c => c.vi), ...ANIMALS.filter(a => tierOf(a.lvl) > from && tierOf(a.lvl) <= to).map(a => a.vi)];
  const items = FASHION.filter(f => f.price > 0 && tierOf(f.lvl) > from && tierOf(f.lvl) <= to).length + HAIR_ITEMS.filter(h => tierOf(h.lvl) > from && tierOf(h.lvl) <= to).length;
  giveGems(5 * (to - from), 2 * (to - from), why || `lên trình độ ${lv}`); giveKey(to - from, `lên trình độ ${lv}`);
  queueFx({kind: 'spark', who: 'player'}); sfx('level');
  setTimeout(() => toast(`<b>Lên trình độ ${lv}!</b> Mở khoá ${opened.length ? opened.slice(0, 6).join(', ') + (opened.length > 6 ? '…' : '') + ' và ' : ''}${items} món đồ, kiểu tóc mới.`, 6000), 400);
  renderHUD(); markDirty(); saveNow(true);
  return true;
}

function openLevel() {
  const r = readiness(), cd = lvCooldown();
  const hist = (S.tests || []).filter(t => t.kind === 'levelup' || t.kind === 'placement').slice(0, 5);
  openModal(`<h2 class="ptitle">Trình độ tiếng Anh</h2>
    <div class="lvhero"><span class="lvbig">${S.cefr}</span><div><b>${LEVEL_VI[S.cefr]}</b><small>${S.study.track === 'ielts' ? IELTS_BAND[S.cefr] : 'Cấp độ của nhân vật chính là trình độ tiếng Anh của bạn.'}</small></div></div>
    <ol class="lvpath">${LEVELS.map((L, i) => `<li class="${i < lvIdx() ? 'done' : i === lvIdx() ? 'cur' : ''}"><b>${L}</b><small>${LEVEL_VI[L]}</small></li>`).join('')}</ol>
    ${r.max ? '<div class="fb good"><strong>Trình độ cao nhất!</strong> Hãy thử đề IELTS đủ 4 kỹ năng trong Trung tâm thi.</div>' : `
    <h3 class="ph3">Tiến độ lên ${r.next}</h3>
    <div class="lvprog"><i style="--w:${Math.round(r.pct * 100)}%"></i><span>${Math.round(r.pct * 100)}%</span></div>
    <ul class="rtasks"><li class="${r.known >= r.target ? 'ok' : ''}"><i></i><span>Thuộc từ vựng ${S.cefr} (3 sao trở lên)</span><em>${r.known}/${r.target}</em></li>
    <li class="${r.ans >= r.need ? 'ok' : ''}"><i></i><span>Trả lời câu hỏi khi chăm nông trại, học, mua đồ</span><em>${r.ans}/${r.need}</em></li></ul>
    <p class="note">Khi đủ 100%, game sẽ báo bạn đã sẵn sàng. Bài test có ${lvRule().n} câu ở trình độ ${r.next}, đúng từ ${lvRule().pass} câu là lên cấp. Trình độ càng cao càng cần thuộc nhiều từ, luyện nhiều câu hơn và bài test khó hơn. Lên cấp mở khoá cây trồng, vật nuôi, đồ và kiểu tóc của trình độ mới, kèm ngọc, kim cương và chìa khoá rương.</p>
    <div class="row-btns"><button class="btn gold" data-act="lv-test" ${!isReady() || cd ? 'disabled' : ''}>${cd ? `Thi lại sau ${Math.ceil(cd / 60000)} phút` : isReady() ? `Thi lên ${r.next}` : `Chưa sẵn sàng (${Math.round(r.pct * 100)}%)`}</button><button class="btn ghost" data-act="t-place">Kiểm tra xếp lớp</button><button class="btn ghost" data-act="study">Học từ vựng</button></div>`}
    ${hist.length ? `<h3 class="ph3">Các bài test gần đây</h3><ul class="hist">${hist.map(h => `<li><span>${h.date}</span><b>${esc(h.title)}</b><em>${h.pct}%</em></li>`).join('')}</ul>` : ''}`, {label: 'Trình độ tiếng Anh', wide: true});
}
